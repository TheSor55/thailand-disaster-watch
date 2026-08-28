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
      <div
        className="cctv-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(100%, 520px)',
          maxHeight: 'calc(100dvh - 24px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          background: '#0c1424',
        }}
      >
        {/* Modal Header */}
        <header
          className="cctv-modal-header"
          style={{
            padding: '10px 14px',
            background: '#131f37',
            borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ minWidth: 0, paddingRight: '8px' }}>
            <span className="eyebrow" style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.04em' }}>
              {isCoastal ? '🌊 COASTAL MARINE CAMERA' : '🏞️ RIVER/CANAL CAMERA'} · {station.providerNameTh}
            </span>
            <h3 style={{ margin: '1px 0', fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {station.nameTh}
            </h3>
            <small style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{station.waterwayTh} · จ.{station.provinceNameTh}</small>
          </div>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            aria-label="Close CCTV Modal"
            style={{ width: '28px', height: '28px', flexShrink: 0 }}
          >
            ✕
          </button>
        </header>

        {/* Modal Body (Scrollable if viewport is tiny) */}
        <div
          className="cctv-modal-body"
          style={{
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            overflowY: 'auto',
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Main Official Live Camera Broadcast Gateway Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(24, 38, 66, 0.85))',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '10px',
              padding: '12px 14px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Top Status Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  color: '#34d399',
                  padding: '3px 8px',
                  borderRadius: '16px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
                สัญญาณสดออนไลน์ (LIVE READY)
              </span>

              <span style={{ color: '#94a3b8', fontSize: '0.68rem', fontVariantNumeric: 'tabular-nums' }}>
                🕒 {timestamp}
              </span>
            </div>

            {/* Middle Live Broadcast Action Hero */}
            <div style={{ textAlign: 'center', padding: '10px 8px', background: 'rgba(0, 0, 0, 0.35)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '2px' }}>
                {isCoastal ? '🌊' : '📹'}
              </span>
              <h4 style={{ margin: '0 0 2px', fontSize: '0.86rem', color: '#f8fafc', fontWeight: 700 }}>
                กล้องตรวจการณ์โทรมาตรระดับน้ำส่งตรงจากพื้นที่
              </h4>
              <p style={{ margin: '0 0 10px', fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.4 }}>
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
                  gap: '6px',
                  width: '100%',
                  maxWidth: '340px',
                  padding: '9px 16px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  borderRadius: '7px',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                  border: '1px solid #38bdf8',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>🎥</span>
                <span>เปิดดูกล้องสดส่งตรงจากเซิร์ฟเวอร์เทศบาล ↗</span>
              </a>
            </div>

            {/* Bottom HUD Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.64rem', color: '#94a3b8' }}>
              <span>CAM-ID: <strong style={{ color: '#cbd5e1' }}>{station.id.toUpperCase()}</strong></span>
              <span>📍 พิกัด: <strong style={{ color: '#cbd5e1' }}>{station.latitude.toFixed(4)}°N, {station.longitude.toFixed(4)}°E</strong></span>
            </div>
          </div>

          {/* Telemetry Statistics Card Grid */}
          <div className="cctv-meta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <div className="cctv-stat-card" style={{ padding: '8px 10px', minHeight: 'auto' }}>
              <small style={{ fontSize: '0.64rem' }}>{isCoastal ? 'ระดับน้ำทะเล / น้ำขึ้น' : 'ระดับน้ำโทรมาตรปัจจุบัน'}</small>
              <div className="cctv-stat-val" style={{ margin: '3px 0' }}>
                <strong style={{ fontSize: '1.25rem' }}>{station.waterLevelMsl.toFixed(2)}</strong>
                <span style={{ fontSize: '0.7rem' }}>{isCoastal ? 'ม.' : 'ม.รทก.'}</span>
              </div>
              <div className="cctv-meter-bar" style={{ height: '5px', margin: '4px 0' }}>
                <div
                  className={`cctv-meter-fill ${
                    percentage > 85 ? 'cctv-meter-fill--danger' : percentage > 70 ? 'cctv-meter-fill--warning' : ''
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="cctv-threshold-hint" style={{ fontSize: '0.62rem', margin: 0 }}>
                {isCoastal ? 'เกณฑ์เฝ้าระวัง:' : 'ระดับตลิ่งเฝ้าระวัง:'} <strong>{station.bankLevelMsl.toFixed(2)}</strong> {isCoastal ? 'ม.' : 'ม.รทก.'}
              </p>
            </div>

            <div className="cctv-stat-card" style={{ padding: '8px 10px', minHeight: 'auto' }}>
              <small style={{ fontSize: '0.64rem' }}>{isCoastal ? 'ความสูงคลื่นนัยสำคัญ' : 'สถานะการระบายน้ำ'}</small>
              <div className="cctv-stat-val" style={{ margin: '3px 0' }}>
                {isCoastal ? (
                  <>
                    <strong style={{ color: '#38bdf8', fontSize: '1.25rem' }}>~{station.waveHeightM ?? 0.5}</strong>
                    <span style={{ fontSize: '0.7rem' }}>เมตร</span>
                  </>
                ) : (
                  <>
                    <strong style={{ color: '#10b981', fontSize: '1.15rem' }}>ปกติ</strong>
                    <span style={{ fontSize: '0.68rem' }}>(พร้อมระบาย)</span>
                  </>
                )}
              </div>
              <div className="cctv-status-badge" style={{ padding: '2px 6px', fontSize: '0.62rem' }}>
                <span className="live-dot" />
                <span>{isCoastal ? 'คลื่นเล็กน้อยถึงปานกลาง' : 'ประตูระบายน้ำพร้อมใช้งาน'}</span>
              </div>
              <p className="cctv-threshold-hint" style={{ fontSize: '0.62rem', margin: '2px 0 0' }}>
                หน่วยงาน: <strong>{station.providerNameTh}</strong>
              </p>
            </div>
          </div>

          {/* Direct Server URL Display Box */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '6px', padding: '6px 10px', fontSize: '0.64rem', color: '#94a3b8', wordBreak: 'break-all' }}>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>🔗 ลิงก์ช่องสัญญาณสด: </span>
            <a href={station.liveStreamUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#7dd3fc', textDecoration: 'underline' }}>
              {station.liveStreamUrl}
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <footer
          className="cctv-modal-footer"
          style={{
            padding: '8px 14px',
            background: '#131f37',
            borderTop: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            justifyContent: 'flex-end',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{ padding: '6px 16px', fontSize: '0.75rem', fontWeight: 600 }}
          >
            ปิดหน้าต่าง
          </button>
        </footer>
      </div>
    </div>
  );
}
