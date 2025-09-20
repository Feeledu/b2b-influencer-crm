#!/usr/bin/env python3
"""
AI-Powered Influencer Data Collection Script
Collects and analyzes B2B influencers from LinkedIn, newsletters, and podcasts using AI.
"""
import os
import sys
import json
import uuid
import asyncio
import aiohttp
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional
import logging

# Add the parent directory to the path so we can import from app
sys.path.append(str(Path(__file__).parent.parent))

from app.database.supabase_client import SupabaseClient

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIDataCollector:
    """AI-powered influencer data collection and analysis"""
    
    def __init__(self):
        self.supabase_client = SupabaseClient()
        self.supabase = self.supabase_client.get_client()
        self.session = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def analyze_influencer_with_ai(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Use AI to analyze influencer profile and extract insights
        This is a mock implementation - in production, you'd use OpenAI API or similar
        """
        # Mock AI analysis - replace with actual AI service
        bio = profile_data.get('bio', '')
        name = profile_data.get('name', '')
        
        # Simulate AI analysis
        industry_keywords = {
            'SaaS': ['saas', 'software', 'tech', 'startup', 'b2b', 'enterprise'],
            'Marketing': ['marketing', 'growth', 'demand gen', 'brand', 'content'],
            'Sales': ['sales', 'revenue', 'b2b sales', 'account executive'],
            'Product': ['product', 'pm', 'product manager', 'ux', 'design'],
            'Technology': ['tech', 'engineering', 'developer', 'cto', 'engineering']
        }
        
        # Determine industry based on bio analysis
        industry = 'Technology'  # default
        bio_lower = bio.lower()
        for ind, keywords in industry_keywords.items():
            if any(keyword in bio_lower for keyword in keywords):
                industry = ind
                break
        
        # Extract expertise tags
        expertise_tags = []
        if 'growth' in bio_lower:
            expertise_tags.append('Growth Marketing')
        if 'saas' in bio_lower:
            expertise_tags.append('SaaS')
        if 'b2b' in bio_lower:
            expertise_tags.append('B2B Strategy')
        if 'marketing' in bio_lower:
            expertise_tags.append('Marketing')
        if 'product' in bio_lower:
            expertise_tags.append('Product Management')
        if 'sales' in bio_lower:
            expertise_tags.append('Sales')
        if 'startup' in bio_lower:
            expertise_tags.append('Entrepreneurship')
        
        # Simulate audience demographics analysis
        audience_demographics = {
            'age_range': '25-45',
            'job_titles': ['Marketing Manager', 'VP Marketing', 'CMO', 'Founder'],
            'company_size': '50-500 employees',
            'seniority_level': 'Mid to Senior',
            'buyer_alignment_score': 75  # 0-100 score
        }
        
        # Calculate buyer alignment score based on industry and expertise
        buyer_alignment_score = 60  # base score
        if industry in ['SaaS', 'Marketing']:
            buyer_alignment_score += 20
        if 'b2b' in bio_lower:
            buyer_alignment_score += 15
        if any(tag in expertise_tags for tag in ['Growth Marketing', 'B2B Strategy']):
            buyer_alignment_score += 10
            
        audience_demographics['buyer_alignment_score'] = min(buyer_alignment_score, 100)
        
        return {
            'industry': industry,
            'expertise_tags': expertise_tags,
            'audience_demographics': audience_demographics,
            'ai_confidence': 0.85,  # AI confidence in analysis
            'last_analyzed': datetime.utcnow().isoformat()
        }
    
    async def collect_linkedin_influencers(self, search_terms: List[str], limit: int = 50) -> List[Dict[str, Any]]:
        """
        Collect LinkedIn influencers (mock implementation)
        In production, you'd use LinkedIn API or web scraping
        """
        logger.info(f"Collecting LinkedIn influencers for terms: {search_terms}")
        
        # Mock LinkedIn data - replace with actual LinkedIn API calls
        mock_linkedin_influencers = [
            {
                'name': 'Sarah Chen',
                'platform': 'LinkedIn',
                'handle': '@sarahchen',
                'bio': 'VP of Marketing at TechScale | B2B Growth Expert | Helping SaaS companies scale through strategic marketing',
                'linkedin_url': 'https://linkedin.com/in/sarahchen',
                'email': 'sarah@techscale.com',
                'website_url': 'https://sarahchen.com',
                'audience_size': 25400,
                'engagement_rate': 4.2,
                'location': 'San Francisco, CA',
                'is_verified': True
            },
            {
                'name': 'Alex Rodriguez',
                'platform': 'LinkedIn',
                'handle': '@alexrodriguez',
                'bio': 'Founder & Growth Strategist | Helping B2B companies scale through data-driven growth strategies',
                'linkedin_url': 'https://linkedin.com/in/alexrodriguez',
                'email': 'alex@alexrodriguez.com',
                'website_url': 'https://alexrodriguez.com',
                'audience_size': 18200,
                'engagement_rate': 6.7,
                'location': 'Austin, TX',
                'is_verified': True
            },
            {
                'name': 'Maria Garcia',
                'platform': 'LinkedIn',
                'handle': '@mariagarcia',
                'bio': 'Product Marketing Manager at Stripe | B2B SaaS | Content Creator | Helping startups grow',
                'linkedin_url': 'https://linkedin.com/in/mariagarcia',
                'email': 'maria@stripe.com',
                'website_url': 'https://mariagarcia.com',
                'audience_size': 15600,
                'engagement_rate': 5.8,
                'location': 'New York, NY',
                'is_verified': True
            }
        ]
        
        influencers = []
        for influencer in mock_linkedin_influencers[:limit]:
            # Analyze with AI
            ai_analysis = await self.analyze_influencer_with_ai(influencer)
            
            # Combine original data with AI analysis
            influencer.update(ai_analysis)
            influencer['id'] = str(uuid.uuid4())
            influencer['created_at'] = datetime.utcnow().isoformat()
            influencer['updated_at'] = datetime.utcnow().isoformat()
            
            influencers.append(influencer)
        
        logger.info(f"Collected {len(influencers)} LinkedIn influencers")
        return influencers
    
    async def collect_newsletter_influencers(self, search_terms: List[str], limit: int = 30) -> List[Dict[str, Any]]:
        """
        Collect newsletter influencers (mock implementation)
        In production, you'd use Substack API, Scout API, or web scraping
        """
        logger.info(f"Collecting newsletter influencers for terms: {search_terms}")
        
        # Mock newsletter data
        mock_newsletter_influencers = [
            {
                'name': 'Marketing Mix Weekly',
                'platform': 'Newsletter',
                'handle': '@marketingmix',
                'bio': 'B2B Marketing Newsletter | Weekly insights on growth, automation, and lead generation',
                'website_url': 'https://marketingmixweekly.com',
                'email': 'team@marketingmixweekly.com',
                'audience_size': 12800,
                'engagement_rate': 15.3,
                'location': 'New York, NY',
                'is_verified': False
            },
            {
                'name': "Lenny's Newsletter",
                'platform': 'Newsletter',
                'handle': '@lennysnewsletter',
                'bio': 'Product management insights and growth strategies | Weekly deep-dives into product and growth',
                'website_url': 'https://lennysnewsletter.com',
                'email': 'lenny@lennysnewsletter.com',
                'audience_size': 450000,
                'engagement_rate': 12.5,
                'location': 'San Francisco, CA',
                'is_verified': True
            },
            {
                'name': 'SaaS Growth Weekly',
                'platform': 'Newsletter',
                'handle': '@saasgrowth',
                'bio': 'Weekly insights on SaaS growth, metrics, and strategies | For founders and growth teams',
                'website_url': 'https://saasgrowthweekly.com',
                'email': 'hello@saasgrowthweekly.com',
                'audience_size': 32000,
                'engagement_rate': 8.7,
                'location': 'Remote',
                'is_verified': True
            }
        ]
        
        influencers = []
        for influencer in mock_newsletter_influencers[:limit]:
            # Analyze with AI
            ai_analysis = await self.analyze_influencer_with_ai(influencer)
            
            # Combine original data with AI analysis
            influencer.update(ai_analysis)
            influencer['id'] = str(uuid.uuid4())
            influencer['created_at'] = datetime.utcnow().isoformat()
            influencer['updated_at'] = datetime.utcnow().isoformat()
            
            influencers.append(influencer)
        
        logger.info(f"Collected {len(influencers)} newsletter influencers")
        return influencers
    
    async def collect_podcast_influencers(self, search_terms: List[str], limit: int = 20) -> List[Dict[str, Any]]:
        """
        Collect podcast influencers (mock implementation)
        In production, you'd use podcast APIs or web scraping
        """
        logger.info(f"Collecting podcast influencers for terms: {search_terms}")
        
        # Mock podcast data
        mock_podcast_influencers = [
            {
                'name': 'The SaaS Show',
                'platform': 'Podcast',
                'handle': '@thesaasshow',
                'bio': 'Weekly B2B Software Podcast | Interviews with SaaS founders and growth experts',
                'website_url': 'https://thesaasshow.com',
                'email': 'hello@thesaasshow.com',
                'audience_size': 15000,
                'engagement_rate': 8.1,
                'location': 'Remote',
                'is_verified': True
            },
            {
                'name': 'B2B Growth Podcast',
                'platform': 'Podcast',
                'handle': '@b2bgrowth',
                'bio': 'Marketing and sales insights for B2B companies | Weekly interviews with industry leaders',
                'website_url': 'https://b2bgrowthpodcast.com',
                'email': 'team@b2bgrowthpodcast.com',
                'audience_size': 25000,
                'engagement_rate': 6.5,
                'location': 'Austin, TX',
                'is_verified': True
            }
        ]
        
        influencers = []
        for influencer in mock_podcast_influencers[:limit]:
            # Analyze with AI
            ai_analysis = await self.analyze_influencer_with_ai(influencer)
            
            # Combine original data with AI analysis
            influencer.update(ai_analysis)
            influencer['id'] = str(uuid.uuid4())
            influencer['created_at'] = datetime.utcnow().isoformat()
            influencer['updated_at'] = datetime.utcnow().isoformat()
            
            influencers.append(influencer)
        
        logger.info(f"Collected {len(influencers)} podcast influencers")
        return influencers
    
    async def collect_all_influencers(self, search_terms: List[str] = None) -> List[Dict[str, Any]]:
        """
        Collect influencers from all platforms
        """
        if search_terms is None:
            search_terms = ['saas', 'b2b', 'marketing', 'growth', 'startup']
        
        logger.info("Starting AI-powered influencer data collection...")
        
        # Collect from all platforms concurrently
        linkedin_task = self.collect_linkedin_influencers(search_terms, limit=50)
        newsletter_task = self.collect_newsletter_influencers(search_terms, limit=30)
        podcast_task = self.collect_podcast_influencers(search_terms, limit=20)
        
        # Wait for all collections to complete
        linkedin_influencers, newsletter_influencers, podcast_influencers = await asyncio.gather(
            linkedin_task, newsletter_task, podcast_task
        )
        
        # Combine all influencers
        all_influencers = linkedin_influencers + newsletter_influencers + podcast_influencers
        
        logger.info(f"Total collected: {len(all_influencers)} influencers")
        return all_influencers
    
    async def save_influencers_to_database(self, influencers: List[Dict[str, Any]]) -> bool:
        """
        Save collected influencers to the database
        """
        try:
            logger.info(f"Saving {len(influencers)} influencers to database...")
            
            # Insert influencers into database
            result = self.supabase.table("influencers").insert(influencers).execute()
            
            if result.data:
                logger.info(f"✅ Successfully saved {len(result.data)} influencers to database!")
                return True
            else:
                logger.error("❌ Failed to save influencers to database")
                return False
                
        except Exception as e:
            logger.error(f"❌ Error saving influencers: {str(e)}")
            return False
    
    async def run_collection(self, search_terms: List[str] = None, save_to_db: bool = True):
        """
        Run the complete AI data collection process
        """
        try:
            # Collect influencers
            influencers = await self.collect_all_influencers(search_terms)
            
            if save_to_db and influencers:
                # Save to database
                success = await self.save_influencers_to_database(influencers)
                if success:
                    logger.info("🎉 AI data collection completed successfully!")
                else:
                    logger.error("❌ Failed to save data to database")
            else:
                logger.info(f"Collected {len(influencers)} influencers (not saved to database)")
                
            return influencers
            
        except Exception as e:
            logger.error(f"❌ Error in data collection: {str(e)}")
            return []

async def main():
    """Main function to run AI data collection"""
    search_terms = ['saas', 'b2b', 'marketing', 'growth', 'startup', 'product', 'sales']
    
    async with AIDataCollector() as collector:
        influencers = await collector.run_collection(
            search_terms=search_terms,
            save_to_db=True
        )
        
        # Print summary
        if influencers:
            print(f"\n📊 Collection Summary:")
            print(f"Total influencers: {len(influencers)}")
            
            # Group by platform
            platforms = {}
            for inf in influencers:
                platform = inf.get('platform', 'Unknown')
                platforms[platform] = platforms.get(platform, 0) + 1
            
            for platform, count in platforms.items():
                print(f"  {platform}: {count}")
            
            # Show top influencers by audience size
            top_influencers = sorted(influencers, key=lambda x: x.get('audience_size', 0), reverse=True)[:5]
            print(f"\n🏆 Top 5 by audience size:")
            for inf in top_influencers:
                print(f"  {inf['name']} ({inf['platform']}) - {inf.get('audience_size', 0):,} followers")

if __name__ == "__main__":
    asyncio.run(main())
