# Design system baseline

## Direction

Professional command-center interface with high readability, mobile-first layout, accessible dark/light support, and GIS-focused information hierarchy.

## Typography

Prefer Sarabun for Thai content with `Noto Sans Thai`, Tahoma, Arial, and sans-serif fallbacks. Meeting-room views must use short copy and readable type sizes.

## Status semantics

| Status | Color family | Required non-color label |
|---|---|---|
| Normal | Green | `NORMAL` / ปกติ |
| Watch | Yellow | `WATCH` / เฝ้าระวัง |
| Warning | Orange | `WARNING` / เตือน |
| Critical | Red | `CRITICAL` / วิกฤต |
| Unknown | Gray | `UNKNOWN` / ไม่ทราบสถานะ |

Color is always secondary. Every status requires visible text and, where useful, an icon with an accessible name. Actual thresholds must come from verified sources/configuration and are intentionally absent from this baseline.

## Core states

- Loading: identify the dataset being requested.
- Empty: state that no records meet the current criteria.
- Unavailable: show `DATA TEMPORARILY UNAVAILABLE` without crashing other modules.
- Stale: show `STALE DATA` plus the last known observation time.
- Unknown timestamp: show `UPDATE TIME UNKNOWN`.
- Demo content: label `DEMO / MOCK DATA` at the data surface, never only in a footnote.
