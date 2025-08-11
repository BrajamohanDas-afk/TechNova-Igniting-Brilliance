#!/bin/bash

# Billboard Detection System - Development Setup Script
# TechNova Competition Project

echo "🚀 Setting up Billboard Detection System..."
echo "=====================================\n"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or higher) first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

echo "✅ Prerequisites check passed!\n"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p uploads
mkdir -p ai-models
mkdir -p temp-images
mkdir -p logs

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your actual configuration values!"
fi

# Install Backend API dependencies
echo "📦 Installing Backend API dependencies..."
cd backend-api
npm install
cd ..

# Install Web Dashboard dependencies
echo "📦 Installing Web Dashboard dependencies..."
cd web-dashboard
npm install
cd ..

# Install AI Service dependencies
echo "📦 Installing AI Service dependencies..."
cd ai-service
pip3 install -r requirements.txt
cd ..

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose build

echo "\n✅ Setup completed successfully!"
echo "=====================================\n"

echo "🚀 Quick Start Commands:"
echo "------------------------"
echo "Start all services:     docker-compose up -d"
echo "View logs:             docker-compose logs -f"
echo "Stop all services:     docker-compose down"
echo ""
echo "Development URLs:"
echo "• Web Dashboard:       http://localhost:3000"
echo "• Backend API:         http://localhost:5000"
echo "• AI Service:          http://localhost:8000"
echo "• MongoDB:             mongodb://localhost:27017"
echo ""
echo "📱 Mobile App Development:"
echo "• Navigate to mobile-app/ directory"
echo "• Follow React Native setup instructions"
echo "• Use Metro bundler for development"
echo ""
echo "📚 Documentation:"
echo "• API Docs:            http://localhost:5000/api/docs"
echo "• AI Service Docs:     http://localhost:8000/docs"
echo ""
echo "⚠️  Remember to:"
echo "1. Update .env file with actual values"
echo "2. Configure API keys for maps and geocoding"
echo "3. Set up email configuration for notifications"
echo "4. Configure SSL certificates for production"
echo ""
echo "🎉 Happy coding! Building the future of billboard monitoring! 🏗️"
