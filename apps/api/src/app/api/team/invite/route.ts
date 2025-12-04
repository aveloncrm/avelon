import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { teamMembers, merchants, stores } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { generateInviteToken, sendTeamInviteEmail, sendOwnershipTransferEmail } from '@/lib/email'

// POST /api/team/invite - Invite a team member to a store or change their role
export async function POST(req: NextRequest) {
    try {
        const merchantId = req.headers.get('X-USER-ID')
        const storeId = req.headers.get('X-STORE-ID')

        if (!merchantId || !storeId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { email, role = 'admin' } = body

        if (!email) {
            return new NextResponse('Email is required', { status: 400 })
        }

        // Get store info
        const store = await db.query.stores.findFirst({
            where: eq(stores.id, storeId),
        })

        if (!store) {
            return new NextResponse('Store not found', { status: 404 })
        }

        // Get inviter info
        const inviter = await db.query.merchants.findFirst({
            where: eq(merchants.id, merchantId),
        })

        // Find merchant by email
        const invitedMerchant = await db.query.merchants.findFirst({
            where: eq(merchants.email, email.toLowerCase()),
        })

        if (!invitedMerchant) {
            return new NextResponse('User not found. They need to create an account first.', { status: 404 })
        }

        // Check if already a team member
        const existing = await db.query.teamMembers.findFirst({
            where: and(
                eq(teamMembers.storeId, storeId),
                eq(teamMembers.merchantId, invitedMerchant.id)
            ),
        })

        // Generate secure invite token
        const inviteToken = generateInviteToken()

        if (existing) {
            // Existing member - this is a role change request
            if (existing.role === role) {
                return new NextResponse('User already has this role', { status: 400 })
            }

            // Update existing member with pending role change
            await db.update(teamMembers)
                .set({
                    role: role as 'owner' | 'admin' | 'member',
                    status: 'pending', // Requires confirmation
                    inviteToken,
                    invitedBy: merchantId,
                })
                .where(eq(teamMembers.id, existing.id))

            // Send appropriate email based on role change
            const inviteUrl = `${process.env.ADMIN_URL}/invite/accept?token=${inviteToken}`

            if (role === 'owner') {
                // Ownership transfer - special email
                await sendOwnershipTransferEmail({
                    toEmail: invitedMerchant.email,
                    toName: invitedMerchant.name,
                    inviterName: inviter?.name,
                    storeName: store.name,
                    inviteToken,
                    inviteUrl,
                })
            } else {
                // Regular role change
                await sendTeamInviteEmail({
                    toEmail: invitedMerchant.email,
                    toName: invitedMerchant.name,
                    inviterName: inviter?.name,
                    storeName: store.name,
                    inviteToken,
                    inviteUrl,
                })
            }

            return NextResponse.json({
                message: 'Role change invitation sent! The user needs to confirm via email.',
                isRoleChange: true,
            })
        }

        // New member - create pending team member
        const [teamMember] = await db.insert(teamMembers).values({
            storeId,
            merchantId: invitedMerchant.id,
            role: role as 'owner' | 'admin' | 'member',
            status: 'pending',
            inviteToken,
            invitedBy: merchantId,
        }).returning()

        // Send invite email
        const inviteUrl = `${process.env.ADMIN_URL}/invite/accept?token=${inviteToken}`

        await sendTeamInviteEmail({
            toEmail: invitedMerchant.email,
            toName: invitedMerchant.name,
            inviterName: inviter?.name,
            storeName: store.name,
            inviteToken,
            inviteUrl,
        })

        return NextResponse.json({
            ...teamMember,
            message: 'Invite sent! The user will receive an email.'
        })
    } catch (error) {
        console.error('[TEAM_INVITE_POST]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
