# Radar Preview Architecture (Phase 3.4)

## 1. Overview
The Radar Preview subsystem displays recent sensor-derived precipitation reflectance on the MapLibre GIS map without altering the deterministic Weather Situation question-answering pipeline or generating operational warnings.

```mermaid
flowchart TD
    subgraph External["External Services"]
        RV["RainViewer Public API<br>(api.rainviewer.com)"]
        CDN["RainViewer Tile CDN<br>(tilecache.rainviewer.com)"]
    end

    subgraph Worker["Cloudflare Worker Gateway"]
        AuthGate{"RADAR_PREVIEW_ENABLED<br>& RAINVIEWER_PILOT_ENABLED<br>== true?"}
        DemoGen["Demo Frame Generator<br>(Deterministic 10m intervals)"]
        Fetcher["RainViewer Adapter<br>(Validates timestamps,<br>discards nowcast)"]
        Route["GET /api/radar/frames?mode=DEMO|LIVE"]
    end

    subgraph Frontend["Web Application (Client)"]
        Svc["src/services/radar.ts"]
        State["App State (showRadar: default OFF)"]
        Panel["RadarControlPanel<br>(Timeline, Play/Pause, Opacity)"]
        Map["MapLibre Raster Layer<br>(radar-raster-layer)"]
    end

    RV -->|Fetch weather-maps.json| Fetcher
    Route --> AuthGate
    AuthGate -->|Disabled or DEMO| DemoGen
    AuthGate -->|Enabled & LIVE| Fetcher
    DemoGen --> Route
    Fetcher --> Route

    Route --> Svc
    Svc --> State
    State --> Panel
    State --> Map
    CDN -->|Load XYZ Raster Tiles| Map
```

---

## 2. Safety Controls & Invariants

1. **Classification**:
   - Radar frames are tagged strictly as `OBSERVED_REMOTE_SENSING`.
   - Never tagged as `OFFICIAL_WARNING`, `MODEL_FORECAST`, or `NOWCAST`.
2. **Default Layer State**:
   - The radar layer is **OFF by default** on initial map load.
3. **Safety Gates**:
   - `RADAR_PREVIEW_ENABLED=false`
   - `RAINVIEWER_PILOT_ENABLED=false`
   - `realDataConnected=false`
   - `operationalUseApproved=false`
4. **Strictly Forbidden in Phase 3.4**:
   - No optical flow, motion prediction, storm tracking, or extrapolation.
   - No rain arrival ETA calculation.
   - No automated storm alert generation.
5. **Attribution & Transparency**:
   - Mandatory attribution string and link rendered in control panel and MapLibre attribution container.
   - Coverage warning: `COVERAGE MAY BE INCOMPLETE` displayed prominently.
