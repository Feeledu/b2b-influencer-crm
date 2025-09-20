#!/usr/bin/env python3
"""
Simple schema verification test
"""
import os
from app.database.supabase_client import SupabaseClient

def test_schema():
    """Test that the CRM schema was created successfully"""
    print("🧪 Testing CRM Workspace Schema...")
    
    # Set environment variables
    os.environ['SUPABASE_URL'] = 'https://ahrmmjceerzgytuczakn.supabase.co'
    os.environ['SUPABASE_SERVICE_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocm1tamNlZXJ6Z3l0dWN6YWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzg3NTI5NSwiZXhwIjoyMDczNDUxMjk1fQ.YourServiceKeyHere'
    
    # Initialize Supabase client
    client = SupabaseClient()
    supabase = client.get_client()
    
    if not supabase:
        print("❌ Failed to connect to Supabase")
        return False
    
    print("✅ Connected to Supabase")
    
    # Test 1: Check interactions table
    try:
        result = supabase.table('interactions').select('id').limit(1).execute()
        print("✅ Interactions table exists and is accessible")
    except Exception as e:
        print(f"❌ Interactions table test failed: {str(e)[:100]}...")
        return False
    
    # Test 2: Check campaign_influencers table
    try:
        result = supabase.table('campaign_influencers').select('id').limit(1).execute()
        print("✅ Campaign influencers table exists and is accessible")
    except Exception as e:
        print(f"❌ Campaign influencers table test failed: {str(e)[:100]}...")
        return False
    
    # Test 3: Check user_influencers enhanced fields
    try:
        result = supabase.table('user_influencers').select('follow_up_date, relationship_strength').limit(1).execute()
        print("✅ User influencers table has enhanced CRM fields")
    except Exception as e:
        print(f"❌ User influencers enhanced fields test failed: {str(e)[:100]}...")
        return False
    
    # Test 4: Try to insert test data into interactions
    try:
        test_data = {
            'user_id': '00000000-0000-0000-0000-000000000000',
            'influencer_id': '00000000-0000-0000-0000-000000000000',
            'type': 'email',
            'subject': 'Test interaction',
            'content': 'Test content'
        }
        result = supabase.table('interactions').insert(test_data).execute()
        print("✅ Can insert data into interactions table")
        
        # Clean up test data
        if result.data:
            supabase.table('interactions').delete().eq('id', result.data[0]['id']).execute()
            print("✅ Test data cleaned up")
    except Exception as e:
        print(f"❌ Interactions insert test failed: {str(e)[:100]}...")
        return False
    
    # Test 5: Try to insert test data into campaign_influencers
    try:
        test_data = {
            'campaign_id': '00000000-0000-0000-0000-000000000000',
            'influencer_id': '00000000-0000-0000-0000-000000000000',
            'user_id': '00000000-0000-0000-0000-000000000000',
            'utm_source': 'influencer',
            'utm_medium': 'partnership',
            'utm_campaign': 'test-campaign',
            'status': 'planned'
        }
        result = supabase.table('campaign_influencers').insert(test_data).execute()
        print("✅ Can insert data into campaign_influencers table")
        
        # Clean up test data
        if result.data:
            supabase.table('campaign_influencers').delete().eq('id', result.data[0]['id']).execute()
            print("✅ Test data cleaned up")
    except Exception as e:
        print(f"❌ Campaign influencers insert test failed: {str(e)[:100]}...")
        return False
    
    print("\n🎉 All schema tests passed! CRM workspace is ready.")
    return True

if __name__ == "__main__":
    success = test_schema()
    exit(0 if success else 1)
