import api from '@/lib/api'

export const getSalesCount = async () => {
   try {
      const response = await api.get('/api/orders', { adminView: true, isPaid: true })
      const orders = response.orders || []
      return orders.length
   } catch (error) {
      console.error('Error fetching sales count:', error)
      return 0
   }
}
