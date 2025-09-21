"""
Intent-Led Discovery API endpoints.
Provides audience analysis, buyer alignment scoring, and trust relationship analysis.
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
class AudienceSegmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    demographics: Optional[Dict[str, Any]] = None
    interests: Optional[Dict[str, Any]] = None
    behavior_patterns: Optional[Dict[str, Any]] = None

class AudienceSegmentResponse(AudienceSegmentBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

class IntentSignalBase(BaseModel):
    influencer_id: str
    signal_type: str = Field(..., pattern="^(linkedin_engagement|newsletter_opens|podcast_listens|social_engagement)$")
    signal_data: Dict[str, Any]
    audience_demographics: Optional[Dict[str, Any]] = None
    engagement_quality_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    intent_score: Optional[float] = Field(None, ge=0.0, le=1.0)

class IntentSignalResponse(IntentSignalBase):
    id: str
    collected_at: datetime
    created_at: datetime

class TrustRelationshipBase(BaseModel):
    influencer_id: str
    customer_id: Optional[str] = None
    relationship_type: str = Field(..., pattern="^(follows|engages|subscribes|interacts)$")
    platform: str = Field(..., pattern="^(linkedin|twitter|newsletter|podcast)$")
    connection_strength: Optional[float] = Field(None, ge=0.0, le=1.0)
    engagement_frequency: int = 0
    last_interaction: Optional[datetime] = None
    verified: bool = False

class TrustRelationshipResponse(TrustRelationshipBase):
    id: str
    created_at: datetime
    updated_at: datetime

class BuyerAlignmentScoreResponse(BaseModel):
    id: str
    influencer_id: str
    audience_segment_id: Optional[str] = None
    alignment_score: float = Field(..., ge=0.0, le=1.0)
    audience_overlap_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)
    trust_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    engagement_quality: Optional[float] = Field(None, ge=0.0, le=1.0)
    conversion_probability: Optional[float] = Field(None, ge=0.0, le=1.0)
    calculated_at: datetime
    created_at: datetime
    updated_at: datetime

class AudienceOverlapRequest(BaseModel):
    influencer_id: str
    audience_segment_id: str

class AudienceOverlapResponse(BaseModel):
    influencer_id: str
    audience_segment_id: str
    overlap_percentage: float
    common_demographics: Dict[str, Any]
    common_interests: Dict[str, Any]
    alignment_score: float

# Audience Segments endpoints
@router.post("/audience-segments",
             response_model=AudienceSegmentResponse,
             summary="Create Audience Segment",
             description="Create a new audience segment for intent analysis",
             response_description="Created audience segment")
async def create_audience_segment(
    request: AudienceSegmentBase,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Create a new audience segment"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        segment_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "name": request.name,
            "description": request.description,
            "demographics": request.demographics,
            "interests": request.interests,
            "behavior_patterns": request.behavior_patterns,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("audience_segments").insert(segment_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create audience segment")
        
        logger.info(f"Audience segment created for user {user_id}")
        return AudienceSegmentResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating audience segment: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create audience segment")

@router.get("/audience-segments",
            response_model=PaginatedResponse,
            summary="List Audience Segments",
            description="Get paginated list of user's audience segments",
            response_description="Paginated list of audience segments")
async def list_audience_segments(
    current_user: Dict[str, Any] = Depends(get_current_user),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page")
):
    """Get paginated list of user's audience segments"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        offset = (page - 1) * limit
        result = supabase.table("audience_segments").select("*").eq("user_id", user_id).order("created_at", desc=True).range(offset, offset + limit - 1).execute()
        
        count_result = supabase.table("audience_segments").select("id", count="exact").eq("user_id", user_id).execute()
        total = count_result.count or 0
        
        # Calculate pagination info
        total_pages = (total + limit - 1) // limit
        has_next = page < total_pages
        has_prev = page > 1
        
        logger.info(f"Returning {len(result.data or [])} audience segments, page {page}/{total_pages}, total: {total}")
        
        return PaginatedResponse(
            success=True,
            message="Audience segments retrieved successfully",
            data=result.data or [],
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
            has_next=has_next,
            has_prev=has_prev
        )
        
    except Exception as e:
        logger.error(f"Error listing audience segments: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list audience segments")

# Intent Signals endpoints
@router.post("/intent-signals",
             response_model=IntentSignalResponse,
             summary="Create Intent Signal",
             description="Create a new intent signal for an influencer",
             response_description="Created intent signal")
async def create_intent_signal(
    request: IntentSignalBase,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Create a new intent signal"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        
        # Verify influencer exists
        influencer_result = supabase.table("influencers").select("id").eq("id", request.influencer_id).execute()
        if not influencer_result.data:
            raise HTTPException(status_code=404, detail="Influencer not found")
        
        signal_data = {
            "id": str(uuid.uuid4()),
            "influencer_id": request.influencer_id,
            "signal_type": request.signal_type,
            "signal_data": request.signal_data,
            "audience_demographics": request.audience_demographics,
            "engagement_quality_score": request.engagement_quality_score,
            "intent_score": request.intent_score,
            "collected_at": datetime.utcnow().isoformat(),
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("intent_signals").insert(signal_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create intent signal")
        
        logger.info(f"Intent signal created for influencer {request.influencer_id}")
        return IntentSignalResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating intent signal: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create intent signal")

# Trust Relationships endpoints
@router.post("/trust-relationships",
             response_model=TrustRelationshipResponse,
             summary="Create Trust Relationship",
             description="Create a new trust relationship between influencer and customer",
             response_description="Created trust relationship")
async def create_trust_relationship(
    request: TrustRelationshipBase,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Create a new trust relationship"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        
        # Verify influencer exists
        influencer_result = supabase.table("influencers").select("id").eq("id", request.influencer_id).execute()
        if not influencer_result.data:
            raise HTTPException(status_code=404, detail="Influencer not found")
        
        relationship_data = {
            "id": str(uuid.uuid4()),
            "influencer_id": request.influencer_id,
            "customer_id": request.customer_id,
            "relationship_type": request.relationship_type,
            "platform": request.platform,
            "connection_strength": request.connection_strength,
            "engagement_frequency": request.engagement_frequency,
            "last_interaction": request.last_interaction.isoformat() if request.last_interaction else None,
            "verified": request.verified,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("trust_relationships").insert(relationship_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create trust relationship")
        
        logger.info(f"Trust relationship created for influencer {request.influencer_id}")
        return TrustRelationshipResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating trust relationship: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create trust relationship")

# Buyer Alignment Analysis endpoints
@router.post("/audience-overlap",
             response_model=AudienceOverlapResponse,
             summary="Calculate Audience Overlap",
             description="Calculate audience overlap between influencer and audience segment",
             response_description="Audience overlap analysis")
async def calculate_audience_overlap(
    request: AudienceOverlapRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Calculate audience overlap between influencer and audience segment"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        user_id = current_user.get("user_id")
        
        # Get influencer data
        influencer_result = supabase.table("influencers").select("*").eq("id", request.influencer_id).execute()
        if not influencer_result.data:
            raise HTTPException(status_code=404, detail="Influencer not found")
        
        # Get audience segment data
        segment_result = supabase.table("audience_segments").select("*").eq("id", request.audience_segment_id).eq("user_id", user_id).execute()
        if not segment_result.data:
            raise HTTPException(status_code=404, detail="Audience segment not found")
        
        influencer = influencer_result.data[0]
        segment = segment_result.data[0]
        
        # Mock calculation (in real implementation, this would use ML algorithms)
        overlap_percentage = 75.5  # Mock value
        alignment_score = 0.82  # Mock value
        
        # Mock common demographics and interests
        common_demographics = {
            "age_range": "25-34",
            "location": "United States",
            "industry": "Technology"
        }
        
        common_interests = {
            "topics": ["SaaS", "Startups", "Product Management"],
            "technologies": ["React", "Python", "AWS"]
        }
        
        return AudienceOverlapResponse(
            influencer_id=request.influencer_id,
            audience_segment_id=request.audience_segment_id,
            overlap_percentage=overlap_percentage,
            common_demographics=common_demographics,
            common_interests=common_interests,
            alignment_score=alignment_score
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error calculating audience overlap: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to calculate audience overlap")

@router.get("/buyer-alignment-scores",
            response_model=PaginatedResponse,
            summary="Get Buyer Alignment Scores",
            description="Get paginated list of buyer alignment scores",
            response_description="Paginated list of buyer alignment scores")
async def get_buyer_alignment_scores(
    current_user: Dict[str, Any] = Depends(get_current_user),
    influencer_id: Optional[str] = Query(None, description="Filter by influencer ID"),
    audience_segment_id: Optional[str] = Query(None, description="Filter by audience segment ID"),
    min_alignment_score: Optional[float] = Query(None, ge=0.0, le=1.0, description="Minimum alignment score"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page")
):
    """Get paginated list of buyer alignment scores"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        
        query = supabase.table("buyer_alignment_scores").select("*")
        
        if influencer_id:
            query = query.eq("influencer_id", influencer_id)
        if audience_segment_id:
            query = query.eq("audience_segment_id", audience_segment_id)
        if min_alignment_score is not None:
            query = query.gte("alignment_score", min_alignment_score)
        
        offset = (page - 1) * limit
        result = query.order("alignment_score", desc=True).range(offset, offset + limit - 1).execute()
        
        count_query = supabase.table("buyer_alignment_scores").select("id", count="exact")
        if influencer_id:
            count_query = count_query.eq("influencer_id", influencer_id)
        if audience_segment_id:
            count_query = count_query.eq("audience_segment_id", audience_segment_id)
        if min_alignment_score is not None:
            count_query = count_query.gte("alignment_score", min_alignment_score)
        
        count_result = count_query.execute()
        total = count_result.count or 0
        
        # Calculate pagination info
        total_pages = (total + limit - 1) // limit
        has_next = page < total_pages
        has_prev = page > 1
        
        logger.info(f"Returning {len(result.data or [])} buyer alignment scores, page {page}/{total_pages}, total: {total}")
        
        return PaginatedResponse(
            success=True,
            message="Buyer alignment scores retrieved successfully",
            data=result.data or [],
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
            has_next=has_next,
            has_prev=has_prev
        )
        
    except Exception as e:
        logger.error(f"Error getting buyer alignment scores: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get buyer alignment scores")

# Trust Graph endpoints
@router.get("/trust-graph",
            response_model=BaseResponse,
            summary="Get Trust Graph",
            description="Get trust relationship graph for visualization",
            response_description="Trust graph data")
async def get_trust_graph(
    current_user: Dict[str, Any] = Depends(get_current_user),
    influencer_id: Optional[str] = Query(None, description="Focus on specific influencer"),
    max_depth: int = Query(2, ge=1, le=5, description="Maximum relationship depth")
):
    """Get trust relationship graph for visualization"""
    try:
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        
        # Mock trust graph data (in real implementation, this would query the database)
        trust_graph = {
            "nodes": [
                {
                    "id": "influencer_1",
                    "type": "influencer",
                    "name": "John Doe",
                    "platform": "LinkedIn",
                    "followers": 15000,
                    "trust_score": 0.85
                },
                {
                    "id": "customer_1",
                    "type": "customer",
                    "name": "Jane Smith",
                    "company": "TechCorp",
                    "relationship_strength": 0.92
                },
                {
                    "id": "customer_2",
                    "type": "customer",
                    "name": "Mike Johnson",
                    "company": "StartupXYZ",
                    "relationship_strength": 0.78
                }
            ],
            "edges": [
                {
                    "source": "influencer_1",
                    "target": "customer_1",
                    "relationship_type": "follows",
                    "platform": "LinkedIn",
                    "strength": 0.92
                },
                {
                    "source": "influencer_1",
                    "target": "customer_2",
                    "relationship_type": "engages",
                    "platform": "LinkedIn",
                    "strength": 0.78
                }
            ]
        }
        
        return BaseResponse(
            success=True,
            message="Trust graph retrieved successfully",
            data=trust_graph
        )
        
    except Exception as e:
        logger.error(f"Error getting trust graph: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get trust graph")
