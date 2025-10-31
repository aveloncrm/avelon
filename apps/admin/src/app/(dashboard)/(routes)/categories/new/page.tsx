import serverApi from '@/lib/api-server'

import { CategoryForm } from '../[categoryId]/components/category-form'

const NewCategoryPage = async () => {
   const banners = await serverApi.get('/api/banners')

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm banners={banners} initialData={null} />
         </div>
      </div>
   )
}

export default NewCategoryPage
