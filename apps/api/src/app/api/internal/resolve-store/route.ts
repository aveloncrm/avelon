import db from '@/lib/db'
import { stores } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const host = searchParams.get('host')

        if (!host) {
            return new NextResponse('Host required', { status: 400 })
        }

        // 1. Try to find by Custom Domain (exact match)
        // e.g. "mystore.com" or "test.localhost"
        const storeByCustomDomain = await db.query.stores.findFirst({
            where: eq(stores.customDomain, host),
            columns: {
                id: true,
            },
        })

        if (storeByCustomDomain) {
            return NextResponse.json({ storeId: storeByCustomDomain.id })
        }

        // 2. Fallback to Subdomain extraction
        // Assuming format: subdomain.domain.com or subdomain.localhost
        // For localhost: store1.localhost -> store1
        // For prod: store1.avelon.com -> store1

        let subdomain = ''
        const parts = host.split('.')

        // Basic subdomain extraction logic
        if (host.includes('localhost')) {
            // localhost case: store1.localhost:3000
            if (parts.length > 1 && parts[0] !== 'www') {
                subdomain = parts[0]
            }
        } else {
            // Production case: store1.domain.com
            // We assume the main domain has 2 parts (avelon.com) or we need env var for root domain
            // For now, simplistic approach: take the first part if length > 2
            if (parts.length > 2 && parts[0] !== 'www') {
                subdomain = parts[0]
            }
        }

        if (!subdomain) {
            return NextResponse.json({ storeId: null })
        }

        // Query DB for subdomain
        const store = await db.query.stores.findFirst({
            where: eq(stores.subdomain, subdomain),
            columns: {
                id: true,
            },
        })

        return NextResponse.json({ storeId: store?.id || null })
    } catch (error) {
        console.error('[RESOLVE_STORE]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
