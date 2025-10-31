import db from '@/lib/db'
import { categories, bannerCategories } from '@/db/schema'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json()

      const { title, description, bannerId } = body

      if (!title) {
         return new NextResponse('Name is required', { status: 400 })
      }

      // Create a new category
      const [category] = await db
         .insert(categories)
         .values({
            title,
            description,
         })
         .returning()

      // Create banner relationship if provided
      if (bannerId && bannerId !== 'none') {
         await db.insert(bannerCategories).values({
            bannerId,
            categoryId: category.id,
         })
      }

      return NextResponse.json(category)
   } catch (error) {
      console.error('[CATEGORIES_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function GET() {
   try {
      // Public endpoint - no authentication required for GET
      const categoriesList = await db
         .select({
            id: categories.id,
            title: categories.title,
            description: categories.description,
         })
         .from(categories)
         .orderBy(asc(categories.title))

      return NextResponse.json(categoriesList)
   } catch (error) {
      console.error('[CATEGORIES_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
