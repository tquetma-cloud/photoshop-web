# Photoshop

Photo-sharing site: trending feed, likes/comments, in-browser photo editor (crop, filters, resize), albums with share links.
Stack: Next.js 14 (App Router) · TypeScript · Tailwind · PostgreSQL + Prisma · Cloudflare R2 (S3 API) · Zod · jose + bcrypt sessions.

## Requirements
Node 18.18+, PostgreSQL 14+, a Cloudflare R2 bucket.

## Setup
1. `npm install`
2. `cp .env.example .env` and fill in values (see below).
3. `npx prisma migrate dev --name init` (creates the tables)
4. `npm run dev` → http://localhost:3000

## Environment variables
| Name | How to get it |
|---|---|
| DATABASE_URL | Your Postgres connection string |
| SESSION_SECRET | `openssl rand -base64 32` |
| NEXT_PUBLIC_SITE_URL | Your public URL (http://localhost:3000 locally) |
| R2_ACCOUNT_ID | Cloudflare dashboard → R2 → Account ID |
| R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY | R2 → Manage API tokens → Object Read & Write |
| R2_BUCKET | Bucket name |
| R2_PUBLIC_URL | Bucket → Settings → Public access (r2.dev URL or custom domain), no trailing slash |

### R2 CORS (required for browser uploads)
Bucket → Settings → CORS policy:
```json
[{ "AllowedOrigins": ["http://localhost:3000", "https://YOUR-DOMAIN"], "AllowedMethods": ["PUT", "GET"], "AllowedHeaders": ["Content-Type"], "MaxAgeSeconds": 3600 }]
```

## Scripts
`npm run lint` · `npm run typecheck` · `npm run build` · `npm run db:deploy` (production migrations)

## Deploy
Vercel or any Node host: set the env vars, run `npm run db:deploy`, then `npm run build && npm start`.

## Status
Done: register/login/logout, sessions, feed (trending/newest, search, pagination), likes, comments, upload + editor, albums, public share links, SEO (metadata, sitemap, robots), rate limits, origin check.
Not done / known limits:
- Not yet installed, built or run: code is unverified. Run install, typecheck, build and test the flows first.
- No password reset, email verification, or admin dashboard (the `role` field exists but is unused).
- Rate limiter is in-memory (single instance); use Redis/Upstash when scaling.
- Presigned uploads do not enforce size server-side; size is validated at request time and by the R2 bucket limits. Consider an image-processing/moderation step before going public.
- No delete/edit for posts or comments, no report/moderation tools yet.
