import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { stores, teamMembers } from '@/db/schema'
import { eq } from 'drizzle-orm'

// POST /api/stores - Create a new store
export async function POST(req: NextRequest) {
    try {
        const merchantId = req.headers.get('X-USER-ID')

        if (!merchantId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { name, subdomain, customDomain, settings } = body

        if (!name || !subdomain) {
            return new NextResponse('Name and subdomain are required', { status: 400 })
        }

        // Validate subdomain format (lowercase, alphanumeric, hyphens)
        const subdomainRegex = /^[a-z0-9-]+$/
        if (!subdomainRegex.test(subdomain)) {
            return new NextResponse('Invalid subdomain format. Use lowercase letters, numbers, and hyphens only.', { status: 400 })
        }

        // Check if subdomain is already taken
        const existingStore = await db.query.stores.findFirst({
            where: eq(stores.subdomain, subdomain),
        })

        if (existingStore) {
            return new NextResponse('Subdomain already taken', { status: 409 })
        }

        // Check if custom domain is already taken (if provided)
        if (customDomain) {
            const existingDomain = await db.query.stores.findFirst({
                where: eq(stores.customDomain, customDomain),
            })

            if (existingDomain) {
                return new NextResponse('Custom domain already in use', { status: 409 })
            }
        }

        // Create store
        const [newStore] = await db
            .insert(stores)
            .values({
                name,
                subdomain,
                customDomain: customDomain || null,
                merchantId,
                settings: settings || null,
            })
            .returning()

        // Automatically add creator as owner in team members
        await db.insert(teamMembers).values({
            storeId: newStore.id,
            merchantId,
            role: 'owner',
            status: 'accepted',
            invitedBy: merchantId,
        })

        return NextResponse.json(newStore)
    } catch (error) {
        console.error('[STORES_POST]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
