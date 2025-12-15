"""
Rate limiting and validation middleware for ChainCompass API
"""
from collections import defaultdict
from datetime import datetime, timedelta
import re

class RateLimiter:
    """Simple token bucket rate limiter"""
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)
    
    def is_allowed(self, identifier: str) -> bool:
        """Check if request is allowed for identifier (IP/address)"""
        now = datetime.utcnow()
        cutoff = now - timedelta(seconds=self.window_seconds)
        
        # Clean old requests
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if req_time > cutoff
        ]
        
        # Check limit
        if len(self.requests[identifier]) >= self.max_requests:
            return False
        
        # Add request
        self.requests[identifier].append(now)
        return True

# Global rate limiters
quote_limiter = RateLimiter(max_requests=50, window_seconds=60)  # 50/min per address
tx_limiter = RateLimiter(max_requests=10, window_seconds=60)  # 10/min per address

def validate_ethereum_address(address: str) -> bool:
    """Validate Ethereum address format"""
    return bool(re.match(r'^0x[a-fA-F0-9]{40}$', address))

def validate_chain_id(chain_id: int, allowed_chains: list) -> bool:
    """Validate chain ID is in allowed list"""
    return chain_id in allowed_chains

def validate_amount(amount: str, min_amount: float = 0.001, max_amount: float = 1000000) -> bool:
    """Validate swap amount"""
    try:
        val = float(amount)
        return min_amount <= val <= max_amount
    except:
        return False
