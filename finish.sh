#!/bin/bash

# finish.sh - Production Build & Deployment Script
# Frontend: fe-kilex-mituni (Next.js)
# Usage: ./finish.sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting FE Production Deployment..."

# 1. Pull latest changes (Uncomment if you want to pull from git automatically)
# echo "Pulling latest changes from git..."
# git pull

# 2. Set Package Manager
PKG_MANAGER="npm"
INSTALL_CMD="npm install"     # Use 'npm ci' if you want strict lockfile adherence
BUILD_CMD="npm run build"

echo "Using package manager: $PKG_MANAGER"

# 3. Install Dependencies
echo "Installing dependencies..."
$INSTALL_CMD

# 4. Clean Cache
echo "Cleaning unnecessary caches..."
# Remove Next.js build cache to ensure fresh build
rm -rf .next/cache
# Remove node_modules cache if it exists
# rm -rf node_modules/.cache

echo "Cache cleaned."

# 5. Build Project (Next.js -> .next/)
echo "Building project..."
$BUILD_CMD

# 6. Restart All PM2 Processes
if command -v pm2 &> /dev/null; then
    echo "Restarting all PM2 processes..."
    pm2 restart all
    echo "All PM2 processes restarted."
else
    echo "PM2 not found. Skipping restart."
    echo "You can start the app manually with: pm2 start ecosystem.config.cjs"
fi

echo "FE Deployment finished successfully!"
