"""
Configuration settings for Teen Fitness App Backend
"""

import os
from typing import List, Optional
from pydantic import BaseSettings, validator


class Settings(BaseSettings):
    # Project settings
    PROJECT_NAME: str = "Teen Fitness App Backend"
    PROJECT_DESCRIPTION: str = "AI-powered fitness app for safe teen exercise"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS settings
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Database settings
    DATABASE_URL: str = "postgresql://user:password@localhost/teen_fitness"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 30
    
    # Security settings
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Firebase settings
    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_PRIVATE_KEY_ID: Optional[str] = None
    FIREBASE_PRIVATE_KEY: Optional[str] = None
    FIREBASE_CLIENT_EMAIL: Optional[str] = None
    FIREBASE_CLIENT_ID: Optional[str] = None
    FIREBASE_AUTH_URI: Optional[str] = None
    FIREBASE_TOKEN_URI: Optional[str] = None
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL: Optional[str] = None
    FIREBASE_CLIENT_X509_CERT_URL: Optional[str] = None
    
    # ML Model settings
    MEDIAPIPE_MODEL_PATH: str = "assets/models/mediapipe_pose"
    TENSORFLOW_MODEL_PATH: str = "assets/models/tensorflow"
    MODEL_CACHE_SIZE: int = 100
    
    # File storage settings
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    ALLOWED_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "mp4", "mov"]
    
    # Redis settings
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_DB: int = 0
    
    # Celery settings
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    
    # Logging settings
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Email settings
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_TLS: bool = True
    
    # Notification settings
    PUSH_NOTIFICATION_ENABLED: bool = True
    EMAIL_NOTIFICATION_ENABLED: bool = True
    
    # Analytics settings
    ANALYTICS_ENABLED: bool = True
    ANALYTICS_RETENTION_DAYS: int = 90
    
    # Privacy settings
    DATA_RETENTION_DAYS: int = 2555  # 7 years for minors
    ANONYMIZE_DATA: bool = True
    
    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Cache settings
    CACHE_TTL: int = 3600  # 1 hour
    CACHE_MAX_SIZE: int = 1000
    
    # Monitoring
    METRICS_ENABLED: bool = True
    HEALTH_CHECK_INTERVAL: int = 30
    
    # COPPA compliance
    COPPA_COMPLIANT: bool = True
    PARENTAL_CONSENT_REQUIRED: bool = True
    MIN_AGE: int = 13
    MAX_AGE: int = 19
    
    @validator("ALLOWED_HOSTS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    @validator("DATABASE_URL", pre=True)
    def assemble_db_connection(cls, v: str) -> str:
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
