'use client'

import { Button } from '@/components/ui/button'
import api, { tokenStorage } from '@/lib/api'
import { LogOutIcon } from 'lucide-react'

export function LogoutButton() {
   async function onLogout() {
      try {
         // Clear token from localStorage
         tokenStorage.remove()

         // Call API logout endpoint (optional, to clean up API-side session)
         await api.get('/api/auth/logout').catch(() => {})

         // Redirect to login
         window.location.href = '/login'
      } catch (error) {
         console.error({ error })
         // Ensure token is cleared even if API call fails
         tokenStorage.remove()
         window.location.href = '/login'
      }
   }

   return (
      <Button variant="outline" size="icon" onClick={onLogout}>
         <LogOutIcon className="h-4" />
      </Button>
   )
}
