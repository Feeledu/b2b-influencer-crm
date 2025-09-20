#!/usr/bin/env python3
"""
Mock Data Generation Script for B2B Influencer CRM
Generates realistic test data for development and testing
"""

import json
import random
from datetime import datetime, timedelta
from faker import Faker
import uuid

# Initialize Faker
fake = Faker()

# Industry categories for B2B influencers
INDUSTRIES = [
    'SaaS', 'Fintech', 'Healthcare', 'EdTech', 'MarTech', 'SalesTech',
    'HRTech', 'DevTools', 'Cybersecurity', 'AI/ML', 'E-commerce',
    'Real Estate', 'Legal Tech', 'PropTech', 'InsurTech'
]

# Platform types
PLATFORMS = ['linkedin', 'podcast', 'newsletter']

# Expertise tags
EXPERTISE_TAGS = [
    'B2B Marketing', 'Sales', 'Product Management', 'Growth Hacking',
    'Content Marketing', 'SEO', 'Paid Advertising', 'Email Marketing',
    'Social Media', 'Brand Strategy', 'Customer Success', 'Operations',
    'Data Analytics', 'AI/ML', 'Cybersecurity', 'SaaS Metrics',
    'Revenue Operations', 'Demand Generation', 'Account-Based Marketing',
    'Marketing Automation', 'CRM', 'Sales Enablement', 'Leadership'
]

# Job titles for audience demographics
JOB_TITLES = [
    'CEO', 'CTO', 'CMO', 'VP Marketing', 'Director of Marketing',
    'Marketing Manager', 'Growth Manager', 'Product Manager',
    'Sales Director', 'Sales Manager', 'Head of Sales',
    'Founder', 'Co-Founder', 'VP Sales', 'Revenue Operations Manager'
]

def generate_influencers(count=300):
    """Generate realistic influencer data"""
    influencers = []
    
    for _ in range(count):
        platform = random.choice(PLATFORMS)
        industry = random.choice(INDUSTRIES)
        
        # Generate platform-specific data
        if platform == 'linkedin':
            handle = f"@{fake.user_name()}"
            audience_size = random.randint(5000, 500000)
            engagement_rate = round(random.uniform(2.0, 8.0), 2)
        elif platform == 'podcast':
            handle = f"{fake.catch_phrase()} Podcast"
            audience_size = random.randint(1000, 100000)
            engagement_rate = round(random.uniform(5.0, 15.0), 2)
        else:  # newsletter
            handle = f"{fake.catch_phrase()} Newsletter"
            audience_size = random.randint(2000, 200000)
            engagement_rate = round(random.uniform(8.0, 25.0), 2)
        
        # Generate expertise tags (2-5 random tags)
        num_tags = random.randint(2, 5)
        expertise_tags = random.sample(EXPERTISE_TAGS, num_tags)
        
        # Generate audience demographics
        audience_demographics = {
            "age_groups": {
                "25-34": random.randint(20, 40),
                "35-44": random.randint(30, 50),
                "45-54": random.randint(15, 35),
                "55+": random.randint(5, 20)
            },
            "locations": {
                "North America": random.randint(40, 80),
                "Europe": random.randint(10, 30),
                "Asia": random.randint(5, 25),
                "Other": random.randint(5, 15)
            },
            "job_titles": {
                title: random.randint(5, 25) for title in random.sample(JOB_TITLES, 6)
            }
        }
        
        # Generate contact info
        contact_info = {
            "email": fake.email() if random.random() > 0.3 else None,
            "phone": fake.phone_number() if random.random() > 0.7 else None,
            "website": fake.url() if random.random() > 0.4 else None,
            "calendly": f"https://calendly.com/{fake.user_name()}" if random.random() > 0.6 else None
        }
        
        influencer = {
            "id": str(uuid.uuid4()),
            "name": fake.name(),
            "platform": platform,
            "handle": handle,
            "bio": fake.text(max_nb_chars=200),
            "avatar_url": f"https://picsum.photos/200/200?random={random.randint(1, 1000)}",
            "website_url": fake.url() if random.random() > 0.5 else None,
            "email": contact_info["email"],
            "linkedin_url": f"https://linkedin.com/in/{fake.user_name()}" if platform == 'linkedin' else None,
            "twitter_url": f"https://twitter.com/{fake.user_name()}" if random.random() > 0.6 else None,
            "industry": industry,
            "audience_size": audience_size,
            "engagement_rate": engagement_rate,
            "location": fake.city() + ", " + fake.country(),
            "expertise_tags": expertise_tags,
            "audience_demographics": audience_demographics,
            "contact_info": contact_info,
            "is_verified": random.random() > 0.7,
            "created_at": fake.date_time_between(start_date='-2y', end_date='now').isoformat(),
            "updated_at": fake.date_time_between(start_date='-1y', end_date='now').isoformat()
        }
        
        influencers.append(influencer)
    
    return influencers

def generate_users(count=15):
    """Generate test user data"""
    users = []
    
    for _ in range(count):
        user = {
            "id": str(uuid.uuid4()),
            "email": fake.email(),
            "name": fake.name(),
            "avatar_url": f"https://picsum.photos/100/100?random={random.randint(1, 1000)}",
            "role": random.choice(['user', 'admin']),
            "subscription_status": random.choice(['trial', 'active', 'cancelled']),
            "created_at": fake.date_time_between(start_date='-1y', end_date='now').isoformat(),
            "updated_at": fake.date_time_between(start_date='-6m', end_date='now').isoformat()
        }
        users.append(user)
    
    return users

def generate_user_influencers(users, influencers, count_per_user=20):
    """Generate user-influencer relationships"""
    user_influencers = []
    
    for user in users:
        # Each user saves 10-30 random influencers
        num_saved = random.randint(10, 30)
        saved_influencers = random.sample(influencers, num_saved)
        
        for influencer in saved_influencers:
            status = random.choice(['saved', 'contacted', 'warm', 'cold', 'partnered'])
            priority = random.randint(0, 5)
            
            # Generate tags
            num_tags = random.randint(0, 3)
            tags = random.sample(['high-priority', 'follow-up', 'negotiating', 'content-creator'], num_tags)
            
            user_influencer = {
                "id": str(uuid.uuid4()),
                "user_id": user["id"],
                "influencer_id": influencer["id"],
                "status": status,
                "notes": fake.text(max_nb_chars=100) if random.random() > 0.6 else None,
                "priority": priority,
                "tags": tags,
                "last_contacted_at": fake.date_time_between(start_date='-6m', end_date='now').isoformat() if status != 'saved' else None,
                "created_at": fake.date_time_between(start_date='-6m', end_date='now').isoformat(),
                "updated_at": fake.date_time_between(start_date='-3m', end_date='now').isoformat()
            }
            user_influencers.append(user_influencer)
    
    return user_influencers

def generate_campaigns(users, count_per_user=5):
    """Generate campaign data"""
    campaigns = []
    
    for user in users:
        num_campaigns = random.randint(3, 8)
        
        for _ in range(num_campaigns):
            start_date = fake.date_between(start_date='-6m', end_date='+3m')
            end_date = start_date + timedelta(days=random.randint(30, 180))
            
            campaign = {
                "id": str(uuid.uuid4()),
                "user_id": user["id"],
                "name": fake.catch_phrase() + " Campaign",
                "description": fake.text(max_nb_chars=300),
                "status": random.choice(['planning', 'active', 'completed', 'cancelled']),
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "budget": round(random.uniform(5000, 50000), 2),
                "spent": round(random.uniform(1000, 25000), 2),
                "created_at": fake.date_time_between(start_date='-6m', end_date='now').isoformat(),
                "updated_at": fake.date_time_between(start_date='-3m', end_date='now').isoformat()
            }
            campaigns.append(campaign)
    
    return campaigns

def generate_campaign_influencers(campaigns, user_influencers):
    """Generate campaign-influencer relationships"""
    campaign_influencers = []
    
    for campaign in campaigns:
        # Each campaign has 2-8 influencers
        num_influencers = random.randint(2, 8)
        
        # Get user's saved influencers
        user_saved_influencers = [ui for ui in user_influencers if ui["user_id"] == campaign["user_id"]]
        
        if user_saved_influencers:
            selected_influencers = random.sample(user_saved_influencers, min(num_influencers, len(user_saved_influencers)))
            
            for ui in selected_influencers:
                utm_campaign = campaign["name"].lower().replace(" ", "-")
                
                campaign_influencer = {
                    "id": str(uuid.uuid4()),
                    "campaign_id": campaign["id"],
                    "influencer_id": ui["influencer_id"],
                    "utm_source": random.choice(['linkedin', 'podcast', 'newsletter']),
                    "utm_medium": random.choice(['social', 'email', 'content']),
                    "utm_campaign": utm_campaign,
                    "utm_content": random.choice(['post', 'article', 'episode', 'sponsorship']),
                    "utm_term": random.choice(['b2b', 'saas', 'marketing', 'growth']),
                    "utm_url": f"https://example.com/track?utm_source={utm_campaign}&utm_medium=social",
                    "status": random.choice(['planned', 'active', 'completed', 'cancelled']),
                    "notes": fake.text(max_nb_chars=150) if random.random() > 0.7 else None,
                    "created_at": fake.date_time_between(start_date='-6m', end_date='now').isoformat(),
                    "updated_at": fake.date_time_between(start_date='-3m', end_date='now').isoformat()
                }
                campaign_influencers.append(campaign_influencer)
    
    return campaign_influencers

def generate_interactions(users, user_influencers, campaigns):
    """Generate interaction data"""
    interactions = []
    
    for ui in user_influencers:
        if ui["status"] != 'saved':
            # Generate 1-5 interactions per influencer
            num_interactions = random.randint(1, 5)
            
            for _ in range(num_interactions):
                interaction_type = random.choice(['email', 'call', 'meeting', 'note', 'file_upload'])
                
                # Find a campaign for this user-influencer relationship
                user_campaigns = [c for c in campaigns if c["user_id"] == ui["user_id"]]
                campaign_id = random.choice(user_campaigns)["id"] if user_campaigns else None
                
                interaction = {
                    "id": str(uuid.uuid4()),
                    "user_id": ui["user_id"],
                    "influencer_id": ui["influencer_id"],
                    "campaign_id": campaign_id,
                    "type": interaction_type,
                    "subject": fake.sentence(nb_words=6) if interaction_type in ['email', 'meeting'] else None,
                    "content": fake.text(max_nb_chars=200),
                    "file_url": f"https://example.com/files/{fake.file_name()}" if interaction_type == 'file_upload' else None,
                    "interaction_date": fake.date_time_between(start_date='-6m', end_date='now').isoformat(),
                    "created_at": fake.date_time_between(start_date='-6m', end_date='now').isoformat()
                }
                interactions.append(interaction)
    
    return interactions

def generate_pipeline_attribution(campaigns, campaign_influencers):
    """Generate pipeline attribution data"""
    pipeline_attribution = []
    
    for ci in campaign_influencers:
        if ci["status"] in ['active', 'completed'] and random.random() > 0.6:
            # Generate 1-3 opportunities per campaign-influencer
            num_opportunities = random.randint(1, 3)
            
            for _ in range(num_opportunities):
                stage = random.choice(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'])
                value = round(random.uniform(5000, 100000), 2)
                probability = random.randint(20, 95) if stage != 'closed_won' and stage != 'closed_lost' else (100 if stage == 'closed_won' else 0)
                
                opportunity = {
                    "id": str(uuid.uuid4()),
                    "user_id": next(c["user_id"] for c in campaigns if c["id"] == ci["campaign_id"]),
                    "campaign_id": ci["campaign_id"],
                    "influencer_id": ci["influencer_id"],
                    "opportunity_id": f"OPP-{random.randint(10000, 99999)}",
                    "opportunity_name": fake.catch_phrase() + " Opportunity",
                    "stage": stage,
                    "value": value,
                    "probability": probability,
                    "close_date": fake.date_between(start_date='-3m', end_date='+6m').isoformat() if stage in ['proposal', 'negotiation', 'closed_won', 'closed_lost'] else None,
                    "attribution_type": random.choice(['direct', 'assisted', 'influenced']),
                    "attribution_strength": round(random.uniform(30, 90), 2),
                    "notes": fake.text(max_nb_chars=150) if random.random() > 0.7 else None,
                    "created_at": fake.date_time_between(start_date='-6m', end_date='now').isoformat(),
                    "updated_at": fake.date_time_between(start_date='-3m', end_date='now').isoformat()
                }
                pipeline_attribution.append(opportunity)
    
    return pipeline_attribution

def generate_campaign_outcomes(campaigns, campaign_influencers):
    """Generate campaign outcome data"""
    campaign_outcomes = []
    
    for ci in campaign_influencers:
        if ci["status"] in ['active', 'completed']:
            # Generate 2-5 outcome metrics per campaign-influencer
            num_outcomes = random.randint(2, 5)
            metric_types = random.sample(['leads', 'demos', 'signups', 'revenue', 'pipeline'], num_outcomes)
            
            for metric_type in metric_types:
                if metric_type == 'revenue':
                    metric_value = round(random.uniform(1000, 50000), 2)
                    metric_count = None
                else:
                    metric_value = None
                    metric_count = random.randint(1, 50)
                
                outcome = {
                    "id": str(uuid.uuid4()),
                    "campaign_id": ci["campaign_id"],
                    "influencer_id": ci["influencer_id"],
                    "metric_type": metric_type,
                    "metric_value": metric_value,
                    "metric_count": metric_count,
                    "attribution_date": fake.date_between(start_date='-6m', end_date='now').isoformat(),
                    "notes": fake.text(max_nb_chars=100) if random.random() > 0.8 else None,
                    "created_at": fake.date_time_between(start_date='-6m', end_date='now').isoformat()
                }
                campaign_outcomes.append(outcome)
    
    return campaign_outcomes

def main():
    """Generate all mock data"""
    print("Generating mock data for B2B Influencer CRM...")
    
    # Generate base data
    print("Generating influencers...")
    influencers = generate_influencers(300)
    
    print("Generating users...")
    users = generate_users(15)
    
    print("Generating user-influencer relationships...")
    user_influencers = generate_user_influencers(users, influencers)
    
    print("Generating campaigns...")
    campaigns = generate_campaigns(users)
    
    print("Generating campaign-influencer relationships...")
    campaign_influencers = generate_campaign_influencers(campaigns, user_influencers)
    
    print("Generating interactions...")
    interactions = generate_interactions(users, user_influencers, campaigns)
    
    print("Generating pipeline attribution...")
    pipeline_attribution = generate_pipeline_attribution(campaigns, campaign_influencers)
    
    print("Generating campaign outcomes...")
    campaign_outcomes = generate_campaign_outcomes(campaigns, campaign_influencers)
    
    # Combine all data
    mock_data = {
        "influencers": influencers,
        "users": users,
        "user_influencers": user_influencers,
        "campaigns": campaigns,
        "campaign_influencers": campaign_influencers,
        "interactions": interactions,
        "pipeline_attribution": pipeline_attribution,
        "campaign_outcomes": campaign_outcomes
    }
    
    # Save to JSON file
    with open('mock_data.json', 'w') as f:
        json.dump(mock_data, f, indent=2)
    
    # Print summary
    print(f"\nMock data generation complete!")
    print(f"Influencers: {len(influencers)}")
    print(f"Users: {len(users)}")
    print(f"User-Influencer relationships: {len(user_influencers)}")
    print(f"Campaigns: {len(campaigns)}")
    print(f"Campaign-Influencer relationships: {len(campaign_influencers)}")
    print(f"Interactions: {len(interactions)}")
    print(f"Pipeline attribution records: {len(pipeline_attribution)}")
    print(f"Campaign outcomes: {len(campaign_outcomes)}")
    print(f"Data saved to: mock_data.json")

if __name__ == "__main__":
    main()
