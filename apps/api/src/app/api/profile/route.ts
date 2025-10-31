import db from '@/lib/db'
import { users } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const user = await db.query.users.findFirst({
         where: and(
            eq(users.id, userId),
            eq(users.isEmailVerified, true)
         ),
         with: {
            cart: {
               with: {
                  items: {
                     with: {
                        product: true,
                     },
                  },
               },
            },
            addresses: true,
            wishlist: {
               with: {
                  product: true,
               },
            },
         },
      })

      if (!user) {
         return new NextResponse('User not found', { status: 404 })
      }

      // Transform wishlist to match expected format
      const wishlistProducts = user.wishlist.map(item => item.product)

      return NextResponse.json({
         phone: user.phone,
         email: user.email,
         name: user.name,
         birthday: user.birthday,
         addresses: user.addresses,
         wishlist: wishlistProducts,
         cart: user.cart,
      })
   } catch (error) {
      console.error('[PROFILE_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
