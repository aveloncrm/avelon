/**
 * Backfill script to add store owners to team_members table
 * Run this once to add existing store owners as team members
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { stores, teamMembers } from '../src/db/schema'
import { eq, and } from 'drizzle-orm'

const connectionString = process.env.DATABASE_URL!

async function backfillStoreOwners() {
    const client = postgres(connectionString)
    const db = drizzle(client)

    try {
        console.log('🔄 Starting backfill of store owners...')

        // Get all stores
        const allStores = await db.select().from(stores)

        console.log(`Found ${allStores.length} stores`)

        let added = 0
        let skipped = 0

        for (const store of allStores) {
            // Check if owner already exists in team_members
            const existingMember = await db
                .select()
                .from(teamMembers)
                .where(
                    and(
                        eq(teamMembers.storeId, store.id),
                        eq(teamMembers.merchantId, store.merchantId),
                        eq(teamMembers.role, 'owner')
                    )
                )
                .limit(1)

            if (existingMember.length > 0) {
                console.log(`⏭️  Skipping ${store.name} - owner already exists`)
                skipped++
                continue
            }

            // Add owner to team_members
            await db.insert(teamMembers).values({
                storeId: store.id,
                merchantId: store.merchantId,
                role: 'owner',
                status: 'accepted',
                invitedBy: store.merchantId,
            })

            console.log(`✅ Added owner for store: ${store.name}`)
            added++
        }

        console.log('\n📊 Summary:')
        console.log(`   ✅ Added: ${added}`)
        console.log(`   ⏭️  Skipped: ${skipped}`)
        console.log(`   📦 Total: ${allStores.length}`)
        console.log('\n✨ Backfill complete!')

        await client.end()
    } catch (error) {
        console.error('❌ Error during backfill:', error)
        process.exit(1)
    }
}

backfillStoreOwners()
