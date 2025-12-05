import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { stores, orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Stripe from 'stripe'

// POST /api/checkout/stripe - Create PaymentIntent
export async function POST(req: NextRequest) {
    try {
        const userId = req.headers.get('X-USER-ID')
        const storeId = req.headers.get('X-STORE-ID')

        if (!userId || !storeId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { orderId } = body

        if (!orderId) {
            return new NextResponse('Order ID is required', { status: 400 })
        }

        // Get store settings for Stripe keys
        const store = await db.query.stores.findFirst({
            where: eq(stores.id, storeId),
            columns: {
                settings: true,
                name: true,
            },
        })

        if (!store) {
            return new NextResponse('Store not found', { status: 404 })
        }

        const settings = (store.settings as any) || {}
        const stripeSettings = settings.stripe || {}
        const secretKey = stripeSettings.secretKey

        if (!secretKey) {
            return new NextResponse('Stripe not configured for this store', { status: 400 })
        }

        // Get order details
        const order = await db.query.orders.findFirst({
            where: eq(orders.id, orderId),
        })

        if (!order) {
            return new NextResponse('Order not found', { status: 404 })
        }

        if (order.isPaid) {
            return new NextResponse('Order already paid', { status: 400 })
        }

        // Initialize Stripe with store's key
        const stripe = new Stripe(secretKey, {
            apiVersion: '2024-11-20.acacia',
            typescript: true,
        })

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.payable * 100), // Amount in cents
            currency: 'usd', // Default to USD for now, could be dynamic
            metadata: {
                orderId: order.id,
                storeId: storeId,
                userId: userId,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        })

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            publishableKey: stripeSettings.publishableKey, // Send this back so frontend knows which key to use
        })
    } catch (error) {
        console.error('[STRIPE_CHECKOUT_POST]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
