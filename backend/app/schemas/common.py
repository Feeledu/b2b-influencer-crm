"""
Common API schemas and base models.
Provides shared Pydantic models for API responses and common data structures.
"""
from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

class BaseResponse(BaseModel):
    """Base response model for all API endpoints"""
    success: bool = Field(default=True, description="Indicates if the operation was successful")
    message: str = Field(description="Response message")

class SuccessResponse(BaseResponse):
    """Standard success response model"""
    success: bool = Field(default=True, description="Indicates if the operation was successful")
    message: str = Field(description="Success message")
    data: Optional[Dict[str, Any]] = Field(default=None, description="Response data")

class ErrorResponse(BaseResponse):
    """Standard error response model"""
    success: bool = Field(default=False, description="Indicates if the operation was successful")
    error: str = Field(description="Error type")
    detail: str = Field(description="Error detail message")
    path: Optional[str] = Field(default=None, description="API path where error occurred")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")

class HealthResponse(BaseResponse):
    """Health check response model"""
    status: str = Field(description="Service status")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Check timestamp")
    version: str = Field(description="API version")
    environment: str = Field(description="Environment name")
    database: Optional[Dict[str, Any]] = Field(default=None, description="Database status")

class DatabaseStatus(BaseResponse):
    """Database status information"""
    connected: bool = Field(description="Database connection status")
    status: str = Field(description="Database health status")
    response_time_ms: Optional[float] = Field(default=None, description="Database response time in milliseconds")
    connection_info: Optional[Dict[str, Any]] = Field(default=None, description="Database connection information")

class PaginationParams(BaseModel):
    """Pagination parameters for list endpoints"""
    page: int = Field(default=1, ge=1, description="Page number")
    size: int = Field(default=20, ge=1, le=100, description="Number of items per page")
    sort_by: Optional[str] = Field(default=None, description="Field to sort by")
    sort_order: str = Field(default="asc", pattern="^(asc|desc)$", description="Sort order")

class PaginatedResponse(BaseResponse):
    """Paginated response model"""
    data: List[Dict[str, Any]] = Field(description="List of items")
    total: int = Field(description="Total number of items")
    page: int = Field(description="Current page number")
    limit: int = Field(description="Number of items per page")
    total_pages: int = Field(description="Total number of pages")
    has_next: bool = Field(description="Whether there is a next page")
    has_prev: bool = Field(description="Whether there is a previous page")

class APIInfo(BaseResponse):
    """API information model"""
    name: str = Field(description="API name")
    version: str = Field(description="API version")
    description: str = Field(description="API description")
    environment: str = Field(description="Environment name")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="API info timestamp")
    endpoints: List[str] = Field(description="Available API endpoints")
    documentation_url: str = Field(description="API documentation URL")

class ValidationErrorDetail(BaseModel):
    """Validation error detail model"""
    field: str = Field(description="Field that failed validation")
    message: str = Field(description="Validation error message")
    value: Any = Field(description="Value that failed validation")

class ValidationErrorResponse(ErrorResponse):
    """Validation error response model"""
    errors: List[ValidationErrorDetail] = Field(description="List of validation errors")

class RateLimitResponse(ErrorResponse):
    """Rate limit error response model"""
    retry_after: int = Field(description="Seconds to wait before retrying")
    limit: int = Field(description="Rate limit per time window")
    remaining: int = Field(description="Remaining requests in current window")
    reset_time: datetime = Field(description="Time when the rate limit resets")
