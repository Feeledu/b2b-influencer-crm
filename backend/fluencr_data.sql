
-- Fluencr Company Data
-- Run this SQL in your Supabase SQL editor

-- 1. Insert Fluencr user (disable RLS temporarily)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

INSERT INTO users (id, email, name, role, subscription_status, created_at, updated_at) 
VALUES (
    'ba3b65f3-9031-40cd-aaab-6d4f32143bf1',
    'admin@fluencr.com',
    'Fluencr Admin',
    'admin',
    'active',
    '2025-09-21T00:53:41.651394',
    '2025-09-21T00:53:41.651394'
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    subscription_status = EXCLUDED.subscription_status,
    updated_at = EXCLUDED.updated_at;

-- 2. Insert Fluencr influencers
INSERT INTO influencers (id, name, platform, handle, bio, website_url, linkedin_url, industry, audience_size, engagement_rate, location, expertise_tags, is_verified, created_at, updated_at)
VALUES 
    ('f84e698b-c0e9-4120-8dd6-08f38c785787', 'Sarah Chen', 'linkedin', 'sarahchen-saas', 'SaaS marketing expert helping B2B companies scale through content and community. Former HubSpot, now building the future of influencer marketing.', 'https://sarahchen.com', 'https://linkedin.com/in/sarahchen-saas', 'SaaS', 15000, 4.2, 'San Francisco, CA', ARRAY['SaaS', 'Marketing', 'B2B', 'Content Strategy'], true, '2025-09-21T00:53:41.651394', '2025-09-21T00:53:41.651394'),
    ('00064261-40bf-466c-a012-ed5e18963f2c', 'Mike Rodriguez', 'newsletter', 'mike-growth', 'B2B growth specialist sharing insights on scaling startups. 50k+ newsletter subscribers. Former growth lead at Stripe.', 'https://mikegrowth.substack.com', null, 'Growth', 50000, 6.8, 'Austin, TX', ARRAY['Growth', 'B2B', 'Startups', 'Newsletter'], true, '2025-09-21T00:53:41.651394', '2025-09-21T00:53:41.651394'),
    ('ac7d1176-eee5-468b-a482-c4652cea38b7', 'Emma Wilson', 'podcast', 'emma-saas-podcast', 'Host of ''SaaS Stories'' podcast. 200+ episodes with B2B founders. Helping SaaS companies tell their story and grow their audience.', 'https://saasstories.com', null, 'SaaS', 25000, 3.5, 'New York, NY', ARRAY['SaaS', 'Podcasting', 'Storytelling', 'B2B'], true, '2025-09-21T00:53:41.651394', '2025-09-21T00:53:41.651394');

-- 3. Insert Fluencr campaigns
INSERT INTO campaigns (id, user_id, name, description, status, start_date, end_date, budget, spent, created_at, updated_at)
VALUES 
    ('54977a21-9b77-48a8-bffc-2b7fcbc07322', 'ba3b65f3-9031-40cd-aaab-6d4f32143bf1', 'Q4 SaaS Podcast Outreach', 'Target top SaaS podcasts for Fluencr product launch awareness and thought leadership positioning', 'active', '2025-08-22T00:53:41.651625', '2025-10-21T00:53:41.651629', 25000.00, 12450.00, '2025-09-21T00:53:41.651394', '2025-09-21T00:53:41.651394'),
    ('d687e9c1-bcd6-4ed8-95e3-9f0b9153ca2f', 'ba3b65f3-9031-40cd-aaab-6d4f32143bf1', 'LinkedIn Creator Partnership', 'Collaborate with B2B marketing thought leaders to establish Fluencr as the go-to influencer marketing platform', 'planning', '2025-09-28T00:53:41.651630', '2025-12-20T00:53:41.651631', 15000.00, 0.00, '2025-09-21T00:53:41.651394', '2025-09-21T00:53:41.651394'),
    ('881df310-de22-4199-9fcf-26696916c9f1', 'ba3b65f3-9031-40cd-aaab-6d4f32143bf1', 'Newsletter Sponsorship Series', 'Sponsor top B2B newsletters to reach decision makers in SaaS and marketing', 'completed', '2025-07-23T00:53:41.651632', '2025-09-14T00:53:41.651632', 10000.00, 10000.00, '2025-09-21T00:53:41.651394', '2025-09-21T00:53:41.651394');

-- 4. Insert campaign-influencer assignments
INSERT INTO campaign_influencers (id, campaign_id, influencer_id, utm_source, utm_medium, utm_campaign, utm_url, status, notes, created_at, updated_at)
VALUES 
    ('17dd3f49-eae5-47d9-80e2-21c43c992779', '54977a21-9b77-48a8-bffc-2b7fcbc07322', 'ac7d1176-eee5-468b-a482-c4652cea38b7', 'fluencr', 'podcast', 'q4-saas-outreach', 'https://fluencr.com?utm_source=fluencr&utm_medium=podcast&utm_campaign=q4-saas-outreach', 'active', 'Featured on SaaS Stories podcast episode #201', '2025-09-21T00:53:41.651394', '2025-09-21T00:53:41.651394'),
    ('6b78f89b-a0f7-4bf2-ac48-d4978e41a8e0', '54977a21-9b77-48a8-bffc-2b7fcbc07322', 'f84e698b-c0e9-4120-8dd6-08f38c785787', 'fluencr', 'linkedin', 'q4-saas-outreach', 'https://fluencr.com?utm_source=fluencr&utm_medium=linkedin&utm_campaign=q4-saas-outreach', 'active', 'LinkedIn post series about B2B influencer marketing', '2025-09-21T00:53:41.651394', '2025-09-21T00:53:41.651394'),
    ('37769d07-2b6b-43b7-b597-a175340e11d9', 'd687e9c1-bcd6-4ed8-95e3-9f0b9153ca2f', '00064261-40bf-466c-a012-ed5e18963f2c', 'fluencr', 'newsletter', 'linkedin-creator-partnership', 'https://fluencr.com?utm_source=fluencr&utm_medium=newsletter&utm_campaign=linkedin-creator-partnership', 'planned', 'Planned newsletter sponsorship for Q1 2025', '2025-09-21T00:53:41.651394', '2025-09-21T00:53:41.651394');

-- 5. Insert campaign outcomes
INSERT INTO campaign_outcomes (id, campaign_id, influencer_id, metric_type, metric_value, metric_count, attribution_date, notes, created_at)
VALUES 
    ('23a2d39c-5aa6-4cc1-9a10-89f0bcf056a0', '54977a21-9b77-48a8-bffc-2b7fcbc07322', 'ac7d1176-eee5-468b-a482-c4652cea38b7', 'leads', 0.00, 24, '2025-09-06T00:53:41.651649', 'Leads generated from podcast episode', '2025-09-21T00:53:41.651394'),
    ('f5f15f34-1a21-42f6-9336-0e49b4823b5a', '54977a21-9b77-48a8-bffc-2b7fcbc07322', 'f84e698b-c0e9-4120-8dd6-08f38c785787', 'revenue', 48600.00, 0, '2025-09-11T00:53:41.651652', 'Revenue attributed to LinkedIn campaign', '2025-09-21T00:53:41.651394'),
    ('b1b7fcfe-8fda-4b7f-b32d-d26396c97e1b', '881df310-de22-4199-9fcf-26696916c9f1', '00064261-40bf-466c-a012-ed5e18963f2c', 'demos', 0.00, 12, '2025-09-01T00:53:41.651655', 'Demo requests from newsletter sponsorship', '2025-09-21T00:53:41.651394');

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Print the user ID for reference
SELECT 'Fluencr User ID: ba3b65f3-9031-40cd-aaab-6d4f32143bf1' as info;
