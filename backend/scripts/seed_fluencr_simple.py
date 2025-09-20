#!/usr/bin/env python3
"""
Simple Fluencr data seeding using direct SQL
"""
import os
import sys
import json
import uuid
from datetime import datetime, timedelta

# Add the parent directory to the path to import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def seed_fluencr_simple():
    """Create a simple SQL file with Fluencr data"""
    
    # Generate UUIDs
    fluencr_user_id = str(uuid.uuid4())
    fluencr_inf_1 = str(uuid.uuid4())
    fluencr_inf_2 = str(uuid.uuid4())
    fluencr_inf_3 = str(uuid.uuid4())
    fluencr_campaign_1 = str(uuid.uuid4())
    fluencr_campaign_2 = str(uuid.uuid4())
    fluencr_campaign_3 = str(uuid.uuid4())
    
    now = datetime.utcnow().isoformat()
    start_date_1 = (datetime.utcnow() - timedelta(days=30)).isoformat()
    end_date_1 = (datetime.utcnow() + timedelta(days=30)).isoformat()
    start_date_2 = (datetime.utcnow() + timedelta(days=7)).isoformat()
    end_date_2 = (datetime.utcnow() + timedelta(days=90)).isoformat()
    start_date_3 = (datetime.utcnow() - timedelta(days=60)).isoformat()
    end_date_3 = (datetime.utcnow() - timedelta(days=7)).isoformat()
    
    sql_content = f"""
-- Fluencr Company Data
-- Run this SQL in your Supabase SQL editor

-- 1. Insert Fluencr user (disable RLS temporarily)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

INSERT INTO users (id, email, name, role, subscription_status, created_at, updated_at) 
VALUES (
    '{fluencr_user_id}',
    'admin@fluencr.com',
    'Fluencr Admin',
    'admin',
    'active',
    '{now}',
    '{now}'
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    subscription_status = EXCLUDED.subscription_status,
    updated_at = EXCLUDED.updated_at;

-- 2. Insert Fluencr influencers
INSERT INTO influencers (id, name, platform, handle, bio, website_url, linkedin_url, industry, audience_size, engagement_rate, location, expertise_tags, is_verified, created_at, updated_at)
VALUES 
    ('{fluencr_inf_1}', 'Sarah Chen', 'linkedin', 'sarahchen-saas', 'SaaS marketing expert helping B2B companies scale through content and community. Former HubSpot, now building the future of influencer marketing.', 'https://sarahchen.com', 'https://linkedin.com/in/sarahchen-saas', 'SaaS', 15000, 4.2, 'San Francisco, CA', ARRAY['SaaS', 'Marketing', 'B2B', 'Content Strategy'], true, '{now}', '{now}'),
    ('{fluencr_inf_2}', 'Mike Rodriguez', 'newsletter', 'mike-growth', 'B2B growth specialist sharing insights on scaling startups. 50k+ newsletter subscribers. Former growth lead at Stripe.', 'https://mikegrowth.substack.com', null, 'Growth', 50000, 6.8, 'Austin, TX', ARRAY['Growth', 'B2B', 'Startups', 'Newsletter'], true, '{now}', '{now}'),
    ('{fluencr_inf_3}', 'Emma Wilson', 'podcast', 'emma-saas-podcast', 'Host of ''SaaS Stories'' podcast. 200+ episodes with B2B founders. Helping SaaS companies tell their story and grow their audience.', 'https://saasstories.com', null, 'SaaS', 25000, 3.5, 'New York, NY', ARRAY['SaaS', 'Podcasting', 'Storytelling', 'B2B'], true, '{now}', '{now}');

-- 3. Insert Fluencr campaigns
INSERT INTO campaigns (id, user_id, name, description, status, start_date, end_date, budget, spent, created_at, updated_at)
VALUES 
    ('{fluencr_campaign_1}', '{fluencr_user_id}', 'Q4 SaaS Podcast Outreach', 'Target top SaaS podcasts for Fluencr product launch awareness and thought leadership positioning', 'active', '{start_date_1}', '{end_date_1}', 25000.00, 12450.00, '{now}', '{now}'),
    ('{fluencr_campaign_2}', '{fluencr_user_id}', 'LinkedIn Creator Partnership', 'Collaborate with B2B marketing thought leaders to establish Fluencr as the go-to influencer marketing platform', 'planning', '{start_date_2}', '{end_date_2}', 15000.00, 0.00, '{now}', '{now}'),
    ('{fluencr_campaign_3}', '{fluencr_user_id}', 'Newsletter Sponsorship Series', 'Sponsor top B2B newsletters to reach decision makers in SaaS and marketing', 'completed', '{start_date_3}', '{end_date_3}', 10000.00, 10000.00, '{now}', '{now}');

-- 4. Insert campaign-influencer assignments
INSERT INTO campaign_influencers (id, campaign_id, influencer_id, utm_source, utm_medium, utm_campaign, utm_url, status, notes, created_at, updated_at)
VALUES 
    ('{str(uuid.uuid4())}', '{fluencr_campaign_1}', '{fluencr_inf_3}', 'fluencr', 'podcast', 'q4-saas-outreach', 'https://fluencr.com?utm_source=fluencr&utm_medium=podcast&utm_campaign=q4-saas-outreach', 'active', 'Featured on SaaS Stories podcast episode #201', '{now}', '{now}'),
    ('{str(uuid.uuid4())}', '{fluencr_campaign_1}', '{fluencr_inf_1}', 'fluencr', 'linkedin', 'q4-saas-outreach', 'https://fluencr.com?utm_source=fluencr&utm_medium=linkedin&utm_campaign=q4-saas-outreach', 'active', 'LinkedIn post series about B2B influencer marketing', '{now}', '{now}'),
    ('{str(uuid.uuid4())}', '{fluencr_campaign_2}', '{fluencr_inf_2}', 'fluencr', 'newsletter', 'linkedin-creator-partnership', 'https://fluencr.com?utm_source=fluencr&utm_medium=newsletter&utm_campaign=linkedin-creator-partnership', 'planned', 'Planned newsletter sponsorship for Q1 2025', '{now}', '{now}');

-- 5. Insert campaign outcomes
INSERT INTO campaign_outcomes (id, campaign_id, influencer_id, metric_type, metric_value, metric_count, attribution_date, notes, created_at)
VALUES 
    ('{str(uuid.uuid4())}', '{fluencr_campaign_1}', '{fluencr_inf_3}', 'leads', 0.00, 24, '{(datetime.utcnow() - timedelta(days=15)).isoformat()}', 'Leads generated from podcast episode', '{now}'),
    ('{str(uuid.uuid4())}', '{fluencr_campaign_1}', '{fluencr_inf_1}', 'revenue', 48600.00, 0, '{(datetime.utcnow() - timedelta(days=10)).isoformat()}', 'Revenue attributed to LinkedIn campaign', '{now}'),
    ('{str(uuid.uuid4())}', '{fluencr_campaign_3}', '{fluencr_inf_2}', 'demos', 0.00, 12, '{(datetime.utcnow() - timedelta(days=20)).isoformat()}', 'Demo requests from newsletter sponsorship', '{now}');

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Print the user ID for reference
SELECT 'Fluencr User ID: {fluencr_user_id}' as info;
"""
    
    # Write to file
    with open('fluencr_data.sql', 'w') as f:
        f.write(sql_content)
    
    print("✅ Created fluencr_data.sql")
    print(f"📋 Fluencr User ID: {fluencr_user_id}")
    print("🔧 Run this SQL in your Supabase SQL editor to seed the data")
    
    return True

if __name__ == "__main__":
    success = seed_fluencr_simple()
    sys.exit(0 if success else 1)
