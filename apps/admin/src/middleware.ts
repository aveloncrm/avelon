import { verifyJWT } from '@/lib/jwt'
import { getErrorResponse } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
   // Only protect API routes - page routes are protected client-side
   if (!req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.next()
   }

   // Allow auth routes without authentication
   if (req.nextUrl.pathname.startsWith('/api/auth')) {
      return NextResponse.next()
   }

   function getToken() {
      // Only check Authorization header - no cookies
      const authHeader = req.headers.get('Authorization')
      if (authHeader?.startsWith('Bearer ')) {
         return authHeader.substring(7)
      }
      return undefined
   }

   if (!process.env.JWT_SECRET_KEY) {
      console.error('JWT secret key is missing')
      return getErrorResponse(500, 'Internal Server Error')
   }

   const token = getToken()

   if (!token) {
      return getErrorResponse(401, 'INVALID TOKEN')
   }

   const response = NextResponse.next()

   try {
      const { sub } = await verifyJWT<{ sub: string }>(token)
      response.headers.set('X-USER-ID', sub)
   } catch {
         return getErrorResponse(401, 'UNAUTHORIZED')
   }

   return response
}

export const config = {
   matcher: [
      '/api/:path*', // Only protect API routes
   ],
}
