from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.utils import get_openapi
from datetime import datetime
import logging

from app.config import settings
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.influencers import router as influencers_router
from app.api.v1.interactions import router as interactions_router
from app.api.v1.campaigns import router as campaigns_router
from app.api.v1.admin import router as admin_router
from app.api.v1.intent import router as intent_router
from app.api.ai.generate_message import router as ai_router
from app.auth.middleware import auth_middleware

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="B2B Influencer CRM API",
    description="""
    ## B2B Influencer CRM API
    
    A comprehensive API for discovering, managing, and measuring B2B influencer partnerships.
    
    ### Features
    - **Influencer Discovery**: Find and filter B2B influencers across LinkedIn, podcasts, and newsletters
    - **Relationship Management**: Track interactions, notes, and campaign history
    - **ROI Measurement**: Measure the impact of influencer partnerships on leads, pipeline, and revenue
    - **User Authentication**: Secure JWT-based authentication with Supabase
    - **Real-time Analytics**: Track campaign performance and attribution
    
    ### Authentication
    Most endpoints require authentication. Include your JWT token in the Authorization header:
    ```
    Authorization: Bearer <your-jwt-token>
    ```
    
    ### Rate Limiting
    API requests are rate limited to ensure fair usage. Rate limit headers are included in responses.
    
    ### Support
    For support and questions, contact our team at support@b2binfluencer.com
    """,
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    contact={
        "name": "B2B Influencer CRM Team",
        "email": "support@b2binfluencer.com",
        "url": "https://b2binfluencer.com/support"
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT"
    },
    servers=[
        {
            "url": "http://localhost:8000",
            "description": "Development server"
        },
        {
            "url": "https://api.b2binfluencer.com",
            "description": "Production server"
        }
    ]
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "X-Refresh-Token",
        "X-API-Key"
    ],
    expose_headers=[
        "X-User-ID",
        "X-User-Email",
        "X-Rate-Limit-Limit",
        "X-Rate-Limit-Remaining",
        "X-Rate-Limit-Reset"
    ]
)

# Add authentication middleware
app.middleware("http")(auth_middleware)

# Include routers
app.include_router(health_router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(influencers_router, prefix=f"{settings.API_V1_STR}/influencers", tags=["Influencers"])
app.include_router(interactions_router, prefix=f"{settings.API_V1_STR}/interactions", tags=["Interactions"])
app.include_router(campaigns_router, prefix=f"{settings.API_V1_STR}/campaigns", tags=["Campaigns"])
app.include_router(admin_router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin"])
app.include_router(intent_router, prefix=f"{settings.API_V1_STR}/intent", tags=["Intent Analysis"])
app.include_router(ai_router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI"])

def custom_openapi():
    """
    Custom OpenAPI schema with additional metadata
    """
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    
    # Add custom metadata
    openapi_schema["info"]["x-logo"] = {
        "url": "https://b2binfluencer.com/logo.png"
    }
    
    # Add security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT token"
        }
    }
    
    # Add global security
    openapi_schema["security"] = [{"BearerAuth": []}]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

@app.get("/", 
         summary="API Information",
         description="Get basic API information and available endpoints",
         response_description="API information and available endpoints",
         tags=["Health"])
async def root():
    """Root endpoint with basic API information"""
    return JSONResponse(
        content={
            "message": "Welcome to B2B Influencer CRM API",
            "version": "1.0.0",
            "environment": settings.ENVIRONMENT,
            "timestamp": datetime.utcnow().isoformat(),
            "docs_url": "/docs",
            "redoc_url": "/redoc",
            "openapi_url": "/api/v1/openapi.json",
            "health_check": "/api/v1/health",
            "endpoints": [
                "/api/v1/health",
                "/api/v1/test-db",
                "/api/v1/auth/me",
                "/api/v1/auth/status",
                "/api/v1/auth/permissions"
            ]
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
