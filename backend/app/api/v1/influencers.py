"""
Influencer management API endpoints.
Provides CRUD operations for influencers and user influencer relationships.
"""
import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.auth.dependencies import get_current_user
from app.database.supabase_client import SupabaseClient
from app.schemas.common import BaseResponse, PaginatedResponse
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

router = APIRouter()
logger = logging.getLogger(__name__)

# Pydantic models for request/response
class InfluencerBase(BaseModel):
    name: str
    platform: str
    handle: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    website_url: Optional[str] = None
    email: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    industry: Optional[str] = None
    audience_size: Optional[int] = None
    engagement_rate: Optional[float] = None
    location: Optional[str] = None
    expertise_tags: Optional[List[str]] = []
    audience_demographics: Optional[Dict[str, Any]] = {}
    contact_info: Optional[Dict[str, Any]] = {}
    is_verified: bool = False

class InfluencerResponse(InfluencerBase):
    id: str
    created_at: datetime
    updated_at: datetime

class UserInfluencerBase(BaseModel):
    influencer_id: str
    status: str = "saved"  # saved, contacted, warm, cold, partnered
    notes: Optional[str] = None
    priority: int = 0
    tags: Optional[List[str]] = []
    last_contacted_at: Optional[datetime] = None
    # CRM fields
    follow_up_date: Optional[datetime] = None
    relationship_strength: int = Field(default=0, ge=0, le=100)

class UserInfluencerResponse(UserInfluencerBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    influencer: Optional[InfluencerResponse] = None

class AddToMyListRequest(BaseModel):
    influencer_id: str
    notes: Optional[str] = None
    priority: int = 0
    tags: Optional[List[str]] = []

class UpdateUserInfluencerRequest(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    priority: Optional[int] = None
    tags: Optional[List[str]] = None
    last_contacted_at: Optional[datetime] = None

@router.get("/test",
            summary="Test Influencers",
            description="Test endpoint for influencers")
async def test_influencers():
    """Test endpoint to check if the basic functionality works"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        
        # Simple query
        result = supabase.table("influencers").select("id, name").limit(5).execute()
        
        return {
            "success": True,
            "count": len(result.data) if result.data else 0,
            "data": result.data[:2] if result.data else []
        }
    except Exception as e:
        logger.error(f"Test error: {str(e)}")
        return {"success": False, "error": str(e)}

@router.get("/simple")
async def get_simple():
    return {"message": "Simple endpoint works"}

@router.get("/",
            response_model=PaginatedResponse,
            summary="Get Influencers",
            description="Get paginated list of influencers with filtering options",
            response_description="Paginated list of influencers")
async def get_influencers(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    platform: Optional[str] = Query(None, description="Filter by platform"),
    industry: Optional[str] = Query(None, description="Filter by industry"),
    search: Optional[str] = Query(None, description="Search by name, bio, or tags"),
    min_followers: Optional[int] = Query(None, ge=0, description="Minimum follower count"),
    sort_by: str = Query("created_at", description="Sort by field"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$", description="Sort order")
):
    """
    Get paginated list of influencers with optional filtering.
    """
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        
        # Build query
        query = supabase.table("influencers").select("*")
        
        # Apply filters
        if platform:
            query = query.eq("platform", platform)
        if industry:
            query = query.eq("industry", industry)
        if min_followers:
            query = query.gte("audience_size", min_followers)
        if search:
            # Search in name, bio, and expertise_tags
            query = query.or_(f"name.ilike.%{search}%,bio.ilike.%{search}%,expertise_tags.cs.{{'{search}'}}")
        
        # Apply sorting
        if sort_by in ["name", "audience_size", "engagement_rate", "created_at", "updated_at"]:
            order_desc = sort_order == "desc"
            query = query.order(sort_by, desc=order_desc)
        else:
            query = query.order("created_at", desc=True)
        
        # Get total count
        count_query = query
        count_result = count_query.execute()
        total = len(count_result.data) if count_result.data else 0
        
        # Apply pagination
        offset = (page - 1) * limit
        query = query.range(offset, offset + limit)
        
        # Execute query
        result = query.execute()
        
        if result.data is None:
            raise HTTPException(status_code=500, detail="Failed to fetch influencers")
        
        # Transform data to dictionaries
        influencers = []
        for item in result.data:
            influencer = InfluencerResponse(
                id=item["id"],
                name=item["name"],
                platform=item["platform"],
                handle=item.get("handle"),
                bio=item.get("bio"),
                avatar_url=item.get("avatar_url"),
                website_url=item.get("website_url"),
                email=item.get("email"),
                linkedin_url=item.get("linkedin_url"),
                twitter_url=item.get("twitter_url"),
                industry=item.get("industry"),
                audience_size=item.get("audience_size"),
                engagement_rate=item.get("engagement_rate"),
                location=item.get("location"),
                expertise_tags=item.get("expertise_tags", []),
                audience_demographics=item.get("audience_demographics", {}),
                contact_info=item.get("contact_info", {}),
                is_verified=item.get("is_verified", False),
                created_at=item["created_at"],
                updated_at=item["updated_at"]
            )
            influencers.append(influencer.model_dump())
        
        # Calculate pagination info
        total_pages = (total + limit - 1) // limit
        has_next = page < total_pages
        has_prev = page > 1
        
        logger.info(f"Returning {len(influencers)} influencers, page {page}/{total_pages}, total: {total}")
        
        return PaginatedResponse(
            success=True,
            message="Influencers retrieved successfully",
            data=influencers,
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
            has_next=has_next,
            has_prev=has_prev
        )
        
    except Exception as e:
        logger.error(f"Error fetching influencers: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch influencers")

@router.get("/my-list",
            response_model=PaginatedResponse,
            summary="Get My Influencers",
            description="Get user's saved influencers with relationship data",
            response_description="Paginated list of user's influencers")
async def get_my_influencers(
    current_user: Dict[str, Any] = Depends(get_current_user),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    status: Optional[str] = Query(None, description="Filter by status")
):
    """
    Get user's saved influencers with relationship data.
    """
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Build query with join
        query = supabase.table("user_influencers").select(
            "*, influencers(*)"
        ).eq("user_id", user_id)
        
        # Apply status filter
        if status:
            query = query.eq("status", status)
        
        # Get total count
        count_query = query
        count_result = count_query.execute()
        total = len(count_result.data) if count_result.data else 0
        
        # Apply pagination
        offset = (page - 1) * limit
        query = query.range(offset, offset + limit)
        
        # Execute query
        result = query.execute()
        
        if result.data is None:
            raise HTTPException(status_code=500, detail="Failed to fetch user influencers")
        
        # Transform data to dictionaries
        user_influencers = []
        for item in result.data:
            influencer_data = item.get("influencers")
            if influencer_data:
                user_influencer = UserInfluencerResponse(
                    id=item["id"],
                    user_id=item["user_id"],
                    influencer_id=item["influencer_id"],
                    status=item["status"],
                    notes=item["notes"],
                    priority=item["priority"],
                    tags=item["tags"] or [],
                    last_contacted_at=item["last_contacted_at"],
                    created_at=item["created_at"],
                    updated_at=item["updated_at"],
                    influencer=InfluencerResponse(**influencer_data)
                )
                user_influencers.append(user_influencer.model_dump())
        
        # Calculate pagination info
        total_pages = (total + limit - 1) // limit
        has_next = page < total_pages
        has_prev = page > 1
        
        logger.info(f"Returning {len(user_influencers)} user influencers, page {page}/{total_pages}, total: {total}")
        
        return PaginatedResponse(
            success=True,
            message="User influencers retrieved successfully",
            data=user_influencers,
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
            has_next=has_next,
            has_prev=has_prev
        )
        
    except Exception as e:
        logger.error(f"Error fetching user influencers: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch user influencers")

@router.post("/add-to-my-list",
             response_model=BaseResponse,
             summary="Add Influencer to My List",
             description="Add an influencer to user's saved list",
             response_description="Success response")
async def add_to_my_list(
    request: AddToMyListRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Add an influencer to user's saved list.
    """
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Check if influencer exists
        influencer_result = supabase.table("influencers").select("id").eq("id", request.influencer_id).execute()
        if not influencer_result.data:
            raise HTTPException(status_code=404, detail="Influencer not found")
        
        # Check if already in user's list
        existing_result = supabase.table("user_influencers").select("id").eq("user_id", user_id).eq("influencer_id", request.influencer_id).execute()
        if existing_result.data:
            raise HTTPException(status_code=400, detail="Influencer already in your list")
        
        # Add to user's list
        user_influencer_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "influencer_id": request.influencer_id,
            "status": "saved",
            "notes": request.notes,
            "priority": request.priority,
            "tags": request.tags or [],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("user_influencers").insert(user_influencer_data).execute()
        
        if result.data is None:
            raise HTTPException(status_code=500, detail="Failed to add influencer to list")
        
        logger.info(f"Influencer {request.influencer_id} added to user {user_id}'s list")
        return BaseResponse(
            success=True,
            message="Influencer added to your list successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding influencer to list: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to add influencer to list")

@router.delete("/remove-from-my-list/{influencer_id}",
               response_model=BaseResponse,
               summary="Remove Influencer from My List",
               description="Remove an influencer from user's saved list",
               response_description="Success response")
async def remove_from_my_list(
    influencer_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Remove an influencer from user's saved list.
    """
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Remove from user's list
        result = supabase.table("user_influencers").delete().eq("user_id", user_id).eq("influencer_id", influencer_id).execute()
        
        if result.data is None:
            raise HTTPException(status_code=404, detail="Influencer not found in your list")
        
        logger.info(f"Influencer {influencer_id} removed from user {user_id}'s list")
        return BaseResponse(
            success=True,
            message="Influencer removed from your list successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error removing influencer from list: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to remove influencer from list")

@router.put("/update-my-influencer/{influencer_id}",
            response_model=BaseResponse,
            summary="Update My Influencer",
            description="Update user's relationship with an influencer",
            response_description="Success response")
async def update_my_influencer(
    influencer_id: str,
    request: UpdateUserInfluencerRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update user's relationship with an influencer.
    """
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Prepare update data
        update_data = {"updated_at": datetime.utcnow().isoformat()}
        
        if request.status is not None:
            update_data["status"] = request.status
        if request.notes is not None:
            update_data["notes"] = request.notes
        if request.priority is not None:
            update_data["priority"] = request.priority
        if request.tags is not None:
            update_data["tags"] = request.tags
        if request.last_contacted_at is not None:
            update_data["last_contacted_at"] = request.last_contacted_at.isoformat()
        
        # Update user influencer relationship
        result = supabase.table("user_influencers").update(update_data).eq("user_id", user_id).eq("influencer_id", influencer_id).execute()
        
        if result.data is None:
            raise HTTPException(status_code=404, detail="Influencer not found in your list")
        
        logger.info(f"Influencer {influencer_id} updated for user {user_id}")
        return BaseResponse(
            success=True,
            message="Influencer updated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating influencer: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update influencer")

@router.get("/check-saved/{influencer_id}",
            response_model=Dict[str, Any],
            summary="Check if Influencer is Saved",
            description="Check if an influencer is in user's saved list",
            response_description="Saved status and relationship data")
async def check_saved_status(
    influencer_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Check if an influencer is in user's saved list.
    """
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Check if in user's list
        result = supabase.table("user_influencers").select("*").eq("user_id", user_id).eq("influencer_id", influencer_id).execute()
        
        if result.data and len(result.data) > 0:
            return {
                "is_saved": True,
                "relationship": result.data[0]
            }
        else:
            return {
                "is_saved": False,
                "relationship": None
            }
        
    except Exception as e:
        logger.error(f"Error checking saved status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to check saved status")

@router.put("/{influencer_id}/relationship",
            response_model=BaseResponse,
            summary="Update Relationship Strength",
            description="Update relationship strength with an influencer",
            response_description="Relationship strength updated")
async def update_relationship_strength(
    influencer_id: str,
    strength: int = Query(..., ge=0, le=100),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update relationship strength with an influencer"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Check if influencer relationship exists
        existing = supabase.table("user_influencers").select("id").eq("user_id", user_id).eq("influencer_id", influencer_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Influencer not found in your list")
        
        # Update relationship strength
        result = supabase.table("user_influencers").update({
            "relationship_strength": strength,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("user_id", user_id).eq("influencer_id", influencer_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update relationship strength")
        
        logger.info(f"Relationship strength updated for user {user_id} and influencer {influencer_id}: {strength}")
        return BaseResponse(success=True, message=f"Relationship strength updated to {strength}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating relationship strength: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update relationship strength")

@router.put("/{influencer_id}/follow-up",
            response_model=BaseResponse,
            summary="Set Follow-up Date",
            description="Set follow-up date for an influencer",
            response_description="Follow-up date set")
async def set_follow_up_date(
    influencer_id: str,
    follow_up_date: datetime = Query(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Set follow-up date for an influencer"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Check if influencer relationship exists
        existing = supabase.table("user_influencers").select("id").eq("user_id", user_id).eq("influencer_id", influencer_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Influencer not found in your list")
        
        # Update follow-up date
        result = supabase.table("user_influencers").update({
            "follow_up_date": follow_up_date.isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }).eq("user_id", user_id).eq("influencer_id", influencer_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to set follow-up date")
        
        logger.info(f"Follow-up date set for user {user_id} and influencer {influencer_id}: {follow_up_date}")
        return BaseResponse(success=True, message=f"Follow-up date set to {follow_up_date.strftime('%Y-%m-%d %H:%M')}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error setting follow-up date: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to set follow-up date")

@router.get("/my/crm",
            response_model=PaginatedResponse,
            summary="Get My Influencers with CRM Data",
            description="Get user's saved influencers with CRM relationship data",
            response_description="Paginated list of influencers with CRM data")
async def get_my_influencers_crm(
    current_user: Dict[str, Any] = Depends(get_current_user),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    status: Optional[str] = Query(None, description="Filter by status"),
    sort_by: Optional[str] = Query("created_at", description="Sort by field"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$", description="Sort order")
):
    """Get user's saved influencers with CRM relationship data"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Build query with join to get influencer details
        query = supabase.table("user_influencers").select("""
            *,
            influencer:influencers(*)
        """).eq("user_id", user_id)
        
        if status:
            query = query.eq("status", status)
        
        # Apply sorting
        if sort_by in ["created_at", "updated_at", "last_contacted_at", "follow_up_date", "relationship_strength", "priority"]:
            order_desc = sort_order == "desc"
            query = query.order(sort_by, desc=order_desc)
        else:
            query = query.order("created_at", desc=True)
        
        # Apply pagination
        offset = (page - 1) * limit
        query = query.range(offset, offset + limit)
        
        result = query.execute()
        
        # Get total count
        count_query = supabase.table("user_influencers").select("id", count="exact").eq("user_id", user_id)
        if status:
            count_query = count_query.eq("status", status)
        
        count_result = count_query.execute()
        total = count_result.count or 0
        
        # Calculate pagination info
        total_pages = (total + limit - 1) // limit
        has_next = page < total_pages
        has_prev = page > 1
        
        logger.info(f"Returning {len(result.data or [])} CRM influencers, page {page}/{total_pages}, total: {total}")
        
        return PaginatedResponse(
            success=True,
            message="CRM influencers retrieved successfully",
            data=result.data or [],
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
            has_next=has_next,
            has_prev=has_prev
        )
        
    except Exception as e:
        logger.error(f"Error getting CRM influencers: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get CRM influencers")
