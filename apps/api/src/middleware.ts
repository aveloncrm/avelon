import { verifyJWT } from '@/lib/jwt'
import { getErrorResponse } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'



function handleCors(req: NextRequest, response: NextResponse) {
   const origin = req.headers.get('origin')

   // Check if origin is allowed
   // For local development, we'll be permissive if the origin is present
   if (origin) {
      // In production, you should check against ALLOWED_ORIGINS
      // if (ALLOWED_ORIGINS.includes(origin)) { ... }

      // For now, allow all origins that send a request
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-USER-ID, X-STORE-ID')
   }

   return response
}

export async function middleware(req: NextRequest) {
   // Handle CORS preflight requests
   if (req.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 201 })
      return handleCors(req, response)
   }

   // Allow auth routes without authentication (except /me which needs auth)
   if (req.nextUrl.pathname.startsWith('/api/auth') && !req.nextUrl.pathname.includes('/api/auth/me')) {
      const response = NextResponse.next()
      return handleCors(req, response)
   }

   // Internal routes - skip middleware logic
   if (req.nextUrl.pathname.startsWith('/api/internal')) {
      return NextResponse.next()
   }

   // Public API routes that don't require authentication
   const publicApiRoutes = [
      '/api/products',
      '/api/categories',
      '/api/brands',
      '/api/banners'
   ]

   // Check if this is a public API route (GET requests only)
   if (req.method === 'GET' && publicApiRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      const response = NextResponse.next()

      // Dynamic store resolution
      if (!req.headers.get('X-STORE-ID')) {
         try {
            // Call internal API to resolve store from subdomain
            // We use fetch here because we can't access DB directly in Edge Middleware
            const host = req.headers.get('host') || ''
            const protocol = req.nextUrl.protocol
            const resolveUrl = `${protocol}//${host}/api/internal/resolve-store?host=${host}`

            const res = await fetch(resolveUrl)
            if (res.ok) {
               const data = await res.json()
               if (data.storeId) {
                  response.headers.set('X-STORE-ID', data.storeId)
               } else {
                  response.headers.set('X-STORE-ID', 'default-store-001')
               }
            } else {
               response.headers.set('X-STORE-ID', 'default-store-001')
            }
         } catch (e) {
            console.error('Middleware store resolution failed:', e)
            response.headers.set('X-STORE-ID', 'default-store-001')
         }
      }
      return handleCors(req, response)
   }

   function isTargetingAPI() {
      return req.nextUrl.pathname.startsWith('/api')
   }

   function getToken() {
      let token: string | undefined

      if (req.cookies.has('token')) {
         token = req.cookies.get('token')?.value
      } else if (req.headers.get('Authorization')?.startsWith('Bearer ')) {
         token = req.headers.get('Authorization')?.substring(7)
      }

      return token
   }

   if (!process.env.JWT_SECRET_KEY) {
      console.error('JWT secret key is missing')
      return getErrorResponse(500, 'Internal Server Error')
   }

   const token = getToken()

   if (!token) {
      const response = isTargetingAPI()
         ? getErrorResponse(401, 'INVALID TOKEN')
         : getErrorResponse(401, 'UNAUTHORIZED')
      return handleCors(req, response)
   }

   const response = NextResponse.next()

   try {
      const { sub } = await verifyJWT<{ sub: string }>(token)
      response.headers.set('X-USER-ID', sub)

      // Dynamic store resolution for authenticated routes
      if (!req.headers.get('X-STORE-ID')) {
         try {
            const host = req.headers.get('host') || ''
            const protocol = req.nextUrl.protocol
            const resolveUrl = `${protocol}//${host}/api/internal/resolve-store?host=${host}`

            const res = await fetch(resolveUrl)
            if (res.ok) {
               const data = await res.json()
               if (data.storeId) {
                  response.headers.set('X-STORE-ID', data.storeId)
               } else {
                  response.headers.set('X-STORE-ID', 'default-store-001')
               }
            } else {
               response.headers.set('X-STORE-ID', 'default-store-001')
            }
         } catch (e) {
            console.error('Middleware store resolution failed:', e)
            response.headers.set('X-STORE-ID', 'default-store-001')
         }
      }
   } catch {
      const errorResponse = isTargetingAPI()
         ? getErrorResponse(401, 'UNAUTHORIZED')
         : getErrorResponse(401, 'INVALID TOKEN')
      return handleCors(req, errorResponse)
   }

   return handleCors(req, response)
}

export const config = {
   matcher: ['/api/:path*'],
}

