import db from '@/lib/db'
import { brands } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      const storeId = req.headers.get('X-STORE-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!storeId) {
         return new NextResponse('Store context required', { status: 400 })
      }

      const body = await req.json()

      const { title, description, logo } = body

      if (!title) {
         return new NextResponse('Name is required', { status: 400 })
      }

      const [brand] = await db
         .insert(brands)
         .values({
            title,
            description,
            logo,
            storeId,
         })
         .returning()

      return NextResponse.json(brand)
   } catch (error) {
      console.error('[BRANDS_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function GET(req: Request) {
   try {
      const storeId = req.headers.get('X-STORE-ID')

      if (!storeId) {
         return new NextResponse('Store context required', { status: 400 })
      }

      // Public endpoint - no authentication required for GET
      const brandsList = await db
         .select({
            id: brands.id,
            title: brands.title,
            description: brands.description,
            logo: brands.logo,
         })
         .from(brands)
         .where(eq(brands.storeId, storeId))
         .orderBy(asc(brands.title))

      return NextResponse.json(brandsList)
   } catch (error) {
      console.error('[BRANDS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
