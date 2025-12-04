import config from '@/config/site'
import Mail from '@/emails/verify'
import db from '@/lib/db'
import { merchants } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateSerial } from '@/lib/serial'
import { getErrorResponse } from '@/lib/utils'
import { sendMail } from '@persepolis/mail'
import { isEmailValid } from '@persepolis/regex'
import { render } from '@react-email/render'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
   try {
      const OTP = generateSerial({})

      const { email } = await req.json()

      if (isEmailValid(email)) {
         // Check if merchant exists
         const existingMerchant = await db.query.merchants.findFirst({
            where: eq(merchants.email, email),
         })

         if (existingMerchant) {
            // Update existing merchant
            await db
               .update(merchants)
               .set({ OTP })
               .where(eq(merchants.email, email))
         } else {
            // Create new merchant
            await db.insert(merchants).values({
               email,
               OTP,
            })
         }

         await sendMail({
            name: config.name,
            to: email,
            subject: 'Verify your email.',
            html: await render(Mail({ code: OTP, name: config.name })),
         })

         return new NextResponse(
            JSON.stringify({
               status: 'success',
               email,
            }),
            {
               status: 200,
               headers: { 'Content-Type': 'application/json' },
            }
         )
      }

      if (!isEmailValid(email)) {
         return getErrorResponse(400, 'Incorrect Email')
      }
   } catch (error: any) {
      console.error(error)
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}
