'use client'

import api from '@/lib/api'
import { useEffect, useState } from 'react'

interface Category {
   id: string
   title: string
   description: string | null
}

export function useCategories() {
   const [categories, setCategories] = useState<Category[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            setLoading(true)
            setError(null)
            
            const data = await api.get<Category[]>('/api/categories')
            setCategories(data)
         } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            console.error('Error fetching categories:', err)
         } finally {
            setLoading(false)
         }
      }

      fetchCategories()
   }, [])

   return { categories, loading, error }
}
