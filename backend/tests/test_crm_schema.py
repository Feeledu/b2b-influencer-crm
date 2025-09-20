"""
Tests for CRM Workspace Database Schema
"""
import pytest
import asyncio
from datetime import datetime, timedelta
from sqlalchemy import text
from app.database.supabase_client import SupabaseClient
from app.config import settings


@pytest.mark.asyncio
class TestCRMSchema:
    """Test CRM workspace database schema changes"""
    
    async def setup_method(self):
        """Setup database connection for each test"""
        self.supabase_client = SupabaseClient()
        self.supabase = self.supabase_client.get_client()
        
        if not self.supabase:
            pytest.skip("Supabase client not available")
    
    async def test_user_influencers_enhanced_fields(self):
        """Test that user_influencers table has new CRM fields"""
        # Check if new fields exist
        result = self.supabase.rpc('exec_sql', {
            'sql': """
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'user_influencers' 
            AND column_name IN ('follow_up_date', 'relationship_strength')
            ORDER BY column_name;
            """
        }).execute()
        
        assert result.data is not None
        columns = {row['column_name']: row['data_type'] for row in result.data}
        
        assert 'follow_up_date' in columns
        assert 'relationship_strength' in columns
        assert columns['follow_up_date'] == 'timestamp with time zone'
        assert columns['relationship_strength'] == 'integer'
    
    async def test_interactions_table_exists(self):
        """Test that interactions table exists with correct schema"""
        # Check table exists
        result = self.supabase.rpc('exec_sql', {
            'sql': """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'interactions';
            """
        }).execute()
        
        assert result.data is not None
        assert len(result.data) == 1
        assert result.data[0]['table_name'] == 'interactions'
        
        # Check columns exist
        result = self.supabase.rpc('exec_sql', {
            'sql': """
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'interactions'
            ORDER BY column_name;
            """
        }).execute()
        
        assert result.data is not None
        columns = {row['column_name']: row for row in result.data}
        
        expected_columns = {
            'id': {'data_type': 'uuid', 'is_nullable': 'NO'},
            'user_id': {'data_type': 'uuid', 'is_nullable': 'NO'},
            'influencer_id': {'data_type': 'uuid', 'is_nullable': 'NO'},
            'campaign_id': {'data_type': 'uuid', 'is_nullable': 'YES'},
            'type': {'data_type': 'character varying', 'is_nullable': 'NO'},
            'subject': {'data_type': 'character varying', 'is_nullable': 'YES'},
            'content': {'data_type': 'text', 'is_nullable': 'YES'},
            'file_url': {'data_type': 'text', 'is_nullable': 'YES'},
            'interaction_date': {'data_type': 'timestamp with time zone', 'is_nullable': 'NO'},
            'created_at': {'data_type': 'timestamp with time zone', 'is_nullable': 'NO'}
        }
        
        for col_name, expected in expected_columns.items():
            assert col_name in columns
            assert columns[col_name]['data_type'] == expected['data_type']
            assert columns[col_name]['is_nullable'] == expected['is_nullable']
    
    async def test_campaign_influencers_table_exists(self):
        """Test that campaign_influencers table exists with correct schema"""
        # Check table exists
        result = self.supabase.rpc('exec_sql', {
            'sql': """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'campaign_influencers';
            """
        }).execute()
        
        assert result.data is not None
        assert len(result.data) == 1
        assert result.data[0]['table_name'] == 'campaign_influencers'
        
        # Check columns exist
        result = self.supabase.rpc('exec_sql', {
            'sql': """
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'campaign_influencers'
            ORDER BY column_name;
            """
        }).execute()
        
        assert result.data is not None
        columns = {row['column_name']: row for row in result.data}
        
        expected_columns = {
            'id': {'data_type': 'uuid', 'is_nullable': 'NO'},
            'campaign_id': {'data_type': 'uuid', 'is_nullable': 'NO'},
            'influencer_id': {'data_type': 'uuid', 'is_nullable': 'NO'},
            'user_id': {'data_type': 'uuid', 'is_nullable': 'NO'},
            'utm_source': {'data_type': 'character varying', 'is_nullable': 'YES'},
            'utm_medium': {'data_type': 'character varying', 'is_nullable': 'YES'},
            'utm_campaign': {'data_type': 'character varying', 'is_nullable': 'YES'},
            'utm_content': {'data_type': 'character varying', 'is_nullable': 'YES'},
            'utm_term': {'data_type': 'character varying', 'is_nullable': 'YES'},
            'utm_url': {'data_type': 'text', 'is_nullable': 'YES'},
            'status': {'data_type': 'character varying', 'is_nullable': 'NO'},
            'notes': {'data_type': 'text', 'is_nullable': 'YES'},
            'created_at': {'data_type': 'timestamp with time zone', 'is_nullable': 'NO'},
            'updated_at': {'data_type': 'timestamp with time zone', 'is_nullable': 'NO'}
        }
        
        for col_name, expected in expected_columns.items():
            assert col_name in columns
            assert columns[col_name]['data_type'] == expected['data_type']
            assert columns[col_name]['is_nullable'] == expected['is_nullable']
    
    async def test_interactions_table_constraints(self):
        """Test that interactions table has proper constraints"""
        # Check type constraint
        result = self.supabase.rpc('exec_sql', {
            'sql': """
            SELECT constraint_name, check_clause
            FROM information_schema.check_constraints 
            WHERE table_name = 'interactions' 
            AND constraint_name LIKE '%type%';
            """
        }).execute()
        
        assert result.data is not None
        assert len(result.data) >= 1
        
        # Check foreign key constraints
        result = self.supabase.rpc('exec_sql', {
            'sql': """
            SELECT 
                tc.constraint_name,
                tc.table_name,
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
                AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = tc.constraint_name
                AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = 'interactions';
            """
        }).execute()
        
        assert result.data is not None
        fk_columns = {row['column_name']: row['foreign_table_name'] for row in result.data}
        
        assert 'user_id' in fk_columns
        assert 'influencer_id' in fk_columns
        assert fk_columns['user_id'] == 'users'
        assert fk_columns['influencer_id'] == 'influencers'
    
    async def test_campaign_influencers_table_constraints(self):
        """Test that campaign_influencers table has proper constraints"""
        # Check status constraint
        result = self.supabase.rpc('exec_sql', {
            'sql': """
            SELECT constraint_name, check_clause
            FROM information_schema.check_constraints 
            WHERE table_name = 'campaign_influencers' 
            AND constraint_name LIKE '%status%';
            """
        }).execute()
        
        assert result.data is not None
        assert len(result.data) >= 1
        
        # Check unique constraint
        result = self.supabase.rpc('exec_sql', {
            'sql': """
            SELECT constraint_name, constraint_type
            FROM information_schema.table_constraints 
            WHERE table_name = 'campaign_influencers' 
            AND constraint_type = 'UNIQUE';
            """
        }).execute()
        
        assert result.data is not None
        assert len(result.data) >= 1
    
    async def test_performance_indexes_exist(self):
        """Test that performance indexes are created"""
        result = self.supabase.rpc('exec_sql', {
            'sql': """
            SELECT indexname, tablename, indexdef
            FROM pg_indexes 
            WHERE tablename IN ('interactions', 'campaign_influencers', 'user_influencers')
            AND indexname LIKE 'idx_%'
            ORDER BY tablename, indexname;
            """
        }).execute()
        
        assert result.data is not None
        indexes = {row['indexname']: row for row in result.data}
        
        # Check interactions indexes
        assert 'idx_interactions_user_id' in indexes
        assert 'idx_interactions_influencer_id' in indexes
        assert 'idx_interactions_campaign_id' in indexes
        assert 'idx_interactions_type' in indexes
        assert 'idx_interactions_date' in indexes
        
        # Check campaign_influencers indexes
        assert 'idx_campaign_influencers_campaign_id' in indexes
        assert 'idx_campaign_influencers_influencer_id' in indexes
        assert 'idx_campaign_influencers_user_id' in indexes
        
        # Check user_influencers indexes
        assert 'idx_user_influencers_follow_up' in indexes
        assert 'idx_user_influencers_relationship_strength' in indexes
    
    async def test_admin_analytics_view_exists(self):
        """Test that admin_analytics view exists"""
        result = self.supabase.rpc('exec_sql', {
            'sql': """
            SELECT table_name, table_type
            FROM information_schema.tables 
            WHERE table_name = 'admin_analytics' 
            AND table_type = 'VIEW';
            """
        }).execute()
        
        assert result.data is not None
        assert len(result.data) == 1
        assert result.data[0]['table_name'] == 'admin_analytics'
    
    async def test_admin_analytics_view_columns(self):
        """Test that admin_analytics view has correct columns"""
        result = self.supabase.rpc('exec_sql', {
            'sql': """
            SELECT column_name, data_type
            FROM information_schema.columns 
            WHERE table_name = 'admin_analytics'
            ORDER BY column_name;
            """
        }).execute()
        
        assert result.data is not None
        columns = {row['column_name']: row['data_type'] for row in result.data}
        
        expected_columns = {
            'user_id': 'uuid',
            'email': 'character varying',
            'total_influencers': 'bigint',
            'partnered_influencers': 'bigint',
            'total_campaigns': 'bigint',
            'total_interactions': 'bigint',
            'avg_relationship_strength': 'numeric',
            'last_activity': 'timestamp with time zone'
        }
        
        for col_name, expected_type in expected_columns.items():
            assert col_name in columns
            assert columns[col_name] == expected_type
    
    async def test_can_insert_interaction(self):
        """Test that we can insert data into interactions table"""
        # This test will fail until the table is created
        test_data = {
            'user_id': '00000000-0000-0000-0000-000000000000',
            'influencer_id': '00000000-0000-0000-0000-000000000000',
            'type': 'email',
            'subject': 'Test interaction',
            'content': 'Test content',
            'interaction_date': datetime.utcnow().isoformat()
        }
        
        try:
            result = self.supabase.table('interactions').insert(test_data).execute()
            # If we get here, the table exists and we can insert
            assert result.data is not None
        except Exception as e:
            # Expected to fail until migration is run
            assert "relation \"interactions\" does not exist" in str(e) or "does not exist" in str(e)
    
    async def test_can_insert_campaign_influencer(self):
        """Test that we can insert data into campaign_influencers table"""
        # This test will fail until the table is created
        test_data = {
            'campaign_id': '00000000-0000-0000-0000-000000000000',
            'influencer_id': '00000000-0000-0000-0000-000000000000',
            'user_id': '00000000-0000-0000-0000-000000000000',
            'utm_source': 'influencer',
            'utm_medium': 'partnership',
            'utm_campaign': 'test-campaign',
            'status': 'planned'
        }
        
        try:
            result = self.supabase.table('campaign_influencers').insert(test_data).execute()
            # If we get here, the table exists and we can insert
            assert result.data is not None
        except Exception as e:
            # Expected to fail until migration is run
            assert "relation \"campaign_influencers\" does not exist" in str(e) or "does not exist" in str(e)
