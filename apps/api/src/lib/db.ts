import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../db/schema'

// For query purposes (singleton pattern for database client)
const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined
}

const client = globalForDb.client ?? postgres(process.env.DATABASE_URL!, { max: 1 })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client
}

export const db = drizzle(client, { schema })

export default db

