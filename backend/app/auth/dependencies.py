"""
Authentication Dependencies
FastAPI dependencies for authentication and user context
"""
import logging
from typing import Dict, Any, Optional
from fastapi import Depends, HTTPException, status, Request
from app.auth.supabase_auth import SupabaseAuth

logger = logging.getLogger(__name__)

# Global auth service instance
_auth_service: Optional[SupabaseAuth] = None

def get_auth_service() -> SupabaseAuth:
    """
    Get authentication service instance
    """
    global _auth_service
    if _auth_service is None:
        _auth_service = SupabaseAuth()
    return _auth_service

def get_current_user(request: Request) -> Dict[str, Any]:
    """
    Get current authenticated user from request state
    """
    if not hasattr(request.state, 'user') or not request.state.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    return request.state.user

def get_optional_user(request: Request) -> Optional[Dict[str, Any]]:
    """
    Get current user if authenticated, otherwise return None
    """
    if hasattr(request.state, 'user') and request.state.user:
        return request.state.user
    return None

def require_role(required_role: str):
    """
    Dependency factory for role-based access control
    """
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        user_role = current_user.get("role", "user")
        
        if user_role != required_role and user_role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{required_role}' required"
            )
        
        return current_user
    
    return role_checker

def require_subscription(subscription_tier: str):
    """
    Dependency factory for subscription-based access control
    """
    def subscription_checker(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        user_subscription = current_user.get("subscription_status", "trial")
        
        subscription_levels = {
            "trial": 0,
            "basic": 1,
            "pro": 2,
            "enterprise": 3
        }
        
        user_level = subscription_levels.get(user_subscription, 0)
        required_level = subscription_levels.get(subscription_tier, 0)
        
        if user_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Subscription tier '{subscription_tier}' required"
            )
        
        return current_user
    
    return subscription_checker
