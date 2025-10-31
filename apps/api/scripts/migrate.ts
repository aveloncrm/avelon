import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

/**
 * Migration script for production deployment
 * This runs the SQL migration files against the production database
 * 
 * Usage:
 *   - Locally with production DB: DATABASE_URL=<prod-url> npm run db:migrate:prod
 *   - On Vercel: Automatically via postbuild script or manual trigger
 */

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  console.log('🔄 Starting database migration...')
  console.log(`📍 Target: ${databaseUrl.replace(/:[^:@]+@/, ':***@')}`) // Hide password in logs

  // Create a postgres client for migrations
  const migrationClient = postgres(databaseUrl, { max: 1 })
  const db = drizzle(migrationClient)

  try {
    // Run migrations from the drizzle folder
    await migrate(db, { migrationsFolder: './drizzle' })
    
    console.log('✅ Migrations completed successfully!')
    
    // Close the connection
    await migrationClient.end()
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    await migrationClient.end()
    process.exit(1)
  }
}

// Run migrations
runMigrations()

