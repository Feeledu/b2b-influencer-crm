# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-01-14-backend-api-setup/spec.md

## Endpoints

### GET /health

**Purpose:** Health check endpoint for monitoring and load balancer health checks
**Parameters:** None
**Response:** 
```json
{
  "status": "healthy",
  "timestamp": "2025-01-14T10:30:00Z",
  "version": "1.0.0"
}
```
**Errors:** 
- 500 Internal Server Error if database connection fails

### GET /docs

**Purpose:** Interactive API documentation (Swagger UI)
**Parameters:** None
**Response:** HTML page with Swagger UI interface
**Errors:** None

### GET /redoc

**Purpose:** Alternative API documentation (ReDoc)
**Parameters:** None
**Response:** HTML page with ReDoc interface
**Errors:** None

### GET /api/v1/test-db

**Purpose:** Test database connection and basic operations
**Parameters:** None
**Response:**
```json
{
  "status": "connected",
  "database": "postgres",
  "timestamp": "2025-01-14T10:30:00Z"
}
```
**Errors:**
- 500 Internal Server Error if database connection fails
- 503 Service Unavailable if Supabase is unreachable

### GET /api/v1/auth/me

**Purpose:** Get current user information from JWT token
**Parameters:** 
- Authorization header with Bearer token
**Response:**
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "created_at": "2025-01-14T10:30:00Z"
}
```
**Errors:**
- 401 Unauthorized if token is invalid or missing
- 403 Forbidden if token is expired

## Controllers

### HealthController
- **health_check()** - Returns system health status
- **test_database()** - Tests database connectivity

### AuthController  
- **get_current_user()** - Validates JWT and returns user info
- **validate_token()** - Middleware for token validation

## Purpose

These endpoints provide the foundational API infrastructure for the B2B Influencer CRM platform. The health check ensures system monitoring, database test validates Supabase connectivity, and auth endpoints enable user authentication for protected features. The documentation endpoints provide developer-friendly API exploration tools.
