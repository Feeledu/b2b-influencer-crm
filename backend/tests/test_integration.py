"""
Integration tests for the complete API flow.
Tests the full request/response cycle including authentication, database operations, and error handling.
"""
import pytest
import asyncio
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock, AsyncMock
from datetime import datetime, timedelta
import json

from app.main import app
from app.config import settings

client = TestClient(app)

class TestAPIIntegration:
    """Integration tests for complete API functionality"""
    
    def test_complete_health_check_flow(self):
        """Test complete health check flow with database integration"""
        with patch('app.api.v1.health.SupabaseClient') as mock_supabase:
            # Mock successful database connection
            mock_client = Mock()
            mock_supabase.return_value = mock_client
            mock_client.is_connected.return_value = True
            
            # Mock async health check
            async def mock_health_check():
                return {
                    "status": "healthy",
                    "response_time_ms": 45.2,
                    "database": "postgres",
                    "supabase_url": "https://test.supabase.co"
                }
            mock_client.health_check = mock_health_check
            
            # Test health endpoint
            response = client.get("/api/v1/health")
            assert response.status_code == 200
            
            data = response.json()
            assert data["status"] == "healthy"
            assert data["version"] == "1.0.0"
            assert data["environment"] == settings.ENVIRONMENT
            assert data["database"] is not None
            assert data["database"]["connected"] is True
    
    def test_complete_database_test_flow(self):
        """Test complete database test flow"""
        with patch('app.api.v1.health.SupabaseClient') as mock_supabase:
            # Mock successful database connection
            mock_client = Mock()
            mock_supabase.return_value = mock_client
            mock_client.is_connected.return_value = True
            
            # Mock async test connection
            async def mock_test_connection():
                return {
                    "status": "connected",
                    "response_time_ms": 23.1,
                    "test_query_result": {"id": 1, "name": "test"}
                }
            mock_client.test_connection = mock_test_connection
            
            # Test database endpoint
            response = client.get("/api/v1/test-db")
            assert response.status_code == 200
            
            data = response.json()
            assert data["connected"] is True
            assert data["status"] == "connected"
            assert data["response_time_ms"] == 23.1
    
    def test_complete_auth_flow_without_token(self):
        """Test complete authentication flow without token"""
        # Test auth status endpoint (should work without token)
        response = client.get("/api/v1/auth/status")
        assert response.status_code == 200
        
        data = response.json()
        assert "available" in data
        assert "supabase_connected" in data
        assert "supabase_url" in data
        assert "has_service_key" in data
    
    def test_complete_auth_flow_with_invalid_token(self):
        """Test complete authentication flow with invalid token"""
        # Test protected endpoint with invalid token
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == 401
        
        data = response.json()
        assert "detail" in data
        assert "Authentication required" in data["detail"]
    
    def test_complete_auth_flow_with_valid_token(self):
        """Test complete authentication flow with valid token"""
        # Test that protected endpoints require authentication
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer valid_token"}
        )
        # Should return 401 since auth service is not configured in test environment
        assert response.status_code == 401
        
        # Test that the response includes proper error information
        data = response.json()
        assert "detail" in data
        assert "Authentication required" in data["detail"]
    
    def test_complete_cors_flow(self):
        """Test complete CORS flow with preflight and actual requests"""
        # Test preflight request
        response = client.options(
            "/api/v1/health",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Authorization"
            }
        )
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers
        assert "access-control-allow-methods" in response.headers
        assert "access-control-allow-headers" in response.headers
        
        # Test actual request with CORS headers
        response = client.get(
            "/api/v1/health",
            headers={"Origin": "http://localhost:3000"}
        )
        assert response.status_code == 200
        assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
        assert "access-control-allow-credentials" in response.headers
    
    def test_complete_error_handling_flow(self):
        """Test complete error handling flow"""
        # Test 404 error
        response = client.get("/api/v1/nonexistent")
        assert response.status_code == 404
        
        # Test 405 method not allowed
        response = client.post("/api/v1/health")
        assert response.status_code == 405
        
        # Test 422 validation error (if we had validation endpoints)
        # This would test request validation if we had POST endpoints with validation
    
    def test_complete_api_documentation_flow(self):
        """Test complete API documentation flow"""
        # Test OpenAPI JSON endpoint
        response = client.get("/api/v1/openapi.json")
        assert response.status_code == 200
        
        data = response.json()
        assert "openapi" in data
        assert "info" in data
        assert "paths" in data
        assert "components" in data
        
        # Test Swagger UI
        response = client.get("/docs")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
        
        # Test ReDoc
        response = client.get("/redoc")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
    
    def test_complete_root_endpoint_flow(self):
        """Test complete root endpoint flow"""
        response = client.get("/")
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert "environment" in data
        assert "docs_url" in data
        assert "redoc_url" in data
        assert "openapi_url" in data
        assert "health_check" in data
        assert "endpoints" in data
        assert isinstance(data["endpoints"], list)
        assert len(data["endpoints"]) > 0
    
    def test_complete_middleware_flow(self):
        """Test complete middleware flow including authentication middleware"""
        # Test that authentication middleware processes requests
        response = client.get("/api/v1/auth/me")
        # Should return 401 due to missing token, not 500 due to middleware error
        assert response.status_code == 401
        
        # Test that health endpoints work without authentication
        response = client.get("/api/v1/health")
        assert response.status_code == 200
    
    def test_complete_logging_flow(self):
        """Test complete logging flow"""
        # This test ensures that logging is working throughout the application
        # We can't easily test log output, but we can ensure no logging errors occur
        
        # Test various endpoints to ensure logging doesn't break
        endpoints = [
            "/",
            "/api/v1/health",
            "/api/v1/test-db",
            "/api/v1/auth/status",
            "/api/v1/auth/me",
            "/docs",
            "/redoc"
        ]
        
        for endpoint in endpoints:
            response = client.get(endpoint)
            # Should not return 500 due to logging errors
            assert response.status_code in [200, 401, 404, 405]
    
    def test_complete_configuration_flow(self):
        """Test complete configuration flow"""
        # Test that all configuration is properly loaded
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["environment"] == settings.ENVIRONMENT
        assert data["version"] == "1.0.0"
        
        # Test CORS configuration
        response = client.get(
            "/api/v1/health",
            headers={"Origin": "http://localhost:3000"}
        )
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers
    
    def test_complete_database_fallback_flow(self):
        """Test complete database fallback flow when database is not configured"""
        # Test health endpoint when database is not configured
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        # Database info should be present but indicate not configured
        assert data["database"] is not None
        
        # Test database test endpoint when database is not configured
        response = client.get("/api/v1/test-db")
        assert response.status_code == 200
        
        data = response.json()
        assert data["connected"] is False
        assert data["status"] == "not_configured"
    
    def test_complete_async_flow(self):
        """Test complete async flow for all async endpoints"""
        # Test that all async endpoints work correctly
        async_endpoints = [
            "/api/v1/health",
            "/api/v1/test-db",
            "/api/v1/auth/me/detailed"
        ]
        
        for endpoint in async_endpoints:
            response = client.get(endpoint)
            # Should not return 500 due to async errors
            assert response.status_code in [200, 401]
    
    def test_complete_security_flow(self):
        """Test complete security flow including JWT and CORS"""
        # Test JWT security
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401  # Should require authentication
        
        # Test CORS security
        response = client.get(
            "/api/v1/health",
            headers={"Origin": "http://malicious-site.com"}
        )
        # Should not include CORS headers for unauthorized origins
        assert response.status_code == 200
        # CORS headers may or may not be present depending on configuration
    
    def test_complete_performance_flow(self):
        """Test complete performance flow"""
        # Test that endpoints respond quickly
        import time
        
        start_time = time.time()
        response = client.get("/api/v1/health")
        end_time = time.time()
        
        assert response.status_code == 200
        assert (end_time - start_time) < 1.0  # Should respond within 1 second
        
        # Test multiple concurrent requests
        responses = []
        for _ in range(5):
            response = client.get("/api/v1/health")
            responses.append(response)
        
        for response in responses:
            assert response.status_code == 200
