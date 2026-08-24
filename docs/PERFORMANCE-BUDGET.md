# Performance budget — PHASE 2.6

These are engineering review budgets, not device guarantees or provider SLAs. A budget failure requires investigation and an explicit decision; it must not be hidden by changing the number after a build.

| Measure | Engineering review budget | Test method |
|---|---:|---|
| Initial application JavaScript, gzip | 200 kB | Vite production build output, excluding lazy map chunk |
| Largest lazy JavaScript chunk, gzip | 350 kB | Vite production build output |
| First useful render | 3 s | Browser performance trace on declared test device/network |
| Map initialization after lazy load | 4 s | User timing from map request to usable controls |
| Route/region/province switch | 250 ms main-thread task | Browser trace with local boundary data |
| Memory growth | No sustained growth after 20 repeated navigation cycles | Browser heap comparison |

Numeric runtime results are `NOT MEASURED` until the benchmark identifies device/emulator, OS, browser/version, viewport, network/cache state, build commit, and method.

## Bundle audit

Benchmark environment: Windows development workstation, Node 22+, pnpm, Vite production build; filesystem byte sizes and Vite gzip estimates.

| Metric | Before | After |
|---|---:|---:|
| Initial JS | 1,174,510 bytes | 219,379 bytes |
| Initial JS gzip | 316.63 kB | 67.95 kB |
| Largest chunk | 1,174,510 bytes | 960,143 bytes lazy map chunk (250.46 kB gzip) |
| Source map | 2,967,356 bytes | disabled for production build |

Initial JavaScript reduction: 955,131 bytes (81.32%); gzip estimate reduction: 248.68 kB (78.54%). CSS changed from 106,168 to 108,641 bytes due to safety, health, error, viewport, safe-area, and touch-target rules. The lazy MapLibre chunk remains above Vite's 500 kB raw warning but is below the largest-lazy-chunk gzip review budget; further arbitrary splitting was not used because it would not reduce MapLibre transfer or parsing cost.

Evidence-based change: MapLibre and the map component are loaded through a dynamic import, while route/navigation and safety UI remain in the initial application chunk. No geographic geometry was simplified.

## GIS audit

- Pinned Thailand ADM1 GeoJSON: 1,009,970 bytes, 77 features, 35,548 coordinate pairs.
- The boundary remains local and unchanged; accuracy impact: none in PHASE 2.6.
- Optional/live hazard layers remain disabled and therefore add no parsing, layer, marker, or repaint cost.
- Future heavy spatial datasets should prefer governed raster/vector tiles, viewport loading, point clustering, and worker-side preparation; geometry simplification requires accuracy and license review.
