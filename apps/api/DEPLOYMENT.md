# Database Deployment Guide

This guide covers the best practice workflow for managing database migrations across development and production environments.

## Architecture Overview

- **Local Development**: PostgreSQL database (local)
- **Production**: Neon PostgreSQL (managed on Vercel)
- **Migration Strategy**: SQL migration files committed to Git

## 🔧 Local Development Workflow

### 1. Schema Changes

When you modify the schema in `src/db/schema.ts`:

```bash
# Generate migration files (creates SQL files in /drizzle folder)
npm run db:generate

# Apply migrations to your local database
npm run db:push
# OR
npm run db:migrate
```

### 2. Testing Locally

```bash
# Start development server
npm run dev

# (Optional) Open Drizzle Studio to view/edit data
npm run db:studio
```

### 3. Commit Migration Files

**Important**: Always commit the generated migration files to Git:

```bash
git add drizzle/
git commit -m "feat: add new database migrations"
```

## 🚀 Production Deployment (Vercel + Neon)

### Environment Variables Setup

#### In Vercel Dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add these variables for **Production**:

```env
DATABASE_URL=postgresql://user:password@your-neon-host/dbname?sslmode=require
JWT_SECRET_KEY=your-production-secret-key
ALLOWED_ORIGINS=https://admin.yourdomain.com,https://store.yourdomain.com
NODE_ENV=production
```

3. **Important**: Make sure these are set for the **Production** environment only

### Option 1: Manual Migration (Recommended for First Deploy)

Before deploying your app for the first time:

```bash
# Set your Neon production DATABASE_URL temporarily
export DATABASE_URL="postgresql://user:password@your-neon-host/dbname?sslmode=require"

# Run migrations against production
npm run db:migrate:prod

# Unset the production URL to avoid accidents
unset DATABASE_URL
```

### Option 2: Automatic Migration on Deploy

Add a postbuild script to run migrations automatically after each deployment.

**Update `package.json`:**

```json
{
  "scripts": {
    "build": "npm run db:migrate:prod && next build"
  }
}
```

⚠️ **Warning**: This runs migrations on every deploy. Make sure your migrations are idempotent.

### Option 3: Separate Migration Deployment

Create a separate deployment workflow:

1. Deploy migration script to a separate Vercel function
2. Trigger it manually or via CI/CD before main deployment
3. Then deploy the main application

## 📋 Common Commands

| Command | Purpose | Environment |
|---------|---------|-------------|
| `npm run db:generate` | Generate migration files from schema | Local |
| `npm run db:push` | Quick push schema (dev only) | Local |
| `npm run db:migrate` | Apply migrations | Local |
| `npm run db:migrate:prod` | Apply migrations with custom DB URL | Production |
| `npm run db:studio` | Open Drizzle Studio | Local |

## 🔐 Security Best Practices

1. **Never** commit `.env` files (already in `.gitignore`)
2. **Never** hardcode production credentials
3. **Always** use environment variables in Vercel
4. **Review** migration SQL files before deploying
5. **Test** migrations on a staging database first

## 🐛 Troubleshooting

### Issue: Tables not appearing in production

**Solution**: Run migrations manually:
```bash
export DATABASE_URL="your-neon-production-url"
npm run db:migrate:prod
```

### Issue: Migration fails with "already exists" error

**Solution**: Your database already has those tables. Either:
- Drop the tables manually in Neon console
- Create a new migration that checks for existence
- Reset the database (⚠️ destroys all data)

### Issue: `db:push` updated local but not production

**Explanation**: `db:push` only updates the database specified in your current `DATABASE_URL` environment variable. For production, use `db:migrate:prod`.

## 🎯 Complete Deployment Checklist

### First-Time Production Setup:

- [ ] Create Neon PostgreSQL database
- [ ] Add DATABASE_URL to Vercel environment variables
- [ ] Generate migrations: `npm run db:generate`
- [ ] Review migration SQL files in `drizzle/` folder
- [ ] Commit and push migration files to Git
- [ ] Run migrations: `DATABASE_URL=<prod-url> npm run db:migrate:prod`
- [ ] Verify tables in Neon Console → SQL Editor
- [ ] Deploy application to Vercel

### For Subsequent Schema Changes:

- [ ] Modify schema in `src/db/schema.ts`
- [ ] Generate migrations: `npm run db:generate`
- [ ] Test locally: `npm run db:push` or `npm run db:migrate`
- [ ] Review generated SQL
- [ ] Commit migration files
- [ ] Push to Git
- [ ] Run production migration: `DATABASE_URL=<prod-url> npm run db:migrate:prod`
- [ ] Deploy application

## 📚 Additional Resources

- [Drizzle ORM Migrations Docs](https://orm.drizzle.team/docs/migrations)
- [Neon PostgreSQL Docs](https://neon.tech/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

