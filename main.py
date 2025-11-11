import os
import json
import asyncio
from typing import Optional

import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from pydantic import SecretStr, BaseModel, Field
from cachetools import TTLCache
from tenacity import AsyncRetrying, stop_after_attempt, wait_exponential, retry_if_exception_type

# --- 1. Load and Validate Environment Variables ---
# This loads the .env file at the start of the application.
load_dotenv()

# We immediately get the API keys from the environment.
LIFI_API_KEY = os.getenv("LIFI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# This is a critical check. If the keys are not found, the server will stop
# with a clear error message. This prevents it from running in a broken state.
if not LIFI_API_KEY or not OPENAI_API_KEY:
    raise ValueError("CRITICAL ERROR: Make sure LIFI_API_KEY and OPENAI_API_KEY are set in your .env file or environment.")

print("✅ API keys and environment variables loaded successfully.")


# --- 2. Initialize Application and AI Components ---

# Create an instance of the FastAPI class, which is our backend server.
app = FastAPI(
    title="ChainCompass AI API",
    description="AI-powered cross-chain DeFi route optimization",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local dev and deployed frontend
allowed_origins = [
    "http://localhost",
    "http://localhost:3000",  # Next.js frontend
    "http://localhost:8501",
    "http://127.0.0.1:3000",  # Next.js frontend
    "http://127.0.0.1:8501",
    "https://chaincompass-ai-theno1explorer.streamlit.app",
    "*"  # Allow all origins for development (remove in production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Enable gzip compression for faster responses
app.add_middleware(GZipMiddleware, minimum_size=500)

# Initialize the OpenAI model we want to use (gpt-4o-mini for speed and cost).
# We wrap the API key in SecretStr to resolve the type warning.
llm = ChatOpenAI(model="gpt-4o-mini", api_key=SecretStr(OPENAI_API_KEY))

# This is the prompt template for our AI. It defines the AI's persona and instructions.
# The fields in {curly_braces} will be filled in with data from the LI.FI quote.
prompt = ChatPromptTemplate.from_template(
    "You are a helpful crypto assistant called ChainCompass. "
    "Summarize the following best route for a user in a friendly, single sentence. "
    "Mention the provider, the estimated time, the final amount in USD, and the fees. "
    "Route details: Provider={provider}, Time={time_seconds}s, Fees of approximately ${fees_usd:.2f} USD, resulting in a final amount of ${output_usd:.2f} USD."
)

# This creates a "chain" that links the prompt and the AI model together.
# When we call this chain, the data flows from the prompt to the model automatically.
chain = prompt | llm


# --- 3. Helper Functions ---

def parse_quote(quote_data):
    """
    This function takes the large, complex JSON response from LI.FI
    and extracts only the key pieces of information we care about.
    """
    estimate = quote_data.get("estimate", {})
    tool_details = quote_data.get("toolDetails", {})
    provider_name = tool_details.get("name", "N/A")
    execution_time_seconds = estimate.get("executionDuration", 0)
    final_output_usd = estimate.get("toAmountUSD", "0")
    input_usd = estimate.get("fromAmountUSD", "0")
    
    # Calculate the total fees by adding up all fee costs.
    total_fees_usd = 0
    gas_cost_usd = 0
    for fee in estimate.get("feeCosts", []):
        fee_amount = float(fee.get("amountUSD", "0"))
        total_fees_usd += fee_amount
        if fee.get("name", "").lower() == "gas":
            gas_cost_usd = fee_amount
    
    # Calculate price impact
    input_val = float(input_usd)
    output_val = float(final_output_usd)
    price_impact = 0.0
    if input_val > 0:
        price_impact = ((input_val - output_val - total_fees_usd) / input_val) * 100
        
    # Return a clean, simple dictionary with our extracted data.
    summary = {
        "provider": provider_name,
        "time_seconds": execution_time_seconds,
        "fees_usd": total_fees_usd,
        "output_usd": output_val,
        "input_usd": input_val,
        "price_impact": price_impact,
        "gas_cost_usd": gas_cost_usd
    }
    return summary


# --- 4. API Endpoints ---

@app.get("/")
def read_root():
    """A simple endpoint to confirm the server is running."""
    return {"message": "Welcome to the ChainCompass API!"}

@app.get("/health")
async def health() -> dict:
    """Health check endpoint with system status"""
    return {
        "status": "ok",
        "version": "2.0.0",
        "services": {
            "lifi": "connected",
            "openai": "connected",
            "cache": f"{len(quote_cache)}/{quote_cache.maxsize} entries"
        }
    }

@app.get("/api/v1/chains")
async def get_supported_chains():
    """Get list of supported blockchain networks"""
    chains = [
        {"id": 1, "name": "Ethereum", "symbol": "ETH", "logo": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg"},
        {"id": 137, "name": "Polygon", "symbol": "MATIC", "logo": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/polygon.svg"},
        {"id": 42161, "name": "Arbitrum", "symbol": "ARB", "logo": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/arbitrum.svg"},
        {"id": 10, "name": "Optimism", "symbol": "OP", "logo": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/optimism.svg"},
        {"id": 8453, "name": "Base", "symbol": "BASE", "logo": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/base.svg"},
    ]
    return {"chains": chains, "count": len(chains)}

@app.get("/api/v1/tokens")
async def get_supported_tokens():
    """Get list of commonly supported tokens"""
    tokens = [
        {"symbol": "ETH", "name": "Ethereum", "decimals": 18},
        {"symbol": "USDC", "name": "USD Coin", "decimals": 6},
        {"symbol": "USDT", "name": "Tether", "decimals": 6},
        {"symbol": "WBTC", "name": "Wrapped Bitcoin", "decimals": 8},
        {"symbol": "DAI", "name": "Dai Stablecoin", "decimals": 18},
    ]
    return {"tokens": tokens, "count": len(tokens)}

@app.get("/api/v1/stats")
async def get_api_stats():
    """Get API usage statistics"""
    global request_count, cache_hits, cache_misses
    
    hit_rate = 0.0
    if request_count > 0:
        hit_rate = (cache_hits / request_count) * 100
    
    return {
        "cache": {
            "size": len(quote_cache),
            "max_size": quote_cache.maxsize,
            "utilization": f"{(len(quote_cache) / quote_cache.maxsize) * 100:.1f}%"
        },
        "requests": {
            "total": request_count,
            "cache_hits": cache_hits,
            "cache_misses": cache_misses,
            "hit_rate": f"{hit_rate:.1f}%"
        },
        "performance": {
            "cache_ttl": "60s",
            "max_retries": 3,
            "timeout": "15s"
        }
    }

# Shared HTTP client with connection pooling
async_client: Optional[httpx.AsyncClient] = None

@app.on_event("startup")
async def on_startup() -> None:
    global async_client
    async_client = httpx.AsyncClient(
        base_url="https://li.quest",
        timeout=httpx.Timeout(15.0, read=15.0, connect=10.0),
        headers={
            "accept": "application/json",
            "x-lifi-api-key": LIFI_API_KEY,
        },
        limits=httpx.Limits(max_connections=100, max_keepalive_connections=20),
        transport=httpx.AsyncHTTPTransport(retries=0)
    )

@app.on_event("shutdown")
async def on_shutdown() -> None:
    global async_client
    if async_client is not None:
        await async_client.aclose()
        async_client = None

# In-memory TTL cache for quotes
quote_cache: TTLCache = TTLCache(maxsize=1000, ttl=60)

# Request tracking
request_count = 0
cache_hits = 0
cache_misses = 0

# Request/Response models
class QuoteRequest(BaseModel):
    fromChain: str = Field(..., min_length=1, max_length=10)
    toChain: str = Field(..., min_length=1, max_length=10)
    fromToken: str = Field(..., min_length=2, max_length=12)
    toToken: str = Field(..., min_length=2, max_length=12)
    fromAmount: str = Field(..., pattern=r"^\d{1,30}$")
    fromAddress: Optional[str] = Field(
        default="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
    )

class QuoteSummary(BaseModel):
    summary: str
    provider: Optional[str] = None
    time_seconds: Optional[int] = None
    fees_usd: Optional[float] = None
    output_usd: Optional[float] = None
    price_impact: Optional[float] = None
    gas_cost_usd: Optional[float] = None

class ChainInfo(BaseModel):
    id: int
    name: str
    logo: Optional[str] = None
    
class TokenInfo(BaseModel):
    symbol: str
    name: str
    decimals: int
    address: Optional[str] = None

class RouteStep(BaseModel):
    tool: str
    from_chain: str
    to_chain: str
    from_token: str
    to_token: str
    estimated_time: int

class DetailedQuote(BaseModel):
    summary: str
    provider: str
    time_seconds: int
    fees_usd: float
    output_usd: float
    input_usd: float
    price_impact: float
    gas_cost_usd: float
    route_steps: list[RouteStep]
    from_chain_info: ChainInfo
    to_chain_info: ChainInfo
    from_token_info: TokenInfo
    to_token_info: TokenInfo

@app.get("/api/v1/quote", response_model=QuoteSummary)
async def get_lifi_quote(
    fromChain: str = Query(..., min_length=1, max_length=10),
    toChain: str = Query(..., min_length=1, max_length=10),
    fromToken: str = Query(..., min_length=2, max_length=12),
    toToken: str = Query(..., min_length=2, max_length=12),
    fromAmount: str = Query(..., pattern=r"^\d{1,30}$"),
    fromAddress: Optional[str] = Query("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
):
    """
    Fetch LI.FI quote (pooled async client + TTL cache + retries) and summarize via LLM.
    """
    global async_client
    if async_client is None:
        raise HTTPException(status_code=503, detail="HTTP client not ready")

    req = QuoteRequest(
        fromChain=fromChain,
        toChain=toChain,
        fromToken=fromToken,
        toToken=toToken,
        fromAmount=fromAmount,
        fromAddress=fromAddress,
    )

    global request_count, cache_hits, cache_misses
    request_count += 1
    
    cache_key = (req.fromChain, req.toChain, req.fromToken, req.toToken, req.fromAmount, req.fromAddress)

    if cache_key in quote_cache:
        cache_hits += 1
        raw_quote_data = quote_cache[cache_key]
    else:
        cache_misses += 1
        async def fetch() -> dict:
            resp = await async_client.get("/v1/quote", params=req.model_dump())
            resp.raise_for_status()
            return resp.json()

        try:
            async for attempt in AsyncRetrying(
                reraise=True,
                stop=stop_after_attempt(3),
                wait=wait_exponential(multiplier=0.5, min=0.5, max=4),
                retry=retry_if_exception_type((httpx.ConnectError, httpx.ReadTimeout, httpx.RemoteProtocolError))
            ):
                with attempt:
                    raw_quote_data = await fetch()
            quote_cache[cache_key] = raw_quote_data
        except httpx.HTTPStatusError as err:
            detail = err.response.text if err.response is not None else str(err)
            status = err.response.status_code if err.response is not None else 502
            raise HTTPException(status_code=status, detail=f"LI.FI error: {detail}")
        except (httpx.ConnectError, httpx.ReadTimeout, httpx.RemoteProtocolError) as err:
            raise HTTPException(status_code=504, detail=f"Upstream timeout: {str(err)}")
        except Exception as err:
            raise HTTPException(status_code=502, detail=f"Upstream failure: {str(err)}")

    clean_summary = parse_quote(raw_quote_data)
    # Offload blocking LLM call to thread executor to avoid blocking event loop
    ai_response = await asyncio.get_event_loop().run_in_executor(None, chain.invoke, clean_summary)
    ai_summary = ai_response.content

    return QuoteSummary(
        summary=ai_summary,
        provider=clean_summary.get("provider"),
        time_seconds=clean_summary.get("time_seconds"),
        fees_usd=clean_summary.get("fees_usd"),
        output_usd=clean_summary.get("output_usd"),
        price_impact=clean_summary.get("price_impact"),
        gas_cost_usd=clean_summary.get("gas_cost_usd"),
    )

@app.post("/api/v1/compare")
async def compare_routes(routes: list[QuoteRequest]):
    """
    Compare multiple swap routes and return the best option
    """
    if len(routes) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 routes can be compared at once")
    
    results = []
    for route in routes:
        try:
            # Get quote for each route
            quote = await get_lifi_quote(
                fromChain=route.fromChain,
                toChain=route.toChain,
                fromToken=route.fromToken,
                toToken=route.toToken,
                fromAmount=route.fromAmount,
                fromAddress=route.fromAddress
            )
            results.append({
                "route": route.model_dump(),
                "quote": quote.model_dump(),
                "score": calculate_route_score(quote)
            })
        except Exception as e:
            results.append({
                "route": route.model_dump(),
                "error": str(e),
                "score": 0
            })
    
    # Sort by score (higher is better)
    results.sort(key=lambda x: x.get("score", 0), reverse=True)
    
    return {
        "routes": results,
        "best_route": results[0] if results else None,
        "comparison_count": len(results)
    }

def calculate_route_score(quote: QuoteSummary) -> float:
    """
    Calculate a score for a route based on multiple factors
    Higher score = better route
    """
    score = 0.0
    
    # Output amount (higher is better)
    if quote.output_usd:
        score += quote.output_usd * 10
    
    # Fees (lower is better)
    if quote.fees_usd:
        score -= quote.fees_usd * 20
    
    # Time (faster is better)
    if quote.time_seconds:
        score -= quote.time_seconds * 0.1
    
    # Price impact (lower is better)
    if quote.price_impact:
        score -= abs(quote.price_impact) * 5
    
    return max(score, 0)

@app.get("/api/v1/quote/detailed")
async def get_detailed_quote(
    fromChain: str = Query(...),
    toChain: str = Query(...),
    fromToken: str = Query(...),
    toToken: str = Query(...),
    fromAmount: str = Query(...),
    fromAddress: Optional[str] = Query("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
):
    """
    Get detailed quote with full route information
    """
    global async_client
    if async_client is None:
        raise HTTPException(status_code=503, detail="HTTP client not ready")

    req = QuoteRequest(
        fromChain=fromChain,
        toChain=toChain,
        fromToken=fromToken,
        toToken=toToken,
        fromAmount=fromAmount,
        fromAddress=fromAddress,
    )

    # Fetch from LI.FI
    try:
        resp = await async_client.get("/v1/quote", params=req.model_dump())
        resp.raise_for_status()
        raw_quote_data = resp.json()
    except httpx.HTTPStatusError as err:
        detail = err.response.text if err.response is not None else str(err)
        raise HTTPException(status_code=err.response.status_code, detail=f"LI.FI error: {detail}")
    except Exception as err:
        raise HTTPException(status_code=502, detail=f"Upstream failure: {str(err)}")

    # Parse the data
    clean_summary = parse_quote(raw_quote_data)
    
    # Get AI summary
    ai_response = await asyncio.get_event_loop().run_in_executor(None, chain.invoke, clean_summary)
    
    # Extract route steps
    steps = []
    for step in raw_quote_data.get("includedSteps", []):
        steps.append(RouteStep(
            tool=step.get("tool", "unknown"),
            from_chain=step.get("action", {}).get("fromChainId", ""),
            to_chain=step.get("action", {}).get("toChainId", ""),
            from_token=step.get("action", {}).get("fromToken", {}).get("symbol", ""),
            to_token=step.get("action", {}).get("toToken", {}).get("symbol", ""),
            estimated_time=step.get("estimate", {}).get("executionDuration", 0)
        ))
    
    return {
        "summary": ai_response.content,
        "provider": clean_summary.get("provider"),
        "time_seconds": clean_summary.get("time_seconds"),
        "fees_usd": clean_summary.get("fees_usd"),
        "output_usd": clean_summary.get("output_usd"),
        "input_usd": clean_summary.get("input_usd"),
        "price_impact": clean_summary.get("price_impact"),
        "gas_cost_usd": clean_summary.get("gas_cost_usd"),
        "route_steps": [step.model_dump() for step in steps],
        "raw_data": raw_quote_data  # Include full data for advanced users
    }

