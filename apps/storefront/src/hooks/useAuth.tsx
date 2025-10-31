'use client'

import api from '@/lib/api'
import { useUserContext } from '@/state/User'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { useRouter } from 'next/navigation'

export function useAuth() {
   const { authenticated } = useAuthenticated()
   const { user, loading, refreshUser } = useUserContext()
   const router = useRouter()

   const logout = async () => {
      try {
         await api.get('/api/auth/logout')
         
         // Clear cookies
         document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
         document.cookie = 'logged-in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
         
         // Redirect to login page
         router.push('/login')
      } catch (error) {
         console.error({ error })
         // Even if there's an error, clear cookies and redirect
         document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
         document.cookie = 'logged-in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
         router.push('/login')
      }
   }

   const requireAuth = () => {
      if (authenticated === false) {
         router.push('/login')
         return false
      }
      return true
   }

   return {
      authenticated,
      user,
      loading,
      refreshUser,
      logout,
      requireAuth,
   }
}
