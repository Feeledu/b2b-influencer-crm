"""
Admin analytics API endpoints.
Provides platform analytics and user management for administrators.
"""
import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.auth.dependencies import get_current_user
from app.database.supabase_client import SupabaseClient
from app.schemas.common import BaseResponse, PaginatedResponse
from pydantic import BaseModel, Field
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

# Pydantic models for request/response
class UserAnalytics(BaseModel):
    user_id: str
    email: str
    name: str
    total_influencers: int
    partnered_influencers: int
    total_campaigns: int
    active_campaigns: int
    total_interactions: int
    avg_relationship_strength: float
    last_activity: Optional[datetime] = None

class PlatformSummary(BaseModel):
    total_users: int
    active_users: int
    total_platform_influencers: int
    total_partnered_influencers: int
    total_platform_campaigns: int
    total_active_campaigns: int
    total_platform_interactions: int
    platform_avg_relationship_strength: float
    total_high_quality_relationships: int
    platform_last_activity: Optional[datetime] = None

class StatusDistribution(BaseModel):
    metric_type: str
    status_value: str
    count: int
    percentage: float

@router.get("/analytics",
            response_model=PlatformSummary,
            summary="Get Platform Analytics",
            description="Get high-level platform analytics and summary statistics",
            response_description="Platform analytics summary")
async def get_platform_analytics(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get platform analytics summary"""
    try:
        # Check if user is admin
        user_role = current_user.get("role", "user")
        if user_role != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        
        # Get platform summary from admin_analytics view
        result = supabase.table("platform_summary").select("*").execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Analytics data not available")
        
        analytics_data = result.data[0]
        
        return PlatformSummary(
            total_users=analytics_data.get("total_users", 0),
            active_users=analytics_data.get("active_users", 0),
            total_platform_influencers=analytics_data.get("total_platform_influencers", 0),
            total_partnered_influencers=analytics_data.get("total_partnered_influencers", 0),
            total_platform_campaigns=analytics_data.get("total_platform_campaigns", 0),
            total_active_campaigns=analytics_data.get("total_active_campaigns", 0),
            total_platform_interactions=analytics_data.get("total_platform_interactions", 0),
            platform_avg_relationship_strength=analytics_data.get("platform_avg_relationship_strength", 0.0),
            total_high_quality_relationships=analytics_data.get("total_high_quality_relationships", 0),
            platform_last_activity=analytics_data.get("platform_last_activity")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting platform analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get platform analytics")

@router.get("/users",
            response_model=PaginatedResponse,
            summary="List Users with Analytics",
            description="Get paginated list of users with their analytics data",
            response_description="Paginated list of user analytics")
async def list_users_analytics(
    current_user: Dict[str, Any] = Depends(get_current_user),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    sort_by: Optional[str] = Query("total_influencers", description="Sort by field"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$", description="Sort order")
):
    """Get paginated list of users with analytics"""
    try:
        # Check if user is admin
        user_role = current_user.get("role", "user")
        if user_role != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        
        # Get user analytics from admin_analytics view
        query = supabase.table("admin_analytics").select("*")
        
        # Apply sorting
        if sort_by in ["total_influencers", "partnered_influencers", "total_campaigns", "active_campaigns", "total_interactions", "avg_relationship_strength", "last_activity"]:
            order_desc = sort_order == "desc"
            query = query.order(sort_by, desc=order_desc)
        else:
            query = query.order("total_influencers", desc=True)
        
        # Apply pagination
        offset = (page - 1) * limit
        query = query.range(offset, offset + limit - 1)
        
        result = query.execute()
        
        # Get total count
        count_result = supabase.table("admin_analytics").select("user_id", count="exact").execute()
        total = count_result.count or 0
        
        # Transform data to UserAnalytics format
        users_data = []
        for user in result.data or []:
            users_data.append(UserAnalytics(
                user_id=user.get("user_id"),
                email=user.get("email"),
                name=user.get("name"),
                total_influencers=user.get("total_influencers", 0),
                partnered_influencers=user.get("partnered_influencers", 0),
                total_campaigns=user.get("total_campaigns", 0),
                active_campaigns=user.get("active_campaigns", 0),
                total_interactions=user.get("total_interactions", 0),
                avg_relationship_strength=user.get("avg_relationship_strength", 0.0),
                last_activity=user.get("last_activity")
            ))
        
        return PaginatedResponse(
            success=True,
            message="User analytics retrieved successfully",
            data=users_data,
            total=total,
            page=page,
            size=limit,
            has_next=offset + limit < total,
            has_prev=page > 1
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing user analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list user analytics")

@router.get("/status-distribution",
            response_model=List[StatusDistribution],
            summary="Get Status Distribution",
            description="Get status distribution data for dashboard charts",
            response_description="Status distribution data")
async def get_status_distribution(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get status distribution data for charts"""
    try:
        # Check if user is admin
        user_role = current_user.get("role", "user")
        if user_role != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        
        # Get status distribution from view
        result = supabase.table("status_distribution").select("*").execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Status distribution data not available")
        
        distribution_data = []
        for item in result.data:
            distribution_data.append(StatusDistribution(
                metric_type=item.get("metric_type"),
                status_value=item.get("status_value"),
                count=item.get("count", 0),
                percentage=item.get("percentage", 0.0)
            ))
        
        return distribution_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting status distribution: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get status distribution")
