# K-TEX Frontend

React + Vite storefront for [ktexstore.com](https://ktexstore.com).

Deploy on **Vercel**. API runs separately on Hostinger.

## Setup

```bash
npm install
cp .env.example .env.local
# Set VITE_API_URL to your Hostinger API URL
npm run dev
```

## Deploy to Vercel

1. Push this folder to its own GitHub repo
2. Import repo in [Vercel](https://vercel.com)
3. Framework: **Vite**
4. Add environment variables from `.env.example`
5. Deploy

Set custom domain: `ktexstore.com`

## Environment variables (Vercel)

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://api.ktexstore.com` |
| `VITE_FIREBASE_*` | Firebase client config |
