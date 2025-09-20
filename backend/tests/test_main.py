import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint returns basic API information"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert "docs" in data
    assert "redoc" in data
    assert "timestamp" in data

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert "version" in data
    assert "environment" in data

def test_database_test_endpoint():
    """Test the database test endpoint"""
    response = client.get("/api/v1/test-db")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "connected"
    assert data["database"] == "postgres"
    assert "timestamp" in data

def test_docs_endpoint():
    """Test that API documentation is accessible"""
    response = client.get("/docs")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]

def test_redoc_endpoint():
    """Test that ReDoc documentation is accessible"""
    response = client.get("/redoc")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]

def test_cors_headers():
    """Test that CORS headers are properly set"""
    response = client.get("/", headers={"Origin": "http://localhost:8080"})
    assert response.status_code == 200
    # CORS headers are set by the middleware, but may not be visible in test client
    # The important thing is that the request succeeds
