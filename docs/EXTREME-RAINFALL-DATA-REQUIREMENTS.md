# Extreme Rainfall & Reservoir Exposure Data Requirements

This document outlines the data requirements and planned architecture for modeling return-period rainfall risks and reservoir/upstream relationships in future phases.

## 1. Extreme Rainfall & Return Periods
The platform plans future support for mapping return-period rainfall risks (e.g. 10-year, 25-year, 50-year, and 100-year events).

### Required Input Datasets
1. **IDF (Intensity-Duration-Frequency) Curves**: Stated officially by TMD for different meteorological zones in Thailand.
2. **Historical Maximums**: Daily and sub-daily rainfall records spanning at least 30-50 years to compute statistical probability distributions.
3. **Spatial Return Period Maps**: Authoritative gridded raster or shapefile assets defining extreme boundaries.

### Safety Limits
- No speculative return period estimates or IDF computations will be performed by the client application.
- All risk assessments must map back to an officially verified regional dataset or official government release.

---

## 2. Dam / Upstream exposure mapping
To trace potential exposures from upstream reservoirs down to client sites, we require the following structural data.

### Planned Downstream Relationship Graph
```text
Reservoir / Dam (EGAT/RID)
  └─► Downstream River Channel (RID)
        └─► Province / Site Exposure (Geofenced assets)
```

### Data Requirements
1. **Hydro-geographic station markers**: Geographic positions of dams and corresponding downstream gauging stations to map river channels.
2. **Channel Capacity Limits**: Maximum water flow/discharge thresholds ($m^3/s$) before banks are breached, as verified by RID.
3. **Digital Elevation Models (DEM)**: Verified elevation contour lines around downstream communities.

### Safety Limits
- The system **will not predict** water travel time, arrival time, or flood extent models.
- The system **will not issue** automated evacuation notices or perform hydraulic simulation.
- Dam releases and river telemetry serve as advisory signals; evacuations require official warnings from competent authorities (TMD/DDPM).
