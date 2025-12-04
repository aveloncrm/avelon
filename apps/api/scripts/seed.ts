import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()


/**
 * Seed script to populate the database with default data
 * This runs the SQL seed file against the database
 */

async function runSeed() {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is required')
    }

    console.log('🌱 Starting database seed...')
    console.log(`📍 Target: ${databaseUrl.replace(/:[^:@]+@/, ':***@')}`) // Hide password in logs

    // Create a postgres client for seeding
    const seedClient = postgres(databaseUrl, { max: 1 })
    const db = drizzle(seedClient)

    try {
        // Read the SQL seed file
        const seedSqlPath = path.join(process.cwd(), 'scripts', 'seed-default-store.sql')
        const seedSql = fs.readFileSync(seedSqlPath, 'utf8')

        // Execute the SQL
        // We need to split by semicolon if the driver doesn't support multiple statements in one go,
        // but postgres.js usually handles it. However, for safety with simple SQL files, 
        // we can try executing it directly.
        await seedClient.unsafe(seedSql)

        console.log('✅ Seed completed successfully!')

        // Close the connection
        await seedClient.end()

        process.exit(0)
    } catch (error) {
        console.error('❌ Seed failed:', error)
        await seedClient.end()
        process.exit(1)
    }
}

// Run seed
runSeed()
