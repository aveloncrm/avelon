import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { stores, orders, payments, paymentProviders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Stripe from 'stripe'
import { headers } from 'next/headers'

// POST /api/webhooks/stripe/[storeId]
export async function POST(req: NextRequest, { params }: { params: { storeId: string } }) {
    const body = await req.text()
    const signature = headers().get('Stripe-Signature') as string
    const { storeId } = params

    if (!signature || !storeId) {
        return new NextResponse('Missing signature or store ID', { status: 400 })
    }

    try {
        // Get store settings
        const store = await db.query.stores.findFirst({
            where: eq(stores.id, storeId),
            columns: {
                settings: true,
            },
        })

        if (!store) {
            return new NextResponse('Store not found', { status: 404 })
        }

        const settings = (store.settings as any) || {}
        const stripeSettings = settings.stripe || {}
        const webhookSecret = stripeSettings.webhookSecret

        if (!webhookSecret) {
            return new NextResponse('Webhook secret not configured', { status: 400 })
        }

        // Verify signature
        let event: Stripe.Event
        try {
            event = Stripe.webhooks.constructEvent(body, signature, webhookSecret)
        } catch (err: any) {
            console.error(`Webhook signature verification failed: ${err.message}`)
            return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
        }

        // Handle the event
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent
            const { orderId, userId } = paymentIntent.metadata

            if (orderId) {
                // Update order status
                await db
                    .update(orders)
                    .set({
                        isPaid: true,
                        status: 'Processing', // Or 'Paid' if you have that status
                    })
                    .where(eq(orders.id, orderId))

                // Find or create Stripe provider
                let [provider] = await db
                    .select()
                    .from(paymentProviders)
                    .where(eq(paymentProviders.storeId, storeId)) // You might want to filter by title 'Stripe' too
                    .limit(1)

                // If no provider found, maybe create one? Or assume it exists.
                // For now, let's try to find one named 'Stripe'
                if (!provider) {
                    const [newProvider] = await db.insert(paymentProviders).values({
                        storeId,
                        title: 'Stripe',
                        isActive: true
                    }).returning()
                    provider = newProvider
                }

                // Record payment
                await db.insert(payments).values({
                    storeId,
                    orderId,
                    userId: userId || 'guest', // Handle guest checkout if needed
                    status: 'Paid',
                    refId: paymentIntent.id,
                    payable: paymentIntent.amount / 100,
                    providerId: provider.id,
                    isSuccessful: true,
                    fee: 0, // Could calculate from Stripe event if available
                })
            }
        }

        return new NextResponse(null, { status: 200 })
    } catch (error) {
        console.error('[STRIPE_WEBHOOK_POST]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
