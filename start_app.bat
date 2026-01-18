@echo off
echo Starting FoodFlow Protocol...

:: Start Backend
start "FoodFlow Backend" cmd /k "cd backend && npm start"

:: Start Frontend
start "FoodFlow Frontend" cmd /k "cd frontend && npm run dev"

echo Backend and Frontend are launching in separate windows...
echo Please wait for the browser link to appear in the Frontend window.
pause
