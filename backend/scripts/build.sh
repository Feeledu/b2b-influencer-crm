#!/bin/bash
# Build script for B2B Influencer CRM API

set -e

echo "🏗️  Building B2B Influencer CRM API..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t b2b-influencer-api:latest .

echo "✅ Build completed successfully!"
echo "🐳 Image: b2b-influencer-api:latest"
echo ""
echo "To run the container:"
echo "  docker run -p 8000:8000 b2b-influencer-api:latest"
echo ""
echo "To run with docker-compose:"
echo "  docker-compose up"
