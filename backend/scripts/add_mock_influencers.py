#!/usr/bin/env python3
"""
Script to add mock influencer data to the database for testing.
"""
import os
import sys
import json
import uuid
from datetime import datetime
from pathlib import Path

# Add the parent directory to the path so we can import from app
sys.path.append(str(Path(__file__).parent.parent))

from app.database.supabase_client import get_supabase_client

def create_mock_influencers():
    """Create mock influencer data"""
    influencers = [
        {
            "id": str(uuid.uuid4()),
            "name": "Sarah Chen",
            "platform": "LinkedIn",
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
                "job_titles": ["Marketing Manager", "VP Marketing", "CMO", "Founder"],
                "company_size": "50-500 employees"
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
            "platform": "Podcast",
            "handle": "@thesaasshow",
            "bio": "Weekly B2B Software Podcast | Interviews with SaaS founders and growth experts",
            "avatar_url": "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=150&h=150&fit=crop",
            "website_url": "https://thesaasshow.com",
            "email": "hello@thesaasshow.com",
            "linkedin_url": "https://linkedin.com/company/thesaasshow",
            "twitter_url": "https://twitter.com/thesaasshow",
            "industry": "Technology",
            "audience_size": 15000,
            "engagement_rate": 8.1,
            "location": "Remote",
            "expertise_tags": ["SaaS", "Entrepreneurship", "Product Development", "Startups"],
            "audience_demographics": {
                "age_range": "28-50",
                "job_titles": ["Founder", "CEO", "Product Manager", "Developer"],
                "company_size": "1-50 employees"
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
            "platform": "Newsletter",
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
                "company_size": "10-200 employees"
            },
            "contact_info": {
                "preferred_contact": "email",
                "response_time": "2-3 days"
            },
            "is_verified": False,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Alex Rodriguez",
            "platform": "LinkedIn",
            "handle": "@alexrodriguez",
            "bio": "Founder & Growth Strategist | Helping B2B companies scale through data-driven growth strategies",
            "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            "website_url": "https://alexrodriguez.com",
            "email": "alex@alexrodriguez.com",
            "linkedin_url": "https://linkedin.com/in/alexrodriguez",
            "twitter_url": "https://twitter.com/alexrodriguez",
            "industry": "Consulting",
            "audience_size": 18200,
            "engagement_rate": 6.7,
            "location": "Austin, TX",
            "expertise_tags": ["Growth Hacking", "Startup Strategy", "B2B Sales", "Data Analytics"],
            "audience_demographics": {
                "age_range": "30-50",
                "job_titles": ["Founder", "CEO", "VP Sales", "Growth Manager"],
                "company_size": "1-100 employees"
            },
            "contact_info": {
                "preferred_contact": "linkedin",
                "response_time": "1-3 days"
            },
            "is_verified": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "TechCrunch",
            "platform": "Newsletter",
            "handle": "@techcrunch",
            "bio": "Breaking technology news and startup coverage | Daily newsletter with industry insights",
            "avatar_url": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
            "website_url": "https://techcrunch.com",
            "email": "news@techcrunch.com",
            "linkedin_url": "https://linkedin.com/company/techcrunch",
            "twitter_url": "https://twitter.com/techcrunch",
            "industry": "Technology",
            "audience_size": 500000,
            "engagement_rate": 2.1,
            "location": "San Francisco, CA",
            "expertise_tags": ["Technology News", "Startups", "Venture Capital", "Innovation"],
            "audience_demographics": {
                "age_range": "25-55",
                "job_titles": ["Founder", "CEO", "Investor", "Developer", "Product Manager"],
                "company_size": "1-1000+ employees"
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
            "name": "Lenny's Newsletter",
            "platform": "Newsletter",
            "handle": "@lennysnewsletter",
            "bio": "Product management insights and growth strategies | Weekly deep-dives into product and growth",
            "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            "website_url": "https://lennysnewsletter.com",
            "email": "lenny@lennysnewsletter.com",
            "linkedin_url": "https://linkedin.com/in/lenny",
            "twitter_url": "https://twitter.com/lennysan",
            "industry": "Product Management",
            "audience_size": 450000,
            "engagement_rate": 12.5,
            "location": "San Francisco, CA",
            "expertise_tags": ["Product Management", "Growth", "Startups", "User Research"],
            "audience_demographics": {
                "age_range": "25-45",
                "job_titles": ["Product Manager", "Product Director", "Founder", "CEO"],
                "company_size": "10-500 employees"
            },
            "contact_info": {
                "preferred_contact": "email",
                "response_time": "1-2 weeks"
            },
            "is_verified": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
    ]
    
    return influencers

def main():
    """Main function to add mock influencers to the database"""
    try:
        print("Adding mock influencers to the database...")
        
        # Get Supabase client
        supabase = get_supabase_client()
        
        # Create mock data
        influencers = create_mock_influencers()
        
        # Insert influencers into database
        result = supabase.table("influencers").insert(influencers).execute()
        
        if result.data:
            print(f"✅ Successfully added {len(result.data)} mock influencers to the database!")
            print("\nAdded influencers:")
            for influencer in result.data:
                print(f"  - {influencer['name']} ({influencer['platform']}) - {influencer['audience_size']:,} followers")
        else:
            print("❌ Failed to add mock influencers to the database")
            print(f"Error: {result}")
            
    except Exception as e:
        print(f"❌ Error adding mock influencers: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
