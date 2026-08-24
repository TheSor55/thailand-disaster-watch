# Design system — PHASE 2 foundation

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
- Conflict: show `CONFLICTING SOURCES` with each source/time; never hide the disagreement.
- Degraded/offline: show system mode and last synchronization persistently; cached data never appears live.
- Exercise: persistent `EXERCISE / การฝึกซ้อม` banner and export watermark.

## Responsive validation matrix

| Class | Reference widths | Required behavior |
|---|---|---|
| Small phone | 320, 360 px | no horizontal page scroll; bottom dock; sheets fit viewport; source/time readable |
| Phone | 375, 390, 414, 430 px | full-width map, touch targets, one-column cards |
| Tablet | 768, 820, 1024 px | map first; panels below/overlay without obscuring controls |
| Desktop | 1280–1439 px | command-center rails and map remain legible |
| Wide | 1440 px and above | bounded reading width; no excessive information density |

Keyboard, screen-reader, 200% zoom, reduced motion, Thai line wrapping, portrait/landscape, iOS safe-area insets, excessive re-render, and mobile-memory checks are release gates. Test targets include iPhone, Android Phone, iPad, Android Tablet, Desktop, and current supported Safari, Chrome, and Edge. Horizontal overflow, clipped/overlapping controls, off-viewport map controls, and broken bottom sheets fail the gate. These are validation targets, not a claim that all PHASE 2 UI has been implemented.

## Interaction and accessibility

- Native buttons, inputs, landmarks, breadcrumbs, dialogs, and visible focus states are used for keyboard navigation.
- Status is always paired with text; gray means unavailable/unknown in PHASE 1.
- Map source failures appear as textual alerts while non-map navigation remains available.
