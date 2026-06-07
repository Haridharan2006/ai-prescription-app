@echo off

echo Starting Backend...

start cmd /k "cd backend && npm install && npm run dev"

timeout /t 5

echo Starting Frontend...

start cmd /k "cd frontend && npm install && npm run dev"

echo Application Started!