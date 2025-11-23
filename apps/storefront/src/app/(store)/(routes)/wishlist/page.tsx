'use client'

import { CartGrid } from '@/app/(store)/(routes)/cart/components/grid'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { isVariableValid } from '@/lib/utils'
import { useUserContext } from '@/state/User'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function User() {
   const { authenticated } = useAuthenticated()
   const { user, loading } = useUserContext()


   const router = useRouter()

   useEffect(() => {
      if (!loading && !isVariableValid(user)) router.push('/')
   }, [user, loading, router])

   useEffect(() => {
      async function getWishlist() {
         try {
            const response = await fetch(`/api/wishlist`, {
               cache: 'no-store',
            })

            await response.json()

            // Wishlist items are fetched but not used currently
         } catch (error) {
            console.error({ error })
         }
      }

      if (authenticated) getWishlist()
   }, [authenticated])

   return (
      <>
         <CartGrid />
      </>
   )
}
