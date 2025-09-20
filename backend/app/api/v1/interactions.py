"""
Interaction management API endpoints.
Provides CRUD operations for tracking influencer interactions.
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
class InteractionBase(BaseModel):
    influencer_id: str
    campaign_id: Optional[str] = None
    type: str = Field(..., pattern="^(email|call|meeting|note|file_upload)$")
    subject: Optional[str] = None
    content: Optional[str] = None
    file_url: Optional[str] = None
    interaction_date: datetime = Field(default_factory=datetime.utcnow)

class InteractionResponse(InteractionBase):
    id: str
    user_id: str
    created_at: datetime

class CreateInteractionRequest(InteractionBase):
    pass

class UpdateInteractionRequest(BaseModel):
    type: Optional[str] = Field(None, pattern="^(email|call|meeting|note|file_upload)$")
    subject: Optional[str] = None
    content: Optional[str] = None
    file_url: Optional[str] = None
    interaction_date: Optional[datetime] = None

@router.post("/",
             response_model=InteractionResponse,
             summary="Create Interaction",
             description="Create a new interaction with an influencer",
             response_description="Created interaction")
async def create_interaction(
    request: CreateInteractionRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Create a new interaction with an influencer"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Verify influencer exists
        influencer_result = supabase.table("influencers").select("id").eq("id", request.influencer_id).execute()
        if not influencer_result.data:
            raise HTTPException(status_code=404, detail="Influencer not found")
        
        # Create interaction
        interaction_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "influencer_id": request.influencer_id,
            "campaign_id": request.campaign_id,
            "type": request.type,
            "subject": request.subject,
            "content": request.content,
            "file_url": request.file_url,
            "interaction_date": request.interaction_date.isoformat(),
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("interactions").insert(interaction_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create interaction")
        
        logger.info(f"Interaction created for user {user_id} with influencer {request.influencer_id}")
        return InteractionResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating interaction: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create interaction")

@router.get("/",
            response_model=PaginatedResponse,
            summary="List Interactions",
            description="Get paginated list of user interactions",
            response_description="Paginated list of interactions")
async def list_interactions(
    current_user: Dict[str, Any] = Depends(get_current_user),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    influencer_id: Optional[str] = Query(None, description="Filter by influencer"),
    type: Optional[str] = Query(None, description="Filter by interaction type"),
    campaign_id: Optional[str] = Query(None, description="Filter by campaign")
):
    """Get paginated list of user interactions"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Build query
        query = supabase.table("interactions").select("*").eq("user_id", user_id)
        
        if influencer_id:
            query = query.eq("influencer_id", influencer_id)
        if type:
            query = query.eq("type", type)
        if campaign_id:
            query = query.eq("campaign_id", campaign_id)
        
        # Apply pagination
        offset = (page - 1) * limit
        query = query.order("interaction_date", desc=True).range(offset, offset + limit - 1)
        
        result = query.execute()
        
        # Get total count
        count_query = supabase.table("interactions").select("id", count="exact").eq("user_id", user_id)
        if influencer_id:
            count_query = count_query.eq("influencer_id", influencer_id)
        if type:
            count_query = count_query.eq("type", type)
        if campaign_id:
            count_query = count_query.eq("campaign_id", campaign_id)
        
        count_result = count_query.execute()
        total = count_result.count or 0
        
        return PaginatedResponse(
            success=True,
            message="Interactions retrieved successfully",
            data=result.data or [],
            total=total,
            page=page,
            size=limit,
            has_next=offset + limit < total,
            has_prev=page > 1
        )
        
    except Exception as e:
        logger.error(f"Error listing interactions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list interactions")

@router.get("/{interaction_id}",
            response_model=InteractionResponse,
            summary="Get Interaction",
            description="Get a specific interaction by ID",
            response_description="Interaction details")
async def get_interaction(
    interaction_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get a specific interaction by ID"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        result = supabase.table("interactions").select("*").eq("id", interaction_id).eq("user_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Interaction not found")
        
        return InteractionResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting interaction: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get interaction")

@router.put("/{interaction_id}",
            response_model=InteractionResponse,
            summary="Update Interaction",
            description="Update an existing interaction",
            response_description="Updated interaction")
async def update_interaction(
    interaction_id: str,
    request: UpdateInteractionRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update an existing interaction"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Check if interaction exists and belongs to user
        existing = supabase.table("interactions").select("id").eq("id", interaction_id).eq("user_id", user_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Interaction not found")
        
        # Prepare update data
        update_data = {}
        for field, value in request.dict(exclude_unset=True).items():
            if value is not None:
                if field == "interaction_date":
                    update_data[field] = value.isoformat()
                else:
                    update_data[field] = value
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        # Update interaction
        result = supabase.table("interactions").update(update_data).eq("id", interaction_id).eq("user_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update interaction")
        
        logger.info(f"Interaction {interaction_id} updated for user {user_id}")
        return InteractionResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating interaction: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update interaction")

@router.delete("/{interaction_id}",
               response_model=BaseResponse,
               summary="Delete Interaction",
               description="Delete an interaction",
               response_description="Deletion confirmation")
async def delete_interaction(
    interaction_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Delete an interaction"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Check if interaction exists and belongs to user
        existing = supabase.table("interactions").select("id").eq("id", interaction_id).eq("user_id", user_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Interaction not found")
        
        # Delete interaction
        result = supabase.table("interactions").delete().eq("id", interaction_id).eq("user_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to delete interaction")
        
        logger.info(f"Interaction {interaction_id} deleted for user {user_id}")
        return BaseResponse(success=True, message="Interaction deleted successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting interaction: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete interaction")
