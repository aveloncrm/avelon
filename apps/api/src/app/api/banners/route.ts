import db from '@/lib/db'
import { banners } from '@/db/schema'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
   try {
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
         .insert(banners)
         .values({
            label,
            image,
         })
         .returning()

      return NextResponse.json(banner)
   } catch (error) {
      console.error('[BANNERS_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function GET(req: Request) {
   try {
      const bannersList = await db.query.banners.findMany({
         with: {
            categories: {
               with: {
                  category: true,
               },
            },
         },
      })

      // Transform categories to match expected format
      const transformedBanners = bannersList.map(banner => ({
         ...banner,
         categories: banner.categories.map(bc => bc.category),
      }))

      return NextResponse.json(transformedBanners)
   } catch (error) {
      console.error('[BANNERS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
