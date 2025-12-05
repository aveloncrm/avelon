import db from '@/lib/db'
import { carts, cartItems } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const cart = await db.query.carts.findFirst({
         where: eq(carts.userId, userId),
         with: {
            items: {
               with: {
                  product: {
                     with: {
                        brand: true,
                        categories: {
                           with: {
                              category: true,
                           },
                        },
                     },
                  },
               },
            },
         },
      })

      if (!cart) {
         return new NextResponse('Cart not found', { status: 404 })
      }

      // Transform categories to match expected format
      const transformedCart = {
         ...cart,
         items: cart.items.map(item => ({
            ...item,
            product: {
               ...item.product,
               categories: item.product.categories.map(pc => pc.category),
            },
         })),
      }

      return NextResponse.json(transformedCart)
   } catch (error) {
      console.error('[GET_CART]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { productId, count: newCount } = await req.json()
      const storeId = req.headers.get('X-STORE-ID') || 'default-store-001'

      if (newCount < 1) {
         // Delete cart item
         await db
            .delete(cartItems)
            .where(
               and(
                  eq(cartItems.cartId, userId),
                  eq(cartItems.productId, productId)
               )
            )
      } else {
         // Check if cart exists
         const existingCart = await db.query.carts.findFirst({
            where: eq(carts.userId, userId),
         })

         // Create cart if it doesn't exist
         if (!existingCart) {
            await db.insert(carts).values({ storeId, userId })
         }

         // Check if cart item exists
         const existingCartItem = await db.query.cartItems.findFirst({
            where: and(
               eq(cartItems.cartId, userId),
               eq(cartItems.productId, productId)
            ),
         })

         if (existingCartItem) {
            // Update existing cart item
            await db
               .update(cartItems)
               .set({ count: newCount })
               .where(
                  and(
                     eq(cartItems.cartId, userId),
                     eq(cartItems.productId, productId)
                  )
               )
         } else {
            // Insert new cart item
            await db.insert(cartItems).values({
               cartId: userId,
               productId,
               count: newCount,
            })
         }
      }

      // Fetch updated cart
      const cart = await db.query.carts.findFirst({
         where: eq(carts.userId, userId),
         with: {
            items: {
               with: {
                  product: true,
               },
            },
         },
      })

      return NextResponse.json(cart)
   } catch (error) {
      console.error('[CART_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
