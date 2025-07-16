#!/bin/bash

# Development script for testing Emergency Alerts Card with Home Assistant
# This script builds the card and deploys it to the HA devcontainer

set -e

echo "🎨 Emergency Alerts Card → Home Assistant Development"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${2}${1}${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "src/emergency-alerts-card.ts" ]; then
    print_status "❌ Please run this script from the lovelace-emergency-alerts-card directory" "$RED"
    exit 1
fi

# Check if emergency_alerts directory exists
if [ ! -d "../emergency_alerts" ]; then
    print_status "❌ emergency_alerts directory not found. Please run from the correct location." "$RED"
    exit 1
fi

# Ensure www directory exists
mkdir -p ../emergency_alerts/config/www

print_status "🏗️  Building Emergency Alerts Card..." "$YELLOW"
npm run build

if [ $? -eq 0 ]; then
    print_status "✅ Build successful!" "$GREEN"
else
    print_status "❌ Build failed!" "$RED"
    exit 1
fi

print_status "📦 Deploying to Home Assistant..." "$YELLOW"
npm run deploy

if [ $? -eq 0 ]; then
    print_status "✅ Deployed successfully!" "$GREEN"
else
    print_status "❌ Deploy failed!" "$RED"
    exit 1
fi

print_status "🎉 Card deployed to Home Assistant!" "$GREEN"
print_status "📍 Location: emergency_alerts/config/www/emergency-alerts-card.js" "$BLUE"
print_status "" ""
print_status "Next steps:" "$YELLOW"
print_status "1. Start your Home Assistant devcontainer" "$BLUE"
print_status "2. Add resource: /local/emergency-alerts-card.js (JavaScript Module)" "$BLUE"
print_status "3. Add card to dashboard with type: custom:emergency-alerts-card" "$BLUE"
print_status "" ""
print_status "For continuous development, use: npm run dev" "$YELLOW" 