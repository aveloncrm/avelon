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

Clone the repository.

```bash
git clone https://github.com/sesto-dev/next-prisma-tailwind-ecommerce
```

Navigate to each folder in the `apps` folder and set the environment variables.

```sh
# In apps/api
cp .env.example .env

# In apps/admin  
cp .env.example .env

# In apps/storefront
cp .env.example .env
```

### Environment Setup

**API Server** (`apps/api/.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
JWT_SECRET_KEY="your-secret-key-here"
ALLOWED_ORIGINS="http://localhost:7777,http://localhost:8888"
```

**Admin Panel** (`apps/admin/.env`):
```env
NEXT_PUBLIC_API_URL="http://localhost:9999"
JWT_SECRET_KEY="your-secret-key-here"
```

**Storefront** (`apps/storefront/.env`):
```env
NEXT_PUBLIC_API_URL="http://localhost:9999"
JWT_SECRET_KEY="your-secret-key-here"
```

### Install Dependencies & Setup Database

Get all dependencies sorted.

```sh
bun install
```

Set up the database (run from `apps/api` directory):

```bash
cd apps/api
bun run db:push
```

### Run All Applications

You need to run all three applications simultaneously:

```sh
# Terminal 1 - API Server
cd apps/api
bun run dev  # Runs on http://localhost:9999

# Terminal 2 - Admin Panel  
cd apps/admin
bun run dev  # Runs on http://localhost:8888

# Terminal 3 - Storefront
cd apps/storefront
bun run dev  # Runs on http://localhost:7777
```

### Access the Applications

- **Storefront**: http://localhost:7777
- **Admin Panel**: http://localhost:8888
- **API**: http://localhost:9999

For more detailed information about the new architecture and migration from the old structure, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md).

## 🔑 Database

Drizzle ORM can use any PostgreSQL database. [Supabase is the easiest to work with.](https://orm.drizzle.team/docs/get-started-postgresql) Simply set `DATABASE_URL` in your `.env` file to work.

### `bun run db`

This project exposes a package.json script for accessing drizzle via `bun run db:<command>`. You should always try to use this script when interacting with drizzle locally.

Available commands:
- `bun run db:generate` - Generate migrations from schema changes
- `bun run db:migrate` - Apply migrations to database
- `bun run db:push` - Push schema directly to database (development)
- `bun run db:studio` - Open Drizzle Studio for database management

### Making changes to the database schema

Make changes to your database by modifying `apps/api/src/db/schema.ts`.

## 🛸 How to Deploy the Project

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## 📄 License

This project is MIT-licensed and is free to use and modify for your own projects. Check the [LICENSE](./LICENSE) file for details.

Created by [Amirhossein Mohammadi](https://github.com/sesto-dev).
