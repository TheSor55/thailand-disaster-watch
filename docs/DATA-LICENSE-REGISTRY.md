# Data license registry

PHASE 1 includes one boundary dataset for navigation and one public raster basemap service for interactive development. Neither contains disaster observations. Approval is scoped to the usage stated below and does not approve operational use or production deployment.

| Dataset | Owner | License/reuse evidence | Attribution | Review date | Reviewer | Status |
|---|---|---|---|---|---|---|
| GISTDA dataset — to be identified | GISTDA | Not yet reviewed | Unknown | — | — | `UNKNOWN` |
| TMD dataset — to be identified | TMD | Not yet reviewed | Unknown | — | — | `UNKNOWN` |
| RID dataset — to be identified | RID | Not yet reviewed | Unknown | — | — | `UNKNOWN` |
| ThaiWater dataset — to be identified | HII/ThaiWater | Not yet reviewed | Unknown | — | — | `UNKNOWN` |
| CCTV dataset — to be identified | To be confirmed | Not yet reviewed | Unknown | — | — | `UNKNOWN` |
| geoBoundaries THA ADM1 simplified boundary, boundary ID `THA-ADM1-36821470`, 77 units, source vintage 2017 | William & Mary geoLab; underlying OpenStreetMap contributors | [geoBoundaries API record](https://www.geoboundaries.org/api/current/gbOpen/THA/ADM1/) identifies gbOpen terms as CC BY 4.0 and the underlying THA source as ODbL 1.0; file pinned to repository commit `9469f09` | `geoBoundaries; © OpenStreetMap contributors` | 2026-08-24 | Project engineering review | `APPROVED` — PHASE 1 boundary navigation only |
| OpenStreetMap Standard raster tiles | OpenStreetMap Foundation / OpenStreetMap contributors | [Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/) permits interactive use subject to attribution, correct URL, caching, referer, and no bulk/offline access | `© OpenStreetMap contributors` linked to copyright page | 2026-08-24 | Project engineering review | `APPROVED` — PHASE 1 interactive development only; production provider review required |

## Boundary artifact

- Repository file: `public/thailand-provinces.geojson`
- Source URL: `https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/THA/ADM1/geoBoundaries-THA-ADM1_simplified.geojson`
- Geometry role: application navigation and map display only.
- Limitation: not an official Thai disaster jurisdiction or authoritative emergency boundary.
- Verification: automated tests require 77 unique `shapeISO` values matching `src/config/regions.ts`.

## Basemap operational restriction

The OpenStreetMap Standard service is best-effort and can block heavy or non-compliant use. The application performs no prefetch, bulk download, or offline tile packaging. Production approval requires a separate availability/capacity decision, even though PHASE 1 development use is recorded above.

Allowed statuses are `APPROVED`, `PENDING`, `UNKNOWN`, and `RESTRICTED`. Scope qualifiers are binding: a PHASE 1 approval does not authorize live-data integration or production deployment. Evidence must be an official or otherwise authorized source; assumptions and copied third-party summaries are insufficient.
