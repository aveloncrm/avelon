CREATE TYPE "public"."SubscriptionPlanEnum" AS ENUM('free', 'starter', 'pro', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."SubscriptionStatusEnum" AS ENUM('trialing', 'active', 'past_due', 'canceled', 'unpaid');--> statement-breakpoint
CREATE TABLE "Subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"merchantId" text NOT NULL,
	"plan" "SubscriptionPlanEnum" DEFAULT 'free' NOT NULL,
	"status" "SubscriptionStatusEnum" DEFAULT 'active' NOT NULL,
	"stripeCustomerId" text,
	"stripeSubscriptionId" text,
	"currentPeriodStart" timestamp,
	"currentPeriodEnd" timestamp,
	"cancelAtPeriodEnd" boolean DEFAULT false NOT NULL,
	"trialEndsAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Subscription_merchantId_unique" UNIQUE("merchantId"),
	CONSTRAINT "Subscription_stripeCustomerId_unique" UNIQUE("stripeCustomerId"),
	CONSTRAINT "Subscription_stripeSubscriptionId_unique" UNIQUE("stripeSubscriptionId")
);
--> statement-breakpoint
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_merchantId_Merchant_id_fk" FOREIGN KEY ("merchantId") REFERENCES "public"."Merchant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "Subscription_merchantId_idx" ON "Subscription" USING btree ("merchantId");--> statement-breakpoint
CREATE INDEX "Subscription_stripeCustomerId_idx" ON "Subscription" USING btree ("stripeCustomerId");