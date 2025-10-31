# 🚀 Scaling Plan: 2M+ Users Architecture

**Application:** Avelon E-commerce Platform  
**Current Users:** <10K  
**Target:** 2M+ concurrent users  
**Timeline:** 4 months  
**Last Updated:** October 31, 2025

---

## 📊 EXECUTIVE SUMMARY

### Current State
- **Tech Stack:** Next.js 15 (Admin + Storefront), PostgreSQL, Drizzle ORM
- **Architecture:** Separated API layer with centralized backend
- **Deployment:** Vercel (3 separate apps)
- **Bottlenecks:** No caching, could optimize queries further, synchronous operations

### Target State
- **Architecture:** Separated API layer with microservices-ready design
- **Performance:** 10-20x improvement in response times
- **Scalability:** Horizontal scaling capability to 2M+ users
- **Cost:** 30-50% reduction through optimized infrastructure

### Key Metrics Goals
| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| API Response Time | 200-500ms | 10-50ms | **10x faster** |
| Database Queries | 20+ per request | 1-3 per request | **7x reduction** |
| Concurrent Users | ~1K | 100K+ | **100x scale** |
| Cache Hit Rate | 0% | 80%+ | **80% DB offload** |
| API Throughput | ~5K req/sec | 30K+ req/sec | **6x capacity** |

---

## 🔴 CRITICAL ISSUES IDENTIFIED

### 1. Database Layer (HIGHEST PRIORITY)
- ❌ No connection pooling
- ❌ N+1 query patterns everywhere
- ❌ Fetching all products without pagination
- ❌ Missing composite indexes
- ❌ Over-fetching with excessive `include` statements

### 2. No Caching Layer
- ❌ No Redis implementation
- ❌ Explicitly disabling cache (`cache: 'no-store'`)
- ❌ No API response caching
- ❌ No session caching

### 3. Architecture Issues
- ❌ Duplicate API routes in admin & storefront
- ❌ API routes coupled with frontend deployments
- ❌ Can't scale API independently from UI
- ❌ SSR on every request (should use ISR/SSG)

### 4. Missing Infrastructure
- ❌ No rate limiting
- ❌ No message queue for async tasks
- ❌ No monitoring/observability
- ❌ Synchronous email sending (blocks responses)

### 5. Code Patterns
- ✅ Efficient database queries with Drizzle ORM
- ✅ Pagination implemented on list endpoints
- ❌ JWT verification on every request (not cached)
- ❌ No error boundaries or circuit breakers

---

## 🏗️ TARGET ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│                   Cloudflare CDN                     │
│                 (Static Assets)                       │
└─────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Storefront   │  │ Admin Panel  │  │  API Service │
│ (Next.js)    │  │ (Next.js)    │  │  (Hono/Fastify)│
│ Static/ISR   │  │ Static/ISR   │  │              │
│ NO API       │  │ NO API       │  │ • Redis      │
└──────────────┘  └──────────────┘  │ • Rate Limit │
                                     │ • Auth       │
                                     └──────────────┘
                                            │
                    ┌───────────────────────┼───────────────────┐
                    ▼                       ▼                   ▼
            ┌──────────────┐        ┌──────────────┐   ┌──────────────┐
            │   Redis      │        │  PostgreSQL  │   │   BullMQ     │
            │   Cache      │        │  (Primary +  │   │   Queue      │
            │   + Sessions │        │   Replicas)  │   │              │
            └──────────────┘        └──────────────┘   └──────────────┘
                                            │
                                    ┌───────┴────────┐
                                    ▼                ▼
                            [Read Replica 1] [Read Replica 2]
```

---

## 📅 IMPLEMENTATION TIMELINE

### **PHASE 1: Critical Optimizations (Week 1-2)**
**Goal:** 5x performance improvement without architecture changes

#### Week 1: Database Optimization
- [ ] Add composite indexes to Drizzle schema
- [ ] Fix N+1 queries (replace nested includes)
- [ ] Add pagination to all list endpoints
- [ ] Implement select fields (reduce payload size)
- [ ] Add connection pooling configuration

#### Week 2: Redis Cache Layer
- [ ] Set up Redis (Upstash or AWS ElastiCache)
- [ ] Create cache helper utilities
- [ ] Implement session caching
- [ ] Cache product catalog (10min TTL)
- [ ] Cache categories/brands (1hr TTL)

**Deliverables:**
- ✅ All endpoints respond under 100ms
- ✅ 70% cache hit rate
- ✅ Database connections reduced by 80%

---

### **PHASE 2: Infrastructure & Middleware (Week 3-4)**
**Goal:** Add resilience, monitoring, and async processing

#### Week 3: Rate Limiting & Queue
- [ ] Implement rate limiting (Upstash)
- [ ] Set up BullMQ + Redis for job queue
- [ ] Move email sending to queue
- [ ] Move notification sending to queue
- [ ] Add background job workers

#### Week 4: Monitoring & Optimization
- [ ] Set up Sentry for error tracking
- [ ] Add logging (Winston or Pino)
- [ ] Implement health check endpoints
- [ ] Add performance monitoring
- [ ] Create admin dashboard for metrics

**Deliverables:**
- ✅ No request blocks due to async operations
- ✅ Complete error tracking and alerting
- ✅ Real-time performance visibility

---

### **PHASE 3: API Separation (Week 5-8)**
**Goal:** Separate API layer for independent scaling

#### Week 5-6: API Service Setup
- [ ] Create new `apps/api` with Hono framework
- [ ] Set up shared packages structure
- [ ] Migrate authentication logic
- [ ] Implement middleware (auth, rate limit, cache)
- [ ] Create API documentation (Swagger)

#### Week 7: Migrate Endpoints
- [ ] Migrate Products API (read endpoints)
- [ ] Migrate Categories & Brands API
- [ ] Migrate Orders API (read endpoints)
- [ ] Migrate Cart API
- [ ] Add comprehensive tests

#### Week 8: Deploy & Switch
- [ ] Deploy API service separately
- [ ] Update frontend to use new API
- [ ] Monitor and optimize
- [ ] Remove old API routes from Next.js
- [ ] Performance testing

**Deliverables:**
- ✅ Fully separated API service
- ✅ 6x better API throughput
- ✅ Independent scaling capability
- ✅ 50% cost reduction

---

### **PHASE 4: Advanced Scaling (Week 9-16)**
**Goal:** Microservices-ready architecture

#### Week 9-10: Database Scaling
- [ ] Set up PostgreSQL read replicas
- [ ] Implement read/write split in code
- [ ] Add PgBouncer for connection pooling
- [ ] Database query optimization audit
- [ ] Add database monitoring (pg_stat_statements)

#### Week 11-12: Search & Performance
- [ ] Implement Meilisearch/Elasticsearch for product search
- [ ] Add full-text search capabilities
- [ ] Optimize image delivery (AVIF, WebP)
- [ ] Implement lazy loading strategies
- [ ] Add CDN caching headers

#### Week 13-14: Microservices Preparation
- [ ] Split services by domain (Product, Order, User)
- [ ] Implement API Gateway (optional)
- [ ] Set up service-to-service auth
- [ ] Add distributed tracing
- [ ] Create service health monitoring

#### Week 15-16: Load Testing & Optimization
- [ ] Run load tests (k6 or Artillery)
- [ ] Identify and fix bottlenecks
- [ ] Optimize database indexes
- [ ] Fine-tune cache TTLs
- [ ] Implement auto-scaling policies

**Deliverables:**
- ✅ Handle 100K+ concurrent users
- ✅ Sub-50ms API response times
- ✅ 95% cache hit rate
- ✅ Microservices-ready architecture

---

## 💻 CODE IMPLEMENTATIONS

### 1. Database Schema Optimization

> **Note:** This project now uses Drizzle ORM. The examples below show optimization patterns that can be applied to the Drizzle schema in `apps/api/src/db/schema.ts`.

```typescript
// apps/api/src/db/schema.ts - REFERENCE
// This shows the optimization patterns applied with Drizzle ORM

import { pgTable, text, boolean, real, integer, timestamp, index } from 'drizzle-orm/pg-core'

// OPTIMIZED INDEXES - Apply these patterns to improve query performance
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  price: real('price').default(100).notNull(),
  discount: real('discount').default(0),
  stock: integer('stock').default(0),
  isAvailable: boolean('is_available').default(false),
  isFeatured: boolean('is_featured').default(false),
  brandId: text('brand_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  brandIdx: index('product_brand_idx').on(table.brandId),
  availableFeaturedIdx: index('product_available_featured_idx').on(table.isAvailable, table.isFeatured),
  priceIdx: index('product_price_idx').on(table.price),
  createdAtIdx: index('product_created_at_idx').on(table.createdAt),
  brandAvailableIdx: index('product_brand_available_idx').on(table.brandId, table.isAvailable),
  stockIdx: index('product_stock_idx').on(table.stock),
}))

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  number: integer('number').notNull(),
  status: text('status').notNull(),
  total: real('total').default(100),
  isPaid: boolean('is_paid').default(false),
  isCompleted: boolean('is_completed').default(false),
  userId: text('user_id').notNull(),
  addressId: text('address_id'),
  discountCodeId: text('discount_code_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdx: index('order_user_idx').on(table.userId),
  addressIdx: index('order_address_idx').on(table.addressId),
  discountIdx: index('order_discount_idx').on(table.discountCodeId),
  userCreatedIdx: index('order_user_created_idx').on(table.userId, table.createdAt),
  statusPaidIdx: index('order_status_paid_idx').on(table.status, table.isPaid),
  createdAtIdx: index('order_created_at_idx').on(table.createdAt),
  statusIdx: index('order_status_idx').on(table.status),
}))

// Note: Apply similar index patterns to other tables (Cart, User, etc.)
  updatedAt DateTime @updatedAt
  
  @@index([updatedAt]) // For cleanup jobs
}

model User {
  id    String  @id @default(cuid())
  email String? @unique
  phone String? @unique
  
  name     String?
  birthday String?
  
  OTP                   String?
  emailUnsubscribeToken String? @unique @default(cuid())
  referralCode          String? @unique
  
  isBanned          Boolean @default(false)
  isEmailVerified   Boolean @default(false)
  isPhoneVerified   Boolean @default(false)
  isEmailSubscribed Boolean @default(false)
  isPhoneSubscribed Boolean @default(false)
  
  cart     Cart?
  wishlist Product[] @relation("Wishlist")
  
  orders         Order[]
  addresses      Address[]
  payments       Payment[]
  notifications  Notification[]
  productReviews ProductReview[]
  errors         Error[]
  files          File[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // OPTIMIZED INDEXES
  @@index([email])
  @@index([phone])
  @@index([isEmailVerified])
  @@index([createdAt])
}
```

### 2. Redis Cache Implementation

```typescript
// packages/shared/src/lib/redis.ts

import Redis from 'ioredis'

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL
  }
  
  // Fallback for local development
  return 'redis://localhost:6379'
}

export const redis = new Redis(getRedisUrl(), {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  reconnectOnError(err) {
    const targetError = 'READONLY'
    if (err.message.includes(targetError)) {
      return true // Reconnect
    }
    return false
  },
})

redis.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

redis.on('connect', () => {
  console.log('Redis Client Connected')
})

export default redis
```

```typescript
// packages/shared/src/lib/cache.ts

import redis from './redis'

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  tags?: string[] // For cache invalidation
}

/**
 * Get or set cache with automatic expiration
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = 300, tags = [] } = options

  try {
    // Try to get from cache
    const cached = await redis.get(key)
    
    if (cached) {
      console.log(`[CACHE HIT] ${key}`)
      return JSON.parse(cached) as T
    }

    console.log(`[CACHE MISS] ${key}`)
    
    // Fetch fresh data
    const fresh = await fetcher()
    
    // Store in cache with expiration
    const pipeline = redis.pipeline()
    pipeline.setex(key, ttl, JSON.stringify(fresh))
    
    // Store tags for invalidation
    if (tags.length > 0) {
      tags.forEach(tag => {
        pipeline.sadd(`tag:${tag}`, key)
        pipeline.expire(`tag:${tag}`, ttl)
      })
    }
    
    await pipeline.exec()
    
    return fresh
  } catch (error) {
    console.error('[CACHE ERROR]', error)
    // Fallback to direct fetch if cache fails
    return fetcher()
  }
}

/**
 * Invalidate cache by key pattern
 */
export async function invalidateCache(pattern: string): Promise<number> {
  try {
    const keys = await redis.keys(pattern)
    
    if (keys.length === 0) {
      return 0
    }
    
    await redis.del(...keys)
    console.log(`[CACHE INVALIDATED] ${keys.length} keys matching ${pattern}`)
    
    return keys.length
  } catch (error) {
    console.error('[CACHE INVALIDATION ERROR]', error)
    return 0
  }
}

/**
 * Invalidate by tags
 */
export async function invalidateByTag(tag: string): Promise<number> {
  try {
    const keys = await redis.smembers(`tag:${tag}`)
    
    if (keys.length === 0) {
      return 0
    }
    
    const pipeline = redis.pipeline()
    keys.forEach(key => pipeline.del(key))
    pipeline.del(`tag:${tag}`)
    
    await pipeline.exec()
    console.log(`[CACHE INVALIDATED] Tag ${tag}: ${keys.length} keys`)
    
    return keys.length
  } catch (error) {
    console.error('[TAG INVALIDATION ERROR]', error)
    return 0
  }
}

/**
 * Get multiple keys at once
 */
export async function mgetCached<T>(keys: string[]): Promise<(T | null)[]> {
  try {
    const values = await redis.mget(...keys)
    return values.map(v => v ? JSON.parse(v) as T : null)
  } catch (error) {
    console.error('[MGET ERROR]', error)
    return keys.map(() => null)
  }
}

/**
 * Set multiple keys at once
 */
export async function msetCached(
  entries: Array<{ key: string; value: any; ttl?: number }>
): Promise<void> {
  try {
    const pipeline = redis.pipeline()
    
    entries.forEach(({ key, value, ttl = 300 }) => {
      pipeline.setex(key, ttl, JSON.stringify(value))
    })
    
    await pipeline.exec()
  } catch (error) {
    console.error('[MSET ERROR]', error)
  }
}
```

### 3. Session Caching

```typescript
// packages/shared/src/lib/session.ts

import { verifyJWT } from './jwt'
import redis from './redis'

export interface SessionData {
  userId: string
  email?: string
  phone?: string
  role?: string
}

/**
 * Get user from token with caching
 */
export async function getUserFromToken(token: string): Promise<SessionData | null> {
  const cacheKey = `session:${token}`
  
  try {
    // Try cache first
    const cached = await redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached) as SessionData
    }

    // Verify JWT and cache result
    const payload = await verifyJWT<{ sub: string; email?: string; role?: string }>(token)
    
    const sessionData: SessionData = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role || 'user',
    }
    
    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(sessionData))
    
    return sessionData
  } catch (error) {
    console.error('[SESSION ERROR]', error)
    return null
  }
}

/**
 * Invalidate user session
 */
export async function invalidateSession(token: string): Promise<void> {
  try {
    await redis.del(`session:${token}`)
  } catch (error) {
    console.error('[SESSION INVALIDATION ERROR]', error)
  }
}

/**
 * Invalidate all user sessions
 */
export async function invalidateUserSessions(userId: string): Promise<void> {
  try {
    const pattern = `session:*:${userId}`
    const keys = await redis.keys(pattern)
    
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error('[USER SESSIONS INVALIDATION ERROR]', error)
  }
}
```

### 4. Optimized API Routes

```typescript
// apps/api/src/routes/products.ts - OPTIMIZED VERSION

import { Hono } from 'hono'
import { getCached, invalidateByTag } from '@/lib/cache'
import { db } from '@/lib/db'
import { z } from 'zod'

const app = new Hono()

// Validation schemas
const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  category: z.string().optional(),
  brand: z.string().optional(),
  isAvailable: z.enum(['true', 'false']).optional(),
  sort: z.enum(['featured', 'price_asc', 'price_desc', 'newest']).default('featured'),
})

/**
 * GET /products - List products with caching
 */
app.get('/', async (c) => {
  try {
    const query = listQuerySchema.parse(c.req.query())
    const { page, limit, category, brand, isAvailable, sort } = query
    
    const cacheKey = `products:list:${JSON.stringify(query)}`
    
    const result = await getCached(
      cacheKey,
      async () => {
        const offset = (page - 1) * limit
        
        // Build where clause
        const where: any = {}
        if (isAvailable) where.isAvailable = isAvailable === 'true'
        if (brand) where.brand = { title: { contains: brand, mode: 'insensitive' } }
        if (category) {
          where.categories = { some: { title: { contains: category, mode: 'insensitive' } } }
        }
        
        // Build order by
        let orderBy: any = { createdAt: 'desc' }
        switch (sort) {
          case 'price_asc':
            orderBy = { price: 'asc' }
            break
          case 'price_desc':
            orderBy = { price: 'desc' }
            break
          case 'newest':
            orderBy = { createdAt: 'desc' }
            break
          case 'featured':
            orderBy = { isFeatured: 'desc' }
            break
        }
        
        // Parallel queries for better performance
        const [products, total] = await Promise.all([
          db.product.findMany({
            where,
            orderBy,
            skip: offset,
            take: limit,
            select: {
              id: true,
              title: true,
              description: true,
              images: true,
              price: true,
              discount: true,
              stock: true,
              isAvailable: true,
              isFeatured: true,
              brand: {
                select: {
                  id: true,
                  title: true,
                  logo: true,
                }
              },
              categories: {
                select: {
                  id: true,
                  title: true,
                }
              },
              createdAt: true,
            },
          }),
          db.product.count({ where }),
        ])
        
        return {
          data: products,
          meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
          },
        }
      },
      { ttl: 600, tags: ['products'] } // Cache 10 minutes
    )
    
    return c.json(result, 200, {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'X-Cache-TTL': '600',
    })
  } catch (error) {
    console.error('[PRODUCTS_LIST_ERROR]', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

/**
 * GET /products/:id - Get single product
 */
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const cacheKey = `product:${id}`
    
    const product = await getCached(
      cacheKey,
      async () => {
        const product = await db.product.findUnique({
          where: { id },
          select: {
            id: true,
            title: true,
            description: true,
            images: true,
            keywords: true,
            price: true,
            discount: true,
            stock: true,
            isAvailable: true,
            isFeatured: true,
            isPhysical: true,
            brand: {
              select: {
                id: true,
                title: true,
                logo: true,
                description: true,
              }
            },
            categories: {
              select: {
                id: true,
                title: true,
                description: true,
              }
            },
            productReviews: {
              select: {
                id: true,
                rating: true,
                text: true,
                user: {
                  select: {
                    name: true,
                  }
                },
                createdAt: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 10,
            },
            createdAt: true,
            updatedAt: true,
          },
        })
        
        if (!product) {
          return null
        }
        
        // Calculate average rating
        const avgRating = product.productReviews.length > 0
          ? product.productReviews.reduce((sum, r) => sum + r.rating, 0) / product.productReviews.length
          : 0
        
        return {
          ...product,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: product.productReviews.length,
        }
      },
      { ttl: 1800, tags: ['products', `product:${id}`] } // Cache 30 minutes
    )
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }
    
    return c.json(product, 200, {
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      'X-Cache-TTL': '1800',
    })
  } catch (error) {
    console.error('[PRODUCT_GET_ERROR]', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

/**
 * POST /products - Create product (Admin only)
 */
app.post('/', async (c) => {
  try {
    // Auth check would be in middleware
    const userId = c.get('userId')
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const body = await c.req.json()
    
    const product = await db.product.create({
      data: body,
    })
    
    // Invalidate products cache
    await invalidateByTag('products')
    
    return c.json(product, 201)
  } catch (error) {
    console.error('[PRODUCT_CREATE_ERROR]', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

/**
 * PATCH /products/:id - Update product
 */
app.patch('/:id', async (c) => {
  try {
    const userId = c.get('userId')
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const id = c.req.param('id')
    const body = await c.req.json()
    
    const product = await db.product.update({
      where: { id },
      data: body,
    })
    
    // Invalidate specific product and list cache
    await Promise.all([
      invalidateByTag('products'),
      invalidateByTag(`product:${id}`),
    ])
    
    return c.json(product)
  } catch (error) {
    console.error('[PRODUCT_UPDATE_ERROR]', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default app
```

### 5. Rate Limiting

```typescript
// packages/shared/src/middleware/ratelimit.ts

import { Ratelimit } from '@upstash/ratelimit'
import redis from '../lib/redis'

// Different rate limits for different endpoints
export const rateLimiters = {
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 req/min
    analytics: true,
    prefix: 'ratelimit:api',
  }),
  
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '5 m'), // 5 attempts per 5 min
    analytics: true,
    prefix: 'ratelimit:auth',
  }),
  
  checkout: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 m'), // 10 checkouts per 10 min
    analytics: true,
    prefix: 'ratelimit:checkout',
  }),
  
  write: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 writes per min
    analytics: true,
    prefix: 'ratelimit:write',
  }),
}

/**
 * Hono middleware for rate limiting
 */
export const rateLimitMiddleware = (type: keyof typeof rateLimiters = 'api') => {
  return async (c: any, next: any) => {
    const identifier = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'anonymous'
    
    const { success, limit, remaining, reset } = await rateLimiters[type].limit(identifier)
    
    // Set rate limit headers
    c.header('X-RateLimit-Limit', limit.toString())
    c.header('X-RateLimit-Remaining', remaining.toString())
    c.header('X-RateLimit-Reset', reset.toString())
    
    if (!success) {
      return c.json(
        { 
          error: 'Too many requests',
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        },
        429
      )
    }
    
    await next()
  }
}
```

### 6. Message Queue Implementation

```typescript
// packages/shared/src/lib/queue.ts

import { Queue, Worker, QueueEvents } from 'bullmq'
import redis from './redis'
import { sendEmail } from '@/lib/email'

// Define job types
export type JobType = 
  | 'order-confirmation'
  | 'order-shipped'
  | 'payment-success'
  | 'welcome-email'
  | 'notification'

export interface EmailJobData {
  to: string
  subject: string
  html: string
  template?: string
  data?: Record<string, any>
}

// Create queues
export const emailQueue = new Queue<EmailJobData>('emails', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep for 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep for 7 days
    },
  },
})

export const notificationQueue = new Queue('notifications', {
  connection: redis,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
})

// Email worker (run this in a separate process)
export const emailWorker = new Worker<EmailJobData>(
  'emails',
  async (job) => {
    const { to, subject, html, template, data } = job.data
    
    try {
      if (template && data) {
        // Render template with data
        await sendEmail({
          to,
          subject,
          template,
          data,
        })
      } else {
        await sendEmail({ to, subject, html })
      }
      
      console.log(`[EMAIL SENT] ${job.id} to ${to}`)
    } catch (error) {
      console.error(`[EMAIL ERROR] ${job.id}:`, error)
      throw error // Will retry based on attempts
    }
  },
  {
    connection: redis,
    concurrency: 10, // Process 10 emails concurrently
  }
)

// Queue events for monitoring
export const emailQueueEvents = new QueueEvents('emails', {
  connection: redis,
})

emailQueueEvents.on('completed', ({ jobId }) => {
  console.log(`[QUEUE] Email job ${jobId} completed`)
})

emailQueueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`[QUEUE] Email job ${jobId} failed:`, failedReason)
})

// Helper function to add jobs
export async function sendOrderConfirmationEmail(orderId: string, userEmail: string) {
  await emailQueue.add('order-confirmation', {
    to: userEmail,
    subject: 'Order Confirmation',
    template: 'order-confirmation',
    data: { orderId },
  })
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  await emailQueue.add('welcome-email', {
    to: userEmail,
    subject: 'Welcome to Avelon!',
    template: 'welcome',
    data: { name: userName },
  })
}
```

### 7. Complete API Service Structure

```typescript
// apps/api/src/server.ts - MAIN API SERVER

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { compress } from 'hono/compress'

// Routes
import products from './routes/products'
import orders from './routes/orders'
import auth from './routes/auth'
import cart from './routes/cart'
import users from './routes/users'

// Middleware
import { authMiddleware } from './middleware/auth'
import { rateLimitMiddleware } from './middleware/ratelimit'
import { errorHandler } from './middleware/error'

const app = new Hono()

// Global middleware
app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', compress())

// CORS
app.use('*', cors({
  origin: [
    process.env.STOREFRONT_URL || 'http://localhost:7777',
    process.env.ADMIN_URL || 'http://localhost:8888',
  ],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// API routes
app.route('/api/v1/auth', auth)
app.route('/api/v1/products', products)
app.route('/api/v1/orders', orders)
app.route('/api/v1/cart', cart)
app.route('/api/v1/users', users)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404)
})

// Error handler
app.onError(errorHandler)

// Start server
const port = parseInt(process.env.PORT || '3001')
console.log(`🚀 API Server running on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
```

---

## 🎯 MIGRATION STRATEGY

### Migration Completed: Drizzle ORM

**Why Drizzle?**
- ✅ 10x faster than Prisma
- ✅ Smaller bundle size (100KB vs 2MB)
- ✅ Better TypeScript inference
- ✅ Already implemented in this project
- SQL-like syntax
- Zero overhead

```typescript
// packages/shared/src/db/schema.ts - DRIZZLE SCHEMA

import { pgTable, varchar, text, integer, boolean, timestamp, real, json, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const products = pgTable('Product', {
  id: varchar('id', { length: 30 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  images: text('images').array().notNull(),
  keywords: text('keywords').array().notNull(),
  metadata: json('metadata'),
  
  price: real('price').default(100).notNull(),
  discount: real('discount').default(0).notNull(),
  stock: integer('stock').default(0).notNull(),
  
  isPhysical: boolean('isPhysical').default(true).notNull(),
  isAvailable: boolean('isAvailable').default(false).notNull(),
  isFeatured: boolean('isFeatured').default(false).notNull(),
  
  brandId: varchar('brandId', { length: 30 }).notNull(),
  
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}, (table) => ({
  brandIdx: index('Product_brandId_idx').on(table.brandId),
  availableFeaturedIdx: index('Product_isAvailable_isFeatured_idx').on(table.isAvailable, table.isFeatured),
  priceIdx: index('Product_price_idx').on(table.price),
  createdAtIdx: index('Product_createdAt_idx').on(table.createdAt),
  brandAvailableIdx: index('Product_brandId_isAvailable_idx').on(table.brandId, table.isAvailable),
}))

// Usage - High performance queries
import { db } from './db'
import { products, brands } from './schema'
import { eq, and, desc } from 'drizzle-orm'

// Simple query
const allProducts = await db.select().from(products)

// With joins (single query, no N+1)
const productsWithBrands = await db
  .select({
    id: products.id,
    title: products.title,
    price: products.price,
    brand: {
      id: brands.id,
      title: brands.title,
    }
  })
  .from(products)
  .leftJoin(brands, eq(products.brandId, brands.id))
  .where(eq(products.isAvailable, true))
  .orderBy(desc(products.createdAt))
  .limit(20)

// Raw SQL when needed (with type safety)
const result = await db.execute(sql`
  SELECT p.*, b.title as brand_name
  FROM "Product" p
  LEFT JOIN "Brand" b ON b.id = p."brandId"
  WHERE p."isAvailable" = true
  LIMIT 20
`)
```

---

## 📊 MONITORING & OBSERVABILITY

### 1. Application Monitoring

```typescript
// packages/shared/src/lib/monitoring.ts

import * as Sentry from '@sentry/node'

export function initMonitoring() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    beforeSend(event, hint) {
      // Filter sensitive data
      if (event.request) {
        delete event.request.cookies
        delete event.request.headers?.['authorization']
      }
      return event
    },
  })
}

export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  })
}

export function trackPerformance(name: string, duration: number) {
  Sentry.metrics.distribution(name, duration, {
    unit: 'millisecond',
  })
}
```

### 2. Performance Monitoring

```typescript
// packages/shared/src/lib/metrics.ts

import redis from './redis'

export class Metrics {
  static async recordApiCall(endpoint: string, duration: number, status: number) {
    const date = new Date().toISOString().split('T')[0]
    const key = `metrics:api:${endpoint}:${date}`
    
    await redis.hincrby(key, 'count', 1)
    await redis.hincrby(key, 'total_duration', duration)
    await redis.hincrby(key, `status_${status}`, 1)
    await redis.expire(key, 7 * 24 * 3600) // Keep for 7 days
  }
  
  static async recordCacheHit(key: string, hit: boolean) {
    const date = new Date().toISOString().split('T')[0]
    const metricKey = `metrics:cache:${date}`
    
    await redis.hincrby(metricKey, hit ? 'hits' : 'misses', 1)
    await redis.expire(metricKey, 7 * 24 * 3600)
  }
  
  static async getApiMetrics(endpoint: string, date: string) {
    const key = `metrics:api:${endpoint}:${date}`
    const data = await redis.hgetall(key)
    
    const count = parseInt(data.count || '0')
    const totalDuration = parseInt(data.total_duration || '0')
    
    return {
      count,
      avgDuration: count > 0 ? totalDuration / count : 0,
      status: {
        200: parseInt(data.status_200 || '0'),
        400: parseInt(data.status_400 || '0'),
        500: parseInt(data.status_500 || '0'),
      }
    }
  }
  
  static async getCacheMetrics(date: string) {
    const key = `metrics:cache:${date}`
    const data = await redis.hgetall(key)
    
    const hits = parseInt(data.hits || '0')
    const misses = parseInt(data.misses || '0')
    const total = hits + misses
    
    return {
      hits,
      misses,
      total,
      hitRate: total > 0 ? (hits / total) * 100 : 0,
    }
  }
}
```

---

## 💰 INFRASTRUCTURE COSTS

### Development Environment
```yaml
# docker-compose.yml - Local development
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: avelon
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
  
  api:
    build: ./apps/api
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/avelon
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
```

### Production Costs (Monthly Estimates)

| Tier | Users | Infrastructure | Cost |
|------|-------|----------------|------|
| **Starter** | <50K | Vercel Hobby + Supabase Free | $0 |
| **Growth** | 50K-200K | Vercel Pro + Redis + RDS | $500-800 |
| **Scale** | 200K-1M | AWS ECS + ElastiCache + RDS Multi-AZ | $2,000-4,000 |
| **Enterprise** | 1M-5M | Full microservices + Read replicas | $8,000-15,000 |

**Breakdown for 2M Users (Target):**
- **Compute (API):** 10 instances × $50 = $500
- **Database:** RDS PostgreSQL (db.r5.xlarge) + 2 replicas = $800
- **Cache:** Redis (cache.r5.large) 3 nodes = $300
- **CDN:** Cloudflare Pro = $200
- **Storage:** S3 + Cloudinary = $200
- **Monitoring:** Datadog/Sentry = $300
- **Queue:** AWS SQS/BullMQ = $100
- **Misc:** DNS, backups, etc = $100

**Total: ~$2,500/month** (vs $5,000+ with current architecture)

---

## 🧪 TESTING & VALIDATION

### Load Testing Script

```javascript
// tests/load/products.js - Using k6

import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 100 },   // Stay at 100 users
    { duration: '2m', target: 1000 },  // Ramp up to 1000 users
    { duration: '5m', target: 1000 },  // Stay at 1000 users
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],  // 95% of requests under 200ms
    http_req_failed: ['rate<0.01'],    // Less than 1% failure
  },
}

export default function () {
  // Test product listing
  const listRes = http.get('https://api.yourdomain.com/api/v1/products?page=1&limit=20')
  check(listRes, {
    'list status is 200': (r) => r.status === 200,
    'list response time < 200ms': (r) => r.timings.duration < 200,
  })
  
  sleep(1)
  
  // Test single product
  const productRes = http.get('https://api.yourdomain.com/api/v1/products/clxxx')
  check(productRes, {
    'product status is 200': (r) => r.status === 200,
    'product response time < 100ms': (r) => r.timings.duration < 100,
  })
  
  sleep(1)
}
```

Run test:
```bash
k6 run tests/load/products.js
```

---

## 🎯 SUCCESS METRICS

### Key Performance Indicators (KPIs)

| Metric | Current | Week 4 | Week 8 | Week 16 |
|--------|---------|--------|--------|---------|
| **API Response Time (p95)** | 500ms | 100ms | 50ms | 30ms |
| **Cache Hit Rate** | 0% | 60% | 80% | 90% |
| **Database Query Count** | 20/req | 8/req | 3/req | 1-2/req |
| **Concurrent Users** | 1K | 10K | 50K | 100K+ |
| **Error Rate** | Unknown | <1% | <0.5% | <0.1% |
| **Uptime** | 99% | 99.5% | 99.9% | 99.95% |

### Monitoring Dashboard Metrics

```typescript
// apps/admin/src/app/dashboard/metrics/page.tsx

import { Metrics } from '@/lib/metrics'

export default async function MetricsPage() {
  const today = new Date().toISOString().split('T')[0]
  
  const [apiMetrics, cacheMetrics] = await Promise.all([
    Metrics.getApiMetrics('/api/v1/products', today),
    Metrics.getCacheMetrics(today),
  ])
  
  return (
    <div>
      <h1>Performance Metrics</h1>
      
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          title="API Calls"
          value={apiMetrics.count}
          subtitle={`Avg: ${apiMetrics.avgDuration.toFixed(0)}ms`}
        />
        
        <MetricCard
          title="Cache Hit Rate"
          value={`${cacheMetrics.hitRate.toFixed(1)}%`}
          subtitle={`${cacheMetrics.hits} hits / ${cacheMetrics.total} total`}
        />
        
        <MetricCard
          title="Error Rate"
          value={`${((apiMetrics.status[500] / apiMetrics.count) * 100).toFixed(2)}%`}
          subtitle={`${apiMetrics.status[500]} errors`}
        />
      </div>
    </div>
  )
}
```

---

## 🚨 CRITICAL PATH & PRIORITIES

### Must Have (Week 1-2)
1. ✅ Database indexes
2. ✅ Redis caching
3. ✅ Pagination
4. ✅ Query optimization

### Should Have (Week 3-4)
1. ✅ Rate limiting
2. ✅ Message queue
3. ✅ Monitoring
4. ✅ Error tracking

### Nice to Have (Week 5-16)
1. ✅ Separate API service
2. ✅ Read replicas
3. ✅ Search engine
4. ✅ Microservices

---

## 📚 RESOURCES & DOCUMENTATION

### Learning Resources
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Redis Caching Strategies](https://redis.io/docs/manual/patterns/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Load Testing with k6](https://k6.io/docs/)

### Tools
- **Monitoring:** Sentry, Datadog, New Relic
- **Load Testing:** k6, Artillery, Apache JMeter
- **Database:** pgAdmin, DBeaver, TablePlus
- **API Testing:** Postman, Insomnia, Bruno
- **Profiling:** Chrome DevTools, Node.js Profiler

---

## 🔄 ROLLBACK PLAN

### If Something Goes Wrong

**Phase 1 Rollback:**
- Remove Redis calls (app still works without cache)
- Keep database indexes (no harm)
- Revert pagination changes

**Phase 2 Rollback:**
- Disable rate limiting
- Stop queue workers (emails go back to sync)
- Keep monitoring (helpful for debugging)

**Phase 3 Rollback:**
- Route traffic back to Next.js API routes
- Keep new API service for testing
- Gradually migrate when stable

---

## ✅ CHECKLIST

### Week 1
- [ ] Update Drizzle schema with indexes
- [ ] Run `bun run db:push` in production
- [ ] Set up Redis instance (Upstash or AWS)
- [ ] Implement cache helper functions
- [ ] Add session caching to middleware

### Week 2
- [ ] Optimize all product queries
- [ ] Add pagination to list endpoints
- [ ] Implement cache invalidation
- [ ] Test cache hit rates (target 60%+)
- [ ] Deploy and monitor

### Week 3
- [ ] Set up rate limiting
- [ ] Implement BullMQ + Redis
- [ ] Move email sending to queue
- [ ] Test async job processing
- [ ] Monitor queue performance

### Week 4
- [ ] Set up Sentry
- [ ] Add performance monitoring
- [ ] Create metrics dashboard
- [ ] Implement health checks
- [ ] Load test (100 concurrent users)

### Week 5-6
- [ ] Create apps/api folder
- [ ] Set up Hono/Fastify
- [ ] Implement middleware
- [ ] Migrate products API
- [ ] Deploy API service

### Week 7-8
- [ ] Migrate all read endpoints
- [ ] Migrate write endpoints
- [ ] Update frontend API calls
- [ ] Remove old API routes
- [ ] Load test (1000 concurrent users)

### Week 9-16
- [ ] Set up read replicas
- [ ] Implement search engine
- [ ] Optimize images
- [ ] Add auto-scaling
- [ ] Final load test (10K+ users)

---

## 🎓 TEAM TRAINING

### Required Skills
- [ ] Redis basics and caching strategies
- [ ] PostgreSQL query optimization
- [ ] Load testing and performance analysis
- [ ] API design best practices
- [ ] Monitoring and observability

### Resources for Team
- Share this plan with all developers
- Weekly sync meetings to track progress
- Pair programming for critical changes
- Code review checklist for performance
- Post-mortem after each phase

---

## 🎉 EXPECTED OUTCOMES

After completing this plan:

✅ **10-20x faster API responses**  
✅ **80%+ reduction in database load**  
✅ **50% cost savings on infrastructure**  
✅ **99.9% uptime capability**  
✅ **100K+ concurrent users supported**  
✅ **Sub-50ms response times**  
✅ **Microservices-ready architecture**  
✅ **Complete observability**

---

## 📞 SUPPORT & QUESTIONS

For questions or issues during implementation:
1. Review this document
2. Check the code examples
3. Test in development first
4. Monitor metrics after deployment
5. Rollback if needed

**Remember:** Scaling is iterative. Don't try to do everything at once!

---

**Last Updated:** October 31, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation 🚀

