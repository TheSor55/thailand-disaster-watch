# Local Development & Weather Preview Guide (Phase 3.2)

This guide provides instructions for starting, configuring, and testing Thailand Disaster Watch in a secure local development environment.

---

## 1. Prerequisites

- **Node.js**: `v22.13.0` or newer
- **Package Manager**: `pnpm` (version 10 or 11)

---

## 2. Quick Local Startup

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Start the Web Application
```bash
pnpm dev
```
The application will start at:
```
http://localhost:3000
```

---

## 3. Data Modes & Testing

### Mode A: DEMO PREVIEW (Default)
- **Zero Configuration Required**: Works immediately out-of-the-box.
- **Zero Network Calls**: Does not make any requests to external providers or Worker endpoints.
- **Deterministic Fixtures**: Renders verified sample observations and forecast models.
- **Prominent Labels**: Labeled as `DEMO DATA · DEVELOPMENT PREVIEW · NOT OPERATIONAL`.

### Mode B: CONTROLLED LIVE PREVIEW (Optional Local Test)
In this mode, the application routes requests through the local Cloudflare Worker API (`http://localhost:8787/api/situation/weather`), which contacts:
- **TMD** for observed weather (`OBSERVED`)
- **Open-Meteo** for numerical weather predictions (`MODEL_FORECAST`)

#### How to Enable Controlled Live Preview in Local Dev:

1. Create a local secrets file in the worker directory (this file is gitignored):
   ```bash
   # worker/.dev.vars (DO NOT COMMIT)
   WEATHER_SITUATION_PIPELINE_ENABLED=true
   TMD_PILOT_ENABLED=true
   OPEN_METEO_PILOT_ENABLED=true
   TMD_API_KEY=your_tmd_uid_or_key_here
   ```

2. Start the Cloudflare Worker in a separate terminal:
   ```bash
   npx wrangler dev worker/src/index.ts --port 8787
   ```

3. In the web application at `http://localhost:3000`, switch the Data Mode toggle to:
   `2. CONTROLLED LIVE PREVIEW`

4. Select a location preset (e.g. Bangkok, Chiang Mai, Khon Kaen, Phuket, Hat Yai) or enter custom coordinates.

---

## 4. Operational Safety Invariants

Even when Controlled Live Preview is active:
- `realDataConnected=false` (Hardcoded closed in domain models)
- `operationalUseApproved=false` (Hardcoded closed in domain models)
- **No Direct Browser Calls**: All external provider communications MUST flow through the Cloudflare Worker API.
- **No Silent Fallback**: If the Worker pipeline is disabled or fails, the application explicitly displays `LIVE PREVIEW UNAVAILABLE` with an option to switch back to Demo Mode. It never silently substitutes fixture data under a live label.

---

## 5. Stopping the Application

Press `Ctrl + C` in both terminal windows to gracefully terminate Vite and Wrangler development servers.
