# Migration Guide: API Separation

This guide explains the architectural changes and how to migrate to the new separated API structure.

## What Changed?

### Before
```
apps/
  - admin/
    - src/app/api/  ❌ (embedded API routes)
  - storefront/
    - src/app/api/  ❌ (embedded API routes)
```

### After
```
apps/
  - admin/         ✅ (frontend only)
  - storefront/    ✅ (frontend only)
  - api/           ✅ (centralized API server)
```

## Benefits

1. **Separation of Concerns**: Frontend and backend are now completely separated
2. **Easier Scaling**: Can deploy and scale the API independently
3. **Better Performance**: API can be optimized separately from frontends
4. **Single Source of Truth**: One API serves multiple clients
5. **Easier Testing**: API can be tested independently
6. **Improved Security**: API can have its own security rules and rate limiting

## Required Changes

### 1. Environment Variables

#### API Server (`apps/api/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
JWT_SECRET_KEY="your-secret-key-here"
ALLOWED_ORIGINS="http://localhost:7777,http://localhost:8888"
NODE_ENV="development"
```

#### Admin Panel (`apps/admin/.env`)
```env
# Add API URL
NEXT_PUBLIC_API_URL="http://localhost:9999"

# Remove DATABASE_URL (no longer needed)
JWT_SECRET_KEY="your-secret-key-here"  # Keep for token verification
```

#### Storefront (`apps/storefront/.env`)
```env
# Add API URL
NEXT_PUBLIC_API_URL="http://localhost:9999"

# Remove DATABASE_URL (no longer needed)
JWT_SECRET_KEY="your-secret-key-here"  # Keep for token verification
```

### 2. Update API Calls

#### Before (Direct API calls within the same app)
```typescript
// In admin or storefront
const response = await fetch('/api/products')
```

#### After (Calls to external API)
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

const response = await fetch(`${API_URL}/api/products`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    // or let cookies handle it
  },
  credentials: 'include', // Important for cookies
})
```

### 3. Helper Function (Recommended)

Create a helper function to handle API calls:

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

export async function apiRequest(
  endpoint: string,
  options?: RequestInit
) {
  const url = `${API_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

// Usage
const products = await apiRequest('/api/products')
const newProduct = await apiRequest('/api/products', {
  method: 'POST',
  body: JSON.stringify(productData),
})
```

### 4. Middleware Updates

Both admin and storefront middleware no longer need to handle API routes. Update your middleware to remove API-related logic if you only verify tokens for pages.

## Running the New Architecture

### Development

You need to run all three applications:

```bash
# Terminal 1 - API Server
cd apps/api
npm install
npm run dev
# Runs on http://localhost:9999

# Terminal 2 - Admin Panel
cd apps/admin
npm install
npm run dev
# Runs on http://localhost:8888

# Terminal 3 - Storefront
cd apps/storefront
npm install
npm run dev
# Runs on http://localhost:7777
```

### Production

#### Option 1: Single Server
Deploy all three apps on the same server but different ports, with nginx as a reverse proxy.

#### Option 2: Separate Deployments
- Deploy API to a dedicated server or serverless platform
- Deploy admin and storefront to Vercel, Netlify, or similar
- Update `NEXT_PUBLIC_API_URL` in frontends to point to the API URL

#### Option 3: Docker
Use Docker Compose to run all services:

```yaml
version: '3.8'
services:
  api:
    build: ./apps/api
    ports:
      - "9999:9999"
    environment:
      - DATABASE_URL=postgresql://...
      - JWT_SECRET_KEY=...
  
  admin:
    build: ./apps/admin
    ports:
      - "8888:8888"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:9999
  
  storefront:
    build: ./apps/storefront
    ports:
      - "7777:7777"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:9999
```

## API Endpoint Changes

### Orders Endpoint
The orders endpoint now supports both admin and customer views:

**Customer View** (default):
```typescript
GET /api/orders
// Returns only the authenticated user's orders
```

**Admin View**:
```typescript
GET /api/orders?adminView=true
// Returns all orders (requires admin authentication)
```

### Public Endpoints
These endpoints don't require authentication for GET requests:
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `GET /api/brands`

All other endpoints require authentication.

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Ensure `ALLOWED_ORIGINS` in the API includes your frontend URLs
2. Make sure you're using `credentials: 'include'` in fetch requests
3. Check that cookies are being sent with requests

### Authentication Issues
If authentication fails:
1. Verify JWT_SECRET_KEY is the same across all apps
2. Check that tokens are being included in requests (cookie or Authorization header)
3. Ensure middleware is correctly extracting and validating tokens

### Database Connection
If the API can't connect to the database:
1. Verify DATABASE_URL is correct
2. Run `npm run db:push` in the API directory
3. Check PostgreSQL is running and accessible

## Migration Checklist

- [ ] Set up API server with environment variables
- [ ] Install dependencies in all three apps
- [ ] Update admin to call external API
- [ ] Update storefront to call external API
- [ ] Test authentication flow
- [ ] Test CORS configuration
- [ ] Test all critical endpoints
- [ ] Update deployment configuration
- [ ] Update CI/CD pipelines if applicable
- [ ] Document any custom changes

## Need Help?

If you encounter issues during migration, check:
1. API logs (`apps/api`)
2. Browser console for CORS or network errors
3. Database connectivity
4. Environment variables are correctly set

