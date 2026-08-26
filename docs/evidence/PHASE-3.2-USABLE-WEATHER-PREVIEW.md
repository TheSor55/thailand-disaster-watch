# Phase 3.2 Evidence Log — Usable Weather Preview & Controlled Live Data Mode

## 1. Summary

- **Phase**: 3.2 — Usable Weather Preview & Controlled Live Data Mode
- **Repository**: `TheSor55/thailand-disaster-watch`
- **Branch**: `feature/phase-3.2-usable-weather-preview`
- **Developer / Creator**: Sorawit Suwannarong
- **Platform**: FutureGreen Disaster Intelligence Platform
- **Production Target**: `disaster.futuregreennet.com` (**NOT deployed**)

---

## 2. Safety Invariants Verified

| Gate | Status | Detail |
|---|---|---|
| `WEATHER_SITUATION_PIPELINE_ENABLED` | `false` | Default repository value preserved |
| `GISTDA_PILOT_ENABLED` | `false` | Disabled by default |
| `realDataConnected` | `false` | Hardcoded closed in UI & domain |
| `operationalUseApproved` | `false` | Hardcoded closed in UI & domain |
| Production Deployment | `BLOCKED` | No production deploy or DNS changes |

---

## 3. Implemented Capabilities

1. **Dual Explicit Preview Modes**:
   - `DEMO PREVIEW`: Zero-network deterministic fixture with explicit `DEMO DATA · DEVELOPMENT PREVIEW · NOT OPERATIONAL` branding.
   - `CONTROLLED LIVE PREVIEW`: Controlled Worker pipeline integration with explicit `CONTROLLED LIVE PREVIEW · NOT OPERATIONAL · NOT AN OFFICIAL WARNING` branding.
   - `ModeBadge`: Prominent mode banner ensuring data mode is unambiguously visible.
   - `ModeSelector`: Developer controls for switching modes without affecting production gates.

2. **No Silent Fallback**:
   - If Controlled Live Preview fails or pipeline gate is closed, the UI renders `LIVE PREVIEW UNAVAILABLE` with explicit diagnostic details and an action button to switch to `DEMO PREVIEW`.

3. **Location Selector & Presets**:
   - Verified location presets:
     - Bangkok (`13.7563, 100.5018`)
     - Chiang Mai (`18.7883, 98.9853`)
     - Khon Kaen (`16.4322, 102.8236`)
     - Phuket (`7.8804, 98.3923`)
     - Hat Yai (`7.0084, 100.4767`)
   - Custom coordinate input form with range validation (-90..90, -180..180).
   - URL search parameter synchronization (`?lat=...&lon=...&mode=...`).

4. **UI Help & Explainer**:
   - `WeatherExplainer` ("What am I looking at?"): Collapsible semantics guide covering `OBSERVED`, `MODEL_FORECAST`, `DEMO`, and `CONTROLLED LIVE` definitions.

5. **Local Startup & Developer Ergonomics**:
   - Vite proxy configuration for `/api` routing to local Worker.
   - `docs/LOCAL-PREVIEW-GUIDE.md` local development guide.

---

## 4. Forbidden Features Audit

- Radar layers: **NONE**
- RainViewer SDK/API: **NONE**
- Windy API / widgets: **NONE**
- Proprietary nowcasting algorithms: **NONE**
- Production deployment: **NONE**
