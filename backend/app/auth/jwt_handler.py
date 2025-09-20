"""
JWT token handling module for authentication.
Provides JWT encoding, decoding, and verification functionality.
"""
import logging
from typing import Dict, Any, Optional
from fastapi import HTTPException
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from app.config import settings

logger = logging.getLogger(__name__)

class JWTHandler:
    """
    JWT token handler for encoding, decoding, and verifying tokens.
    
    This class provides a singleton pattern for JWT operations
    and includes methods for token validation and user data extraction.
    """
    
    _instance: Optional['JWTHandler'] = None
    
    def __new__(cls, secret_key: Optional[str] = None, algorithm: str = "HS256") -> 'JWTHandler':
        """Singleton pattern to ensure single JWT handler instance"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self, secret_key: Optional[str] = None, algorithm: str = "HS256"):
        """Initialize JWT handler with configuration"""
        if not hasattr(self, '_initialized'):
            self.secret_key = secret_key or settings.SUPABASE_SERVICE_ROLE_KEY
            self.algorithm = algorithm
            self._initialized = True
            
            if not self.secret_key:
                logger.warning("JWT secret key not configured. Authentication will be limited.")
    
    def encode_token(self, payload: Dict[str, Any]) -> str:
        """
        Encode a payload into a JWT token.
        
        Args:
            payload: Dictionary containing user data to encode
            
        Returns:
            Encoded JWT token string
            
        Raises:
            HTTPException: If encoding fails
        """
        try:
            if not self.secret_key:
                raise HTTPException(status_code=500, detail="JWT secret key not configured")
            
            token = jwt.encode(
                payload,
                self.secret_key,
                algorithm=self.algorithm
            )
            
            logger.debug(f"JWT token encoded successfully for user: {payload.get('user_id', 'unknown')}")
            return token
            
        except Exception as e:
            logger.error(f"JWT encoding failed: {str(e)}")
            raise HTTPException(status_code=500, detail="Token encoding failed")
    
    def decode_token(self, token: str) -> Dict[str, Any]:
        """
        Decode a JWT token and return the payload.
        
        Args:
            token: JWT token string to decode
            
        Returns:
            Decoded payload dictionary
            
        Raises:
            HTTPException: If decoding fails or token is invalid
        """
        try:
            if not self.secret_key:
                raise HTTPException(status_code=500, detail="JWT secret key not configured")
            
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm]
            )
            
            logger.debug(f"JWT token decoded successfully for user: {payload.get('user_id', 'unknown')}")
            return payload
            
        except ExpiredSignatureError:
            logger.warning("JWT token has expired")
            raise HTTPException(status_code=401, detail="Token has expired")
        except InvalidTokenError as e:
            logger.warning(f"Invalid JWT token: {str(e)}")
            raise HTTPException(status_code=401, detail="Invalid token")
        except Exception as e:
            logger.error(f"JWT decoding failed: {str(e)}")
            raise HTTPException(status_code=500, detail="Token decoding failed")
    
    def verify_token(self, token: str) -> bool:
        """
        Verify if a JWT token is valid without raising exceptions.
        
        Args:
            token: JWT token string to verify
            
        Returns:
            True if token is valid, False otherwise
        """
        try:
            self.decode_token(token)
            return True
        except HTTPException:
            return False
    
    def get_user_id_from_token(self, token: str) -> Optional[str]:
        """
        Extract user ID from a JWT token.
        
        Args:
            token: JWT token string
            
        Returns:
            User ID if found, None otherwise
        """
        try:
            payload = self.decode_token(token)
            return payload.get("user_id") or payload.get("sub")
        except HTTPException:
            return None
    
    def get_user_email_from_token(self, token: str) -> Optional[str]:
        """
        Extract user email from a JWT token.
        
        Args:
            token: JWT token string
            
        Returns:
            User email if found, None otherwise
        """
        try:
            payload = self.decode_token(token)
            return payload.get("email")
        except HTTPException:
            return None
    
    def is_token_expired(self, token: str) -> bool:
        """
        Check if a JWT token is expired.
        
        Args:
            token: JWT token string
            
        Returns:
            True if token is expired, False otherwise
        """
        try:
            payload = self.decode_token(token)
            return False  # If decode succeeds, token is not expired
        except HTTPException as e:
            if e.status_code == 401 and "expired" in str(e.detail).lower():
                return True
            return False
    
    def get_token_info(self, token: str) -> Dict[str, Any]:
        """
        Get comprehensive token information.
        
        Args:
            token: JWT token string
            
        Returns:
            Dictionary containing token information
        """
        try:
            payload = self.decode_token(token)
            return {
                "valid": True,
                "expired": False,
                "user_id": payload.get("user_id") or payload.get("sub"),
                "email": payload.get("email"),
                "payload": payload
            }
        except HTTPException as e:
            return {
                "valid": False,
                "expired": e.status_code == 401 and "expired" in str(e.detail).lower(),
                "error": str(e.detail),
                "user_id": None,
                "email": None,
                "payload": None
            }
