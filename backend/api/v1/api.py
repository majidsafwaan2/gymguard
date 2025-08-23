"""
Main API router for Teen Fitness App Backend
"""

from fastapi import APIRouter

from api.v1.endpoints import auth, users, exercises, workouts, pose_analysis, analytics

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(exercises.router, prefix="/exercises", tags=["exercises"])
api_router.include_router(workouts.router, prefix="/workouts", tags=["workouts"])
api_router.include_router(pose_analysis.router, prefix="/pose-analysis", tags=["pose-analysis"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
