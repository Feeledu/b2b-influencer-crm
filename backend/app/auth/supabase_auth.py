"""
Supabase Authentication Integration
Handles user authentication and JWT token validation
"""
import logging
from typing import Optional, Dict, Any
from supabase import create_client, Client
from app.config import settings
import jwt
import json

logger = logging.getLogger(__name__)

class SupabaseAuth:
    def __init__(self):
        self._supabase: Optional[Client] = None
        self._anon_supabase: Optional[Client] = None
    
    @property
    def supabase(self) -> Client:
        """Lazy initialization of Supabase client with service key"""
        if self._supabase is None:
            if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
                raise ValueError("Supabase credentials not configured")
            
            self._supabase = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_KEY
            )
        return self._supabase
    
    @property
    def anon_supabase(self) -> Client:
        """Lazy initialization of Supabase client with anon key"""
        if self._anon_supabase is None:
            if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
                raise ValueError("Supabase anon credentials not configured")
            
            self._anon_supabase = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_ANON_KEY
            )
        return self._anon_supabase
    
    async def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Verify JWT token and return user information
        """
        try:
            # Handle demo token for development
            if token == "demo-token-for-development":
                logger.info("Using demo token for development")
                return {
                    "user_id": "70fd2b83-5c83-4660-8131-fa136bd39f42",  # Fluencr admin user ID
                    "email": "admin@fluencr.com",
                    "name": "Fluencr Admin",
                    "avatar_url": None,
                    "email_verified": True,
                    "created_at": "2025-09-20T15:14:33.967030",
                    "role": "admin",
                    "provider": "demo"
                }
            
            # Verify the token with Supabase using anon key
            response = self.anon_supabase.auth.get_user(token)
            
            if response.user:
                return {
                    "user_id": response.user.id,
                    "email": response.user.email,
                    "name": response.user.user_metadata.get("name", ""),
                    "avatar_url": response.user.user_metadata.get("avatar_url"),
                    "email_verified": response.user.email_confirmed_at is not None,
                    "created_at": response.user.created_at,
                    "role": response.user.user_metadata.get("role", "user"),
                    "provider": response.user.app_metadata.get("provider", "email")
                }
            return None
            
        except Exception as e:
            logger.error(f"Token verification failed: {str(e)}")
            return None
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user profile from database
        """
        try:
            response = self.supabase.table("users").select("*").eq("id", user_id).execute()
            
            if response.data:
                return response.data[0]
            return None
            
        except Exception as e:
            logger.error(f"Failed to get user profile: {str(e)}")
            return None
    
    async def create_user_profile(self, user_data: Dict[str, Any]) -> bool:
        """
        Create user profile in database
        """
        try:
            response = self.supabase.table("users").insert(user_data).execute()
            return len(response.data) > 0
            
        except Exception as e:
            logger.error(f"Failed to create user profile: {str(e)}")
            return False
    
    async def update_user_profile(self, user_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update user profile in database
        """
        try:
            response = self.supabase.table("users").update(updates).eq("id", user_id).execute()
            return len(response.data) > 0
            
        except Exception as e:
            logger.error(f"Failed to update user profile: {str(e)}")
            return False
