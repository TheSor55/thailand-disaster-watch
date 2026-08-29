# Thailand Disaster Watch v1.4.0 Release Notes

**Release Date:** August 29, 2026  
**Status:** PRODUCTION READY (v1.4.0)

---

## 🎯 Major Features Delivered in Version 1.4.0

### 1. HII & EGAT Official Dam Telemetry Alignment (`dam.ts` & `DamSituationCard.tsx`)
- **Official Live Telemetry Numbers**: Updated baseline figures for major reservoirs (เขื่อนภูมิพล 7,603.03 ล้าน ลบ.ม. / 56%, เขื่อนสิริกิติ์ 6,872.28 ล้าน ลบ.ม. / 72%, เขื่อนแม่งัดสมบูรณ์ชล 209.71 ล้าน ลบ.ม. / 79%) to match official live data from **สสน. (ThaiWater.net)**.
- **Redesigned Dam Telemetry Table**: Replaced industrial cards with a 3-column table (`อ่างเก็บน้ำ` | `น้ำกักเก็บ` | `% ความจุ`).
- **Live Thai Date/Time Timestamp Badge**: Added a live date & time timestamp (`📅 29 ส.ค. 2569 | 14:50 น.`) on the card header.
- **Typography & No-Wrap Styling**: Fixed dam name line breaks (`whiteSpace: 'nowrap'`, font size `0.8rem`, column width `135px`).

### 2. Official สสน. CCTV Station Telemetry Table (`cctv.ts`, `CctvPanel.tsx` & `CctvModal.tsx`)
- **Redesigned CCTV Telemetry Table**: Replaced large cards with a 3-column station table (`ชื่อสถานี` | `เวลา` | `▶ ดูภาพ`).
- **Dam CCTV Stations Integrated**: Integrated CCTV stations for major dams (`เขื่อนน้ำพุง`, `เขื่อนจุฬาภรณ์`, `เขื่อนสิรินธร`, `เขื่อนรัชชประภา`, `เขื่อนบางลาง`, `เขื่อนวชิราลงกรณ`, `เขื่อนศรีนครินทร์`, `เขื่อนภูมิพล`, `เขื่อนสิริกิติ์`).
- **Dam Filter Tab**: Added dedicated filter tab `🏞️ เขื่อน/อ่างเก็บน้ำ`.
- **Dynamic Provider Text & Hydrology Note**: Updated modal action button to dynamically show station provider (`สสน. ThaiWater`) and added explicit explanation for `ม.รทก.` elevation meters above sea level vs water depth.

### 3. Integrated Official ThaiWater.net Map Links (`RiverStationCard.tsx`, `CctvPanel.tsx` & `DamSituationCard.tsx`)
- Linked water level & discharge card to official สสน. map modal: `https://twa.thaiwater.net/th/map/basic/water-level-discharge/...`
- Linked CCTV panel to official สสน. CCTV map modal: `https://twa.thaiwater.net/th/map/basic/cctv/...`
- Linked dam card directly to official สสน. large dam map modal: `https://twa.thaiwater.net/th/map/basic/large-dam/...`

---

## 🧪 Quality Assurance & Test Verification
- `npm run test` -> 42 Test Files Passed, 179 Unit Tests Passed (100%).
- `npm run build:web` -> Production Web Bundle Built cleanly in 1.40s.
