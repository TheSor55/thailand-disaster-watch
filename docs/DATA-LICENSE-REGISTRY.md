# Data license registry

Review date: **2026-08-24**. Status is scoped to the named resource and use. It does not approve deployment or a different dataset from the same owner.

| Resource | Owner | Evidence / attribution | Approved scope | Status |
|---|---|---|---|---|
| geoBoundaries THA ADM1, boundary ID `THA-ADM1-36821470`, pinned at commit `9469f09` | William & Mary geoLab / OSM contributors | [API record](https://www.geoboundaries.org/api/current/gbOpen/THA/ADM1/): CC BY 4.0; underlying OSM ODbL. Attribution: `geoBoundaries; © OpenStreetMap contributors` | PHASE 1 navigation/display only | `APPROVED` |
| OpenStreetMap Standard raster tiles | OSMF / OSM contributors | [Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/). Attribution: `© OpenStreetMap contributors` | PHASE 1 interactive development; no bulk/offline packaging | `APPROVED_WITH_CONDITIONS` |
| GISTDA flood extent dataset `disasters-03` and Disaster Platform 1/3/7/30-day services | GISTDA | [Dataset record](https://opendata.gistda.or.th/th/dataset/disasters-03) labels `Open Data Common` and public data; [OpenAPI](https://disaster.gistda.or.th/services/open-api?type=flood) documents services. Full license/version, commercial/redistribution permission and mandatory attribution are not stated | Verification and disabled adapter tests only; no data/display/cache/production use | `PENDING` |
| TMD weather/rain/forecast/warning resources | TMD | [Service terms](https://www.tmd.go.th/service/tmdData); commercial/production scope and resource-level terms incomplete | Controlled local technical pilot; no production display | `PENDING — TECHNICAL CONNECTIVITY GATED` |
| Windy Point/Map API services | Windy | [Official Terms](https://api.windy.com/); free testing key outputs scrambled data and restricts production | None / Research Only | `PENDING / RESEARCH ONLY` |
| RID water resources | RID | [Official catalog](https://data.go.th/organization/rid); resource-specific terms incomplete | Controlled local technical pilot; no production display | `PENDING — TECHNICAL CONNECTIVITY VERIFIED` |
| HII/ThaiWater resources | HII | [Official catalog](https://data.go.th/organization/hii); standard documentation is not a reuse license | Audit only | `PENDING` |
| EGAT annual reservoir inflow CSV | EGAT | [Dataset record](https://data.go.th/dataset/volume_of_water_reservoir): CC BY; retain owner/dataset attribution | Historical/reference analytics only; not live monitoring | `APPROVED_WITH_CONDITIONS` |
| EGAT live reservoir situation | EGAT | No verified API reuse contract | Audit only | `PENDING` |
| BMA Bangkok flood-risk/monitoring CSV | BMA | [Official resource](https://data.bangkok.go.th/dataset/risk-flood-bangkok-area/resource/b719945f-f10b-4b4c-afd2-2e8b43d21726); exact terms incomplete | Audit only | `PENDING` |
| DDPM operational warning feed | DDPM | No verified public machine-readable feed or reuse license | None | `UNKNOWN` |
| USGS earthquake event feeds | USGS | [Licensing](https://www.usgs.gov/data-management/data-licensing), [credit](https://www.usgs.gov/information-policies-and-instructions/acknowledging-or-crediting-usgs); attribute USGS and preserve revisions | Future observed-event adapter after operational review | `APPROVED_WITH_CONDITIONS` |
| EMSC Seismic Portal event feed | EMSC | [Terms](https://www.seismicportal.eu/terms.html); production/commercial right not established | None beyond audit/development allowed by applicable terms | `RESTRICTED` |
| GEOFON event feed | GFZ | [Citation guidance](https://geofon.gfz.de/citation/); explicit resource reuse terms incomplete | Audit only | `PENDING` |
| TMD earthquake RSS | TMD | [Official RSS page](https://earthquake.tmd.go.th/rss.html); feed reuse terms incomplete | Audit only | `PENDING` |
| NOAA/PTWC tsunami products/feed | NOAA | Official product pages reviewed; intended machine-feed terms incomplete | Audit only | `PENDING` |
| GDACS API | European Commission / UN partners | [Terms](https://www.gdacs.org/Documents/2025/GDACS_Terms_of_use_Mar_25.pdf); attribution required; model advisory limitations apply | Future external `SYSTEM_ADVISORY`, validated and never an official warning | `APPROVED_WITH_CONDITIONS` |
| Thailand official tsunami machine feed | To be confirmed | No verified contract/license | None | `UNKNOWN` |

Allowed statuses are `APPROVED`, `APPROVED_WITH_CONDITIONS`, `PENDING`, `RESTRICTED`, `UNKNOWN`, and `REJECTED`. A production connection additionally requires security, schema, freshness, operational, and named human approval recorded in the change review.

## GISTDA PHASE 2.5 license record

- Provider / Dataset / Owner: GISTDA / ข้อมูลขอบเขตพื้นที่น้ำท่วม (`disasters-03`) and related Disaster Platform flood services / GISTDA.
- Official URL: `https://opendata.gistda.or.th/th/dataset/disasters-03` and `https://disaster.gistda.or.th/services/open-api?type=flood`.
- License / License Evidence: catalog label `Open Data Common`; complete license text/version not located in reviewed official evidence.
- API Key Required: yes; current OpenAPI uses `API-Key` header.
- Attribution: GISTDA is the verified owner; mandatory wording is `UNKNOWN`.
- Reuse Condition: key registration required; other conditions `UNKNOWN`.
- Public Use: dataset category is public; exact display/redistribution/cache rights require confirmation.
- Commercial Use: `UNKNOWN — DO NOT USE IN PRODUCTION`.
- Verification Date / Reviewer: 2026-08-24 / project engineering review; human approval pending.
- Production Status: `PENDING`.
- Notes: OpenAPI response schema/timestamps/rate/SLA incomplete; catalog and current OpenAPI disagree on key transport. A key-like catalog example was not used and should be rotated/removed by its owner.
- Controlled Pilot Evidence: Worker-only authentication and TMS transport returned HTTP 200 with `image/png` on 2026-08-24. This technical result does not supply missing license evidence and does not change any `UNKNOWN` field or the `PENDING` production status.

## Existing boundary artifact

- Repository: `public/thailand-provinces.geojson`
- Source: `https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/THA/ADM1/geoBoundaries-THA-ADM1_simplified.geojson`
- Role: navigation/display, not an official Thai emergency jurisdiction.
- Automated verification: 77 unique `shapeISO` values match `src/config/regions.ts`.
