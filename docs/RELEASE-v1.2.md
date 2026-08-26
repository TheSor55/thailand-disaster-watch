# Thailand Disaster Watch — Release Notes v1.2.0

**Release Tag:** `v1.2.0`  
**Release Date:** 2026-08-26  
**Status:** 🚀 LIVE IN PRODUCTION  
**Domain:** `https://disaster.futuregreennet.com`  

---

## 🌟 What's New in Version 1.2.0

### 1. 🛰️ GISTDA Satellite Flood Inundation Layer (ภาพถ่ายดาวเทียมน้ำท่วมขัง)
- **Controlled Pilot Layer**: Integrated GeoJSON satellite inundation polygons across Chao Phraya Basin (Ayutthaya water retention fields, Rangsit-Khlong Luang lowlands, Sing Buri, Sukhothai Bang Rakam model).
- **Layer Toggle**: Enabled in the Layer Control drawer (`🛰️ ภาพถ่ายดาวเทียมน้ำท่วมขัง (GISTDA Flood Inundation)`).
- **Visual Styling**: Translucent cyan/blue fill (`#06b6d4` with 45% opacity) with bright boundary line (`#22d3ee`).
- **Attribution**: Clearly marked as `GISTDA Sentinel-1 C-band SAR / OBSERVED_REMOTE_SENSING`.

### 2. 🏢 My Sites — BCM Business Risk Intelligence & Executive PDF Report
- **Tailored Monitoring for User Sites**:
  1. **บริษัท เพชรสยามประเทศไทย จำกัด** (ซอยพระยามนธาตุฯ แยก 9 แขวงคลองบางบอน เขตบางบอน กทม.)
  2. **บริษัท สาลี่อุตสาหกรรม จำกัด (มหาชน)** (ตำบลคลองสี่ อำเภอคลองหลวง จังหวัดปทุมธานี)
- **4-Pillar Hazard Matrix**:
  1. Precipitation & Cloud Radar Risk (รัศมี 25 กม.)
  2. Satellite Inundation Proximity (GISTDA Sentinel-1 SAR)
  3. Drainage & Local Canal Status (คลองบางบอน / คลองระพีพัฒน์-คลองหลวง)
  4. Dam Discharge & Upstream Storage Capacity
- **Executive BCM Report Modal**:
  - Full-screen modal with comprehensive site diagnostics, overall risk level, and committee action recommendations.
  - One-click **"🖨️ พิมพ์ / บันทึก PDF รายงาน (Print BCM Report)"** with clean A4 print stylesheet.

---

## 🧪 Quality Gates & Verification Evidence
- **Vitest Unit Tests:** 168 / 168 tests passed
- **Baseline Invariant Tests:** 7 / 7 tests passed
- **ESLint:** 0 errors
- **TypeScript:** `tsc -b` 0 errors
- **Web & Worker Production Build:** Success
