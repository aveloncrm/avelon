import db from '@/lib/db'
import { wishlist, users, products } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const wishlistItems = await db.query.wishlist.findMany({
         where: eq(wishlist.userId, userId),
         with: {
            product: true,
         },
      })

      // Transform to match expected format
      const productsList = wishlistItems.map(item => item.product)

      return NextResponse.json(productsList)
   } catch (error) {
      console.error('[WISHLIST_GET]', error)
      return NextResponse.json({ error: 'Internal error' }, { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { productId } = await req.json()

      // Add to wishlist
      await db.insert(wishlist).values({
         userId,
         productId,
      }).onConflictDoNothing()

      // Get updated wishlist
      const wishlistItems = await db.query.wishlist.findMany({
         where: eq(wishlist.userId, userId),
         with: {
            product: true,
         },
      })

      const productsList = wishlistItems.map(item => item.product)

      return NextResponse.json(productsList)
   } catch (error) {
      console.error('[WISHLIST_POST]', error)
      return NextResponse.json({ error: 'Internal error' }, { status: 500 })
   }
}

export async function DELETE(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { productId } = await req.json()

      // Remove from wishlist
      await db
         .delete(wishlist)
         .where(
            and(
               eq(wishlist.userId, userId),
               eq(wishlist.productId, productId)
            )
         )

      // Get updated wishlist
      const wishlistItems = await db.query.wishlist.findMany({
         where: eq(wishlist.userId, userId),
         with: {
            product: true,
         },
      })

      const productsList = wishlistItems.map(item => item.product)

      return NextResponse.json(productsList)
   } catch (error) {
      console.error('[WISHLIST_DELETE]', error)
      return NextResponse.json({ error: 'Internal error' }, { status: 500 })
   }
}
