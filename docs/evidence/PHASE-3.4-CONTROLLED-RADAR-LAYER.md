# Evidence: Phase 3.4 — Free Radar Source Feasibility & Controlled Radar Layer

**Project**: Thailand Disaster Watch  
**Phase**: 3.4  
**Date**: 2026-08-26  
**Platform**: FutureGreen Disaster Intelligence Platform  
**Lead Developer**: Sorawit Suwannarong  

---

## 1. Candidate Audit & Selection Summary
- **Audited Candidates**:
  1. **RainViewer Free Weather Maps API**: Verified ($0 cost, explicit timestamps, documented tile template, non-commercial web use with attribution). **Selected for Pilot**.
  2. **TMD Official Radar Snapshots**: Rejected for automated XYZ tile layer due to lack of dynamic tile endpoints.
  3. **Windy Professional Radar API**: Rejected (Cost rule and licensing constraints).
- **Classification**: `OBSERVED_REMOTE_SENSING`
- **Safety Gate Defaults**:
  - `RADAR_PREVIEW_ENABLED=false`
  - `RAINVIEWER_PILOT_ENABLED=false`
  - `realDataConnected=false`
  - `operationalUseApproved=false`

---

## 2. Architecture & Components
- **Backend Worker**:
  - `worker/src/providers/rainviewer/client.ts`
  - `worker/src/providers/rainviewer/types.ts`
  - `worker/src/providers/rainviewer/errors.ts`
  - Route: `GET /api/radar/frames?mode=DEMO|LIVE`
- **Frontend Services & Components**:
  - `src/domain/radar.ts`
  - `src/services/radar.ts`
  - `src/components/radar/RadarControlPanel.tsx`
  - `src/components/LayerControl.tsx` (toggle radar layer, default OFF)
  - `src/map/ThailandMap.tsx` (MapLibre raster layer `radar-raster-layer`)
  - `src/app/App.tsx` (state management, default OFF)

---

## 3. Automated Quality Verification

| Check | Tool / Command | Result |
|---|---|---|
| Lint | `npx eslint .` | PASS (0 errors, 0 warnings) |
| Typecheck | `npx tsc --noEmit` | PASS (0 errors) |
| Baseline Tests | `node --test tests/project-baseline.test.mjs` | PASS (7/7 tests) |
| Vitest Unit Tests | `npx vitest run` | PASS (30 test files, 134 tests) |
| Web Production Build | `npm run build:web` | PASS (`dist/web` built) |
| Worker Dry-Run Bundle | `npm run build:worker` | PASS (`dist/worker` validated) |
| Git Whitespace Check | `git diff --check` | PASS (0 issues) |
