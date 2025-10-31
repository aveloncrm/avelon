import db from '@/lib/db'
import { brands, products, categories, productCategories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json()

      const { title, description, images, price, discount, stock, categoryId, brandId, isFeatured, isAvailable } = body

      // Handle brand - create default if not provided
      let finalBrandId = brandId

      if (!brandId) {
         // Find or create a default brand
         const [defaultBrand] = await db
            .select()
            .from(brands)
            .where(eq(brands.title, 'Default Brand'))
            .limit(1)

         if (!defaultBrand) {
            const [newBrand] = await db
               .insert(brands)
               .values({
                  title: 'Default Brand',
                  description: 'Default brand for products without specific brand'
               })
               .returning()

            finalBrandId = newBrand.id
         } else {
            finalBrandId = defaultBrand.id
         }
      } else {
         // Check if provided brand exists
         const [brand] = await db
            .select()
            .from(brands)
            .where(eq(brands.id, brandId))
            .limit(1)

         if (!brand) {
            return new NextResponse('Brand not found', { status: 404 })
         }
      }

      // Check if category exists (if provided)
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

      const [product] = await db
         .insert(products)
         .values({
            title,
            description,
            images,
            price,
            discount,
            stock,
            isFeatured,
            isAvailable,
            brandId: finalBrandId,
         })
         .returning()

      // Add category relationship if provided
      if (categoryId && categoryId !== '---') {
         await db.insert(productCategories).values({
            productId: product.id,
            categoryId,
         })
      }

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCTS_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function GET() {
   try {
      // Public endpoint - no authentication required for GET
      const result = await db.query.products.findMany({
         with: {
            brand: true,
            categories: {
               with: {
                  category: true,
               },
            },
         },
      })

      // Transform the data to match expected output format
      const productsWithCategories = result.map(product => ({
         ...product,
         categories: product.categories.map(pc => pc.category),
      }))

      return NextResponse.json(productsWithCategories)
   } catch (error) {
      console.error('[PRODUCTS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
