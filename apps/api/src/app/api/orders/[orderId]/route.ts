import db from '@/lib/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: Promise<{ orderId: string }> }
) {
   try {
      const { orderId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!orderId) {
         return new NextResponse('Order ID is required', { status: 400 })
      }

      const order = await db.query.orders.findFirst({
         where: eq(orders.id, orderId),
         with: {
            user: true,
            address: true,
            orderItems: {
               with: {
                  product: true,
               },
            },
            payments: true,
            refund: true,
         },
      })

      if (!order) {
         return new NextResponse('Order not found', { status: 404 })
      }

      return NextResponse.json(order)
   } catch (error) {
      console.error('[ORDER_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: Promise<{ orderId: string }> }
) {
   try {
      const { orderId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!orderId) {
         return new NextResponse('Order ID is required', { status: 400 })
      }

      const body = await req.json()

      const { 
         status, 
         total, 
         shipping, 
         payable, 
         tax, 
         discount, 
         isPaid, 
         isCompleted, 
         addressId, 
         discountCodeId 
      } = body

      // Check if order exists
      const existingOrder = await db.query.orders.findFirst({
         where: eq(orders.id, orderId),
      })

      if (!existingOrder) {
         return new NextResponse('Order not found', { status: 404 })
      }

      const updateData: any = {}
      if (status) updateData.status = status
      if (total !== undefined) updateData.total = total
      if (shipping !== undefined) updateData.shipping = shipping
      if (payable !== undefined) updateData.payable = payable
      if (tax !== undefined) updateData.tax = tax
      if (discount !== undefined) updateData.discount = discount
      if (isPaid !== undefined) updateData.isPaid = isPaid
      if (isCompleted !== undefined) updateData.isCompleted = isCompleted
      if (addressId !== undefined) updateData.addressId = addressId
      if (discountCodeId !== undefined) updateData.discountCodeId = discountCodeId

      const [updatedOrder] = await db
         .update(orders)
         .set(updateData)
         .where(eq(orders.id, orderId))
         .returning()

      // Fetch with relations
      const orderWithRelations = await db.query.orders.findFirst({
         where: eq(orders.id, updatedOrder.id),
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
   } catch (error) {
      console.error('[ORDER_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: Promise<{ orderId: string }> }
) {
   try {
      const { orderId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!orderId) {
         return new NextResponse('Order ID is required', { status: 400 })
      }

      // Check if order exists
      const existingOrder = await db.query.orders.findFirst({
         where: eq(orders.id, orderId),
      })

      if (!existingOrder) {
         return new NextResponse('Order not found', { status: 404 })
      }

      const [order] = await db
         .delete(orders)
         .where(eq(orders.id, orderId))
         .returning()

      return NextResponse.json(order)
   } catch (error) {
      console.error('[ORDER_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
