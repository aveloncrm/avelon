import db from '@/lib/db'
import { payments, paymentProviders, users, orders } from '@/db/schema'
import { eq, and, count, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json()

      const {
         status,
         refId,
         cardPan,
         cardHash,
         fee,
         isSuccessful,
         payable,
         providerId,
         userId: paymentUserId,
         orderId
      } = body

      // Validate required fields
      if (!status || !refId || !payable || !providerId || !paymentUserId || !orderId) {
         return new NextResponse('Status, refId, payable, providerId, userId, and orderId are required', { status: 400 })
      }

      // Check if provider exists
      const [provider] = await db
         .select()
         .from(paymentProviders)
         .where(eq(paymentProviders.id, providerId))
         .limit(1)

      if (!provider) {
         return new NextResponse('Payment provider not found', { status: 404 })
      }

      // Check if user exists
      const [user] = await db
         .select()
         .from(users)
         .where(eq(users.id, paymentUserId))
         .limit(1)

      if (!user) {
         return new NextResponse('User not found', { status: 404 })
      }

      // Check if order exists
      const [order] = await db
         .select()
         .from(orders)
         .where(eq(orders.id, orderId))
         .limit(1)

      if (!order) {
         return new NextResponse('Order not found', { status: 404 })
      }

      const [payment] = await db
         .insert(payments)
         .values({
            status,
            refId,
            cardPan: cardPan || null,
            cardHash: cardHash || null,
            fee: fee || null,
            isSuccessful: isSuccessful || false,
            payable,
            providerId,
            userId: paymentUserId,
            orderId,
            storeId: order.storeId,
         })
         .returning()

      // Fetch with relations
      const paymentWithRelations = await db.query.payments.findFirst({
         where: eq(payments.id, payment.id),
         with: {
            provider: true,
            user: true,
            order: true,
         },
      })

      return NextResponse.json(paymentWithRelations)
   } catch (error: any) {
      console.error('[PAYMENTS_POST]', error)

      if (error.code === '23505') { // Unique constraint violation in PostgreSQL
         return new NextResponse('Reference ID already exists', { status: 400 })
      }

      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const storeId = req.headers.get('X-STORE-ID')

      if (!storeId) {
         return new NextResponse('Store context required', { status: 400 })
      }

      const { searchParams } = new URL(req.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const status = searchParams.get('status') || undefined
      const isSuccessful = searchParams.get('isSuccessful') === 'true' ? true : searchParams.get('isSuccessful') === 'false' ? false : undefined
      const providerId = searchParams.get('providerId') || undefined

      // Build where conditions
      const conditions = []
      if (status) {
         conditions.push(eq(payments.status, status as any))
      }

      conditions.push(eq(payments.storeId, storeId))
      if (isSuccessful !== undefined) {
         conditions.push(eq(payments.isSuccessful, isSuccessful))
      }
      if (providerId) {
         conditions.push(eq(payments.providerId, providerId))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      const paymentsResult = await db.query.payments.findMany({
         where: whereClause,
         with: {
            provider: true,
            user: true,
            order: {
               with: {
                  orderItems: {
                     with: {
                        product: true,
                     },
                  },
               },
            },
         },
         limit,
         offset: (page - 1) * limit,
         orderBy: [desc(payments.createdAt)],
      })

      const [{ value: total }] = await db
         .select({ value: count() })
         .from(payments)
         .where(whereClause)

      return NextResponse.json({
         payments: paymentsResult,
         pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
         },
      })
   } catch (error) {
      console.error('[PAYMENTS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
