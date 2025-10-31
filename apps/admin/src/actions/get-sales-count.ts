import serverApi from '@/lib/api-server'

export const getSalesCount = async () => {
   try {
      const response = await serverApi.get('/api/orders', { adminView: true, isPaid: true })
      const orders = response.orders || []
      return orders.length
   } catch (error) {
      console.error('Error fetching sales count:', error)
      return 0
   }
}
