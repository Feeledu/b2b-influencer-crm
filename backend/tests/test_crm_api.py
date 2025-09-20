"""
Tests for CRM Workspace API endpoints.
Tests interaction management, campaign integration, and admin analytics.
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock
from app.main import app

client = TestClient(app)

class TestCRMAPI:
    """Test CRM workspace API functionality"""
    
    def setup_method(self):
        """Reset singletons before each test"""
        from app.database.supabase_client import SupabaseClient
        from app.auth.supabase_auth import SupabaseAuth
        from app.auth.jwt_handler import JWTHandler
        SupabaseClient._instance = None
        SupabaseClient._client = None
        SupabaseAuth._instance = None
        JWTHandler._instance = None
    
    def test_interactions_endpoints_require_authentication(self):
        """Test that interaction endpoints require authentication"""
        # Test create interaction without token
        response = client.post("/api/v1/interactions/", json={
            "influencer_id": "test-id",
            "type": "email",
            "subject": "Test"
        })
        assert response.status_code == 401
        
        # Test list interactions without token
        response = client.get("/api/v1/interactions/")
        assert response.status_code == 401
        
        # Test get interaction without token
        response = client.get("/api/v1/interactions/test-id")
        assert response.status_code == 401
        
        # Test update interaction without token
        response = client.put("/api/v1/interactions/test-id", json={"subject": "Updated"})
        assert response.status_code == 401
        
        # Test delete interaction without token
        response = client.delete("/api/v1/interactions/test-id")
        assert response.status_code == 401
    
    def test_campaigns_endpoints_require_authentication(self):
        """Test that campaign endpoints require authentication"""
        # Test create campaign without token
        response = client.post("/api/v1/campaigns/", json={
            "name": "Test Campaign",
            "description": "Test description"
        })
        assert response.status_code == 401
        
        # Test list campaigns without token
        response = client.get("/api/v1/campaigns/")
        assert response.status_code == 401
        
        # Test assign influencer without token
        response = client.post("/api/v1/campaigns/test-id/influencers", json={
            "influencer_id": "test-influencer-id"
        })
        assert response.status_code == 401
    
    def test_admin_endpoints_require_authentication(self):
        """Test that admin endpoints require authentication"""
        # Test get platform analytics without token
        response = client.get("/api/v1/admin/analytics")
        assert response.status_code == 401
        
        # Test list users analytics without token
        response = client.get("/api/v1/admin/users")
        assert response.status_code == 401
        
        # Test get status distribution without token
        response = client.get("/api/v1/admin/status-distribution")
        assert response.status_code == 401
    
    @patch('app.api.v1.interactions.SupabaseClient')
    def test_create_interaction_success(self, mock_supabase_class):
        """Test successful interaction creation"""
        # Mock Supabase client
        mock_client = Mock()
        mock_supabase_class.return_value = mock_client
        mock_client.get_client.return_value = mock_client
        
        # Mock influencer exists check
        mock_client.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": "test-influencer"}]
        
        # Mock interaction creation
        mock_client.table.return_value.insert.return_value.execute.return_value.data = [{
            "id": "test-interaction-id",
            "user_id": "test-user-id",
            "influencer_id": "test-influencer-id",
            "type": "email",
            "subject": "Test Subject",
            "content": "Test Content",
            "interaction_date": "2024-01-01T00:00:00",
            "created_at": "2024-01-01T00:00:00"
        }]
        
        # Mock authentication
        with patch('app.auth.dependencies.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": "test-user-id"}
            
            response = client.post("/api/v1/interactions/", json={
                "influencer_id": "test-influencer-id",
                "type": "email",
                "subject": "Test Subject",
                "content": "Test Content"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["id"] == "test-interaction-id"
            assert data["type"] == "email"
            assert data["subject"] == "Test Subject"
    
    @patch('app.api.v1.interactions.SupabaseClient')
    def test_create_interaction_influencer_not_found(self, mock_supabase_class):
        """Test interaction creation with non-existent influencer"""
        # Mock Supabase client
        mock_client = Mock()
        mock_supabase_class.return_value = mock_client
        mock_client.get_client.return_value = mock_client
        
        # Mock influencer not found
        mock_client.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
        
        # Mock authentication
        with patch('app.auth.dependencies.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": "test-user-id"}
            
            response = client.post("/api/v1/interactions/", json={
                "influencer_id": "non-existent-id",
                "type": "email",
                "subject": "Test Subject"
            })
            
            assert response.status_code == 404
            assert "Influencer not found" in response.json()["detail"]
    
    @patch('app.api.v1.campaigns.SupabaseClient')
    def test_create_campaign_success(self, mock_supabase_class):
        """Test successful campaign creation"""
        # Mock Supabase client
        mock_client = Mock()
        mock_supabase_class.return_value = mock_client
        mock_client.get_client.return_value = mock_client
        
        # Mock campaign creation
        mock_client.table.return_value.insert.return_value.execute.return_value.data = [{
            "id": "test-campaign-id",
            "user_id": "test-user-id",
            "name": "Test Campaign",
            "description": "Test description",
            "status": "planning",
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-01T00:00:00"
        }]
        
        # Mock authentication
        with patch('app.auth.dependencies.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": "test-user-id"}
            
            response = client.post("/api/v1/campaigns/", json={
                "name": "Test Campaign",
                "description": "Test description",
                "status": "planning"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["id"] == "test-campaign-id"
            assert data["name"] == "Test Campaign"
            assert data["status"] == "planning"
    
    @patch('app.api.v1.campaigns.SupabaseClient')
    def test_assign_influencer_to_campaign_success(self, mock_supabase_class):
        """Test successful influencer assignment to campaign"""
        # Mock Supabase client
        mock_client = Mock()
        mock_supabase_class.return_value = mock_client
        mock_client.get_client.return_value = mock_client
        
        # Mock campaign exists check
        mock_client.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [{"id": "test-campaign"}]
        
        # Mock influencer exists check
        mock_client.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": "test-influencer"}]
        
        # Mock assignment creation
        mock_client.table.return_value.insert.return_value.execute.return_value.data = [{
            "id": "test-assignment-id",
            "campaign_id": "test-campaign-id",
            "influencer_id": "test-influencer-id",
            "user_id": "test-user-id",
            "utm_source": "influencer",
            "utm_medium": "partnership",
            "utm_campaign": "test-campaign",
            "status": "planned",
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-01T00:00:00"
        }]
        
        # Mock authentication
        with patch('app.auth.dependencies.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": "test-user-id"}
            
            response = client.post("/api/v1/campaigns/test-campaign-id/influencers", json={
                "influencer_id": "test-influencer-id",
                "utm_source": "influencer",
                "utm_medium": "partnership",
                "utm_campaign": "test-campaign",
                "status": "planned"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["id"] == "test-assignment-id"
            assert data["campaign_id"] == "test-campaign-id"
            assert data["influencer_id"] == "test-influencer-id"
    
    @patch('app.api.v1.admin.SupabaseClient')
    def test_admin_analytics_requires_admin_role(self, mock_supabase_class):
        """Test that admin analytics requires admin role"""
        # Mock Supabase client
        mock_client = Mock()
        mock_supabase_class.return_value = mock_client
        mock_client.get_client.return_value = mock_client
        
        # Mock authentication with non-admin role
        with patch('app.auth.dependencies.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": "test-user-id", "role": "user"}
            
            response = client.get("/api/v1/admin/analytics")
            
            assert response.status_code == 403
            assert "Admin access required" in response.json()["detail"]
    
    @patch('app.api.v1.admin.SupabaseClient')
    def test_admin_analytics_success(self, mock_supabase_class):
        """Test successful admin analytics retrieval"""
        # Mock Supabase client
        mock_client = Mock()
        mock_supabase_class.return_value = mock_client
        mock_client.get_client.return_value = mock_client
        
        # Mock platform summary data
        mock_client.table.return_value.select.return_value.execute.return_value.data = [{
            "total_users": 100,
            "active_users": 80,
            "total_platform_influencers": 500,
            "total_partnered_influencers": 50,
            "total_platform_campaigns": 200,
            "total_active_campaigns": 30,
            "total_platform_interactions": 1000,
            "platform_avg_relationship_strength": 75.5,
            "total_high_quality_relationships": 25,
            "platform_last_activity": "2024-01-01T00:00:00"
        }]
        
        # Mock authentication with admin role
        with patch('app.auth.dependencies.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": "test-user-id", "role": "admin"}
            
            response = client.get("/api/v1/admin/analytics")
            
            assert response.status_code == 200
            data = response.json()
            assert data["total_users"] == 100
            assert data["active_users"] == 80
            assert data["total_platform_influencers"] == 500
    
    @patch('app.api.v1.influencers.SupabaseClient')
    def test_update_relationship_strength_success(self, mock_supabase_class):
        """Test successful relationship strength update"""
        # Mock Supabase client
        mock_client = Mock()
        mock_supabase_class.return_value = mock_client
        mock_client.get_client.return_value = mock_client
        
        # Mock relationship exists check
        mock_client.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [{"id": "test-relationship"}]
        
        # Mock update
        mock_client.table.return_value.update.return_value.eq.return_value.eq.return_value.execute.return_value.data = [{"id": "test-relationship"}]
        
        # Mock authentication
        with patch('app.auth.dependencies.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": "test-user-id"}
            
            response = client.put("/api/v1/influencers/test-influencer-id/relationship?strength=85")
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert "Relationship strength updated to 85" in data["message"]
    
    @patch('app.api.v1.influencers.SupabaseClient')
    def test_set_follow_up_date_success(self, mock_supabase_class):
        """Test successful follow-up date setting"""
        # Mock Supabase client
        mock_client = Mock()
        mock_supabase_class.return_value = mock_client
        mock_client.get_client.return_value = mock_client
        
        # Mock relationship exists check
        mock_client.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [{"id": "test-relationship"}]
        
        # Mock update
        mock_client.table.return_value.update.return_value.eq.return_value.eq.return_value.execute.return_value.data = [{"id": "test-relationship"}]
        
        # Mock authentication
        with patch('app.auth.dependencies.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": "test-user-id"}
            
            response = client.put("/api/v1/influencers/test-influencer-id/follow-up?follow_up_date=2024-01-15T10:00:00")
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert "Follow-up date set to" in data["message"]
    
    def test_invalid_interaction_type(self):
        """Test interaction creation with invalid type"""
        with patch('app.auth.dependencies.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": "test-user-id"}
            
            response = client.post("/api/v1/interactions/", json={
                "influencer_id": "test-influencer-id",
                "type": "invalid_type",
                "subject": "Test Subject"
            })
            
            assert response.status_code == 422  # Validation error
    
    def test_invalid_campaign_status(self):
        """Test campaign creation with invalid status"""
        with patch('app.auth.dependencies.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": "test-user-id"}
            
            response = client.post("/api/v1/campaigns/", json={
                "name": "Test Campaign",
                "status": "invalid_status"
            })
            
            assert response.status_code == 422  # Validation error
    
    def test_relationship_strength_validation(self):
        """Test relationship strength validation"""
        with patch('app.auth.dependencies.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": "test-user-id"}
            
            # Test strength too high
            response = client.put("/api/v1/influencers/test-influencer-id/relationship?strength=150")
            assert response.status_code == 422  # Validation error
            
            # Test strength too low
            response = client.put("/api/v1/influencers/test-influencer-id/relationship?strength=-10")
            assert response.status_code == 422  # Validation error
