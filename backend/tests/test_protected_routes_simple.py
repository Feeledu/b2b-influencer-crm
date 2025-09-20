import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock
from app.main import app

client = TestClient(app)

class TestProtectedRoutesSimple:
    """Test protected route functionality with simplified tests"""
    
    def setup_method(self):
        """Reset singletons before each test"""
        from app.auth.supabase_auth import SupabaseAuth
        from app.auth.jwt_handler import JWTHandler
        SupabaseAuth._instance = None
        JWTHandler._instance = None
    
    def test_auth_endpoints_require_authentication(self):
        """Test that auth endpoints require authentication"""
        # Test /api/v1/auth/me without token
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401
        
        # Test /api/v1/auth/me/detailed without token
        response = client.get("/api/v1/auth/me/detailed")
        assert response.status_code == 401
        
        # Test /api/v1/auth/permissions without token
        response = client.get("/api/v1/auth/permissions")
        assert response.status_code == 401
    
    def test_public_endpoints_accessible_without_auth(self):
        """Test that public endpoints are accessible without authentication"""
        # Test root endpoint
        response = client.get("/")
        assert response.status_code == 200
        
        # Test health endpoint
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        
        # Test docs endpoint
        response = client.get("/docs")
        assert response.status_code == 200
        
        # Test redoc endpoint
        response = client.get("/redoc")
        assert response.status_code == 200
    
    def test_auth_status_endpoint_accessible(self):
        """Test auth status endpoint is accessible"""
        response = client.get("/api/v1/auth/status")
        assert response.status_code == 200
        data = response.json()
        assert "available" in data
        assert "supabase_connected" in data
    
    def test_invalid_token_returns_401(self):
        """Test that invalid tokens return 401"""
        # Test with invalid token
        response = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer invalid_token"})
        assert response.status_code == 401
        
        # Test with malformed header
        response = client.get("/api/v1/auth/me", headers={"Authorization": "InvalidFormat token"})
        assert response.status_code == 401
    
    def test_missing_authorization_header_returns_401(self):
        """Test that missing authorization header returns 401"""
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401
        assert "Authentication required" in response.json()["detail"]
