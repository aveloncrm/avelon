/**
 * Type definitions for data models
 * These mirror the API response structures
 */

export interface Brand {
   id: string
   title: string
   description: string | null
   logo: string | null
}

export interface Category {
   id: string
   title: string
   description: string | null
   createdAt: Date
   updatedAt: Date
}

export interface Product {
   id: string
   title: string
   description: string | null
   images: string[]
   keywords: string[]
   metadata: any
   price: number
   discount: number
   stock: number
   isPhysical: boolean
   isAvailable: boolean
   isFeatured: boolean
   brandId: string
   createdAt: Date
   updatedAt: Date
}

export interface ProductWithIncludes extends Product {
   brand: Brand
   categories: Category[]
}

export interface Address {
   id: string
   country: string
   address: string
   city: string
   phone: string
   postalCode: string
   userId: string
   createdAt: Date
}

export interface User {
   id: string
   email: string | null
   phone: string | null
   name: string | null
   birthday: string | null
   OTP: string | null
   emailUnsubscribeToken: string | null
   referralCode: string | null
   isBanned: boolean
   isEmailVerified: boolean
   isPhoneVerified: boolean
   isEmailSubscribed: boolean
   isPhoneSubscribed: boolean
   createdAt: Date
   updatedAt: Date
}

export interface OrderItem {
   orderId: string
   productId: string
   count: number
   price: number
   discount: number
   product: Product
}

export interface Payment {
   id: string
   number: number
   status: string
   refId: string
   cardPan: string | null
   cardHash: string | null
   fee: number | null
   isSuccessful: boolean
   payable: number
   providerId: string
   userId: string
   orderId: string
   createdAt: Date
   updatedAt: Date
}

export interface PaymentProvider {
   id: string
   title: string
   description: string | null
   websiteUrl: string | null
   isActive: boolean
}

export interface Refund {
   id: string
   amount: number
   reason: string
   orderId: string
   createdAt: Date
   updatedAt: Date
}

export interface DiscountCode {
   id: string
   code: string
   stock: number
   description: string | null
   percent: number
   maxDiscountAmount: number
   startDate: Date
   endDate: Date
   createdAt: Date
}

export interface Order {
   id: string
   number: number
   status: string
   total: number
   shipping: number
   payable: number
   tax: number
   discount: number
   isPaid: boolean
   isCompleted: boolean
   discountCodeId: string | null
   addressId: string | null
   userId: string
   createdAt: Date
   updatedAt: Date
}

export interface UserWithIncludes extends User {
   addresses: Address[]
   orders: Array<Order & {
      orderItems: Array<OrderItem & { product: Product }>
   }>
}

export interface OrderWithIncludes extends Order {
   address: Address | null
   discountCode: DiscountCode | null
   user: UserWithIncludes
   payments: Array<Payment & { provider: PaymentProvider }>
   orderItems: Array<OrderItem & { product: Product }>
   refund: Refund | null
}

export interface CartItem {
   cartId: string
   productId: string
   count: number
}

export interface CartItemWithProduct extends CartItem {
   product: ProductWithIncludes
}

export interface Banner {
   id: string
   label: string
   image: string
   createdAt: Date
   updatedAt: Date
}

