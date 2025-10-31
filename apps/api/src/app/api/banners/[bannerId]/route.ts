import db from '@/lib/db'
import { banners } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function PATCH(
   req: Request,
   { params }: { params: Promise<{ bannerId: string }> }
) {
   try {
      const { bannerId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json()

      const { label, image } = body

      // Validate required fields
      if (!label || !image) {
         return new NextResponse('Label and image are required', { status: 400 })
      }

      const [banner] = await db
         .update(banners)
         .set({
            label,
            image,
         })
         .where(eq(banners.id, bannerId))
         .returning()

      return NextResponse.json(banner)
   } catch (error) {
      console.error('[BANNERS_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: Promise<{ bannerId: string }> }
) {
   try {
      const { bannerId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const [banner] = await db
         .delete(banners)
         .where(eq(banners.id, bannerId))
         .returning()

      return NextResponse.json(banner)
   } catch (error) {
      console.error('[BANNERS_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
