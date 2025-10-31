'use client'

import { useAuthenticated } from '@/hooks/useAuthentication'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
   children: React.ReactNode
   fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
   const { authenticated } = useAuthenticated()
   const router = useRouter()

   useEffect(() => {
      if (authenticated === false) {
         router.push('/login')
      }
   }, [authenticated, router])

   if (authenticated === null) {
      return fallback || <div>Loading...</div>
   }

   if (authenticated === false) {
      return fallback || <div>Redirecting to login...</div>
   }

   return <>{children}</>
}
