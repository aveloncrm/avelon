import config from '@/config/site'
import Mail from '@/emails/order_notification_owner'
import db from '@/lib/db'
import { orders, carts, discountCodes, owners, notifications, orderItems } from '@/db/schema'
import { eq, and, gte, count, desc } from 'drizzle-orm'
import { sendMail } from '@persepolis/mail'
import { render } from '@react-email/render'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { searchParams } = new URL(req.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const status = searchParams.get('status') || undefined
      const isPaid = searchParams.get('isPaid') === 'true' ? true : searchParams.get('isPaid') === 'false' ? false : undefined
      const adminView = searchParams.get('adminView') === 'true'

      // Build where conditions
      const conditions = []
      if (!adminView) {
         conditions.push(eq(orders.userId, userId))
      }
      if (status) {
         conditions.push(eq(orders.status, status as any))
      }
      if (isPaid !== undefined) {
         conditions.push(eq(orders.isPaid, isPaid))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      const ordersResult = await db.query.orders.findMany({
         where: whereClause,
         with: {
            ...(adminView && { user: true }),
            address: true,
            payments: true,
            refund: true,
            orderItems: {
               with: {
                  product: true,
               },
            },
         },
         limit,
         offset: (page - 1) * limit,
         orderBy: [desc(orders.createdAt)],
      })

      const [{ value: total }] = await db
         .select({ value: count() })
         .from(orders)
         .where(whereClause)

      return NextResponse.json({
         orders: ordersResult,
         pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
         },
      })
   } catch (error) {
      console.error('[ORDERS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json()
      const { addressId, discountCode, adminCreate } = body

      // Admin creating order manually
      if (adminCreate) {
         const {
            status,
            total,
            shipping,
            payable,
            tax,
            discount,
            isPaid,
            isCompleted,
            userId: orderUserId,
            addressId,
            discountCodeId
         } = body

         if (!status || !orderUserId) {
            return new NextResponse('Status and user ID are required', { status: 400 })
         }

         const [order] = await db
            .insert(orders)
            .values({
               status,
               total: total || 0,
               shipping: shipping || 0,
               payable: payable || 0,
               tax: tax || 0,
               discount: discount || 0,
               isPaid: isPaid || false,
               isCompleted: isCompleted || false,
               userId: orderUserId,
               addressId: addressId || null,
               discountCodeId: discountCodeId || null,
            })
            .returning()

         // Fetch with relations
         const orderWithRelations = await db.query.orders.findFirst({
            where: eq(orders.id, order.id),
            with: {
               user: true,
               address: true,
               orderItems: {
                  with: {
                     product: true,
                  },
               },
            },
         })

         return NextResponse.json(orderWithRelations)
      }

      // Customer creating order from cart
      if (discountCode) {
         const discountCodeRecord = await db.query.discountCodes.findFirst({
            where: and(
               eq(discountCodes.code, discountCode),
               gte(discountCodes.stock, 1)
            ),
         })

         if (!discountCodeRecord) {
            return new NextResponse('Invalid or out of stock discount code', { status: 400 })
         }
      }

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

      if (!cart) {
         return new NextResponse('Cart not found', { status: 404 })
      }

      const { tax, total, discount, payable } = calculateCosts({ cart })

      const [order] = await db
         .insert(orders)
         .values({
            userId,
            status: 'Processing',
            total,
            tax,
            payable,
            discount,
            shipping: 0,
            addressId,
         })
         .returning()

      // Create order items
      for (const item of cart.items) {
         await db.insert(orderItems).values({
            orderId: order.id,
            productId: item.productId,
            count: item.count,
            price: item.product.price,
            discount: item.product.discount,
         })
      }

      const ownersList = await db.select().from(owners)

      // Create notifications
      await db.insert(notifications).values(
         ownersList.map((owner) => ({
            userId: owner.id,
            content: `Order #${order.number} was created was created with a value of $${payable}.`,
         }))
      )

      for (const owner of ownersList) {
         await sendMail({
            name: config.name,
            to: owner.email,
            subject: 'An order was created.',
            html: await render(
               Mail({
                  id: order.id,
                  payable: payable.toFixed(2),
                  orderNum: order.number.toString(),
               })
            ),
         })
      }

      return NextResponse.json(order)
   } catch (error) {
      console.error('[ORDER_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

function calculateCosts({ cart }: { cart: any }) {
   let total = 0,
      discount = 0

   for (const item of cart?.items) {
      total += item?.count * item?.product?.price
      discount += item?.count * item?.product?.discount
   }

   const afterDiscount = total - discount
   const tax = afterDiscount * 0.09
   const payable = afterDiscount + tax

   return {
      total: parseFloat(total.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      afterDiscount: parseFloat(afterDiscount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      payable: parseFloat(payable.toFixed(2)),
   }
}
