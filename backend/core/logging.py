"""
Logging configuration for the application
"""

import logging
import logging.config
import sys
from pathlib import Path
from core.config import settings


def setup_logging():
    """Setup application logging configuration"""
    
    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Logging configuration
    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "detailed": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "json": {
                "format": '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "logger": "%(name)s", "message": "%(message)s"}',
                "datefmt": "%Y-%m-%dT%H:%M:%S",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": "INFO",
                "formatter": "default",
                "stream": sys.stdout,
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "DEBUG",
                "formatter": "detailed",
                "filename": log_dir / "app.log",
                "maxBytes": 10 * 1024 * 1024,  # 10MB
                "backupCount": 5,
            },
            "error_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "ERROR",
                "formatter": "detailed",
                "filename": log_dir / "error.log",
                "maxBytes": 10 * 1024 * 1024,  # 10MB
                "backupCount": 5,
            },
            "access_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "INFO",
                "formatter": "json",
                "filename": log_dir / "access.log",
                "maxBytes": 10 * 1024 * 1024,  # 10MB
                "backupCount": 5,
            },
        },
        "loggers": {
            "": {  # Root logger
                "level": "INFO",
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "uvicorn": {
                "level": "INFO",
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "uvicorn.error": {
                "level": "INFO",
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "uvicorn.access": {
                "level": "INFO",
                "handlers": ["console", "access_file"],
                "propagate": False,
            },
            "fastapi": {
                "level": "INFO",
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "sqlalchemy": {
                "level": "WARNING",
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "firebase_admin": {
                "level": "INFO",
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "mediapipe": {
                "level": "WARNING",
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "tensorflow": {
                "level": "WARNING",
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "opencv": {
                "level": "WARNING",
                "handlers": ["console", "file"],
                "propagate": False,
            },
        },
        "root": {
            "level": "INFO",
            "handlers": ["console", "file", "error_file"],
        },
    }
    
    # Apply logging configuration
    logging.config.dictConfig(logging_config)
    
    # Set specific logger levels based on settings
    logging.getLogger().setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
    
    # Log startup message
    logger = logging.getLogger(__name__)
    logger.info("Logging configuration initialized")
    logger.info(f"Log level: {settings.LOG_LEVEL}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance with the given name"""
    return logging.getLogger(name)


# Custom log formatter for structured logging
class StructuredFormatter(logging.Formatter):
    """Custom formatter for structured logging"""
    
    def format(self, record):
        # Add extra fields for structured logging
        if not hasattr(record, 'user_id'):
            record.user_id = 'anonymous'
        if not hasattr(record, 'request_id'):
            record.request_id = 'none'
        if not hasattr(record, 'endpoint'):
            record.endpoint = 'none'
        
        return super().format(record)


# Request logging middleware logger
def get_request_logger():
    """Get logger for request logging"""
    return logging.getLogger("request")


# Error logging logger
def get_error_logger():
    """Get logger for error logging"""
    return logging.getLogger("error")


# Performance logging logger
def get_performance_logger():
    """Get logger for performance logging"""
    return logging.getLogger("performance")


# Security logging logger
def get_security_logger():
    """Get logger for security events"""
    return logging.getLogger("security")


# ML model logging logger
def get_ml_logger():
    """Get logger for ML model operations"""
    return logging.getLogger("ml")


# User activity logging logger
def get_activity_logger():
    """Get logger for user activity"""
    return logging.getLogger("activity")
