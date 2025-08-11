@echo off
setlocal enabledelayedexpansion

REM Billboard Detection System - Development Setup Script (Windows)
REM TechNova Competition Project

echo 🚀 Setting up Billboard Detection System...
echo =====================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js (v18 or higher) first.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.11+ first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!
echo.

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist uploads mkdir uploads
if not exist ai-models mkdir ai-models
if not exist temp-images mkdir temp-images
if not exist logs mkdir logs

REM Copy environment file
if not exist .env (
    echo 📝 Creating environment file...
    copy .env.example .env
    echo ⚠️  Please update .env file with your actual configuration values!
)

REM Install Backend API dependencies
echo 📦 Installing Backend API dependencies...
cd backend-api
npm install
cd ..

REM Install Web Dashboard dependencies
echo 📦 Installing Web Dashboard dependencies...
cd web-dashboard
npm install
cd ..

REM Install AI Service dependencies
echo 📦 Installing AI Service dependencies...
cd ai-service
pip install -r requirements.txt
cd ..

REM Build Docker images
echo 🐳 Building Docker images...
docker-compose build

echo.
echo ✅ Setup completed successfully!
echo =====================================
echo.

echo 🚀 Quick Start Commands:
echo ------------------------
echo Start all services:     docker-compose up -d
echo View logs:             docker-compose logs -f
echo Stop all services:     docker-compose down
echo.
echo Development URLs:
echo • Web Dashboard:       http://localhost:3000
echo • Backend API:         http://localhost:5000
echo • AI Service:          http://localhost:8000
echo • MongoDB:             mongodb://localhost:27017
echo.
echo 📱 Mobile App Development:
echo • Navigate to mobile-app\ directory
echo • Follow React Native setup instructions
echo • Use Metro bundler for development
echo.
echo 📚 Documentation:
echo • API Docs:            http://localhost:5000/api/docs
echo • AI Service Docs:     http://localhost:8000/docs
echo.
echo ⚠️  Remember to:
echo 1. Update .env file with actual values
echo 2. Configure API keys for maps and geocoding
echo 3. Set up email configuration for notifications
echo 4. Configure SSL certificates for production
echo.
echo 🎉 Happy coding! Building the future of billboard monitoring! 🏗️

pause
