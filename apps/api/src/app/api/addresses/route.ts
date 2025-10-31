import db from '@/lib/db'
import { addresses } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const addressesList = await db
         .select()
         .from(addresses)
         .where(eq(addresses.userId, userId))

      return NextResponse.json(addressesList)
   } catch (error) {
      console.error('[ADDRESSES_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { address, city, phone, postalCode } = await req.json()

      const [object] = await db
         .insert(addresses)
         .values({
            userId,
            city,
            address,
            phone,
            postalCode,
         })
         .returning()

      return NextResponse.json(object)
   } catch (error) {
      console.error('[ADDRESS_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
