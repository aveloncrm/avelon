'use client'

import { useEffect, useState } from 'react'

export function useAuthenticated() {
   const [authenticated, setAuthenticated] = useState<boolean | null>(null)
   const [isMounted, setIsMounted] = useState(false)

   useEffect(() => {
      setIsMounted(true)
      
      try {
         if (typeof window !== 'undefined') {
            const cookies = document.cookie.split(';')
            
            // Find the logged-in cookie
            const loggedInCookieString = cookies.find((cookie) => cookie.trim().startsWith('logged-in'))
            
            if (loggedInCookieString) {
               const cookieValue = loggedInCookieString.split('=')[1]
               const isLoggedIn = cookieValue === 'true'
               setAuthenticated(isLoggedIn)
            } else {
               setAuthenticated(false)
            }
         }
      } catch (error) {
         console.error({ error })
         setAuthenticated(false)
      }
   }, [])

   // Prevent hydration mismatch by not rendering until mounted
   if (!isMounted) {
      return { authenticated: null }
   }

   return { authenticated: authenticated === true }
}
