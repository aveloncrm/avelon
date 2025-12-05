import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { subscriptions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import stripe from '@/lib/stripe'
import Stripe from 'stripe'

export const runtime = 'nodejs'

// POST /api/billing/webhook - Handle Stripe webhooks
export async function POST(req: NextRequest) {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
        return new NextResponse('No signature', { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return new NextResponse('Webhook Error', { status: 400 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const merchantId = session.metadata?.merchantId
                const plan = session.metadata?.plan

                if (!merchantId || !plan) {
                    console.error('Missing metadata in checkout session')
                    break
                }

                // Update subscription
                await db.update(subscriptions)
                    .set({
                        plan: plan as any,
                        status: 'active',
                        stripeSubscriptionId: session.subscription as string,
                        currentPeriodStart: new Date(),
                    })
                    .where(eq(subscriptions.merchantId, merchantId))

                break
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription
                const merchantId = subscription.metadata?.merchantId

                if (!merchantId) {
                    // Try to find by Stripe subscription ID
                    const existingSub = await db.query.subscriptions.findFirst({
                        where: eq(subscriptions.stripeSubscriptionId, subscription.id),
                    })

                    if (existingSub) {
                        const subData = subscription as any
                        await db.update(subscriptions)
                            .set({
                                status: subscription.status as any,
                                currentPeriodStart: new Date(subData.current_period_start * 1000),
                                currentPeriodEnd: new Date(subData.current_period_end * 1000),
                                cancelAtPeriodEnd: subData.cancel_at_period_end,
                            })
                            .where(eq(subscriptions.id, existingSub.id))
                    }
                }

                break
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription

                // Downgrade to free
                const existingSub = await db.query.subscriptions.findFirst({
                    where: eq(subscriptions.stripeSubscriptionId, subscription.id),
                })

                if (existingSub) {
                    await db.update(subscriptions)
                        .set({
                            plan: 'free',
                            status: 'canceled',
                            stripeSubscriptionId: null,
                        })
                        .where(eq(subscriptions.id, existingSub.id))
                }

                break
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice
                const invoiceData = invoice as any

                if (invoiceData.subscription) {
                    const existingSub = await db.query.subscriptions.findFirst({
                        where: eq(subscriptions.stripeSubscriptionId, invoiceData.subscription as string),
                    })

                    if (existingSub) {
                        await db.update(subscriptions)
                            .set({ status: 'past_due' })
                            .where(eq(subscriptions.id, existingSub.id))
                    }
                }

                break
            }

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('[WEBHOOK_ERROR]', error)
        return new NextResponse('Webhook handler failed', { status: 500 })
    }
}
