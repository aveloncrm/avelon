#!/bin/bash

# Femshopi Store Setup Script
# This script helps you set up the femshopi.localhost subdomain

echo "🌸 Femshopi Store Setup"
echo "======================="
echo ""

# Check if running with sudo for /etc/hosts
if [ "$EUID" -ne 0 ]; then 
    echo "❌ This script needs sudo access to edit /etc/hosts"
    echo "Please run: sudo ./setup-femshopi.sh"
    exit 1
fi

# Step 1: Add to /etc/hosts
echo "📝 Step 1: Updating /etc/hosts..."
if grep -q "femshopi.localhost" /etc/hosts; then
    echo "   ✅ femshopi.localhost already exists in /etc/hosts"
else
    echo "127.0.0.1   femshopi.localhost" >> /etc/hosts
    echo "   ✅ Added femshopi.localhost to /etc/hosts"
fi

# Flush DNS cache (macOS)
echo "🔄 Flushing DNS cache..."
dscacheutil -flushcache 2>/dev/null
killall -HUP mDNSResponder 2>/dev/null
echo "   ✅ DNS cache flushed"

# Step 2: Run seed script
echo ""
echo "📦 Step 2: Seeding database..."
echo "   This will create:"
echo "   - Femshopi merchant"
echo "   - Femshopi store (subdomain: femshopi)"
echo "   - 4 brands"
echo "   - 6 categories"
echo "   - 8 sample products"
echo ""

cd "$(dirname "$0")" || exit

# Check if we're in the api directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the apps/api directory?"
    exit 1
fi

# Run the seed script
tsx scripts/seed-femshopi.ts

echo ""
echo "✅ Setup complete!"
echo ""
echo "🧪 Test it:"
echo "   1. Start API: npm run dev"
echo "   2. Test: curl http://femshopi.localhost:9999/api/products"
echo "   3. Or visit in browser: http://femshopi.localhost:9999/api/products"
echo ""
