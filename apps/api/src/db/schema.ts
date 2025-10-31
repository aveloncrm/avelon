import { relations } from 'drizzle-orm'
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  doublePrecision,
  serial,
  json,
  uniqueIndex,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core'

// Enums
export const orderStatusEnum = pgEnum('OrderStatusEnum', [
  'Processing',
  'Shipped',
  'Delivered',
  'ReturnProcessing',
  'ReturnCompleted',
  'Cancelled',
  'RefundProcessing',
  'RefundCompleted',
  'Denied',
])

export const paymentStatusEnum = pgEnum('PaymentStatusEnum', [
  'Processing',
  'Paid',
  'Failed',
  'Denied',
])

// Tables
export const users = pgTable('User', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').unique(),
  phone: text('phone').unique(),
  name: text('name'),
  birthday: text('birthday'),
  OTP: text('OTP'),
  emailUnsubscribeToken: text('emailUnsubscribeToken').unique().$defaultFn(() => crypto.randomUUID()),
  referralCode: text('referralCode').unique(),
  isBanned: boolean('isBanned').notNull().default(false),
  isEmailVerified: boolean('isEmailVerified').notNull().default(false),
  isPhoneVerified: boolean('isPhoneVerified').notNull().default(false),
  isEmailSubscribed: boolean('isEmailSubscribed').notNull().default(false),
  isPhoneSubscribed: boolean('isPhoneSubscribed').notNull().default(false),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const carts = pgTable('Cart', {
  userId: text('userId').primaryKey().references(() => users.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const brands = pgTable('Brand', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull().unique(),
  description: text('description'),
  logo: text('logo'),
})

export const products = pgTable('Product', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description'),
  images: text('images').array().notNull().default([]),
  keywords: text('keywords').array().notNull().default([]),
  metadata: json('metadata'),
  price: doublePrecision('price').notNull().default(100),
  discount: doublePrecision('discount').notNull().default(0),
  stock: integer('stock').notNull().default(0),
  isPhysical: boolean('isPhysical').notNull().default(true),
  isAvailable: boolean('isAvailable').notNull().default(false),
  isFeatured: boolean('isFeatured').notNull().default(false),
  brandId: text('brandId').notNull().references(() => brands.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  brandIdIdx: index('Product_brandId_idx').on(table.brandId),
}))

export const categories = pgTable('Category', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const productCategories = pgTable('_CategoryToProduct', {
  productId: text('A').notNull().references(() => products.id),
  categoryId: text('B').notNull().references(() => categories.id),
}, (table) => ({
  pk: uniqueIndex('_CategoryToProduct_AB_unique').on(table.productId, table.categoryId),
  categoryIdIdx: index('_CategoryToProduct_B_index').on(table.categoryId),
}))

export const wishlist = pgTable('_Wishlist', {
  userId: text('A').notNull().references(() => users.id),
  productId: text('B').notNull().references(() => products.id),
}, (table) => ({
  pk: uniqueIndex('_Wishlist_AB_unique').on(table.userId, table.productId),
  productIdIdx: index('_Wishlist_B_index').on(table.productId),
}))

export const cartItems = pgTable('CartItem', {
  cartId: text('cartId').notNull().references(() => carts.userId),
  productId: text('productId').notNull().references(() => products.id),
  count: integer('count').notNull(),
}, (table) => ({
  pk: uniqueIndex('UniqueCartItem').on(table.cartId, table.productId),
}))

export const productReviews = pgTable('ProductReview', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  text: text('text').notNull(),
  rating: integer('rating').notNull(),
  productId: text('productId').notNull().references(() => products.id),
  userId: text('userId').notNull().references(() => users.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  uniqueReview: uniqueIndex('UniqueProductProductReview').on(table.productId, table.userId),
  userIdIdx: index('ProductReview_userId_idx').on(table.userId),
  productIdIdx: index('ProductReview_productId_idx').on(table.productId),
}))

export const addresses = pgTable('Address', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  country: text('country').notNull().default('IRI'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  phone: text('phone').notNull(),
  postalCode: text('postalCode').notNull(),
  userId: text('userId').notNull().references(() => users.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('Address_userId_idx').on(table.userId),
}))

export const discountCodes = pgTable('DiscountCode', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text('code').notNull().unique(),
  stock: integer('stock').notNull().default(1),
  description: text('description'),
  percent: integer('percent').notNull(),
  maxDiscountAmount: doublePrecision('maxDiscountAmount').notNull().default(1),
  startDate: timestamp('startDate', { mode: 'date' }).notNull(),
  endDate: timestamp('endDate', { mode: 'date' }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
})

export const orders = pgTable('Order', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  number: serial('number').notNull().unique(),
  status: orderStatusEnum('status').notNull(),
  total: doublePrecision('total').notNull().default(100),
  shipping: doublePrecision('shipping').notNull().default(100),
  payable: doublePrecision('payable').notNull().default(100),
  tax: doublePrecision('tax').notNull().default(100),
  discount: doublePrecision('discount').notNull().default(0),
  isPaid: boolean('isPaid').notNull().default(false),
  isCompleted: boolean('isCompleted').notNull().default(false),
  discountCodeId: text('discountCodeId').references(() => discountCodes.id),
  addressId: text('addressId').references(() => addresses.id),
  userId: text('userId').notNull().references(() => users.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  userIdIdx: index('Order_userId_idx').on(table.userId),
  addressIdIdx: index('Order_addressId_idx').on(table.addressId),
  discountCodeIdIdx: index('Order_discountCodeId_idx').on(table.discountCodeId),
}))

export const orderItems = pgTable('OrderItem', {
  orderId: text('orderId').notNull().references(() => orders.id),
  productId: text('productId').notNull().references(() => products.id),
  count: integer('count').notNull(),
  price: doublePrecision('price').notNull(),
  discount: doublePrecision('discount').notNull(),
}, (table) => ({
  pk: uniqueIndex('UniqueOrderItem').on(table.orderId, table.productId),
}))

export const refunds = pgTable('Refund', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  amount: doublePrecision('amount').notNull(),
  reason: text('reason').notNull(),
  orderId: text('orderId').notNull().unique().references(() => orders.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  orderIdIdx: index('Refund_orderId_idx').on(table.orderId),
}))

export const paymentProviders = pgTable('PaymentProvider', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull().unique(),
  description: text('description'),
  websiteUrl: text('websiteUrl'),
  isActive: boolean('isActive').notNull().default(false),
})

export const payments = pgTable('Payment', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  number: serial('number').notNull().unique(),
  status: paymentStatusEnum('status').notNull(),
  refId: text('refId').notNull().unique(),
  cardPan: text('cardPan'),
  cardHash: text('cardHash'),
  fee: doublePrecision('fee'),
  isSuccessful: boolean('isSuccessful').notNull().default(false),
  payable: doublePrecision('payable').notNull(),
  providerId: text('providerId').notNull().references(() => paymentProviders.id),
  userId: text('userId').notNull().references(() => users.id),
  orderId: text('orderId').notNull().references(() => orders.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  userIdIdx: index('Payment_userId_idx').on(table.userId),
  providerIdIdx: index('Payment_providerId_idx').on(table.providerId),
  orderIdIdx: index('Payment_orderId_idx').on(table.orderId),
}))

export const notifications = pgTable('Notification', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  content: text('content').notNull(),
  isRead: boolean('isRead').notNull().default(false),
  userId: text('userId').notNull().references(() => users.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  userIdIdx: index('Notification_userId_idx').on(table.userId),
}))

export const owners = pgTable('Owner', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  phone: text('phone').unique(),
  name: text('name'),
  avatar: text('avatar'),
  OTP: text('OTP'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const authors = pgTable('Author', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  phone: text('phone').unique(),
  name: text('name'),
  avatar: text('avatar'),
  OTP: text('OTP'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const blogs = pgTable('Blog', {
  slug: text('slug').primaryKey(),
  title: text('title').notNull(),
  image: text('image').notNull(),
  description: text('description').notNull(),
  content: text('content'),
  categories: text('categories').array().notNull().default([]),
  keywords: text('keywords').array().notNull().default([]),
  authorId: text('authorId').notNull().references(() => authors.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  authorIdIdx: index('Blog_authorId_idx').on(table.authorId),
}))

export const banners = pgTable('Banner', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  label: text('label').notNull(),
  image: text('image').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const bannerCategories = pgTable('_BannerToCategory', {
  bannerId: text('A').notNull().references(() => banners.id),
  categoryId: text('B').notNull().references(() => categories.id),
}, (table) => ({
  pk: uniqueIndex('_BannerToCategory_AB_unique').on(table.bannerId, table.categoryId),
  categoryIdIdx: index('_BannerToCategory_B_index').on(table.categoryId),
}))

export const errors = pgTable('Error', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  error: text('error').notNull(),
  userId: text('userId').references(() => users.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('Error_userId_idx').on(table.userId),
}))

export const files = pgTable('File', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  url: text('url').notNull(),
  userId: text('userId').notNull().references(() => users.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('File_userId_idx').on(table.userId),
}))

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  cart: one(carts, {
    fields: [users.id],
    references: [carts.userId],
  }),
  wishlist: many(wishlist),
  orders: many(orders),
  addresses: many(addresses),
  payments: many(payments),
  notifications: many(notifications),
  productReviews: many(productReviews),
  errors: many(errors),
  files: many(files),
}))

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}))

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  categories: many(productCategories),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  wishlists: many(wishlist),
  productReviews: many(productReviews),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(productCategories),
  banners: many(bannerCategories),
}))

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
  product: one(products, {
    fields: [productCategories.productId],
    references: [products.id],
  }),
  category: one(categories, {
    fields: [productCategories.categoryId],
    references: [categories.id],
  }),
}))

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  user: one(users, {
    fields: [wishlist.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlist.productId],
    references: [products.id],
  }),
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.userId],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}))

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [productReviews.userId],
    references: [users.id],
  }),
}))

export const addressesRelations = relations(addresses, ({ one, many }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
  orders: many(orders),
}))

export const discountCodesRelations = relations(discountCodes, ({ many }) => ({
  orders: many(orders),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  address: one(addresses, {
    fields: [orders.addressId],
    references: [addresses.id],
  }),
  discountCode: one(discountCodes, {
    fields: [orders.discountCodeId],
    references: [discountCodes.id],
  }),
  orderItems: many(orderItems),
  payments: many(payments),
  refund: one(refunds, {
    fields: [orders.id],
    references: [refunds.orderId],
  }),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

export const refundsRelations = relations(refunds, ({ one }) => ({
  order: one(orders, {
    fields: [refunds.orderId],
    references: [orders.id],
  }),
}))

export const paymentProvidersRelations = relations(paymentProviders, ({ many }) => ({
  payments: many(payments),
}))

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
  provider: one(paymentProviders, {
    fields: [payments.providerId],
    references: [paymentProviders.id],
  }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}))

export const authorsRelations = relations(authors, ({ many }) => ({
  blogs: many(blogs),
}))

export const blogsRelations = relations(blogs, ({ one }) => ({
  author: one(authors, {
    fields: [blogs.authorId],
    references: [authors.id],
  }),
}))

export const bannersRelations = relations(banners, ({ many }) => ({
  categories: many(bannerCategories),
}))

export const bannerCategoriesRelations = relations(bannerCategories, ({ one }) => ({
  banner: one(banners, {
    fields: [bannerCategories.bannerId],
    references: [banners.id],
  }),
  category: one(categories, {
    fields: [bannerCategories.categoryId],
    references: [categories.id],
  }),
}))

export const errorsRelations = relations(errors, ({ one }) => ({
  user: one(users, {
    fields: [errors.userId],
    references: [users.id],
  }),
}))

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
}))

