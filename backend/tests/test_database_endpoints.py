import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock
from app.main import app

client = TestClient(app)

class TestDatabaseEndpoints:
    """Test database-related API endpoints"""
    
    def setup_method(self):
        """Reset SupabaseClient singleton before each test"""
        from app.database.supabase_client import SupabaseClient
        SupabaseClient._instance = None
        SupabaseClient._client = None
    
    @patch('app.api.v1.health.SupabaseClient')
    def test_health_check_endpoint_success(self, mock_supabase_class):
        """Test health check endpoint with successful database connection"""
        mock_client = Mock()
        mock_supabase_class.return_value = mock_client
        mock_client.is_connected.return_value = True
        
        # Mock async method as coroutine
        async def mock_health_check():
            return {
                "status": "healthy",
                "timestamp": "2024-01-01T00:00:00Z",
                "database": "postgres",
                "supabase_url": "https://test.supabase.co"
            }
        mock_client.health_check = mock_health_check
        
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert data["database"] == "postgres"
    
    @patch('app.api.v1.health.SupabaseClient')
    def test_health_check_endpoint_failure(self, mock_supabase_class):
        """Test health check endpoint with database connection failure"""
        mock_client = Mock()
        mock_supabase_class.return_value = mock_client
        mock_client.is_connected.return_value = True
        
        # Mock async method as coroutine
        async def mock_health_check():
            return {
                "status": "unhealthy",
                "error": "Connection failed"
            }
        mock_client.health_check = mock_health_check
        
        response = client.get("/api/v1/health")
        assert response.status_code == 200  # Health endpoint should return 200 even if unhealthy
        data = response.json()
        assert data["status"] == "unhealthy"
        assert "error" in data
    
    @patch('app.api.v1.health.SupabaseClient')
    def test_database_test_endpoint_success(self, mock_supabase_class):
        """Test database test endpoint with successful connection"""
        mock_client = Mock()
        mock_supabase_class.return_value = mock_client
        mock_client.is_connected.return_value = True
        
        # Mock async method as coroutine
        async def mock_test_connection():
            return {
                "status": "connected",
                "timestamp": "2024-01-01T00:00:00Z",
                "database": "postgres",
                "test_query_result": {"id": 1, "name": "test"}
            }
        mock_client.test_connection = mock_test_connection
        
        response = client.get("/api/v1/test-db")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "connected"
        assert "timestamp" in data
        assert data["database"] == "postgres"
        assert "test_query_result" in data
    
    @patch('app.api.v1.health.SupabaseClient')
    def test_database_test_endpoint_failure(self, mock_supabase_class):
        """Test database test endpoint with connection failure"""
        mock_client = Mock()
        mock_supabase_class.return_value = mock_client
        mock_client.is_connected.return_value = True
        
        # Mock async method as coroutine
        async def mock_test_connection():
            return {
                "status": "failed",
                "error": "Query failed"
            }
        mock_client.test_connection = mock_test_connection
        
        response = client.get("/api/v1/test-db")
        assert response.status_code == 200  # Test endpoint should return 200 even if failed
        data = response.json()
        assert data["status"] == "failed"
        assert "error" in data
    
    def test_health_endpoint_without_database(self):
        """Test health endpoint when database is not configured"""
        with patch('app.api.v1.health.SupabaseClient') as mock_supabase_class:
            mock_supabase_class.side_effect = Exception("Supabase not configured")
            
            response = client.get("/api/v1/health")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"  # Basic health check should still work
            assert "timestamp" in data
    
    def test_database_test_endpoint_without_database(self):
        """Test database test endpoint when database is not configured"""
        with patch('app.api.v1.health.SupabaseClient') as mock_supabase_class:
            mock_supabase_class.side_effect = Exception("Supabase not configured")
            
            response = client.get("/api/v1/test-db")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "connected"  # Should fallback to basic test
            assert "message" in data
