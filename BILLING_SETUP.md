# Subscription & Billing Setup Guide

## 1. Environment Variables

Add these to your `apps/api/.env`:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Get from Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_... # Get after creating webhook
STRIPE_STARTER_PRICE_ID=price_... # Create in Stripe Dashboard
STRIPE_PRO_PRICE_ID=price_... # Create in Stripe Dashboard

# URLs
ADMIN_URL=http://localhost:8888 # or your admin panel URL
```

## 2. Create Stripe Products

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Create two products:

**Starter Plan:**
- Name: "Starter"
- Price: $29/month
- Copy the `price_id` → use as `STRIPE_STARTER_PRICE_ID`

**Pro Plan:**
- Name: "Pro"
- Price: $99/month
- Copy the `price_id` → use as `STRIPE_PRO_PRICE_ID`

## 3. Database Migration

Generate and run the migration:

```bash
cd apps/api
npm run db:generate
npm run db:migrate
```

## 4. Setup Stripe Webhook

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://your-api.vercel.app/api/billing/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the `Signing secret` → use as `STRIPE_WEBHOOK_SECRET`

**For Local Testing:**
Use Stripe CLI:
```bash
stripe listen --forward-to localhost:9999/api/billing/webhook
```

## 5. Test the Flow

1. Start API: `cd apps/api && npm run dev`
2. Start Admin: `cd apps/admin && npm run dev`
3. Login to admin panel
4. Navigate to `/billing`
5. Click "Upgrade" on Starter or Pro plan
6. Complete test checkout (use card `4242 4242 4242 4242`)
7. Verify subscription updated in database

## 6. Verify Installation

Check that:
- [ ] `/billing` page loads showing all plans
- [ ] Current plan shows "Free" with badge
- [ ] "Upgrade" buttons work
- [ ] Checkout redirects to Stripe
- [ ]Test payment updates subscription in DB

## Troubleshooting

**"STRIPE_SECRET_KEY is not configured"**
- Add the env var and restart API server

**Webhook not receiving events**
- Check webhook URL is correct
- Verify webhook secret matches
- Use Stripe CLI for local testing

**Checkout session fails**
- Check price IDs are correct
- Verify Stripe is in test mode
- Check API logs for errors
