# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-09-15-crm-workspace/spec.md

## Endpoints

### GET /api/v1/influencers/my-list
**Purpose:** Get user's saved influencers with enhanced CRM data
**Parameters:** 
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page
- `status` (optional): Filter by relationship status
- `search` (optional): Search by name, notes, or tags
- `sort_by` (optional): Sort field (name, status, last_contacted_at, relationship_strength)
- `sort_order` (optional): Sort direction (asc, desc)

**Response:** Enhanced paginated response with CRM fields
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "influencer_id": "uuid",
      "status": "warm",
      "notes": "Great conversation about SaaS trends",
      "tags": ["saas", "high-priority"],
      "priority": 4,
      "last_contacted_at": "2025-09-15T10:30:00Z",
      "follow_up_date": "2025-09-20T09:00:00Z",
      "relationship_strength": 75,
      "created_at": "2025-09-10T14:20:00Z",
      "updated_at": "2025-09-15T10:30:00Z",
      "influencer": {
        "id": "uuid",
        "name": "Sarah Chen",
        "platform": "LinkedIn",
        "bio": "SaaS Marketing Expert",
        "audience_size": 25000,
        "engagement_rate": 4.2
      }
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "total_pages": 8
}
```

**Errors:** 401 (Unauthorized), 500 (Server Error)

### PUT /api/v1/influencers/my-list/{influencer_id}
**Purpose:** Update influencer relationship with CRM data
**Parameters:** 
- `influencer_id`: UUID of the influencer relationship

**Request Body:**
```json
{
  "status": "warm",
  "notes": "Updated notes about the relationship",
  "tags": ["saas", "high-priority", "podcast"],
  "priority": 4,
  "follow_up_date": "2025-09-20T09:00:00Z"
}
```

**Response:** Success response with updated data
**Errors:** 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)

### POST /api/v1/interactions
**Purpose:** Create new interaction record
**Request Body:**
```json
{
  "influencer_id": "uuid",
  "campaign_id": "uuid",
  "type": "email",
  "subject": "Follow-up on partnership opportunity",
  "content": "Discussed potential collaboration for Q4 campaign",
  "file_url": "https://storage.supabase.co/bucket/file.pdf",
  "interaction_date": "2025-09-15T14:30:00Z"
}
```

**Response:** Created interaction record
**Errors:** 400 (Bad Request), 401 (Unauthorized), 500 (Server Error)

### GET /api/v1/interactions
**Purpose:** Get user's interaction history
**Parameters:**
- `influencer_id` (optional): Filter by specific influencer
- `campaign_id` (optional): Filter by specific campaign
- `type` (optional): Filter by interaction type
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:** Paginated list of interactions
**Errors:** 401 (Unauthorized), 500 (Server Error)

### POST /api/v1/campaigns/{campaign_id}/influencers
**Purpose:** Assign influencer to campaign with UTM tracking
**Parameters:**
- `campaign_id`: UUID of the campaign

**Request Body:**
```json
{
  "influencer_id": "uuid",
  "utm_source": "influencer",
  "utm_medium": "partnership",
  "utm_campaign": "q4-saas-campaign",
  "utm_content": "sarah-chen",
  "utm_term": "saas-marketing",
  "notes": "High-priority influencer for Q4 campaign"
}
```

**Response:** Created campaign-influencer assignment with generated UTM URL
**Errors:** 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)

### GET /api/v1/admin/analytics
**Purpose:** Get platform analytics for admin dashboard
**Parameters:** None (admin only)

**Response:** Platform-wide analytics data
```json
{
  "total_users": 150,
  "total_influencers": 2500,
  "total_campaigns": 45,
  "total_interactions": 1200,
  "user_activity": [
    {
      "user_id": "uuid",
      "email": "user@example.com",
      "total_influencers": 25,
      "partnered_influencers": 3,
      "total_campaigns": 5,
      "total_interactions": 45,
      "avg_relationship_strength": 68,
      "last_activity": "2025-09-15T16:30:00Z"
    }
  ],
  "status_distribution": {
    "saved": 1200,
    "contacted": 800,
    "warm": 300,
    "cold": 150,
    "partnered": 50
  }
}
```

**Errors:** 401 (Unauthorized), 403 (Forbidden), 500 (Server Error)

### POST /api/v1/files/upload
**Purpose:** Upload file for interaction attachments
**Request:** Multipart form data with file
**Response:** File URL for use in interactions
**Errors:** 400 (Bad Request), 401 (Unauthorized), 413 (File Too Large), 500 (Server Error)

## Controllers

### InfluencerController
- `getMyInfluencers()` - Enhanced influencer list with CRM data
- `updateInfluencerRelationship()` - Update relationship status and notes
- `getInfluencerInteractions()` - Get interaction history for specific influencer

### InteractionController
- `createInteraction()` - Create new interaction record
- `getInteractions()` - Get user's interaction history
- `updateInteraction()` - Update existing interaction
- `deleteInteraction()` - Remove interaction record

### CampaignController
- `assignInfluencerToCampaign()` - Create campaign-influencer assignment
- `getCampaignInfluencers()` - Get influencers assigned to campaign
- `updateCampaignInfluencer()` - Update assignment details
- `removeInfluencerFromCampaign()` - Remove influencer from campaign

### AdminController
- `getPlatformAnalytics()` - Get admin dashboard data
- `getUserWorkspaces()` - Get all user workspace data
- `getInfluencerStatistics()` - Get influencer relationship statistics

## Purpose

### Endpoint Rationale
- **Enhanced My Influencers API** provides comprehensive CRM data for relationship management
- **Interaction Management API** enables detailed tracking of all influencer communications
- **Campaign Integration API** connects influencer relationships to campaign performance
- **Admin Analytics API** provides platform oversight and usage insights
- **File Upload API** supports rich interaction documentation with attachments

### Integration with Features
- **Seamless CRM Experience** - All endpoints work together to provide comprehensive relationship management
- **Campaign Attribution** - UTM tracking enables measurement of influencer impact on campaign performance
- **Admin Oversight** - Analytics endpoints provide platform monitoring and user support capabilities
- **File Management** - Upload endpoints support rich interaction documentation and campaign materials
