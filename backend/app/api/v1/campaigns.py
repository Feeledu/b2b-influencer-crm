"""
Campaign management API endpoints.
Provides CRUD operations for campaigns and campaign-influencer assignments.
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
class CampaignBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = Field(default="planning", pattern="^(planning|active|completed|cancelled)$")
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = None
    target_audience: Optional[str] = None
    goals: Optional[List[str]] = []

class CampaignResponse(CampaignBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

class CampaignInfluencerBase(BaseModel):
    influencer_id: str
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None
    status: str = Field(default="planned", pattern="^(planned|active|completed|cancelled)$")
    notes: Optional[str] = None

class CampaignInfluencerResponse(CampaignInfluencerBase):
    id: str
    campaign_id: str
    user_id: str
    utm_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class CreateCampaignRequest(CampaignBase):
    pass

class UpdateCampaignRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(planning|active|completed|cancelled)$")
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = None
    target_audience: Optional[str] = None
    goals: Optional[List[str]] = None

class AssignInfluencerRequest(CampaignInfluencerBase):
    pass

class UpdateAssignmentRequest(BaseModel):
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(planned|active|completed|cancelled)$")
    notes: Optional[str] = None

@router.post("/",
             response_model=CampaignResponse,
             summary="Create Campaign",
             description="Create a new campaign",
             response_description="Created campaign")
async def create_campaign(
    request: CreateCampaignRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Create a new campaign"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        campaign_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "name": request.name,
            "description": request.description,
            "status": request.status,
            "start_date": request.start_date.isoformat() if request.start_date else None,
            "end_date": request.end_date.isoformat() if request.end_date else None,
            "budget": request.budget,
            "target_audience": request.target_audience,
            "goals": request.goals or [],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("campaigns").insert(campaign_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create campaign")
        
        logger.info(f"Campaign created for user {user_id}: {request.name}")
        return CampaignResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating campaign: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create campaign")

@router.get("/",
            response_model=PaginatedResponse,
            summary="List Campaigns",
            description="Get paginated list of user campaigns",
            response_description="Paginated list of campaigns")
async def list_campaigns(
    current_user: Dict[str, Any] = Depends(get_current_user),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    status: Optional[str] = Query(None, description="Filter by status")
):
    """Get paginated list of user campaigns"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        query = supabase.table("campaigns").select("*").eq("user_id", user_id)
        
        if status:
            query = query.eq("status", status)
        
        offset = (page - 1) * limit
        query = query.order("created_at", desc=True).range(offset, offset + limit - 1)
        
        result = query.execute()
        
        count_query = supabase.table("campaigns").select("id", count="exact").eq("user_id", user_id)
        if status:
            count_query = count_query.eq("status", status)
        
        count_result = count_query.execute()
        total = count_result.count or 0
        
        return PaginatedResponse(
            success=True,
            message="Campaigns retrieved successfully",
            data=result.data or [],
            total=total,
            page=page,
            size=limit,
            has_next=offset + limit < total,
            has_prev=page > 1
        )
        
    except Exception as e:
        logger.error(f"Error listing campaigns: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list campaigns")

@router.post("/{campaign_id}/influencers",
             response_model=CampaignInfluencerResponse,
             summary="Assign Influencer to Campaign",
             description="Assign an influencer to a campaign with UTM tracking",
             response_description="Campaign assignment")
async def assign_influencer(
    campaign_id: str,
    request: AssignInfluencerRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Assign an influencer to a campaign"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Verify campaign exists and belongs to user
        campaign_result = supabase.table("campaigns").select("id").eq("id", campaign_id).eq("user_id", user_id).execute()
        if not campaign_result.data:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        # Verify influencer exists
        influencer_result = supabase.table("influencers").select("id").eq("id", request.influencer_id).execute()
        if not influencer_result.data:
            raise HTTPException(status_code=404, detail="Influencer not found")
        
        # Check if already assigned
        existing = supabase.table("campaign_influencers").select("id").eq("campaign_id", campaign_id).eq("influencer_id", request.influencer_id).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Influencer already assigned to this campaign")
        
        # Generate UTM URL
        utm_url = None
        if any([request.utm_source, request.utm_medium, request.utm_campaign]):
            utm_params = []
            if request.utm_source:
                utm_params.append(f"utm_source={request.utm_source}")
            if request.utm_medium:
                utm_params.append(f"utm_medium={request.utm_medium}")
            if request.utm_campaign:
                utm_params.append(f"utm_campaign={request.utm_campaign}")
            if request.utm_content:
                utm_params.append(f"utm_content={request.utm_content}")
            if request.utm_term:
                utm_params.append(f"utm_term={request.utm_term}")
            
            utm_url = f"https://example.com?{'&'.join(utm_params)}"
        
        assignment_data = {
            "id": str(uuid.uuid4()),
            "campaign_id": campaign_id,
            "influencer_id": request.influencer_id,
            "user_id": user_id,
            "utm_source": request.utm_source,
            "utm_medium": request.utm_medium,
            "utm_campaign": request.utm_campaign,
            "utm_content": request.utm_content,
            "utm_term": request.utm_term,
            "utm_url": utm_url,
            "status": request.status,
            "notes": request.notes,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("campaign_influencers").insert(assignment_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to assign influencer")
        
        logger.info(f"Influencer {request.influencer_id} assigned to campaign {campaign_id}")
        return CampaignInfluencerResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error assigning influencer: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to assign influencer")

@router.get("/{campaign_id}/influencers",
            response_model=PaginatedResponse,
            summary="List Campaign Influencers",
            description="Get paginated list of influencers assigned to a campaign",
            response_description="Paginated list of campaign influencers")
async def list_campaign_influencers(
    campaign_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    status: Optional[str] = Query(None, description="Filter by assignment status")
):
    """Get paginated list of influencers assigned to a campaign"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Verify campaign exists and belongs to user
        campaign_result = supabase.table("campaigns").select("id").eq("id", campaign_id).eq("user_id", user_id).execute()
        if not campaign_result.data:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        query = supabase.table("campaign_influencers").select("*").eq("campaign_id", campaign_id).eq("user_id", user_id)
        
        if status:
            query = query.eq("status", status)
        
        offset = (page - 1) * limit
        query = query.order("created_at", desc=True).range(offset, offset + limit - 1)
        
        result = query.execute()
        
        count_query = supabase.table("campaign_influencers").select("id", count="exact").eq("campaign_id", campaign_id).eq("user_id", user_id)
        if status:
            count_query = count_query.eq("status", status)
        
        count_result = count_query.execute()
        total = count_result.count or 0
        
        return PaginatedResponse(
            success=True,
            message="Campaign influencers retrieved successfully",
            data=result.data or [],
            total=total,
            page=page,
            size=limit,
            has_next=offset + limit < total,
            has_prev=page > 1
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing campaign influencers: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list campaign influencers")

@router.put("/{campaign_id}/influencers/{influencer_id}",
            response_model=CampaignInfluencerResponse,
            summary="Update Campaign Assignment",
            description="Update an influencer's campaign assignment",
            response_description="Updated assignment")
async def update_assignment(
    campaign_id: str,
    influencer_id: str,
    request: UpdateAssignmentRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update an influencer's campaign assignment"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Check if assignment exists
        existing = supabase.table("campaign_influencers").select("*").eq("campaign_id", campaign_id).eq("influencer_id", influencer_id).eq("user_id", user_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Assignment not found")
        
        # Prepare update data
        update_data = {}
        for field, value in request.dict(exclude_unset=True).items():
            if value is not None:
                update_data[field] = value
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        # Regenerate UTM URL if UTM parameters changed
        if any(field in update_data for field in ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]):
            utm_params = []
            utm_source = update_data.get("utm_source", existing.data[0].get("utm_source"))
            utm_medium = update_data.get("utm_medium", existing.data[0].get("utm_medium"))
            utm_campaign = update_data.get("utm_campaign", existing.data[0].get("utm_campaign"))
            utm_content = update_data.get("utm_content", existing.data[0].get("utm_content"))
            utm_term = update_data.get("utm_term", existing.data[0].get("utm_term"))
            
            if any([utm_source, utm_medium, utm_campaign]):
                if utm_source:
                    utm_params.append(f"utm_source={utm_source}")
                if utm_medium:
                    utm_params.append(f"utm_medium={utm_medium}")
                if utm_campaign:
                    utm_params.append(f"utm_campaign={utm_campaign}")
                if utm_content:
                    utm_params.append(f"utm_content={utm_content}")
                if utm_term:
                    utm_params.append(f"utm_term={utm_term}")
                
                update_data["utm_url"] = f"https://example.com?{'&'.join(utm_params)}"
        
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        result = supabase.table("campaign_influencers").update(update_data).eq("campaign_id", campaign_id).eq("influencer_id", influencer_id).eq("user_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update assignment")
        
        logger.info(f"Assignment updated for campaign {campaign_id} and influencer {influencer_id}")
        return CampaignInfluencerResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating assignment: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update assignment")

@router.delete("/{campaign_id}/influencers/{influencer_id}",
               response_model=BaseResponse,
               summary="Remove Campaign Assignment",
               description="Remove an influencer from a campaign",
               response_description="Removal confirmation")
async def remove_assignment(
    campaign_id: str,
    influencer_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Remove an influencer from a campaign"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Check if assignment exists
        existing = supabase.table("campaign_influencers").select("id").eq("campaign_id", campaign_id).eq("influencer_id", influencer_id).eq("user_id", user_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Assignment not found")
        
        result = supabase.table("campaign_influencers").delete().eq("campaign_id", campaign_id).eq("influencer_id", influencer_id).eq("user_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to remove assignment")
        
        logger.info(f"Assignment removed for campaign {campaign_id} and influencer {influencer_id}")
        return BaseResponse(success=True, message="Assignment removed successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error removing assignment: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to remove assignment")
