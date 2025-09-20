-- Migration: CRM Performance Indexes
-- Created: 2025-09-15
-- Description: Add performance indexes for CRM workspace queries

-- Interactions table indexes
CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_influencer_id ON interactions(influencer_id);
CREATE INDEX IF NOT EXISTS idx_interactions_campaign_id ON interactions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON interactions(type);
CREATE INDEX IF NOT EXISTS idx_interactions_date ON interactions(interaction_date);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON interactions(created_at);

-- Campaign influencers table indexes
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_campaign_id ON campaign_influencers(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_influencer_id ON campaign_influencers(influencer_id);
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_user_id ON campaign_influencers(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_status ON campaign_influencers(status);
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_created_at ON campaign_influencers(created_at);

-- User influencers enhanced indexes
CREATE INDEX IF NOT EXISTS idx_user_influencers_follow_up ON user_influencers(follow_up_date);
CREATE INDEX IF NOT EXISTS idx_user_influencers_relationship_strength ON user_influencers(relationship_strength);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_interactions_user_type ON interactions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_interactions_user_date ON interactions(user_id, interaction_date);
CREATE INDEX IF NOT EXISTS idx_interactions_influencer_date ON interactions(influencer_id, interaction_date);
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_user_status ON campaign_influencers(user_id, status);
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_campaign_status ON campaign_influencers(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_user_influencers_user_status ON user_influencers(user_id, status);

-- Partial indexes for filtered queries
CREATE INDEX IF NOT EXISTS idx_interactions_recent ON interactions(interaction_date) WHERE interaction_date >= NOW() - INTERVAL '30 days';
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_active ON campaign_influencers(id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_user_influencers_high_priority ON user_influencers(id) WHERE relationship_strength >= 80;
CREATE INDEX IF NOT EXISTS idx_user_influencers_due_followup ON user_influencers(follow_up_date) WHERE follow_up_date IS NOT NULL AND follow_up_date <= NOW();

-- Add comments for documentation
COMMENT ON INDEX idx_interactions_user_id IS 'Fast lookup of interactions by user';
COMMENT ON INDEX idx_interactions_influencer_id IS 'Fast lookup of interactions by influencer';
COMMENT ON INDEX idx_interactions_campaign_id IS 'Fast lookup of interactions by campaign';
COMMENT ON INDEX idx_interactions_type IS 'Fast filtering by interaction type';
COMMENT ON INDEX idx_interactions_date IS 'Fast sorting by interaction date';
COMMENT ON INDEX idx_interactions_user_type IS 'Fast lookup of user interactions by type';
COMMENT ON INDEX idx_interactions_user_date IS 'Fast lookup of user interactions by date range';
COMMENT ON INDEX idx_interactions_recent IS 'Fast lookup of recent interactions (last 30 days)';

COMMENT ON INDEX idx_campaign_influencers_campaign_id IS 'Fast lookup of campaign assignments by campaign';
COMMENT ON INDEX idx_campaign_influencers_influencer_id IS 'Fast lookup of campaign assignments by influencer';
COMMENT ON INDEX idx_campaign_influencers_user_id IS 'Fast lookup of campaign assignments by user';
COMMENT ON INDEX idx_campaign_influencers_status IS 'Fast filtering by assignment status';
COMMENT ON INDEX idx_campaign_influencers_user_status IS 'Fast lookup of user campaign assignments by status';
COMMENT ON INDEX idx_campaign_influencers_active IS 'Fast lookup of active campaign assignments';

COMMENT ON INDEX idx_user_influencers_follow_up IS 'Fast lookup of influencers with scheduled follow-ups';
COMMENT ON INDEX idx_user_influencers_relationship_strength IS 'Fast sorting by relationship strength';
COMMENT ON INDEX idx_user_influencers_high_priority IS 'Fast lookup of high-priority influencer relationships';
COMMENT ON INDEX idx_user_influencers_due_followup IS 'Fast lookup of influencers with due follow-ups';
