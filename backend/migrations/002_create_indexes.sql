-- Migration: Create Performance Indexes
-- Created: 2025-01-14
-- Description: Create indexes for optimal query performance

-- Influencer search indexes
CREATE INDEX idx_influencers_platform ON influencers(platform);
CREATE INDEX idx_influencers_industry ON influencers(industry);
CREATE INDEX idx_influencers_audience_size ON influencers(audience_size);
CREATE INDEX idx_influencers_engagement_rate ON influencers(engagement_rate);
CREATE INDEX idx_influencers_expertise_tags ON influencers USING GIN(expertise_tags);
CREATE INDEX idx_influencers_created_at ON influencers(created_at);

-- User data indexes
CREATE INDEX idx_user_influencers_user_id ON user_influencers(user_id);
CREATE INDEX idx_user_influencers_status ON user_influencers(status);
CREATE INDEX idx_user_influencers_influencer_id ON user_influencers(influencer_id);
CREATE INDEX idx_user_influencers_priority ON user_influencers(priority);
CREATE INDEX idx_user_influencers_last_contacted ON user_influencers(last_contacted_at);

-- Campaign indexes
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_campaign_influencers_campaign_id ON campaign_influencers(campaign_id);
CREATE INDEX idx_campaign_influencers_influencer_id ON campaign_influencers(influencer_id);
CREATE INDEX idx_campaign_influencers_status ON campaign_influencers(status);

-- Interaction indexes
CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_interactions_influencer_id ON interactions(influencer_id);
CREATE INDEX idx_interactions_campaign_id ON interactions(campaign_id);
CREATE INDEX idx_interactions_type ON interactions(type);
CREATE INDEX idx_interactions_date ON interactions(interaction_date);

-- Pipeline attribution indexes
CREATE INDEX idx_pipeline_attribution_user_id ON pipeline_attribution(user_id);
CREATE INDEX idx_pipeline_attribution_campaign_id ON pipeline_attribution(campaign_id);
CREATE INDEX idx_pipeline_attribution_influencer_id ON pipeline_attribution(influencer_id);
CREATE INDEX idx_pipeline_attribution_stage ON pipeline_attribution(stage);
CREATE INDEX idx_pipeline_attribution_close_date ON pipeline_attribution(close_date);
CREATE INDEX idx_pipeline_attribution_value ON pipeline_attribution(value);

-- Campaign outcomes indexes
CREATE INDEX idx_campaign_outcomes_campaign_id ON campaign_outcomes(campaign_id);
CREATE INDEX idx_campaign_outcomes_influencer_id ON campaign_outcomes(influencer_id);
CREATE INDEX idx_campaign_outcomes_metric_type ON campaign_outcomes(metric_type);
CREATE INDEX idx_campaign_outcomes_attribution_date ON campaign_outcomes(attribution_date);

-- Composite indexes for common query patterns
CREATE INDEX idx_influencers_platform_industry ON influencers(platform, industry);
CREATE INDEX idx_influencers_audience_engagement ON influencers(audience_size, engagement_rate);
CREATE INDEX idx_user_influencers_user_status ON user_influencers(user_id, status);
CREATE INDEX idx_campaigns_user_status ON campaigns(user_id, status);
CREATE INDEX idx_interactions_user_date ON interactions(user_id, interaction_date);
CREATE INDEX idx_pipeline_attribution_user_stage ON pipeline_attribution(user_id, stage);

-- Partial indexes for filtered queries
CREATE INDEX idx_influencers_verified ON influencers(id) WHERE is_verified = TRUE;
CREATE INDEX idx_campaigns_active ON campaigns(id) WHERE status = 'active';
CREATE INDEX idx_user_influencers_partnered ON user_influencers(id) WHERE status = 'partnered';
CREATE INDEX idx_pipeline_attribution_closed_won ON pipeline_attribution(id) WHERE stage = 'closed_won';
