import postgres from 'postgres'

/**
 * Pre-migration script that runs BEFORE Drizzle migrations
 * This ensures existing data has the required storeId values
 * before the migration tries to enforce NOT NULL constraints
 */

async function preMigrate() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  console.log('🔧 Running pre-migration setup...')
  console.log(`📍 Target: ${databaseUrl.replace(/:[^:@]+@/, ':***@')}`)

  const client = postgres(databaseUrl, { max: 1 })

  try {
    // Check if Merchant table exists
    const merchantTableExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Merchant'
      ) as exists
    `

    if (!merchantTableExists[0].exists) {
      console.log('ℹ️  Merchant table does not exist yet, skipping pre-migration')
      await client.end()
      return
    }

    // Check if Store table exists
    const storeTableExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Store'
      ) as exists
    `

    if (!storeTableExists[0].exists) {
      console.log('ℹ️  Store table does not exist yet, skipping pre-migration')
      await client.end()
      return
    }

    // Create default merchant if not exists
    console.log('📝 Creating default merchant...')
    await client`
      INSERT INTO "Merchant" (id, email, name, "createdAt", "updatedAt") 
      VALUES (
        'default-merchant-001',
        'admin@avelon.com',
        'Default Merchant',
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `

    // Create default store if not exists
    console.log('🏪 Creating default store...')
    await client`
      INSERT INTO "Store" (id, name, subdomain, "merchantId", "createdAt", "updatedAt") 
      VALUES (
        'default-store-001',
        'Default Store',
        'default',
        'default-merchant-001',
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `

    // Get list of tables that might need storeId updates
    const tablesToUpdate = [
      'Address',
      'Author',
      'Banner',
      'Blog',
      'Brand',
      'Cart',
      'Category',
      'DiscountCode',
      'File',
      'Notification',
      'Order',
      'PaymentProvider',
      'Payment',
      'ProductReview',
      'Product',
      'Refund',
      'User',
      '_Wishlist'
    ]

    console.log('🔄 Updating existing records with default storeId...')

    for (const table of tablesToUpdate) {
      // Check if table exists
      const tableExists = await client`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${table}
        ) as exists
      `

      if (!tableExists[0].exists) {
        console.log(`   ⏭️  Skipping ${table} (table does not exist)`)
        continue
      }

      // Check if storeId column exists
      const columnExists = await client`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = ${table}
          AND column_name = 'storeId'
        ) as exists
      `

      if (!columnExists[0].exists) {
        console.log(`   ⏭️  Skipping ${table} (storeId column does not exist yet)`)
        continue
      }

      // Check if storeId has any NULL values
      const nullCheck = await client.unsafe(`
        SELECT COUNT(*) as count
        FROM "${table}" 
        WHERE "storeId" IS NULL
      `)

      const nullCount = parseInt(nullCheck[0]?.count || '0')

      if (nullCount === 0) {
        console.log(`   ℹ️  No NULL values in ${table}`)
        continue
      }

      // Update NULL storeId values
      const result = await client.unsafe(`
        UPDATE "${table}" 
        SET "storeId" = 'default-store-001' 
        WHERE "storeId" IS NULL
      `)

      console.log(`   ✅ Updated ${nullCount} NULL records in ${table}`)
    }

    console.log('✅ Pre-migration completed successfully!')
    await client.end()
  } catch (error) {
    console.error('❌ Pre-migration failed:', error)
    await client.end()
    throw error
  }
}

export default preMigrate
