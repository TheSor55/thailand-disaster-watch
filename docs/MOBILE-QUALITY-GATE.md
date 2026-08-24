# Mobile and responsive quality gate — PHASE 2.6

One responsive client supports phone, tablet, laptop, and desktop. The CSS contract uses dynamic viewport units, four safe-area insets, coarse-pointer touch targets, constrained bottom sheets, non-map navigation, visible focus, reduced-motion handling, and portrait/short-landscape rules.

## Required viewport matrix

| Width (px) | Representative class | Portrait | Landscape | Required checks |
|---:|---|---|---|---|
| 320 | compact phone | Required | Required | no horizontal overflow; controls and sheet usable |
| 360 | Android phone | Required | Required | no clipping; 44 px coarse-pointer targets |
| 375 | iPhone | Required | Required | safe-area and browser-bar behavior |
| 390 | iPhone | Required | Required | Dynamic Island/home-indicator clearance |
| 414 | large phone | Required | Required | bottom dock and sheet |
| 430 | large phone | Required | Required | map controls and summary cards |
| 768 | tablet | Required | Required | map/panel ordering and touch navigation |
| 820 | tablet | Required | Required | responsive rail transition |
| 1024 | tablet/laptop | Required | Required | panel grid and map resize |
| 1280 | laptop | N/A | Required | three-column command center |
| 1440 | desktop | N/A | Required | readable density and focus order |
| 1920 | large desktop | N/A | Required | bounded content density and map controls |

Browsers requiring human/device verification: current Safari on iOS/iPadOS, current Chrome on Android/desktop, and current Edge on Windows. Automated tests verify CSS and accessibility contracts but do not prove physical-device behavior.

## Pass criteria

- No horizontal page overflow, clipped buttons, overlapping panels, hidden map controls, unusable dialog/bottom sheet, unreadable text, viewport jump, orientation failure, or touch failure.
- Escape closes the modal sheet; the close control receives initial focus and has an accessible name.
- Map failure is isolated; region/province search remains an accessible non-map path.
- Unknown and disconnected data states remain visible at every width.

## PHASE 2.6 evidence

- Automated CSS/accessibility contracts: passed for project floor, breakpoints, `dvh`, safe areas, bottom-sheet bounds, overflow containment, touch targets, reduced motion, focus naming, and the complete width matrix declaration.
- In-app Chromium functional check at 1280 × 720: no horizontal page overflow, no clipped visible button, map controls visible, safety state `NO_LIVE_DATA`, region route switch passed, provider health `DISABLED / PENDING`, and no console error.
- The in-app browser's explicit viewport override did not change the reported 1280 px layout viewport during this run. Therefore 320–1024 and 1440–1920 visual results are **NOT VERIFIED by browser emulation** and are not claimed as passed.
- Physical/current Safari, Chrome, and Edge phone/tablet checks remain mandatory before production approval, including virtual keyboard, notch/Dynamic Island, home indicator, Android browser bars, rotation, and touch behavior.
