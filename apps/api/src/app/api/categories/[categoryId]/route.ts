import db from '@/lib/db'
import { categories, bannerCategories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: Promise<{ categoryId: string }> }
) {
   try {
      const { categoryId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!categoryId) {
         return new NextResponse('Category id is required', { status: 400 })
      }

      const category = await db.query.categories.findFirst({
         where: eq(categories.id, categoryId),
      })

      return NextResponse.json(category)
   } catch (error) {
      console.error('[CATEGORY_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: Promise<{ categoryId: string }> }
) {
   try {
      const { categoryId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!categoryId) {
         return new NextResponse('Category id is required', { status: 400 })
      }

      const [category] = await db
         .delete(categories)
         .where(eq(categories.id, categoryId))
         .returning()

      return NextResponse.json(category)
   } catch (error) {
      console.error('[CATEGORY_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: Promise<{ categoryId: string }> }
) {
   try {
      const { categoryId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json()

      const { title, description, bannerId } = body

      if (!bannerId) {
         return new NextResponse('Banner ID is required', { status: 400 })
      }

      if (!title) {
         return new NextResponse('Name is required', { status: 400 })
      }

      if (!categoryId) {
         return new NextResponse('Category id is required', { status: 400 })
      }

      const [updatedCategory] = await db
         .update(categories)
         .set({
            title,
            description,
         })
         .where(eq(categories.id, categoryId))
         .returning()

      // Update banner relationship if provided
      if (bannerId && bannerId !== 'none') {
         // Delete existing relationships
         await db
            .delete(bannerCategories)
            .where(eq(bannerCategories.categoryId, categoryId))

         // Add new relationship
         await db.insert(bannerCategories).values({
            bannerId,
            categoryId,
         })
      }

      return NextResponse.json(updatedCategory)
   } catch (error) {
      console.error('[CATEGORY_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
