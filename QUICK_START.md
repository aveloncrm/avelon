# 🚀 Quick Start Guide - Scaling Implementation

**Read this first, then refer to SCALING_PLAN.md for details**

---

## 📋 IMMEDIATE ACTIONS (THIS WEEK)

### 1. Set Up Redis (30 minutes)

**Option A: Upstash (Recommended for quick start)**
```bash
# Sign up at https://upstash.com (Free tier available)
# Get your REDIS_URL

# Add to .env files
echo "REDIS_URL=redis://your-upstash-url" >> apps/storefront/.env
echo "REDIS_URL=redis://your-upstash-url" >> apps/admin/.env
```

**Option B: Local Development**
```bash
# Using Docker
docker run -d -p 6379:6379 redis:7-alpine

# Add to .env
echo "REDIS_URL=redis://localhost:6379" >> apps/storefront/.env
```

### 2. Install Dependencies
```bash
# At root level
bun add ioredis @upstash/ratelimit bullmq
bun add -D @types/ioredis

# In each app
cd apps/storefront && bun add ioredis
cd apps/admin && bun add ioredis
```

### 3. Update Database Schema with Indexes (15 minutes)

Add these indexes to `apps/api/src/db/schema.ts` by adding index configurations to your table definitions:

```typescript
// Example for products table
export const products = pgTable('products', {
  // ... existing fields ...
}, (table) => ({
  brandIdx: index('product_brand_idx').on(table.brandId),
  availableIdx: index('product_available_featured_idx').on(table.isAvailable, table.isFeatured),
  priceIdx: index('product_price_idx').on(table.price),
  createdAtIdx: index('product_created_at_idx').on(table.createdAt),
  stockIdx: index('product_stock_idx').on(table.stock),
}))

// Example for orders table  
export const orders = pgTable('orders', {
  // ... existing fields ...
}, (table) => ({
  userIdx: index('order_user_idx').on(table.userId),
  addressIdx: index('order_address_idx').on(table.addressId),
  statusIdx: index('order_status_idx').on(table.status),
  createdAtIdx: index('order_created_at_idx').on(table.createdAt),
}))
```

Then run:
```bash
cd apps/api
bun run db:push
```

### 4. Create Cache Utility (10 minutes)

Create `packages/shared/src/lib/cache.ts` (see SCALING_PLAN.md for full code)

Or quick version:
```typescript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  try {
    const cached = await redis.get(key)
    if (cached) return JSON.parse(cached)
    
    const fresh = await fetcher()
    await redis.setex(key, ttl, JSON.stringify(fresh))
    return fresh
  } catch (error) {
    return fetcher()
  }
}
```

### 5. Fix ONE Critical Endpoint (30 minutes)

Update `apps/api/src/app/api/products/route.ts`:

```typescript
import { db } from '@/lib/db'
import { products, brands, categories, productCategories } from '@/db/schema'
import { NextResponse } from 'next/server'
import { getCached } from '@/lib/cache' // Your new cache utility
import { eq, count } from 'drizzle-orm'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = (page - 1) * limit
    
    const cacheKey = `products:${page}:${limit}`
    
    const result = await getCached(
      cacheKey,
      async () => {
        const [productsList, totalCount] = await Promise.all([
          db.query.products.findMany({
            where: eq(products.isAvailable, true),
            with: {
              brand: true,
              categories: {
                with: {
                  category: true
                }
              }
            },
            limit,
            offset,
            orderBy: (products, { desc }) => [desc(products.createdAt)],
          }),
          db.select({ value: count() })
            .from(products)
            .where(eq(products.isAvailable, true))
            .then(res => res[0].value),
        ])
        
        return {
          data: productsList,
          meta: {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
          }
        }
      },
      600 // Cache for 10 minutes
    )
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('[PRODUCT_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
```

---

## 📊 TEST YOUR CHANGES

### 1. Check Cache is Working
```bash
# In one terminal, connect to Redis
redis-cli -u $REDIS_URL

# Watch for keys being set
MONITOR

# In another terminal, make API requests
curl http://localhost:7777/api/products
# You should see keys being set in Redis
```

### 2. Measure Performance
```bash
# Before optimization
time curl http://localhost:7777/api/products

# After optimization (2nd request - should be cached)
time curl http://localhost:7777/api/products
# Should be 5-10x faster
```

### 3. Check Database Queries
Add logging to your Drizzle client:
```typescript
// apps/api/src/lib/db.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL!, {
  onnotice: (notice) => console.log('DB Notice:', notice),
})

export const db = drizzle(client, { 
  schema,
  logger: true // See all queries in console
})
```

---

## 🎯 WEEK-BY-WEEK PRIORITIES

### Week 1: Database & Cache ⚡
- [x] Add indexes
- [x] Set up Redis
- [x] Fix products API
- [ ] Fix orders API
- [ ] Fix profile API
- [ ] Test cache hit rate (target: 60%+)

### Week 2: Rate Limiting & Queue 🛡️
- [ ] Add rate limiting to auth endpoints
- [ ] Set up BullMQ for emails
- [ ] Move email sending to queue
- [ ] Add health check endpoint

### Week 3-4: Monitoring 📊
- [ ] Set up Sentry
- [ ] Add performance metrics
- [ ] Create monitoring dashboard
- [ ] Run first load test

### Week 5-8: API Separation 🏗️
- [ ] Create apps/api
- [ ] Migrate products endpoints
- [ ] Migrate orders endpoints
- [ ] Deploy separately

---

## 🔥 COMMON ISSUES & FIXES

### Redis Connection Fails
```typescript
// Add error handling
redis.on('error', (err) => console.error('Redis Error:', err))
redis.on('connect', () => console.log('Redis Connected'))
```

### Cache Not Invalidating
```typescript
// Add cache invalidation after updates
await db.update(products).set(data).where(eq(products.id, id))
await redis.del(`product:${id}`)
await redis.del('products:*') // Clear all product lists
```

### Still Slow After Caching
- Check if you're selecting too many fields
- Look for N+1 queries (nested includes)
- Add more specific indexes
- Check network latency to database

---

## 📈 SUCCESS METRICS TO TRACK

**Daily:**
- [ ] API response time (target: <100ms)
- [ ] Cache hit rate (target: >60%)
- [ ] Error rate (target: <1%)

**Weekly:**
- [ ] Database query count per request
- [ ] Concurrent user capacity
- [ ] Infrastructure costs

**Monthly:**
- [ ] Uptime percentage
- [ ] User complaints/support tickets
- [ ] Performance regression tests

---

## 🆘 NEED HELP?

1. **Check SCALING_PLAN.md** - Full detailed guide
2. **Read error logs** - Usually self-explanatory
3. **Test locally first** - Never deploy untested changes
4. **Rollback if needed** - Better safe than sorry

---

## 🎓 LEARNING PATH

**Day 1-2:** Redis basics
- https://redis.io/docs/manual/
- Practice: SET, GET, SETEX, DEL

**Day 3-4:** Caching strategies
- When to cache
- Cache invalidation
- TTL selection

**Day 5-7:** Query optimization
- Drizzle ORM performance tips
- Index usage
- N+1 query detection

**Week 2:** Rate limiting & security
**Week 3:** Monitoring & observability
**Week 4:** Load testing

---

## ✅ DAILY CHECKLIST

**Before starting work:**
- [ ] Pull latest changes
- [ ] Redis is running
- [ ] Database is up
- [ ] Tests are passing

**Before committing:**
- [ ] Code is tested locally
- [ ] No console.logs left
- [ ] Cache invalidation works
- [ ] Error handling is present

**Before deploying:**
- [ ] Test in staging
- [ ] Check monitoring dashboard
- [ ] Prepare rollback plan
- [ ] Notify team

---

## 🚀 READY TO START?

1. Read this checklist ✅
2. Set up Redis (30 min) ⏱️
3. Add database indexes (15 min) 📊
4. Fix products API (30 min) 💻
5. Test and measure (15 min) 🧪

**Total time to first improvement: ~90 minutes**

Then refer to **SCALING_PLAN.md** for the complete roadmap!

---

**Remember:** Small improvements compound. Focus on one thing at a time! 🎯

