# Phase 3.3 Evidence Log — Real User Acceptance Test & UX Refinement

## 1. Summary

- **Phase**: 3.3 — Real User Acceptance Test & UX Refinement
- **Repository**: `TheSor55/thailand-disaster-watch`
- **Branch**: `feature/phase-3.3-user-acceptance-ux-refinement`
- **Developer / Creator**: Sorawit Suwannarong
- **Platform**: FutureGreen Disaster Intelligence Platform
- **Production Target**: `disaster.futuregreennet.com` (**NOT deployed**)

---

## 2. User Journeys Validated

| Journey | Description | Result | Details |
|---|---|---|---|
| **A** | Open app → understand system status | **PASS** | Persistent safety banner `NO_LIVE_DATA`, `DEV PREVIEW` chip, and non-operational disclaimers clearly visible. |
| **B** | Weather Situation → "ตอนนี้มีฝนไหม?" | **PASS** | Strictly displays TMD `OBSERVED` weather station readings. If unavailable, states `"ยังไม่มีข้อมูลฝนสังเกตการณ์ที่ยืนยันได้"` (never substitutes forecast). |
| **C** | "อีก 1 ชั่วโมงมีแนวโน้มฝนไหม?" | **PASS** | Displays Open-Meteo `MODEL_FORECAST` with probabilistic phrasing `"แบบจำลองพยากรณ์คาดการณ์โอกาสเกิดฝน X%"`. |
| **D** | "อีก 3 ชั่วโมงมีแนวโน้มฝนไหม?" | **PASS** | Displays Open-Meteo `MODEL_FORECAST` +3h projection with probabilistic phrasing. |
| **E** | Change city preset | **PASS** | Verified presets (Bangkok, Chiang Mai, Khon Kaen, Phuket, Hat Yai) select instantly and sync with URL. |
| **F** | Enter custom coordinates | **PASS** | Custom lat/lon form validates numerical ranges (-90..90, -180..180) with human-readable error feedback. |
| **G** | Switch Demo ↔ Controlled Live | **PASS** | ModeSelector toggles between `DEMO PREVIEW` and `CONTROLLED LIVE PREVIEW`. No silent fallback when live fails. |
| **H** | Inspect source / timestamp / freshness | **PASS** | SourcePanel and FreshnessBar provide source attribution, observed/valid times, retrieved timestamps, and color-coded status. |
| **I** | Open About → developer & disclaimer | **PASS** | Displays Sorawit Suwannarong attribution, FutureGreen platform details, non-operational status, and back button. |

---

## 3. UX Refinements Applied

1. **Seamless View & Navigation Flow**:
   - Dynamic breadcrumb bar: `[🗺 แผนที่ GIS] › [🌤 สภาพอากาศ]` allowing immediate navigation between views.
   - Dedicated `← กลับไปหน้าแผนที่ GIS` button on Weather Situation and About pages.
   - Isolated workspace: GIS left-rail is cleanly hidden when on Weather Situation or About page to eliminate layout clutter.
   - Mobile Command Module navigation: Added view switcher in mobile drawer and mobile dock.
2. **Touch Target Ergonomics**:
   - Ensured all buttons (`.location-preset-btn`, `.mode-selector__btn`, `.weather-back-btn`, `.weather-explainer__toggle`) meet >= 40–44px touch targets.
3. **Clarity & Language**:
   - Plain-language Thai descriptions alongside technical classification badges (`OBSERVED`, `MODEL_FORECAST`, `DEMO PREVIEW`, `CONTROLLED LIVE PREVIEW`).
   - "What am I looking at?" collapsible semantics guide.

---

## 4. Safety Invariants Preserved

```text
WEATHER_SITUATION_PIPELINE_ENABLED (repo default) = false
TMD_PILOT_ENABLED (repo default) = false
OPEN_METEO_PILOT_ENABLED (repo default) = false
GISTDA_PILOT_ENABLED = false
realDataConnected = false
operationalUseApproved = false
Production Deployment = BLOCKED / NOT DEPLOYED
```

- Direct browser calls to TMD / Open-Meteo = **0 (None)**
- Forbidden features audit: **0 radar / RainViewer / Windy / nowcasting / BCM automated triggers**.
