# B2B Influencer CRM API

A comprehensive FastAPI-based backend for the B2B Influencer CRM platform. This API provides authentication, database operations, and comprehensive documentation for managing B2B influencer partnerships.

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- pip (Python package manager)
- Docker (optional, for containerized deployment)

### Development Setup

1. **Clone and navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the development server:**
   ```bash
   python start_dev.py
   ```

   Or manually:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Access the API:**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc
   - Health Check: http://localhost:8000/api/v1/health

## 🏗️ Architecture

```
backend/
├── app/
│   ├── api/v1/           # API endpoints
│   ├── auth/             # Authentication modules
│   ├── database/         # Database connections
│   ├── schemas/          # Pydantic models
│   ├── config.py         # Configuration
│   └── main.py           # FastAPI application
├── tests/                # Test suite
├── scripts/              # Deployment scripts
├── Dockerfile            # Container configuration
├── docker-compose.yml    # Development environment
└── requirements.txt      # Python dependencies
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Environment
ENVIRONMENT=development
LOG_LEVEL=INFO

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# JWT Configuration
JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://app.b2binfluencer.com
```

### Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `ENVIRONMENT` | Environment name | `development` |
| `LOG_LEVEL` | Logging level | `INFO` |
| `SUPABASE_URL` | Supabase project URL | - |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | - |
| `SUPABASE_SERVICE_KEY` | Supabase service key | - |
| `JWT_SECRET_KEY` | JWT signing key | - |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry | `30` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |

## 📚 API Endpoints

### Health & Status
- `GET /` - API information
- `GET /api/v1/health` - Health check
- `GET /api/v1/test-db` - Database test

### Authentication
- `GET /api/v1/auth/me` - Get current user profile
- `GET /api/v1/auth/me/detailed` - Get detailed user profile
- `GET /api/v1/auth/permissions` - Get user permissions
- `GET /api/v1/auth/status` - Get auth service status

### Documentation
- `GET /docs` - Swagger UI
- `GET /redoc` - ReDoc documentation
- `GET /api/v1/openapi.json` - OpenAPI schema

## 🧪 Testing

### Run All Tests
```bash
python -m pytest tests/ -v
```

### Run Specific Test Categories
```bash
# Integration tests
python -m pytest tests/test_integration.py -v

# API documentation tests
python -m pytest tests/test_api_documentation.py -v

# Authentication tests
python -m pytest tests/test_auth.py -v

# Database tests
python -m pytest tests/test_supabase.py -v
```

### Test Coverage
```bash
python -m pytest tests/ --cov=app --cov-report=html
```

## 🐳 Docker Deployment

### Development
```bash
# Build and run with docker-compose
docker-compose up --build

# Or build and run manually
docker build -t b2b-influencer-api .
docker run -p 8000:8000 b2b-influencer-api
```

### Production
```bash
# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d --build
```

### Using Deployment Scripts
```bash
# Build the application
./scripts/build.sh

# Deploy to production
./scripts/deploy.sh
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **CORS Protection** - Configurable cross-origin resource sharing
- **Input Validation** - Pydantic model validation
- **Error Handling** - Comprehensive error responses
- **Rate Limiting** - Built-in rate limiting (configurable)
- **Security Headers** - Proper security headers

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```bash
curl http://localhost:8000/api/v1/health
```

### Database Health
```bash
curl http://localhost:8000/api/v1/test-db
```

### Docker Health Check
The Docker container includes a health check that monitors the API endpoint.

## 🚀 Development Workflow

### Using the Development Server
```bash
# Start with auto-reload
python start_dev.py

# Start with specific port
python start_dev.py --port 8080

# Start without auto-reload
python start_dev.py --no-reload

# Run tests before starting
python start_dev.py --test

# Run tests only
python start_dev.py --test-only
```

### Code Quality
```bash
# Format code
black app/ tests/

# Lint code
flake8 app/ tests/

# Type checking
mypy app/
```

## 📈 Performance

### Production Optimizations
- **Async/Await** - Non-blocking I/O operations
- **Connection Pooling** - Efficient database connections
- **Caching** - Redis integration for caching
- **Compression** - Gzip compression for responses
- **Rate Limiting** - Prevent abuse and ensure fair usage

### Monitoring
- **Health Checks** - Built-in health monitoring
- **Logging** - Structured logging with configurable levels
- **Metrics** - Performance metrics collection
- **Error Tracking** - Comprehensive error reporting

## 🔧 Troubleshooting

### Common Issues

1. **Import Errors**
   ```bash
   # Ensure you're in the backend directory
   cd backend
   export PYTHONPATH=$PWD
   ```

2. **Database Connection Issues**
   - Check Supabase credentials in `.env`
   - Verify network connectivity
   - Check Supabase project status

3. **Port Already in Use**
   ```bash
   # Use a different port
   python start_dev.py --port 8080
   ```

4. **Docker Issues**
   ```bash
   # Clean up Docker resources
   docker system prune -a
   docker-compose down -v
   ```

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
python start_dev.py
```

## 📝 API Documentation

The API includes comprehensive documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/api/v1/openapi.json

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation at http://localhost:8000/docs

---

**Built with ❤️ using FastAPI, Pydantic, and Supabase**