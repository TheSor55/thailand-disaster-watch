# Design system — PHASE 1

## Direction

Professional command-center interface with high readability, accessible dark/light support, and GIS-focused information hierarchy. Desktop uses three rails around the map; tablet makes the map primary and moves situation panels below; mobile adds a full-width map, persistent bottom dock, and modal bottom sheets.

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
- Demo/no-source content: label `DEMO / NO LIVE DATA`, `No live data`, or `DATA SOURCE NOT CONNECTED` at the data surface. No fabricated values are permitted.

## Interaction and accessibility

- Native buttons, inputs, landmarks, breadcrumbs, dialogs, and visible focus states are used for keyboard navigation.
- Status is always paired with text; gray means unavailable/unknown in PHASE 1.
- Map source failures appear as textual alerts while non-map navigation remains available.
