@echo off
echo Starting Billboard Detection System Services...
echo.

echo [1/4] Starting MongoDB and Redis...
docker-compose up -d mongodb redis

echo [2/4] Waiting for databases to initialize...
timeout /t 10

echo [3/4] Starting AI Service...
cd ai-service
start "AI Service" python main.py
cd ..

echo [4/4] Starting Backend API...
cd backend-api
start "Backend API" npm run dev
cd ..

echo.
echo ✅ All services started!
echo.
echo Services running at:
echo - Backend API: http://localhost:5000
echo - AI Service: http://localhost:8000
echo - MongoDB: mongodb://localhost:27017
echo - Redis: redis://localhost:6379
echo.
echo To start the web dashboard: cd web-dashboard && npm start
echo To start mobile development: cd mobile-app && npm start
echo.
pause
