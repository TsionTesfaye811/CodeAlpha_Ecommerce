# ShopAlpha — Full-Stack E-Commerce Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express.js-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

**ShopAlpha** is a production-style full-stack e-commerce web application built for the **CodeAlpha Internship Program**. It delivers a complete online shopping experience — from user authentication and product discovery to cart management, checkout, order tracking, and an admin dashboard for inventory control.

**Live repository:** [github.com/TsionTesfaye811/CodeAlpha_Ecommerce](https://github.com/TsionTesfaye811/CodeAlpha_Ecommerce)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo Credentials](#demo-credentials)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Frontend Routes](#frontend-routes)
- [API Endpoints](#api-endpoints)
- [User Flow](#user-flow)
- [Admin Panel](#admin-panel)
- [Environment Variables](#environment-variables)
- [Author](#author)

---

## Overview

ShopAlpha follows a modern **three-tier architecture**:

```
React Frontend  →  Express REST API  →  MySQL Database
   (Port 3000)        (Port 5000)         (ecommerce_db)
```

The backend uses a clean **routes → controllers → database** pattern. The frontend is component-driven with reusable UI, centralized API calls, and protected routes for authenticated users and admins.

---

## Features

### Customer

| Feature | Description |
|---------|-------------|
| **Authentication** | Register, login, JWT-based sessions |
| **Product catalog** | Browse products on the home page |
| **Product details** | Image gallery, quantity selector, add to cart |
| **Shopping cart** | Add, remove, and update item quantities |
| **Checkout** | Place orders from cart items |
| **Order history** | View past orders with item breakdown |
| **Profile** | Account details, stats, and recent orders |

### Admin

| Feature | Description |
|---------|-------------|
| **Role-based access** | Admin-only routes protected by JWT + role middleware |
| **Product management** | Create, edit, and delete products |
| **Multi-image products** | Up to 3 image URLs per product |
| **Admin dashboard** | Dedicated sidebar layout separate from the store |

---

## Demo Credentials

Use these accounts to explore the application after setup:

### Admin account (Admin Panel)

| Field | Value |
|-------|-------|
| **Email** | `admin@shopalpha.com` |
| **Password** | `admin123` |
| **Redirects to** | `/admin/products` |

> After login, you can manage products (add, edit, delete) and use **View Store** in the sidebar to see the customer-facing site.

### Customer account

Register a new account at `/register`, or log in with any user you create. Customers are redirected to `/home` after login.

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, React Router, Axios, Tailwind CSS, shadcn/ui, Lucide Icons |
| **Backend** | Node.js, Express.js 5, JWT, bcryptjs, CORS |
| **Database** | MySQL 8 |
| **Architecture** | REST API, MVC-style separation (routes / controllers / config) |

---

## Project Structure

```
CodeAlpha_Ecommerce/
├── backend/
│   ├── config/           # Database connection
│   ├── controllers/      # Business logic (auth, products, cart, orders, user)
│   ├── middleware/       # JWT & admin authorization
│   ├── routes/           # API route definitions
│   ├── seed/             # Database seed scripts
│   ├── utils/            # Shared helpers
│   ├── server.js         # Application entry point
│   └── .env.example      # Environment variable template
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/          # Axios client (backend communication)
│   │   ├── components/   # Reusable UI (Navbar, ProductCard, Admin layout)
│   │   ├── pages/        # Route-level screens
│   │   └── lib/          # Utility functions
│   └── .env.example
│
├── Database/             # MySQL table export files (optional import)
└── README.md
```

---

## Prerequisites

Ensure the following are installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MySQL](https://www.mysql.com/) (v8 recommended)
- [MySQL Workbench](https://www.mysql.com/products/workbench/) or any MySQL client
- Git

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/TsionTesfaye811/CodeAlpha_Ecommerce.git
cd CodeAlpha_Ecommerce
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure environment variables

Copy the example env files and fill in your MySQL credentials:

**Windows (PowerShell):**
```powershell
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

**macOS / Linux:**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` with your MySQL password and a JWT secret. The frontend `.env` can stay as-is for local development.

---

## Database Setup

Create the database first:

```sql
CREATE DATABASE IF NOT EXISTS ecommerce_db;
```

Then choose **one** of the options below.

### Option A — Import SQL schema files

The files in `Database/` create the table structure (schema only). After importing, run the seed scripts in [Option B](#option-b--use-seed-scripts) to load sample products, cart data, orders, product images, and the admin account.

1. Open **MySQL Workbench** (or your MySQL client)
2. Select `ecommerce_db`
3. Import the SQL files **in this order**:

   - `ecommerce_db_users.sql`
   - `ecommerce_db_products.sql`
   - `ecommerce_db_product_images.sql`
   - `ecommerce_db_cart.sql`
   - `ecommerce_db_orders.sql`
   - `ecommerce_db_order_items.sql`

4. Continue with the seed commands in Option B (steps 2–3)

### Option B — Use seed scripts

Seed scripts create tables if they do not exist and insert sample data.

1. Ensure `backend/.env` is configured (see [Environment Variables](#environment-variables))
2. Run from the `backend` folder:

```bash
cd backend
node seed/seedProducts.js
node seed/seedCart.js
node seed/seedOrders.js
node seed/seedProductImages.js   # Admin user + product image gallery
```

> **Admin login:** `seedProductImages.js` creates `admin@shopalpha.com` / `admin123`. Run it even if you used Option A for schema import.

---

## Running the Application

You need **two terminals** — one for the backend, one for the frontend.

### Terminal 1 — Backend

```bash
cd backend
node server.js
```

Expected output:

```
Server running on port 5000
✅ MySQL Connected
```

### Terminal 2 — Frontend

```bash
cd frontend
npm start
```

The app opens at **http://localhost:3000**

> **Tip:** If API calls fail after code changes, restart the backend (`Ctrl+C`, then `node server.js` again).

---

## Frontend Routes

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/home` | Product catalog | Customer |
| `/product/:id` | Product details | Customer |
| `/cart` | Shopping cart | Customer |
| `/checkout` | Checkout | Customer |
| `/orders` | Order history | Customer |
| `/profile` | User profile | Customer |
| `/admin/products` | Admin product list | Admin |
| `/admin/products/add` | Add product | Admin |
| `/admin/products/edit/:id` | Edit product | Admin |

---

## API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login and receive JWT | Public |
| `GET` | `/api/products` | List all products | Public |
| `GET` | `/api/products/:id` | Get single product | Public |
| `POST` | `/api/products` | Add product | Admin |
| `PUT` | `/api/products/:id` | Update product | Admin |
| `DELETE` | `/api/products/:id` | Delete product | Admin |
| `POST` | `/api/cart` | Add item to cart | Authenticated |
| `GET` | `/api/cart/:userId` | Get user's cart | Authenticated |
| `PUT` | `/api/cart/:id` | Update cart quantity | Authenticated |
| `DELETE` | `/api/cart/:id` | Remove cart item | Authenticated |
| `POST` | `/api/orders/checkout` | Place order | Authenticated |
| `GET` | `/api/orders/:user_id` | Order history | Authenticated |
| `GET` | `/api/user/:id` | User profile | Authenticated |
| `GET` | `/api/user/:id/orders` | User orders | Authenticated |

---

## User Flow

```
Register / Login
      ↓
Browse Products (Home)
      ↓
Product Details → Select quantity → Add to Cart
      ↓
Cart → Proceed to Checkout → Place Order
      ↓
Order History / Profile
```

---

## Admin Panel

1. Go to **http://localhost:3000/login**
2. Sign in with the admin credentials:

   - **Email:** `admin@shopalpha.com`
   - **Password:** `admin123`

3. You will be redirected to **Admin → Products**
4. From there you can:
   - **Add Product** — name, description, price, up to 3 image URLs
   - **Edit** — update any existing product
   - **Delete** — remove a product from the store
   - **View Store** — switch to the customer-facing storefront

---

## Environment Variables

### Backend (`backend/.env`)

Copy from `backend/.env.example`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db
JWT_SECRET=your_jwt_secret_key
```

### Frontend (`frontend/.env`)

Copy from `frontend/.env.example`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

> **Never commit `.env` files to GitHub.** Only `.env.example` templates are included in this repository.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Cannot POST /api/auth/register` | Backend is not running or is an old process — restart with `node server.js` |
| `failed to load profile` | Restart backend after pulling latest code; ensure `/api/user` routes are registered |
| Admin login does not redirect | Run `node seed/seedProductImages.js` to create the admin user |
| Empty product list | Run `node seed/seedProducts.js` (and related seed scripts) |
| Frontend cannot reach API | Check `REACT_APP_API_URL` in `frontend/.env` points to `http://localhost:5000/api` |

---

## Author

**Tsion Tesfaye**  
CodeAlpha Internship Program — Full Stack Web Development  
GitHub: [@TsionTesfaye811](https://github.com/TsionTesfaye811)

---

## License

This project was developed for educational and internship purposes as part of the CodeAlpha program.
