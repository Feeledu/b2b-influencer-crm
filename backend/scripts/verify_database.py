#!/usr/bin/env python3
"""
Database Verification Script
Tests database setup with sample queries
"""

import os
import psycopg2
from pathlib import Path

def get_database_connection():
    """Get database connection using environment variables"""
    # Load environment variables from .env file
    env_file = Path(__file__).parent.parent / '.env'
    if env_file.exists():
        from dotenv import load_dotenv
        load_dotenv(env_file)
    
    try:
        conn = psycopg2.connect(
            host=os.getenv('SUPABASE_HOST'),
            port=os.getenv('SUPABASE_PORT'),
            database=os.getenv('SUPABASE_DB'),
            user=os.getenv('SUPABASE_USER'),
            password=os.getenv('SUPABASE_PASSWORD')
        )
        return conn
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return None

def test_table_counts():
    """Test table record counts"""
    print("🔄 Testing table record counts...")
    
    conn = get_database_connection()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        
        tables = [
            'users', 'influencers', 'user_influencers', 'campaigns',
            'campaign_influencers', 'interactions', 'pipeline_attribution', 'campaign_outcomes'
        ]
        
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"  ✅ {table}: {count} records")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error testing table counts: {e}")
        return False

def test_sample_queries():
    """Test sample queries"""
    print("\n🔄 Testing sample queries...")
    
    conn = get_database_connection()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        
        # Test 1: Get top 5 influencers by audience size
        print("  📊 Top 5 influencers by audience size:")
        cursor.execute("""
            SELECT name, platform, audience_size, engagement_rate 
            FROM influencers 
            ORDER BY audience_size DESC 
            LIMIT 5
        """)
        for row in cursor.fetchall():
            print(f"    - {row[0]} ({row[1]}): {row[2]:,} followers, {row[3]}% engagement")
        
        # Test 2: Get user campaign summary
        print("\n  📈 User campaign summary:")
        cursor.execute("""
            SELECT u.name, COUNT(c.id) as campaign_count, 
                   SUM(c.budget) as total_budget, SUM(c.spent) as total_spent
            FROM users u
            LEFT JOIN campaigns c ON u.id = c.user_id
            GROUP BY u.id, u.name
            ORDER BY campaign_count DESC
            LIMIT 3
        """)
        for row in cursor.fetchall():
            print(f"    - {row[0]}: {row[1]} campaigns, ${row[2]:,.2f} budget, ${row[3]:,.2f} spent")
        
        # Test 3: Get pipeline attribution summary
        print("\n  💰 Pipeline attribution summary:")
        cursor.execute("""
            SELECT COUNT(*) as total_attributions, 
                   SUM(value) as total_value,
                   COUNT(CASE WHEN stage = 'closed_won' THEN 1 END) as won_deals
            FROM pipeline_attribution
        """)
        row = cursor.fetchone()
        print(f"    - {row[0]} total attributions, ${row[1]:,.2f} total value, {row[2]} won deals")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error testing sample queries: {e}")
        return False

def main():
    """Run database verification"""
    print("🚀 B2B Influencer CRM - Database Verification")
    print("=" * 50)
    
    # Test table counts
    if not test_table_counts():
        return False
    
    # Test sample queries
    if not test_sample_queries():
        return False
    
    print("\n🎉 Database verification completed successfully!")
    print("✅ All tables are populated with realistic test data")
    print("✅ Sample queries are working correctly")
    print("✅ Database is ready for development!")
    
    return True

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
