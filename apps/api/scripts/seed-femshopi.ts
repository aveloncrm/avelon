import { db } from '../src/lib/db'
import { merchants, stores, brands, categories, products, productCategories } from '../src/db/schema'
import { eq } from 'drizzle-orm'

async function main() {
    console.log('🌸 Seeding Femshopi Store...')

    // 1. Create Femshopi Merchant
    const merchantEmail = 'femshopi@example.com'
    let merchant = await db.query.merchants.findFirst({
        where: eq(merchants.email, merchantEmail),
    })

    if (!merchant) {
        console.log('✨ Creating Femshopi Merchant...')
        const [newMerchant] = await db.insert(merchants).values({
            id: 'merchant-femshopi-001',
            email: merchantEmail,
            name: 'Femshopi Merchant',
        }).returning()
        merchant = newMerchant
        console.log('✅ Merchant created:', merchant.id)
    } else {
        console.log('ℹ️  Merchant already exists:', merchant.id)
    }

    // 2. Create Femshopi Store
    const storeSubdomain = 'femshopi'
    let store = await db.query.stores.findFirst({
        where: eq(stores.subdomain, storeSubdomain),
    })

    if (!store) {
        console.log('✨ Creating Femshopi Store...')
        const [newStore] = await db.insert(stores).values({
            id: 'store-femshopi-001',
            name: 'Femshopi',
            subdomain: storeSubdomain,
            merchantId: merchant!.id,
            settings: {
                logo: 'https://via.placeholder.com/150?text=Femshopi',
                primaryColor: '#FF69B4',
                tagline: 'Your Fashion Destination'
            }
        }).returning()
        store = newStore
        console.log('✅ Store created:', store.id)
    } else {
        console.log('ℹ️  Store already exists:', store.id)
    }

    const storeId = store!.id

    // 3. Create Brands
    console.log('✨ Creating Brands...')
    const brandData = [
        { title: 'Femshopi Originals', description: 'Our signature collection' },
        { title: 'Urban Chic', description: 'Modern streetwear' },
        { title: 'Elegance', description: 'Formal and elegant wear' },
        { title: 'Casual Comfort', description: 'Everyday comfortable clothing' },
    ]

    const createdBrands: any[] = []
    for (const brandInfo of brandData) {
        const existingBrand = await db.query.brands.findFirst({
            where: eq(brands.title, brandInfo.title),
        })

        if (!existingBrand) {
            const [brand] = await db.insert(brands).values({
                title: brandInfo.title,
                description: brandInfo.description,
                storeId,
                logo: `https://via.placeholder.com/100?text=${encodeURIComponent(brandInfo.title)}`
            }).returning()
            createdBrands.push(brand)
            console.log(`  ✅ Brand: ${brand.title}`)
        } else {
            createdBrands.push(existingBrand)
            console.log(`  ℹ️  Brand exists: ${existingBrand.title}`)
        }
    }

    // 4. Create Categories
    console.log('✨ Creating Categories...')
    const categoryData = [
        { title: 'Dresses', description: 'Beautiful dresses for every occasion' },
        { title: 'Tops & Blouses', description: 'Stylish tops and blouses' },
        { title: 'Bottoms', description: 'Pants, skirts, and shorts' },
        { title: 'Outerwear', description: 'Jackets and coats' },
        { title: 'Accessories', description: 'Bags, jewelry, and more' },
        { title: 'Shoes', description: 'Footwear collection' },
    ]

    const createdCategories: any[] = []
    for (const catInfo of categoryData) {
        const existingCat = await db.query.categories.findFirst({
            where: eq(categories.title, catInfo.title),
        })

        if (!existingCat) {
            const [category] = await db.insert(categories).values({
                title: catInfo.title,
                description: catInfo.description,
                storeId,
            }).returning()
            createdCategories.push(category)
            console.log(`  ✅ Category: ${category.title}`)
        } else {
            createdCategories.push(existingCat)
            console.log(`  ℹ️  Category exists: ${existingCat.title}`)
        }
    }

    // 5. Create Products
    console.log('✨ Creating Products...')
    const productData = [
        {
            title: 'Floral Summer Dress',
            description: 'Light and breezy floral dress perfect for summer',
            price: 59.99,
            discount: 10,
            stock: 50,
            brandIndex: 0, // Femshopi Originals
            categoryIndex: 0, // Dresses
            isFeatured: true,
            isAvailable: true,
        },
        {
            title: 'Classic White Blouse',
            description: 'Timeless white blouse for any occasion',
            price: 39.99,
            discount: 0,
            stock: 100,
            brandIndex: 2, // Elegance
            categoryIndex: 1, // Tops & Blouses
            isFeatured: true,
            isAvailable: true,
        },
        {
            title: 'High-Waisted Jeans',
            description: 'Comfortable high-waisted denim jeans',
            price: 69.99,
            discount: 15,
            stock: 75,
            brandIndex: 1, // Urban Chic
            categoryIndex: 2, // Bottoms
            isFeatured: false,
            isAvailable: true,
        },
        {
            title: 'Leather Jacket',
            description: 'Stylish faux leather jacket',
            price: 129.99,
            discount: 20,
            stock: 30,
            brandIndex: 1, // Urban Chic
            categoryIndex: 3, // Outerwear
            isFeatured: true,
            isAvailable: true,
        },
        {
            title: 'Cotton T-Shirt',
            description: 'Soft cotton t-shirt in multiple colors',
            price: 24.99,
            discount: 0,
            stock: 200,
            brandIndex: 3, // Casual Comfort
            categoryIndex: 1, // Tops & Blouses
            isFeatured: false,
            isAvailable: true,
        },
        {
            title: 'Crossbody Bag',
            description: 'Elegant crossbody bag with gold chain',
            price: 79.99,
            discount: 5,
            stock: 40,
            brandIndex: 0, // Femshopi Originals
            categoryIndex: 4, // Accessories
            isFeatured: true,
            isAvailable: true,
        },
        {
            title: 'Ankle Boots',
            description: 'Comfortable ankle boots with low heel',
            price: 89.99,
            discount: 10,
            stock: 60,
            brandIndex: 2, // Elegance
            categoryIndex: 5, // Shoes
            isFeatured: false,
            isAvailable: true,
        },
        {
            title: 'Maxi Skirt',
            description: 'Flowing maxi skirt with floral print',
            price: 49.99,
            discount: 0,
            stock: 80,
            brandIndex: 0, // Femshopi Originals
            categoryIndex: 2, // Bottoms
            isFeatured: false,
            isAvailable: true,
        },
    ]

    for (const productInfo of productData) {
        const existingProduct = await db.query.products.findFirst({
            where: eq(products.title, productInfo.title),
        })

        if (!existingProduct) {
            const [product] = await db.insert(products).values({
                title: productInfo.title,
                description: productInfo.description,
                price: productInfo.price,
                discount: productInfo.discount,
                stock: productInfo.stock,
                brandId: createdBrands[productInfo.brandIndex].id,
                storeId,
                images: [
                    `https://via.placeholder.com/400?text=${encodeURIComponent(productInfo.title)}`,
                    `https://via.placeholder.com/400?text=${encodeURIComponent(productInfo.title)}+2`
                ],
                keywords: productInfo.title.toLowerCase().split(' '),
                isFeatured: productInfo.isFeatured,
                isAvailable: productInfo.isAvailable,
            }).returning()

            // Link product to category
            await db.insert(productCategories).values({
                productId: product.id,
                categoryId: createdCategories[productInfo.categoryIndex].id,
            })

            console.log(`  ✅ Product: ${product.title} ($${product.price})`)
        } else {
            console.log(`  ℹ️  Product exists: ${existingProduct.title}`)
        }
    }

    console.log('\n🎉 Femshopi seeding complete!')
    console.log('📊 Summary:')
    console.log(`   Merchant ID: ${merchant!.id}`)
    console.log(`   Store ID: ${store!.id}`)
    console.log(`   Subdomain: ${storeSubdomain}`)
    console.log(`   Brands: ${createdBrands.length}`)
    console.log(`   Categories: ${createdCategories.length}`)
    console.log(`   Products: ${productData.length}`)
    console.log('\n🌐 Test URL: http://femshopi.localhost:9999/api/products')

    process.exit(0)
}

main().catch((err) => {
    console.error('❌ Seeding failed:', err)
    process.exit(1)
})
