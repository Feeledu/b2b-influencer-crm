"""
Application Configuration
"""
import os
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    VERSION: str = "1.0.0"
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    
    # Supabase Configuration
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_KEY: Optional[str] = None
    
    # Database Configuration
    SUPABASE_HOST: Optional[str] = None
    SUPABASE_PORT: int = 5432
    SUPABASE_DB: str = "postgres"
    SUPABASE_USER: str = "postgres"
    SUPABASE_PASSWORD: Optional[str] = None
    
    # JWT Configuration
    JWT_SECRET_KEY: Optional[str] = None
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS Configuration - Updated to include port 8080
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:8080,http://localhost:8081,https://app.b2binfluencer.com"
    
    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    def validate_required_settings(self):
        """Validate that required settings are present"""
        required_fields = [
            'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_KEY',
            'SUPABASE_HOST', 'SUPABASE_PASSWORD', 'JWT_SECRET_KEY'
        ]
        
        missing_fields = []
        for field in required_fields:
            if not getattr(self, field):
                missing_fields.append(field)
        
        if missing_fields:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_fields)}")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings()

# Validate settings on import
try:
    settings.validate_required_settings()
except ValueError as e:
    print(f"Configuration error: {e}")
    print("Please check your .env file and ensure all required variables are set.")
