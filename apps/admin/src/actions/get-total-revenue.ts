import api from '@/lib/api'

export const getTotalRevenue = async () => {
   try {
      const response = await api.get('/api/orders', { adminView: true, isPaid: true })
      const paidOrders = response.orders || []

      const totalRevenue = paidOrders.reduce((total: number, order: any) => {
         return total + (order.payable || 0)
      }, 0)

      return totalRevenue
   } catch (error) {
      console.error('Error fetching total revenue:', error)
      return 0
   }
}
