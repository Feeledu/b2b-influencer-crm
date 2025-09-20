"""
Configuration for AI Data Collection
"""
import os
from typing import List, Dict, Any

# Search terms for different platforms
SEARCH_TERMS = {
    'linkedin': [
        'saas', 'b2b', 'marketing', 'growth', 'startup', 'product', 'sales',
        'demand gen', 'revenue', 'enterprise', 'tech', 'founder', 'ceo'
    ],
    'newsletter': [
        'saas newsletter', 'b2b marketing', 'growth hacking', 'startup news',
        'product management', 'sales insights', 'tech newsletter'
    ],
    'podcast': [
        'saas podcast', 'b2b marketing', 'startup podcast', 'growth podcast',
        'product podcast', 'sales podcast', 'tech podcast'
    ]
}

# Platform-specific collection limits
COLLECTION_LIMITS = {
    'linkedin': 100,
    'newsletter': 50,
    'podcast': 30
}

# AI Analysis Configuration
AI_CONFIG = {
    'confidence_threshold': 0.7,  # Minimum confidence for AI analysis
    'max_retries': 3,
    'timeout_seconds': 30,
    'batch_size': 10  # Process influencers in batches
}

# Industry keywords for AI categorization
INDUSTRY_KEYWORDS = {
    'SaaS': [
        'saas', 'software', 'tech', 'startup', 'b2b', 'enterprise',
        'cloud', 'platform', 'api', 'integration'
    ],
    'Marketing': [
        'marketing', 'growth', 'demand gen', 'brand', 'content',
        'digital marketing', 'inbound', 'outbound', 'lead gen'
    ],
    'Sales': [
        'sales', 'revenue', 'b2b sales', 'account executive', 'sales development',
        'business development', 'partnerships', 'revenue operations'
    ],
    'Product': [
        'product', 'pm', 'product manager', 'ux', 'design', 'user experience',
        'product strategy', 'roadmap', 'feature'
    ],
    'Technology': [
        'tech', 'engineering', 'developer', 'cto', 'engineering', 'software',
        'programming', 'coding', 'architecture', 'devops'
    ],
    'Consulting': [
        'consulting', 'advisor', 'strategist', 'expert', 'consultant',
        'fractional', 'interim', 'coach'
    ]
}

# Expertise tags for AI extraction
EXPERTISE_TAGS = [
    'Growth Marketing', 'B2B Strategy', 'Product Management', 'Sales',
    'SaaS', 'Marketing', 'Entrepreneurship', 'Startup', 'Technology',
    'Content Marketing', 'Demand Generation', 'Revenue Operations',
    'User Experience', 'Data Analytics', 'Customer Success'
]

# Audience demographics templates
AUDIENCE_TEMPLATES = {
    'SaaS': {
        'age_range': '25-45',
        'job_titles': ['VP Marketing', 'CMO', 'Marketing Manager', 'Founder', 'CEO'],
        'company_size': '10-500 employees',
        'seniority_level': 'Mid to Senior',
        'buyer_alignment_score': 85
    },
    'Marketing': {
        'age_range': '25-40',
        'job_titles': ['Marketing Manager', 'Marketing Director', 'Growth Manager', 'CMO'],
        'company_size': '10-200 employees',
        'seniority_level': 'Mid to Senior',
        'buyer_alignment_score': 80
    },
    'Technology': {
        'age_range': '25-50',
        'job_titles': ['CTO', 'VP Engineering', 'Developer', 'Product Manager'],
        'company_size': '50-1000+ employees',
        'seniority_level': 'Mid to Senior',
        'buyer_alignment_score': 75
    }
}

# API Keys and External Services
API_KEYS = {
    'openai_api_key': os.getenv('OPENAI_API_KEY'),
    'linkedin_api_key': os.getenv('LINKEDIN_API_KEY'),
    'substack_api_key': os.getenv('SUBSTACK_API_KEY'),
    'scout_api_key': os.getenv('SCOUT_API_KEY')
}

# Rate limiting configuration
RATE_LIMITS = {
    'linkedin_requests_per_minute': 10,
    'newsletter_requests_per_minute': 20,
    'podcast_requests_per_minute': 15,
    'ai_analysis_requests_per_minute': 30
}

# Data quality thresholds
QUALITY_THRESHOLDS = {
    'min_audience_size': 1000,
    'min_engagement_rate': 1.0,
    'min_bio_length': 50,
    'required_fields': ['name', 'platform', 'bio']
}
