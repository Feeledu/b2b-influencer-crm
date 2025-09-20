#!/bin/bash

# Run Database Migrations Script
# Run this after updating Supabase credentials

echo "🗄️  Running database migrations..."

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo "❌ Backend .env file not found. Please run ./update-supabase-credentials.sh first"
    exit 1
fi

# Load environment variables
export $(cat backend/.env | grep -v '^#' | xargs)

# Check if required environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "❌ Supabase credentials not found in backend/.env"
    echo "Please run ./update-supabase-credentials.sh first"
    exit 1
fi

echo "📊 Running migrations..."

# Run the migration script
cd backend
python scripts/run_migrations.py

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migrations completed successfully!"
    echo ""
    echo "📋 Database tables created:"
    echo "   - users"
    echo "   - influencers" 
    echo "   - user_influencers"
    echo "   - campaigns"
    echo "   - campaign_influencers"
    echo "   - interactions"
    echo "   - pipeline_attribution"
    echo "   - campaign_outcomes"
    echo ""
    echo "🔄 Next steps:"
    echo "   1. Restart your backend server"
    echo "   2. Test the API endpoints"
    echo "   3. Populate with sample data"
else
    echo "❌ Migration failed. Please check the error messages above."
    exit 1
fi
