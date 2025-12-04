-- Manual Migration Script for SaaS Multi-Tenancy
-- Run this with: psql -d your_database_name -f migration.sql

BEGIN;

-- 1. Rename Owner table to Merchant
ALTER TABLE "Owner" RENAME TO "Merchant";

-- 2. Create Store table
CREATE TABLE IF NOT EXISTS "Store" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" text NOT NULL,
  "subdomain" text NOT NULL UNIQUE,
  "customDomain" text UNIQUE,
  "merchantId" text NOT NULL REFERENCES "Merchant"("id"),
  "settings" json,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "Store_merchantId_idx" ON "Store"("merchantId");
CREATE INDEX IF NOT EXISTS "Store_subdomain_idx" ON "Store"("subdomain");

-- 3. Create a default store for existing data
INSERT INTO "Store" ("id", "name", "subdomain", "merchantId")
SELECT 
  gen_random_uuid()::text,
  'Default Store',
  'default',
  "id"
FROM "Merchant"
LIMIT 1
ON CONFLICT DO NOTHING;

-- 4. Add storeId to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "storeId" text;

-- Set storeId for existing users
UPDATE "User" 
SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1)
WHERE "storeId" IS NULL;

-- Make storeId NOT NULL after setting values
ALTER TABLE "User" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "User" ADD CONSTRAINT "User_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");

-- Drop old unique constraints on email/phone
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_email_unique";
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_phone_unique";

-- Add composite unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "User_storeId_email_idx" ON "User"("storeId", "email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_storeId_phone_idx" ON "User"("storeId", "phone");
CREATE INDEX IF NOT EXISTS "User_storeId_idx" ON "User"("storeId");

-- 5. Add storeId to Cart table
ALTER TABLE "Cart" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "Cart" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "Cart" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
CREATE INDEX IF NOT EXISTS "Cart_storeId_idx" ON "Cart"("storeId");

-- 6. Add storeId to Brand table
ALTER TABLE "Brand" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "Brand" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "Brand" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
ALTER TABLE "Brand" DROP CONSTRAINT IF EXISTS "Brand_title_unique";
CREATE INDEX IF NOT EXISTS "Brand_storeId_idx" ON "Brand"("storeId");
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_storeId_title_idx" ON "Brand"("storeId", "title");

-- 7. Add storeId to Product table
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "Product" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "Product" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "Product" ADD CONSTRAINT "Product_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
CREATE INDEX IF NOT EXISTS "Product_storeId_idx" ON "Product"("storeId");

-- 8. Add storeId to Category table
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "Category" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "Category" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "Category" ADD CONSTRAINT "Category_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS "Category_title_unique";
CREATE INDEX IF NOT EXISTS "Category_storeId_idx" ON "Category"("storeId");
CREATE UNIQUE INDEX IF NOT EXISTS "Category_storeId_title_idx" ON "Category"("storeId", "title");

-- 9. Add storeId to Order table
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "Order" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "Order" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "Order" ADD CONSTRAINT "Order_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
CREATE INDEX IF NOT EXISTS "Order_storeId_idx" ON "Order"("storeId");
CREATE UNIQUE INDEX IF NOT EXISTS "Order_storeId_number_idx" ON "Order"("storeId", "number");

-- 10. Add storeId to Address table
ALTER TABLE "Address" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "Address" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "Address" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "Address" ADD CONSTRAINT "Address_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
CREATE INDEX IF NOT EXISTS "Address_storeId_idx" ON "Address"("storeId");

-- 11. Add storeId to DiscountCode table
ALTER TABLE "DiscountCode" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "DiscountCode" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "DiscountCode" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "DiscountCode" ADD CONSTRAINT "DiscountCode_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
ALTER TABLE "DiscountCode" DROP CONSTRAINT IF EXISTS "DiscountCode_code_unique";
CREATE INDEX IF NOT EXISTS "DiscountCode_storeId_idx" ON "DiscountCode"("storeId");
CREATE UNIQUE INDEX IF NOT EXISTS "DiscountCode_storeId_code_idx" ON "DiscountCode"("storeId", "code");

-- 12. Add storeId to Notification table
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "Notification" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "Notification" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
CREATE INDEX IF NOT EXISTS "Notification_storeId_idx" ON "Notification"("storeId");

-- 13. Create MerchantNotification table
CREATE TABLE IF NOT EXISTS "MerchantNotification" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "storeId" text NOT NULL REFERENCES "Store"("id"),
  "content" text NOT NULL,
  "isRead" boolean DEFAULT false NOT NULL,
  "merchantId" text NOT NULL REFERENCES "Merchant"("id"),
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "MerchantNotification_merchantId_idx" ON "MerchantNotification"("merchantId");
CREATE INDEX IF NOT EXISTS "MerchantNotification_storeId_idx" ON "MerchantNotification"("storeId");

-- 14. Add storeId to Author table
ALTER TABLE "Author" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "Author" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "Author" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "Author" ADD CONSTRAINT "Author_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
ALTER TABLE "Author" DROP CONSTRAINT IF EXISTS "Author_email_unique";
CREATE INDEX IF NOT EXISTS "Author_storeId_idx" ON "Author"("storeId");
CREATE UNIQUE INDEX IF NOT EXISTS "Author_storeId_email_idx" ON "Author"("storeId", "email");

-- 15. Fix Blog table (change PK from slug to id)
ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "id" text DEFAULT gen_random_uuid()::text;
ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "Blog" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "Blog" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "Blog" DROP CONSTRAINT IF EXISTS "Blog_pkey";
ALTER TABLE "Blog" ADD PRIMARY KEY ("id");
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
CREATE INDEX IF NOT EXISTS "Blog_storeId_idx" ON "Blog"("storeId");
CREATE UNIQUE INDEX IF NOT EXISTS "Blog_storeId_slug_idx" ON "Blog"("storeId", "slug");

-- 16. Add storeId to Banner table
ALTER TABLE "Banner" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "Banner" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "Banner" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
CREATE INDEX IF NOT EXISTS "Banner_storeId_idx" ON "Banner"("storeId");

-- 17. Add storeId to _Wishlist table
ALTER TABLE "_Wishlist" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "_Wishlist" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "_Wishlist" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "_Wishlist" ADD CONSTRAINT "_Wishlist_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
CREATE INDEX IF NOT EXISTS "_Wishlist_storeId_idx" ON "_Wishlist"("storeId");

-- 18. Add storeId to ProductReview table
ALTER TABLE "ProductReview" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "ProductReview" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "ProductReview" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
CREATE INDEX IF NOT EXISTS "ProductReview_storeId_idx" ON "ProductReview"("storeId");

-- 19. Add storeId to Payment table
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "Payment" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "Payment" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
CREATE INDEX IF NOT EXISTS "Payment_storeId_idx" ON "Payment"("storeId");
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_storeId_number_idx" ON "Payment"("storeId", "number");

-- 20. Add storeId to PaymentProvider table
ALTER TABLE "PaymentProvider" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "PaymentProvider" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "PaymentProvider" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "PaymentProvider" ADD CONSTRAINT "PaymentProvider_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
ALTER TABLE "PaymentProvider" DROP CONSTRAINT IF EXISTS "PaymentProvider_title_unique";
CREATE INDEX IF NOT EXISTS "PaymentProvider_storeId_idx" ON "PaymentProvider"("storeId");
CREATE UNIQUE INDEX IF NOT EXISTS "PaymentProvider_storeId_title_idx" ON "PaymentProvider"("storeId", "title");

-- 21. Add storeId to Refund table
ALTER TABLE "Refund" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "Refund" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "Refund" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
CREATE INDEX IF NOT EXISTS "Refund_storeId_idx" ON "Refund"("storeId");

-- 22. Add storeId to File table
ALTER TABLE "File" ADD COLUMN IF NOT EXISTS "storeId" text;
UPDATE "File" SET "storeId" = (SELECT "id" FROM "Store" WHERE "subdomain" = 'default' LIMIT 1) WHERE "storeId" IS NULL;
ALTER TABLE "File" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "File" ADD CONSTRAINT "File_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
CREATE INDEX IF NOT EXISTS "File_storeId_idx" ON "File"("storeId");

-- 23. Add storeId to Error table (nullable)
ALTER TABLE "Error" ADD COLUMN IF NOT EXISTS "storeId" text;
ALTER TABLE "Error" ADD CONSTRAINT "Error_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "Store"("id");
CREATE INDEX IF NOT EXISTS "Error_storeId_idx" ON "Error"("storeId");

COMMIT;

-- Verify migration
SELECT 'Migration completed successfully!' as status;
SELECT COUNT(*) as merchant_count FROM "Merchant";
SELECT COUNT(*) as store_count FROM "Store";
