import db from '@/lib/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: Promise<{ userId: string }> }
) {
   try {
      const { userId: userIdParam } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!userIdParam) {
         return new NextResponse('User ID is required', { status: 400 })
      }

      const user = await db.query.users.findFirst({
         where: eq(users.id, userIdParam),
         with: {
            orders: {
               with: {
                  orderItems: {
                     with: {
                        product: true,
                     },
                  },
               },
               orderBy: (orders, { desc }) => [desc(orders.createdAt)],
            },
            addresses: true,
            cart: {
               with: {
                  items: {
                     with: {
                        product: true,
                     },
                  },
               },
            },
            wishlist: {
               with: {
                  product: true,
               },
            },
            productReviews: {
               with: {
                  product: true,
               },
               orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
            },
         },
      })

      if (!user) {
         return new NextResponse('User not found', { status: 404 })
      }

      // Transform wishlist to match expected format
      const transformedUser = {
         ...user,
         wishlist: user.wishlist.map(item => item.product),
      }

      return NextResponse.json(transformedUser)
   } catch (error) {
      console.error('[USER_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: Promise<{ userId: string }> }
) {
   try {
      const { userId: userIdParam } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!userIdParam) {
         return new NextResponse('User ID is required', { status: 400 })
      }

      const body = await req.json()

      const {
         email,
         phone,
         name,
         birthday,
         isBanned,
         isEmailVerified,
         isPhoneVerified,
         isEmailSubscribed,
         isPhoneSubscribed
      } = body

      // Check if user exists
      const existingUser = await db.query.users.findFirst({
         where: eq(users.id, userIdParam),
      })

      if (!existingUser) {
         return new NextResponse('User not found', { status: 404 })
      }

      const updateData: any = {}
      if (email !== undefined) updateData.email = email
      if (phone !== undefined) updateData.phone = phone
      if (name !== undefined) updateData.name = name
      if (birthday !== undefined) updateData.birthday = birthday
      if (isBanned !== undefined) updateData.isBanned = isBanned
      if (isEmailVerified !== undefined) updateData.isEmailVerified = isEmailVerified
      if (isPhoneVerified !== undefined) updateData.isPhoneVerified = isPhoneVerified
      if (isEmailSubscribed !== undefined) updateData.isEmailSubscribed = isEmailSubscribed
      if (isPhoneSubscribed !== undefined) updateData.isPhoneSubscribed = isPhoneSubscribed

      const [updatedUser] = await db
         .update(users)
         .set(updateData)
         .where(eq(users.id, userIdParam))
         .returning()

      // Fetch with relations
      const userWithRelations = await db.query.users.findFirst({
         where: eq(users.id, updatedUser.id),
         with: {
            orders: true,
            addresses: true,
         },
      })

      return NextResponse.json(userWithRelations)
   } catch (error: any) {
      console.error('[USER_PATCH]', error)

      if (error.code === '23505') { // Unique constraint violation
         return new NextResponse('Email or phone already exists', { status: 400 })
      }

      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: Promise<{ userId: string }> }
) {
   try {
      const { userId: userIdParam } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!userIdParam) {
         return new NextResponse('User ID is required', { status: 400 })
      }

      // Check if user exists
      const existingUser = await db.query.users.findFirst({
         where: eq(users.id, userIdParam),
      })

      if (!existingUser) {
         return new NextResponse('User not found', { status: 404 })
      }

      const [user] = await db
         .delete(users)
         .where(eq(users.id, userIdParam))
         .returning()

      return NextResponse.json(user)
   } catch (error) {
      console.error('[USER_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
