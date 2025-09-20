#!/usr/bin/env python3
"""
Supabase Migration Runner
Runs database migrations and seeds mock data
"""

import os
import subprocess
import sys
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return False

def check_supabase_cli():
    """Check if Supabase CLI is installed"""
    try:
        subprocess.run(["supabase", "--version"], check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Supabase CLI not found. Please install it first:")
        print("npm install -g supabase")
        return False

def check_environment():
    """Check if required environment variables are set"""
    required_vars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"❌ Missing required environment variables: {', '.join(missing_vars)}")
        print("Please set these in your .env file or environment")
        return False
    
    return True

def run_migrations():
    """Run database migrations"""
    migrations_dir = Path(__file__).parent.parent / "migrations"
    
    if not migrations_dir.exists():
        print("❌ Migrations directory not found")
        return False
    
    migration_files = sorted(migrations_dir.glob("*.sql"))
    
    if not migration_files:
        print("❌ No migration files found")
        return False
    
    print(f"📁 Found {len(migration_files)} migration files")
    
    for migration_file in migration_files:
        print(f"\n🔄 Running migration: {migration_file.name}")
        
        # Read migration file
        with open(migration_file, 'r') as f:
            migration_sql = f.read()
        
        # Run migration using Supabase CLI
        # Build connection string with password
        db_url = f"postgresql://postgres:{os.getenv('SUPABASE_PASSWORD')}@{os.getenv('SUPABASE_HOST')}:{os.getenv('SUPABASE_PORT')}/{os.getenv('SUPABASE_DB')}"
        command = f'supabase db reset --db-url "{db_url}"'
        
        if not run_command(command, f"Migration {migration_file.name}"):
            return False
    
    return True

def seed_mock_data():
    """Seed database with mock data"""
    print("\n🌱 Seeding database with mock data...")
    
    # Check if mock data file exists
    mock_data_file = Path(__file__).parent / "mock_data.json"
    
    if not mock_data_file.exists():
        print("❌ Mock data file not found. Please run generate_mock_data.py first")
        return False
    
    # Import and run the data seeding
    try:
        from seed_database import seed_database
        return seed_database()
    except ImportError:
        print("❌ seed_database.py not found. Please create it first")
        return False

def main():
    """Main migration runner"""
    print("🚀 B2B Influencer CRM - Database Migration Runner")
    print("=" * 50)
    
    # Check prerequisites
    if not check_supabase_cli():
        sys.exit(1)
    
    if not check_environment():
        sys.exit(1)
    
    # Run migrations
    if not run_migrations():
        print("❌ Migration failed")
        sys.exit(1)
    
    # Seed mock data
    if not seed_mock_data():
        print("❌ Data seeding failed")
        sys.exit(1)
    
    print("\n🎉 Database setup completed successfully!")
    print("Your B2B Influencer CRM database is ready to use.")

if __name__ == "__main__":
    main()
