
-- Fluencr Company Data
-- Run this SQL in your Supabase SQL editor

-- 1. Insert Fluencr user (disable RLS temporarily)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

INSERT INTO users (id, email, name, role, subscription_status, created_at, updated_at) 
VALUES (
    '70fd2b83-5c83-4660-8131-fa136bd39f42',
    'admin@fluencr.com',
    'Fluencr Admin',
    'admin',
    'active',
    '2025-09-20T15:14:33.967030',
    '2025-09-20T15:14:33.967030'
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    subscription_status = EXCLUDED.subscription_status,
    updated_at = EXCLUDED.updated_at;

-- 2. Insert Fluencr influencers
INSERT INTO influencers (id, name, platform, handle, bio, website_url, linkedin_url, industry, audience_size, engagement_rate, location, expertise_tags, is_verified, created_at, updated_at)
VALUES 
    ('cec2a727-5363-487a-8908-7b2eb9724610', 'Sarah Chen', 'linkedin', 'sarahchen-saas', 'SaaS marketing expert helping B2B companies scale through content and community. Former HubSpot, now building the future of influencer marketing.', 'https://sarahchen.com', 'https://linkedin.com/in/sarahchen-saas', 'SaaS', 15000, 4.2, 'San Francisco, CA', ARRAY['SaaS', 'Marketing', 'B2B', 'Content Strategy'], true, '2025-09-20T15:14:33.967030', '2025-09-20T15:14:33.967030'),
    ('b4618110-a857-4176-9dba-35165fc73199', 'Mike Rodriguez', 'newsletter', 'mike-growth', 'B2B growth specialist sharing insights on scaling startups. 50k+ newsletter subscribers. Former growth lead at Stripe.', 'https://mikegrowth.substack.com', null, 'Growth', 50000, 6.8, 'Austin, TX', ARRAY['Growth', 'B2B', 'Startups', 'Newsletter'], true, '2025-09-20T15:14:33.967030', '2025-09-20T15:14:33.967030'),
    ('6c53c499-a9f7-40d1-b840-e632fcc616b2', 'Emma Wilson', 'podcast', 'emma-saas-podcast', 'Host of ''SaaS Stories'' podcast. 200+ episodes with B2B founders. Helping SaaS companies tell their story and grow their audience.', 'https://saasstories.com', null, 'SaaS', 25000, 3.5, 'New York, NY', ARRAY['SaaS', 'Podcasting', 'Storytelling', 'B2B'], true, '2025-09-20T15:14:33.967030', '2025-09-20T15:14:33.967030');

-- 3. Insert Fluencr campaigns
INSERT INTO campaigns (id, user_id, name, description, status, start_date, end_date, budget, spent, created_at, updated_at)
VALUES 
    ('139185df-01fa-4005-8da5-a3536d53a4a7', '70fd2b83-5c83-4660-8131-fa136bd39f42', 'Q4 SaaS Podcast Outreach', 'Target top SaaS podcasts for Fluencr product launch awareness and thought leadership positioning', 'active', '2025-08-21T15:14:33.967388', '2025-10-20T15:14:33.967392', 25000.00, 12450.00, '2025-09-20T15:14:33.967030', '2025-09-20T15:14:33.967030'),
    ('6ed478d9-39c6-40c2-929a-79bde565d818', '70fd2b83-5c83-4660-8131-fa136bd39f42', 'LinkedIn Creator Partnership', 'Collaborate with B2B marketing thought leaders to establish Fluencr as the go-to influencer marketing platform', 'planning', '2025-09-27T15:14:33.967393', '2025-12-19T15:14:33.967394', 15000.00, 0.00, '2025-09-20T15:14:33.967030', '2025-09-20T15:14:33.967030'),
    ('cd4356cf-c7ea-4d39-b650-585f3ea5e42a', '70fd2b83-5c83-4660-8131-fa136bd39f42', 'Newsletter Sponsorship Series', 'Sponsor top B2B newsletters to reach decision makers in SaaS and marketing', 'completed', '2025-07-22T15:14:33.967395', '2025-09-13T15:14:33.967396', 10000.00, 10000.00, '2025-09-20T15:14:33.967030', '2025-09-20T15:14:33.967030');

-- 4. Insert campaign-influencer assignments
INSERT INTO campaign_influencers (id, campaign_id, influencer_id, utm_source, utm_medium, utm_campaign, utm_url, status, notes, created_at, updated_at)
VALUES 
    ('edae3993-e600-441d-9751-c17fe138c1ea', '139185df-01fa-4005-8da5-a3536d53a4a7', '6c53c499-a9f7-40d1-b840-e632fcc616b2', 'fluencr', 'podcast', 'q4-saas-outreach', 'https://fluencr.com?utm_source=fluencr&utm_medium=podcast&utm_campaign=q4-saas-outreach', 'active', 'Featured on SaaS Stories podcast episode #201', '2025-09-20T15:14:33.967030', '2025-09-20T15:14:33.967030'),
    ('a0075ec6-bd77-4012-8563-29566b4caa81', '139185df-01fa-4005-8da5-a3536d53a4a7', 'cec2a727-5363-487a-8908-7b2eb9724610', 'fluencr', 'linkedin', 'q4-saas-outreach', 'https://fluencr.com?utm_source=fluencr&utm_medium=linkedin&utm_campaign=q4-saas-outreach', 'active', 'LinkedIn post series about B2B influencer marketing', '2025-09-20T15:14:33.967030', '2025-09-20T15:14:33.967030'),
    ('52050e1a-7b77-45d3-8832-ff8f57a415a0', '6ed478d9-39c6-40c2-929a-79bde565d818', 'b4618110-a857-4176-9dba-35165fc73199', 'fluencr', 'newsletter', 'linkedin-creator-partnership', 'https://fluencr.com?utm_source=fluencr&utm_medium=newsletter&utm_campaign=linkedin-creator-partnership', 'planned', 'Planned newsletter sponsorship for Q1 2025', '2025-09-20T15:14:33.967030', '2025-09-20T15:14:33.967030');

-- 5. Insert campaign outcomes
INSERT INTO campaign_outcomes (id, campaign_id, influencer_id, metric_type, metric_value, metric_count, attribution_date, notes, created_at)
VALUES 
    ('df7ef9ab-c3d2-4129-8528-6104e3e269ea', '139185df-01fa-4005-8da5-a3536d53a4a7', '6c53c499-a9f7-40d1-b840-e632fcc616b2', 'leads', 0.00, 24, '2025-09-05T15:14:33.967414', 'Leads generated from podcast episode', '2025-09-20T15:14:33.967030'),
    ('5f47af4b-abe5-4756-988d-2c74ac4d7c2a', '139185df-01fa-4005-8da5-a3536d53a4a7', 'cec2a727-5363-487a-8908-7b2eb9724610', 'revenue', 48600.00, 0, '2025-09-10T15:14:33.967417', 'Revenue attributed to LinkedIn campaign', '2025-09-20T15:14:33.967030'),
    ('a3f57e9d-a232-4dc7-92c4-09ca3b3a9f04', 'cd4356cf-c7ea-4d39-b650-585f3ea5e42a', 'b4618110-a857-4176-9dba-35165fc73199', 'demos', 0.00, 12, '2025-08-31T15:14:33.967420', 'Demo requests from newsletter sponsorship', '2025-09-20T15:14:33.967030');

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Print the user ID for reference
SELECT 'Fluencr User ID: 70fd2b83-5c83-4660-8131-fa136bd39f42' as info;
