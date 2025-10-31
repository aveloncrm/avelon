# API Server

This is the centralized API server for the e-commerce platform. It serves both the admin panel and the storefront.

## Architecture

The API is built with Next.js 15 and provides RESTful endpoints for:
- Authentication (OTP via email/phone)
- Products management
- Categories and brands
- Orders and payments
- User profiles and addresses
- Shopping cart and wishlist
- Admin operations

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Environment variables configured

### Installation

```bash
npm install
# or
bun install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"

# JWT
JWT_SECRET_KEY="your-secret-key-here"

# CORS - Comma separated allowed origins
ALLOWED_ORIGINS="http://localhost:7777,http://localhost:8888"

# Node Environment
NODE_ENV="development"
```

### Database Setup

**Local Development:**

```bash
# Generate migrations from schema changes
npm run db:generate

# Push schema to local database (quick development)
npm run db:push

# OR apply migrations to local database
npm run db:migrate

# (Optional) Open Drizzle Studio
npm run db:studio
```

**Production Deployment:**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete production deployment guide.

```bash
# Run migrations against production database
DATABASE_URL=<your-neon-url> npm run db:migrate:prod
```

### Development

```bash
npm run dev
```

The API will be available at `http://localhost:9999`

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/otp/email/try` - Request OTP via email
- `POST /api/auth/otp/email/verify` - Verify email OTP
- `POST /api/auth/otp/phone/try` - Request OTP via phone
- `POST /api/auth/otp/phone/verify` - Verify phone OTP
- `GET /api/auth/logout` - Logout user

### Products (Public GET, Protected POST/PATCH/DELETE)
- `GET /api/products` - List all products
- `POST /api/products` - Create product (admin only)
- `GET /api/products/:id` - Get product by ID
- `PATCH /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories (Public GET, Protected POST/PATCH/DELETE)
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (admin only)
- `GET /api/categories/:id` - Get category by ID
- `PATCH /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Brands (Public GET, Protected POST/PATCH/DELETE)
- `GET /api/brands` - List all brands
- `POST /api/brands` - Create brand (admin only)
- `GET /api/brands/:id` - Get brand by ID
- `PATCH /api/brands/:id` - Update brand (admin only)
- `DELETE /api/brands/:id` - Delete brand (admin only)

### Orders (Protected)
- `GET /api/orders` - List orders (user's orders or all if adminView=true)
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add/update item in cart

### Wishlist (Protected)
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add/remove item from wishlist

### Addresses (Protected)
- `GET /api/addresses` - List user's addresses
- `POST /api/addresses` - Create address
- `GET /api/addresses/:id` - Get address by ID
- `DELETE /api/addresses/:id` - Delete address

### Profile (Protected)
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update user profile

### Users (Admin only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user

### Payments (Protected)
- `GET /api/payments` - List payments
- `GET /api/payments/:id` - Get payment by ID

### Banners (Admin only)
- `GET /api/banners` - List all banners
- `POST /api/banners` - Create banner
- `GET /api/banners/:id` - Get banner by ID
- `PATCH /api/banners/:id` - Update banner
- `DELETE /api/banners/:id` - Delete banner

## Authentication

The API uses JWT tokens for authentication. Tokens can be provided via:
1. Cookie: `token` cookie
2. Header: `Authorization: Bearer <token>`

Protected endpoints require a valid JWT token. The middleware extracts the user ID and sets it in the `X-USER-ID` header for use in route handlers.

## CORS

CORS is configured in `next.config.js` to allow requests from the admin and storefront applications. Update the `ALLOWED_ORIGINS` environment variable to include your frontend URLs.

## Database

The API uses Drizzle ORM with PostgreSQL. The schema is defined in `src/db/schema.ts`.

## Email Notifications

Order creation triggers email notifications to store owners using the `@persepolis/mail` package.

