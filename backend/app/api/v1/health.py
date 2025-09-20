from fastapi import APIRouter, HTTPException
from datetime import datetime
import logging
from typing import Dict, Any

from app.config import settings
from app.database.supabase_client import SupabaseClient
from app.schemas.common import HealthResponse, DatabaseStatus

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/health",
            response_model=HealthResponse,
            summary="Health Check",
            description="Check the health status of the API and its dependencies",
            response_description="Health status information")
async def health_check():
    """
    Health check endpoint for monitoring and load balancer health checks.
    Includes database connectivity check.
    """
    try:
        # Basic application health
        health_data = {
            "status": "healthy",
            "timestamp": datetime.utcnow(),
            "version": "1.0.0",
            "environment": settings.ENVIRONMENT
        }
        
        # Add database health check if Supabase is configured
        database_info = None
        try:
            supabase_client = SupabaseClient()
            if supabase_client.is_connected():
                db_health = await supabase_client.health_check()
                database_info = {
                    "status": db_health.get("status", "unknown"),
                    "connected": True,
                    "response_time_ms": db_health.get("response_time_ms")
                }
            else:
                database_info = {
                    "status": "not_configured",
                    "connected": False,
                    "message": "Supabase credentials not configured"
                }
        except Exception as db_error:
            logger.warning(f"Database health check failed: {str(db_error)}")
            database_info = {
                "status": "unavailable",
                "connected": False,
                "error": str(db_error)
            }
        
        return HealthResponse(
            status="healthy",
            message="Service is healthy",
            timestamp=datetime.utcnow(),
            version="1.0.0",
            environment=settings.ENVIRONMENT,
            database=database_info
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Health check failed")

@router.get("/test-db",
            response_model=DatabaseStatus,
            summary="Database Test",
            description="Test database connection and basic operations",
            response_description="Database connection test results")
async def test_database():
    """
    Test database connection and basic operations.
    Provides detailed database connectivity information.
    """
    try:
        # Try to test database connection
        try:
            supabase_client = SupabaseClient()
            if supabase_client.is_connected():
                db_test = await supabase_client.test_connection()
                return DatabaseStatus(
                    connected=True,
                    status=db_test.get("status", "unknown"),
                    response_time_ms=db_test.get("response_time_ms"),
                    connection_info=db_test.get("connection_info")
                )
            else:
                return DatabaseStatus(
                    connected=False,
                    status="not_configured",
                    connection_info=supabase_client.get_connection_info()
                )
        except Exception as db_error:
            logger.warning(f"Database test failed: {str(db_error)}")
            return DatabaseStatus(
                connected=False,
                status="error",
                connection_info={"error": str(db_error)}
            )
            
    except Exception as e:
        logger.error(f"Database test failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Database connection failed")
