---
title: Deployment Guide
description: Deploy the website on Firebase App Hosting (recommended) or on your own VPS with Node.js, PM2 and Nginx.
---

## Option A: Firebase App Hosting (recommended)

### 1. Configure `web/apphosting.yaml`

```yaml title="web/apphosting.yaml"
runConfig:
  minInstances: 0        # 1 at launch removes cold starts (small idle cost)
  maxInstances: 10
  concurrency: 80
  cpu: 1
  memoryMiB: 512

env:
  - variable: NEXT_PUBLIC_SITE_URL
    value: https://yourstore.com
    availability: [BUILD, RUNTIME]
  - variable: NEXT_PUBLIC_USE_MOCK
    value: "false"
    availability: [BUILD, RUNTIME]
  - variable: NEXT_PUBLIC_USE_EMULATORS
    value: "false"
    availability: [BUILD, RUNTIME]
  - variable: NEXT_PUBLIC_FIREBASE_API_KEY
    value: AIza…
    availability: [BUILD, RUNTIME]
  # … NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, _PROJECT_ID, _STORAGE_BUCKET, _MESSAGING_SENDER_ID, _APP_ID …
```

### 2. Create the backend and deploy

```bash
cd firebase
npx firebase apphosting:backends:create --project yourstore-1a2b3
#  app root directory: web   ·   live branch: main
```

Every push to `main` deploys automatically. Manual rollout or local deploy: see [Hosting, Domain & SSL](doc:installation/hosting).

### 3. Domain

App Hosting → backend → Settings → **Domains** → add `yourstore.com` and `www.yourstore.com`, create the DNS records, wait for the SSL certificate. Add both to **Authentication → Authorized domains**.

## Option B: Your own VPS

Any Linux server with **Node.js 22** (1 vCPU / 1 GB RAM is enough to start).

```bash
# on the server
git clone git@github.com:<your-org>/yourstore.git && cd yourstore/web
cp .env.example .env.local            # fill in the production values
npm ci
npm run build
npm install -g pm2
pm2 start npm --name yourstore-web -- start -- -p 3000
pm2 save && pm2 startup
```

Nginx reverse proxy with HTTPS (Let's Encrypt):

```nginx title="/etc/nginx/sites-available/yourstore"
server {
    server_name yourstore.com www.yourstore.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/yourstore /etc/nginx/sites-enabled/
sudo certbot --nginx -d yourstore.com -d www.yourstore.com
sudo systemctl reload nginx
```

The Admin Panel deploys the same way from `admin/` on port 3001 (`admin.yourstore.com`).

Update: `git pull && npm ci && npm run build && pm2 restart yourstore-web`.

## After deploying

- Home shows your products (no "DEMO DATA" badge).
- Phone OTP works on the real domain.
- Place and cancel a COD order.
- `https://yourstore.com/pages/privacy` and `/pages/delete-account` load — you need them for Google Play.
