"""
Unit tests for ChainCompass AI backend
Run with: pytest tests/ -v
"""
import pytest
from main import parse_quote, calculate_route_score
from validation import validate_ethereum_address, validate_amount, validate_chain_id


class TestQuoteParsing:
    """Test quote parsing from LI.FI response"""
    
    def test_parse_valid_quote(self):
        """Test parsing a valid quote response"""
        mock_quote = {
            "estimate": {
                "executionDuration": 120,
                "toAmountUSD": "500",
                "fromAmountUSD": "100",
                "feeCosts": [
                    {"name": "Gas", "amountUSD": "2.50"},
                    {"name": "Protocol", "amountUSD": "1.00"},
                ]
            },
            "toolDetails": {
                "name": "0x Protocol"
            }
        }
        
        result = parse_quote(mock_quote)
        
        assert result["provider"] == "0x Protocol"
        assert result["time_seconds"] == 120
        assert result["fees_usd"] == 3.50
        assert result["output_usd"] == 500.0
        assert result["gas_cost_usd"] == 2.50

    def test_parse_quote_missing_fields(self):
        """Test parsing quote with missing optional fields"""
        mock_quote = {
            "estimate": {
                "executionDuration": 60,
                "toAmountUSD": "100",
                "fromAmountUSD": "50",
                "feeCosts": []
            },
            "toolDetails": {}
        }
        
        result = parse_quote(mock_quote)
        
        assert result["provider"] == "N/A"
        assert result["fees_usd"] == 0
        assert result["gas_cost_usd"] == 0

    def test_calculate_route_score(self):
        """Test route scoring"""
        from main import QuoteSummary
        
        quote = QuoteSummary(
            summary="Test route",
            provider="Test",
            time_seconds=60,
            fees_usd=2.0,
            output_usd=100.0,
            price_impact=0.5
        )
        
        score = calculate_route_score(quote)
        
        assert score > 0
        assert isinstance(score, float)


class TestValidation:
    """Test input validation functions"""
    
    def test_valid_ethereum_address(self):
        """Test valid Ethereum address"""
        valid_address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
        assert validate_ethereum_address(valid_address) is True

    def test_invalid_ethereum_address_format(self):
        """Test invalid Ethereum address formats"""
        invalid_addresses = [
            "0x123",  # Too short
            "not_an_address",  # No 0x prefix
            "0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",  # Invalid hex
            "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA9604",  # Wrong length
        ]
        for addr in invalid_addresses:
            assert validate_ethereum_address(addr) is False

    def test_valid_amount(self):
        """Test valid amounts"""
        assert validate_amount("100") is True
        assert validate_amount("0.5") is True
        assert validate_amount("1000000") is True  # Max allowed

    def test_invalid_amount(self):
        """Test invalid amounts"""
        assert validate_amount("-100") is False  # Below minimum
        assert validate_amount("0.0001") is False  # Below minimum
        assert validate_amount("10000001") is False  # Above maximum
        assert validate_amount("not_a_number") is False

    def test_valid_chain_id(self):
        """Test valid chain IDs"""
        allowed = [1, 137, 42161, 10, 8453]
        for chain_id in allowed:
            assert validate_chain_id(chain_id, allowed) is True

    def test_invalid_chain_id(self):
        """Test invalid chain IDs"""
        allowed = [1, 137, 42161, 10, 8453]
        assert validate_chain_id(999, allowed) is False
        assert validate_chain_id(-1, allowed) is False


class TestRateLimiting:
    """Test rate limiting functionality"""
    
    def test_rate_limiter_allow_within_limit(self):
        """Test that requests within limit are allowed"""
        from validation import RateLimiter
        
        limiter = RateLimiter(max_requests=5, window_seconds=60)
        identifier = "test_user_1"
        
        for i in range(5):
            assert limiter.is_allowed(identifier) is True

    def test_rate_limiter_reject_over_limit(self):
        """Test that requests over limit are rejected"""
        from validation import RateLimiter
        
        limiter = RateLimiter(max_requests=2, window_seconds=60)
        identifier = "test_user_2"
        
        assert limiter.is_allowed(identifier) is True
        assert limiter.is_allowed(identifier) is True
        assert limiter.is_allowed(identifier) is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
