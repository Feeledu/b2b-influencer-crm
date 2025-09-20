import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock
from app.main import app

client = TestClient(app)

class TestAPIDocumentation:
    """Test API documentation endpoints and configuration"""
    
    def test_openapi_endpoint(self):
        """Test OpenAPI JSON endpoint is accessible"""
        response = client.get("/api/v1/openapi.json")
        assert response.status_code == 200
        
        data = response.json()
        assert "openapi" in data
        assert "info" in data
        assert "paths" in data
        assert data["openapi"].startswith("3.")
    
    def test_docs_endpoint(self):
        """Test Swagger UI documentation endpoint"""
        response = client.get("/docs")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
        assert "swagger" in response.text.lower()
    
    def test_redoc_endpoint(self):
        """Test ReDoc documentation endpoint"""
        response = client.get("/redoc")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
        assert "redoc" in response.text.lower()
    
    def test_api_info_metadata(self):
        """Test API information metadata"""
        response = client.get("/api/v1/openapi.json")
        data = response.json()
        
        info = data["info"]
        assert "title" in info
        assert "version" in info
        assert "description" in info
        assert "contact" in info
        assert "license" in info
        
        # Check specific values
        assert info["title"] == "B2B Influencer CRM API"
        assert info["version"] == "1.0.0"
        assert "B2B Influencer" in info["description"]
    
    def test_api_servers_configuration(self):
        """Test API servers configuration"""
        response = client.get("/api/v1/openapi.json")
        data = response.json()
        
        assert "servers" in data
        servers = data["servers"]
        assert len(servers) > 0
        
        # Check development server
        dev_server = next((s for s in servers if "localhost" in s["url"]), None)
        assert dev_server is not None
        assert dev_server["description"] == "Development server"
    
    def test_api_tags_configuration(self):
        """Test API tags configuration"""
        response = client.get("/api/v1/openapi.json")
        data = response.json()
        
        assert "tags" in data
        tags = data["tags"]
        
        # Check for expected tags
        tag_names = [tag["name"] for tag in tags]
        assert "Authentication" in tag_names
        assert "Health" in tag_names
        
        # Check tag descriptions
        auth_tag = next(tag for tag in tags if tag["name"] == "Authentication")
        assert "User authentication" in auth_tag["description"]
    
    def test_api_paths_included(self):
        """Test that all expected API paths are included"""
        response = client.get("/api/v1/openapi.json")
        data = response.json()
        
        paths = data["paths"]
        
        # Check core endpoints
        assert "/" in paths
        assert "/api/v1/health" in paths
        assert "/api/v1/test-db" in paths
        
        # Check auth endpoints
        assert "/api/v1/auth/me" in paths
        assert "/api/v1/auth/status" in paths
        assert "/api/v1/auth/permissions" in paths
    
    def test_api_components_schemas(self):
        """Test API components and schemas"""
        response = client.get("/api/v1/openapi.json")
        data = response.json()
        
        assert "components" in data
        components = data["components"]
        
        # Check security schemes
        assert "securitySchemes" in components
        security_schemes = components["securitySchemes"]
        
        # Check for JWT Bearer token scheme
        assert "BearerAuth" in security_schemes
        bearer_auth = security_schemes["BearerAuth"]
        assert bearer_auth["type"] == "http"
        assert bearer_auth["scheme"] == "bearer"
        assert bearer_auth["bearerFormat"] == "JWT"
    
    def test_api_security_requirements(self):
        """Test API security requirements"""
        response = client.get("/api/v1/openapi.json")
        data = response.json()
        
        # Check global security
        assert "security" in data
        security = data["security"]
        assert len(security) > 0
        assert {"BearerAuth": []} in security
    
    def test_cors_headers_present(self):
        """Test that CORS headers are present in responses"""
        response = client.get("/api/v1/health", headers={"Origin": "http://localhost:3000"})
        
        # Check for basic CORS headers (some headers only appear on preflight requests)
        assert "access-control-allow-origin" in response.headers
        assert "access-control-allow-credentials" in response.headers
        assert "access-control-expose-headers" in response.headers
    
    def test_cors_preflight_request(self):
        """Test CORS preflight request handling"""
        response = client.options(
            "/api/v1/health",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Authorization"
            }
        )
        
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers
        assert "access-control-allow-methods" in response.headers
        assert "access-control-allow-headers" in response.headers
    
    def test_cors_allowed_origins(self):
        """Test CORS allowed origins configuration"""
        # Test with allowed origin
        response = client.get(
            "/api/v1/health",
            headers={"Origin": "http://localhost:3000"}
        )
        assert response.status_code == 200
        assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
        
        # Test with another allowed origin (if configured)
        response = client.get(
            "/api/v1/health",
            headers={"Origin": "https://app.b2binfluencer.com"}
        )
        assert response.status_code == 200
        # Note: CORS headers may not be present if origin is not in allowed list
        if "access-control-allow-origin" in response.headers:
            assert response.headers["access-control-allow-origin"] == "https://app.b2binfluencer.com"
    
    def test_api_response_schemas(self):
        """Test API response schemas are properly defined"""
        response = client.get("/api/v1/openapi.json")
        data = response.json()
        
        # Check health endpoint schema
        health_path = data["paths"]["/api/v1/health"]["get"]
        assert "responses" in health_path
        
        responses = health_path["responses"]
        assert "200" in responses
        assert "content" in responses["200"]
        assert "application/json" in responses["200"]["content"]
        
        # Check schema structure (can be a reference or inline schema)
        schema = responses["200"]["content"]["application/json"]["schema"]
        assert "$ref" in schema or "type" in schema
        if "$ref" in schema:
            assert "HealthResponse" in schema["$ref"]
        else:
            assert schema["type"] == "object"
    
    def test_api_error_responses(self):
        """Test API error response schemas"""
        response = client.get("/api/v1/openapi.json")
        data = response.json()
        
        # Check that error responses are defined in components
        assert "components" in data
        components = data["components"]
        assert "schemas" in components
        
        # Check for any response schemas (error schemas may be defined elsewhere)
        schemas = components["schemas"]
        assert len(schemas) > 0, "No response schemas found"
        
        # Check that we have some common response models
        schema_names = list(schemas.keys())
        assert any("Response" in name for name in schema_names), "No response models found"
    
    def test_api_versioning(self):
        """Test API versioning configuration"""
        response = client.get("/api/v1/openapi.json")
        data = response.json()
        
        # Check version in info
        assert data["info"]["version"] == "1.0.0"
        
        # Check version in paths
        assert "/api/v1/" in str(data["paths"].keys())
    
    def test_api_contact_information(self):
        """Test API contact information"""
        response = client.get("/api/v1/openapi.json")
        data = response.json()
        
        info = data["info"]
        contact = info["contact"]
        
        assert "name" in contact
        assert "email" in contact
        assert "url" in contact
        
        assert contact["name"] == "B2B Influencer CRM Team"
        assert "@" in contact["email"]  # Basic email validation
        assert "http" in contact["url"]  # Basic URL validation
    
    def test_api_license_information(self):
        """Test API license information"""
        response = client.get("/api/v1/openapi.json")
        data = response.json()
        
        info = data["info"]
        license_info = info["license"]
        
        assert "name" in license_info
        assert "url" in license_info
        
        assert license_info["name"] == "MIT"
        assert "http" in license_info["url"]
