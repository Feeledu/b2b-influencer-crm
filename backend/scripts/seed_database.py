#!/usr/bin/env python3
"""
Database Seeding Script
Seeds the database with mock data from JSON file
"""

import json
import os
import psycopg2
from psycopg2.extras import execute_values, Json
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

def load_mock_data():
    """Load mock data from JSON file"""
    mock_data_file = Path(__file__).parent.parent / "mock_data.json"
    
    if not mock_data_file.exists():
        print("❌ Mock data file not found. Please run generate_mock_data.py first")
        return None
    
    with open(mock_data_file, 'r') as f:
        return json.load(f)

def insert_table_data(conn, table_name, data, columns):
    """Insert data into a table"""
    if not data:
        print(f"⚠️  No data to insert for {table_name}")
        return True
    
    try:
        cursor = conn.cursor()
        
        # Prepare data for insertion
        values = []
        for row in data:
            value_tuple = []
            for col in columns:
                value = row.get(col, None)
                # Convert dict/list to JSON for JSONB columns
                if isinstance(value, (dict, list)) and col in ['audience_demographics', 'contact_info']:
                    value = Json(value)
                # Convert list to PostgreSQL array for array columns
                elif isinstance(value, list) and col in ['expertise_tags', 'tags']:
                    value = value  # psycopg2 will handle array conversion
                value_tuple.append(value)
            values.append(tuple(value_tuple))
        
        # Insert data
        insert_query = f"""
            INSERT INTO {table_name} ({', '.join(columns)})
            VALUES %s
            ON CONFLICT DO NOTHING
        """
        
        execute_values(cursor, insert_query, values)
        conn.commit()
        
        print(f"✅ Inserted {len(values)} records into {table_name}")
        return True
        
    except Exception as e:
        print(f"❌ Error inserting into {table_name}: {e}")
        conn.rollback()
        return False

def seed_database():
    """Main seeding function"""
    print("🌱 Starting database seeding...")
    
    # Load mock data
    mock_data = load_mock_data()
    if not mock_data:
        return False
    
    # Get database connection
    conn = get_database_connection()
    if not conn:
        return False
    
    try:
        # Define table schemas and data mapping
        tables = [
            {
                'name': 'users',
                'data': mock_data['users'],
                'columns': ['id', 'email', 'name', 'avatar_url', 'role', 'subscription_status', 'created_at', 'updated_at']
            },
            {
                'name': 'influencers',
                'data': mock_data['influencers'],
                'columns': ['id', 'name', 'platform', 'handle', 'bio', 'avatar_url', 'website_url', 'email', 
                           'linkedin_url', 'twitter_url', 'industry', 'audience_size', 'engagement_rate', 
                           'location', 'expertise_tags', 'audience_demographics', 'contact_info', 
                           'is_verified', 'created_at', 'updated_at']
            },
            {
                'name': 'user_influencers',
                'data': mock_data['user_influencers'],
                'columns': ['id', 'user_id', 'influencer_id', 'status', 'notes', 'priority', 'tags', 
                           'last_contacted_at', 'created_at', 'updated_at']
            },
            {
                'name': 'campaigns',
                'data': mock_data['campaigns'],
                'columns': ['id', 'user_id', 'name', 'description', 'status', 'start_date', 'end_date', 
                           'budget', 'spent', 'created_at', 'updated_at']
            },
            {
                'name': 'campaign_influencers',
                'data': mock_data['campaign_influencers'],
                'columns': ['id', 'campaign_id', 'influencer_id', 'utm_source', 'utm_medium', 'utm_campaign', 
                           'utm_content', 'utm_term', 'utm_url', 'status', 'notes', 'created_at', 'updated_at']
            },
            {
                'name': 'interactions',
                'data': mock_data['interactions'],
                'columns': ['id', 'user_id', 'influencer_id', 'campaign_id', 'type', 'subject', 'content', 
                           'file_url', 'interaction_date', 'created_at']
            },
            {
                'name': 'pipeline_attribution',
                'data': mock_data['pipeline_attribution'],
                'columns': ['id', 'user_id', 'campaign_id', 'influencer_id', 'opportunity_id', 'opportunity_name', 
                           'stage', 'value', 'probability', 'close_date', 'attribution_type', 'attribution_strength', 
                           'notes', 'created_at', 'updated_at']
            },
            {
                'name': 'campaign_outcomes',
                'data': mock_data['campaign_outcomes'],
                'columns': ['id', 'campaign_id', 'influencer_id', 'metric_type', 'metric_value', 'metric_count', 
                           'attribution_date', 'notes', 'created_at']
            }
        ]
        
        # Insert data for each table
        for table in tables:
            if not insert_table_data(conn, table['name'], table['data'], table['columns']):
                return False
        
        print("\n🎉 Database seeding completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Database seeding failed: {e}")
        return False
    
    finally:
        conn.close()

if __name__ == "__main__":
    seed_database()
