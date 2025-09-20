#!/usr/bin/env python3
"""
Test script for AI data collection
"""
import asyncio
import sys
from pathlib import Path

# Add the parent directory to the path
sys.path.append(str(Path(__file__).parent.parent))

from ai_data_collection import AIDataCollector

async def test_collection():
    """Test the AI data collection system"""
    print("🚀 Testing AI Data Collection System...")
    
    # Test search terms
    search_terms = ['saas', 'b2b', 'marketing']
    
    async with AIDataCollector() as collector:
        print(f"📊 Collecting influencers for terms: {search_terms}")
        
        # Run collection (without saving to database for testing)
        influencers = await collector.run_collection(
            search_terms=search_terms,
            save_to_db=False  # Don't save to DB for testing
        )
        
        if influencers:
            print(f"\n✅ Collection successful! Found {len(influencers)} influencers")
            
            # Show sample data
            print("\n📋 Sample Influencer Data:")
            for i, inf in enumerate(influencers[:3]):  # Show first 3
                print(f"\n{i+1}. {inf['name']} ({inf['platform']})")
                print(f"   Industry: {inf.get('industry', 'N/A')}")
                print(f"   Audience: {inf.get('audience_size', 0):,} followers")
                print(f"   Engagement: {inf.get('engagement_rate', 0)}%")
                print(f"   Expertise: {', '.join(inf.get('expertise_tags', []))}")
                print(f"   Buyer Alignment: {inf.get('audience_demographics', {}).get('buyer_alignment_score', 0)}/100")
        else:
            print("❌ Collection failed or returned no data")
    
    print("\n🎉 Test completed!")

if __name__ == "__main__":
    asyncio.run(test_collection())
