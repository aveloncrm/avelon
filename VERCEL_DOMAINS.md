# Vercel Configuration for Multi-Tenancy

This guide explains how to configure Vercel to handle both subdomains (e.g., `store1.avelon.com`) and custom domains (e.g., `mystore.com`).

## 1. Wildcard Subdomains

To allow any subdomain to point to your application:

1.  Go to your **Vercel Project Dashboard**.
2.  Navigate to **Settings** > **Domains**.
3.  Add your main domain with a wildcard: `*.avelon.com`.
4.  Select **"Add"**.
5.  Configure your DNS provider (e.g., GoDaddy, Namecheap, Cloudflare) with the CNAME record provided by Vercel.

**Result**: Any request to `anything.avelon.com` will now hit your Vercel deployment. The middleware will extract `anything` and resolve the store.

## 2. Custom Domains

When a merchant wants to use their own domain (e.g., `www.brand.com`):

### Step A: Add Domain to Vercel Project

You must tell Vercel to accept traffic for this specific domain.

1.  Go to **Settings** > **Domains**.
2.  Enter the merchant's domain: `www.brand.com`.
3.  Click **Add**.
4.  Vercel will provide DNS records (A record or CNAME) that the merchant needs to add to *their* DNS provider.

### Step B: Update Database

1.  Go to your Admin Panel or Database.
2.  Find the store for this merchant.
3.  Update the `customDomain` field to `www.brand.com`.

**Result**:
1.  User visits `www.brand.com`.
2.  DNS points to Vercel.
3.  Vercel accepts the request because the domain is added to the project.
4.  Your API Middleware sees `Host: www.brand.com`.
5.  It calls `resolve-store` API.
6.  The API finds the store with `customDomain = 'www.brand.com'`.
7.  The store is loaded!

## 3. Automating Custom Domains (Advanced)

If you want to allow merchants to add domains automatically from your Admin Panel without you manually logging into Vercel:

You need to use the **Vercel API**.

1.  **Get Vercel Access Token**: Create a token in your Vercel Account Settings.
2.  **Use the API**:
    - Endpoint: `POST https://api.vercel.com/v9/projects/{projectId}/domains`
    - Body: `{ "name": "www.brand.com" }`
    - Headers: `Authorization: Bearer <TOKEN>`

**Implementation Flow**:
1.  Merchant enters `www.brand.com` in your Admin Panel.
2.  Your Admin API saves this to the `Store` table.
3.  Your Admin API *also* calls the Vercel API to add the domain to your project.
4.  You show the merchant the DNS records they need to configure.
