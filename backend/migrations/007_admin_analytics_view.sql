-- Migration: Admin Analytics View
-- Created: 2025-09-15
-- Description: Create admin analytics view for platform oversight and reporting

-- Create admin analytics view
CREATE OR REPLACE VIEW admin_analytics AS
SELECT 
    u.id as user_id,
    u.email,
    u.name,
    u.created_at as user_created_at,
    u.subscription_status,
    
    -- Influencer relationship metrics
    COUNT(DISTINCT ui.influencer_id) as total_influencers,
    COUNT(DISTINCT CASE WHEN ui.status = 'saved' THEN ui.influencer_id END) as saved_influencers,
    COUNT(DISTINCT CASE WHEN ui.status = 'contacted' THEN ui.influencer_id END) as contacted_influencers,
    COUNT(DISTINCT CASE WHEN ui.status = 'warm' THEN ui.influencer_id END) as warm_influencers,
    COUNT(DISTINCT CASE WHEN ui.status = 'cold' THEN ui.influencer_id END) as cold_influencers,
    COUNT(DISTINCT CASE WHEN ui.status = 'partnered' THEN ui.influencer_id END) as partnered_influencers,
    
    -- Campaign metrics
    COUNT(DISTINCT c.id) as total_campaigns,
    COUNT(DISTINCT CASE WHEN c.status = 'planning' THEN c.id END) as planning_campaigns,
    COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_campaigns,
    COUNT(DISTINCT CASE WHEN c.status = 'completed' THEN c.id END) as completed_campaigns,
    COUNT(DISTINCT CASE WHEN c.status = 'cancelled' THEN c.id END) as cancelled_campaigns,
    
    -- Interaction metrics
    COUNT(DISTINCT i.id) as total_interactions,
    COUNT(DISTINCT CASE WHEN i.type = 'email' THEN i.id END) as email_interactions,
    COUNT(DISTINCT CASE WHEN i.type = 'call' THEN i.id END) as call_interactions,
    COUNT(DISTINCT CASE WHEN i.type = 'meeting' THEN i.id END) as meeting_interactions,
    COUNT(DISTINCT CASE WHEN i.type = 'note' THEN i.id END) as note_interactions,
    COUNT(DISTINCT CASE WHEN i.type = 'file_upload' THEN i.id END) as file_interactions,
    
    -- Campaign assignment metrics
    COUNT(DISTINCT ci.id) as total_campaign_assignments,
    COUNT(DISTINCT CASE WHEN ci.status = 'planned' THEN ci.id END) as planned_assignments,
    COUNT(DISTINCT CASE WHEN ci.status = 'active' THEN ci.id END) as active_assignments,
    COUNT(DISTINCT CASE WHEN ci.status = 'completed' THEN ci.id END) as completed_assignments,
    COUNT(DISTINCT CASE WHEN ci.status = 'cancelled' THEN ci.id END) as cancelled_assignments,
    
    -- Relationship quality metrics
    AVG(ui.relationship_strength) as avg_relationship_strength,
    MAX(ui.relationship_strength) as max_relationship_strength,
    MIN(ui.relationship_strength) as min_relationship_strength,
    COUNT(DISTINCT CASE WHEN ui.relationship_strength >= 80 THEN ui.influencer_id END) as high_quality_relationships,
    
    -- Activity metrics
    MAX(ui.last_contacted_at) as last_influencer_contact,
    MAX(i.interaction_date) as last_interaction,
    MAX(ci.created_at) as last_campaign_assignment,
    MAX(GREATEST(ui.last_contacted_at, i.interaction_date, ci.created_at)) as last_activity,
    
    -- Follow-up metrics
    COUNT(DISTINCT CASE WHEN ui.follow_up_date IS NOT NULL THEN ui.influencer_id END) as influencers_with_followup,
    COUNT(DISTINCT CASE WHEN ui.follow_up_date IS NOT NULL AND ui.follow_up_date <= NOW() THEN ui.influencer_id END) as overdue_followups,
    COUNT(DISTINCT CASE WHEN ui.follow_up_date IS NOT NULL AND ui.follow_up_date > NOW() AND ui.follow_up_date <= NOW() + INTERVAL '7 days' THEN ui.influencer_id END) as upcoming_followups

FROM users u
LEFT JOIN user_influencers ui ON u.id = ui.user_id
LEFT JOIN campaigns c ON u.id = c.user_id
LEFT JOIN interactions i ON u.id = i.user_id
LEFT JOIN campaign_influencers ci ON u.id = ci.user_id
GROUP BY u.id, u.email, u.name, u.created_at, u.subscription_status;

-- Create platform summary view for high-level analytics
CREATE OR REPLACE VIEW platform_summary AS
SELECT 
    COUNT(DISTINCT user_id) as total_users,
    COUNT(DISTINCT CASE WHEN subscription_status = 'active' THEN user_id END) as active_users,
    COUNT(DISTINCT CASE WHEN subscription_status = 'trial' THEN user_id END) as trial_users,
    COUNT(DISTINCT CASE WHEN subscription_status = 'cancelled' THEN user_id END) as cancelled_users,
    
    SUM(total_influencers) as total_platform_influencers,
    SUM(partnered_influencers) as total_partnered_influencers,
    SUM(total_campaigns) as total_platform_campaigns,
    SUM(active_campaigns) as total_active_campaigns,
    SUM(total_interactions) as total_platform_interactions,
    SUM(total_campaign_assignments) as total_platform_assignments,
    
    AVG(avg_relationship_strength) as platform_avg_relationship_strength,
    SUM(high_quality_relationships) as total_high_quality_relationships,
    SUM(overdue_followups) as total_overdue_followups,
    SUM(upcoming_followups) as total_upcoming_followups,
    
    MAX(last_activity) as platform_last_activity,
    COUNT(DISTINCT CASE WHEN last_activity >= NOW() - INTERVAL '7 days' THEN user_id END) as active_users_7d,
    COUNT(DISTINCT CASE WHEN last_activity >= NOW() - INTERVAL '30 days' THEN user_id END) as active_users_30d

FROM admin_analytics;

-- Create status distribution view for dashboard charts
CREATE OR REPLACE VIEW status_distribution AS
SELECT 
    'influencer_status' as metric_type,
    ui.status as status_value,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM user_influencers ui
GROUP BY ui.status

UNION ALL

SELECT 
    'campaign_status' as metric_type,
    c.status as status_value,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM campaigns c
GROUP BY c.status

UNION ALL

SELECT 
    'assignment_status' as metric_type,
    ci.status as status_value,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM campaign_influencers ci
GROUP BY ci.status

UNION ALL

SELECT 
    'interaction_type' as metric_type,
    i.type as status_value,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM interactions i
GROUP BY i.type;

-- Add comments for documentation
COMMENT ON VIEW admin_analytics IS 'Comprehensive user analytics for admin dashboard including influencer relationships, campaigns, interactions, and activity metrics';
COMMENT ON VIEW platform_summary IS 'High-level platform metrics and summary statistics for admin overview';
COMMENT ON VIEW status_distribution IS 'Status distribution data for dashboard charts and reporting across all major entities';
