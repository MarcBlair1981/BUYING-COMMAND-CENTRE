@echo off
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo Error: npm install failed. Do you have Node.js installed?
    echo.
    pause
    exit /b
)

echo.
echo Starting application...
call npm run dev
pause
