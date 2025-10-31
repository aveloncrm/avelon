import serverApi from '@/lib/api-server'

import { ProductForm } from './components/product-form'

export default async function ProductPage({
   params,
}: {
   params: Promise<{ productId: string }>
}) {
   const { productId } = await params
   
   let product = null
   if (productId !== 'new') {
      try {
         product = await serverApi.get(`/api/products/${productId}`)
      } catch (error) {
         console.error('Error fetching product:', error)
      }
   }

   const categories = await serverApi.get('/api/categories')

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 pt-6 pb-12">
            <ProductForm categories={categories} initialData={product} />
         </div>
      </div>
   )
}
