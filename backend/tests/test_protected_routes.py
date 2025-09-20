import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock
from app.main import app

client = TestClient(app)

class TestProtectedRoutes:
    """Test protected route functionality"""
    
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
        assert "Authentication required" in response.json()["detail"]
        
        # Test /api/v1/auth/me/detailed without token
        response = client.get("/api/v1/auth/me/detailed")
        assert response.status_code == 401
        
        # Test /api/v1/auth/permissions without token
        response = client.get("/api/v1/auth/permissions")
        assert response.status_code == 401
    
    @patch('app.auth.middleware.AuthMiddleware')
    def test_auth_endpoints_with_valid_token(self, mock_middleware_class):
        """Test auth endpoints with valid authentication"""
        # Mock middleware to allow authentication
        mock_middleware = Mock()
        mock_middleware_class.return_value = mock_middleware
        mock_middleware.should_skip_auth.return_value = False
        mock_middleware.is_auth_available.return_value = True
        
        # Mock the middleware call method to set user in request state
        async def mock_middleware_call(request, call_next):
            # Set user in request state
            request.state.user = {
                "user_id": "123",
                "email": "test@example.com",
                "name": "Test User",
                "avatar_url": "",
                "email_verified": True,
                "created_at": "2024-01-01T00:00:00Z",
                "role": "user",
                "provider": "email",
                "app_metadata": {"role": "user", "permissions": []},
                "user_metadata": {"name": "Test User"}
            }
            request.state.token = "valid_token"
            return await call_next(request)
        
        mock_middleware.__call__ = mock_middleware_call
        
        # Test /api/v1/auth/me
        response = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer valid_token"})
        assert response.status_code == 200
        data = response.json()
        assert data["user_id"] == "123"
        assert data["email"] == "test@example.com"
        assert data["name"] == "Test User"
    
    @patch('app.auth.middleware.SupabaseAuth')
    def test_auth_permissions_endpoint(self, mock_auth_class):
        """Test auth permissions endpoint"""
        # Mock successful authentication
        mock_auth = Mock()
        mock_auth_class.return_value = mock_auth
        mock_auth.verify_token.return_value = {
            "user_id": "123",
            "email": "test@example.com",
            "app_metadata": {"role": "admin", "permissions": ["read", "write", "delete"]},
            "email_verified": True
        }
        
        # Mock middleware to set user in request state
        with patch('app.auth.middleware.AuthMiddleware.authenticate_request') as mock_auth_middleware:
            mock_auth_middleware.return_value = {
                "user_id": "123",
                "email": "test@example.com",
                "app_metadata": {"role": "admin", "permissions": ["read", "write", "delete"]},
                "email_verified": True
            }
            
            # Test /api/v1/auth/permissions
            response = client.get("/api/v1/auth/permissions", headers={"Authorization": "Bearer valid_token"})
            assert response.status_code == 200
            data = response.json()
            assert data["role"] == "admin"
            assert data["is_admin"] is True
            assert data["can_manage_users"] is True
    
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
    
    @patch('app.auth.middleware.SupabaseAuth')
    def test_auth_status_endpoint(self, mock_auth_class):
        """Test auth status endpoint"""
        # Mock auth service
        mock_auth = Mock()
        mock_auth_class.return_value = mock_auth
        mock_auth.get_auth_status.return_value = {
            "available": True,
            "supabase_connected": True,
            "supabase_url": "https://test.supabase.co",
            "has_service_key": True
        }
        
        # Test /api/v1/auth/status
        response = client.get("/api/v1/auth/status")
        assert response.status_code == 200
        data = response.json()
        assert data["available"] is True
        assert data["supabase_connected"] is True
    
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
        assert "Authorization header missing" in response.json()["detail"]
    
    @patch('app.auth.middleware.SupabaseAuth')
    def test_logout_endpoint(self, mock_auth_class):
        """Test logout endpoint"""
        # Mock auth service
        mock_auth = Mock()
        mock_auth_class.return_value = mock_auth
        mock_auth.revoke_token.return_value = True
        
        # Mock middleware to set token in request state
        with patch('app.auth.middleware.AuthMiddleware.authenticate_request') as mock_auth_middleware:
            mock_auth_middleware.return_value = {
                "user_id": "123",
                "email": "test@example.com"
            }
            
            # Mock request state
            with patch('app.api.v1.auth.getattr') as mock_getattr:
                mock_getattr.return_value = "valid_token"
                
                # Test /api/v1/auth/logout
                response = client.post("/api/v1/auth/logout", headers={"Authorization": "Bearer valid_token"})
                assert response.status_code == 200
                data = response.json()
                assert data["message"] == "Logged out successfully"
