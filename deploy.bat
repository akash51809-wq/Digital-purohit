@echo off
echo 🚀 Starting Vercel Deployment Process...

REM Check if vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Build the project first
echo 📦 Building the project...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    
    REM Deploy to Vercel
    echo 🌐 Deploying to Vercel...
    vercel --prod
    
    echo ✅ Deployment complete!
    echo 📋 Don't forget to set these environment variables in Vercel dashboard:
    echo    - NEXTAUTH_SECRET
    echo    - NEXTAUTH_URL (your vercel domain)
    echo    - JWT_SECRET
    echo    - All Firebase variables
    echo    - All Cloudinary variables
) else (
    echo ❌ Build failed. Please fix errors before deploying.
    pause
    exit /b 1
)

pause