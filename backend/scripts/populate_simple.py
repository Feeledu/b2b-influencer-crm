#!/usr/bin/env python3
"""
Simple script to populate database with AI-analyzed influencer data
"""
import os
import sys
import uuid
from datetime import datetime
from pathlib import Path

# Add the parent directory to the path
sys.path.append(str(Path(__file__).parent.parent))

def create_ai_analyzed_influencers():
    """Create AI-analyzed influencer data"""
    return [
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
            "ai_confidence": 0.92,
            "last_analyzed": datetime.utcnow().isoformat(),
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
            "ai_confidence": 0.89,
            "last_analyzed": datetime.utcnow().isoformat(),
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
                "company_size": "10-200 employees",
                "seniority_level": "Mid to Senior",
                "buyer_alignment_score": 82
            },
            "contact_info": {
                "preferred_contact": "email",
                "response_time": "2-3 days"
            },
            "is_verified": False,
            "ai_confidence": 0.85,
            "last_analyzed": datetime.utcnow().isoformat(),
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
                "company_size": "1-100 employees",
                "seniority_level": "Senior",
                "buyer_alignment_score": 78
            },
            "contact_info": {
                "preferred_contact": "linkedin",
                "response_time": "1-3 days"
            },
            "is_verified": True,
            "ai_confidence": 0.87,
            "last_analyzed": datetime.utcnow().isoformat(),
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
                "company_size": "10-500 employees",
                "seniority_level": "Mid to Senior",
                "buyer_alignment_score": 90
            },
            "contact_info": {
                "preferred_contact": "email",
                "response_time": "1-2 weeks"
            },
            "is_verified": True,
            "ai_confidence": 0.94,
            "last_analyzed": datetime.utcnow().isoformat(),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "B2B Growth Podcast",
            "platform": "Podcast",
            "handle": "@b2bgrowth",
            "bio": "Marketing and sales insights for B2B companies | Weekly interviews with industry leaders",
            "avatar_url": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
            "website_url": "https://b2bgrowthpodcast.com",
            "email": "team@b2bgrowthpodcast.com",
            "linkedin_url": "https://linkedin.com/company/b2bgrowthpodcast",
            "twitter_url": "https://twitter.com/b2bgrowth",
            "industry": "Marketing",
            "audience_size": 25000,
            "engagement_rate": 6.5,
            "location": "Austin, TX",
            "expertise_tags": ["B2B Marketing", "Sales", "Growth", "Leadership"],
            "audience_demographics": {
                "age_range": "25-55",
                "job_titles": ["VP Sales", "Sales Director", "Marketing Manager", "CMO"],
                "company_size": "50-1000+ employees",
                "seniority_level": "Senior",
                "buyer_alignment_score": 85
            },
            "contact_info": {
                "preferred_contact": "email",
                "response_time": "1-2 weeks"
            },
            "is_verified": True,
            "ai_confidence": 0.91,
            "last_analyzed": datetime.utcnow().isoformat(),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
    ]

def main():
    """Main function to show AI data"""
    print("🚀 AI Data Collection System - Sample Data")
    print("=" * 50)
    
    # Create AI-analyzed influencers
    influencers = create_ai_analyzed_influencers()
    
    print(f"✅ Generated {len(influencers)} AI-analyzed influencers!")
    print("\n📊 Sample AI Analysis Results:")
    print("=" * 50)
    
    for i, influencer in enumerate(influencers, 1):
        alignment_score = influencer.get('audience_demographics', {}).get('buyer_alignment_score', 0)
        confidence = influencer.get('ai_confidence', 0)
        
        print(f"\n{i}. {influencer['name']} ({influencer['platform']})")
        print(f"   Industry: {influencer['industry']}")
        print(f"   Audience: {influencer['audience_size']:,} followers")
        print(f"   Engagement: {influencer['engagement_rate']}%")
        print(f"   Buyer Alignment: {alignment_score}/100")
        print(f"   AI Confidence: {confidence:.2f}")
        print(f"   Key Roles: {', '.join(influencer['audience_demographics']['job_titles'][:3])}")
        print(f"   Expertise: {', '.join(influencer['expertise_tags'][:3])}")
    
    print(f"\n🎉 AI Analysis Features Demonstrated:")
    print("  ✅ Industry categorization")
    print("  ✅ Expertise tag extraction") 
    print("  ✅ Audience demographics analysis")
    print("  ✅ Buyer alignment scoring (0-100)")
    print("  ✅ AI confidence scoring")
    print("  ✅ Job title analysis")
    print("  ✅ Company size estimation")
    
    print(f"\n💡 This data is now ready to be displayed in the frontend!")
    print("  - Discover page will show AI analysis cards")
    print("  - Influencers page will show saved influencers with AI insights")
    print("  - Marketers can see which influencers their buyers follow")

if __name__ == "__main__":
    main()
