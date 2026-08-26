# Cloudflare Deployment & Custom Domain Guide — v1.0.0

**Platform**: Cloudflare Pages (Frontend) + Cloudflare Workers (Backend API)  
**Production Domain**: `https://disaster.futuregreennet.com`  

---

## 1. Cloudflare Pages Deployment (Frontend)

1. **Project Creation**:
   - Create a Cloudflare Pages project named `thailand-disaster-watch`.
   - Connect Git repository: `https://github.com/TheSor55/thailand-disaster-watch`.
   - Production branch: `main`.
2. **Build Settings**:
   - Framework preset: `None` / `Vite`.
   - Build command: `pnpm build:web` (or `npm run build:web`).
   - Build output directory: `dist/web`.
   - Node.js version: `22.x` (set via `NODE_VERSION=22.14.0` environment variable).
3. **Environment Variables**:
   - `VITE_PUBLIC_APP_ORIGIN`: `https://disaster.futuregreennet.com`
   - `VITE_API_BASE_URL`: `https://disaster.futuregreennet.com/api` (or Worker route URL)

---

## 2. Cloudflare Worker Deployment (API Gateway)

1. **Worker Name**: `thailand-disaster-watch-api`
2. **Build & Deploy Command**:
   ```bash
   pnpm build:worker
   npx wrangler deploy
   ```
3. **Worker Routes / Custom Domain Bindings**:
   - Route: `disaster.futuregreennet.com/api/*`
4. **Worker Secrets Configuration** (Set via `wrangler secret put <KEY>`):
   - `TMD_UID`: Optional pilot credential
   - `TMD_UKEY`: Optional pilot credential
   - `GISTDA_API_KEY`: Optional pilot credential
5. **Worker Environment Variables**:
   - `WEATHER_SITUATION_PIPELINE_ENABLED`: `false` (default)
   - `RADAR_PREVIEW_ENABLED`: `false` (default)
   - `RAINVIEWER_PILOT_ENABLED`: `false` (default)
   - `TMD_PILOT_ENABLED`: `false` (default)
   - `OPEN_METEO_PILOT_ENABLED`: `false` (default)
   - `GISTDA_PILOT_ENABLED`: `false` (default)

---

## 3. Custom Domain & DNS Configuration

1. In Cloudflare Dashboard, navigate to the Pages project `thailand-disaster-watch` → **Custom domains**.
2. Add custom domain: `disaster.futuregreennet.com`.
3. Cloudflare automatically sets up the CNAME DNS record and provisions the SSL/TLS certificate.
4. Verify HTTPS certificate active with TLS 1.3.

---

## 4. Rollback Strategy

1. **Cloudflare Pages Instant Rollback**:
   - In Cloudflare Pages dashboard → Deployments → Select the previous successful deployment → Click **Rollback to this deployment**.
2. **Git Rollback**:
   - Checkout the previous release commit / tag: `git checkout v1.0.0` or previous commit SHA.
