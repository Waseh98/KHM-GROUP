# K-TEX API (Backend)

Express + MongoDB API for the K-TEX e-commerce store.

- **Deploy:** Hostinger (Express / Node.js)
- **Frontend:** separate repo → [ktex-frontend](../ktex-frontend) → Vercel

## Setup

```bash
npm install
cp .env.example .env
# Fill in MongoDB, JWT, admin, Firebase credentials
npm run dev
```

API runs at `http://localhost:5001`

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon |
| `npm run create-admin` | Create admin user in DB |
| `npm run seed` | Seed sample data |

## Deploy to Hostinger

See [DEPLOY.md](./DEPLOY.md)

## Environment variables

Copy `.env.example` and fill in all values. **Do not commit `.env`.**

| Variable | Required |
|----------|----------|
| `MONGO_URI` | Yes |
| `JWT_SECRET` | Yes |
| `CLIENT_URL` | Yes — set to `https://ktexstore.com` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Yes |
| `FIREBASE_*` | For Google login |

Do **not** set `PORT` on Hostinger — the platform assigns it.
