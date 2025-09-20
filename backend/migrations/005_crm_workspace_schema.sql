-- Migration: CRM Workspace Schema
-- Created: 2025-09-15
-- Description: Add CRM workspace functionality with interactions, campaign assignments, and admin analytics

-- Enhance user_influencers table with CRM fields
ALTER TABLE user_influencers ADD COLUMN IF NOT EXISTS follow_up_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE user_influencers ADD COLUMN IF NOT EXISTS relationship_strength INTEGER DEFAULT 0;

-- Create interactions table for tracking all influencer communications
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

-- Create campaign_influencers table for linking influencers to campaigns with UTM tracking
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

-- Add comments for documentation
COMMENT ON COLUMN user_influencers.follow_up_date IS 'Scheduled follow-up date for influencer relationship';
COMMENT ON COLUMN user_influencers.relationship_strength IS 'Calculated relationship strength score (0-100)';

COMMENT ON TABLE interactions IS 'Track all user interactions with influencers including emails, calls, meetings, notes, and file uploads';
COMMENT ON COLUMN interactions.type IS 'Type of interaction: email, call, meeting, note, or file_upload';
COMMENT ON COLUMN interactions.subject IS 'Subject line for emails or title for other interactions';
COMMENT ON COLUMN interactions.content IS 'Main content or notes for the interaction';
COMMENT ON COLUMN interactions.file_url IS 'URL to uploaded file attachment if applicable';
COMMENT ON COLUMN interactions.interaction_date IS 'When the interaction actually occurred';

COMMENT ON TABLE campaign_influencers IS 'Link influencers to campaigns with UTM tracking and performance data';
COMMENT ON COLUMN campaign_influencers.utm_source IS 'UTM source parameter for tracking';
COMMENT ON COLUMN campaign_influencers.utm_medium IS 'UTM medium parameter for tracking';
COMMENT ON COLUMN campaign_influencers.utm_campaign IS 'UTM campaign parameter for tracking';
COMMENT ON COLUMN campaign_influencers.utm_content IS 'UTM content parameter for tracking';
COMMENT ON COLUMN campaign_influencers.utm_term IS 'UTM term parameter for tracking';
COMMENT ON COLUMN campaign_influencers.utm_url IS 'Generated UTM tracking URL';
COMMENT ON COLUMN campaign_influencers.status IS 'Campaign assignment status: planned, active, completed, or cancelled';
COMMENT ON COLUMN campaign_influencers.notes IS 'Campaign-specific notes about the influencer assignment';
