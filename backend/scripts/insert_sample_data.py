#!/usr/bin/env python3
"""
Insert sample influencer data into Supabase database
"""
import os
import sys
import uuid
from datetime import datetime
from pathlib import Path

# Add the parent directory to the path
sys.path.append(str(Path(__file__).parent.parent))

from app.database.supabase_client import SupabaseClient

def insert_sample_data():
    """Insert sample influencer data into the database"""
    
    # Sample influencer data
    sample_influencers = [
        {
            "id": str(uuid.uuid4()),
            "name": "Sarah Chen",
            "platform": "linkedin",
            "handle": "@sarahchen",
            "bio": "VP of Marketing at TechScale | B2B Growth Expert | Helping SaaS companies scale through strategic marketing",
            "avatar_url": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            "website_url": "https://sarahchen.com",
            "email": "sarah@techscale.com",
            "linkedin_url": "https://linkedin.com/in/sarahchen",
            "twitter_url": "https://twitter.com/sarahchen",
            "industry": "SaaS",
            "audience_size": 25400,
            "engagement_rate": 4.2,
            "location": "San Francisco, CA",
            "expertise_tags": ["Growth Marketing", "B2B Strategy", "Product Marketing", "SaaS"],
            "audience_demographics": {
                "age_range": "25-45",
                "job_titles": ["VP Marketing", "CMO", "Marketing Manager", "Founder"],
                "company_size": "50-500 employees",
                "seniority_level": "Mid to Senior",
                "buyer_alignment_score": 95
            },
            "contact_info": {
                "preferred_contact": "email",
                "response_time": "24-48 hours"
            },
            "is_verified": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "The SaaS Show",
            "platform": "podcast",
            "handle": "@thesaasshow",
            "bio": "Weekly B2B Software Podcast | Interviews with SaaS founders and growth experts",
            "avatar_url": "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=150&h=150&fit=crop",
            "website_url": "https://thesaasshow.com",
            "email": "hello@thesaasshow.com",
            "linkedin_url": "https://linkedin.com/company/thesaasshow",
            "twitter_url": "https://twitter.com/thesaasshow",
            "industry": "SaaS",
            "audience_size": 15000,
            "engagement_rate": 8.1,
            "location": "Remote",
            "expertise_tags": ["SaaS", "Entrepreneurship", "Product Development", "Startups"],
            "audience_demographics": {
                "age_range": "28-50",
                "job_titles": ["Founder", "CEO", "Product Manager", "Developer"],
                "company_size": "1-50 employees",
                "seniority_level": "Mid to Senior",
                "buyer_alignment_score": 88
            },
            "contact_info": {
                "preferred_contact": "email",
                "response_time": "1-2 weeks"
            },
            "is_verified": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Marketing Mix Weekly",
            "platform": "newsletter",
            "handle": "@marketingmix",
            "bio": "B2B Marketing Newsletter | Weekly insights on growth, automation, and lead generation",
            "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            "website_url": "https://marketingmixweekly.com",
            "email": "team@marketingmixweekly.com",
            "linkedin_url": "https://linkedin.com/company/marketingmixweekly",
            "twitter_url": "https://twitter.com/marketingmix",
            "industry": "Marketing",
            "audience_size": 12800,
            "engagement_rate": 15.3,
            "location": "New York, NY",
            "expertise_tags": ["B2B Marketing", "Lead Generation", "Marketing Automation", "Email Marketing"],
            "audience_demographics": {
                "age_range": "25-40",
                "job_titles": ["Marketing Manager", "Marketing Director", "Growth Manager", "CMO"],
                "company_size": "10-200 employees",
                "seniority_level": "Mid to Senior",
                "buyer_alignment_score": 82
            },
            "contact_info": {
                "preferred_contact": "email",
                "response_time": "2-3 days"
            },
            "is_verified": False,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
    ]
    
    try:
        # Initialize Supabase client
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        
        print("🔄 Inserting sample influencer data...")
        
        # Insert each influencer
        for influencer in sample_influencers:
            result = supabase.table("influencers").insert(influencer).execute()
            if result.data:
                print(f"✅ Inserted: {influencer['name']} ({influencer['platform']})")
            else:
                print(f"❌ Failed to insert: {influencer['name']}")
                print(f"Error: {result}")
        
        print(f"\n🎉 Successfully inserted {len(sample_influencers)} influencers!")
        print("You can now test the application with real data.")
        
        return True
        
    except Exception as e:
        print(f"❌ Error inserting data: {str(e)}")
        return False

if __name__ == "__main__":
    insert_sample_data()
