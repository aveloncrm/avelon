import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { stores } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

// GET /api/stores/[storeId] - Get store details
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params
        const merchantId = req.headers.get('X-USER-ID')

        if (!merchantId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const store = await db.query.stores.findFirst({
            where: and(
                eq(stores.id, storeId),
                eq(stores.merchantId, merchantId)
            ),
        })

        if (!store) {
            return new NextResponse('Store not found', { status: 404 })
        }

        return NextResponse.json(store)
    } catch (error) {
        console.error('[STORE_GET]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}

// PATCH /api/stores/[storeId] - Update store
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params
        const merchantId = req.headers.get('X-USER-ID')

        if (!merchantId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // Verify ownership
        const existingStore = await db.query.stores.findFirst({
            where: and(
                eq(stores.id, storeId),
                eq(stores.merchantId, merchantId)
            ),
        })

        if (!existingStore) {
            return new NextResponse('Store not found', { status: 404 })
        }

        const body = await req.json()
        const { name, subdomain, customDomain, settings } = body

        // If updating subdomain, check availability
        if (subdomain && subdomain !== existingStore.subdomain) {
            const subdomainTaken = await db.query.stores.findFirst({
                where: eq(stores.subdomain, subdomain),
            })

            if (subdomainTaken) {
                return new NextResponse('Subdomain already taken', { status: 409 })
            }
        }

        // If updating custom domain, check availability
        if (customDomain && customDomain !== existingStore.customDomain) {
            const domainTaken = await db.query.stores.findFirst({
                where: eq(stores.customDomain, customDomain),
            })

            if (domainTaken) {
                return new NextResponse('Custom domain already in use', { status: 409 })
            }
        }

        // Update store
        const [updatedStore] = await db
            .update(stores)
            .set({
                name: name || existingStore.name,
                subdomain: subdomain || existingStore.subdomain,
                customDomain: customDomain !== undefined ? customDomain : existingStore.customDomain,
                settings: settings !== undefined ? settings : existingStore.settings,
                updatedAt: new Date(),
            })
            .where(eq(stores.id, storeId))
            .returning()

        return NextResponse.json(updatedStore)
    } catch (error) {
        console.error('[STORE_PATCH]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}

// DELETE /api/stores/[storeId] - Delete store
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params
        const merchantId = req.headers.get('X-USER-ID')

        if (!merchantId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // Verify ownership
        const existingStore = await db.query.stores.findFirst({
            where: and(
                eq(stores.id, storeId),
                eq(stores.merchantId, merchantId)
            ),
        })

        if (!existingStore) {
            return new NextResponse('Store not found', { status: 404 })
        }

        // Delete store (this will cascade delete related data)
        await db.delete(stores).where(eq(stores.id, storeId))

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('[STORE_DELETE]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
