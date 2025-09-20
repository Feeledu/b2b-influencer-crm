#!/bin/bash

# Update Supabase Credentials Script
# Run this script after getting your Supabase credentials

echo "🔧 Updating Supabase credentials..."

# Check if .env files exist
if [ ! -f ".env" ]; then
    echo "❌ Frontend .env file not found. Please run ./setup-env.sh first"
    exit 1
fi

if [ ! -f "backend/.env" ]; then
    echo "❌ Backend .env file not found. Please run ./setup-env.sh first"
    exit 1
fi

echo "📝 Please enter your Supabase credentials:"
echo ""

# Get Supabase URL
read -p "Enter your Supabase URL (https://your-project-id.supabase.co): " SUPABASE_URL

# Get Supabase Anon Key
read -p "Enter your Supabase Anon Key: " SUPABASE_ANON_KEY

# Get Supabase Service Key
read -p "Enter your Supabase Service Key: " SUPABASE_SERVICE_KEY

# Get Database Password
read -p "Enter your Database Password: " SUPABASE_PASSWORD

# Extract project ID from URL for database host
PROJECT_ID=$(echo $SUPABASE_URL | sed 's/https:\/\/\(.*\)\.supabase\.co/\1/')
SUPABASE_HOST="db.${PROJECT_ID}.supabase.co"

# Generate a JWT secret key
JWT_SECRET_KEY=$(openssl rand -base64 32)

echo ""
echo "🔄 Updating frontend .env file..."

# Update frontend .env
cat > .env << EOF
# Frontend Environment Variables
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
VITE_API_URL=http://localhost:8000/api/v1
EOF

echo "🔄 Updating backend .env file..."

# Update backend .env
cat > backend/.env << EOF
# Backend Environment Variables
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
SUPABASE_HOST=${SUPABASE_HOST}
SUPABASE_PORT=5432
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=${SUPABASE_PASSWORD}
JWT_SECRET_KEY=${JWT_SECRET_KEY}
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8080,http://localhost:8081,https://app.b2binfluencer.com
ENVIRONMENT=development
LOG_LEVEL=INFO
EOF

echo ""
echo "✅ Credentials updated successfully!"
echo ""
echo "📋 Summary:"
echo "   Frontend .env: Updated"
echo "   Backend .env: Updated"
echo "   Project ID: ${PROJECT_ID}"
echo "   Database Host: ${SUPABASE_HOST}"
echo ""
echo "🔄 Next steps:"
echo "   1. Restart your backend server (Ctrl+C and run again)"
echo "   2. Restart your frontend server (Ctrl+C and run again)"
echo "   3. Run database migrations"
echo ""
echo "🚀 Ready to continue!"
