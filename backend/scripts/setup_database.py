#!/usr/bin/env python3
"""
Complete Database Setup Script
Guides you through the entire database setup process
"""

import os
import sys
import subprocess
from pathlib import Path

def print_header(title):
    """Print a formatted header"""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)

def print_step(step_num, title):
    """Print a step header"""
    print(f"\n📋 Step {step_num}: {title}")
    print("-" * 40)

def check_file_exists(file_path, description):
    """Check if a file exists"""
    if Path(file_path).exists():
        print(f"✅ {description} found")
        return True
    else:
        print(f"❌ {description} not found at {file_path}")
        return False

def run_command(command, description, required=True):
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
        if required:
            print("This step is required. Please fix the error and try again.")
            return False
        else:
            print("This step is optional. Continuing...")
            return True

def main():
    """Main setup process"""
    print_header("B2B Influencer CRM - Database Setup")
    print("This script will guide you through setting up your database.")
    print("Follow the steps below to complete the setup.")
    
    # Step 1: Check prerequisites
    print_step(1, "Check Prerequisites")
    
    # Check if .env file exists
    env_file = Path(__file__).parent.parent / '.env'
    if not env_file.exists():
        print("❌ .env file not found")
        print("Please create a .env file with your Supabase credentials.")
        print("See setup_supabase.md for instructions.")
        return False
    
    print("✅ .env file found")
    
    # Check if migrations directory exists
    migrations_dir = Path(__file__).parent.parent / "migrations"
    if not migrations_dir.exists():
        print("❌ Migrations directory not found")
        return False
    
    print("✅ Migrations directory found")
    
    # Step 2: Test connection
    print_step(2, "Test Database Connection")
    
    if not run_command("python scripts/test_connection.py", "Testing database connection"):
        print("Please fix the connection issues and try again.")
        return False
    
    # Step 3: Run migrations
    print_step(3, "Run Database Migrations")
    
    if not run_command("python scripts/run_migrations_simple.py", "Running database migrations"):
        print("Migration failed. Please check the error messages above.")
        return False
    
    # Step 4: Generate mock data
    print_step(4, "Generate Mock Data")
    
    if not run_command("python scripts/generate_mock_data.py", "Generating mock data"):
        print("Mock data generation failed. Please check the error messages above.")
        return False
    
    # Step 5: Seed database
    print_step(5, "Seed Database with Mock Data")
    
    if not run_command("python scripts/seed_database.py", "Seeding database"):
        print("Database seeding failed. Please check the error messages above.")
        return False
    
    # Step 6: Verify setup
    print_step(6, "Verify Database Setup")
    
    if not run_command("python scripts/test_connection.py", "Verifying database setup"):
        print("Verification failed. Please check the error messages above.")
        return False
    
    # Success!
    print_header("🎉 Database Setup Complete!")
    print("Your B2B Influencer CRM database is now ready!")
    print()
    print("What was created:")
    print("✅ 8 database tables with proper relationships")
    print("✅ Row Level Security policies for user data isolation")
    print("✅ Performance indexes for fast queries")
    print("✅ Mock data with 300+ influencers and test users")
    print("✅ Campaign and pipeline attribution data")
    print()
    print("Next steps:")
    print("1. Start your backend server: python run.py")
    print("2. Test the API endpoints")
    print("3. Move to the next feature: Authentication System")
    print()
    print("Database is ready for development! 🚀")

if __name__ == "__main__":
    main()
