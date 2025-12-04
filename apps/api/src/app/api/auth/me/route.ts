import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { merchants } from '@/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/auth/me - Get current merchant info
export async function GET(req: NextRequest) {
    try {
        const merchantId = req.headers.get('X-USER-ID')

        if (!merchantId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const merchant = await db.query.merchants.findFirst({
            where: eq(merchants.id, merchantId),
            columns: {
                id: true,
                email: true,
                name: true,
                avatar: true,
            },
        })

        if (!merchant) {
            return new NextResponse('Merchant not found', { status: 404 })
        }

        return NextResponse.json(merchant)
    } catch (error) {
        console.error('[AUTH_ME_GET]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
