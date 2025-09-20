#!/bin/bash

# Setup Environment Variables for B2B Influencer CRM

echo "Setting up environment variables..."

# Create frontend .env file
cat > .env << 'EOF'
# Frontend Environment Variables
VITE_SUPABASE_URL=your-supabase-url-here
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
VITE_API_URL=http://localhost:8000/api/v1
EOF

# Create backend .env file
cat > backend/.env << 'EOF'
# Backend Environment Variables
SUPABASE_URL=your-supabase-url-here
SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_KEY=your-supabase-service-key-here
SUPABASE_HOST=db.your-project-id.supabase.co
SUPABASE_PORT=5432
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=your-database-password-here
JWT_SECRET_KEY=your-jwt-secret-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://app.b2binfluencer.com
ENVIRONMENT=development
LOG_LEVEL=INFO
EOF

echo "Environment files created!"
echo "Please update the .env files with your actual Supabase credentials."
echo ""
echo "To get your Supabase credentials:"
echo "1. Go to https://supabase.com"
echo "2. Create a new project or select existing one"
echo "3. Go to Settings > API"
echo "4. Copy the URL and anon key"
echo "5. Update both .env files with your credentials"
