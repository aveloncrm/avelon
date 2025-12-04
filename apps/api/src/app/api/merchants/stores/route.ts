import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { stores, teamMembers } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

// GET /api/merchants/stores - List all stores for authenticated merchant
export async function GET(req: NextRequest) {
    try {
        const merchantId = req.headers.get('X-USER-ID')

        if (!merchantId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // Get stores owned by merchant
        const ownedStores = await db.query.stores.findMany({
            where: eq(stores.merchantId, merchantId),
            orderBy: (stores, { asc }) => [asc(stores.createdAt)],
        })

        // Get owned store IDs to filter out duplicates
        const ownedStoreIds = ownedStores.map(s => s.id)

        // Get stores where merchant is a team member (accepted invites only)
        // Exclude stores they already own to prevent duplicates
        const teamMemberships = await db.query.teamMembers.findMany({
            where: and(
                eq(teamMembers.merchantId, merchantId),
                eq(teamMembers.status, 'accepted')
            ),
            with: {
                store: true,
            },
        })

        // Filter out team memberships for stores the user owns
        const teamStores = teamMemberships
            .filter(tm => !ownedStoreIds.includes(tm.storeId))
            .map(tm => ({
                ...tm.store,
                isTeamMember: true,
                role: tm.role,
            }))

        // Combine and sort by creation date
        const allStores = [...ownedStores.map(s => ({ ...s, isOwner: true })), ...teamStores]
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

        return NextResponse.json(allStores)
    } catch (error) {
        console.error('[MERCHANT_STORES_GET]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
