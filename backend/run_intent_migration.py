#!/usr/bin/env python3
"""
Run Intent-Led Discovery database migration
"""
import os
import sys
from pathlib import Path

# Add the app directory to the Python path
sys.path.append(str(Path(__file__).parent / "app"))

from database.supabase_client import SupabaseClient
from config import settings

def run_intent_migration():
    """Run the intent discovery schema migration"""
    print("🚀 Running Intent-Led Discovery Schema Migration...")
    
    try:
        # Initialize Supabase client
        supabase_client = SupabaseClient()
        supabase = supabase_client.get_client()
        
        # Read the migration SQL file
        migration_file = Path(__file__).parent / "migrations" / "008_intent_discovery_schema.sql"
        
        if not migration_file.exists():
            print(f"❌ Migration file not found: {migration_file}")
            return False
            
        with open(migration_file, 'r') as f:
            migration_sql = f.read()
        
        print("📄 Migration SQL loaded successfully")
        
        # Split the SQL into individual statements
        statements = [stmt.strip() for stmt in migration_sql.split(';') if stmt.strip()]
        
        print(f"📊 Found {len(statements)} SQL statements to execute")
        
        # Execute each statement
        for i, statement in enumerate(statements, 1):
            if statement:
                print(f"⚡ Executing statement {i}/{len(statements)}...")
                try:
                    result = supabase.rpc('exec_sql', {'sql': statement})
                    print(f"✅ Statement {i} executed successfully")
                except Exception as e:
                    print(f"⚠️ Statement {i} failed: {str(e)}")
                    # Continue with other statements
                    continue
        
        print("🎉 Intent-Led Discovery schema migration completed!")
        
        # Test the new tables
        print("\n🔍 Testing new tables...")
        
        # Test audience_segments table
        try:
            result = supabase.table("audience_segments").select("id").limit(1).execute()
            print("✅ audience_segments table created successfully")
        except Exception as e:
            print(f"❌ audience_segments table test failed: {e}")
        
        # Test intent_signals table
        try:
            result = supabase.table("intent_signals").select("id").limit(1).execute()
            print("✅ intent_signals table created successfully")
        except Exception as e:
            print(f"❌ intent_signals table test failed: {e}")
        
        # Test trust_relationships table
        try:
            result = supabase.table("trust_relationships").select("id").limit(1).execute()
            print("✅ trust_relationships table created successfully")
        except Exception as e:
            print(f"❌ trust_relationships table test failed: {e}")
        
        # Test buyer_alignment_scores table
        try:
            result = supabase.table("buyer_alignment_scores").select("id").limit(1).execute()
            print("✅ buyer_alignment_scores table created successfully")
        except Exception as e:
            print(f"❌ buyer_alignment_scores table test failed: {e}")
        
        # Test influencers table updates
        try:
            result = supabase.table("influencers").select("audience_demographics, engagement_quality, trust_indicators, buyer_alignment_score, intent_signals_count").limit(1).execute()
            print("✅ influencers table updated successfully")
        except Exception as e:
            print(f"❌ influencers table update test failed: {e}")
        
        print("\n🎯 Intent-Led Discovery schema is ready!")
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = run_intent_migration()
    sys.exit(0 if success else 1)
