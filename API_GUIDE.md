# Order CRM System - Backend API Guide

## Overview
This backend provides RESTful APIs for the Order CRM System, built with NestJS, MongoDB, and JWT authentication.

## Environment Variables
Create a `.env` file in the backend root directory. You can copy from `env.example`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/order-crm

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**⚠️ Important:** All environment variables are required. The application will not start if any are missing.

**Environment Validation:**
- The app validates all required environment variables on startup
- If any variables are missing, the app will exit with an error message
- Check the console output for specific missing variables

## API Endpoints

### Authentication
- `POST /api/auth/google` - Login with Google ID token
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/google/start` - Get Google OAuth URL

### Orders
- `GET /api/orders` - Get orders with pagination and filters
  - Query params: `page`, `limit`, `status`, `search`
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order
- `GET /api/orders/stats` - Get order statistics

### Products
- `GET /api/products` - Get products with pagination and filters
  - Query params: `page`, `limit`, `category`, `status`, `search`
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product by ID
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories` - Get all categories
- `GET /api/products/stats` - Get product statistics

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Data Models

### Order
```typescript
{
  id: string;
  orderNumber: string;
  status: 'new' | 'preparing' | 'shipped' | 'cancelled' | 'rejected' | 'draft';
  items: number;
  customerName: string;
  shippingService: 'standard' | 'priority' | 'express';
  trackingCode: string;
  total: number;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product
```typescript
{
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
  image?: string;
  description?: string;
  sku?: string;
  weight?: number;
  dimensions?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB (if using local instance):
```bash
mongod
```

3. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3001/api`

## Frontend Integration

The frontend should make requests to the backend API endpoints. Update the frontend's API configuration to point to the backend URL.

Example frontend API call:
```typescript
const response = await fetch('http://localhost:3001/api/orders', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
});
```