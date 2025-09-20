import pytest
import os
from unittest.mock import patch
from app.config import Settings

def test_settings_default_values():
    """Test that settings have proper default values"""
    with patch.dict(os.environ, {}, clear=True):
        settings = Settings()
        assert settings.API_V1_STR == "/api/v1"
        assert settings.PROJECT_NAME == "B2B Influencer CRM"
        assert settings.VERSION == "1.0.0"
        assert settings.ENVIRONMENT == "development"
        assert settings.LOG_LEVEL == "INFO"

def test_settings_from_environment():
    """Test that settings can be loaded from environment variables"""
    env_vars = {
        "SUPABASE_URL": "https://test.supabase.co",
        "SUPABASE_KEY": "test_key",
        "API_V1_STR": "/api/v2",
        "PROJECT_NAME": "Test Project",
        "VERSION": "2.0.0",
        "ENVIRONMENT": "production",
        "LOG_LEVEL": "DEBUG"
    }
    
    with patch.dict(os.environ, env_vars, clear=True):
        settings = Settings()
        assert settings.SUPABASE_URL == "https://test.supabase.co"
        assert settings.SUPABASE_KEY == "test_key"
        assert settings.API_V1_STR == "/api/v2"
        assert settings.PROJECT_NAME == "Test Project"
        assert settings.VERSION == "2.0.0"
        assert settings.ENVIRONMENT == "production"
        assert settings.LOG_LEVEL == "DEBUG"

def test_allowed_origins_parsing():
    """Test that ALLOWED_ORIGINS is properly parsed from comma-separated string"""
    with patch.dict(os.environ, {"ALLOWED_ORIGINS": "http://localhost:3000,https://example.com,https://app.example.com"}, clear=True):
        settings = Settings()
        assert len(settings.ALLOWED_ORIGINS) == 3
        assert "http://localhost:3000" in settings.ALLOWED_ORIGINS
        assert "https://example.com" in settings.ALLOWED_ORIGINS
        assert "https://app.example.com" in settings.ALLOWED_ORIGINS
