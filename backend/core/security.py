"""
Security utilities for authentication and authorization
"""

import logging
from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials
from firebase_admin.exceptions import FirebaseError

from core.config import settings
from models.user import User
from core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token security
security = HTTPBearer()

# Initialize Firebase Admin SDK
try:
    if not firebase_admin._apps:
        if all([
            settings.FIREBASE_PROJECT_ID,
            settings.FIREBASE_PRIVATE_KEY_ID,
            settings.FIREBASE_PRIVATE_KEY,
            settings.FIREBASE_CLIENT_EMAIL,
            settings.FIREBASE_CLIENT_ID,
            settings.FIREBASE_AUTH_URI,
            settings.FIREBASE_TOKEN_URI,
            settings.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
            settings.FIREBASE_CLIENT_X509_CERT_URL,
        ]):
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID,
                "private_key_id": settings.FIREBASE_PRIVATE_KEY_ID,
                "private_key": settings.FIREBASE_PRIVATE_KEY.replace("\\n", "\n"),
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
                "client_id": settings.FIREBASE_CLIENT_ID,
                "auth_uri": settings.FIREBASE_AUTH_URI,
                "token_uri": settings.FIREBASE_TOKEN_URI,
                "auth_provider_x509_cert_url": settings.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
                "client_x509_cert_url": settings.FIREBASE_CLIENT_X509_CERT_URL,
            })
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized successfully")
        else:
            logger.warning("Firebase credentials not provided, Firebase auth disabled")
    else:
        logger.info("Firebase Admin SDK already initialized")
except Exception as e:
    logger.error(f"Failed to initialize Firebase Admin SDK: {e}")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate password hash"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError as e:
        logger.error(f"JWT token verification failed: {e}")
        return None


async def verify_firebase_token(id_token: str) -> Optional[dict]:
    """Verify Firebase ID token"""
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except FirebaseError as e:
        logger.error(f"Firebase token verification failed: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error during Firebase token verification: {e}")
        return None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        payload = verify_token(token)
        
        if payload is None:
            raise credentials_exception
        
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        
        # Get user from database
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if user is None:
            raise credentials_exception
        
        return user
        
    except JWTError:
        raise credentials_exception


async def get_current_user_firebase(
    id_token: str,
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current user using Firebase authentication"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate Firebase credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = await verify_firebase_token(id_token)
        
        if payload is None:
            raise credentials_exception
        
        firebase_uid: str = payload.get("uid")
        if firebase_uid is None:
            raise credentials_exception
        
        # Get user from database by Firebase UID
        result = await db.execute(select(User).where(User.firebase_uid == firebase_uid))
        user = result.scalar_one_or_none()
        
        if user is None:
            raise credentials_exception
        
        return user
        
    except Exception as e:
        logger.error(f"Firebase authentication failed: {e}")
        raise credentials_exception


def check_user_permissions(user: User, required_permissions: list) -> bool:
    """Check if user has required permissions"""
    # Implement permission checking logic based on user type and role
    if user.user_type == "admin":
        return True
    
    # Add more permission logic here
    return True


def require_permissions(required_permissions: list):
    """Decorator to require specific permissions"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Extract user from function arguments
            user = None
            for arg in args:
                if isinstance(arg, User):
                    user = arg
                    break
            
            if not user:
                for value in kwargs.values():
                    if isinstance(value, User):
                        user = value
                        break
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User not found in function arguments"
                )
            
            if not check_user_permissions(user, required_permissions):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator


# COPPA compliance functions
def verify_age_compliance(birth_date: datetime) -> bool:
    """Verify user age compliance with COPPA"""
    age = (datetime.utcnow() - birth_date).days / 365.25
    return settings.MIN_AGE <= age <= settings.MAX_AGE


def require_parental_consent(user: User) -> bool:
    """Check if parental consent is required"""
    if not settings.PARENTAL_CONSENT_REQUIRED:
        return False
    
    if user.user_type in ["parent", "guardian", "coach"]:
        return False
    
    # Check if user is a minor
    age = (datetime.utcnow() - user.date_of_birth).days / 365.25
    return age < 18


def validate_parental_consent(user: User, guardian_consent: bool) -> bool:
    """Validate parental consent for minors"""
    if not require_parental_consent(user):
        return True
    
    return guardian_consent and user.guardian_ids
