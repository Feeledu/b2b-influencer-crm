-- Intent-Led Discovery Database Schema
-- This migration adds tables for audience analysis, buyer alignment scoring, and trust relationships

-- Create audience_segments table for target audience definitions
CREATE TABLE IF NOT EXISTS audience_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    demographics JSONB, -- Age, location, industry, company size, etc.
    interests JSONB, -- Topics, technologies, pain points
    behavior_patterns JSONB, -- Engagement patterns, content preferences
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create intent_signals table for engagement and behavior data
CREATE TABLE IF NOT EXISTS intent_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    signal_type VARCHAR(50) NOT NULL, -- 'linkedin_engagement', 'newsletter_opens', 'podcast_listens', 'social_engagement'
    signal_data JSONB NOT NULL, -- Platform-specific engagement data
    audience_demographics JSONB, -- Audience who engaged
    engagement_quality_score DECIMAL(3,2), -- 0.00 to 1.00
    intent_score DECIMAL(3,2), -- 0.00 to 1.00
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trust_relationships table for influencer-customer connections
CREATE TABLE IF NOT EXISTS trust_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    customer_id UUID, -- Reference to customer/lead (can be external ID)
    relationship_type VARCHAR(50) NOT NULL, -- 'follows', 'engages', 'subscribes', 'interacts'
    platform VARCHAR(50) NOT NULL, -- 'linkedin', 'twitter', 'newsletter', 'podcast'
    connection_strength DECIMAL(3,2), -- 0.00 to 1.00
    engagement_frequency INTEGER DEFAULT 0,
    last_interaction TIMESTAMP WITH TIME ZONE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create buyer_alignment_scores table for calculated alignment metrics
CREATE TABLE IF NOT EXISTS buyer_alignment_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    audience_segment_id UUID REFERENCES audience_segments(id) ON DELETE CASCADE,
    alignment_score DECIMAL(3,2) NOT NULL, -- 0.00 to 1.00
    audience_overlap_percentage DECIMAL(5,2), -- 0.00 to 100.00
    trust_score DECIMAL(3,2), -- 0.00 to 1.00
    engagement_quality DECIMAL(3,2), -- 0.00 to 1.00
    conversion_probability DECIMAL(3,2), -- 0.00 to 1.00
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(influencer_id, audience_segment_id)
);

-- Add intent-related fields to influencers table
ALTER TABLE influencers ADD COLUMN IF NOT EXISTS audience_demographics JSONB;
ALTER TABLE influencers ADD COLUMN IF NOT EXISTS engagement_quality DECIMAL(3,2);
ALTER TABLE influencers ADD COLUMN IF NOT EXISTS trust_indicators JSONB;
ALTER TABLE influencers ADD COLUMN IF NOT EXISTS buyer_alignment_score DECIMAL(3,2);
ALTER TABLE influencers ADD COLUMN IF NOT EXISTS intent_signals_count INTEGER DEFAULT 0;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audience_segments_user_id ON audience_segments(user_id);
CREATE INDEX IF NOT EXISTS idx_intent_signals_influencer_id ON intent_signals(influencer_id);
CREATE INDEX IF NOT EXISTS idx_intent_signals_signal_type ON intent_signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_intent_signals_collected_at ON intent_signals(collected_at);
CREATE INDEX IF NOT EXISTS idx_trust_relationships_influencer_id ON trust_relationships(influencer_id);
CREATE INDEX IF NOT EXISTS idx_trust_relationships_customer_id ON trust_relationships(customer_id);
CREATE INDEX IF NOT EXISTS idx_trust_relationships_platform ON trust_relationships(platform);
CREATE INDEX IF NOT EXISTS idx_buyer_alignment_scores_influencer_id ON buyer_alignment_scores(influencer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_alignment_scores_audience_segment_id ON buyer_alignment_scores(audience_segment_id);
CREATE INDEX IF NOT EXISTS idx_buyer_alignment_scores_alignment_score ON buyer_alignment_scores(alignment_score);

-- Create RLS policies
ALTER TABLE audience_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE intent_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_alignment_scores ENABLE ROW LEVEL SECURITY;

-- RLS policies for audience_segments
CREATE POLICY "Users can view their own audience segments" ON audience_segments
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own audience segments" ON audience_segments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own audience segments" ON audience_segments
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own audience segments" ON audience_segments
    FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for intent_signals (read-only for users, full access for admins)
CREATE POLICY "Users can view intent signals" ON intent_signals
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage intent signals" ON intent_signals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

-- RLS policies for trust_relationships (read-only for users, full access for admins)
CREATE POLICY "Users can view trust relationships" ON trust_relationships
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage trust relationships" ON trust_relationships
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

-- RLS policies for buyer_alignment_scores (read-only for users, full access for admins)
CREATE POLICY "Users can view buyer alignment scores" ON buyer_alignment_scores
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage buyer alignment scores" ON buyer_alignment_scores
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_audience_segments_updated_at BEFORE UPDATE ON audience_segments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trust_relationships_updated_at BEFORE UPDATE ON trust_relationships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_buyer_alignment_scores_updated_at BEFORE UPDATE ON buyer_alignment_scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
