# Quick Reference Card

## 🚀 Start All Applications

```bash
# Terminal 1 - API (Required First!)
cd apps/api && npm run dev

# Terminal 2 - Admin
cd apps/admin && npm run dev

# Terminal 3 - Storefront
cd apps/storefront && npm run dev
```

## 🌐 Access URLs

| Service | URL | Port |
|---------|-----|------|
| **Storefront** | http://localhost:7777 | 7777 |
| **Admin** | http://localhost:8888 | 8888 |
| **API** | http://localhost:9999 | 9999 |

## 📁 Project Structure

```
apps/
├── admin/          ← Frontend only (no database)
│   └── src/lib/api.ts
├── storefront/     ← Frontend only (no database)
│   └── src/lib/api.ts
└── api/            ← Backend with database
    ├── src/app/api/
    └── src/db/
```

## 🔑 Environment Variables

### API (`apps/api/.env`)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET_KEY="same-secret-everywhere"
ALLOWED_ORIGINS="http://localhost:7777,http://localhost:8888"
```

### Admin & Storefront (`.env`)
```env
NEXT_PUBLIC_API_URL="http://localhost:9999"
JWT_SECRET_KEY="same-secret-everywhere"
```

## 🛠️ Useful Commands

```bash
# API Server
cd apps/api
npm run dev              # Start dev server
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio

# Admin / Storefront
cd apps/admin            # or apps/storefront
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run linter
```

## 📡 API Client Usage

```typescript
import api from '@/lib/api'

// GET request
const products = await api.get('/api/products')

// POST request
const newProduct = await api.post('/api/products', {
  title: 'New Product',
  price: 99.99
})

// PATCH request
await api.patch(`/api/products/${id}`, { price: 89.99 })

// DELETE request
await api.delete(`/api/products/${id}`)
```

## 🔒 Authentication

All API calls automatically include credentials. The API helper handles:
- Cookie-based authentication
- Bearer token support
- Error handling
- JSON serialization

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `ENV_SETUP.md` | Environment configuration |
| `MIGRATION_GUIDE.md` | Migration instructions |
| `apps/api/README.md` | API documentation |
| `COMPLETE_MIGRATION_SUMMARY.md` | Full overview |

## ⚡ Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| CORS errors | Check `ALLOWED_ORIGINS` in API `.env` |
| Auth fails | Verify `JWT_SECRET_KEY` is same in all `.env` files |
| API 404 | Check `NEXT_PUBLIC_API_URL` in frontend `.env` |
| Can't login | Start API server first |

## 📋 First-Time Setup

```bash
# 1. Create environment files
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your settings

# 2. Install dependencies
cd apps/api && npm install
cd ../admin && npm install
cd ../storefront && npm install

# 3. Setup database
cd apps/api && npm run db:push

# 4. Start everything (3 terminals)
# Terminal 1: cd apps/api && npm run dev
# Terminal 2: cd apps/admin && npm run dev
# Terminal 3: cd apps/storefront && npm run dev
```

## 🎯 Key Points

- ✅ **API MUST start first** (other apps depend on it)
- ✅ **Same JWT secret** across all apps
- ✅ **CORS configured** for frontend URLs
- ✅ **No database** in admin/storefront anymore
- ✅ **All API calls** go through the helper

---

**Need more details?** See `COMPLETE_MIGRATION_SUMMARY.md`

