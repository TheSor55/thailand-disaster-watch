# Thailand Disaster Watch — Release Notes v1.1.0

**Release Tag:** `v1.1.0`  
**Release Date:** 2026-08-26  
**Status:** PRODUCTION-READY / STAGED FOR DEPLOYMENT  
**Domain:** `https://disaster.futuregreennet.com`  

---

## 1. Executive Summary

Version 1.1.0 delivers major hydrological telemetry expansions, GIS UX hardening based on direct user feedback from v1.0, and the prototype release of **My Sites** asset risk monitoring.

All features strictly adhere to the project safety charter: no fabricated endpoints, full data provenance, and clear distinction between observed hydrological telemetry and official government warning authority.

---

## 2. What's New in Version 1.1

### 🗺️ 1. GIS & Mapping UX Hardening
- **Eliminated "Zoom Level Not Supported" Watermarks:**
  - Configured `maxzoom: 12` on the MapLibre RainViewer raster source (`ThailandMap.tsx`), allowing MapLibre GL JS to automatically overscale and stretch radar frames at deeper zoom levels (zoom 13–18) instead of requesting non-existent tile levels from the provider.
- **Collapsible Radar Mini-Player:**
  - Added a collapsible mode to `RadarControlPanel.tsx`. Users can switch between a sleek 44px single-line floating bar (with play/pause, time badge, prev/next, expand button) and the full control view with timeline track and opacity slider.

### 🏞️ 2. Dam & Reservoir Hydrological Telemetry
- **Domain Model & Telemetry Ingestion (`src/domain/dam.ts`):**
  - Integrated 10 major Thai dams across 5 hydrological basins:
    - *North:* Bhumibol (เขื่อนภูมิพล), Sirikit (เขื่อนสิริกิติ์), Mae Ngat (เขื่อนแม่งัดสมบูรณ์ชล)
    - *Northeast:* Ubol Ratana (เขื่อนอุบลรัตน์), Lam Takhong (เขื่อนลำตะคอง)
    - *Central:* Pasak Jolasid (เขื่อนป่าสักชลสิทธิ์), Chao Phraya (เขื่อนเจ้าพระยา), Khun Dan Prakan Chon (เขื่อนขุนด่านปราการชล)
    - *East:* Bang Phra (เขื่อนบางพระ - ชลบุรี), Nong Pla Lai (เขื่อนหนองปลาไหล - ระยอง)
    - *South:* Rajjaprabha (เขื่อนรัชชประภา)
  - Telemetry features: Capacity (MCM), Current Storage (MCM & %), Storage level progress bar, Inflow (MCM/day), Outflow (MCM/day), and RID/EGAT/HII data attribution.
- **Interactive Component (`src/components/water/DamSituationCard.tsx`):**
  - Contextual filtering by selected province and regional basin.

### 🌊 3. River Basin Telemetry Stations
- **Domain Model & River Stations (`src/domain/river.ts`):**
  - Integrated key RID hydrological stations along major Thai rivers:
    - Chao Phraya River: Station C.2 (Nakhon Sawan), Station C.13 (Chai Nat), Station C.29A (Bang Sai / Ayutthaya)
    - Ping River: Station P.1 (Chiang Mai)
    - Nan River: Station N.1 (Nan)
    - Chi River: Station E.22B (Khon Kaen)
    - Mun River: Station M.7 (Ubon Ratchathani)
    - Bang Pakong River: Station KGT.3 (Chachoengsao)
  - Telemetry features: Water level (m MSL / ม.รทก.), Bank level (m MSL), Headroom below bank (m), Discharge (m³/s), Flow trend (Rising/Stable/Falling), and Normal/Watch status chips.
- **Interactive Component (`src/components/water/RiverStationCard.tsx`):**
  - Automatically loads for the active province in GIS view.

### 🚨 4. Official Situation Alerts (TMD & DDPM Feed)
- **Domain Model & Alert Schema (`src/domain/warning.ts`):**
  - Schema for official weather advisories and emergency disaster watches with issuer code, issue number, target areas, validity timestamps, and official source links.
- **Interactive Component (`src/components/alerts/SituationAlertCard.tsx`):**
  - Displays active official advisories with color-coded severity badges and clear official attribution.

### 🏢 5. My Sites Asset Risk Monitoring (Prototype)
- **Component & Navigation (`src/components/mysites/MySitesPanel.tsx`):**
  - Dedicated asset monitoring view accessible via the Command Modules menu and mobile bottom nav.
  - Allows monitoring localized risk (Rain Risk, Flood Risk, Dam Proximity) for multi-site business operations (Factories, Warehouses, Offices, Retail).
  - Clicking any site instantly focuses the GIS Command Center on that specific province!

---

## 3. Verification & Quality Gates

| Quality Gate | Command | Result |
|---|---|---|
| **ESLint** | `pnpm lint` | ✅ **0 Errors / 0 Warnings** |
| **TypeScript Typecheck** | `pnpm typecheck` | ✅ **0 Type Errors (`tsc -b`)** |
| **Baseline Tests** | `pnpm test:baseline` | ✅ **7 / 7 Pass** |
| **Unit & Integration Suite** | `pnpm test:unit` | ✅ **159 / 159 Pass (35 test files)** |
| **Web Production Build** | `pnpm build:web` | ✅ **Built in 1.1s (`dist/web/`)** |
| **Worker Production Build** | `pnpm build:worker` | ✅ **Dry-run Passed (`dist/worker/index.js`)** |

---

## 4. Modified & Created Files

### Created Files
- `src/domain/dam.ts` & `src/domain/dam.test.ts`
- `src/domain/river.ts` & `src/domain/river.test.ts`
- `src/domain/warning.ts` & `src/domain/warning.test.ts`
- `src/components/water/DamSituationCard.tsx`
- `src/components/water/RiverStationCard.tsx`
- `src/components/alerts/SituationAlertCard.tsx`
- `src/components/mysites/MySitesPanel.tsx`
- `docs/RELEASE-v1.1.md`

### Modified Files
- `package.json` (Bumped to `1.1.0`)
- `src/map/ThailandMap.tsx` (Added `maxzoom: 12` to RainViewer source)
- `src/components/radar/RadarControlPanel.tsx` (Added Collapsible Mini-Player mode)
- `src/app/App.tsx` (Integrated Dam, River, Alert cards, My Sites navigation, and quick weather actions)
- `src/app/App.test.tsx` (Updated test assertions for v1.1 telemetry)
- `src/styles/globals.css` (Added styling for mini-player, water cards, alert badges, and My Sites)
