/**
 * WeatherExplainer — "What am I looking at?" / "คู่มือทำความเข้าใจข้อมูลสภาพอากาศ"
 *
 * Provides a lightweight, concise guide explaining:
 * - OBSERVED vs MODEL_FORECAST
 * - DEMO PREVIEW vs CONTROLLED LIVE PREVIEW
 * - Limitations and official authority
 */

import { useState } from 'react';

export function WeatherExplainer() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="weather-explainer" aria-label="คำอธิบายข้อมูล (What am I looking at?)">
      <button
        type="button"
        className="weather-explainer__toggle"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
      >
        <span>ℹ What am I looking at? (คำอธิบายข้อมูลและโหมดการแสดงผล)</span>
        <span aria-hidden="true">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div className="weather-explainer__content">
          <div className="weather-explainer__grid">
            <div className="weather-explainer__block">
              <h4 className="weather-explainer__title">
                <span className="classification-badge classification-badge--observed">OBSERVED</span>
                <span>ข้อมูลสังเกตการณ์จริง</span>
              </h4>
              <p>
                ข้อมูลสภาพอากาศที่วัดได้จริงจากสถานีตรวจวัดของกรมอุตุนิยมวิทยา (TMD)
                ณ เวลาสังเกตการณ์ ใช้สำหรับตอบคำถาม <em>"ตอนนี้มีฝนไหม?"</em> เท่านั้น
                และจะไม่นำข้อมูลพยากรณ์มาแทนที่เด็ดขาด
              </p>
            </div>

            <div className="weather-explainer__block">
              <h4 className="weather-explainer__title">
                <span className="classification-badge classification-badge--model-forecast">MODEL_FORECAST</span>
                <span>แบบจำลองพยากรณ์</span>
              </h4>
              <p>
                ผลการคำนวณเชิงตัวเลขจากแบบจำลอง Open-Meteo สำหรับประเมินแนวโน้มฝนล่วงหน้า (+1 ชม. และ +3 ชม.)
                ระบุเป็นความน่าจะเป็นเชิงสถิติ (เช่น "มีแนวโน้มฝน 30%") ไม่ใช่การสังเกตการณ์จริง
              </p>
            </div>

            <div className="weather-explainer__block">
              <h4 className="weather-explainer__title">
                <span className="mode-badge__tag">DEMO PREVIEW</span>
                <span>โหมดข้อมูลตัวอย่าง</span>
              </h4>
              <p>
                ใช้ชุดข้อมูลจำลองแบบกำหนดค่าแน่นอน (Deterministic Fixture) สำหรับทดสอบหน้าจอ
                โดยไม่มีการเรียก API ภายนอก
              </p>
            </div>

            <div className="weather-explainer__block">
              <h4 className="weather-explainer__title">
                <span className="mode-badge__tag">CONTROLLED LIVE PREVIEW</span>
                <span>โหมดทดสอบข้อมูลสด</span>
              </h4>
              <p>
                เรียกข้อมูลจาก TMD และ Open-Meteo ผ่าน Cloudflare Worker ภายใต้การควบคุม
                (Local Development เท่านั้น) เพื่อทดสอบความพร้อมของข้อมูลจริง
              </p>
            </div>
          </div>

          <div className="weather-explainer__disclaimer">
            <strong>⚠ ข้อจำกัดและความปลอดภัย:</strong> ระบบนี้จัดทำขึ้นเพื่อการสนับสนุนการตัดสินใจ
            (Decision Support) ในสภาพแวดล้อมทดสอบเท่านั้น ไม่ใช่ระบบเตือนภัยฉุกเฉินทางการ
            การประกาศเตือนภัยที่มีผลตามกฎหมายยังคงเป็นอำนาจของหน่วยงานทางการ เช่น TMD และ ปภ. (DDPM)
          </div>
        </div>
      )}
    </section>
  );
}
