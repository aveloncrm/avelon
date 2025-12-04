import { signJWT } from '@/lib/jwt'
import db from '@/lib/db'
import { merchants } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { getErrorResponse } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
   try {
      const expiryMinutes = 30 * 24 * 60

      const { email: emailInput, OTP } = await req.json()
      let email = emailInput

      email = email.toString().toLowerCase()

      if (!process.env.JWT_SECRET_KEY) {
         console.error('JWT secret key is missing')
         return getErrorResponse(500, 'Internal Server Error')
      }

      const merchant = await db.query.merchants.findFirst({
         where: and(
            eq(merchants.email, email),
            eq(merchants.OTP, OTP)
         ),
      })

      if (!merchant) {
         return getErrorResponse(401, 'Invalid credentials')
      }

      const token = await signJWT(
         { sub: merchant.id },
         { exp: `${expiryMinutes}m` }
      )

      const response = new NextResponse(
         JSON.stringify({
            status: 'success',
            token,
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      )

      return response
   } catch (error: any) {
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}
