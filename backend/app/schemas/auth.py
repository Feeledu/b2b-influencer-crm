"""
Authentication API schemas.
Provides Pydantic models for authentication-related API requests and responses.
"""
from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr

class UserProfile(BaseModel):
    """User profile information"""
    pass
    
    user_id: str = Field(description="Unique user identifier")
    email: EmailStr = Field(description="User email address")
    name: str = Field(description="User display name")
    avatar_url: Optional[str] = Field(default=None, description="User avatar URL")
    email_verified: bool = Field(description="Whether email is verified")
    created_at: datetime = Field(description="User creation timestamp")
    role: str = Field(default="user", description="User role")
    provider: str = Field(default="email", description="Authentication provider")

class DetailedUserProfile(UserProfile):
    """Detailed user profile with additional information"""
    updated_at: Optional[datetime] = Field(default=None, description="Last update timestamp")
    phone: Optional[str] = Field(default=None, description="User phone number")
    last_sign_in: Optional[datetime] = Field(default=None, description="Last sign-in timestamp")
    app_metadata: Dict[str, Any] = Field(default_factory=dict, description="Application metadata")
    user_metadata: Dict[str, Any] = Field(default_factory=dict, description="User metadata")

class UserPermissions(BaseModel):
    """User permissions and roles"""
    role: str = Field(description="User role")
    permissions: List[str] = Field(description="List of user permissions")
    is_admin: bool = Field(description="Whether user is an admin")
    is_verified: bool = Field(description="Whether user is verified")
    can_manage_users: bool = Field(description="Whether user can manage other users")
    can_manage_content: bool = Field(description="Whether user can manage content")
    can_view_analytics: bool = Field(description="Whether user can view analytics")

class AuthStatus(BaseModel):
    """Authentication service status"""
    available: bool = Field(description="Whether authentication service is available")
    supabase_connected: bool = Field(description="Whether Supabase is connected")
    supabase_url: str = Field(description="Supabase URL")
    has_service_key: bool = Field(description="Whether service key is configured")

class TokenRefreshRequest(BaseModel):
    """Token refresh request model"""
    refresh_token: str = Field(description="Refresh token")

class TokenRefreshResponse(BaseModel):
    """Token refresh response model"""
    access_token: str = Field(description="New access token")
    refresh_token: str = Field(description="New refresh token")
    expires_at: int = Field(description="Token expiration timestamp")
    user_id: str = Field(description="User ID")
    email: str = Field(description="User email")
    name: str = Field(description="User name")
    avatar_url: Optional[str] = Field(default=None, description="User avatar URL")

class LogoutResponse(BaseModel):
    """Logout response model"""
    message: str = Field(description="Logout confirmation message")

class AuthErrorResponse(BaseModel):
    """Authentication error response model"""
    error: str = Field(description="Error type")
    detail: str = Field(description="Error detail message")
    code: Optional[str] = Field(default=None, description="Error code")

class TokenInfo(BaseModel):
    """Token information model"""
    valid: bool = Field(description="Whether token is valid")
    expired: bool = Field(description="Whether token is expired")
    user_id: Optional[str] = Field(default=None, description="User ID from token")
    email: Optional[str] = Field(default=None, description="Email from token")
    payload: Optional[Dict[str, Any]] = Field(default=None, description="Token payload")
    error: Optional[str] = Field(default=None, description="Error message if invalid")

class UserContext(BaseModel):
    """User context for authenticated requests"""
    user_id: str = Field(description="User ID")
    email: str = Field(description="User email")
    name: str = Field(description="User name")
    role: str = Field(description="User role")
    permissions: List[str] = Field(description="User permissions")
    is_authenticated: bool = Field(default=True, description="Authentication status")

class AuthConfig(BaseModel):
    """Authentication configuration model"""
    jwt_algorithm: str = Field(description="JWT algorithm")
    token_expiry_hours: int = Field(description="Token expiry in hours")
    refresh_token_expiry_days: int = Field(description="Refresh token expiry in days")
    allowed_origins: List[str] = Field(description="Allowed CORS origins")
    require_email_verification: bool = Field(description="Whether email verification is required")
