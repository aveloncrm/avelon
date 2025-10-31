import config from '@/config/site'
import Mail from '@/emails/verify'
import db from '@/lib/db'
import { owners } from '@/db/schema'
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
         // Check if owner exists
         const existingOwner = await db.query.owners.findFirst({
            where: eq(owners.email, email),
         })

         if (existingOwner) {
            // Update existing owner
            await db
               .update(owners)
               .set({ OTP })
               .where(eq(owners.email, email))
         } else {
            // Create new owner
            await db.insert(owners).values({
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
