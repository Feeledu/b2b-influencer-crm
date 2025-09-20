#!/bin/bash

# Update Supabase Credentials with the provided information
echo "🔧 Updating Supabase credentials..."

# Project details from the images
PROJECT_URL="https://ahrmmjceerzgytuczakn.supabase.co"
PROJECT_ID="ahrmmjceerzgytuczakn"
SUPABASE_PASSWORD="1O4e05qs!@"

# Generate JWT secret key
JWT_SECRET_KEY=$(openssl rand -base64 32)

echo "📝 Please provide the complete API keys:"
echo ""

# Get complete anon key
read -p "Enter the complete anon public key (click Copy button in Supabase): " SUPABASE_ANON_KEY

# Get complete service role key  
read -p "Enter the complete service_role key (click Copy button in Supabase): " SUPABASE_SERVICE_KEY

echo ""
echo "🔄 Updating frontend .env file..."

# Update frontend .env
cat > .env << EOF
# Frontend Environment Variables
VITE_SUPABASE_URL=${PROJECT_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
VITE_API_URL=http://localhost:8000/api/v1
EOF

echo "🔄 Updating backend .env file..."

# Update backend .env
cat > backend/.env << EOF
# Backend Environment Variables
SUPABASE_URL=${PROJECT_URL}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
SUPABASE_HOST=db.${PROJECT_ID}.supabase.co
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
echo "   Project URL: ${PROJECT_URL}"
echo "   Project ID: ${PROJECT_ID}"
echo "   Database Host: db.${PROJECT_ID}.supabase.co"
echo "   Frontend .env: Updated"
echo "   Backend .env: Updated"
echo ""
echo "🔄 Next steps:"
echo "   1. Restart your backend server (Ctrl+C and run again)"
echo "   2. Restart your frontend server (Ctrl+C and run again)"
echo "   3. Test the connection"
echo ""
echo "🚀 Ready to test!"
