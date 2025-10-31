import db from '@/lib/db'
import { brands } from '@/db/schema'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
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
         })
         .returning()

      return NextResponse.json(brand)
   } catch (error) {
      console.error('[BRANDS_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function GET() {
   try {
      // Public endpoint - no authentication required for GET
      const brandsList = await db
         .select({
            id: brands.id,
            title: brands.title,
            description: brands.description,
            logo: brands.logo,
         })
         .from(brands)
         .orderBy(asc(brands.title))

      return NextResponse.json(brandsList)
   } catch (error) {
      console.error('[BRANDS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
