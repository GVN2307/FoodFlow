#!/bin/bash

# FoodFlow Protocol - Universal Start Script for Mac/Linux

echo "🍃 Starting FoodFlow Protocol..."

# Function to handle exit
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

echo "🚀 Starting Backend on http://localhost:8000..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
    npx prisma generate
fi
npm start &
BACKEND_PID=$!
cd ..

echo "💻 Starting Frontend on http://localhost:5173..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ App is running! Open http://localhost:5173"
echo "Press Ctrl+C to stop."

wait $BACKEND_PID $FRONTEND_PID
