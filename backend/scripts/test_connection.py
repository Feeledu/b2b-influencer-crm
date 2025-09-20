#!/usr/bin/env python3
"""
Supabase Connection Test
Tests database connection and validates credentials
"""

import os
import sys
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

try:
    from supabase import create_client, Client
    import psycopg2
    from psycopg2 import sql
except ImportError as e:
    print(f"❌ Missing required packages: {e}")
    print("Please install requirements: pip install -r requirements.txt")
    sys.exit(1)

def test_supabase_connection():
    """Test Supabase client connection"""
    print("🔄 Testing Supabase client connection...")
    
    try:
        url = os.getenv('SUPABASE_URL')
        key = os.getenv('SUPABASE_ANON_KEY')
        
        if not url or not key:
            print("❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment")
            return False
        
        supabase: Client = create_client(url, key)
        
        # Test connection by getting project info
        response = supabase.table('users').select('*').limit(1).execute()
        
        print("✅ Supabase client connection successful")
        return True
        
    except Exception as e:
        print(f"❌ Supabase client connection failed: {e}")
        return False

def test_database_connection():
    """Test direct PostgreSQL connection"""
    print("🔄 Testing direct database connection...")
    
    try:
        conn = psycopg2.connect(
            host=os.getenv('SUPABASE_HOST'),
            port=os.getenv('SUPABASE_PORT'),
            database=os.getenv('SUPABASE_DB'),
            user=os.getenv('SUPABASE_USER'),
            password=os.getenv('SUPABASE_PASSWORD')
        )
        
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        print(f"✅ Database connection successful (PostgreSQL {version[0]})")
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_environment_variables():
    """Test if all required environment variables are set"""
    print("🔄 Checking environment variables...")
    
    required_vars = [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY', 
        'SUPABASE_SERVICE_KEY',
        'SUPABASE_HOST',
        'SUPABASE_PORT',
        'SUPABASE_DB',
        'SUPABASE_USER',
        'SUPABASE_PASSWORD'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("Please check your .env file")
        return False
    
    print("✅ All required environment variables are set")
    return True

def main():
    """Run all connection tests"""
    print("🚀 B2B Influencer CRM - Connection Test")
    print("=" * 40)
    
    # Load environment variables from .env file
    env_file = Path(__file__).parent.parent / '.env'
    if env_file.exists():
        from dotenv import load_dotenv
        load_dotenv(env_file)
        print("📁 Loaded environment variables from .env file")
    else:
        print("⚠️  No .env file found, using system environment variables")
    
    print()
    
    # Run tests
    tests = [
        ("Environment Variables", test_environment_variables),
        ("Supabase Client", test_supabase_connection),
        ("Database Connection", test_database_connection)
    ]
    
    all_passed = True
    for test_name, test_func in tests:
        if not test_func():
            all_passed = False
        print()
    
    if all_passed:
        print("🎉 All connection tests passed!")
        print("✅ Ready to run database migrations")
        return True
    else:
        print("❌ Some tests failed. Please fix the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
