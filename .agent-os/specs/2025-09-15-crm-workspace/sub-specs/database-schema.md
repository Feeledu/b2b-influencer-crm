# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-09-15-crm-workspace/spec.md

## Changes

### Enhanced user_influencers table
Add CRM-specific fields to existing table:
- `status` - Current relationship status (saved, contacted, warm, cold, partnered)
- `notes` - User notes about the influencer relationship
- `tags` - Array of tags for categorization
- `priority` - Priority level (0-5, where 5 is highest)
- `last_contacted_at` - Timestamp of last interaction
- `follow_up_date` - Scheduled follow-up date
- `relationship_strength` - Calculated relationship strength score (0-100)

### New interactions table
Store detailed interaction history:
- `id` - Primary key
- `user_id` - Foreign key to users table
- `influencer_id` - Foreign key to influencers table
- `campaign_id` - Optional foreign key to campaigns table
- `type` - Interaction type (email, call, meeting, note, file_upload)
- `subject` - Subject line or title
- `content` - Interaction content/notes
- `file_url` - Optional file attachment URL
- `interaction_date` - When the interaction occurred
- `created_at` - Record creation timestamp

### New campaign_influencers table
Link influencers to campaigns with tracking:
- `id` - Primary key
- `campaign_id` - Foreign key to campaigns table
- `influencer_id` - Foreign key to influencers table
- `user_id` - Foreign key to users table
- `utm_source` - UTM source parameter
- `utm_medium` - UTM medium parameter
- `utm_campaign` - UTM campaign parameter
- `utm_content` - UTM content parameter
- `utm_term` - UTM term parameter
- `utm_url` - Generated UTM tracking URL
- `status` - Campaign assignment status (planned, active, completed, cancelled)
- `notes` - Campaign-specific notes
- `created_at` - Assignment timestamp

### New admin_analytics view
Aggregated data for admin dashboard:
- User activity metrics
- Influencer relationship statistics
- Campaign performance data
- Platform usage patterns

## Specifications

### SQL Migration Script
```sql
-- Migration: CRM Workspace Schema
-- Created: 2025-09-15
-- Description: Add CRM workspace functionality to existing schema

-- Enhance user_influencers table
ALTER TABLE user_influencers ADD COLUMN IF NOT EXISTS follow_up_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE user_influencers ADD COLUMN IF NOT EXISTS relationship_strength INTEGER DEFAULT 0;

-- Create interactions table
CREATE TABLE IF NOT EXISTS interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'call', 'meeting', 'note', 'file_upload')),
    subject VARCHAR(255),
    content TEXT,
    file_url TEXT,
    interaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaign_influencers table
CREATE TABLE IF NOT EXISTS campaign_influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    utm_url TEXT,
    status VARCHAR(50) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, influencer_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_influencer_id ON interactions(influencer_id);
CREATE INDEX IF NOT EXISTS idx_interactions_campaign_id ON interactions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON interactions(type);
CREATE INDEX IF NOT EXISTS idx_interactions_date ON interactions(interaction_date);
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_campaign_id ON campaign_influencers(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_influencer_id ON campaign_influencers(influencer_id);
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_user_id ON campaign_influencers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_influencers_follow_up ON user_influencers(follow_up_date);
CREATE INDEX IF NOT EXISTS idx_user_influencers_relationship_strength ON user_influencers(relationship_strength);

-- Create admin analytics view
CREATE OR REPLACE VIEW admin_analytics AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(DISTINCT ui.influencer_id) as total_influencers,
    COUNT(DISTINCT CASE WHEN ui.status = 'partnered' THEN ui.influencer_id END) as partnered_influencers,
    COUNT(DISTINCT c.id) as total_campaigns,
    COUNT(DISTINCT i.id) as total_interactions,
    AVG(ui.relationship_strength) as avg_relationship_strength,
    MAX(ui.last_contacted_at) as last_activity
FROM users u
LEFT JOIN user_influencers ui ON u.id = ui.user_id
LEFT JOIN campaigns c ON u.id = c.user_id
LEFT JOIN interactions i ON u.id = i.user_id
GROUP BY u.id, u.email;
```

## Rationale

### Performance Considerations
- **Composite indexes** on frequently queried combinations (user_id + status, influencer_id + type)
- **Partial indexes** for active records and recent interactions
- **View materialization** for admin analytics to avoid expensive aggregations

### Data Integrity Rules
- **Cascade deletes** ensure data consistency when users or influencers are removed
- **Check constraints** enforce valid status values and interaction types
- **Unique constraints** prevent duplicate campaign-influencer assignments
- **Foreign key constraints** maintain referential integrity across all relationships

### Relationship Management
- **Flexible interaction tracking** supports multiple interaction types with optional campaign context
- **Status workflow** enables clear progression tracking from initial contact to partnership
- **UTM tracking** provides attribution data for campaign performance measurement
- **Admin oversight** allows platform monitoring without exposing sensitive user data
