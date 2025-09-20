import pytest
from unittest.mock import Mock, patch, AsyncMock
from fastapi import HTTPException
from app.auth.supabase_auth import SupabaseAuth
from app.auth.jwt_handler import JWTHandler
from app.auth.middleware import AuthMiddleware
from app.auth.dependencies import get_current_user, get_current_user_optional
from app.config import settings

class TestJWTHandler:
    """Test JWT token handling functionality"""
    
    def setup_method(self):
        """Reset singleton before each test"""
        JWTHandler._instance = None
    
    def test_jwt_handler_initialization(self):
        """Test JWT handler initializes with correct configuration"""
        with patch('app.auth.jwt_handler.jwt') as mock_jwt:
            handler = JWTHandler()
            assert handler.algorithm == "HS256"
            assert handler.secret_key == settings.SUPABASE_SERVICE_ROLE_KEY
    
    def test_jwt_handler_initialization_with_custom_config(self):
        """Test JWT handler initialization with custom configuration"""
        with patch('app.auth.jwt_handler.jwt') as mock_jwt:
            custom_secret = "custom_secret_key"
            custom_algorithm = "HS512"
            
            handler = JWTHandler(secret_key=custom_secret, algorithm=custom_algorithm)
            assert handler.secret_key == custom_secret
            assert handler.algorithm == custom_algorithm
    
    def test_encode_token(self):
        """Test JWT token encoding"""
        with patch('app.auth.jwt_handler.jwt') as mock_jwt:
            mock_jwt.encode.return_value = "encoded_token"
            
            with patch.object(settings, 'SUPABASE_SERVICE_ROLE_KEY', 'test_secret_key'):
                handler = JWTHandler()
                result = handler.encode_token({"user_id": "123", "email": "test@example.com"})
                
                mock_jwt.encode.assert_called_once()
                assert result == "encoded_token"
    
    def test_decode_token_success(self):
        """Test successful JWT token decoding"""
        with patch('app.auth.jwt_handler.jwt') as mock_jwt:
            mock_jwt.decode.return_value = {"user_id": "123", "email": "test@example.com"}
            
            with patch.object(settings, 'SUPABASE_SERVICE_ROLE_KEY', 'test_secret_key'):
                handler = JWTHandler()
                result = handler.decode_token("valid_token")
                
                mock_jwt.decode.assert_called_once()
                assert result["user_id"] == "123"
                assert result["email"] == "test@example.com"
    
    def test_decode_token_invalid(self):
        """Test JWT token decoding with invalid token"""
        with patch('app.auth.jwt_handler.jwt') as mock_jwt:
            from jwt.exceptions import InvalidTokenError
            mock_jwt.decode.side_effect = InvalidTokenError("Invalid token")
            
            with patch.object(settings, 'SUPABASE_SERVICE_ROLE_KEY', 'test_secret_key'):
                handler = JWTHandler()
                
                with pytest.raises(HTTPException) as exc_info:
                    handler.decode_token("invalid_token")
                
                assert exc_info.value.status_code == 401
                assert "Invalid token" in str(exc_info.value.detail)
    
    def test_verify_token_success(self):
        """Test successful token verification"""
        with patch('app.auth.jwt_handler.jwt') as mock_jwt:
            mock_jwt.decode.return_value = {"user_id": "123", "email": "test@example.com"}
            
            with patch.object(settings, 'SUPABASE_SERVICE_ROLE_KEY', 'test_secret_key'):
                handler = JWTHandler()
                result = handler.verify_token("valid_token")
                
                assert result is True
    
    def test_verify_token_failure(self):
        """Test token verification failure"""
        with patch('app.auth.jwt_handler.jwt') as mock_jwt:
            from jwt.exceptions import InvalidTokenError
            mock_jwt.decode.side_effect = InvalidTokenError("Invalid token")
            
            with patch.object(settings, 'SUPABASE_SERVICE_ROLE_KEY', 'test_secret_key'):
                handler = JWTHandler()
                result = handler.verify_token("invalid_token")
                
                assert result is False

class TestSupabaseAuth:
    """Test Supabase authentication integration"""
    
    def setup_method(self):
        """Reset singleton before each test"""
        SupabaseAuth._instance = None
    
    @pytest.mark.asyncio
    async def test_verify_token_success(self):
        """Test successful token verification with Supabase"""
        with patch('app.auth.supabase_auth.SupabaseClient') as mock_supabase_class:
            mock_client = Mock()
            mock_supabase_class.return_value = mock_client
            mock_client.get_client.return_value = mock_client
            mock_client.auth.get_user.return_value = Mock(
                user=Mock(id="123", email="test@example.com")
            )
            
            auth = SupabaseAuth()
            result = await auth.verify_token("valid_token")
            
            assert result["user_id"] == "123"
            assert result["email"] == "test@example.com"
    
    @pytest.mark.asyncio
    async def test_verify_token_failure(self):
        """Test token verification failure with Supabase"""
        with patch('app.auth.supabase_auth.SupabaseClient') as mock_supabase_class:
            mock_client = Mock()
            mock_supabase_class.return_value = mock_client
            mock_client.get_client.return_value = mock_client
            mock_client.auth.get_user.side_effect = Exception("Invalid token")
            
            auth = SupabaseAuth()
            
            with pytest.raises(HTTPException) as exc_info:
                await auth.verify_token("invalid_token")
            
            assert exc_info.value.status_code == 401
            assert "Token verification failed" in str(exc_info.value.detail)
    
    @pytest.mark.asyncio
    async def test_get_user_info_success(self):
        """Test successful user info retrieval"""
        with patch('app.auth.supabase_auth.SupabaseClient') as mock_supabase_class:
            mock_client = Mock()
            mock_supabase_class.return_value = mock_client
            mock_client.get_client.return_value = mock_client
            mock_client.auth.get_user.return_value = Mock(
                user=Mock(
                    id="123",
                    email="test@example.com",
                    user_metadata={"name": "Test User"}
                )
            )
            
            auth = SupabaseAuth()
            result = await auth.get_user_info("valid_token")
            
            assert result["user_id"] == "123"
            assert result["email"] == "test@example.com"
            assert result["name"] == "Test User"
    
    @pytest.mark.asyncio
    async def test_get_user_info_failure(self):
        """Test user info retrieval failure"""
        with patch('app.auth.supabase_auth.SupabaseClient') as mock_supabase_class:
            mock_client = Mock()
            mock_supabase_class.return_value = mock_client
            mock_client.get_client.return_value = mock_client
            mock_client.auth.get_user.side_effect = Exception("User not found")
            
            auth = SupabaseAuth()
            
            with pytest.raises(HTTPException) as exc_info:
                await auth.get_user_info("invalid_token")
            
            assert exc_info.value.status_code == 500
            assert "User information retrieval failed" in str(exc_info.value.detail)

class TestAuthMiddleware:
    """Test authentication middleware functionality"""
    
    def test_auth_middleware_initialization(self):
        """Test auth middleware initializes correctly"""
        middleware = AuthMiddleware()
        expected_paths = ["/", "/docs", "/redoc", "/openapi.json", "/api/v1/health", "/api/v1/test-db"]
        assert middleware.excluded_paths == expected_paths
    
    def test_should_skip_auth_excluded_paths(self):
        """Test that excluded paths skip authentication"""
        middleware = AuthMiddleware()
        
        assert middleware.should_skip_auth("/") is True
        assert middleware.should_skip_auth("/docs") is True
        assert middleware.should_skip_auth("/redoc") is True
        assert middleware.should_skip_auth("/openapi.json") is True
        assert middleware.should_skip_auth("/api/v1/health") is True
    
    def test_should_skip_auth_protected_paths(self):
        """Test that protected paths require authentication"""
        middleware = AuthMiddleware()
        
        assert middleware.should_skip_auth("/api/v1/users") is False
        assert middleware.should_skip_auth("/api/v1/influencers") is False
        assert middleware.should_skip_auth("/api/v1/campaigns") is False
    
    def test_extract_token_from_header_success(self):
        """Test successful token extraction from Authorization header"""
        middleware = AuthMiddleware()
        
        # Test Bearer token
        token = middleware.extract_token_from_header("Bearer valid_token")
        assert token == "valid_token"
        
        # Test token without Bearer prefix
        token = middleware.extract_token_from_header("valid_token")
        assert token == "valid_token"
    
    def test_extract_token_from_header_failure(self):
        """Test token extraction failure"""
        middleware = AuthMiddleware()
        
        # Test empty header
        token = middleware.extract_token_from_header("")
        assert token is None
        
        # Test None header
        token = middleware.extract_token_from_header(None)
        assert token is None

class TestAuthDependencies:
    """Test authentication dependency injection"""
    
    @pytest.mark.asyncio
    async def test_get_current_user_success(self):
        """Test successful current user retrieval"""
        # Create mock request with user in state
        mock_request = Mock()
        mock_request.state.user = {
            "user_id": "123",
            "email": "test@example.com",
            "name": "Test User"
        }
        
        result = await get_current_user(mock_request)
        
        assert result["user_id"] == "123"
        assert result["email"] == "test@example.com"
        assert result["name"] == "Test User"
    
    @pytest.mark.asyncio
    async def test_get_current_user_failure(self):
        """Test current user retrieval failure"""
        # Create mock request without user in state
        mock_request = Mock()
        mock_request.state.user = None
        
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(mock_request)
        
        assert exc_info.value.status_code == 401
        assert "Authentication required" in str(exc_info.value.detail)
    
    @pytest.mark.asyncio
    async def test_get_current_user_optional_success(self):
        """Test optional current user retrieval with valid token"""
        # Create mock request with user in state
        mock_request = Mock()
        mock_request.state.user = {
            "user_id": "123",
            "email": "test@example.com",
            "name": "Test User"
        }
        
        result = await get_current_user_optional(mock_request)
        
        assert result["user_id"] == "123"
        assert result["email"] == "test@example.com"
        assert result["name"] == "Test User"
    
    @pytest.mark.asyncio
    async def test_get_current_user_optional_failure(self):
        """Test optional current user retrieval with invalid token"""
        # Create mock request without user in state
        mock_request = Mock()
        mock_request.state.user = None
        
        result = await get_current_user_optional(mock_request)
        
        assert result is None
    
    @pytest.mark.asyncio
    async def test_get_current_user_optional_no_token(self):
        """Test optional current user retrieval with no token"""
        # Create mock request without user in state
        mock_request = Mock()
        mock_request.state.user = None
        
        result = await get_current_user_optional(mock_request)
        assert result is None
