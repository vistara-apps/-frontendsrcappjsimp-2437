# Dashboard API Documentation

## Overview

This document describes the REST API for the Modern Dashboard Application. The API provides endpoints for authentication, data retrieval, and analytics.

**Base URL:** `http://localhost:5000` (development)  
**API Version:** 1.0.0  
**Authentication:** JWT Bearer Token

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Authentication](#authentication-endpoints)
  - [KPIs](#kpis)
  - [Sales Data](#sales-data)
  - [Transactions](#transactions)
  - [Analytics](#analytics)
  - [User Management](#user-management)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Demo Credentials

- **Admin User:** `admin` / `password`
- **Regular User:** `user` / `password`

## Endpoints

### Health Check

#### GET /health

Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-07T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Authentication Endpoints

#### POST /login

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response (Success - 200):**
```json
{
  "id": 1,
  "username": "admin",
  "role": "admin",
  "email": "admin@company.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid credentials"
}
```

**Rate Limit:** 5 requests per 15 minutes per IP

### KPIs

#### GET /kpis

Retrieve key performance indicators.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalSales": 125000,
  "activeCustomers": 1247,
  "dailyRevenue": 5430,
  "monthlyGrowth": 12.5,
  "conversionRate": 2.4,
  "avgOrderValue": 156,
  "customerRetention": 78,
  "lastUpdated": "2024-01-07T10:30:00.000Z"
}
```

### Sales Data

#### GET /sales

Retrieve sales data with optional period filtering.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): `7d` (default) or `30d`

**Response (200):**
```json
[
  {
    "date": "2024-01-01",
    "sales": 12000,
    "orders": 45,
    "customers": 38
  },
  {
    "date": "2024-01-02",
    "sales": 15000,
    "orders": 52,
    "customers": 41
  }
]
```

### Transactions

#### GET /transactions

Retrieve transaction data with pagination, filtering, and search.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (`completed`, `pending`, `all`)
- `search` (optional): Search in customer name or product

**Response (200):**
```json
{
  "transactions": [
    {
      "id": 1,
      "customer": "John Doe",
      "amount": 299,
      "date": "2024-01-07",
      "status": "completed",
      "product": "Premium Package",
      "paymentMethod": "Credit Card"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 5,
    "itemsPerPage": 10
  }
}
```

### Analytics

#### GET /analytics/overview

Retrieve comprehensive analytics overview.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalRevenue": 125000,
  "totalOrders": 383,
  "averageOrderValue": 156,
  "topProducts": [
    {
      "name": "Premium Package",
      "sales": 45,
      "revenue": 13455
    }
  ],
  "salesByRegion": [
    {
      "region": "North America",
      "sales": 45000,
      "percentage": 36
    }
  ]
}
```

### User Management

#### GET /users

Retrieve all users (Admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "email": "admin@company.com"
  },
  {
    "id": 2,
    "username": "user",
    "role": "user",
    "email": "user@company.com"
  }
]
```

**Response (403 - Forbidden):**
```json
{
  "error": "Admin access required"
}
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in JSON format:

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "Username and password are required"
}
```

**401 Unauthorized:**
```json
{
  "error": "Access token required"
}
```

**403 Forbidden:**
```json
{
  "error": "Invalid or expired token"
}
```

**404 Not Found:**
```json
{
  "error": "Endpoint not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General endpoints:** 100 requests per 15 minutes per IP
- **Authentication endpoints:** 5 requests per 15 minutes per IP

When rate limit is exceeded, the API returns:

**429 Too Many Requests:**
```json
{
  "error": "Too many requests, please try again later."
}
```

## Security Features

- **Helmet.js:** Security headers
- **CORS:** Cross-origin resource sharing protection
- **JWT:** Secure token-based authentication
- **bcrypt:** Password hashing
- **Rate limiting:** Request throttling
- **Input validation:** Request data validation

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Development Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Production Deployment

1. Set environment variables
2. Install production dependencies:
   ```bash
   npm ci --only=production
   ```
3. Start the server:
   ```bash
   npm start
   ```

## API Client Examples

### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Login
const login = async (username, password) => {
  const response = await api.post('/login', { username, password });
  const { token } = response.data;
  
  // Set token for future requests
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  return response.data;
};

// Get KPIs
const getKPIs = async () => {
  const response = await api.get('/kpis');
  return response.data;
};
```

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'
```

**Get KPIs:**
```bash
curl -X GET http://localhost:5000/kpis \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Changelog

### Version 1.0.0
- Initial API release
- Authentication endpoints
- Dashboard data endpoints
- Analytics endpoints
- User management
- Rate limiting and security features
