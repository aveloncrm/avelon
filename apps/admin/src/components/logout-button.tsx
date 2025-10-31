'use client'

import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { LogOutIcon } from 'lucide-react'

export function LogoutButton() {
   async function onLogout() {
      try {
         await api.get('/api/auth/logout')

         if (typeof window !== 'undefined' && window.localStorage) {
            document.cookie =
               'logged-in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
         }

         window.location.reload()
      } catch (error) {
         console.error({ error })
      }
   }

   return (
      <Button variant="outline" size="icon" onClick={onLogout}>
         <LogOutIcon className="h-4" />
      </Button>
   )
}
