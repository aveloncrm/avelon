import db from '@/lib/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const [user] = await db
         .update(users)
         .set({
            isPhoneSubscribed: true,
         })
         .where(eq(users.id, userId))
         .returning()

      return NextResponse.json({
         phone: user.phone,
         isPhoneSubscribed: user.isPhoneSubscribed,
      })
   } catch (error: any) {
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const [user] = await db
         .update(users)
         .set({
            isPhoneSubscribed: false,
         })
         .where(eq(users.id, userId))
         .returning()

      return NextResponse.json({
         phone: user.phone,
         isPhoneSubscribed: user.isPhoneSubscribed,
      })
   } catch (error: any) {
      return new NextResponse('Internal error', { status: 500 })
   }
}
