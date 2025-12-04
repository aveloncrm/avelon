import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { teamMembers } from '@/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/team - List team members for current store
export async function GET(req: NextRequest) {
    try {
        const storeId = req.headers.get('X-STORE-ID')

        if (!storeId) {
            return new NextResponse('Store ID required', { status: 400 })
        }

        const members = await db.query.teamMembers.findMany({
            where: eq(teamMembers.storeId, storeId),
            with: {
                merchant: {
                    columns: {
                        id: true,
                        email: true,
                        name: true,
                        avatar: true,
                    },
                },
                inviter: {
                    columns: {
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: (teamMembers, { desc }) => [desc(teamMembers.createdAt)],
        })

        return NextResponse.json(members)
    } catch (error) {
        console.error('[TEAM_GET]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}

// DELETE /api/team/:id - Remove team member
export async function DELETE(req: NextRequest) {
    try {
        const merchantId = req.headers.get('X-USER-ID')
        const storeId = req.headers.get('X-STORE-ID')

        if (!merchantId || !storeId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const url = new URL(req.url)
        const teamMemberId = url.searchParams.get('id')

        if (!teamMemberId) {
            return new NextResponse('Team member ID required', { status: 400 })
        }

        // Delete team member
        await db.delete(teamMembers)
            .where(eq(teamMembers.id, teamMemberId))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[TEAM_DELETE]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
