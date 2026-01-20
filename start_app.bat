@echo off
echo Starting FoodFlow Protocol...

:: Auto-setup .env if missing
if not exist "backend\.env" (
    echo [INFO] .env not found. Creating default configuration...
    copy "backend\.env.example" "backend\.env" >nul
)

:: Auto-setup Database if missing
if not exist "backend\prisma\dev.db" (
    echo [INFO] Database not found. Initializing...
    cd backend
    call npm install
    call npx prisma migrate dev --name init
    call node prisma/seed.js
    cd ..
)

:: Start Backend
start "FoodFlow Backend" cmd /k "cd backend && npm start"

:: Start Frontend
start "FoodFlow Frontend" cmd /k "cd frontend && npm run dev"

echo Backend and Frontend are launching in separate windows...
echo Please wait for the browser link to appear in the Frontend window.
pause
