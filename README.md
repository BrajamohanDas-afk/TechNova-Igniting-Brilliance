# Billboard Detection System - TechNova Competition

## 🏆 Project Overview

A comprehensive tech-enabled framework for detecting and monitoring unauthorized billboards using AI-powered computer vision, mobile citizen reporting, and real-time analytics dashboard for authorities.

### 🎯 Competition Challenge
Build an innovative solution to address unauthorized billboard proliferation in urban areas, providing automated detection, citizen engagement, and administrative oversight capabilities.

## 🚀 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web Dashboard │    │   AI Service    │
│ (React Native)  │    │    (React)      │    │   (Python)      │
│                 │    │                 │    │                 │
│ • Camera        │    │ • Analytics     │    │ • Computer      │
│ • GPS           │    │ • Maps          │    │   Vision        │
│ • Reporting     │    │ • Management    │    │ • Detection     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Backend API    │
                    │  (Node.js)      │
                    │                 │
                    │ • Authentication│
                    │ • Report Mgmt   │
                    │ • Real-time     │
                    │ • File Upload   │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │    Database     │
                    │   (MongoDB)     │
                    │   + Redis       │
                    └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend & Mobile
- **Mobile App**: React Native 0.72+ with TypeScript
- **Web Dashboard**: React 18 with TypeScript + Material-UI
- **State Management**: Redux Toolkit
- **Maps**: React Native Maps, Leaflet.js
- **Charts**: Recharts

### Backend & API
- **API Server**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.IO
- **Validation**: Express Validator

### AI & Computer Vision
- **Framework**: Python + FastAPI
- **Computer Vision**: OpenCV
- **Machine Learning**: TensorFlow/Keras
- **Image Processing**: Pillow, NumPy
- **Detection**: YOLO, Edge Detection

### DevOps & Deployment
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx
- **Process Management**: PM2
- **Monitoring**: Winston Logging

## 📱 Features

### Mobile Application
- 📸 **Camera Integration**: Capture billboard photos with metadata
- 🗺️ **GPS Location**: Automatic location tagging and address resolution
- 📝 **Report Creation**: Submit violation reports with descriptions
- 📊 **User Dashboard**: View submission history and status updates
- 🔔 **Notifications**: Real-time updates on report status
- 🔒 **Authentication**: Secure user registration and login

### AI Detection Service
- 🔍 **Billboard Detection**: Automated identification using computer vision
- 📏 **Size Analysis**: Measure billboard dimensions against regulations
- � **Location Compliance**: Verify placement against zoning rules
- 🎨 **Content Analysis**: Check for inappropriate or illegal content
- 🔢 **Confidence Scoring**: AI confidence levels for each detection
- ⚡ **Batch Processing**: Handle multiple images efficiently

### Web Dashboard (Admin)
- 📈 **Analytics Dashboard**: Real-time statistics and trends
- 🗺️ **Interactive Maps**: Heatmaps of violation hotspots
- 📋 **Report Management**: Review, verify, and resolve reports
- 👥 **User Management**: Manage citizen accounts and permissions
- 📊 **Data Export**: Generate reports and analytics
- 🔄 **Status Tracking**: Monitor resolution progress

### Backend API
- 🔐 **Authentication**: JWT-based secure authentication
- 📝 **Report CRUD**: Full report lifecycle management
- 📤 **File Upload**: Secure image upload and storage
- 📡 **Real-time Updates**: WebSocket connections for live updates
- 🚀 **Rate Limiting**: API protection and throttling
- 📊 **Analytics**: Data aggregation and statistics

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- MongoDB
- Redis

### Installation

1. **Clone and Setup**
   ```bash
   git clone [repository-url]
   cd "TechNova Igniting Brilliance"
   ```

2. **Windows Setup**
   ```cmd
   setup.bat
   ```

3. **Linux/Mac Setup**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start Services**
   ```bash
   docker-compose up -d
   ```

### Development URLs
- **Web Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000
- **API Documentation**: http://localhost:5000/api/docs

## � Project Structure

```
TechNova Igniting Brilliance/
├── mobile-app/                 # React Native mobile application
│   ├── src/
│   │   ├── screens/            # App screens (Home, Camera, etc.)
│   │   ├── components/         # Reusable components
│   │   ├── navigation/         # Navigation configuration
│   │   ├── services/           # API services
│   │   └── utils/              # Utility functions
│   └── package.json
├── backend-api/                # Node.js Express API server
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Custom middleware
│   │   └── utils/              # Utility functions
│   └── package.json
├── ai-service/                 # Python FastAPI AI service
│   ├── main.py                 # FastAPI application
│   ├── models/                 # AI model files
│   ├── services/               # AI processing services
│   └── requirements.txt
├── web-dashboard/              # React admin dashboard
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Dashboard pages
│   │   ├── services/           # API services
│   │   └── utils/              # Utility functions
│   └── package.json
├── docker-compose.yml          # Multi-service orchestration
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Reports
- `GET /api/reports` - List reports with filters
- `POST /api/reports` - Create new report
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id/status` - Update report status
- `DELETE /api/reports/:id` - Delete report

### Analytics
- `GET /api/reports/analytics/stats` - Get statistics
- `GET /api/reports/analytics/heatmap` - Get heatmap data

### AI Service
- `POST /ai/detect` - Process billboard image
- `POST /ai/batch-process` - Process multiple images
- `GET /ai/health` - Service health check

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API request throttling
- **CORS Protection**: Cross-origin request security
- **File Upload Security**: Secure image upload with validation
- **Password Hashing**: Bcrypt password encryption
- **Environment Variables**: Sensitive data protection

## 📊 Monitoring & Analytics

- **Real-time Dashboard**: Live violation statistics
- **Geographic Heatmaps**: Visual hotspot identification
- **Trend Analysis**: Historical data visualization
- **Performance Metrics**: System health monitoring
- **User Activity**: Citizen engagement tracking
- **Resolution Tracking**: Violation resolution rates

## 🚀 Deployment

### Docker Deployment
```bash
# Production deployment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale backend-api=3 --scale ai-service=2
```

### Environment Configuration
```bash
# Production environment variables
NODE_ENV=production
MONGODB_URI=mongodb://user:pass@mongodb:27017/billboard_db
JWT_SECRET=your-super-secure-secret-key
REDIS_URL=redis://redis:6379
```

## 🧪 Testing

```bash
# Backend API tests
cd backend-api
npm run test

# Mobile app tests
cd mobile-app
npm run test

# AI service tests
cd ai-service
python -m pytest
```

## 📈 Performance Optimization

- **Image Compression**: Automatic image optimization
- **Caching Strategy**: Redis caching for frequent queries
- **Database Indexing**: Optimized MongoDB indexes
- **Load Balancing**: Nginx reverse proxy
- **CDN Integration**: Static asset delivery
- **Batch Processing**: Efficient AI model inference

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is developed for the TechNova Competition. All rights reserved.

## 🏆 Competition Submission

**Team**: TechNova Participants
**Challenge**: Unauthorized Billboard Detection System
**Technology**: Full-Stack AI-Powered Solution
**Innovation**: Real-time citizen reporting with AI verification

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Check the documentation at `/docs`

---

**Built with ❤️ for TechNova Competition - Igniting Brilliance in Urban Technology Solutions**
