import db from '@/lib/db'
import { addresses } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: Promise<{ addressId: string }> }
) {
   try {
      const { addressId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!addressId) {
         return new NextResponse('addressId is required', { status: 400 })
      }

      const address = await db.query.addresses.findFirst({
         where: and(
            eq(addresses.userId, userId),
            eq(addresses.id, addressId)
         ),
      })

      if (!address) {
         return new NextResponse('Address not found', { status: 404 })
      }

      return NextResponse.json(address)
   } catch (error) {
      console.error('[ADDRESS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
