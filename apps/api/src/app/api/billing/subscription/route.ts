import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { subscriptions } from '@/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/billing/subscription - Get current subscription
export async function GET(req: NextRequest) {
    try {
        const merchantId = req.headers.get('X-USER-ID')

        if (!merchantId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const subscription = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.merchantId, merchantId),
        })

        // Create free subscription if none exists
        if (!subscription) {
            const [newSubscription] = await db.insert(subscriptions).values({
                merchantId,
                plan: 'free',
                status: 'active',
            }).returning()

            return NextResponse.json(newSubscription)
        }

        return NextResponse.json(subscription)
    } catch (error) {
        console.error('[SUBSCRIPTION_GET]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
