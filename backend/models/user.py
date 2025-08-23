"""
User model for the database
"""

import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, String, DateTime, Boolean, Integer, Float, Text, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from core.database import Base


class User(Base):
    """User model representing app users"""
    
    __tablename__ = "users"
    
    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Authentication fields
    email = Column(String(255), unique=True, nullable=False, index=True)
    firebase_uid = Column(String(255), unique=True, nullable=True, index=True)
    password_hash = Column(String(255), nullable=True)  # For non-Firebase auth
    
    # Profile information
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(DateTime, nullable=False)
    profile_image_url = Column(String(500), nullable=True)
    
    # User type and fitness level
    user_type = Column(String(50), nullable=False, default="teen")  # teen, parent, coach, guardian
    fitness_level = Column(String(50), nullable=False, default="beginner")  # beginner, intermediate, advanced, athlete
    
    # Physical attributes
    height = Column(Float, nullable=True)  # in cm
    weight = Column(Float, nullable=True)  # in kg
    gender = Column(String(20), nullable=True)
    
    # Preferences
    preferred_exercises = Column(ARRAY(String), nullable=True)
    avoided_exercises = Column(ARRAY(String), nullable=True)
    preferred_workout_duration = Column(Integer, nullable=True, default=45)  # in minutes
    preferred_rest_days = Column(Integer, nullable=True, default=2)
    
    # Settings
    enable_audio_feedback = Column(Boolean, default=True)
    enable_visual_feedback = Column(Boolean, default=True)
    enable_notifications = Column(Boolean, default=True)
    preferred_language = Column(String(10), default="en")
    enable_dark_mode = Column(Boolean, default=False)
    
    # Fitness goals
    fitness_goals = Column(ARRAY(String), nullable=True)
    
    # Statistics
    total_workouts = Column(Integer, default=0)
    total_exercises = Column(Integer, default=0)
    total_form_corrections = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    average_form_score = Column(Float, default=0.0)
    last_workout_date = Column(DateTime, nullable=True)
    
    # Exercise counts and scores
    exercise_counts = Column(JSON, nullable=True)  # {exercise_id: count}
    exercise_form_scores = Column(JSON, nullable=True)  # {exercise_id: average_score}
    
    # Relationships
    guardian_ids = Column(ARRAY(UUID(as_uuid=True)), nullable=True)
    coach_ids = Column(ARRAY(UUID(as_uuid=True)), nullable=True)
    
    # Privacy and consent
    is_active = Column(Boolean, default=True)
    parental_consent_given = Column(Boolean, default=False)
    parental_consent_date = Column(DateTime, nullable=True)
    parental_consent_guardian_id = Column(UUID(as_uuid=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    last_active_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    workouts = relationship("Workout", back_populates="user")
    pose_analyses = relationship("PoseAnalysis", back_populates="user")
    achievements = relationship("Achievement", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', name='{self.first_name} {self.last_name}')>"
    
    @property
    def age(self) -> int:
        """Calculate user age"""
        if self.date_of_birth:
            return (datetime.utcnow() - self.date_of_birth).days // 365
        return 0
    
    @property
    def is_minor(self) -> bool:
        """Check if user is a minor"""
        return self.age < 18
    
    @property
    def full_name(self) -> str:
        """Get user's full name"""
        return f"{self.first_name} {self.last_name}"
    
    def to_dict(self) -> dict:
        """Convert user to dictionary"""
        return {
            "id": str(self.id),
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "date_of_birth": self.date_of_birth.isoformat() if self.date_of_birth else None,
            "age": self.age,
            "is_minor": self.is_minor,
            "user_type": self.user_type,
            "fitness_level": self.fitness_level,
            "profile_image_url": self.profile_image_url,
            "height": self.height,
            "weight": self.weight,
            "gender": self.gender,
            "preferred_exercises": self.preferred_exercises,
            "avoided_exercises": self.avoided_exercises,
            "preferred_workout_duration": self.preferred_workout_duration,
            "preferred_rest_days": self.preferred_rest_days,
            "enable_audio_feedback": self.enable_audio_feedback,
            "enable_visual_feedback": self.enable_visual_feedback,
            "enable_notifications": self.enable_notifications,
            "preferred_language": self.preferred_language,
            "enable_dark_mode": self.enable_dark_mode,
            "fitness_goals": self.fitness_goals,
            "total_workouts": self.total_workouts,
            "total_exercises": self.total_exercises,
            "total_form_corrections": self.total_form_corrections,
            "current_streak": self.current_streak,
            "longest_streak": self.longest_streak,
            "average_form_score": self.average_form_score,
            "last_workout_date": self.last_workout_date.isoformat() if self.last_workout_date else None,
            "exercise_counts": self.exercise_counts,
            "exercise_form_scores": self.exercise_form_scores,
            "guardian_ids": [str(uid) for uid in self.guardian_ids] if self.guardian_ids else [],
            "coach_ids": [str(uid) for uid in self.coach_ids] if self.coach_ids else [],
            "is_active": self.is_active,
            "parental_consent_given": self.parental_consent_given,
            "parental_consent_date": self.parental_consent_date.isoformat() if self.parental_consent_date else None,
            "parental_consent_guardian_id": str(self.parental_consent_guardian_id) if self.parental_consent_guardian_id else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "last_active_at": self.last_active_at.isoformat(),
        }


class UserSession(Base):
    """User session tracking for analytics and security"""
    
    __tablename__ = "user_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    session_token = Column(String(255), nullable=False, unique=True, index=True)
    device_info = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    last_activity = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", backref="sessions")
    
    def __repr__(self):
        return f"<UserSession(id={self.id}, user_id={self.user_id}, active={self.is_active})>"


class UserActivity(Base):
    """User activity tracking for analytics and insights"""
    
    __tablename__ = "user_activities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    activity_type = Column(String(100), nullable=False)  # login, workout_start, workout_complete, etc.
    activity_data = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=func.now(), nullable=False)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", backref="activities")
    
    def __repr__(self):
        return f"<UserActivity(id={self.id}, user_id={self.user_id}, type='{self.activity_type}')>"


class UserPrivacySettings(Base):
    """User privacy settings and preferences"""
    
    __tablename__ = "user_privacy_settings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    
    # Privacy levels
    profile_visibility = Column(String(50), default="private")  # public, friends_only, private
    workout_history_visibility = Column(String(50), default="private")
    progress_visibility = Column(String(50), default="private")
    achievements_visibility = Column(String(50), default="public")
    
    # Data sharing
    share_with_parents = Column(Boolean, default=True)
    share_with_coaches = Column(Boolean, default=False)
    share_with_friends = Column(Boolean, default=False)
    share_anonymized_data = Column(Boolean, default=True)
    
    # Analytics and research
    allow_research_data = Column(Boolean, default=False)
    allow_marketing_emails = Column(Boolean, default=False)
    allow_push_notifications = Column(Boolean, default=True)
    
    # Data retention
    data_retention_days = Column(Integer, default=2555)  # 7 years for minors
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", backref="privacy_settings")
    
    def __repr__(self):
        return f"<UserPrivacySettings(id={self.id}, user_id={self.user_id})>"
