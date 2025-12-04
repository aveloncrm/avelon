#!/bin/bash

# Femshopi Verification Script
# Tests if femshopi.localhost is properly configured

echo "🔍 Femshopi Store Verification"
echo "=============================="
echo ""

# Test 1: Check /etc/hosts
echo "1️⃣  Checking /etc/hosts..."
if grep -q "femshopi.localhost" /etc/hosts; then
    echo "   ✅ femshopi.localhost found in /etc/hosts"
else
    echo "   ❌ femshopi.localhost NOT found in /etc/hosts"
    echo "      Run: sudo ./scripts/setup-femshopi.sh"
    exit 1
fi

# Test 2: Check DNS resolution
echo ""
echo "2️⃣  Checking DNS resolution..."
if ping -c 1 femshopi.localhost &> /dev/null; then
    echo "   ✅ femshopi.localhost resolves to 127.0.0.1"
else
    echo "   ⚠️  DNS resolution test failed (this is sometimes expected)"
fi

# Test 3: Check if API is running
echo ""
echo "3️⃣  Checking if API is running..."
if curl -s http://localhost:9999/api/internal/resolve-store?host=femshopi.localhost &> /dev/null; then
    echo "   ✅ API is running on port 9999"
    
    # Test 4: Check store resolution
    echo ""
    echo "4️⃣  Testing store resolution..."
    RESULT=$(curl -s http://localhost:9999/api/internal/resolve-store?host=femshopi.localhost)
    STORE_ID=$(echo $RESULT | grep -o '"storeId":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$STORE_ID" ] && [ "$STORE_ID" != "null" ]; then
        echo "   ✅ Store resolved successfully"
        echo "      Store ID: $STORE_ID"
        
        # Test 5: Check products
        echo ""
        echo "5️⃣  Fetching products..."
        PRODUCTS=$(curl -s http://femshopi.localhost:9999/api/products)
        PRODUCT_COUNT=$(echo $PRODUCTS | grep -o '"id"' | wc -l | xargs)
        
        if [ "$PRODUCT_COUNT" -gt 0 ]; then
            echo "   ✅ Found $PRODUCT_COUNT products"
            echo ""
            echo "🎉 All tests passed!"
            echo ""
            echo "🌐 Test URLs:"
            echo "   - Products: http://femshopi.localhost:9999/api/products"
            echo "   - Categories: http://femshopi.localhost:9999/api/categories"
            echo "   - Brands: http://femshopi.localhost:9999/api/brands"
        else
            echo "   ⚠️  No products found"
            echo "      Run: npm run db:seed (or tsx scripts/seed-femshopi.ts)"
        fi
    else
        echo "   ❌ Store not resolved"
        echo "      Store ID: $STORE_ID"
        echo "      Run: tsx scripts/seed-femshopi.ts"
    fi
else
    echo "   ❌ API is not running on port 9999"
    echo "      Start it with: npm run dev"
    exit 1
fi
