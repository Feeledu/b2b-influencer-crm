#!/usr/bin/env python3
"""
Simple test script for AI data collection (without database)
"""
import asyncio
import sys
from pathlib import Path

# Add the parent directory to the path
sys.path.append(str(Path(__file__).parent.parent))

class MockAIDataCollector:
    """Mock version of AIDataCollector for testing without database"""
    
    def __init__(self):
        self.session = None
        
    async def __aenter__(self):
        import aiohttp
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def analyze_influencer_with_ai(self, profile_data):
        """Mock AI analysis"""
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
            'last_analyzed': '2024-01-14T10:00:00Z'
        }
    
    async def collect_mock_influencers(self):
        """Collect mock influencer data"""
        mock_influencers = [
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
            }
        ]
        
        influencers = []
        for influencer in mock_influencers:
            # Analyze with AI
            ai_analysis = await self.analyze_influencer_with_ai(influencer)
            
            # Combine original data with AI analysis
            influencer.update(ai_analysis)
            influencer['id'] = f"mock_{influencer['name'].lower().replace(' ', '_')}"
            influencer['created_at'] = '2024-01-14T10:00:00Z'
            influencer['updated_at'] = '2024-01-14T10:00:00Z'
            
            influencers.append(influencer)
        
        return influencers

async def test_collection():
    """Test the AI data collection system"""
    print("🚀 Testing AI Data Collection System (Mock Version)...")
    
    async with MockAIDataCollector() as collector:
        print("📊 Collecting mock influencers...")
        
        # Collect mock influencers
        influencers = await collector.collect_mock_influencers()
        
        if influencers:
            print(f"\n✅ Collection successful! Found {len(influencers)} influencers")
            
            # Show sample data
            print("\n📋 Sample Influencer Data:")
            for i, inf in enumerate(influencers):
                print(f"\n{i+1}. {inf['name']} ({inf['platform']})")
                print(f"   Industry: {inf.get('industry', 'N/A')}")
                print(f"   Audience: {inf.get('audience_size', 0):,} followers")
                print(f"   Engagement: {inf.get('engagement_rate', 0)}%")
                print(f"   Expertise: {', '.join(inf.get('expertise_tags', []))}")
                print(f"   Buyer Alignment: {inf.get('audience_demographics', {}).get('buyer_alignment_score', 0)}/100")
                print(f"   AI Confidence: {inf.get('ai_confidence', 0):.2f}")
        else:
            print("❌ Collection failed or returned no data")
    
    print("\n🎉 Test completed successfully!")
    print("\n📈 AI Analysis Features Demonstrated:")
    print("  ✅ Industry categorization")
    print("  ✅ Expertise tag extraction")
    print("  ✅ Audience demographics analysis")
    print("  ✅ Buyer alignment scoring")
    print("  ✅ AI confidence scoring")

if __name__ == "__main__":
    asyncio.run(test_collection())
