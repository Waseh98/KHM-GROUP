# Deploy K-TEX API to Hostinger

## Hostinger settings

| Field | Value |
|-------|-------|
| Framework | Express |
| Entry file | `server.js` |
| Node version | 22.x |
| Package manager | npm |

Upload the repo root (or zip it). **Do not** set an output directory.

## Environment variables

```
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/ktex_db?appName=Cluster0
JWT_SECRET=your_secret
JWT_EXPIRE=7d
CLIENT_URL=https://ktexstore.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

**Do not add `PORT`.**

## MongoDB Atlas

Network Access → allow `0.0.0.0/0` (or Hostinger server IP).

## Subdomain

Create `api.ktexstore.com` and point it to this Node deployment.

## Verify

```
https://api.ktexstore.com/api/health
```

Should return JSON.

## Frontend (Vercel)

The React frontend is a **separate repo**. Deploy it on Vercel and set:

```
VITE_API_URL=https://api.ktexstore.com
```
