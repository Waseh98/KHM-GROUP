---
name: ktex-website
description: Use this skill when user asks anything about K-TEX — frontend pages, backend API, database models, or full-stack ecommerce. K-TEX is a luxury fashion brand in Rawalpindi, Pakistan.
---

# K-TEX — Full Stack E-Commerce

- Brand: K-TEX | Luxury Fashion
- Location: Rawalpindi, Pakistan
- Currency: PKR
- Stack: HTML/CSS/JS + Node.js + Express + MongoDB

---

# FRONTEND

## Design System
- Background: #0D0D0D (black)
- Gold Accent: #B8972A
- Light Gold: #D4AF5A
- Cream: #FAF8F3
- Card BG: #1E1E1E
- Heading Font: Cormorant Garamond (Google Fonts)
- Body Font: Montserrat (Google Fonts)
- Style: Luxury / Premium

## Pages & Sections

### 1. Home
- Full-screen dark hero
- Headline: "Redefine Your Style"
- 2 CTA buttons: "Shop Now" + "View Collections"
- Floating badge: "New Arrivals"

### 2. About Us
- Brand story (Pakistani luxury fashion house)
- 3 stat cards: 500+ Products | 10k+ Customers | 15+ Years
- Brand values: Quality, Elegance, Craftsmanship

### 3. Services
- 6 cards: Custom Tailoring, Bridal Collections,
  Ready-to-Wear, Corporate Uniforms,
  Home Delivery, Free Alterations
- Hover: gold border glow

### 4. Products / Collections
- Filter buttons: All | Men | Women | Bridal | Kids
- 12 product cards with:
  - Image, Name, Category tag
  - Price in PKR, Discount badge
  - Add to Cart button
  - Wishlist heart icon
- Hover: zoom + quick view overlay
- JS filter by category

### 5. Shopping Cart
- Slide-in drawer from right
- Cart icon in navbar with item count badge
- Show items, quantity +/-, remove button
- Subtotal + shipping + total
- Checkout button

### 6. Blog / News
- 3 editorial cards
- Each: image, date, title, excerpt, Read More link

### 7. Clients / Partners
- 8 partner brand names in grid
- 3 customer testimonials with star ratings

### 8. Contact Us
- Left: Address (Rawalpindi), Phone, Email, Hours
- Right: Form (Name, Email, Phone, Subject, Message)
- Gold "Send Message" button with JS validation
- WhatsApp floating button (bottom right, green)

## Global Components
- Fixed navbar: K-TEX logo (gold) + nav links + cart icon
- Smooth scroll between sections
- Scroll fade-in (Intersection Observer)
- Back to top button
- Footer: logo, links, newsletter input, copyright

---

# BACKEND

## Tech Stack
- Runtime: Node.js
- Framework: Express.js
- Auth: JWT (jsonwebtoken) + bcryptjs
- Payment: Stripe
- Images: Cloudinary
- Email: Nodemailer
- Security: Helmet, CORS, express-rate-limit

## File Structure
```
ktex-backend/
├── server.js
├── config/db.js
├── models/         (User, Product, Order, Review)
├── controllers/    (auth, product, order, payment, review, admin)
├── routes/         (auth, product, order, payment, review, user, admin)
├── middleware/     (auth.middleware.js)
└── utils/          (seeder.js)
```

## API Endpoints

### AUTH — /api/auth
- POST   /register          → New user register
- POST   /login             → Login, returns JWT token
- POST   /logout            → Logout
- GET    /me                → Get my profile (protected)
- PUT    /update-profile    → Update name, phone, address
- PUT    /change-password   → Change password
- PUT    /wishlist/:id      → Add/remove from wishlist

### PRODUCTS — /api/products
- GET    /                  → All products (filter/sort/search/page)
- GET    /featured          → Featured products only
- GET    /:id               → Single product detail
- POST   /                  → Create product (admin only)
- PUT    /:id               → Update product (admin only)
- DELETE /:id               → Soft delete (admin only)

Query params: ?category=Women&minPrice=5000&maxPrice=50000
              &search=lehenga&sort=newest&page=1&limit=12
Sort options: newest | price-low | price-high | top-rated | popular

### ORDERS — /api/orders
- POST   /                  → Place new order (protected)
- GET    /my-orders         → My order history (protected)
- GET    /:id               → Order detail (protected)
- PUT    /:id/cancel        → Cancel order (protected)
- GET    /                  → All orders (admin only)
- PUT    /:id/status        → Update status (admin only)

Order Status Flow:
pending → confirmed → processing → shipped → delivered

### PAYMENT — /api/payment
- POST   /create-intent     → Create Stripe payment intent
- POST   /confirm           → Confirm payment, update order
- POST   /webhook           → Stripe webhook listener
- POST   /refund            → Process refund (admin only)

### REVIEWS — /api/reviews
- POST   /:productId        → Add review (protected)
- GET    /:productId        → Get product reviews (public)
- PUT    /:id               → Update review (protected)
- DELETE /:id               → Delete review (protected)
- PUT    /:id/helpful       → Mark helpful (protected)

### ADMIN — /api/admin (admin only)
- GET    /dashboard         → Stats: revenue, users, orders, top products
- GET    /users             → All users list
- PUT    /users/:id         → Update user role/status
- DELETE /users/:id         → Deactivate user
- GET    /reviews           → All reviews
- PUT    /reviews/:id/approve → Approve or reject review

## Auth Header (for protected routes)
Authorization: Bearer <jwt_token>

---

# DATABASE (MongoDB)

## User Model
- name, email, password (hashed), phone
- role: user | admin
- avatar: { public_id, url }
- addresses: [{ label, street, city, province, zipCode, isDefault }]
- wishlist: [ProductId]
- isActive, isEmailVerified
- timestamps (createdAt, updatedAt)

## Product Model
- name, description
- price, discountPrice
- category: Men | Women | Bridal | Kids | Accessories | Sale
- subCategory: Formal | Casual | Traditional | Western
- images: [{ public_id, url }]
- sizes: [{ size, stock }]
- colors: [{ name, hexCode }]
- fabric, brand (default: K-TEX), sku (auto-generated), tags
- ratings, numOfReviews
- isFeatured, isNewArrival, isActive
- createdBy: UserId

## Order Model
- user: UserId
- orderItems: [{ product, name, image, price, size, color, quantity }]
- shippingAddress: { fullName, phone, street, city, province, zipCode, country }
- paymentInfo: { method, status, transactionId, paidAt }
  - method: stripe | cod | jazzcash | easypaisa
  - status: pending | paid | failed | refunded
- itemsPrice, shippingPrice (free above PKR 5000), taxPrice (5%), totalPrice
- orderStatus: pending | confirmed | processing | shipped | delivered | cancelled
- orderNumber (auto: KTEX-ORD-timestamp)
- trackingNumber, notes, deliveredAt

## Review Model
- user: UserId
- product: ProductId
- rating: 1–5
- title, comment
- images: [{ public_id, url }]
- isVerifiedPurchase (true if user bought the product)
- helpful: [UserId]
- isApproved
- One review per user per product (unique index)
- Auto-updates product ratings on save/delete

---

# SEED DATA (npm run seed)
- Admin: admin@ktex.com / admin1234
- User:  ayesha@test.com / test1234
- 6 sample products (Men, Women, Bridal, Kids categories)
