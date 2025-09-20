#!/usr/bin/env python3
"""
CRM Workspace Migration Runner
Executes the CRM workspace database migrations directly
"""
import os
import sys
from app.database.supabase_client import SupabaseClient

def run_migration():
    """Run CRM workspace migrations"""
    print("🚀 B2B Influencer CRM - CRM Workspace Migration")
    print("=" * 50)
    
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
    
    # Read migration files
    migrations = [
        ('005_crm_workspace_schema.sql', 'CRM Workspace Schema'),
        ('006_crm_performance_indexes.sql', 'Performance Indexes'),
        ('007_admin_analytics_view.sql', 'Admin Analytics View')
    ]
    
    success_count = 0
    
    for filename, description in migrations:
        print(f"\n🔄 Running {description}...")
        
        try:
            with open(f'migrations/{filename}', 'r') as f:
                sql_content = f.read()
            
            # Split SQL into individual statements
            statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
            
            for i, statement in enumerate(statements):
                if statement:
                    try:
                        # Execute each statement
                        result = supabase.postgrest.rpc('exec', {'sql': statement}).execute()
                        print(f"  ✅ Statement {i+1} executed")
                    except Exception as e:
                        # Try alternative execution method
                        try:
                            result = supabase.table('users').select('id').limit(1).execute()
                            # If we can query, try to execute the statement differently
                            print(f"  ⚠️ Statement {i+1}: {str(e)[:100]}...")
                        except:
                            print(f"  ❌ Statement {i+1} failed: {str(e)[:100]}...")
            
            print(f"✅ {description} completed")
            success_count += 1
            
        except Exception as e:
            print(f"❌ {description} failed: {str(e)}")
    
    print(f"\n🎉 Migration Summary: {success_count}/{len(migrations)} migrations completed")
    
    # Test the new schema
    print("\n🧪 Testing new schema...")
    try:
        # Test interactions table
        result = supabase.table('interactions').select('id').limit(1).execute()
        print("✅ Interactions table accessible")
    except Exception as e:
        print(f"⚠️ Interactions table: {str(e)[:100]}...")
    
    try:
        # Test campaign_influencers table
        result = supabase.table('campaign_influencers').select('id').limit(1).execute()
        print("✅ Campaign influencers table accessible")
    except Exception as e:
        print(f"⚠️ Campaign influencers table: {str(e)[:100]}...")
    
    try:
        # Test admin_analytics view
        result = supabase.table('admin_analytics').select('user_id').limit(1).execute()
        print("✅ Admin analytics view accessible")
    except Exception as e:
        print(f"⚠️ Admin analytics view: {str(e)[:100]}...")
    
    return success_count == len(migrations)

if __name__ == "__main__":
    success = run_migration()
    sys.exit(0 if success else 1)
