#!/bin/bash

echo "🤖 Setting up OpenAI Integration for Fluencr"
echo "============================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one first."
    exit 1
fi

# Check if OPENAI_API_KEY is already set
if grep -q "OPENAI_API_KEY" .env; then
    echo "✅ OPENAI_API_KEY already exists in .env"
    echo "Current value: $(grep OPENAI_API_KEY .env | cut -d'=' -f2 | cut -c1-10)..."
    read -p "Do you want to update it? (y/n): " update
    if [ "$update" != "y" ]; then
        echo "Keeping existing key."
        exit 0
    fi
fi

echo ""
echo "To get your OpenAI API key:"
echo "1. Go to https://platform.openai.com/api-keys"
echo "2. Sign in or create an account"
echo "3. Click 'Create new secret key'"
echo "4. Copy the key (it starts with 'sk-')"
echo ""

read -p "Enter your OpenAI API key: " openai_key

if [ -z "$openai_key" ]; then
    echo "❌ No API key provided. Exiting."
    exit 1
fi

# Add or update the OPENAI_API_KEY in .env
if grep -q "OPENAI_API_KEY" .env; then
    # Update existing key
    sed -i.bak "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=$openai_key/" .env
    echo "✅ Updated OPENAI_API_KEY in .env"
else
    # Add new key
    echo "OPENAI_API_KEY=$openai_key" >> .env
    echo "✅ Added OPENAI_API_KEY to .env"
fi

echo ""
echo "🎉 OpenAI integration setup complete!"
echo ""
echo "Next steps:"
echo "1. Restart your backend server: cd backend && python -m uvicorn app.main:app --reload"
echo "2. Test the AI generation in your app"
echo ""
echo "Note: The AI will fallback to template-based generation if the API key is invalid or the service is unavailable."
