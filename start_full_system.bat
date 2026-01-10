@echo off
echo Starting Reseller Command Center System...
echo 1. Launching Server...
start "RCC Server" start_server.bat

echo 2. Waiting for server to initialize...
timeout /t 5 >nul

echo 3. Launching Dashboard...
start "RCC Dashboard" start_app.bat

echo.
echo System is running!
echo Please keep the two new windows open.
pause
