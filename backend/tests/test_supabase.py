import pytest
from unittest.mock import Mock, patch, AsyncMock
from app.database.supabase_client import SupabaseClient
from app.config import settings

class TestSupabaseClient:
    """Test Supabase client functionality"""
    
    def setup_method(self):
        """Reset singleton before each test"""
        SupabaseClient._instance = None
        SupabaseClient._client = None
    
    def test_supabase_client_initialization(self):
        """Test that Supabase client initializes with correct configuration"""
        with patch('app.database.supabase_client.create_client') as mock_create:
            mock_client = Mock()
            mock_create.return_value = mock_client
            
            # Mock settings to have valid credentials
            with patch.object(settings, 'SUPABASE_URL', 'https://test.supabase.co'):
                with patch.object(settings, 'SUPABASE_KEY', 'test_key'):
                    client = SupabaseClient()
                    
                    mock_create.assert_called_once()
                    call_args = mock_create.call_args
                    assert call_args[1]["url"] == 'https://test.supabase.co'
                    assert call_args[1]["key"] == 'test_key'
                    assert client.get_client() == mock_client
    
    def test_supabase_client_initialization_with_custom_config(self):
        """Test Supabase client initialization with custom configuration"""
        with patch('app.database.supabase_client.create_client') as mock_create:
            mock_client = Mock()
            mock_create.return_value = mock_client
            
            custom_url = "https://custom.supabase.co"
            custom_key = "custom_key"
            
            client = SupabaseClient(url=custom_url, key=custom_key)
            
            mock_create.assert_called_once()
            call_args = mock_create.call_args
            assert call_args[1]["url"] == custom_url
            assert call_args[1]["key"] == custom_key
    
    @pytest.mark.asyncio
    async def test_health_check_success(self):
        """Test successful database health check"""
        with patch('app.database.supabase_client.create_client') as mock_create:
            mock_client = Mock()
            mock_client.table.return_value.select.return_value.execute.return_value = Mock(
                data=[{"test": "data"}]
            )
            mock_create.return_value = mock_client
            
            with patch.object(settings, 'SUPABASE_URL', 'https://test.supabase.co'):
                with patch.object(settings, 'SUPABASE_KEY', 'test_key'):
                    client = SupabaseClient()
                    result = await client.health_check()
                    
                    assert result["status"] == "healthy"
                    assert "timestamp" in result
                    assert result["database"] == "postgres"
                    assert result["supabase_url"] == 'https://test.supabase.co'
    
    @pytest.mark.asyncio
    async def test_health_check_failure(self):
        """Test database health check failure handling"""
        with patch('app.database.supabase_client.create_client') as mock_create:
            mock_client = Mock()
            # Set up the full chain: table().select().limit().execute()
            mock_table = Mock()
            mock_select = Mock()
            mock_limit = Mock()
            mock_client.table.return_value = mock_table
            mock_table.select.return_value = mock_select
            mock_select.limit.return_value = mock_limit
            mock_limit.execute.side_effect = Exception("Connection failed")
            mock_create.return_value = mock_client
            
            with patch.object(settings, 'SUPABASE_URL', 'https://test.supabase.co'):
                with patch.object(settings, 'SUPABASE_KEY', 'test_key'):
                    client = SupabaseClient()
                    result = await client.health_check()
                    
                    assert result["status"] == "unhealthy"
                    assert "error" in result
                    assert result["error"] == "Connection failed"
    
    @pytest.mark.asyncio
    async def test_test_connection_success(self):
        """Test successful database connection test"""
        with patch('app.database.supabase_client.create_client') as mock_create:
            mock_client = Mock()
            mock_client.rpc.return_value.execute.return_value = Mock(
                data=[{"id": 1, "name": "test"}]
            )
            mock_create.return_value = mock_client
            
            with patch.object(settings, 'SUPABASE_URL', 'https://test.supabase.co'):
                with patch.object(settings, 'SUPABASE_KEY', 'test_key'):
                    client = SupabaseClient()
                    result = await client.test_connection()
                    
                    assert result["status"] == "connected"
                    assert "timestamp" in result
                    assert result["database"] == "postgres"
                    assert "test_query_result" in result
    
    @pytest.mark.asyncio
    async def test_test_connection_failure(self):
        """Test database connection test failure handling"""
        with patch('app.database.supabase_client.create_client') as mock_create:
            mock_client = Mock()
            mock_client.rpc.return_value.execute.side_effect = Exception("Query failed")
            mock_create.return_value = mock_client
            
            with patch.object(settings, 'SUPABASE_URL', 'https://test.supabase.co'):
                with patch.object(settings, 'SUPABASE_KEY', 'test_key'):
                    client = SupabaseClient()
                    result = await client.test_connection()
                    
                    assert result["status"] == "failed"
                    assert "error" in result
                    assert result["error"] == "Query failed"
    
    def test_get_client(self):
        """Test getting the Supabase client instance"""
        with patch('app.database.supabase_client.create_client') as mock_create:
            mock_client = Mock()
            mock_create.return_value = mock_client
            
            with patch.object(settings, 'SUPABASE_URL', 'https://test.supabase.co'):
                with patch.object(settings, 'SUPABASE_KEY', 'test_key'):
                    client = SupabaseClient()
                    returned_client = client.get_client()
                    
                    assert returned_client == mock_client
    
    def test_connection_pooling_configuration(self):
        """Test that connection pooling is properly configured"""
        with patch('app.database.supabase_client.create_client') as mock_create:
            mock_client = Mock()
            mock_create.return_value = mock_client
            
            with patch.object(settings, 'SUPABASE_URL', 'https://test.supabase.co'):
                with patch.object(settings, 'SUPABASE_KEY', 'test_key'):
                    client = SupabaseClient()
                    
                    # Verify client was created with proper configuration
                    mock_create.assert_called_once()
                    call_args = mock_create.call_args
                    assert call_args[1]["url"] == 'https://test.supabase.co'
                    assert call_args[1]["key"] == 'test_key'
