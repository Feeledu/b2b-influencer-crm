#!/usr/bin/env python3
"""
Seed Fluencr with real company data for testing
"""
import os
import sys
import json
import uuid
from datetime import datetime, timedelta
from supabase import create_client, Client

# Add the parent directory to the path to import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def get_supabase_client():
    """Get Supabase client with environment variables"""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    
    if not url or not key:
        print("❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables")
        return None
    
    return create_client(url, key)

def seed_fluencr_data():
    """Seed database with Fluencr company data"""
    supabase = get_supabase_client()
    if not supabase:
        return False
    
    try:
        print("🌱 Seeding Fluencr data...")
        
        # 1. Create Fluencr company user
        fluencr_user_id = str(uuid.uuid4())
        fluencr_user = {
            "id": fluencr_user_id,
            "email": "admin@fluencr.com",
            "name": "Fluencr Admin",
            "role": "admin",
            "subscription_status": "active",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        # Insert or update user
        result = supabase.table("users").upsert(fluencr_user).execute()
        print(f"✅ Created Fluencr user: {fluencr_user['email']}")
        
        # 2. Create Fluencr influencers
        fluencr_inf_1 = str(uuid.uuid4())
        fluencr_inf_2 = str(uuid.uuid4())
        fluencr_inf_3 = str(uuid.uuid4())
        fluencr_inf_4 = str(uuid.uuid4())
        fluencr_inf_5 = str(uuid.uuid4())
        
        fluencr_influencers = [
            {
                "id": fluencr_inf_1,
                "name": "Sarah Chen",
                "platform": "linkedin",
                "handle": "sarahchen-saas",
                "bio": "SaaS marketing expert helping B2B companies scale through content and community. Former HubSpot, now building the future of influencer marketing.",
                "website_url": "https://sarahchen.com",
                "linkedin_url": "https://linkedin.com/in/sarahchen-saas",
                "industry": "SaaS",
                "audience_size": 15000,
                "engagement_rate": 4.2,
                "location": "San Francisco, CA",
                "expertise_tags": ["SaaS", "Marketing", "B2B", "Content Strategy"],
                "is_verified": True,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            },
            {
                "id": fluencr_inf_2, 
                "name": "Mike Rodriguez",
                "platform": "newsletter",
                "handle": "mike-growth",
                "bio": "B2B growth specialist sharing insights on scaling startups. 50k+ newsletter subscribers. Former growth lead at Stripe.",
                "website_url": "https://mikegrowth.substack.com",
                "newsletter_url": "https://mikegrowth.substack.com",
                "industry": "Growth",
                "audience_size": 50000,
                "engagement_rate": 6.8,
                "location": "Austin, TX",
                "expertise_tags": ["Growth", "B2B", "Startups", "Newsletter"],
                "is_verified": True,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            },
            {
                "id": fluencr_inf_3,
                "name": "Emma Wilson", 
                "platform": "podcast",
                "handle": "emma-saas-podcast",
                "bio": "Host of 'SaaS Stories' podcast. 200+ episodes with B2B founders. Helping SaaS companies tell their story and grow their audience.",
                "website_url": "https://saasstories.com",
                "podcast_url": "https://saasstories.com",
                "industry": "SaaS",
                "audience_size": 25000,
                "engagement_rate": 3.5,
                "location": "New York, NY",
                "expertise_tags": ["SaaS", "Podcasting", "Storytelling", "B2B"],
                "is_verified": True,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            },
            {
                "id": fluencr_inf_4,
                "name": "Alex Johnson",
                "platform": "linkedin",
                "handle": "alex-tech-reviews",
                "bio": "Tech reviewer and educator with 30k+ LinkedIn followers. Breaking down complex B2B tools for non-technical founders.",
                "website_url": "https://alextechreviews.com",
                "linkedin_url": "https://linkedin.com/in/alex-tech-reviews",
                "industry": "Technology",
                "audience_size": 30000,
                "engagement_rate": 2.9,
                "location": "Seattle, WA",
                "expertise_tags": ["Technology", "Reviews", "Education", "B2B Tools"],
                "is_verified": True,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            },
            {
                "id": fluencr_inf_5,
                "name": "David Park",
                "platform": "newsletter",
                "handle": "david-startup-advice",
                "bio": "Startup advisor and investor sharing weekly insights on building and scaling B2B companies. 40k+ subscribers.",
                "website_url": "https://davidpark.substack.com",
                "newsletter_url": "https://davidpark.substack.com",
                "industry": "Startups",
                "audience_size": 40000,
                "engagement_rate": 4.7,
                "location": "Boston, MA",
                "expertise_tags": ["Startups", "Investing", "B2B", "Scaling"],
                "is_verified": True,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
        ]
        
        # Insert influencers
        result = supabase.table("influencers").upsert(fluencr_influencers).execute()
        print(f"✅ Created {len(fluencr_influencers)} Fluencr influencers")
        
        # 3. Create Fluencr campaigns
        fluencr_campaign_1 = str(uuid.uuid4())
        fluencr_campaign_2 = str(uuid.uuid4())
        fluencr_campaign_3 = str(uuid.uuid4())
        
        fluencr_campaigns = [
            {
                "id": fluencr_campaign_1,
                "user_id": fluencr_user_id,
                "name": "Q4 SaaS Podcast Outreach",
                "description": "Target top SaaS podcasts for Fluencr product launch awareness and thought leadership positioning",
                "status": "active",
                "start_date": (datetime.utcnow() - timedelta(days=30)).isoformat(),
                "end_date": (datetime.utcnow() + timedelta(days=30)).isoformat(),
                "budget": 25000.00,
                "spent": 12450.00,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            },
            {
                "id": fluencr_campaign_2,
                "user_id": fluencr_user_id, 
                "name": "LinkedIn Creator Partnership",
                "description": "Collaborate with B2B marketing thought leaders to establish Fluencr as the go-to influencer marketing platform",
                "status": "planning",
                "start_date": (datetime.utcnow() + timedelta(days=7)).isoformat(),
                "end_date": (datetime.utcnow() + timedelta(days=90)).isoformat(),
                "budget": 15000.00,
                "spent": 0.00,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            },
            {
                "id": fluencr_campaign_3,
                "user_id": fluencr_user_id,
                "name": "Newsletter Sponsorship Series",
                "description": "Sponsor top B2B newsletters to reach decision makers in SaaS and marketing",
                "status": "completed",
                "start_date": (datetime.utcnow() - timedelta(days=60)).isoformat(),
                "end_date": (datetime.utcnow() - timedelta(days=7)).isoformat(),
                "budget": 10000.00,
                "spent": 10000.00,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
        ]
        
        # Insert campaigns
        result = supabase.table("campaigns").upsert(fluencr_campaigns).execute()
        print(f"✅ Created {len(fluencr_campaigns)} Fluencr campaigns")
        
        # 4. Create campaign-influencer assignments
        campaign_assignments = [
            {
                "id": str(uuid.uuid4()),
                "campaign_id": fluencr_campaign_1,
                "influencer_id": fluencr_inf_3,  # Emma Wilson - Podcast
                "utm_source": "fluencr",
                "utm_medium": "podcast",
                "utm_campaign": "q4-saas-outreach",
                "utm_url": "https://fluencr.com?utm_source=fluencr&utm_medium=podcast&utm_campaign=q4-saas-outreach",
                "status": "active",
                "notes": "Featured on SaaS Stories podcast episode #201",
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "campaign_id": fluencr_campaign_1, 
                "influencer_id": fluencr_inf_1,  # Sarah Chen - LinkedIn
                "utm_source": "fluencr",
                "utm_medium": "linkedin",
                "utm_campaign": "q4-saas-outreach",
                "utm_url": "https://fluencr.com?utm_source=fluencr&utm_medium=linkedin&utm_campaign=q4-saas-outreach",
                "status": "active",
                "notes": "LinkedIn post series about B2B influencer marketing",
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "campaign_id": fluencr_campaign_2,
                "influencer_id": fluencr_inf_2,  # Mike Rodriguez - Newsletter
                "utm_source": "fluencr",
                "utm_medium": "newsletter",
                "utm_campaign": "linkedin-creator-partnership",
                "utm_url": "https://fluencr.com?utm_source=fluencr&utm_medium=newsletter&utm_campaign=linkedin-creator-partnership",
                "status": "planned",
                "notes": "Planned newsletter sponsorship for Q1 2025",
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
        ]
        
        # Insert campaign assignments
        result = supabase.table("campaign_influencers").upsert(campaign_assignments).execute()
        print(f"✅ Created {len(campaign_assignments)} campaign-influencer assignments")
        
        # 5. Create some campaign outcomes
        campaign_outcomes = [
            {
                "id": str(uuid.uuid4()),
                "campaign_id": fluencr_campaign_1,
                "influencer_id": fluencr_inf_3,
                "metric_type": "leads",
                "metric_value": 0.00,
                "metric_count": 24,
                "attribution_date": (datetime.utcnow() - timedelta(days=15)).isoformat(),
                "notes": "Leads generated from podcast episode",
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "campaign_id": fluencr_campaign_1,
                "influencer_id": fluencr_inf_1, 
                "metric_type": "revenue",
                "metric_value": 48600.00,
                "metric_count": 0,
                "attribution_date": (datetime.utcnow() - timedelta(days=10)).isoformat(),
                "notes": "Revenue attributed to LinkedIn campaign",
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "campaign_id": fluencr_campaign_3,
                "influencer_id": fluencr_inf_2,
                "metric_type": "demos",
                "metric_value": 0.00,
                "metric_count": 12,
                "attribution_date": (datetime.utcnow() - timedelta(days=20)).isoformat(),
                "notes": "Demo requests from newsletter sponsorship",
                "created_at": datetime.utcnow().isoformat()
            }
        ]
        
        # Insert campaign outcomes
        result = supabase.table("campaign_outcomes").upsert(campaign_outcomes).execute()
        print(f"✅ Created {len(campaign_outcomes)} campaign outcomes")
        
        print("🎉 Fluencr data seeding completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error seeding Fluencr data: {str(e)}")
        return False

if __name__ == "__main__":
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    success = seed_fluencr_data()
    sys.exit(0 if success else 1)
