-- Create Essential Multi-Tenant Tables
-- This creates the minimum tables needed for merchant onboarding

BEGIN;

-- 1. Merchant table (if not exists)
CREATE TABLE IF NOT EXISTS "Merchant" (
  "id" text PRIMARY KEY,
  "email" text NOT NULL UNIQUE,
  "phone" text UNIQUE,
  "name" text,
  "avatar" text,
  "OTP" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- 2. Store table already exists, verify structure
-- CREATE TABLE IF NOT EXISTS "Store" ...

-- 3. User table (customers)
CREATE TABLE IF NOT EXISTS "User" (
  "id" text PRIMARY KEY,
  "storeId" text NOT NULL REFERENCES "Store"("id"),
  "email" text,
  "phone" text,
  "name" text,
  "birthday" text,
  "OTP" text,
  "emailUnsubscribeToken" text,
  "referralCode" text,
  "isBanned" boolean DEFAULT false NOT NULL,
  "isEmailVerified" boolean DEFAULT false NOT NULL,
  "isPhoneVerified" boolean DEFAULT false NOT NULL,
  "isEmailSubscribed" boolean DEFAULT false NOT NULL,
  "isPhoneSubscribed" boolean DEFAULT false NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "User_storeId_idx" ON "User"("storeId");
CREATE UNIQUE INDEX IF NOT EXISTS "User_storeId_email_idx" ON "User"("storeId", "email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_storeId_phone_idx" ON "User"("storeId", "phone");

-- 4. Product table
CREATE TABLE IF NOT EXISTS "Product" (
  "id" text PRIMARY KEY,
  "storeId" text NOT NULL REFERENCES "Store"("id"),
  "title" text NOT NULL,
  "description" text,
  "images" text[] DEFAULT '{}' NOT NULL,
  "keywords" text[] DEFAULT '{}' NOT NULL,
  "metadata" json,
  "price" double precision DEFAULT 100 NOT NULL,
  "discount" double precision DEFAULT 0 NOT NULL,
  "stock" integer DEFAULT 0 NOT NULL,
  "isPhysical" boolean DEFAULT true NOT NULL,
  "isAvailable" boolean DEFAULT false NOT NULL,
  "isFeatured" boolean DEFAULT false NOT NULL,
  "brandId" text NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "Product_storeId_idx" ON "Product"("storeId");
CREATE INDEX IF NOT EXISTS "Product_brandId_idx" ON "Product"("brandId");

-- 5. Category table
CREATE TABLE IF NOT EXISTS "Category" (
  "id" text PRIMARY KEY,
  "storeId" text NOT NULL REFERENCES "Store"("id"),
  "title" text NOT NULL,
  "description" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "Category_storeId_idx" ON "Category"("storeId");
CREATE UNIQUE INDEX IF NOT EXISTS "Category_storeId_title_idx" ON "Category"("storeId", "title");

-- 6. Brand table
CREATE TABLE IF NOT EXISTS "Brand" (
  "id" text PRIMARY KEY,
  "storeId" text NOT NULL REFERENCES "Store"("id"),
  "title" text NOT NULL,
  "description" text,
  "logo" text
);

CREATE INDEX IF NOT EXISTS "Brand_storeId_idx" ON "Brand"("storeId");
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_storeId_title_idx" ON "Brand"("storeId", "title");

-- 7. Order table
CREATE TYPE "OrderStatusEnum" AS ENUM('Processing', 'Shipped', 'Delivered', 'ReturnProcessing', 'ReturnCompleted', 'Cancelled', 'RefundProcessing', 'RefundCompleted', 'Denied');

CREATE TABLE IF NOT EXISTS "Order" (
  "id" text PRIMARY KEY,
  "storeId" text NOT NULL REFERENCES "Store"("id"),
  "number" serial NOT NULL UNIQUE,
  "status" "OrderStatusEnum" NOT NULL,
  "total" double precision DEFAULT 100 NOT NULL,
  "shipping" double precision DEFAULT 100 NOT NULL,
  "payable" double precision DEFAULT 100 NOT NULL,
  "tax" double precision DEFAULT 100 NOT NULL,
  "discount" double precision DEFAULT 0 NOT NULL,
  "isPaid" boolean DEFAULT false NOT NULL,
  "isCompleted" boolean DEFAULT false NOT NULL,
  "discountCodeId" text,
  "addressId" text,
  "userId" text NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "Order_storeId_idx" ON "Order"("storeId");
CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "Order_storeId_number_idx" ON "Order"("storeId", "number");

COMMIT;

SELECT 'Tables created successfully!' as status;
