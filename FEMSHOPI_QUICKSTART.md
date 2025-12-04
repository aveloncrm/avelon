# 🚀 Femshopi Quick Start

Everything is ready! Just follow these 3 simple steps:

---

## Option 1: Automated Setup (Recommended)

Run the automated setup script:

```bash
cd apps/api
sudo ./scripts/setup-femshopi.sh
```

This will:
- ✅ Add `femshopi.localhost` to `/etc/hosts`
- ✅ Flush DNS cache
- ✅ Create merchant, store, brands, categories, and 8 products

---

## Option 2: Manual Setup

### Step 1: Update /etc/hosts

```bash
sudo nano /etc/hosts
```

Add this line:
```
127.0.0.1   femshopi.localhost
```

Save and exit (Ctrl+O, Enter, Ctrl+X)

### Step 2: Flush DNS Cache

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

### Step 3: Seed the Database

```bash
cd apps/api
tsx scripts/seed-femshopi.ts
```

---

## Verify Setup

After setup, verify everything works:

```bash
cd apps/api
./scripts/verify-femshopi.sh
```

Or manually test:

```bash
# Start API
npm run dev

# In another terminal, test the endpoint
curl http://femshopi.localhost:9999/api/products
```

---

## What You Get

✨ **Femshopi Store** with:
- 1 Merchant
- 1 Store (subdomain: `femshopi`)
- 4 Brands (Femshopi Originals, Urban Chic, Elegance, Casual Comfort)
- 6 Categories (Dresses, Tops & Blouses, Bottoms, Outerwear, Accessories, Shoes)
- 8 Sample Products (with images, prices, discounts, stock)

---

## Test URLs

Once API is running:

- **Products**: http://femshopi.localhost:9999/api/products
- **Categories**: http://femshopi.localhost:9999/api/categories
- **Brands**: http://femshopi.localhost:9999/api/brands
- **Store Resolution**: http://localhost:9999/api/internal/resolve-store?host=femshopi.localhost

---

## Troubleshooting

❌ **"Command not found: tsx"**
```bash
npm install -g tsx
```

❌ **"Permission denied"**
```bash
chmod +x scripts/setup-femshopi.sh scripts/verify-femshopi.sh
```

❌ **"Store not found"**
- Make sure you ran the seed script
- Check database connection

---

**Ready to go!** 🎉
