import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as dotenv from 'dotenv'

dotenv.config()

async function verifyStore() {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) throw new Error('DATABASE_URL is required')

    const client = postgres(databaseUrl, { max: 1 })

    try {
        const result = await client`SELECT * FROM "Store" WHERE id = 'default-store-001'`
        console.log('Store verification result:', result)

        if (result.length > 0) {
            console.log('✅ Default store found!')
        } else {
            console.error('❌ Default store NOT found!')
        }

        await client.end()
    } catch (error) {
        console.error('Verification failed:', error)
        await client.end()
    }
}

verifyStore()
