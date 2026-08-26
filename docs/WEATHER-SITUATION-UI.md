# Weather Situation UI Architecture & Safe Preview (Phase 3.1)

## Overview

The Weather Situation UI provides a structured, multi-source weather preview for Thailand Disaster Watch. It demonstrates how official observations (TMD) and numerical weather predictions (Open-Meteo) are rendered side-by-side with clear separation, strict provenance, data freshness, and safety disclaimers.

## Safety Status & Gate Guarantees

In Phase 3.1:
- `WEATHER_SITUATION_PIPELINE_ENABLED=false` (by default)
- `GISTDA_PILOT_ENABLED=false`
- `realDataConnected=false`
- `operationalUseApproved=false`

When the pipeline gate is disabled, the client UI adapter gracefully falls back to a deterministic, labeled fixture with an explicit `DEMO / PREVIEW` banner. No live requests are made to unapproved external endpoints from the client browser.

## Component Architecture

```
src/
├── app/
│   └── App.tsx                             # Top-level application with module navigation, header branding, and routing
├── components/
│   └── weather/
│       ├── PreviewBadge.tsx                # Prominent "DEVELOPMENT PREVIEW / NOT OPERATIONAL" warning
│       ├── ObservedWeatherCard.tsx         # Card A: Observed TMD data ("ตอนนี้มีฝนไหม?") — OBSERVED ONLY
│       ├── ForecastWeatherCard.tsx         # Cards B & C: 1h / 3h forecast ("อีก 1/3 ชั่วโมงมีแนวโน้มฝนไหม?") — MODEL_FORECAST ONLY
│       ├── SourcePanel.tsx                 # Card D: Provenance, timestamps, freshness, and attribution
│       ├── AgreementPanel.tsx              # Source consistency analysis & limitations
│       ├── FreshnessBar.tsx                # Freshness state indicators (FRESH, DELAYED, STALE, UNAVAILABLE, UNKNOWN)
│       ├── ClassificationGuide.tsx         # Semantic dictionary of data classifications
│       └── SystemGatePanel.tsx             # Read-only developer panel showing system gate statuses
├── features/
│   └── weather/
│       ├── WeatherSituationPage.tsx        # Main Weather Situation Page view
│       └── WeatherSituationPage.test.tsx   # Comprehensive Vitest component tests
├── pages/
│   └── AboutPage.tsx                       # Project identity & Sorawit Suwannarong developer attribution
├── services/
│   └── weatherSituation.ts                 # Safe UI Client Adapter (isolates components from raw API calls)
└── styles/
    └── globals.css                         # Dark/Light responsive design tokens & styling
```

## Non-Negotiable Semantic Rules

1. **Card A (Observed)** uses strictly `OBSERVED` readings from TMD stations. If observation is unavailable, it explicitly displays an unavailable notice. It NEVER falls back to forecast data.
2. **Cards B & C (Forecast)** use strictly `MODEL_FORECAST` from numerical models. It never uses absolute definitive phrasing ("ฝนจะตก"), instead using probabilistic phrasing ("มีแนวโน้มฝน", "แบบจำลองคาดการณ์โอกาสเกิดฝน X%").
3. **Card D (Sources)** details each provider's source type, observation/validity timestamps, retrieval timestamp, and freshness.
4. **Attribution & Identity**: Prominently acknowledges FutureGreen Disaster Intelligence Platform and Lead Developer Sorawit Suwannarong.
