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
if not exist "backend\node_modules\prisma\" (
    echo [INFO] Backend dependencies missing or incomplete. Installing...
    pushd backend
    call npm install
    popd
)

:: Auto-setup Database if missing or migration needed
if not exist "backend\prisma\dev.db" (
    echo [INFO] Database not found. Initializing...
    pushd backend
    call npm run build
    call npx prisma migrate dev --name init
    call npm run seed
    popd
) else (
    echo [INFO] Existing database found.
    pushd backend
    call npm run build
    popd
)

:: Install Frontend Deps if missing or incomplete
set REINSTALL_FRONTEND=0
if not exist "frontend\node_modules\vite\" set REINSTALL_FRONTEND=1

if !REINSTALL_FRONTEND! equ 1 (
    echo [INFO] Frontend dependencies missing or incomplete. Installing...
    pushd frontend
    call npm install
    popd
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

