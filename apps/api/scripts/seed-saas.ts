import { db } from '../src/lib/db'
import { merchants, stores, users } from '../src/db/schema'
import { eq } from 'drizzle-orm'

async function main() {
    console.log('Seeding SaaS data...')

    // 1. Create Merchant
    const merchantEmail = 'admin@avelon.com'
    let merchant = await db.query.merchants.findFirst({
        where: eq(merchants.email, merchantEmail),
    })

    if (!merchant) {
        console.log('Creating Merchant...')
        const [newMerchant] = await db.insert(merchants).values({
            email: merchantEmail,
            name: 'Admin Merchant',
        }).returning()
        merchant = newMerchant
    } else {
        console.log('Merchant already exists.')
    }

    // 2. Create Store
    const storeSubdomain = 'default'
    let store = await db.query.stores.findFirst({
        where: eq(stores.subdomain, storeSubdomain),
    })

    if (!store) {
        console.log('Creating Store...')
        const [newStore] = await db.insert(stores).values({
            name: 'Default Store',
            subdomain: storeSubdomain,
            merchantId: merchant!.id,
        }).returning()
        store = newStore
    } else {
        console.log('Store already exists.')
    }

    // 3. Create User (Customer)
    const userEmail = 'customer@avelon.com'
    let user = await db.query.users.findFirst({
        where: eq(users.email, userEmail),
    })

    if (!user) {
        console.log('Creating User...')
        await db.insert(users).values({
            email: userEmail,
            name: 'Test Customer',
            storeId: store!.id,
        })
    } else {
        console.log('User already exists.')
    }

    console.log('Seeding complete!')
    console.log('Merchant ID:', merchant!.id)
    console.log('Store ID:', store!.id)
    process.exit(0)
}

main().catch((err) => {
    console.error('Seeding failed:', err)
    process.exit(1)
})
