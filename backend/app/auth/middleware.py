"""
Authentication Middleware
Handles JWT token validation and user context injection
"""
import logging
from typing import Optional, Dict, Any
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from app.auth.supabase_auth import SupabaseAuth

logger = logging.getLogger(__name__)

class AuthMiddleware:
    def __init__(self):
        self.supabase_auth = SupabaseAuth()
    
    async def __call__(self, request: Request, call_next):
        """
        Middleware to handle authentication for protected routes
        """
        # Skip authentication for public routes and OPTIONS requests (CORS preflight)
        if self._is_public_route(request.url.path) or request.method == "OPTIONS":
            response = await call_next(request)
            return response
        
        # Get token from Authorization header
        token = self._extract_token(request)
        
        if not token:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Authentication required"}
            )
        
        # Verify token and get user info
        user_info = await self.supabase_auth.verify_token(token)
        
        if not user_info:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid or expired token"}
            )
        
        # Add user info to request state
        request.state.user = user_info
        
        # Continue to the next middleware/route
        response = await call_next(request)
        return response
    
    def _is_public_route(self, path: str) -> bool:
        """
        Check if the route is public and doesn't require authentication
        """
        public_routes = [
            "/",
            "/docs",
            "/redoc",
            "/openapi.json",
            "/api/v1/health",
            "/api/v1/test-db",
            "/api/v1/auth/status",
            "/api/v1/influencers",
            "/api/v1/influencers/test"
        ]
        
        return path in public_routes or path.startswith("/api/v1/auth/")
    
    def _extract_token(self, request: Request) -> Optional[str]:
        """
        Extract JWT token from Authorization header
        """
        authorization = request.headers.get("Authorization")
        
        if not authorization:
            return None
        
        if not authorization.startswith("Bearer "):
            return None
        
        return authorization.split(" ")[1]

# Global auth middleware instance
auth_middleware = AuthMiddleware()
