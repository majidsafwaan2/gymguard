#!/bin/bash

# Teen Fitness App Setup Script
# This script sets up the complete application stack

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check system requirements
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check for Docker
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        print_status "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check for Docker Compose
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        print_status "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    # Check for Git
    if ! command_exists git; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    # Check for Flutter (optional for development)
    if ! command_exists flutter; then
        print_warning "Flutter is not installed. This is optional for development."
        print_status "To install Flutter, visit: https://flutter.dev/docs/get-started/install"
    fi
    
    # Check for Python (optional for development)
    if ! command_exists python3; then
        print_warning "Python 3 is not installed. This is optional for development."
        print_status "To install Python, visit: https://www.python.org/downloads/"
    fi
    
    print_success "System requirements check completed"
}

# Function to create environment file
create_env_file() {
    print_status "Creating environment configuration..."
    
    if [ ! -f .env ]; then
        cat > .env << EOF
# Teen Fitness App Environment Configuration

# App Configuration
APP_NAME=Teen Fitness App
APP_VERSION=1.0.0
ENVIRONMENT=development
DEBUG=true

# Database Configuration
DATABASE_URL=postgresql://teenfitness:password@localhost:5432/teen_fitness
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=30

# Security Configuration
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Firebase Configuration (Optional)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_DB=0

# File Storage
UPLOAD_DIR=uploads
MAX_FILE_SIZE=104857600
ALLOWED_EXTENSIONS=jpg,jpeg,png,mp4,mov

# Logging
LOG_LEVEL=INFO

# Monitoring
METRICS_ENABLED=true
HEALTH_CHECK_INTERVAL=30

# COPPA Compliance
COPPA_COMPLIANT=true
PARENTAL_CONSENT_REQUIRED=true
MIN_AGE=13
MAX_AGE=19
EOF
        
        print_success "Environment file created: .env"
        print_warning "Please review and update the .env file with your specific configuration"
    else
        print_status "Environment file already exists: .env"
    fi
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p assets/{images,models,audio,animations}
    mkdir -p backend/{logs,uploads}
    mkdir -p monitoring/{prometheus,grafana}
    mkdir -p ssl
    mkdir -p logs
    
    print_success "Directories created successfully"
}

# Function to download ML models
download_ml_models() {
    print_status "Downloading ML models..."
    
    # Create models directory
    mkdir -p assets/models
    
    # Download MediaPipe pose model (if available)
    if [ ! -f "assets/models/mediapipe_pose" ]; then
        print_status "MediaPipe pose model will be downloaded on first use"
    fi
    
    # Download TensorFlow models (if available)
    if [ ! -f "assets/models/tensorflow" ]; then
        print_status "TensorFlow models will be downloaded on first use"
    fi
    
    print_success "ML models setup completed"
}

# Function to setup monitoring
setup_monitoring() {
    print_status "Setting up monitoring configuration..."
    
    # Create Prometheus configuration
    cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'teen-fitness-backend'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'teen-fitness-frontend'
    static_configs:
      - targets: ['frontend:80']
    scrape_interval: 10s
EOF
    
    # Create Grafana dashboard configuration
    mkdir -p monitoring/grafana/dashboards
    mkdir -p monitoring/grafana/datasources
    
    cat > monitoring/grafana/datasources/prometheus.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
EOF
    
    print_success "Monitoring configuration created"
}

# Function to build and start services
start_services() {
    print_status "Building and starting services..."
    
    # Build images
    docker-compose build
    
    # Start services
    docker-compose up -d
    
    print_success "Services started successfully"
}

# Function to wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for database
    print_status "Waiting for PostgreSQL..."
    until docker-compose exec -T postgres pg_isready -U teenfitness; do
        sleep 2
    done
    
    # Wait for backend
    print_status "Waiting for backend API..."
    until curl -f http://localhost:8000/health >/dev/null 2>&1; do
        sleep 2
    done
    
    # Wait for frontend
    print_status "Waiting for frontend..."
    until curl -f http://localhost:80 >/dev/null 2>&1; do
        sleep 2
    done
    
    print_success "All services are ready"
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Wait a bit more for database to be fully ready
    sleep 5
    
    # Run migrations (if using Alembic)
    if [ -f "backend/alembic.ini" ]; then
        docker-compose exec backend alembic upgrade head
    fi
    
    print_success "Database migrations completed"
}

# Function to create initial data
create_initial_data() {
    print_status "Creating initial data..."
    
    # This would typically involve running seed scripts
    # For now, we'll just create the basic structure
    
    print_success "Initial data setup completed"
}

# Function to display service information
display_service_info() {
    print_success "Setup completed successfully!"
    echo
    echo "Service URLs:"
    echo "  Frontend: http://localhost:80"
    echo "  Backend API: http://localhost:8000"
    echo "  API Documentation: http://localhost:8000/docs"
    echo "  Prometheus: http://localhost:9090"
    echo "  Grafana: http://localhost:3000 (admin/admin)"
    echo
    echo "Database:"
    echo "  PostgreSQL: localhost:5432"
    echo "  Redis: localhost:6379"
    echo
    echo "Useful commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop services: docker-compose down"
    echo "  Restart services: docker-compose restart"
    echo "  Update services: docker-compose pull && docker-compose up -d"
    echo
    echo "Next steps:"
    echo "  1. Review and update the .env file"
    echo "  2. Configure Firebase credentials (if using Firebase auth)"
    echo "  3. Customize the app configuration"
    echo "  4. Set up SSL certificates for production"
}

# Function to cleanup on error
cleanup() {
    print_error "Setup failed. Cleaning up..."
    docker-compose down -v 2>/dev/null || true
    exit 1
}

# Set trap for cleanup
trap cleanup ERR

# Main setup function
main() {
    echo "=========================================="
    echo "Teen Fitness App Setup Script"
    echo "=========================================="
    echo
    
    # Check requirements
    check_requirements
    
    # Create environment file
    create_env_file
    
    # Create directories
    create_directories
    
    # Download ML models
    download_ml_models
    
    # Setup monitoring
    setup_monitoring
    
    # Start services
    start_services
    
    # Wait for services
    wait_for_services
    
    # Run migrations
    run_migrations
    
    # Create initial data
    create_initial_data
    
    # Display information
    display_service_info
}

# Run main function
main "$@"
