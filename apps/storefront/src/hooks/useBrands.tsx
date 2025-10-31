'use client'

import api from '@/lib/api'
import { useEffect, useState } from 'react'

interface Brand {
   id: string
   title: string
   description: string | null
   logo: string | null
}

export function useBrands() {
   const [brands, setBrands] = useState<Brand[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      const fetchBrands = async () => {
         try {
            setLoading(true)
            setError(null)
            
            const data = await api.get<Brand[]>('/api/brands')
            setBrands(data)
         } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            console.error('Error fetching brands:', err)
         } finally {
            setLoading(false)
         }
      }

      fetchBrands()
   }, [])

   return { brands, loading, error }
}
