#!/usr/bin/env python3
"""
Test Supabase connection
"""
import os
from supabase import create_client

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

def test_connection():
    try:
        url = os.getenv('SUPABASE_URL')
        key = os.getenv('SUPABASE_ANON_KEY')
        
        print(f"URL: {url}")
        print(f"Key: {key[:20]}..." if key else "No key")
        
        if not url or not key:
            print("❌ Missing credentials")
            return False
            
        # Create client
        supabase = create_client(url, key)
        print("✅ Client created successfully")
        
        # Test query
        result = supabase.table("influencers").select("*").limit(1).execute()
        print(f"✅ Query successful: {len(result.data)} records")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_connection()
