#!/bin/bash
# Deployment script for B2B Influencer CRM API

set -e

echo "🚀 Deploying B2B Influencer CRM API..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one with production configuration."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Pull latest images
echo "📥 Pulling latest images..."
docker-compose -f docker-compose.prod.yml pull

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check health
echo "🔍 Checking service health..."
if curl -f http://localhost:8000/api/v1/health > /dev/null 2>&1; then
    echo "✅ API is healthy and responding"
else
    echo "❌ API health check failed"
    echo "📋 Container logs:"
    docker-compose -f docker-compose.prod.yml logs api
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "🌐 API is available at: http://localhost:8000"
echo "📚 Documentation: http://localhost:8000/docs"
echo ""
echo "To view logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose -f docker-compose.prod.yml down"
