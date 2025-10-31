![Screenshot](https://github.com/sesto-dev/next-prisma-tailwind-ecommerce/assets/45223699/00444538-a496-4f90-814f-7e57a580ad17)

<div align="center"><h3>Full-Stack E-Commerce Platform</h3><p>Built using Typescript with Next.js, Drizzle ORM and TailwindCSS.</p></div>
<div align="center">
<a href="https://pasargad.vercel.app">Storefront</a> 
<span> · </span>
<a href="https://pardis.vercel.app">Admin Panel</a>
</div>

## 👋 Introduction

Welcome to the open-source Next.js E-Commerce Storefront with Admin Panel project! This project is built with TypeScript, Tailwind CSS, and Drizzle ORM, providing a powerful and flexible solution for building and managing your e-commerce website.

## 🥂 Features

-  [x] [**Next.js 14**](https://nextjs.org) App Router and React Server Components.
-  [x] Custom dynamic `Sitemap.xml` generation.
-  [x] Admin dashboard with products, orders, and payments.
-  [x] File uploads using `next-cloudinary`.
-  [x] Authentication using `middleware.ts` and `httpOnly` cookies.
-  [x] Storefront with blog, products, and categories.
-  [x] Database-Stored blogs powered by **MDX** templates.
-  [x] Email verification and invoices using [react-email-tailwind-templates](https://github.com/sesto-dev/react-email-tailwind-templates).
-  [x] [**TailwindCSS**](https://tailwindcss.com/) for utility-first CSS.
-  [x] UI built with [**Radix**](https://www.radix-ui.com/) and stunning UI components, all thanks to [**shadcn/ui**](https://ui.shadcn.com/).
-  [x] Type-Validation with **Zod**.
-  [x] [**Next Metadata API**](https://nextjs.org/docs/api-reference/metadata) for SEO handling.
-  [ ] Comprehensive implementations for i18n.

## 🏗️ Architecture

This project follows a modern microservices architecture with 3 separate applications:

### **apps/admin** - Admin Dashboard
The admin panel for managing products, orders, users, and other administrative tasks.
- Port: `8888` (development)
- Tech: Next.js 15, React Server Components
- Purpose: Internal management interface

### **apps/storefront** - Customer-Facing Store
The public e-commerce storefront where customers browse and purchase products.
- Port: `7777` (development)
- Tech: Next.js 15, React Server Components
- Purpose: Public shopping experience

### **apps/api** - Centralized API Server
A standalone API server that serves both the admin panel and storefront.
- Port: `9999` (development)
- Tech: Next.js 15 API Routes, Drizzle ORM
- Purpose: Centralized backend logic, database access, authentication

### Why 3 Apps?

**Separation of Concerns**: Frontend (admin & storefront) and backend (API) are completely separated.

**Independent Scaling**: Each app can be deployed and scaled independently based on traffic.

**Better Security**: The API can have its own security rules, rate limiting, and access controls.

**Easier Maintenance**: Changes to the API don't require redeploying frontends and vice versa.

**Single Source of Truth**: One API serves multiple clients, ensuring consistency.

### Deployment

When deploying with Vercel or similar platforms, create 3 separate deployments:

1. **API Server**: Root Directory = `apps/api`
2. **Admin Panel**: Root Directory = `apps/admin`
3. **Storefront**: Root Directory = `apps/storefront`

![image](https://github.com/Accretence/next-prisma-tailwind-ecommerce/assets/45223699/f5adc1ac-9dbb-46cb-bb6e-a8db15883348)

Make sure to set the appropriate environment variables for each deployment, especially `NEXT_PUBLIC_API_URL` for the admin and storefront apps pointing to your deployed API server.

## 🔐 Authentication

The authentication is handled using JWT tokens stored in cookies and verified inside the `middleware.ts` file. The middleware function takes in the HTTP request, reads the `token` cookie and if the JWT is successfully verified, it sets the `X-USER-ID` header with the userId as the value, otherwise the request is sent back with 401 status.

## 👁‍🗨 Environment variables

Environment variables are stored in `.env` files. By default the `.env.example` file is included in source control and contains
settings and defaults to get the app running. Any secrets or local overrides of these values should be placed in a
`.env` file, which is ignored from source control.

Remember, never commit and store `.env` in the source control, just only `.env.example` without any data specified.

You can [read more about environment variables here](https://nextjs.org/docs/basic-features/environment-variables).

## 🏃‍♂️ Getting Started Locally

### Prerequisites

Before you begin, make sure you have:
- Node.js 18+ installed
- PostgreSQL database (local or cloud-based like Supabase/Neon)
- npm or bun package manager

### Step 1: Clone the Repository

```bash
git clone https://github.com/sesto-dev/next-prisma-tailwind-ecommerce
cd next-prisma-tailwind-ecommerce
```

### Step 2: Set Up Environment Variables

Create `.env` files for each application. You can use the `.env.example` files as templates:

```bash
# In apps/api
cd apps/api
cp .env.example .env
# Edit apps/api/.env with your values

# In apps/admin
cd ../admin
cp .env.example .env
# Edit apps/admin/.env with your values

# In apps/storefront
cd ../storefront
cp .env.example .env
# Edit apps/storefront/.env with your values
```

#### Required Environment Variables

**API Server** (`apps/api/.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
JWT_SECRET_KEY="your-super-secret-jwt-key-change-this"
ALLOWED_ORIGINS="http://localhost:7777,http://localhost:8888"
NODE_ENV="development"
```

**Admin Panel** (`apps/admin/.env`):
```env
NEXT_PUBLIC_API_URL="http://localhost:9999"
JWT_SECRET_KEY="your-super-secret-jwt-key-change-this"
NODE_ENV="development"
```

**Storefront** (`apps/storefront/.env`):
```env
NEXT_PUBLIC_API_URL="http://localhost:9999"
JWT_SECRET_KEY="your-super-secret-jwt-key-change-this"
NODE_ENV="development"
```

> **Important**: The `JWT_SECRET_KEY` must be the same across all three applications!

### Step 3: Install Dependencies

Install dependencies for all applications:

```bash
# From the root directory
npm install

# Install dependencies for API
cd apps/api
npm install

# Install dependencies for Admin
cd ../admin
npm install

# Install dependencies for Storefront
cd ../storefront
npm install
```

### Step 4: Set Up the Database

Initialize your database schema:

```bash
# From the root directory
cd apps/api
npm run db:push
```

This will create all necessary tables in your PostgreSQL database.

### Step 5: Run All Applications

You need to run all three applications simultaneously in separate terminal windows:

**Terminal 1 - Start API Server:**
```bash
cd apps/api
npm run dev
# API will run on http://localhost:9999
```

**Terminal 2 - Start Admin Panel:**
```bash
cd apps/admin
npm run dev
# Admin will run on http://localhost:8888
```

**Terminal 3 - Start Storefront:**
```bash
cd apps/storefront
npm run dev
# Storefront will run on http://localhost:7777
```

### Step 6: Access the Applications

- **Storefront**: http://localhost:7777 (Customer-facing store)
- **Admin Panel**: http://localhost:8888 (Management dashboard)
- **API Server**: http://localhost:9999 (Backend API)

### Troubleshooting

**CORS Errors**: Make sure `ALLOWED_ORIGINS` in `apps/api/.env` includes both frontend URLs.

**Authentication Issues**: Verify that `JWT_SECRET_KEY` is identical in all three `.env` files.

**Database Connection Failed**: Check your `DATABASE_URL` is correct and the database is running.

**Port Already in Use**: Change the port in the respective `package.json` file (e.g., `-p 9999` to `-p 9998`).

For more detailed information about the architecture and migration, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) and [ENV_SETUP.md](./ENV_SETUP.md).

## 🔑 Database

Drizzle ORM can use any PostgreSQL database. [Supabase is the easiest to work with.](https://orm.drizzle.team/docs/get-started-postgresql) Simply set `DATABASE_URL` in your `.env` file to work.

### Database Commands

This project exposes npm scripts for managing your database via Drizzle ORM. Run these commands from the `apps/api` directory:

```bash
cd apps/api

# Available commands:
npm run db:generate   # Generate migrations from schema changes
npm run db:migrate    # Apply migrations to database
npm run db:push       # Push schema directly to database (development)
npm run db:studio     # Open Drizzle Studio for database management
```

### Making Changes to the Database Schema

1. Modify the schema file: `apps/api/src/db/schema.ts`
2. Generate migrations: `npm run db:generate` (or use `db:push` for development)
3. Apply changes: `npm run db:migrate` (or `db:push` applies immediately)

> **Tip**: Use `db:push` during development for quick iterations, and `db:generate` + `db:migrate` for production deployments.

## 🛸 How to Deploy the Project

This project can be deployed to various platforms. The recommended approach is to deploy each of the three applications separately.

### Deploying to Vercel (Recommended)

Vercel is the easiest platform for deploying Next.js applications. You'll need to create **3 separate projects** on Vercel:

#### 1. Deploy the API Server

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **"Add New Project"**
2. Import your Git repository
3. Configure:
   - **Root Directory**: `apps/api`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```env
   DATABASE_URL=your-postgres-connection-string
   JWT_SECRET_KEY=your-strong-secret-key
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-storefront.vercel.app,https://your-admin.vercel.app
   ```

5. Deploy and save the URL (e.g., `https://your-api.vercel.app`)

#### 2. Deploy the Admin Panel

1. Create another new project on Vercel
2. Import the same repository
3. Configure:
   - **Root Directory**: `apps/admin`
   - **Framework Preset**: Next.js

4. Add Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://your-api.vercel.app
   JWT_SECRET_KEY=same-secret-as-api
   NODE_ENV=production
   ```

5. Deploy and save the URL

#### 3. Deploy the Storefront

1. Create another new project on Vercel
2. Import the same repository
3. Configure:
   - **Root Directory**: `apps/storefront`
   - **Framework Preset**: Next.js

4. Add Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://your-api.vercel.app
   JWT_SECRET_KEY=same-secret-as-api
   NODE_ENV=production
   ```

5. Deploy

#### Database Setup

You'll need a PostgreSQL database for production. Options:

- **Vercel Postgres**: Easiest, integrated with Vercel
- **Supabase**: Free tier available at [supabase.com](https://supabase.com)
- **Neon**: Free tier available at [neon.tech](https://neon.tech)

After setting up your database:

1. Run migrations from your local machine:
   ```bash
   cd apps/api
   DATABASE_URL="your-production-url" npm run db:push
   ```

2. Update the `ALLOWED_ORIGINS` in your API deployment to include your deployed frontend URLs

#### Important Notes

- The `JWT_SECRET_KEY` must be **identical** across all three deployments
- Update `ALLOWED_ORIGINS` in the API after deploying the frontends
- Each app must point to your production API URL via `NEXT_PUBLIC_API_URL`

### Other Deployment Options

For other platforms like Netlify, Railway, or Docker, follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker).

## 📄 License

This project is MIT-licensed and is free to use and modify for your own projects. Check the [LICENSE](./LICENSE) file for details.

Created by [Amirhossein Mohammadi](https://github.com/sesto-dev).
