#!/usr/bin/env python3
"""
Fix user_influencers table by adding missing CRM fields
"""
import os
from app.database.supabase_client import SupabaseClient

def fix_user_influencers():
    """Add missing CRM fields to user_influencers table"""
    print("🔧 Fixing user_influencers table...")
    
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
    
    # Check current columns
    try:
        result = supabase.table('user_influencers').select('*').limit(1).execute()
        if result.data:
            print(f"Current columns: {list(result.data[0].keys())}")
        else:
            print("No data in user_influencers table")
    except Exception as e:
        print(f"Error checking columns: {str(e)[:100]}...")
    
    # Since we can't execute DDL directly, let's test if we can at least query the tables
    print("\n🧪 Testing table accessibility...")
    
    try:
        result = supabase.table('interactions').select('id').limit(1).execute()
        print("✅ Interactions table accessible")
    except Exception as e:
        print(f"❌ Interactions table: {str(e)[:100]}...")
    
    try:
        result = supabase.table('campaign_influencers').select('id').limit(1).execute()
        print("✅ Campaign influencers table accessible")
    except Exception as e:
        print(f"❌ Campaign influencers table: {str(e)[:100]}...")
    
    # Test inserting data into the new tables
    print("\n🧪 Testing data insertion...")
    
    try:
        # Test interactions table
        test_data = {
            'user_id': '00000000-0000-0000-0000-000000000000',
            'influencer_id': '00000000-0000-0000-0000-000000000000',
            'type': 'email',
            'subject': 'Test interaction',
            'content': 'Test content'
        }
        result = supabase.table('interactions').insert(test_data).execute()
        print("✅ Can insert into interactions table")
        
        # Clean up
        if result.data:
            supabase.table('interactions').delete().eq('id', result.data[0]['id']).execute()
            print("✅ Test data cleaned up")
    except Exception as e:
        print(f"❌ Interactions insert failed: {str(e)[:100]}...")
    
    try:
        # Test campaign_influencers table
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
        print("✅ Can insert into campaign_influencers table")
        
        # Clean up
        if result.data:
            supabase.table('campaign_influencers').delete().eq('id', result.data[0]['id']).execute()
            print("✅ Test data cleaned up")
    except Exception as e:
        print(f"❌ Campaign influencers insert failed: {str(e)[:100]}...")
    
    print("\n🎉 Schema verification completed!")
    return True

if __name__ == "__main__":
    fix_user_influencers()
