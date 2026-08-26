/**
 * ModeSelector — Allows the user to switch between DEMO PREVIEW and CONTROLLED LIVE PREVIEW.
 *
 * NOTE: This is a local development-only preview control.
 * It NEVER changes production safety gates (realDataConnected / operationalUseApproved).
 */

import type { WeatherPreviewMode } from '../../services/weatherSituation';

interface ModeSelectorProps {
  mode: WeatherPreviewMode;
  onModeChange: (nextMode: WeatherPreviewMode) => void;
  disabled?: boolean;
}

export function ModeSelector({ mode, onModeChange, disabled = false }: ModeSelectorProps) {
  return (
    <section className="mode-selector" aria-label="เลือกโหมดข้อมูล (Data Mode Selector)">
      <div className="mode-selector__header">
        <span className="eyebrow">PREVIEW MODE SELECTION</span>
        <h3>เลือกโหมดการแสดงผลข้อมูล</h3>
      </div>

      <div className="mode-selector__controls" role="radiogroup" aria-label="เลือกโหมดข้อมูล">
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'DEMO'}
          className={`mode-selector__btn${mode === 'DEMO' ? ' mode-selector__btn--active' : ''}`}
          onClick={() => onModeChange('DEMO')}
          disabled={disabled}
        >
          <span className="mode-selector__btn-title">1. DEMO PREVIEW</span>
          <span className="mode-selector__btn-desc">
            ข้อมูลตัวอย่างจำลอง (Deterministic Fixture) · ไม่เรียก API ภายนอก
          </span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={mode === 'LIVE'}
          className={`mode-selector__btn${mode === 'LIVE' ? ' mode-selector__btn--active' : ''}`}
          onClick={() => onModeChange('LIVE')}
          disabled={disabled}
        >
          <span className="mode-selector__btn-title">2. CONTROLLED LIVE PREVIEW</span>
          <span className="mode-selector__btn-desc">
            ทดสอบดึงข้อมูลสดผ่าน Worker (TMD + Open-Meteo) · เฉพาะสภาพแวดล้อมพัฒนา
          </span>
        </button>
      </div>

      <p className="mode-selector__note">
        * โหมดนี้ใช้สำหรับทดสอบการทำงานของระบบในเครื่องพัฒนาเท่านั้น และไม่มีผลแทนประกาศเตือนภัยทางการ
      </p>
    </section>
  );
}
