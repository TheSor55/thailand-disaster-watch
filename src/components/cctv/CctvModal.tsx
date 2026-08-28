import { useState, useEffect } from 'react';
import type { CctvStation } from '../../domain/cctv';

interface CctvModalProps {
  station: CctvStation;
  onClose: () => void;
}

export function CctvModal({ station, onClose }: CctvModalProps) {
  const isCoastal = station.category === 'COASTAL_GULF' || station.category === 'COASTAL_ANDAMAN';
  const percentage = Math.min(100, Math.max(0, Math.round((station.waterLevelMsl / station.bankLevelMsl) * 100)));

  const [timestamp, setTimestamp] = useState<string>(() => new Date().toLocaleString('th-TH'));

  // Live real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleString('th-TH'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="cctv-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cctv-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        {/* Modal Header */}
        <header className="cctv-modal-header">
          <div>
            <span className="eyebrow" style={{ color: '#38bdf8', fontWeight: 700 }}>
              {isCoastal ? '🌊 COASTAL MARINE CAMERA' : '🏞️ MUNICIPAL / RIVER CCTV'} · {station.providerNameTh}
            </span>
            <h3 style={{ margin: '4px 0', fontSize: '1.05rem', color: '#f8fafc' }}>{station.nameTh}</h3>
            <small style={{ color: '#94a3b8' }}>{station.waterwayTh} · จ.{station.provinceNameTh}</small>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} aria-label="Close CCTV Modal">
            ✕
          </button>
        </header>

        {/* Modal Body */}
        <div className="cctv-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Main Official Live Camera Broadcast Gateway Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '12px',
              padding: '18px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Status Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  color: '#34d399',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                สัญญาณสดออนไลน์ (LIVE READY)
              </span>

              <span style={{ color: '#cbd5e1', fontSize: '0.72rem', fontVariantNumeric: 'tabular-nums', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                🕒 {timestamp}
              </span>
            </div>

            {/* Middle Live Broadcast Action Hero */}
            <div style={{ textAlign: 'center', padding: '16px 10px', background: 'rgba(0, 0, 0, 0.35)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '14px' }}>
              <span style={{ fontSize: '2.4rem', display: 'block', marginBottom: '6px' }}>
                {isCoastal ? '🌊' : '📹'}
              </span>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700 }}>
                กล้องตรวจการณ์โทรมาตรระดับน้ำส่งตรงจากพื้นที่
              </h4>
              <p style={{ margin: '0 0 14px', fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {station.sourceAttribution}
              </p>

              {/* Big Action Button to Open Real Camera Feed */}
              <a
                href={station.liveStreamUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  maxWidth: '380px',
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 18px rgba(2, 132, 199, 0.4)',
                  border: '1px solid #38bdf8',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>🎥</span>
                <span>เปิดดูกล้องสดส่งตรงจากเซิร์ฟเวอร์เทศบาล ↗</span>
              </a>
            </div>

            {/* Bottom HUD Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94a3b8' }}>
              <span>CAM-ID: <strong style={{ color: '#cbd5e1' }}>{station.id.toUpperCase()}</strong></span>
              <span>📍 พิกัด: <strong style={{ color: '#cbd5e1' }}>{station.latitude.toFixed(4)}°N, {station.longitude.toFixed(4)}°E</strong></span>
            </div>
          </div>

          {/* Telemetry Statistics Card Grid */}
          <div className="cctv-meta-grid">
            <div className="cctv-stat-card">
              <small>{isCoastal ? 'ระดับน้ำทะเล / น้ำขึ้น (Tide Level)' : 'ระดับน้ำโทรมาตรปัจจุบัน'}</small>
              <div className="cctv-stat-val">
                <strong>{station.waterLevelMsl.toFixed(2)}</strong>
                <span>{isCoastal ? 'ม.' : 'ม.รทก.'}</span>
              </div>
              <div className="cctv-meter-bar">
                <div
                  className={`cctv-meter-fill ${
                    percentage > 85 ? 'cctv-meter-fill--danger' : percentage > 70 ? 'cctv-meter-fill--warning' : ''
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="cctv-threshold-hint">
                {isCoastal ? 'เกณฑ์เฝ้าระวังน้ำหนุน:' : 'ระดับตลิ่งเฝ้าระวัง:'} <strong>{station.bankLevelMsl.toFixed(2)}</strong> {isCoastal ? 'ม.' : 'ม.รทก.'}
              </p>
            </div>

            <div className="cctv-stat-card">
              <small>{isCoastal ? 'ความสูงคลื่นนัยสำคัญ & สภาพทะเล' : 'สถานะเครื่องสูบน้ำและการระบาย'}</small>
              <div className="cctv-stat-val">
                {isCoastal ? (
                  <>
                    <strong style={{ color: '#38bdf8' }}>~{station.waveHeightM ?? 0.5}</strong>
                    <span>เมตร</span>
                  </>
                ) : (
                  <>
                    <strong style={{ color: '#10b981' }}>ปกติ</strong>
                    <span>(พร้อมระบาย)</span>
                  </>
                )}
              </div>
              <div className="cctv-status-badge">
                <span className="live-dot" />
                <span>{isCoastal ? 'ทะเลมีคลื่นเล็กน้อยถึงปานกลาง' : 'สถานะประตูระบายน้ำพร้อมใช้งาน'}</span>
              </div>
              <p className="cctv-threshold-hint">
                หน่วยงาน: <strong>{station.providerNameTh}</strong>
              </p>
            </div>
          </div>

          {/* Direct Server URL Display Box */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.68rem', color: '#94a3b8', wordBreak: 'break-all' }}>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>🔗 ลิงก์ช่องสัญญาณสดตรง: </span>
            <a href={station.liveStreamUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#7dd3fc', textDecoration: 'underline' }}>
              {station.liveStreamUrl}
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <footer className="cctv-modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            ปิดหน้าต่าง
          </button>
        </footer>
      </div>
    </div>
  );
}
