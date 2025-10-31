import serverApi from '@/lib/api-server'

export const getStockCount = async () => {
   try {
      const products = await serverApi.get('/api/products')
      const availableProducts = products.filter((p: any) => p.isAvailable)
      return availableProducts.length
   } catch (error) {
      console.error('Error fetching stock count:', error)
      return 0
   }
}
