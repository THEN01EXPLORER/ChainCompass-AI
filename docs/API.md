# API Documentation

## Base URL
```
http://localhost:8000
```

## Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "version": "2.0.0",
  "services": {
    "lifi": "connected",
    "openai": "connected",
    "cache": "0/1000 entries"
  }
}
```

### Get Swap Quote
```http
GET /api/v1/quote?fromChain=137&toChain=42161&fromToken=USDC&toToken=USDC&fromAmount=100000000
```

**Parameters:**
- `fromChain` - Source chain ID (e.g., 137 for Polygon)
- `toChain` - Destination chain ID
- `fromToken` - Source token symbol
- `toToken` - Destination token symbol
- `fromAmount` - Amount in smallest unit (wei)

**Response:**
```json
{
  "summary": "AI-generated summary...",
  "provider": "LI.FI",
  "time_seconds": 85,
  "fees_usd": 2.5,
  "output_usd": 97.5,
  "price_impact": 0.5,
  "gas_cost_usd": 1.2
}
```

### Get Supported Chains
```http
GET /api/v1/chains
```

### Get Supported Tokens
```http
GET /api/v1/tokens
```

### Get API Statistics
```http
GET /api/v1/stats
```

### Get Detailed Quote
```http
GET /api/v1/quote/detailed?[same params as quote]
```

## Interactive Documentation
Visit http://localhost:8000/docs for Swagger UI
