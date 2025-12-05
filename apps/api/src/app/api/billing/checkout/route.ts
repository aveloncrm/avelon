import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { subscriptions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import stripe from '@/lib/stripe'
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans'

// POST /api/billing/checkout - Create Stripe checkout session
export async function POST(req: NextRequest) {
    try {
        const merchantId = req.headers.get('X-USER-ID')

        if (!merchantId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { plan } = body

        if (!plan || !['starter', 'pro'].includes(plan)) {
            return new NextResponse('Invalid plan', { status: 400 })
        }

        const planConfig = SUBSCRIPTION_PLANS[plan as 'starter' | 'pro']

        if (!planConfig.stripePriceId) {
            return new NextResponse('Plan not available', { status: 400 })
        }

        // Get or create Stripe customer
        const subscription = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.merchantId, merchantId),
        })

        let customerId: string | undefined = subscription?.stripeCustomerId || undefined

        if (!customerId) {
            // Get merchant details
            const merchant = await db.query.merchants.findFirst({
                where: (merchants, { eq }) => eq(merchants.id, merchantId),
            })

            const customer = await stripe.customers.create({
                email: merchant?.email,
                metadata: {
                    merchantId,
                },
            })

            customerId = customer.id

            // Create subscription record if it doesn't exist
            if (!subscription) {
                await db.insert(subscriptions).values({
                    merchantId,
                    plan: 'free',
                    status: 'active',
                    stripeCustomerId: customerId,
                })
            } else {
                // Update with Stripe customer ID
                await db.update(subscriptions)
                    .set({ stripeCustomerId: customerId })
                    .where(eq(subscriptions.merchantId, merchantId))
            }
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: planConfig.stripePriceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.ADMIN_URL}/billing?success=true`,
            cancel_url: `${process.env.ADMIN_URL}/billing?canceled=true`,
            metadata: {
                merchantId,
                plan,
            },
        })

        return NextResponse.json({ sessionId: session.id, url: session.url })
    } catch (error) {
        console.error('[CHECKOUT_POST]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
