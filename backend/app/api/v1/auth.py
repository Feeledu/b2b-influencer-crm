"""
Authentication API endpoints.
Provides user authentication, profile management, and token operations.
"""
import logging
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Request
from app.auth.dependencies import get_current_user, get_auth_service
from app.auth.supabase_auth import SupabaseAuth
from app.schemas.auth import (
    UserProfile, DetailedUserProfile, UserPermissions, 
    AuthStatus, TokenRefreshResponse, LogoutResponse
)

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/me",
            response_model=UserProfile,
            summary="Get User Profile",
            description="Get current user's profile information",
            response_description="User profile information")
async def get_current_user_profile(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> UserProfile:
    """
    Get current user's profile information.
    
    Returns:
        UserProfile containing user profile information
    """
    try:
        # Return user profile (excluding sensitive information)
        profile = UserProfile(
            user_id=current_user.get("user_id"),
            email=current_user.get("email"),
            name=current_user.get("name", ""),
            avatar_url=current_user.get("avatar_url"),
            email_verified=current_user.get("email_verified", False),
            created_at=current_user.get("created_at"),
            role=current_user.get("role", "user"),
            provider=current_user.get("provider", "email")
        )
        
        logger.info(f"Profile retrieved for user: {current_user.get('user_id')}")
        return profile
        
    except Exception as e:
        logger.error(f"Error getting user profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Profile retrieval failed")

@router.get("/me/detailed",
            response_model=DetailedUserProfile,
            summary="Get Detailed User Profile",
            description="Get detailed user profile information including metadata",
            response_description="Detailed user profile information")
async def get_detailed_user_profile(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> DetailedUserProfile:
    """
    Get detailed user profile information.
    
    Returns:
        DetailedUserProfile containing comprehensive user information
    """
    try:
        # Get additional user data from database
        auth_service = get_auth_service()
        db_profile = await auth_service.get_user_profile(current_user.get("user_id"))
        
        if not db_profile:
            # Create user profile if it doesn't exist
            user_data = {
                "id": current_user.get("user_id"),
                "email": current_user.get("email"),
                "name": current_user.get("name", ""),
                "avatar_url": current_user.get("avatar_url"),
                "role": current_user.get("role", "user"),
                "subscription_status": "trial"
            }
            await auth_service.create_user_profile(user_data)
            db_profile = user_data
        
        profile = DetailedUserProfile(
            user_id=current_user.get("user_id"),
            email=current_user.get("email"),
            name=current_user.get("name", ""),
            avatar_url=current_user.get("avatar_url"),
            email_verified=current_user.get("email_verified", False),
            created_at=current_user.get("created_at"),
            role=current_user.get("role", "user"),
            provider=current_user.get("provider", "email"),
            subscription_status=db_profile.get("subscription_status", "trial"),
            last_login=current_user.get("last_login"),
            preferences=db_profile.get("preferences", {}),
            metadata=current_user.get("metadata", {})
        )
        
        logger.info(f"Detailed profile retrieved for user: {current_user.get('user_id')}")
        return profile
        
    except Exception as e:
        logger.error(f"Error getting detailed user profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Detailed profile retrieval failed")

@router.get("/permissions",
            response_model=UserPermissions,
            summary="Get User Permissions",
            description="Get current user's permissions and access levels",
            response_description="User permissions information")
async def get_user_permissions(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> UserPermissions:
    """
    Get user permissions and access levels.
    
    Returns:
        UserPermissions containing user access information
    """
    try:
        role = current_user.get("role", "user")
        
        permissions = UserPermissions(
            can_view_influencers=True,
            can_add_influencers=True,
            can_create_campaigns=True,
            can_view_analytics=True,
            can_manage_users=role in ["admin", "manager"],
            can_access_admin=role == "admin",
            subscription_tier=current_user.get("subscription_status", "trial")
        )
        
        logger.info(f"Permissions retrieved for user: {current_user.get('user_id')}")
        return permissions
        
    except Exception as e:
        logger.error(f"Error getting user permissions: {str(e)}")
        raise HTTPException(status_code=500, detail="Permissions retrieval failed")

@router.get("/status",
            response_model=AuthStatus,
            summary="Get Auth Service Status",
            description="Get authentication service status and configuration",
            response_description="Authentication service status")
async def get_auth_status() -> AuthStatus:
    """
    Get authentication service status.
    
    Returns:
        AuthStatus containing service status information
    """
    try:
        status = AuthStatus(
            service="supabase",
            status="active",
            providers=["email", "google"],
            features=["jwt", "oauth", "email_verification"],
            version="1.0.0"
        )
        
        logger.info("Auth status retrieved successfully")
        return status
        
    except Exception as e:
        logger.error(f"Error getting auth status: {str(e)}")
        raise HTTPException(status_code=500, detail="Auth status retrieval failed")
