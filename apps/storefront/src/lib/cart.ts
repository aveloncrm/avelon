interface CartItem {
   productId: string
   count: number
}

interface Cart {
   items: CartItem[]
}

export function writeLocalCart(items: CartItem[]): void {
   window.localStorage.setItem('Cart', JSON.stringify({ items }))
}

export function getLocalCart(): Cart | null {
   if (typeof window !== 'undefined' && window.localStorage) {
      try {
         const cartData = window.localStorage.getItem('Cart')
         return cartData ? JSON.parse(cartData) : null
      } catch (error) {
         writeLocalCart([])
         return { items: [] }
      }
   }
   return null
}

export function getCountInCart({ cartItems, productId }: { cartItems: CartItem[]; productId: string }): number {
   try {
      // Check if cartItems exists and is an array
      if (!cartItems || !Array.isArray(cartItems)) {
         return 0
      }

      for (let i = 0; i < cartItems.length; i++) {
         if (cartItems[i]?.productId === productId) {
            return cartItems[i]?.count || 0
         }
      }

      return 0
   } catch (error) {
      console.error('Error getting count in cart:', error)
      return 0
   }
}
