import db from '@/lib/db'
import { payments, paymentProviders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: Promise<{ paymentId: string }> }
) {
   try {
      const { paymentId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!paymentId) {
         return new NextResponse('Payment ID is required', { status: 400 })
      }

      const payment = await db.query.payments.findFirst({
         where: eq(payments.id, paymentId),
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
                  user: true,
                  address: true,
               },
            },
         },
      })

      if (!payment) {
         return new NextResponse('Payment not found', { status: 404 })
      }

      return NextResponse.json(payment)
   } catch (error) {
      console.error('[PAYMENT_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: Promise<{ paymentId: string }> }
) {
   try {
      const { paymentId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!paymentId) {
         return new NextResponse('Payment ID is required', { status: 400 })
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
         providerId 
      } = body

      // Check if payment exists
      const existingPayment = await db.query.payments.findFirst({
         where: eq(payments.id, paymentId),
      })

      if (!existingPayment) {
         return new NextResponse('Payment not found', { status: 404 })
      }

      // Check if provider exists (if provided)
      if (providerId) {
         const provider = await db.query.paymentProviders.findFirst({
            where: eq(paymentProviders.id, providerId),
         })

         if (!provider) {
            return new NextResponse('Payment provider not found', { status: 404 })
         }
      }

      const updateData: any = {}
      if (status) updateData.status = status
      if (refId) updateData.refId = refId
      if (cardPan !== undefined) updateData.cardPan = cardPan
      if (cardHash !== undefined) updateData.cardHash = cardHash
      if (fee !== undefined) updateData.fee = fee
      if (isSuccessful !== undefined) updateData.isSuccessful = isSuccessful
      if (payable !== undefined) updateData.payable = payable
      if (providerId) updateData.providerId = providerId

      const [updatedPayment] = await db
         .update(payments)
         .set(updateData)
         .where(eq(payments.id, paymentId))
         .returning()

      // Fetch with relations
      const paymentWithRelations = await db.query.payments.findFirst({
         where: eq(payments.id, updatedPayment.id),
         with: {
            provider: true,
            user: true,
            order: true,
         },
      })

      return NextResponse.json(paymentWithRelations)
   } catch (error: any) {
      console.error('[PAYMENT_PATCH]', error)
      
      if (error.code === '23505') { // Unique constraint violation
         return new NextResponse('Reference ID already exists', { status: 400 })
      }
      
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: Promise<{ paymentId: string }> }
) {
   try {
      const { paymentId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!paymentId) {
         return new NextResponse('Payment ID is required', { status: 400 })
      }

      // Check if payment exists
      const existingPayment = await db.query.payments.findFirst({
         where: eq(payments.id, paymentId),
      })

      if (!existingPayment) {
         return new NextResponse('Payment not found', { status: 404 })
      }

      const [payment] = await db
         .delete(payments)
         .where(eq(payments.id, paymentId))
         .returning()

      return NextResponse.json(payment)
   } catch (error) {
      console.error('[PAYMENT_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
