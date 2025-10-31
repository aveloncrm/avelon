import serverApi from '@/lib/api-server'

import { CategoryForm } from './components/category-form'

const CategoryPage = async ({
   params,
}: {
   params: Promise<{ categoryId: string; id: string }>
}) => {
   const { categoryId } = await params
   
   let category = null
   if (categoryId !== 'new') {
      try {
         category = await serverApi.get(`/api/categories/${categoryId}`)
      } catch (error) {
         console.error('Error fetching category:', error)
      }
   }

   const banners = await serverApi.get('/api/banners')

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm banners={banners} initialData={category} />
         </div>
      </div>
   )
}

export default CategoryPage
