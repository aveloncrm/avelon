import { verifyJWT } from '@/lib/jwt'
import { getErrorResponse } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
   // Allow auth routes without authentication
   if (req.nextUrl.pathname.startsWith('/api/auth')) {
      return NextResponse.next()
   }

   // Public API routes that don't require authentication
   const publicApiRoutes = [
      '/api/products',
      '/api/categories', 
      '/api/brands'
   ]
   
   // Check if this is a public API route (GET requests only)
   if (req.method === 'GET' && publicApiRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      return NextResponse.next()
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
      if (isTargetingAPI()) return getErrorResponse(401, 'INVALID TOKEN')
      return getErrorResponse(401, 'UNAUTHORIZED')
   }

   const response = NextResponse.next()

   try {
      const { sub } = await verifyJWT<{ sub: string }>(token)
      response.headers.set('X-USER-ID', sub)
   } catch {
      if (isTargetingAPI()) {
         return getErrorResponse(401, 'UNAUTHORIZED')
      }
      return getErrorResponse(401, 'INVALID TOKEN')
   }

   return response
}

export const config = {
   matcher: ['/api/:path*'],
}

