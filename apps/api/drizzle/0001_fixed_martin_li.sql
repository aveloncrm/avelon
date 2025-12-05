CREATE TABLE "MerchantNotification" (
	"id" text PRIMARY KEY NOT NULL,
	"storeId" text NOT NULL,
	"content" text NOT NULL,
	"isRead" boolean DEFAULT false NOT NULL,
	"merchantId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Store" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subdomain" text NOT NULL,
	"customDomain" text,
	"merchantId" text NOT NULL,
	"settings" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Store_subdomain_unique" UNIQUE("subdomain"),
	CONSTRAINT "Store_customDomain_unique" UNIQUE("customDomain")
);
--> statement-breakpoint
ALTER TABLE "Owner" RENAME TO "Merchant";--> statement-breakpoint
ALTER TABLE "Author" DROP CONSTRAINT "Author_email_unique";--> statement-breakpoint
ALTER TABLE "Author" DROP CONSTRAINT "Author_phone_unique";--> statement-breakpoint
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_title_unique";--> statement-breakpoint
ALTER TABLE "Category" DROP CONSTRAINT "Category_title_unique";--> statement-breakpoint
ALTER TABLE "DiscountCode" DROP CONSTRAINT "DiscountCode_code_unique";--> statement-breakpoint
ALTER TABLE "Order" DROP CONSTRAINT "Order_number_unique";--> statement-breakpoint
ALTER TABLE "Merchant" DROP CONSTRAINT "Owner_email_unique";--> statement-breakpoint
ALTER TABLE "Merchant" DROP CONSTRAINT "Owner_phone_unique";--> statement-breakpoint
ALTER TABLE "PaymentProvider" DROP CONSTRAINT "PaymentProvider_title_unique";--> statement-breakpoint
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_number_unique";--> statement-breakpoint
ALTER TABLE "User" DROP CONSTRAINT "User_email_unique";--> statement-breakpoint
ALTER TABLE "User" DROP CONSTRAINT "User_phone_unique";--> statement-breakpoint
ALTER TABLE "User" DROP CONSTRAINT "User_referralCode_unique";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'Blog'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "Blog" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
-- Step 1: Add storeId columns as nullable first
ALTER TABLE "Address" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "Author" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "Banner" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "Blog" ADD COLUMN "id" text PRIMARY KEY NOT NULL;-->statement-breakpoint
ALTER TABLE "Blog" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "Brand" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "Cart" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "Category" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "DiscountCode" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "Error" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "File" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "Notification" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "Order" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "PaymentProvider" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "Payment" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "ProductReview" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "Product" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "Refund" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "User" ADD COLUMN "storeId" text;-->statement-breakpoint
ALTER TABLE "_Wishlist" ADD COLUMN "storeId" text;-->statement-breakpoint
-- Step 1.5: Ensure default merchant and store exist
INSERT INTO "Merchant" (id, email, name, "createdAt", "updatedAt") 
VALUES ('default-merchant-001', 'admin@avelon.com', 'Default Merchant', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;-->statement-breakpoint
INSERT INTO "Store" (id, name, subdomain, "merchantId", "createdAt", "updatedAt") 
VALUES ('default-store-001', 'Default Store', 'default', 'default-merchant-001', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;-->statement-breakpoint
-- Step 2: Update existing rows with default storeId value
UPDATE "Address" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "Author" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "Banner" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "Blog" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "Brand" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "Cart" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "Category" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "DiscountCode" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "File" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "Notification" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "Order" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "PaymentProvider" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "Payment" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "ProductReview" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "Product" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "Refund" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "User" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
UPDATE "_Wishlist" SET "storeId" = 'default-store-001' WHERE "storeId" IS NULL;-->statement-breakpoint
-- Step 3: Make storeId columns NOT NULL where required
ALTER TABLE "Address" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "Author" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "Banner" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "Blog" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "Brand" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "Cart" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "Category" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "DiscountCode" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "File" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "Notification" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "Order" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "PaymentProvider" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "Payment" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "ProductReview" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "Product" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "Refund" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "_Wishlist" ALTER COLUMN "storeId" SET NOT NULL;-->statement-breakpoint
ALTER TABLE "MerchantNotification" ADD CONSTRAINT "MerchantNotification_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "MerchantNotification" ADD CONSTRAINT "MerchantNotification_merchantId_Merchant_id_fk" FOREIGN KEY ("merchantId") REFERENCES "public"."Merchant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Store" ADD CONSTRAINT "Store_merchantId_Merchant_id_fk" FOREIGN KEY ("merchantId") REFERENCES "public"."Merchant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "MerchantNotification_merchantId_idx" ON "MerchantNotification" USING btree ("merchantId");--> statement-breakpoint
CREATE INDEX "MerchantNotification_storeId_idx" ON "MerchantNotification" USING btree ("storeId");--> statement-breakpoint
CREATE INDEX "Store_merchantId_idx" ON "Store" USING btree ("merchantId");--> statement-breakpoint
CREATE INDEX "Store_subdomain_idx" ON "Store" USING btree ("subdomain");--> statement-breakpoint
ALTER TABLE "Address" ADD CONSTRAINT "Address_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Author" ADD CONSTRAINT "Author_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Category" ADD CONSTRAINT "Category_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DiscountCode" ADD CONSTRAINT "DiscountCode_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Error" ADD CONSTRAINT "Error_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "File" ADD CONSTRAINT "File_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PaymentProvider" ADD CONSTRAINT "PaymentProvider_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Product" ADD CONSTRAINT "Product_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_Wishlist" ADD CONSTRAINT "_Wishlist_storeId_Store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "Address_storeId_idx" ON "Address" USING btree ("storeId");--> statement-breakpoint
CREATE INDEX "Author_storeId_idx" ON "Author" USING btree ("storeId");--> statement-breakpoint
CREATE UNIQUE INDEX "Author_storeId_email_idx" ON "Author" USING btree ("storeId","email");--> statement-breakpoint
CREATE INDEX "Banner_storeId_idx" ON "Banner" USING btree ("storeId");--> statement-breakpoint
CREATE INDEX "Blog_storeId_idx" ON "Blog" USING btree ("storeId");--> statement-breakpoint
CREATE UNIQUE INDEX "Blog_storeId_slug_idx" ON "Blog" USING btree ("storeId","slug");--> statement-breakpoint
CREATE INDEX "Brand_storeId_idx" ON "Brand" USING btree ("storeId");--> statement-breakpoint
CREATE UNIQUE INDEX "Brand_storeId_title_idx" ON "Brand" USING btree ("storeId","title");--> statement-breakpoint
CREATE INDEX "Cart_storeId_idx" ON "Cart" USING btree ("storeId");--> statement-breakpoint
CREATE INDEX "Category_storeId_idx" ON "Category" USING btree ("storeId");--> statement-breakpoint
CREATE UNIQUE INDEX "Category_storeId_title_idx" ON "Category" USING btree ("storeId","title");--> statement-breakpoint
CREATE INDEX "DiscountCode_storeId_idx" ON "DiscountCode" USING btree ("storeId");--> statement-breakpoint
CREATE UNIQUE INDEX "DiscountCode_storeId_code_idx" ON "DiscountCode" USING btree ("storeId","code");--> statement-breakpoint
CREATE INDEX "Error_storeId_idx" ON "Error" USING btree ("storeId");--> statement-breakpoint
CREATE INDEX "File_storeId_idx" ON "File" USING btree ("storeId");--> statement-breakpoint
CREATE INDEX "Notification_storeId_idx" ON "Notification" USING btree ("storeId");--> statement-breakpoint
CREATE INDEX "Order_storeId_idx" ON "Order" USING btree ("storeId");--> statement-breakpoint
CREATE UNIQUE INDEX "Order_storeId_number_idx" ON "Order" USING btree ("storeId","number");--> statement-breakpoint
CREATE INDEX "PaymentProvider_storeId_idx" ON "PaymentProvider" USING btree ("storeId");--> statement-breakpoint
CREATE UNIQUE INDEX "PaymentProvider_storeId_title_idx" ON "PaymentProvider" USING btree ("storeId","title");--> statement-breakpoint
CREATE INDEX "Payment_storeId_idx" ON "Payment" USING btree ("storeId");--> statement-breakpoint
CREATE UNIQUE INDEX "Payment_storeId_number_idx" ON "Payment" USING btree ("storeId","number");--> statement-breakpoint
CREATE INDEX "ProductReview_storeId_idx" ON "ProductReview" USING btree ("storeId");--> statement-breakpoint
CREATE INDEX "Product_storeId_idx" ON "Product" USING btree ("storeId");--> statement-breakpoint
CREATE INDEX "Refund_storeId_idx" ON "Refund" USING btree ("storeId");--> statement-breakpoint
CREATE INDEX "User_storeId_idx" ON "User" USING btree ("storeId");--> statement-breakpoint
CREATE UNIQUE INDEX "User_storeId_email_idx" ON "User" USING btree ("storeId","email");--> statement-breakpoint
CREATE UNIQUE INDEX "User_storeId_phone_idx" ON "User" USING btree ("storeId","phone");--> statement-breakpoint
CREATE INDEX "_Wishlist_storeId_idx" ON "_Wishlist" USING btree ("storeId");--> statement-breakpoint
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_phone_unique" UNIQUE("phone");