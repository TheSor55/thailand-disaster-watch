# Radar Source Feasibility & Candidate Audit (Phase 3.4)

## 1. Candidate Evaluation Matrix

| Source Candidate | Endpoint / Type | Cost | Public / Web Display Rights | Mandatory Attribution | Frame Timestamp | Thailand Coverage | Classification | Status |
|---|---|---|---|---|---|---|---|---|
| **RainViewer Free Weather Maps API** | Public JSON metadata (`api.rainviewer.com`) + CDN raster XYZ tiles (`tilecache.rainviewer.com`) | **$0** (Free tier) | Permitted with strict attribution and link back | `"Weather radar data by RainViewer"` + link to `https://www.rainviewer.com/` | Verified (epoch seconds per scan frame in `radar.past`) | Global mosaic including Thai TMD Doppler stations ingested | `PARTIAL` (Approved for Controlled Preview) | **SELECTED (Phase 3.4 Pilot)** |
| **TMD Official Radar (Web Snapshots)** | Static JPG/GIF graphics per station (Omnoi, Suvarnabhumi, Chiang Mai, etc.) | $0 (Public portal) | Government public data, but no automated XYZ raster tile API | TMD attribution | Embedded in raster image | Nationwide station network | `RESTRICTED / UNKNOWN` | **REJECTED for direct GIS tile layer** |
| **Windy Professional Radar API** | Private/Commercial API | Paid plan required | Requires commercial subscription | Windy attribution | N/A | Global | `RESTRICTED` | **REJECTED (Hard Cost Rule & Project Policy)** |
| **OpenWeatherMap Weather Maps 2.0 (Radar)** | REST / Tile API | Paid tier required for live radar | Requires paid API key | OWM attribution | Variable | Global | `RESTRICTED` | **REJECTED (Hard Cost Rule)** |

---

## 2. Selected Candidate Deep Dive: RainViewer

### 2.1 API Contract
- **Metadata API**: `GET https://api.rainviewer.com/public/weather-maps.json`
- **Tile URL Template**: `https://tilecache.rainviewer.com/v2/radar/{time}/256/{z}/{x}/{y}/2/1_1.png`
  - `{time}`: Valid Unix epoch timestamp from `radar.past` list
  - `256`: Tile size (256x256)
  - `2`: Color scheme (Universal blue-green-yellow-red)
  - `1_1`: Smooth = 1, Snow mask = 1

### 2.2 Licensing & Attribution Terms
- **License**: Free non-commercial web use allowed with clear attribution.
- **Attribution Format**: "Weather radar data by RainViewer" with a live hyperlink to `https://www.rainviewer.com/`.
- **Commercial Deployment**: Requires commercial license review prior to Phase 8 production launch.

### 2.3 Frame Timestamp Semantics
- Every frame from `radar.past` has an exact observation epoch timestamp.
- **Strict Rule**: Frames without valid numeric timestamps are discarded. `retrievedAt` is never substituted for `frameTime`.
- **Nowcasting Discard**: The `radar.nowcast` array is strictly ignored and discarded in Phase 3.4.

### 2.4 Coverage & Geographic Accuracy
- RainViewer composites Doppler radar feeds into a global mosaic.
- Thailand has active radar stations composited (e.g. Bangkok Metro, Central, Northern, Southern).
- **Limitation**: Radar shadows and gap areas exist in border/mountainous areas. The UI explicitly presents: `COVERAGE MAY BE INCOMPLETE`.

---

## 3. Audit Decision
- **RainViewer** is selected as the sole candidate for Phase 3.4 Controlled Development Preview.
- Safety flags `RADAR_PREVIEW_ENABLED=false` and `RAINVIEWER_PILOT_ENABLED=false` remain default `false`.
