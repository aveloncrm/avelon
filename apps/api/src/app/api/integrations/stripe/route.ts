import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { stores } from '@/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/integrations/stripe - Get Stripe settings
export async function GET(req: NextRequest) {
    try {
        const merchantId = req.headers.get('X-USER-ID')
        const storeId = req.headers.get('X-STORE-ID')

        if (!merchantId || !storeId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

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

        // Return keys (masked secret key for security if needed, but for now returning as is for edit)
        // In a real app, you might want to never return the full secret key
        return NextResponse.json({
            publishableKey: stripeSettings.publishableKey || '',
            secretKey: stripeSettings.secretKey || '',
            webhookSecret: stripeSettings.webhookSecret || '',
        })
    } catch (error) {
        console.error('[STRIPE_INTEGRATION_GET]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}

// POST /api/integrations/stripe - Save Stripe settings
export async function POST(req: NextRequest) {
    try {
        const merchantId = req.headers.get('X-USER-ID')
        const storeId = req.headers.get('X-STORE-ID')

        if (!merchantId || !storeId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { publishableKey, secretKey, webhookSecret } = body

        // Get current settings
        const store = await db.query.stores.findFirst({
            where: eq(stores.id, storeId),
        })

        if (!store) {
            return new NextResponse('Store not found', { status: 404 })
        }

        const currentSettings = (store.settings as any) || {}

        // Update stripe settings
        const newSettings = {
            ...currentSettings,
            stripe: {
                publishableKey,
                secretKey,
                webhookSecret,
            },
        }

        // Save to database
        await db
            .update(stores)
            .set({
                settings: newSettings,
            })
            .where(eq(stores.id, storeId))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[STRIPE_INTEGRATION_POST]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
