# K-TEX Store - Deployment Guide

## Problem Fixed
`ERR_SSL_PROTOCOL_ERROR` on `api.ktexstore.com` was caused by:
- `vite.config.js` reads ONLY `.env.local` (not `.env`)
- `.env.local` was missing `VITE_API_URL`
- Frontend fell back to `https://api.ktexstore.com` which has no SSL cert
- **Fix:** Added `VITE_API_URL=https://ktexstore.com` to `.env.local`

---

## Option A: Direct Deploy (VPS / Shared Hosting with Node.js)

### 1. Prerequisites
- Ubuntu 22.04 VPS (or similar)
- Node.js 20+ installed
- MongoDB Atlas account (already configured)
- Domain `ktexstore.com` pointing to server IP

### 2. Install Node.js & Nginx
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
node -v  # should show v20.x
```

### 3. Clone & Setup
```bash
cd /var/www
git clone <your-repo> ktexstore
cd ktexstore
npm install
cd ktex-backend && npm install && cd ..
```

### 4. Environment Files
Ensure these files exist on the server:
- `.env.local` → must contain `VITE_API_URL=https://ktexstore.com`
- `ktex-backend/.env` → must contain correct `MONGO_URI`, `JWT_SECRET`, etc.

### 5. Build Frontend
```bash
npm run build
```

### 6. SSL Certificate (Let's Encrypt)
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ktexstore.com -d www.ktexstore.com
```

### 7. Nginx Config
```bash
sudo cp nginx/ktexstore.conf /etc/nginx/sites-available/ktexstore
sudo ln -sf /etc/nginx/sites-available/ktexstore /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. Run Backend with PM2
```bash
sudo npm install -g pm2
pm2 start start.cjs --name ktexstore
pm2 save
pm2 startup
```

### 9. Verify
```bash
curl https://ktexstore.com/api/health
# Should return: {"success":true,"message":"K-TEX API is running!",...}
```

---

## Option B: Docker Deploy

### 1. Prerequisites
- Docker & Docker Compose installed
- Domain `ktexstore.com` pointing to server IP

### 2. Build & Run
```bash
docker-compose up -d --build
```

### 3. SSL with Nginx (on host)
Copy `nginx/ktexstore.conf` to host Nginx, change `proxy_pass` to:
```
proxy_pass http://127.0.0.1:5000;
```
Then:
```bash
sudo certbot --nginx -d ktexstore.com -d www.ktexstore.com
sudo systemctl reload nginx
```

---

## Option C: Quick Fix (No Server Changes)

If you can't access the server right now, just rebuild and redeploy the frontend:

```bash
# Make sure .env.local has VITE_API_URL=https://ktexstore.com
npm run build
# Upload dist/ folder to your hosting
```

The backend server already serves both API + frontend from the same port.
As long as `VITE_API_URL=https://ktexstore.com`, all API calls go to the same domain.

---

## File Changes Summary

| File | Change |
|------|--------|
| `.env.local` | Added `VITE_API_URL=https://ktexstore.com` |
| `src/utils/api.js` | Added retry logic (3 attempts), request timeout (15s), interceptors |
| `ktex-backend/.env` | Production-ready config with `NODE_ENV=production` |
| `nginx/ktexstore.conf` | New - Nginx reverse proxy with SSL termination |
| `Dockerfile` | New - Docker build for production |
| `docker-compose.yml` | New - Docker Compose setup |
| `.dockerignore` | New - Docker ignore patterns |

---

## Admin Credentials
- Email: `abdulwasay@khm.ae`
- Password: `Wasay123`

## API Endpoints
- `GET /api/health` - Health check
- `GET /api/products` - All products
- `GET /api/collections` - All collections
- `GET /api/categories` - All categories
- `POST /api/auth/login` - Admin login
- `POST /api/auth/admin-oauth` - Google OAuth admin login
