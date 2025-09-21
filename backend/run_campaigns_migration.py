#!/usr/bin/env python3
"""
Run the campaigns schema enhancement migration
"""

import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def run_migration():
    """Run the campaigns schema enhancement migration"""
    
    # Get Supabase credentials
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_ANON_KEY')
    
    if not supabase_url or not supabase_key:
        print("❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file")
        sys.exit(1)
    
    try:
        # Create Supabase client
        supabase: Client = create_client(supabase_url, supabase_key)
        print("✅ Connected to Supabase")
        
        # Read the migration file
        migration_file = "migrations/009_enhance_campaigns_schema.sql"
        if not os.path.exists(migration_file):
            print(f"❌ Error: Migration file {migration_file} not found")
            sys.exit(1)
        
        with open(migration_file, 'r') as f:
            migration_sql = f.read()
        
        print("📄 Migration file loaded")
        
        # Execute the migration
        print("🚀 Running migration...")
        result = supabase.rpc('exec_sql', {'sql': migration_sql}).execute()
        
        print("✅ Migration completed successfully!")
        print("\n📊 Added fields to campaigns table:")
        print("   • UTM tracking fields (utm_source, utm_medium, utm_campaign, etc.)")
        print("   • Performance metrics (leads, demos, revenue, roi, progress)")
        print("   • Analytics fields (total_clicks, conversions, conversion_rate)")
        print("   • Campaign goals (target_audience, goals)")
        print("   • 'paused' status option")
        print("\n📈 Sample data inserted:")
        print("   • 6 sample campaigns with full data")
        print("   • Campaign-influencer relationships")
        print("   • Performance indexes created")
        
    except Exception as e:
        print(f"❌ Error running migration: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    run_migration()
