-- Seed Default Merchant and Store
-- Run this to create initial data for merchant onboarding

BEGIN;

-- 1. Create default merchant (if not exists)
INSERT INTO "Merchant" (id, email, name, "createdAt", "updatedAt") 
VALUES (
  'default-merchant-001',
  'admin@avelon.com',
  'Default Merchant',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 2. Create default store (if not exists)
INSERT INTO "Store" (id, name, subdomain, "merchantId", "createdAt", "updatedAt") 
VALUES (
  'default-store-001',
  'Default Store',
  'default',
  'default-merchant-001',
  NOW(),
  NOW()
)
ON CONFLICT (subdomain) DO NOTHING;

-- 3. Update existing data to use default store (if any exists)
-- This ensures backward compatibility with existing data

UPDATE "Product" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;
UPDATE "Category" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;
UPDATE "Brand" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;
UPDATE "Banner" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;
UPDATE "DiscountCode" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;
UPDATE "User" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;
UPDATE "Cart" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;
UPDATE "Order" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;
UPDATE "Address" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;

COMMIT;

-- Verify
SELECT 'Merchant created:' as status, id, email, name FROM "Merchant";
SELECT 'Store created:' as status, id, name, subdomain FROM "Store";
