@echo off
echo ========================================
echo Fixing Frontend TypeScript Issues
echo ========================================
echo.

echo [1/3] Stopping any running processes...
npx kill-port 3000

echo.
echo [2/3] Clearing Next.js cache...
cd ..\frontend
if exist .next rmdir /s /q .next
echo Cache cleared!

echo.
echo [3/3] Starting fresh dev server...
start "ChainCompass Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo Fix Applied!
echo ========================================
echo.
echo The frontend is starting fresh...
echo Wait 10-20 seconds, then open:
echo http://localhost:3000
echo.
echo TypeScript errors should be gone!
echo.
pause
