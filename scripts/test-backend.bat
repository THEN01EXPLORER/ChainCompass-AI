@echo off
echo Testing ChainCompass AI Backend...
echo.

echo [1/2] Testing health endpoint...
curl -s http://localhost:8000/health
echo.
echo.

echo [2/2] Testing quote endpoint...
curl -s "http://localhost:8000/api/v1/quote?fromChain=POL&toChain=ARB&fromToken=USDC&toToken=USDC&fromAmount=100000000"
echo.
echo.

echo Test complete!
pause
