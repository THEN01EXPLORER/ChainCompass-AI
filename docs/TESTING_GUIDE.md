# 🧪 Testing Guide - ChainCompass AI

Complete testing strategy for ensuring ChainCompass AI works correctly before deployment.

## Test Levels

### 1. Unit Tests (Backend)

Test individual functions in isolation.

**Files**: `tests/test_backend.py`

**Run Tests**:
```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_backend.py -v

# Run with coverage
pytest tests/ --cov=./ --cov-report=html
```

**What's Tested**:
- ✅ Quote parsing from LI.FI responses
- ✅ Route scoring algorithm
- ✅ Input validation (addresses, amounts, chains)
- ✅ Rate limiting logic

**Example**:
```bash
$ pytest tests/test_backend.py::TestValidation::test_valid_ethereum_address -v
test_backend.py::TestValidation::test_valid_ethereum_address PASSED
```

---

### 2. Integration Tests (API)

Test API endpoints with real/mocked external services.

**Setup Mocking**:
```bash
pip install pytest-mock responses
```

**Create `tests/test_api.py`**:
```python
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    """Test health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_get_chains():
    """Test chains endpoint"""
    response = client.get("/api/v1/chains")
    assert response.status_code == 200
    data = response.json()
    assert len(data["chains"]) > 0
    assert data["chains"][0]["id"] == 1
```

**Run Integration Tests**:
```bash
pytest tests/test_api.py -v
```

---

### 3. End-to-End Tests (E2E)

Test complete user flows in the browser.

**Setup Playwright**:
```bash
pip install pytest-playwright
playwright install
```

**Create `tests/test_e2e.py`**:
```python
import pytest
from playwright.sync_api import sync_playwright

@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        yield browser
        browser.close()

def test_homepage_loads(browser):
    """Test homepage loads correctly"""
    page = browser.new_page()
    page.goto("http://localhost:3000")
    
    # Check for main elements
    assert page.title() == "ChainCompass AI - Cross-Chain DeFi Analytics"
    assert page.locator("text=ChainCompass AI").is_visible()
    
    page.close()

def test_wallet_connect_button_visible(browser):
    """Test wallet connect button is visible"""
    page = browser.new_page()
    page.goto("http://localhost:3000")
    
    button = page.locator("button:has-text('Connect Wallet')")
    assert button.is_visible()
    
    page.close()
```

**Run E2E Tests**:
```bash
# Start frontend and backend first
npm run dev  # in frontend/
uvicorn main:app --reload  # in root

# In another terminal
pytest tests/test_e2e.py -v
```

---

## Manual Testing Checklist

### Frontend

- [ ] **Page Load**
  - [ ] Home page loads without errors
  - [ ] Navigation bar is visible
  - [ ] All pages accessible (Home, Analytics, History, Settings)

- [ ] **Wallet Connection**
  - [ ] "Connect Wallet" button is visible
  - [ ] Click button opens wallet connection modal
  - [ ] Can connect MetaMask (if available)
  - [ ] Connected address displays in header
  - [ ] Disconnect button works

- [ ] **Swap Interface**
  - [ ] Can select chains and tokens
  - [ ] Can enter amount
  - [ ] "Find Best Route" button works
  - [ ] Quote displays correctly (output, fee, time)
  - [ ] "Execute Swap" button appears when logged in
  - [ ] Proper error messages on invalid inputs

- [ ] **Transaction History**
  - [ ] History page loads
  - [ ] Shows message when wallet not connected
  - [ ] Shows previous transactions when wallet connected
  - [ ] Transaction status shows correctly (pending/completed/failed)
  - [ ] Can click transaction to view details

- [ ] **Error Handling**
  - [ ] Network errors show proper error message
  - [ ] Invalid wallet address shows error
  - [ ] Invalid amount shows error
  - [ ] Timeout shows proper message

### Backend

- [ ] **Health Check**
  ```bash
  curl http://localhost:8000/health
  # Expected: {"status":"ok","version":"2.0.0",...}
  ```

- [ ] **API Endpoints**
  ```bash
  # Get chains
  curl http://localhost:8000/api/v1/chains
  
  # Get tokens
  curl http://localhost:8000/api/v1/tokens
  
  # Get quote
  curl "http://localhost:8000/api/v1/quote?fromChain=1&toChain=137&fromToken=ETH&toToken=USDC&fromAmount=1000000000000000000&fromAddress=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  ```

- [ ] **Rate Limiting**
  ```bash
  # Make 51 requests rapidly - should hit rate limit
  for i in {1..51}; do
    curl "http://localhost:8000/api/v1/quote?..." &
  done
  # Last request should get 429 (Too Many Requests)
  ```

- [ ] **Database**
  ```bash
  # Check SQLite file exists
  ls -la chaincompass.db
  
  # Verify transaction history is saved
  sqlite3 chaincompass.db "SELECT * FROM transactions LIMIT 1;"
  ```

---

## Performance Testing

### Load Testing with `locust`

```bash
pip install locust
```

**Create `locustfile.py`**:
```python
from locust import HttpUser, task, between

class QuoteUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def get_quote(self):
        params = {
            "fromChain": "1",
            "toChain": "137",
            "fromToken": "ETH",
            "toToken": "USDC",
            "fromAmount": "1000000000000000000",
        }
        self.client.get("/api/v1/quote", params=params)
    
    @task
    def get_chains(self):
        self.client.get("/api/v1/chains")
```

**Run Load Test**:
```bash
locust -f locustfile.py --host=http://localhost:8000
# Open http://localhost:8089
```

**Targets**:
- ✅ 100 concurrent users
- ✅ Response time < 2s (quote endpoint)
- ✅ Response time < 500ms (chains endpoint)

---

## Security Testing

### CORS Validation
```bash
# Test CORS headers
curl -H "Origin: http://malicious.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS http://localhost:8000/api/v1/quote -v

# Should NOT return Access-Control-Allow-Origin for malicious.com
```

### Input Validation
```bash
# Test invalid address
curl "http://localhost:8000/api/v1/quote?...&fromAddress=invalid"
# Expected: 400 Bad Request

# Test SQL injection attempt
curl "http://localhost:8000/api/v1/quote?...&fromToken=ETH'; DROP TABLE transactions;--"
# Expected: 400 Bad Request (validated by Pydantic)
```

---

## Testing Before Deployment

### Pre-Deployment Checklist

```bash
# 1. Run all unit tests
pytest tests/ -v

# 2. Check code quality
pip install pylint
pylint main.py validation.py

# 3. Test locally
uvicorn main:app --reload
# In another terminal
cd frontend && npm run dev

# 4. Manual testing (see checklist above)

# 5. Test production build
cd frontend
npm run build
npm start

# 6. Verify environment variables
echo $OPENAI_API_KEY  # Should be set
echo $LIFI_API_KEY    # Should be set

# 7. Final health check
curl http://localhost:8000/health
curl http://localhost:3000
```

---

## Continuous Integration (GitHub Actions)

### Create `.github/workflows/tests.yml`

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt pytest
      - run: pytest tests/ -v

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm run lint
      - run: cd frontend && npm run build
```

---

## Troubleshooting Failed Tests

| Error | Cause | Solution |
|-------|-------|----------|
| `ModuleNotFoundError: No module named 'main'` | Wrong working directory | Run from repo root |
| `Connection refused` | Backend not running | Start backend first |
| `CORS error` | Domain not in allowlist | Update `allowed_origins` in main.py |
| `Database locked` | Concurrent write attempts | Use PostgreSQL for production |
| `Rate limit exceeded` | Test hitting limit | Increase limits or space out requests |
| `Timeout waiting for connection` | LI.FI API down | Check https://status.li.fi |

---

## Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user flows (connect wallet, swap, history)
- **Manual Testing**: All features + error cases

---

## Next Steps

1. ✅ Run unit tests: `pytest tests/ -v`
2. ✅ Manual testing on localhost
3. ✅ Deploy to staging (Render/Fly preview)
4. ✅ Run E2E tests on staging
5. ✅ Deploy to production
6. ⬜ Monitor in production (logs, errors, metrics)

---

**Happy testing! 🧪**
