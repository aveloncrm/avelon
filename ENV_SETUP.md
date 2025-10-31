# Environment Variables Setup

This guide will help you configure environment variables for all three applications.

## 🔧 Quick Setup

### 1. API Server (`apps/api/.env`)

Create `/apps/api/.env`:

```env
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"

# JWT Secret (use the same secret across all apps)
JWT_SECRET_KEY="your-super-secret-jwt-key-here-change-me"

# CORS - Allowed Origins (comma separated)
ALLOWED_ORIGINS="http://localhost:7777,http://localhost:8888"

# Environment
NODE_ENV="development"
```

### 2. Admin Panel (`apps/admin/.env`)

Create `/apps/admin/.env`:

```env
# API URL - Point to your API server
NEXT_PUBLIC_API_URL="http://localhost:9999"

# JWT Secret (same as API server)
JWT_SECRET_KEY="your-super-secret-jwt-key-here-change-me"

# Environment
NODE_ENV="development"
```

### 3. Storefront (`apps/storefront/.env`)

Create `/apps/storefront/.env`:

```env
# API URL - Point to your API server  
NEXT_PUBLIC_API_URL="http://localhost:9999"

# JWT Secret (same as API server)
JWT_SECRET_KEY="your-super-secret-jwt-key-here-change-me"

# Environment
NODE_ENV="development"
```

## 🚀 For Production

### API Server

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET_KEY="your-strong-production-secret"
ALLOWED_ORIGINS="https://your-storefront.com,https://your-admin.com"
NODE_ENV="production"
```

### Admin Panel

```env
NEXT_PUBLIC_API_URL="https://api.your-domain.com"
JWT_SECRET_KEY="your-strong-production-secret"
NODE_ENV="production"
```

### Storefront

```env
NEXT_PUBLIC_API_URL="https://api.your-domain.com"
JWT_SECRET_KEY="your-strong-production-secret"
NODE_ENV="production"
```

## ⚠️ Important Notes

1. **JWT_SECRET_KEY**: Must be the SAME across all three apps
2. **NEXT_PUBLIC_API_URL**: Must point to your deployed API server URL
3. **ALLOWED_ORIGINS**: API server must allow requests from your frontend URLs
4. **Never commit `.env` files** - they are in `.gitignore`

## ✅ Verification

After setting up environment variables, verify the setup:

```bash
# Terminal 1 - Start API
cd apps/api
npm install
npm run dev

# Terminal 2 - Start Admin
cd apps/admin
npm install  
npm run dev

# Terminal 3 - Start Storefront
cd apps/storefront
npm install
npm run dev
```

Visit:
- Storefront: http://localhost:7777
- Admin: http://localhost:8888
- API: http://localhost:9999

## 🔍 Troubleshooting

### CORS Errors
- Ensure `ALLOWED_ORIGINS` in API includes your frontend URLs
- Check browser console for specific CORS errors

### Authentication Fails
- Verify `JWT_SECRET_KEY` is identical in all three `.env` files
- Check that API server is running

### API Not Found
- Verify `NEXT_PUBLIC_API_URL` points to correct API server
- Ensure API server is running on the specified port

