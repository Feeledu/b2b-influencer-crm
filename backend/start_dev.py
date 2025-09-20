#!/usr/bin/env python3
"""
Development server startup script for B2B Influencer CRM API.
Provides easy startup with proper configuration and environment setup.
"""
import os
import sys
import subprocess
import argparse
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 11):
        print("❌ Error: Python 3.11 or higher is required")
        print(f"Current version: {sys.version}")
        sys.exit(1)
    print(f"✅ Python version: {sys.version.split()[0]}")

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        import pydantic
        print("✅ Core dependencies are installed")
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        sys.exit(1)

def setup_environment():
    """Set up environment variables for development"""
    env_file = Path(".env")
    if not env_file.exists():
        print("📝 Creating .env file for development...")
        env_content = """# Development Environment Configuration
ENVIRONMENT=development
LOG_LEVEL=INFO

# Supabase Configuration (optional for development)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# JWT Configuration
JWT_SECRET_KEY=dev-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://app.b2binfluencer.com

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=B2B Influencer CRM API
VERSION=1.0.0
"""
        env_file.write_text(env_content)
        print("✅ .env file created")
    else:
        print("✅ .env file exists")

def run_tests():
    """Run tests to ensure everything is working"""
    print("🧪 Running tests...")
    try:
        result = subprocess.run([
            sys.executable, "-m", "pytest", "tests/", 
            "--ignore=tests/test_protected_routes.py", "-v"
        ], capture_output=True, text=True, cwd=Path.cwd())
        
        if result.returncode == 0:
            print("✅ All tests passed")
            return True
        else:
            print("⚠️  Some tests failed:")
            print(result.stdout)
            print(result.stderr)
            return False
    except Exception as e:
        print(f"❌ Error running tests: {e}")
        return False

def start_server(host="0.0.0.0", port=8000, reload=True, workers=1):
    """Start the development server"""
    print(f"🚀 Starting development server on {host}:{port}")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("📖 ReDoc Documentation: http://localhost:8000/redoc")
    print("🔍 Health Check: http://localhost:8000/api/v1/health")
    print("🛑 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    cmd = [
        sys.executable, "-m", "uvicorn",
        "app.main:app",
        "--host", host,
        "--port", str(port),
        "--workers", str(workers)
    ]
    
    if reload:
        cmd.append("--reload")
    
    try:
        subprocess.run(cmd, cwd=Path.cwd())
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="B2B Influencer CRM API Development Server")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to (default: 8000)")
    parser.add_argument("--no-reload", action="store_true", help="Disable auto-reload")
    parser.add_argument("--workers", type=int, default=1, help="Number of worker processes")
    parser.add_argument("--test", action="store_true", help="Run tests before starting server")
    parser.add_argument("--test-only", action="store_true", help="Run tests only and exit")
    
    args = parser.parse_args()
    
    print("🎯 B2B Influencer CRM API - Development Server")
    print("=" * 50)
    
    # Check requirements
    check_python_version()
    check_dependencies()
    setup_environment()
    
    # Run tests if requested
    if args.test or args.test_only:
        if not run_tests():
            if args.test_only:
                sys.exit(1)
            print("⚠️  Continuing despite test failures...")
    
    if args.test_only:
        print("✅ Tests completed")
        sys.exit(0)
    
    # Start server
    start_server(
        host=args.host,
        port=args.port,
        reload=not args.no_reload,
        workers=args.workers
    )

if __name__ == "__main__":
    main()
