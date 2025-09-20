#!/usr/bin/env python3
"""
Simple Migration Runner
Runs database migrations using direct PostgreSQL connection
"""

import os
import sys
import psycopg2
from pathlib import Path

def load_migration_file(migration_file):
    """Load SQL migration file"""
    try:
        with open(migration_file, 'r') as f:
            return f.read()
    except Exception as e:
        print(f"❌ Error loading {migration_file}: {e}")
        return None

def run_migration(conn, migration_sql, migration_name):
    """Run a single migration"""
    try:
        cursor = conn.cursor()
        cursor.execute(migration_sql)
        conn.commit()
        cursor.close()
        print(f"✅ Migration {migration_name} completed successfully")
        return True
    except Exception as e:
        print(f"❌ Migration {migration_name} failed: {e}")
        conn.rollback()
        return False

def main():
    """Run all migrations"""
    print("🚀 B2B Influencer CRM - Database Migration Runner")
    print("=" * 50)
    
    # Load environment variables
    env_file = Path(__file__).parent.parent / '.env'
    if env_file.exists():
        from dotenv import load_dotenv
        load_dotenv(env_file)
        print("📁 Loaded environment variables from .env file")
    else:
        print("⚠️  No .env file found, using system environment variables")
    
    print()
    
    # Get database connection
    print("🔄 Connecting to database...")
    try:
        conn = psycopg2.connect(
            host=os.getenv('SUPABASE_HOST'),
            port=os.getenv('SUPABASE_PORT'),
            database=os.getenv('SUPABASE_DB'),
            user=os.getenv('SUPABASE_USER'),
            password=os.getenv('SUPABASE_PASSWORD')
        )
        print("✅ Database connection successful")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        sys.exit(1)
    
    # Get migration files
    migrations_dir = Path(__file__).parent.parent / "migrations"
    migration_files = sorted(migrations_dir.glob("*.sql"))
    
    if not migration_files:
        print("❌ No migration files found")
        sys.exit(1)
    
    print(f"📁 Found {len(migration_files)} migration files")
    print()
    
    # Run migrations
    for migration_file in migration_files:
        print(f"🔄 Running migration: {migration_file.name}")
        
        migration_sql = load_migration_file(migration_file)
        if not migration_sql:
            sys.exit(1)
        
        if not run_migration(conn, migration_sql, migration_file.name):
            print(f"❌ Migration failed: {migration_file.name}")
            sys.exit(1)
        
        print()
    
    # Close connection
    conn.close()
    
    print("🎉 All migrations completed successfully!")
    print("✅ Database schema is ready")
    print()
    print("Next steps:")
    print("1. Run: python scripts/generate_mock_data.py")
    print("2. Run: python scripts/seed_database.py")

if __name__ == "__main__":
    main()
