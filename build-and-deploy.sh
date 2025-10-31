#!/bin/bash
# Build and deploy Emergency Alerts card
# This script builds the card and copies it to both dist/ and the HA container

set -e  # Exit on error

echo "🔨 Building Emergency Alerts card..."
npm run build

echo "📦 Copying to dist folder..."
rm -f dist/emergency-alerts-card.js
cp emergency-alerts-card.js dist/

echo "🚀 Deploying to Home Assistant container..."
cp emergency-alerts-card.js ../emergency-alerts-integration/config/www/

echo "✅ Build and deploy complete!"
echo "💡 Restart Home Assistant or hard refresh your browser to see changes"
