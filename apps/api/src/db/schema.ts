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

export const subscriptionPlanEnum = pgEnum('SubscriptionPlanEnum', [
  'free',
  'starter',
  'pro',
  'enterprise',
])

export const subscriptionStatusEnum = pgEnum('SubscriptionStatusEnum', [
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid',
])

export const teamMemberRoleEnum = pgEnum('TeamMemberRoleEnum', [
  'owner',
  'admin',
  'member',
])

export const inviteStatusEnum = pgEnum('InviteStatusEnum', [
  'pending',
  'accepted',
])

// Tables

// Merchants (formerly Owners) - The SaaS Users
export const merchants = pgTable('Merchant', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  phone: text('phone').unique(),
  name: text('name'),
  avatar: text('avatar'),
  OTP: text('OTP'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
})

// Subscriptions - SaaS Billing
export const subscriptions = pgTable('Subscription', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  merchantId: text('merchantId').notNull().references(() => merchants.id).unique(),
  plan: subscriptionPlanEnum('plan').notNull().default('free'),
  status: subscriptionStatusEnum('status').notNull().default('active'),
  stripeCustomerId: text('stripeCustomerId').unique(),
  stripeSubscriptionId: text('stripeSubscriptionId').unique(),
  currentPeriodStart: timestamp('currentPeriodStart', { mode: 'date' }),
  currentPeriodEnd: timestamp('currentPeriodEnd', { mode: 'date' }),
  cancelAtPeriodEnd: boolean('cancelAtPeriodEnd').notNull().default(false),
  trialEndsAt: timestamp('trialEndsAt', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  merchantIdIdx: index('Subscription_merchantId_idx').on(table.merchantId),
  stripeCustomerIdx: index('Subscription_stripeCustomerId_idx').on(table.stripeCustomerId),
}))

// Stores - The Tenants
export const stores = pgTable('Store', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  subdomain: text('subdomain').notNull().unique(), // e.g. "mystore"
  customDomain: text('customDomain').unique(), // e.g. "mystore.com"
  merchantId: text('merchantId').notNull().references(() => merchants.id),
  settings: json('settings'), // Logo, colors, etc.
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  merchantIdIdx: index('Store_merchantId_idx').on(table.merchantId),
  subdomainIdx: index('Store_subdomain_idx').on(table.subdomain),
}))

// Team Members - Access control for stores
export const teamMembers = pgTable('TeamMember', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  merchantId: text('merchantId').notNull().references(() => merchants.id, { onDelete: 'cascade' }),
  role: teamMemberRoleEnum('role').notNull().default('admin'),
  status: inviteStatusEnum('status').notNull().default('pending'),
  inviteToken: text('inviteToken').unique(),
  invitedBy: text('invitedBy').references(() => merchants.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  storeIdIdx: index('TeamMember_storeId_idx').on(table.storeId),
  merchantIdIdx: index('TeamMember_merchantId_idx').on(table.merchantId),
  uniqueStoreUser: uniqueIndex('TeamMember_storeId_merchantId_idx').on(table.storeId, table.merchantId),
  tokenIdx: index('TeamMember_inviteToken_idx').on(table.inviteToken),
}))

// Users (Customers) - Scoped to Store
export const users = pgTable('User', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id),
  email: text('email'), // Not unique globally, unique per store
  phone: text('phone'),
  name: text('name'),
  birthday: text('birthday'),
  OTP: text('OTP'),
  emailUnsubscribeToken: text('emailUnsubscribeToken').unique().$defaultFn(() => crypto.randomUUID()),
  referralCode: text('referralCode'),
  isBanned: boolean('isBanned').notNull().default(false),
  isEmailVerified: boolean('isEmailVerified').notNull().default(false),
  isPhoneVerified: boolean('isPhoneVerified').notNull().default(false),
  isEmailSubscribed: boolean('isEmailSubscribed').notNull().default(false),
  isPhoneSubscribed: boolean('isPhoneSubscribed').notNull().default(false),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  storeIdIdx: index('User_storeId_idx').on(table.storeId),
  storeEmailIdx: uniqueIndex('User_storeId_email_idx').on(table.storeId, table.email),
  storePhoneIdx: uniqueIndex('User_storeId_phone_idx').on(table.storeId, table.phone),
}))

export const carts = pgTable('Cart', {
  userId: text('userId').primaryKey().references(() => users.id),
  storeId: text('storeId').notNull().references(() => stores.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  storeIdIdx: index('Cart_storeId_idx').on(table.storeId),
}))

export const brands = pgTable('Brand', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id),
  title: text('title').notNull(),
  description: text('description'),
  logo: text('logo'),
}, (table) => ({
  storeIdIdx: index('Brand_storeId_idx').on(table.storeId),
  storeTitleIdx: uniqueIndex('Brand_storeId_title_idx').on(table.storeId, table.title),
}))

export const products = pgTable('Product', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id),
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
  storeIdIdx: index('Product_storeId_idx').on(table.storeId),
  brandIdIdx: index('Product_brandId_idx').on(table.brandId),
}))

export const categories = pgTable('Category', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  storeIdIdx: index('Category_storeId_idx').on(table.storeId),
  storeTitleIdx: uniqueIndex('Category_storeId_title_idx').on(table.storeId, table.title),
}))

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
  storeId: text('storeId').notNull().references(() => stores.id),
}, (table) => ({
  pk: uniqueIndex('_Wishlist_AB_unique').on(table.userId, table.productId),
  productIdIdx: index('_Wishlist_B_index').on(table.productId),
  storeIdIdx: index('_Wishlist_storeId_idx').on(table.storeId),
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
  storeId: text('storeId').notNull().references(() => stores.id),
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
  storeIdIdx: index('ProductReview_storeId_idx').on(table.storeId),
}))

export const addresses = pgTable('Address', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id),
  country: text('country').notNull().default('IRI'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  phone: text('phone').notNull(),
  postalCode: text('postalCode').notNull(),
  userId: text('userId').notNull().references(() => users.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('Address_userId_idx').on(table.userId),
  storeIdIdx: index('Address_storeId_idx').on(table.storeId),
}))

export const discountCodes = pgTable('DiscountCode', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id),
  code: text('code').notNull(),
  stock: integer('stock').notNull().default(1),
  description: text('description'),
  percent: integer('percent').notNull(),
  maxDiscountAmount: doublePrecision('maxDiscountAmount').notNull().default(1),
  startDate: timestamp('startDate', { mode: 'date' }).notNull(),
  endDate: timestamp('endDate', { mode: 'date' }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
}, (table) => ({
  storeIdIdx: index('DiscountCode_storeId_idx').on(table.storeId),
  storeCodeIdx: uniqueIndex('DiscountCode_storeId_code_idx').on(table.storeId, table.code),
}))

export const orders = pgTable('Order', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id),
  number: serial('number').notNull(), // Global serial, could be per store but simpler global
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
  storeIdIdx: index('Order_storeId_idx').on(table.storeId),
  storeNumberIdx: uniqueIndex('Order_storeId_number_idx').on(table.storeId, table.number),
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
  storeId: text('storeId').notNull().references(() => stores.id),
  amount: doublePrecision('amount').notNull(),
  reason: text('reason').notNull(),
  orderId: text('orderId').notNull().unique().references(() => orders.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  orderIdIdx: index('Refund_orderId_idx').on(table.orderId),
  storeIdIdx: index('Refund_storeId_idx').on(table.storeId),
}))

export const paymentProviders = pgTable('PaymentProvider', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id),
  title: text('title').notNull(),
  description: text('description'),
  websiteUrl: text('websiteUrl'),
  isActive: boolean('isActive').notNull().default(false),
}, (table) => ({
  storeIdIdx: index('PaymentProvider_storeId_idx').on(table.storeId),
  storeTitleIdx: uniqueIndex('PaymentProvider_storeId_title_idx').on(table.storeId, table.title),
}))

export const payments = pgTable('Payment', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id),
  number: serial('number').notNull(),
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
  storeIdIdx: index('Payment_storeId_idx').on(table.storeId),
  storeNumberIdx: uniqueIndex('Payment_storeId_number_idx').on(table.storeId, table.number),
}))

export const notifications = pgTable('Notification', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id),
  content: text('content').notNull(),
  isRead: boolean('isRead').notNull().default(false),
  userId: text('userId').notNull().references(() => users.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  userIdIdx: index('Notification_userId_idx').on(table.userId),
  storeIdIdx: index('Notification_storeId_idx').on(table.storeId),
}))

export const merchantNotifications = pgTable('MerchantNotification', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id),
  content: text('content').notNull(),
  isRead: boolean('isRead').notNull().default(false),
  merchantId: text('merchantId').notNull().references(() => merchants.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  merchantIdIdx: index('MerchantNotification_merchantId_idx').on(table.merchantId),
  storeIdIdx: index('MerchantNotification_storeId_idx').on(table.storeId),
}))

// Authors - Scoped to Store? Or Global?
// Assuming Authors are store-specific content creators
export const authors = pgTable('Author', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id),
  email: text('email').notNull(),
  phone: text('phone'),
  name: text('name'),
  avatar: text('avatar'),
  OTP: text('OTP'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  storeIdIdx: index('Author_storeId_idx').on(table.storeId),
  storeEmailIdx: uniqueIndex('Author_storeId_email_idx').on(table.storeId, table.email),
}))

export const blogs = pgTable('Blog', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text('slug').notNull(),
  storeId: text('storeId').notNull().references(() => stores.id),
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
  storeIdIdx: index('Blog_storeId_idx').on(table.storeId),
  storeSlugIdx: uniqueIndex('Blog_storeId_slug_idx').on(table.storeId, table.slug),
}))

export const banners = pgTable('Banner', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id),
  label: text('label').notNull(),
  image: text('image').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  storeIdIdx: index('Banner_storeId_idx').on(table.storeId),
}))

export const bannerCategories = pgTable('_BannerToCategory', {
  bannerId: text('A').notNull().references(() => banners.id),
  categoryId: text('B').notNull().references(() => categories.id),
}, (table) => ({
  pk: uniqueIndex('_BannerToCategory_AB_unique').on(table.bannerId, table.categoryId),
  categoryIdIdx: index('_BannerToCategory_B_index').on(table.categoryId),
}))

export const errors = pgTable('Error', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').references(() => stores.id),
  error: text('error').notNull(),
  userId: text('userId').references(() => users.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('Error_userId_idx').on(table.userId),
  storeIdIdx: index('Error_storeId_idx').on(table.storeId),
}))

export const files = pgTable('File', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  storeId: text('storeId').notNull().references(() => stores.id),
  url: text('url').notNull(),
  userId: text('userId').notNull().references(() => users.id),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('File_userId_idx').on(table.userId),
  storeIdIdx: index('File_storeId_idx').on(table.storeId),
}))

// Relations
export const merchantsRelations = relations(merchants, ({ many, one }) => ({
  stores: many(stores),
  subscription: one(subscriptions, {
    fields: [merchants.id],
    references: [subscriptions.merchantId],
  }),
}))

export const storesRelations = relations(stores, ({ one, many }) => ({
  merchant: one(merchants, {
    fields: [stores.merchantId],
    references: [merchants.id],
  }),
  users: many(users),
  products: many(products),
  orders: many(orders),
  teamMembers: many(teamMembers),
  // Add other relations as needed
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  store: one(stores, {
    fields: [users.storeId],
    references: [stores.id],
  }),
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
  store: one(stores, {
    fields: [carts.storeId],
    references: [stores.id],
  }),
  items: many(cartItems),
}))

export const brandsRelations = relations(brands, ({ one, many }) => ({
  store: one(stores, {
    fields: [brands.storeId],
    references: [stores.id],
  }),
  products: many(products),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
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

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  store: one(stores, {
    fields: [categories.storeId],
    references: [stores.id],
  }),
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
  store: one(stores, {
    fields: [wishlist.storeId],
    references: [stores.id],
  }),
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
  store: one(stores, {
    fields: [productReviews.storeId],
    references: [stores.id],
  }),
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
  store: one(stores, {
    fields: [addresses.storeId],
    references: [stores.id],
  }),
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
  orders: many(orders),
}))

export const discountCodesRelations = relations(discountCodes, ({ one, many }) => ({
  store: one(stores, {
    fields: [discountCodes.storeId],
    references: [stores.id],
  }),
  orders: many(orders),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
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
  store: one(stores, {
    fields: [refunds.storeId],
    references: [stores.id],
  }),
  order: one(orders, {
    fields: [refunds.orderId],
    references: [orders.id],
  }),
}))

export const paymentProvidersRelations = relations(paymentProviders, ({ one, many }) => ({
  store: one(stores, {
    fields: [paymentProviders.storeId],
    references: [stores.id],
  }),
  payments: many(payments),
}))

export const paymentsRelations = relations(payments, ({ one }) => ({
  store: one(stores, {
    fields: [payments.storeId],
    references: [stores.id],
  }),
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
  store: one(stores, {
    fields: [notifications.storeId],
    references: [stores.id],
  }),
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}))

export const merchantNotificationsRelations = relations(merchantNotifications, ({ one }) => ({
  store: one(stores, {
    fields: [merchantNotifications.storeId],
    references: [stores.id],
  }),
  merchant: one(merchants, {
    fields: [merchantNotifications.merchantId],
    references: [merchants.id],
  }),
}))

export const authorsRelations = relations(authors, ({ one, many }) => ({
  store: one(stores, {
    fields: [authors.storeId],
    references: [stores.id],
  }),
  blogs: many(blogs),
}))

export const blogsRelations = relations(blogs, ({ one }) => ({
  store: one(stores, {
    fields: [blogs.storeId],
    references: [stores.id],
  }),
  author: one(authors, {
    fields: [blogs.authorId],
    references: [authors.id],
  }),
}))

export const bannersRelations = relations(banners, ({ one, many }) => ({
  store: one(stores, {
    fields: [banners.storeId],
    references: [stores.id],
  }),
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
  store: one(stores, {
    fields: [errors.storeId],
    references: [stores.id],
  }),
  user: one(users, {
    fields: [errors.userId],
    references: [users.id],
  }),
}))

export const filesRelations = relations(files, ({ one }) => ({
  store: one(stores, {
    fields: [files.storeId],
    references: [stores.id],
  }),
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
}))

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  merchant: one(merchants, {
    fields: [subscriptions.merchantId],
    references: [merchants.id],
  }),
}))

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  store: one(stores, {
    fields: [teamMembers.storeId],
    references: [stores.id],
  }),
  merchant: one(merchants, {
    fields: [teamMembers.merchantId],
    references: [merchants.id],
  }),
  inviter: one(merchants, {
    fields: [teamMembers.invitedBy],
    references: [merchants.id],
  }),
}))
