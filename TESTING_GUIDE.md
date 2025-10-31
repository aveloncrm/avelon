# Testing Guide - Post Migration

## Quick Start Testing

### 1. Environment Setup

Ensure all three apps have the correct environment variables:

**API App** (`apps/api/.env`):
```bash
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
PORT=9999
```

**Admin App** (`apps/admin/.env`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:9999
```

**Storefront App** (`apps/storefront/.env`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:9999
```

### 2. Start All Applications

Open **three separate terminal windows**:

#### Terminal 1 - API Server (MUST START FIRST)
```bash
cd "/Users/ajmalfaiz/Desktop/code/GALAMINE FILES/Ecom/avelon/apps/api"
npm run dev
# Should start on http://localhost:9999
```

Wait for the API server to fully start before starting the other apps.

#### Terminal 2 - Admin Dashboard
```bash
cd "/Users/ajmalfaiz/Desktop/code/GALAMINE FILES/Ecom/avelon/apps/admin"
npm run dev
# Should start on http://localhost:3001 (or default 3000)
```

#### Terminal 3 - Storefront
```bash
cd "/Users/ajmalfaiz/Desktop/code/GALAMINE FILES/Ecom/avelon/apps/storefront"
npm run dev
# Should start on http://localhost:3000 (or next available port)
```

### 3. Test Admin Dashboard

**Login Flow:**
1. Navigate to `http://localhost:3001/login` (or your admin port)
2. Enter admin credentials
3. Verify OTP authentication works
4. Check that you're redirected to dashboard

**Dashboard Tests:**
- [ ] Dashboard loads without errors
- [ ] Revenue metrics display correctly
- [ ] Sales count shows
- [ ] Stock count displays
- [ ] Revenue graph renders

**Products Management:**
- [ ] Navigate to Products page
- [ ] Products list displays
- [ ] Click on a product to edit
- [ ] Try creating a new product
- [ ] Edit product details
- [ ] Delete a product (optional)

**Categories Management:**
- [ ] Navigate to Categories page
- [ ] Categories list displays
- [ ] Create a new category
- [ ] Edit a category

**Brands Management:**
- [ ] Navigate to Brands page
- [ ] Brands list displays
- [ ] Create/edit a brand

**Orders Management:**
- [ ] Navigate to Orders page
- [ ] Orders list displays
- [ ] Click on an order to view details

**Users Management:**
- [ ] Navigate to Users page
- [ ] Users list displays
- [ ] View user details

### 4. Test Storefront

**Homepage:**
- [ ] Navigate to `http://localhost:3000`
- [ ] Banners carousel displays
- [ ] Products grid shows
- [ ] Blog posts show (if any)

**Products:**
- [ ] Navigate to Products page
- [ ] Products list displays
- [ ] Filter by brand works
- [ ] Filter by category works
- [ ] Click on a product
- [ ] Product detail page loads with images
- [ ] Add to cart works

**Authentication:**
- [ ] Login from storefront
- [ ] OTP flow works
- [ ] Profile page accessible after login

**Blog:**
- [ ] Navigate to Blog page
- [ ] Blog posts list (if any)
- [ ] Click on a blog post

### 5. Common Issues and Solutions

#### Issue: "Module not found: Can't resolve '@/lib/db'"
**Solution:** The app is still trying to import the old database client. Restart the dev server:
```bash
# Stop the server (Ctrl+C)
# Clear Next.js cache
rm -rf .next
# Restart
npm run dev
```

#### Issue: "fetch failed" or "ECONNREFUSED"
**Solution:** The API server is not running or not accessible.
- Ensure the API server is running on port 9999
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify no firewall blocking localhost connections

#### Issue: "Unauthorized" errors
**Solution:** Authentication token not being sent properly.
- Check that you're logged in
- Clear cookies and login again
- Verify JWT_SECRET is the same across all apps

#### Issue: "Can't resolve 'next/headers'"
**Solution:** This is a server-side only import being used in client component.
- Ensure `api-server.ts` is only used in Server Components
- Client components should use `api.ts` (axios client)

#### Issue: Empty data or "No products found"
**Solution:** Database might be empty.
- Ensure database is properly seeded
- Run: `cd apps/api && npm run db:seed`

### 6. Monitoring API Calls

Open browser DevTools (F12):

**Network Tab:**
- Filter by "Fetch/XHR"
- Look for calls to `localhost:9999/api/*`
- Verify status codes (200 = success, 401 = unauthorized, 404 = not found)

**Console Tab:**
- Check for any error messages
- Look for failed API calls
- Verify no "Cannot read property" errors

### 7. Performance Testing

Check that pages load quickly:
- Homepage: Should load in < 2 seconds
- Product listing: Should load in < 3 seconds
- Product detail: Should load in < 2 seconds
- Admin dashboard: Should load in < 3 seconds

If pages are slow:
- Check API response times in Network tab
- Ensure database queries are optimized
- Consider adding caching for frequently accessed data

## Automated Testing (Optional)

For future testing, consider adding:

```bash
# API Tests
cd apps/api
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## Rollback Plan

If you encounter critical issues:

1. **Stop all servers** (Ctrl+C in all terminals)
2. **Revert to previous architecture** if needed
3. **Check git history** for previous working state:
   ```bash
   git log --oneline
   git checkout <previous-commit-hash>
   ```

## Success Criteria

✅ All three apps start without errors
✅ Admin can login and view dashboard
✅ Products display in both admin and storefront
✅ CRUD operations work in admin
✅ Users can browse products in storefront
✅ No console errors in browser
✅ API calls return expected data

## Support

If you encounter issues:
1. Check the error message carefully
2. Verify environment variables
3. Ensure API server is running first
4. Check Network tab for failed API calls
5. Look at server logs in the terminal

