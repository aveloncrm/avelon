# Setting Up "femshopi" Subdomain Locally

Complete guide to add and test the `femshopi.localhost` subdomain.

---

## Step 1: Configure Your Hosts File

Add the subdomain to your local DNS resolution.

```bash
# Open hosts file with sudo
sudo nano /etc/hosts
```

Add this line at the bottom:
```
127.0.0.1   femshopi.localhost
```

Save and exit: `Ctrl+O`, `Enter`, `Ctrl+X`

**Verify it works:**
```bash
ping femshopi.localhost
# Should respond from 127.0.0.1
```

---

## Step 2: Create the Store in Database

You need to add a store with `subdomain = 'femshopi'` to your database.

### Option A: Using Admin Panel (Recommended)

1. Start the API server:
   ```bash
   cd apps/api
   npm run dev
   ```

2. Start the Admin panel:
   ```bash
   cd apps/admin
   npm run dev
   ```

3. Login to admin panel (usually `http://localhost:8888` or `http://localhost:3001`)

4. Navigate to **Stores** section

5. Click **"Create New Store"**

6. Fill in:
   - **Name**: `Femshopi Store`
   - **Subdomain**: `femshopi` (IMPORTANT: just "femshopi", not "femshopi.localhost")
   - **Merchant**: Select or create a merchant
   - **Settings**: Optional (logo, colors, etc.)

7. Save

### Option B: Using Database Direct Insert

If you prefer SQL, run this in your PostgreSQL client:

```sql
-- First, get or create a merchant ID
-- If you already have a merchant, use that ID
INSERT INTO "Merchant" (id, email, name, "createdAt", "updatedAt")
VALUES (
  'merchant-femshopi-001',
  'femshopi@example.com',
  'Femshopi Merchant',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Then create the store
INSERT INTO "Store" (id, name, subdomain, "merchantId", "createdAt", "updatedAt")
VALUES (
  'store-femshopi-001',
  'Femshopi Store',
  'femshopi',
  'merchant-femshopi-001',
  NOW(),
  NOW()
);
```

### Option C: Using the Seed Script (If exists)

Check if you have `apps/api/scripts/seed-saas.ts` and modify it to include femshopi, then run:

```bash
cd apps/api
npm run db:seed
```

---

## Step 3: Add Sample Data (Optional but Recommended)

To test properly, add some products/categories for this store.

### Using Admin Panel:
1. Login to admin (make sure you're using the femshopi merchant account if multi-merchant auth is enabled)
2. Create **Brands** for femshopi
3. Create **Categories** for femshopi  
4. Create **Products** for femshopi

### Important:
- All the data you create should have `storeId = 'store-femshopi-001'`
- The admin panel should automatically set this based on the X-STORE-ID header

---

## Step 4: Test the Subdomain

### Test 1: Direct API Call

```bash
# Make sure API server is running on port 9999
curl http://femshopi.localhost:9999/api/products
```

**Expected Response:**
- JSON array of products for femshopi store
- Empty array `[]` if no products exist yet
- If you see products from other stores, something is wrong with resolution

### Test 2: Check Resolution Directly

```bash
curl "http://localhost:9999/api/internal/resolve-store?host=femshopi.localhost"
```

**Expected Response:**
```json
{
  "storeId": "store-femshopi-001"
}
```

### Test 3: Browser Test

1. Open browser
2. Visit: `http://femshopi.localhost:9999/api/products`
3. You should see the JSON response

### Test 4: With Storefront (If applicable)

If you want to test with the storefront:

```bash
cd apps/storefront
npm run dev
# Usually runs on port 3000 or 7777
```

**Important Note:** 
- The storefront at `http://femshopi.localhost:3000` will work...
- BUT if the storefront calls the API at `http://localhost:9999`, the API won't see the subdomain
- **Solution**: Update storefront to make API calls to `http://femshopi.localhost:9999` instead

---

## Step 5: Verify Middleware Logs

Check your API server terminal for logs like:

```
Middleware store resolution for host: femshopi.localhost
Resolved store ID: store-femshopi-001
```

If you see `default-store-001`, the resolution isn't working correctly.

---

## Troubleshooting

### Issue: "Host not found" or "Can't resolve femshopi.localhost"
**Solution:** Did you edit `/etc/hosts`? Try flushing DNS cache:
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### Issue: Always getting default store
**Solutions:**
1. Check if store exists: `SELECT * FROM "Store" WHERE subdomain = 'femshopi';`
2. Check API logs for resolution errors
3. Verify middleware is running the resolve logic
4. Make sure you're hitting the API with the subdomain URL

### Issue: "Store context required" error
**Solution:** The middleware isn't setting X-STORE-ID. Check:
1. API server is running
2. Middleware file is correct
3. Internal resolve-store route is accessible

### Issue: 404 on products
**Solution:** The store exists but has no data. Add products via admin panel.

---

## Summary Checklist

- [ ] Added `femshopi.localhost` to `/etc/hosts`
- [ ] Created merchant in database
- [ ] Created store with `subdomain = 'femshopi'`
- [ ] Added sample products/brands/categories for femshopi
- [ ] API server is running on port 9999
- [ ] Tested with curl and got correct store data
- [ ] Verified resolution endpoint returns correct storeId
- [ ] (Optional) Tested with storefront

**You're all set!** The femshopi subdomain should now work locally.
