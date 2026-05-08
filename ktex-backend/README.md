# K-TEX Backend API 🏆
> Luxury Fashion E-Commerce — Node.js + Express + MongoDB

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your values

# 3. Seed database with sample data
npm run seed

# 4. Start server
npm run dev        # Development (nodemon)
npm start          # Production
```

Server runs on: `http://localhost:5000`

---

## 📁 Project Structure

```
ktex-backend/
├── server.js              ← Entry point
├── .env.example           ← Environment template
├── config/
│   └── db.js              ← MongoDB connection
├── models/
│   ├── User.model.js      ← User + Auth
│   ├── Product.model.js   ← Products
│   ├── Order.model.js     ← Orders
│   └── Review.model.js    ← Reviews
├── controllers/
│   ├── auth.controller.js
│   ├── product.controller.js
│   ├── order.controller.js
│   ├── payment.controller.js
│   ├── review.controller.js
│   └── admin.controller.js
├── routes/
│   ├── auth.routes.js
│   ├── product.routes.js
│   ├── order.routes.js
│   ├── payment.routes.js
│   ├── review.routes.js
│   ├── user.routes.js
│   └── admin.routes.js
├── middleware/
│   └── auth.middleware.js ← JWT + Role protection
└── utils/
    └── seeder.js          ← Sample data seeder
```

---

## 🔐 Authentication

All protected routes need this header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📡 API Endpoints

### AUTH  `/api/auth`
| Method | Endpoint              | Access  | Description          |
|--------|-----------------------|---------|----------------------|
| POST   | /register             | Public  | Register new user    |
| POST   | /login                | Public  | Login + get token    |
| POST   | /logout               | Private | Logout               |
| GET    | /me                   | Private | Get my profile       |
| PUT    | /update-profile       | Private | Update profile       |
| PUT    | /change-password      | Private | Change password      |
| PUT    | /wishlist/:productId  | Private | Toggle wishlist      |

### PRODUCTS  `/api/products`
| Method | Endpoint    | Access      | Description               |
|--------|-------------|-------------|---------------------------|
| GET    | /           | Public      | Get all (filter/sort/page)|
| GET    | /featured   | Public      | Get featured products     |
| GET    | /:id        | Public      | Get single product        |
| POST   | /           | Admin only  | Create product            |
| PUT    | /:id        | Admin only  | Update product            |
| DELETE | /:id        | Admin only  | Delete product (soft)     |

**Query Parameters:**
```
?category=Women&minPrice=5000&maxPrice=50000
&search=lehenga&sort=newest&page=1&limit=12
&featured=true&newArrival=true
```
Sort options: `newest`, `price-low`, `price-high`, `top-rated`, `popular`

### ORDERS  `/api/orders`
| Method | Endpoint        | Access      | Description          |
|--------|-----------------|-------------|----------------------|
| POST   | /               | Private     | Place new order      |
| GET    | /my-orders      | Private     | My order history     |
| GET    | /:id            | Private     | Get order details    |
| PUT    | /:id/cancel     | Private     | Cancel order         |
| GET    | /               | Admin only  | All orders           |
| PUT    | /:id/status     | Admin only  | Update order status  |

**Order Status Flow:**
`pending` → `confirmed` → `processing` → `shipped` → `delivered`

### PAYMENT  `/api/payment`
| Method | Endpoint        | Access     | Description           |
|--------|-----------------|------------|-----------------------|
| POST   | /create-intent  | Private    | Create Stripe intent  |
| POST   | /confirm        | Private    | Confirm payment       |
| POST   | /webhook        | Stripe     | Stripe webhook        |
| POST   | /refund         | Admin only | Process refund        |

### REVIEWS  `/api/reviews`
| Method | Endpoint          | Access   | Description          |
|--------|-------------------|----------|----------------------|
| POST   | /:productId       | Private  | Add review           |
| GET    | /:productId       | Public   | Get product reviews  |
| PUT    | /:id              | Private  | Update review        |
| DELETE | /:id              | Private  | Delete review        |
| PUT    | /:id/helpful      | Private  | Mark helpful         |

### ADMIN  `/api/admin`  *(Admin only)*
| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| GET    | /dashboard            | Stats & analytics      |
| GET    | /users                | All users              |
| PUT    | /users/:id            | Update user role       |
| DELETE | /users/:id            | Deactivate user        |
| GET    | /reviews              | All reviews            |
| PUT    | /reviews/:id/approve  | Approve/reject review  |

---

## 💾 Database Models

### User
- name, email, password (hashed), phone, role (user/admin)
- avatar, addresses[], wishlist[], isActive

### Product
- name, description, price, discountPrice, category
- images[], sizes[{size, stock}], colors[], fabric
- ratings, numOfReviews, isFeatured, isNewArrival, sku

### Order
- user, orderItems[], shippingAddress, paymentInfo
- itemsPrice, shippingPrice, taxPrice, totalPrice
- orderStatus, trackingNumber, orderNumber

### Review
- user, product, rating (1-5), title, comment
- isVerifiedPurchase, helpful[], isApproved

---

## 💳 Payment Flow (Stripe)

```
1. Frontend: Add items to cart
2. POST /api/orders          → Create order (COD or Stripe)
3. POST /api/payment/create-intent  → Get client_secret
4. Frontend: stripe.confirmPayment(client_secret)
5. POST /api/payment/confirm → Update order to "paid"
```

---

## 🌱 Seed Data Credentials

After running `npm run seed`:
- **Admin:** admin@ktex.com / admin1234
- **User:**  ayesha@test.com / test1234

---

## 🔧 Environment Variables

| Variable              | Description                    |
|-----------------------|--------------------------------|
| PORT                  | Server port (default: 5000)    |
| MONGO_URI             | MongoDB connection string       |
| JWT_SECRET            | JWT signing secret              |
| JWT_EXPIRE            | Token expiry (e.g., 30d)       |
| STRIPE_SECRET_KEY     | Stripe secret key               |
| STRIPE_WEBHOOK_SECRET | Stripe webhook secret           |
| SMTP_*                | Email configuration             |
| CLOUDINARY_*          | Image upload configuration      |

---

## 🛡️ Security Features
- JWT Authentication
- Password hashing (bcrypt, 12 rounds)
- Rate limiting (100 req/15min)
- Helmet.js security headers
- CORS protection
- Input validation
- Admin role protection
- Soft delete (data preserved)

---

*Built for K-TEX Luxury Fashion — Rawalpindi, Pakistan* 🇵🇰
