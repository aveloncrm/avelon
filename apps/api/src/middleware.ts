import { verifyJWT } from '@/lib/jwt'
import { getErrorResponse } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

// Hardcoded allowed origins for CORS
const ALLOWED_ORIGINS = [
   'http://localhost:8888', // Admin panel
   'http://localhost:3000', // Storefront (if needed)
   'https://avelon-admin.vercel.app',
   'https://admin.avelon.galamine.com'
]

function handleCors(req: NextRequest, response: NextResponse) {
   const origin = req.headers.get('origin')

   // Check if origin is allowed
   if (origin && ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-USER-ID')
   }

   return response
}

export async function middleware(req: NextRequest) {
   // Handle CORS preflight requests
   if (req.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 201 })
      return handleCors(req, response)
   }

   // Allow auth routes without authentication
   if (req.nextUrl.pathname.startsWith('/api/auth')) {
      const response = NextResponse.next()
      return handleCors(req, response)
   }

   // Public API routes that don't require authentication
   const publicApiRoutes = [
      '/api/products',
      '/api/categories',
      '/api/brands'
   ]

   // Check if this is a public API route (GET requests only)
   if (req.method === 'GET' && publicApiRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      const response = NextResponse.next()
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

