@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   FoodFlow Protocol - One-Click Start   
echo ========================================

:: Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

:: Auto-setup .env if missing
if not exist "backend\.env" (
    echo [INFO] .env not found. Creating default configuration...
    copy "backend\.env.example" "backend\.env" >nul
)

:: Install Backend Deps if missing
if not exist "backend\node_modules\" (
    echo [INFO] Backend dependencies missing. Installing...
    cd backend && call npm install && cd ..
)

:: Auto-setup Database if missing or migration needed
if not exist "backend\prisma\dev.db" (
    echo [INFO] Database not found. Initializing...
    cd backend
    call npx prisma generate
    call npx prisma migrate dev --name init
    call node prisma/seed.js
    cd ..
) else (
    echo [INFO] Existing database found.
    cd backend && call npx prisma generate && cd ..
)

:: Install Frontend Deps if missing
if not exist "frontend\node_modules\" (
    echo [INFO] Frontend dependencies missing. Installing...
    cd frontend && call npm install && cd ..
)

echo [SUCCESS] Everything is ready. Starting servers...

:: Start Backend
start "FoodFlow Backend" cmd /k "cd backend && npm start"

:: Start Frontend
start "FoodFlow Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo   Backend and Frontend are launching...
echo   Please wait for the link to appear in the windows.
echo ========================================================
pause

