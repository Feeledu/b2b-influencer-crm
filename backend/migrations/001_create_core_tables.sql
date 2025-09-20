-- Migration: Create Core Tables
-- Created: 2025-01-14
-- Description: Create all core tables for B2B Influencer CRM

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user',
    subscription_status VARCHAR(50) DEFAULT 'trial',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Influencers Table
CREATE TABLE influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'podcast', 'newsletter')),
    handle VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    website_url TEXT,
    email VARCHAR(255),
    linkedin_url TEXT,
    twitter_url TEXT,
    industry VARCHAR(100),
    audience_size INTEGER CHECK (audience_size >= 0),
    engagement_rate DECIMAL(5,2) CHECK (engagement_rate >= 0 AND engagement_rate <= 100),
    location VARCHAR(100),
    expertise_tags TEXT[],
    audience_demographics JSONB,
    contact_info JSONB,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User Influencers (Junction Table)
CREATE TABLE user_influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'saved' CHECK (status IN ('saved', 'contacted', 'warm', 'cold', 'partnered')),
    notes TEXT,
    priority INTEGER DEFAULT 0,
    tags TEXT[],
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, influencer_id)
);

-- 4. Campaigns Table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2) CHECK (budget >= 0),
    spent DECIMAL(10,2) DEFAULT 0 CHECK (spent >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Campaign Influencers (Junction Table)
CREATE TABLE campaign_influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
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

-- 6. Interactions Table
CREATE TABLE interactions (
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

-- 7. Pipeline Attribution Table
CREATE TABLE pipeline_attribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    opportunity_id VARCHAR(255),
    opportunity_name VARCHAR(255),
    stage VARCHAR(100) CHECK (stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
    value DECIMAL(12,2) CHECK (value >= 0),
    probability DECIMAL(5,2) CHECK (probability >= 0 AND probability <= 100),
    close_date DATE,
    attribution_type VARCHAR(50) CHECK (attribution_type IN ('direct', 'assisted', 'influenced')),
    attribution_strength DECIMAL(5,2) CHECK (attribution_strength >= 0 AND attribution_strength <= 100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Campaign Outcomes Table
CREATE TABLE campaign_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('leads', 'demos', 'signups', 'revenue', 'pipeline')),
    metric_value DECIMAL(12,2) CHECK (metric_value >= 0),
    metric_count INTEGER CHECK (metric_count >= 0),
    attribution_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE users IS 'User accounts and authentication data';
COMMENT ON TABLE influencers IS 'B2B influencers across LinkedIn, podcasts, and newsletters';
COMMENT ON TABLE user_influencers IS 'User-specific influencer lists and relationship status';
COMMENT ON TABLE campaigns IS 'Marketing campaigns created by users';
COMMENT ON TABLE campaign_influencers IS 'Influencers assigned to specific campaigns with UTM tracking';
COMMENT ON TABLE interactions IS 'User interactions with influencers (calls, emails, notes)';
COMMENT ON TABLE pipeline_attribution IS 'Attribution of influencer campaigns to pipeline and revenue';
COMMENT ON TABLE campaign_outcomes IS 'Measurable outcomes and metrics for influencer campaigns';
