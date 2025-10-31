import db from '@/lib/db'
import { products } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: Promise<{ productId: string }> }
) {
   try {
      const { productId } = await params

      if (!productId) {
         return new NextResponse('Product id is required', { status: 400 })
      }

      // Public endpoint - no authentication required for GET
      const product = await db.query.products.findFirst({
         where: eq(products.id, productId),
         with: {
            categories: {
               with: {
                  category: true,
               },
            },
            brand: true,
         },
      })

      if (!product) {
         return new NextResponse('Product not found', { status: 404 })
      }

      // Transform categories to match expected format
      const transformedProduct = {
         ...product,
         categories: product.categories.map(pc => pc.category),
      }

      return NextResponse.json(transformedProduct)
   } catch (error) {
      console.error('[PRODUCT_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: Promise<{ productId: string }> }
) {
   try {
      const { productId } = await params
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const [product] = await db
         .delete(products)
         .where(eq(products.id, productId))
         .returning()

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: Promise<{ productId: string }> }
) {
   try {
      const { productId } = await params
      if (!productId) {
         return new NextResponse('Product Id is required', { status: 400 })
      }

      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json()

      const { title, description, images, price, discount, stock, isFeatured, isAvailable } = body

      const [product] = await db
         .update(products)
         .set({
            title,
            description,
            images,
            price,
            discount,
            stock,
            isFeatured,
            isAvailable,
         })
         .where(eq(products.id, productId))
         .returning()

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
