@echo off
SETLOCAL EnableDelayedExpansion

title FoodFlow Protocol - Automated Setup

:: Get the directory where the script is located
SET "ROOT_DIR=%~dp0"
CD /D "%ROOT_DIR%"

echo.
echo ========================================================
echo   FoodFlow Protocol: One-Click Launch ^& Repair
echo ========================================================
echo.

:: 1. Check Node.js
echo [INFO] Checking environment...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! 
    echo Please install it from: https://nodejs.org/
    pause
    exit /b
)

:: 2. Setup Backend Environment
echo [1/3] Preparing Backend (the brain)...
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo     - Created .env file for you.
    ) else (
        echo DATABASE_URL="file:./dev.db" > "backend\.env"
        echo JWT_SECRET="dev_secret_keys_FoodFlow" >> "backend\.env"
        echo     - Created default configuration.
    )
)

:: Use pushd for reliable directory switching
pushd backend

:: Check if core modules are actually functional
if not exist "node_modules\express\package.json" (
    echo     - Backend modules missing or broken. Running repair...
    call npm install --no-audit --no-fund
)

echo     - Syncing Database...
call npx prisma generate >nul 2>&1

if not exist "prisma\dev.db" (
    echo     - Database not found. Building initial data...
    call npx prisma migrate dev --name init --skip-generate
    call node prisma/seed.js
)
popd

:: 3. Frontend Dependencies
echo [2/3] Preparing Frontend (the interface)...
pushd frontend
if not exist "node_modules\vite\package.json" (
    echo     - Frontend modules missing or broken. Running repair...
    call npm install --no-audit --no-fund
)
popd

:: 4. Launching
echo [3/3] Starting servers...
echo.
echo [SUCCESS] App is launching in two separate windows!
echo.
echo  - Frontend: http://localhost:5173
echo  - Backend:  http://localhost:8001
echo.
echo  - TIP: Keep those windows open while using the app.
echo        To stop the app, just close this window or the others.
echo.

:: Use start /D to launch with correct working directory
start "FoodFlow Backend API" /D "%ROOT_DIR%backend" cmd /C "npm start"
start "FoodFlow Frontend Web" /D "%ROOT_DIR%frontend" cmd /C "npm run dev"

echo ========================================================
echo   Launch Complete. Press any key to close this window.
echo ========================================================
pause >nul
