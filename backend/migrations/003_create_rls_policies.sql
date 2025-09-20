-- Migration: Create Row Level Security Policies
-- Created: 2025-01-14
-- Description: Enable RLS and create security policies for user data isolation

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_outcomes ENABLE ROW LEVEL SECURITY;

-- Influencers table is public (no RLS needed)
-- Users can view all influencers but only manage their own relationships

-- Users Table Policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User Influencers Policies
CREATE POLICY "Users can manage own influencer lists" ON user_influencers
    FOR ALL USING (auth.uid() = user_id);

-- Campaigns Policies
CREATE POLICY "Users can manage own campaigns" ON campaigns
    FOR ALL USING (auth.uid() = user_id);

-- Campaign Influencers Policies
CREATE POLICY "Users can manage campaign influencers for own campaigns" ON campaign_influencers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM campaigns 
            WHERE campaigns.id = campaign_influencers.campaign_id 
            AND campaigns.user_id = auth.uid()
        )
    );

-- Interactions Policies
CREATE POLICY "Users can manage own interactions" ON interactions
    FOR ALL USING (auth.uid() = user_id);

-- Pipeline Attribution Policies
CREATE POLICY "Users can manage own attribution data" ON pipeline_attribution
    FOR ALL USING (auth.uid() = user_id);

-- Campaign Outcomes Policies
CREATE POLICY "Users can manage outcomes for own campaigns" ON campaign_outcomes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM campaigns 
            WHERE campaigns.id = campaign_outcomes.campaign_id 
            AND campaigns.user_id = auth.uid()
        )
    );

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_influencers_updated_at BEFORE UPDATE ON influencers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_influencers_updated_at BEFORE UPDATE ON user_influencers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_influencers_updated_at BEFORE UPDATE ON campaign_influencers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_attribution_updated_at BEFORE UPDATE ON pipeline_attribution
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
