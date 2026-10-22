---
title: Deployment Guide
description: Deploy the website on Firebase App Hosting (server-rendered Next.js) from GitHub or from your local source, connect your domain, or run it on your own VPS.
---

The website is a **server-rendered** Next.js app. `/`, `/menu` and `/order` render per request, and the `/api/*` proxy routes run on the server. It therefore needs a Node.js runtime. It **cannot** be exported as static files to plain Firebase Hosting.

## Option A: Firebase App Hosting (recommended)

App Hosting builds the site with Cloud Build and runs it on Cloud Run. The project must be on the **Blaze** plan.

:::note Region
App Hosting has no Mumbai (`asia-south1`) region. Use **`asia-southeast1`** (Singapore), the closest one. The backend API stays in `asia-south1`, and the website calls it server-to-server.
:::

### 1. Configure `website/apphosting.yaml`

Set your API host and your public domain ([Configuration](doc:web/configuration#website-environment)):

```yaml title="website/apphosting.yaml"
runConfig:
  minInstances: 0
  maxInstances: 4
  cpu: 1
  memoryMiB: 512

env:
  - variable: ADMIN_API_URL
    value: https://yourrestaurant-1a2b3.web.app
    availability: [RUNTIME]
  - variable: NEXT_PUBLIC_SITE_URL
    value: https://www.yourrestaurant.com
    availability: [BUILD, RUNTIME]
```

### 2. Create the backend (once)

```bash
cd website
firebase login
firebase apphosting:backends:create --project yourrestaurant-1a2b3 \
  --backend yourrestaurant-web --primary-region asia-southeast1
```

The CLI asks whether to connect a GitHub repository:

- **Connect GitHub** → choose the repository, root directory `website` and live branch `main`. Every push to `main` then builds and rolls out automatically.
- **Skip GitHub** → deploy from your local source (step 3).

### 3. Deploy from local source

`website/firebase.json` maps the folder to the backend, and `website/.firebaserc` selects the project:

```json title="website/firebase.json"
{
  "apphosting": [
    {
      "backendId": "yourrestaurant-web",
      "rootDir": ".",
      "ignore": ["node_modules", ".git", ".next", ".env", "firebase-debug.log"]
    }
  ]
}
```

```json title="website/.firebaserc"
{ "projects": { "default": "yourrestaurant-1a2b3" } }
```

The source ships with our backend ID and project in these two files. Replace both with your own, using the same `backendId` you created in step 2.

```bash
cd website
firebase deploy --only apphosting
```

The CLI uploads the folder (without `node_modules`, `.next` and `.env`), builds it and rolls it out. The site is then live at `https://yourrestaurant-web--yourrestaurant-1a2b3.asia-southeast1.hosted.app`.

### 4. Custom domain

Firebase console → **App Hosting** → your backend → **Settings → Domains** → **Add custom domain** → `www.yourrestaurant.com` (and the apex domain if you want it). Create the DNS records it shows at your registrar and wait for the SSL certificate (minutes to a few hours).

Then:

1. Set `NEXT_PUBLIC_SITE_URL` to the domain in `apphosting.yaml` and deploy again (the value is baked in at build time).
2. Set `WEBSITE_URL` on the backend to the same domain, so table QR codes point to it, and redeploy the function ([Environment Configuration](doc:installation/environment-configuration)).
3. Use the same domain as `SITE_ORIGIN` in the mobile app ([API Configuration](doc:app/api-configuration)).
4. Allow the domain in your Razorpay / Stripe dashboards if they restrict domains.

See also [Hosting, Domain & SSL](doc:installation/hosting).

## Option B: Your own VPS

Any Linux server with **Node.js 22** works (1 vCPU / 1 GB RAM is enough to start).

```bash
# on the server
git clone git@github.com:<your-org>/yourrestaurant.git && cd yourrestaurant/website
cat > .env.local <<'EOF'
ADMIN_API_URL=https://yourrestaurant-1a2b3.web.app
NEXT_PUBLIC_SITE_URL=https://www.yourrestaurant.com
EOF
npm ci
npx next build
npm install -g pm2
pm2 start npx --name yourrestaurant-web -- next start -p 3000
pm2 save && pm2 startup
```

(`npm start` runs `next start -p 20133`. Use it if you prefer that port.)

Nginx reverse proxy with HTTPS (Let's Encrypt):

```nginx title="/etc/nginx/sites-available/yourrestaurant"
server {
    server_name yourrestaurant.com www.yourrestaurant.com;
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
sudo ln -s /etc/nginx/sites-available/yourrestaurant /etc/nginx/sites-enabled/
sudo certbot --nginx -d yourrestaurant.com -d www.yourrestaurant.com
sudo systemctl reload nginx
```

Update: `git pull && npm ci && npx next build && pm2 restart yourrestaurant-web`.

The backend and the Admin Panel stay on Firebase. The VPS only serves the website.

## After deploying

- [ ] `/menu` shows your dishes, not the sample menu
- [ ] A take-away order with **Schedule Later** reaches Admin → Orders
- [ ] A table QR (`/order?table=<code>`) opens the table banner, and the order opens the table on the Live Floor
- [ ] A booking reaches Admin → Reservations, and the confirmation email arrives
- [ ] `https://www.yourrestaurant.com/privacy` loads (Google Play needs it)
- [ ] `https://www.yourrestaurant.com/sitemap.xml` lists your domain, not `localhost`

**Next:** [API Overview →](doc:api/overview)
