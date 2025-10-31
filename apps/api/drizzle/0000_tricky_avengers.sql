CREATE TYPE "public"."OrderStatusEnum" AS ENUM('Processing', 'Shipped', 'Delivered', 'ReturnProcessing', 'ReturnCompleted', 'Cancelled', 'RefundProcessing', 'RefundCompleted', 'Denied');--> statement-breakpoint
CREATE TYPE "public"."PaymentStatusEnum" AS ENUM('Processing', 'Paid', 'Failed', 'Denied');--> statement-breakpoint
CREATE TABLE "Address" (
	"id" text PRIMARY KEY NOT NULL,
	"country" text DEFAULT 'IRI' NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"phone" text NOT NULL,
	"postalCode" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Author" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"name" text,
	"avatar" text,
	"OTP" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Author_email_unique" UNIQUE("email"),
	CONSTRAINT "Author_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "_BannerToCategory" (
	"A" text NOT NULL,
	"B" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Banner" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"image" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Blog" (
	"slug" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"image" text NOT NULL,
	"description" text NOT NULL,
	"content" text,
	"categories" text[] DEFAULT '{}' NOT NULL,
	"keywords" text[] DEFAULT '{}' NOT NULL,
	"authorId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Brand" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"logo" text,
	CONSTRAINT "Brand_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "CartItem" (
	"cartId" text NOT NULL,
	"productId" text NOT NULL,
	"count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Cart" (
	"userId" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Category" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Category_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "DiscountCode" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"stock" integer DEFAULT 1 NOT NULL,
	"description" text,
	"percent" integer NOT NULL,
	"maxDiscountAmount" double precision DEFAULT 1 NOT NULL,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "DiscountCode_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "Error" (
	"id" text PRIMARY KEY NOT NULL,
	"error" text NOT NULL,
	"userId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "File" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Notification" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"isRead" boolean DEFAULT false NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "OrderItem" (
	"orderId" text NOT NULL,
	"productId" text NOT NULL,
	"count" integer NOT NULL,
	"price" double precision NOT NULL,
	"discount" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Order" (
	"id" text PRIMARY KEY NOT NULL,
	"number" serial NOT NULL,
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
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Order_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "Owner" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"name" text,
	"avatar" text,
	"OTP" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Owner_email_unique" UNIQUE("email"),
	CONSTRAINT "Owner_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "PaymentProvider" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"websiteUrl" text,
	"isActive" boolean DEFAULT false NOT NULL,
	CONSTRAINT "PaymentProvider_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "Payment" (
	"id" text PRIMARY KEY NOT NULL,
	"number" serial NOT NULL,
	"status" "PaymentStatusEnum" NOT NULL,
	"refId" text NOT NULL,
	"cardPan" text,
	"cardHash" text,
	"fee" double precision,
	"isSuccessful" boolean DEFAULT false NOT NULL,
	"payable" double precision NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"orderId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Payment_number_unique" UNIQUE("number"),
	CONSTRAINT "Payment_refId_unique" UNIQUE("refId")
);
--> statement-breakpoint
CREATE TABLE "_CategoryToProduct" (
	"A" text NOT NULL,
	"B" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ProductReview" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"rating" integer NOT NULL,
	"productId" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Product" (
	"id" text PRIMARY KEY NOT NULL,
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
--> statement-breakpoint
CREATE TABLE "Refund" (
	"id" text PRIMARY KEY NOT NULL,
	"amount" double precision NOT NULL,
	"reason" text NOT NULL,
	"orderId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Refund_orderId_unique" UNIQUE("orderId")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
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
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_phone_unique" UNIQUE("phone"),
	CONSTRAINT "User_emailUnsubscribeToken_unique" UNIQUE("emailUnsubscribeToken"),
	CONSTRAINT "User_referralCode_unique" UNIQUE("referralCode")
);
--> statement-breakpoint
CREATE TABLE "_Wishlist" (
	"A" text NOT NULL,
	"B" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_BannerToCategory" ADD CONSTRAINT "_BannerToCategory_A_Banner_id_fk" FOREIGN KEY ("A") REFERENCES "public"."Banner"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_BannerToCategory" ADD CONSTRAINT "_BannerToCategory_B_Category_id_fk" FOREIGN KEY ("B") REFERENCES "public"."Category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_authorId_Author_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."Author"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_Cart_userId_fk" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_Product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Error" ADD CONSTRAINT "Error_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "File" ADD CONSTRAINT "File_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_Order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_Product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_discountCodeId_DiscountCode_id_fk" FOREIGN KEY ("discountCodeId") REFERENCES "public"."DiscountCode"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_Address_id_fk" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_providerId_PaymentProvider_id_fk" FOREIGN KEY ("providerId") REFERENCES "public"."PaymentProvider"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_Order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_A_Product_id_fk" FOREIGN KEY ("A") REFERENCES "public"."Product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_B_Category_id_fk" FOREIGN KEY ("B") REFERENCES "public"."Category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_productId_Product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_Brand_id_fk" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_orderId_Order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_Wishlist" ADD CONSTRAINT "_Wishlist_A_User_id_fk" FOREIGN KEY ("A") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_Wishlist" ADD CONSTRAINT "_Wishlist_B_Product_id_fk" FOREIGN KEY ("B") REFERENCES "public"."Product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "Address_userId_idx" ON "Address" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "_BannerToCategory_AB_unique" ON "_BannerToCategory" USING btree ("A","B");--> statement-breakpoint
CREATE INDEX "_BannerToCategory_B_index" ON "_BannerToCategory" USING btree ("B");--> statement-breakpoint
CREATE INDEX "Blog_authorId_idx" ON "Blog" USING btree ("authorId");--> statement-breakpoint
CREATE UNIQUE INDEX "UniqueCartItem" ON "CartItem" USING btree ("cartId","productId");--> statement-breakpoint
CREATE INDEX "Error_userId_idx" ON "Error" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "File_userId_idx" ON "File" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "Notification_userId_idx" ON "Notification" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "UniqueOrderItem" ON "OrderItem" USING btree ("orderId","productId");--> statement-breakpoint
CREATE INDEX "Order_userId_idx" ON "Order" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "Order_addressId_idx" ON "Order" USING btree ("addressId");--> statement-breakpoint
CREATE INDEX "Order_discountCodeId_idx" ON "Order" USING btree ("discountCodeId");--> statement-breakpoint
CREATE INDEX "Payment_userId_idx" ON "Payment" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "Payment_providerId_idx" ON "Payment" USING btree ("providerId");--> statement-breakpoint
CREATE INDEX "Payment_orderId_idx" ON "Payment" USING btree ("orderId");--> statement-breakpoint
CREATE UNIQUE INDEX "_CategoryToProduct_AB_unique" ON "_CategoryToProduct" USING btree ("A","B");--> statement-breakpoint
CREATE INDEX "_CategoryToProduct_B_index" ON "_CategoryToProduct" USING btree ("B");--> statement-breakpoint
CREATE UNIQUE INDEX "UniqueProductProductReview" ON "ProductReview" USING btree ("productId","userId");--> statement-breakpoint
CREATE INDEX "ProductReview_userId_idx" ON "ProductReview" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "ProductReview_productId_idx" ON "ProductReview" USING btree ("productId");--> statement-breakpoint
CREATE INDEX "Product_brandId_idx" ON "Product" USING btree ("brandId");--> statement-breakpoint
CREATE INDEX "Refund_orderId_idx" ON "Refund" USING btree ("orderId");--> statement-breakpoint
CREATE UNIQUE INDEX "_Wishlist_AB_unique" ON "_Wishlist" USING btree ("A","B");--> statement-breakpoint
CREATE INDEX "_Wishlist_B_index" ON "_Wishlist" USING btree ("B");