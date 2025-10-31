import db from '@/lib/db'
import { brands } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: Promise<{ brandId: string }> }
) {
   try {
      const { brandId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!brandId) {
         return new NextResponse('Brand id is required', { status: 400 })
      }

      const brand = await db.query.brands.findFirst({
         where: eq(brands.id, brandId),
      })

      return NextResponse.json(brand)
   } catch (error) {
      console.error('[BRAND_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: Promise<{ brandId: string }> }
) {
   try {
      const { brandId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!brandId) {
         return new NextResponse('Brand id is required', { status: 400 })
      }

      const [brand] = await db
         .delete(brands)
         .where(eq(brands.id, brandId))
         .returning()

      return NextResponse.json(brand)
   } catch (error) {
      console.error('[BRAND_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: Promise<{ brandId: string }> }
) {
   try {
      const { brandId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json()

      const { title, description } = body

      if (!title && !description) {
         return new NextResponse(
            'At least one field (title or description) is required',
            { status: 400 }
         )
      }

      if (!brandId) {
         return new NextResponse('Brand id is required', { status: 400 })
      }

      const updateData: any = {}
      if (title) updateData.title = title
      if (description) updateData.description = description

      const [updatedBrand] = await db
         .update(brands)
         .set(updateData)
         .where(eq(brands.id, brandId))
         .returning()

      return NextResponse.json(updatedBrand)
   } catch (error) {
      console.error('[BRAND_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
