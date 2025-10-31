'use client'

import { tokenStorage } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
   const router = useRouter()
   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

   useEffect(() => {
      // Check if user has token
      const token = tokenStorage.get()
      
      if (!token) {
         // No token, redirect to login
         router.replace('/login')
         setIsAuthenticated(false)
         return
      }

      // Token exists, allow access
      setIsAuthenticated(true)
   }, [router])

   // Show nothing while checking (prevent flash of content)
   if (isAuthenticated === null) {
      return null
   }

   // If not authenticated, nothing is rendered (redirect happens)
   if (!isAuthenticated) {
      return null
   }

   // User is authenticated, render children
   return <>{children}</>
}

