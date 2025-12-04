import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { teamMembers } from '@/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/team/accept - Accept team invite via token
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const token = searchParams.get('token')

        if (!token) {
            return new NextResponse('Invalid invite link', { status: 400 })
        }

        // Find pending invite by token
        const invite = await db.query.teamMembers.findFirst({
            where: eq(teamMembers.inviteToken, token),
            with: {
                store: true,
            },
        })

        if (!invite) {
            return new NextResponse('Invite not found or expired', { status: 404 })
        }

        if (invite.status === 'accepted') {
            return new NextResponse('Invite already accepted', { status: 400 })
        }

        // Accept the invite
        await db.update(teamMembers)
            .set({
                status: 'accepted',
                inviteToken: null, // Clear token after use
            })
            .where(eq(teamMembers.id, invite.id))

        // Return store info for redirect
        return NextResponse.json({
            success: true,
            storeId: invite.storeId,
            storeName: invite.store.name,
            message: 'Invite accepted! Redirecting to dashboard...',
        })
    } catch (error) {
        console.error('[TEAM_ACCEPT_GET]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
