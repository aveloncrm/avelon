/**
 * Drizzle ORM Type Definitions
 * 
 * This file exports inferred types from the Drizzle schema
 * to be used throughout the application.
 */

import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import * as schema from '@/db/schema'

// User Types
export type User = InferSelectModel<typeof schema.users>
export type NewUser = InferInsertModel<typeof schema.users>

// Store Types
export type Store = InferSelectModel<typeof schema.stores>
export type NewStore = InferInsertModel<typeof schema.stores>

// Cart Types
export type Cart = InferSelectModel<typeof schema.carts>
export type NewCart = InferInsertModel<typeof schema.carts>

export type CartItem = InferSelectModel<typeof schema.cartItems>
export type NewCartItem = InferInsertModel<typeof schema.cartItems>

// Product Types
export type Product = InferSelectModel<typeof schema.products>
export type NewProduct = InferInsertModel<typeof schema.products>

export type Brand = InferSelectModel<typeof schema.brands>
export type NewBrand = InferInsertModel<typeof schema.brands>

export type Category = InferSelectModel<typeof schema.categories>
export type NewCategory = InferInsertModel<typeof schema.categories>

export type ProductReview = InferSelectModel<typeof schema.productReviews>
export type NewProductReview = InferInsertModel<typeof schema.productReviews>

// Order Types
export type Order = InferSelectModel<typeof schema.orders>
export type NewOrder = InferInsertModel<typeof schema.orders>

export type OrderItem = InferSelectModel<typeof schema.orderItems>
export type NewOrderItem = InferInsertModel<typeof schema.orderItems>

export type DiscountCode = InferSelectModel<typeof schema.discountCodes>
export type NewDiscountCode = InferInsertModel<typeof schema.discountCodes>

export type Refund = InferSelectModel<typeof schema.refunds>
export type NewRefund = InferInsertModel<typeof schema.refunds>

// Payment Types
export type Payment = InferSelectModel<typeof schema.payments>
export type NewPayment = InferInsertModel<typeof schema.payments>

export type PaymentProvider = InferSelectModel<typeof schema.paymentProviders>
export type NewPaymentProvider = InferInsertModel<typeof schema.paymentProviders>

// Address Types
export type Address = InferSelectModel<typeof schema.addresses>
export type NewAddress = InferInsertModel<typeof schema.addresses>

// Notification Types
export type Notification = InferSelectModel<typeof schema.notifications>
export type NewNotification = InferInsertModel<typeof schema.notifications>

// Merchant Types
export type Merchant = InferSelectModel<typeof schema.merchants>
export type NewMerchant = InferInsertModel<typeof schema.merchants>

// Merchant Notification Types
export type MerchantNotification = InferSelectModel<typeof schema.merchantNotifications>
export type NewMerchantNotification = InferInsertModel<typeof schema.merchantNotifications>

// Author Types
export type Author = InferSelectModel<typeof schema.authors>
export type NewAuthor = InferInsertModel<typeof schema.authors>

// Blog Types
export type Blog = InferSelectModel<typeof schema.blogs>
export type NewBlog = InferInsertModel<typeof schema.blogs>

// Banner Types
export type Banner = InferSelectModel<typeof schema.banners>
export type NewBanner = InferInsertModel<typeof schema.banners>

// Error Types
export type Error = InferSelectModel<typeof schema.errors>
export type NewError = InferInsertModel<typeof schema.errors>

// File Types
export type File = InferSelectModel<typeof schema.files>
export type NewFile = InferInsertModel<typeof schema.files>

