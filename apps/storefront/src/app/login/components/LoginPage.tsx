'use client'

import { useAuthenticated } from '@/hooks/useAuthentication'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

interface LoginPageProps {
   children: React.ReactNode
}

export function LoginPage({ children }: LoginPageProps) {
   const { authenticated } = useAuthenticated()
   const router = useRouter()
   const searchParams = useSearchParams()

   useEffect(() => {
      if (authenticated === true) {
         const redirectTo = searchParams.get('redirect') || '/'
         router.push(redirectTo)
      }
   }, [authenticated, router, searchParams])

   if (authenticated === true) {
      return <div>Redirecting...</div>
   }

   return <>{children}</>
}
