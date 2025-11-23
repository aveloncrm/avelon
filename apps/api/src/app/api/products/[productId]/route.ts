import db from '@/lib/db'
import { products, productCategories, brands, categories } from '@/db/schema'
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

      const { title, description, images, price, discount, stock, categoryId, brandId, isFeatured, isAvailable } = body

      // Handle brand validation if provided
      if (brandId) {
         const [brand] = await db
            .select()
            .from(brands)
            .where(eq(brands.id, brandId))
            .limit(1)

         if (!brand) {
            return new NextResponse('Brand not found', { status: 404 })
         }
      }

      // Handle category validation if provided
      if (categoryId && categoryId !== '---') {
         const [category] = await db
            .select()
            .from(categories)
            .where(eq(categories.id, categoryId))
            .limit(1)

         if (!category) {
            return new NextResponse('Category not found', { status: 404 })
         }
      }

      // Update the product
      const updateData: any = {
         title,
         description,
         images,
         price,
         discount,
         stock,
         isFeatured,
         isAvailable,
      }

      // Only update brandId if provided
      if (brandId) {
         updateData.brandId = brandId
      }

      const [product] = await db
         .update(products)
         .set(updateData)
         .where(eq(products.id, productId))
         .returning()

      // Update category relationship if provided
      if (categoryId) {
         // First, delete existing category relationships
         await db
            .delete(productCategories)
            .where(eq(productCategories.productId, productId))

         // Then add new category relationship if it's not the default '---'
         if (categoryId !== '---') {
            await db.insert(productCategories).values({
               productId: product.id,
               categoryId,
            })
         }
      }

      console.log('Updated product:', product)
      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
