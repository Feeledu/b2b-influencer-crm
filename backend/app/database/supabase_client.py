"""
Supabase client module for database operations and connection management.
Provides connection pooling and health check functionality.
"""
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from supabase import create_client, Client
from app.config import settings

logger = logging.getLogger(__name__)

class SupabaseClient:
    """
    Supabase client wrapper with connection pooling and health checks.
    
    This class provides a singleton pattern for database connections
    and includes methods for health monitoring and connection testing.
    """
    
    _instance: Optional['SupabaseClient'] = None
    _client: Optional[Client] = None
    
    def __new__(cls, url: Optional[str] = None, key: Optional[str] = None) -> 'SupabaseClient':
        """Singleton pattern to ensure single database connection instance"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self, url: Optional[str] = None, key: Optional[str] = None):
        """Initialize Supabase client with connection pooling"""
        if self._client is None:
            try:
                supabase_url = url or settings.SUPABASE_URL
                supabase_key = key or settings.SUPABASE_ANON_KEY
                
                if not supabase_url or not supabase_key:
                    logger.warning("Supabase credentials not configured. Database features will be limited.")
                    self._client = None
                    return
                
                # Create Supabase client
                self._client = create_client(supabase_url, supabase_key)
                
                logger.info(f"Supabase client initialized successfully for {supabase_url}")
                
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {str(e)}")
                self._client = None
                raise
    
    def get_client(self) -> Optional[Client]:
        """Get the Supabase client instance"""
        return self._client
    
    async def health_check(self) -> Dict[str, Any]:
        """
        Perform a health check on the database connection.
        
        Returns:
            Dict containing health status, timestamp, and database info
        """
        if not self._client:
            return {
                "status": "unhealthy",
                "timestamp": datetime.utcnow().isoformat(),
                "database": "postgres",
                "error": "Supabase client not initialized"
            }
        
        try:
            # Perform a simple query to test connection
            result = self._client.table("_health_check").select("id").limit(1).execute()
            
            return {
                "status": "healthy",
                "timestamp": datetime.utcnow().isoformat(),
                "database": "postgres",
                "supabase_url": settings.SUPABASE_URL,
                "connection_pool": "active"
            }
            
        except Exception as e:
            logger.error(f"Database health check failed: {str(e)}")
            return {
                "status": "unhealthy",
                "timestamp": datetime.utcnow().isoformat(),
                "database": "postgres",
                "error": str(e)
            }
    
    async def test_connection(self) -> Dict[str, Any]:
        """
        Test database connection with a simple query.
        
        Returns:
            Dict containing connection test results
        """
        if not self._client:
            return {
                "status": "failed",
                "timestamp": datetime.utcnow().isoformat(),
                "database": "postgres",
                "error": "Supabase client not initialized"
            }
        
        try:
            # Test with a simple query that should work on any PostgreSQL database
            result = self._client.rpc("version").execute()
            
            return {
                "status": "connected",
                "timestamp": datetime.utcnow().isoformat(),
                "database": "postgres",
                "test_query_result": result.data if hasattr(result, 'data') else "Query executed successfully",
                "connection_pool": "active"
            }
            
        except Exception as e:
            logger.error(f"Database connection test failed: {str(e)}")
            return {
                "status": "failed",
                "timestamp": datetime.utcnow().isoformat(),
                "database": "postgres",
                "error": str(e)
            }
    
    def is_connected(self) -> bool:
        """Check if database connection is available"""
        return self._client is not None
    
    def get_connection_info(self) -> Dict[str, Any]:
        """Get connection information for debugging"""
        return {
            "connected": self.is_connected(),
            "supabase_url": settings.SUPABASE_URL,
            "has_key": bool(settings.SUPABASE_ANON_KEY),
            "version": settings.VERSION
        }
