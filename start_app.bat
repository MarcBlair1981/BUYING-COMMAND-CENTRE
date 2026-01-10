@echo off
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting application...
call npm run dev
pause
