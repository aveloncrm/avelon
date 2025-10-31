import api from '@/lib/api'

export const getStockCount = async () => {
   try {
      const products = await api.get('/api/products')
      const availableProducts = products.filter((p: any) => p.isAvailable)
      return availableProducts.length
   } catch (error) {
      console.error('Error fetching stock count:', error)
      return 0
   }
}
