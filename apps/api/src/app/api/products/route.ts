import db from '@/lib/db'
import { brands, products, categories, productCategories } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
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

      const { title, description, images, price, discount, stock, categoryId, brandId, isFeatured, isAvailable } = body

      // Handle brand - create default if not provided
      let finalBrandId = brandId

      if (!brandId) {
         // Find or create a default brand
         const [defaultBrand] = await db
            .select()
            .from(brands)
            .where(and(
               eq(brands.title, 'Default Brand'),
               eq(brands.storeId, storeId)
            ))
            .limit(1)

         if (!defaultBrand) {
            const [newBrand] = await db
               .insert(brands)
               .values({
                  title: 'Default Brand',
                  description: 'Default brand for products without specific brand',
                  storeId
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
            storeId,
         })
         .returning()

      // Add category relationship if provided
      if (categoryId && categoryId !== '---') {
         await db.insert(productCategories).values({
            productId: product.id,
            categoryId,
         })
      }

      console.log('Created product:', product)
      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCTS_POST]', error)
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
      const result = await db.query.products.findMany({
         where: eq(products.storeId, storeId),
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

      console.log('Fetched products:', productsWithCategories)
      return NextResponse.json(productsWithCategories)
   } catch (error) {
      console.error('[PRODUCTS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
