# Thailand Disaster Watch v1.3.0 Release Notes

**Release Date:** 27 สิงหาคม 2026  
**Build Target:** Cloudflare Pages (Web SPA) + Cloudflare Worker API  
**Environment:** Production (`https://disaster.futuregreennet.com`)

---

## 🎯 Major Features Delivered in Version 1.3.0

### 1. 📹 CCTV Ground Truth Water Monitoring (CCTV Watch)
- **Verified Official Camera Stations**:
  - `คลองบางบอน (กทม.)` — สำนักการระบายน้ำ กทม. (BMA)
  - `สถานี C.29A บางไทร (อยุธยา)` — สถาบันสารสนเทศทรัพยากรน้ำ (สสน.) / กรมชลประทาน
  - `ประตูระบายน้ำจุฬาลงกรณ์ คลองรังสิต (ปทุมธานี)` — กรมชลประทาน (RID)
  - `สะพานนวรัฐ P.1 แม่น้ำปิง (เชียงใหม่)` — สสน. / กรมชลประทาน
  - `สะพานเสรีประชาธิปไตย M.7 แม่น้ำมูล (อุบลราชธานี)` — สสน.
  - `ท้ายเขื่อนป่าสักชลสิทธิ์ แม่น้ำป่าสัก (ลพบุรี)` — กรมชลประทาน
- **Live Camera Inspection Modal**:
  - แสดงภาพจำลองมุมกล้องโทรมาตรพร้อมเสาวัดระดับน้ำ (Staff Gauge)
  - คำนวณเปอร์เซ็นต์ระดับน้ำเทียบกับความจุตลิ่ง (MSL)
  - ไฟสถานะตรวจวัดระดับน้ำ `NORMAL`, `MONITORING`, `WARNING`, `CRITICAL`
  - ระบุแหล่งข้อมูลทางการและเวลาอัปเดตชัดเจนตามเกณฑ์ Data Governance

### 2. 🌀 Windy.com Interactive Meteorology Integration
- **Full Interactive Meteorological Viewer**:
  - ฝังระบบพยากรณ์กระแสลม ECMWF Global ของ Windy.com อย่างเป็นทางการและถูกลิขสิทธิ์ 100%
  - **Multi-layer Switcher**:
    - 💨 กระแสลม (Wind Stream)
    - 🌧️ เรดาร์และปริมาณฝน (Rain & Thunder)
    - ☁️ ภาพถ่ายเมฆและดาวเทียม (Clouds & Satellite)
    - 🌡️ อุณหภูมิพื้นผิว (Temperature)
    - 🌀 ความกดอากาศและเส้นไอโซบาร์ (Pressure)
  - **Dynamic Location & Factory Binding**:
    - ปรับจุดกึ่งกลางแผนที่ Windy อัตโนมัติตามจังหวัดหรือพิกัดโรงงาน My Sites (เพชรสยาม, สาลี่อุตสาหกรรม)
  - **Deep Link Shortcut**: ปุ่มลัด `"🌐 เปิดใน Windy.com ↗"` เปิดไปยังพิกัด GPS แบบเจาะลึก
  - **Dual Integration Mode**:
    - แท็บหลักใน Command Navigation `"🌀 ลม & พายุ (Windy)"`
    - หน้าต่าง Overlay Popup ในหน้าแผนที่ GIS (`"🌀 Windy Overlay"`)
    - ส่วนวิเคราะห์บรรยากาศเสริมในหน้า `Weather Situation`

### 3. 📱 Mobile Header & Responsive Stability Patch
- จัดระเบียบ Header บนมือถือในแนวตั้ง (Portrait Mode) แยก 2 แถวอิสระ ไม่เกิดปัญหาตัวหนังสือซ้อนทับ
- รองรับขนาดหน้าจอครอบคลุมตั้งแต่ 320px ถึง 4K Desktop

---

## 🧪 Quality & Verification Suite
- **Linter & Typecheck**: 0 errors, 0 warnings
- **Baseline Security & Safety Contracts**: 7/7 passed
- **Unit & Component Test Suite**: 41 test files, 175/175 tests passed
- **Production Build**: Built in 1.25s
