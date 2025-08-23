# 🚀 Quick Start Guide

## Prerequisites

- **Docker** and **Docker Compose** installed
- **Git** for version control
- **Flutter SDK** (optional, for development)

## 🏃‍♂️ Get Started in 5 Minutes

### 1. Clone the Repository
```bash
git clone <repository-url>
cd teen-fitness-app
```

### 2. Run the Setup Script
```bash
./setup.sh
```

This script will:
- ✅ Check system requirements
- ✅ Create environment configuration
- ✅ Set up directories and monitoring
- ✅ Build and start all services
- ✅ Wait for services to be ready
- ✅ Display service URLs and next steps

### 3. Access Your Application

Once setup is complete, you can access:

- **Frontend App**: http://localhost:80
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)

## 🛠️ Development Setup

### Frontend Development
```bash
# Install Flutter dependencies
flutter pub get

# Run in debug mode
flutter run

# Build for production
flutter build apk
flutter build ios
```

### Backend Development
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run in development mode
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Database Management
```bash
# Access PostgreSQL
docker-compose exec postgres psql -U teenfitness -d teen_fitness

# View logs
docker-compose logs -f postgres
```

## 📱 Testing the App

### 1. Open the Frontend
Navigate to http://localhost:80 in your browser

### 2. Test Pose Detection
- Click "Start Workout"
- Allow camera permissions
- Try some basic movements
- Check real-time feedback

### 3. Test Backend API
- Visit http://localhost:8000/docs
- Try the health check endpoint
- Test user authentication

## 🔧 Configuration

### Environment Variables
Edit `.env` file to customize:
- Database credentials
- Firebase configuration
- Security settings
- ML model paths

### Firebase Setup (Optional)
1. Create a Firebase project
2. Download service account key
3. Update `.env` with Firebase credentials
4. Restart services: `docker-compose restart backend`

## 📊 Monitoring

### View Metrics
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🚨 Troubleshooting

### Common Issues

**Services won't start?**
```bash
# Check Docker status
docker --version
docker-compose --version

# Restart Docker
sudo systemctl restart docker

# Clean up and retry
docker-compose down -v
docker system prune -f
./setup.sh
```

**Database connection issues?**
```bash
# Check PostgreSQL status
docker-compose ps postgres

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

**Pose detection not working?**
- Ensure camera permissions are granted
- Check browser console for errors
- Verify MediaPipe models are loaded

### Performance Issues
```bash
# Check resource usage
docker stats

# Scale services if needed
docker-compose up -d --scale backend=3
```

## 🔄 Updates and Maintenance

### Update Dependencies
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Backup Database
```bash
# Create backup
docker-compose exec postgres pg_dump -U teenfitness teen_fitness > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U teenfitness -d teen_fitness < backup.sql
```

## 📚 Next Steps

1. **Customize the app** for your specific needs
2. **Add more exercises** to the library
3. **Configure ML models** for better accuracy
4. **Set up production deployment**
5. **Add monitoring and alerting**
6. **Implement CI/CD pipelines**

## 🆘 Need Help?

- **Documentation**: Check the `docs/` folder
- **Issues**: Create a GitHub issue
- **Discussions**: Join our community forum
- **Support**: Contact the development team

---

**Happy coding! 🎉**

The Teen Fitness App is now ready to help teenagers exercise safely and effectively with AI-powered form analysis.
