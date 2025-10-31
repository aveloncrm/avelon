'use client'

import { Spinner } from '@/components/native/icons'
import { Button } from '@/components/ui/button'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { HeartIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Product {
   id: string
   title: string
   [key: string]: any
}

interface WishlistButtonProps {
   product: Product
}

export default function WishlistButton({ product }: WishlistButtonProps) {
   const { authenticated } = useAuthenticated()

   const [wishlist, setWishlist] = useState<Product[] | null>(null)
   const [fetchingWishlist, setFetchingWishlist] = useState(false)

   useEffect(() => {
      async function getWishlist() {
         try {
            setFetchingWishlist(true)
            const response = await fetch(`/api/wishlist`, {
               cache: 'no-store',
               method: 'GET',
            })

            if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`)
            }

            const json = await response.json()
            setWishlist(json)
         } catch (error) {
            console.error('Error fetching wishlist:', error)
            setWishlist([])
         } finally {
            setFetchingWishlist(false)
         }
      }

      // Only make API call if we have a definitive authentication state and user is authenticated
      if (authenticated === true) {
         getWishlist()
      } else if (authenticated === false) {
         setWishlist(null)
         setFetchingWishlist(false)
      }
      // If authenticated is null, do nothing (still loading)
   }, [authenticated])

   function isProductInWishlist() {
      if (!wishlist || !Array.isArray(wishlist)) {
         return false
      }
      
      for (let i = 0; i < wishlist.length; i++) {
         if (wishlist[i]?.id === product?.id) {
            return true
         }
      }
      return false
   }

   async function onAddToWishlist() {
      try {
         setFetchingWishlist(true)

         const response = await fetch(`/api/wishlist`, {
            method: 'POST',
            body: JSON.stringify({ productId: product?.id, connect: true }),
            cache: 'no-store',
            headers: {
               'Content-Type': 'application/json-string',
            },
         })

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
         }

         const json = await response.json()
         setWishlist(json)
         setFetchingWishlist(false)
      } catch (error) {
         console.error('Error adding to wishlist:', error)
         setFetchingWishlist(false)
      }
   }

   async function onRemoveFromWishlist() {
      try {
         setFetchingWishlist(true)

         const response = await fetch(`/api/wishlist`, {
            method: 'DELETE',
            body: JSON.stringify({ productId: product.id, connect: false }),
            cache: 'no-store',
            headers: {
               'Content-Type': 'application/json-string',
            },
         })

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
         }

         const json = await response.json()
         setWishlist(json)
         setFetchingWishlist(false)
      } catch (error) {
         console.error('Error removing from wishlist:', error)
         setFetchingWishlist(false)
      }
   }

   // Don't render anything if not authenticated or still loading authentication state
   if (authenticated !== true) {
      return null
   }

   if (fetchingWishlist)
      return (
         <Button disabled>
            <Spinner />
         </Button>
      )

   if (!isProductInWishlist()) {
      return (
         <Button className="flex gap-2" onClick={onAddToWishlist}>
            <HeartIcon className="h-4" /> Add to Wishlist
         </Button>
      )
   }

   if (isProductInWishlist()) {
      return (
         <Button
            variant="outline"
            className="flex gap-2"
            onClick={onRemoveFromWishlist}
         >
            <HeartIcon className="h-4" /> Remove from Wishlist
         </Button>
      )
   }
}
