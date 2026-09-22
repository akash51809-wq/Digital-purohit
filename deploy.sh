#!/bin/bash

echo "🚀 Starting Vercel Deployment Process..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the project first
echo "📦 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    
    echo "✅ Deployment complete!"
    echo "📋 Don't forget to set these environment variables in Vercel dashboard:"
    echo "   - NEXTAUTH_SECRET"
    echo "   - NEXTAUTH_URL (your vercel domain)"
    echo "   - JWT_SECRET"
    echo "   - All Firebase variables"
    echo "   - All Cloudinary variables"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi