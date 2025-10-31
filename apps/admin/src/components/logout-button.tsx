'use client'

import { Button } from '@/components/ui/button'
import api, { tokenStorage } from '@/lib/api'
import { LogOutIcon } from 'lucide-react'

export function LogoutButton() {
   async function onLogout() {
      try {
         // Clear token from localStorage
         tokenStorage.remove()
         
         // Clear cookie on admin domain
         document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0'

         // Call API logout endpoint (optional, to clean up API-side session)
         await api.get('/api/auth/logout').catch(() => {})

         // Redirect to login
         window.location.href = '/login'
      } catch (error) {
         console.error({ error })
         // Ensure token is cleared even if API call fails
         tokenStorage.remove()
         document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0'
         window.location.href = '/login'
      }
   }

   return (
      <Button variant="outline" size="icon" onClick={onLogout}>
         <LogOutIcon className="h-4" />
      </Button>
   )
}
