import db from '@/lib/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateSerial } from '@/lib/serial'
import { getErrorResponse } from '@/lib/utils'
import { sendSMS } from '@persepolis/sms'
import { isPhoneNumberValid } from '@persepolis/regex'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
   try {
      const OTP = generateSerial({})

      const { phone } = await req.json()

      if (isPhoneNumberValid(phone)) {
         // Check if user exists
         const existingUser = await db.query.users.findFirst({
            where: eq(users.phone, phone),
         })

         if (existingUser) {
            // Update existing user
            await db
               .update(users)
               .set({ OTP })
               .where(eq(users.phone, phone))
         } else {
            // Create new user
            await db.insert(users).values({
               phone,
               OTP,
            })
         }

         await sendSMS({
            to: phone,
            message: `Your verification code is: ${OTP}`,
         })

         return new NextResponse(
            JSON.stringify({
               status: 'success',
               phone,
            }),
            {
               status: 200,
               headers: { 'Content-Type': 'application/json' },
            }
         )
      }

      if (!isPhoneNumberValid(phone)) {
         return getErrorResponse(400, 'Incorrect Phone Number')
      }
   } catch (error: any) {
      console.error(error)
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}
