import { useState, useEffect } from 'react';
import type { CctvStation } from '../../domain/cctv';

interface CctvModalProps {
  station: CctvStation;
  onClose: () => void;
}

export function CctvModal({ station, onClose }: CctvModalProps) {
  const isCoastal = station.category === 'COASTAL_GULF' || station.category === 'COASTAL_ANDAMAN';
  const percentage = Math.min(100, Math.max(0, Math.round((station.waterLevelMsl / station.bankLevelMsl) * 100)));

  const [mode, setMode] = useState<'SNAPSHOT' | 'VIDEO'>('SNAPSHOT');
  const [timestamp, setTimestamp] = useState<string>(() => new Date().toLocaleString('th-TH'));
  const [cacheBuster, setCacheBuster] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  // Live real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleString('th-TH'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setImgError(false);
    setCacheBuster(Date.now());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const defaultImg = isCoastal
    ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80';

  const rawUrl = station.snapshotUrl || defaultImg;
  const snapshotSrc = cacheBuster > 0 ? `${rawUrl}&_t=${cacheBuster}` : rawUrl;

  return (
    <div className="cctv-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cctv-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <header className="cctv-modal-header">
          <div>
            <span className="eyebrow">
              {isCoastal ? '🌊 COASTAL MARINE CAMERA' : '🏞️ RIVER/CANAL CAMERA'} · {station.provider}
            </span>
            <h3>{station.nameTh}</h3>
            <small>{station.waterwayTh} · {station.provinceNameTh}</small>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} aria-label="Close CCTV Modal">
            ✕
          </button>
        </header>

        {/* Modal Body */}
        <div className="cctv-modal-body">
          {/* Hybrid Mode Toggle Bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <button
              type="button"
              className={`btn-filter-chip ${mode === 'SNAPSHOT' ? 'is-active' : ''}`}
              onClick={() => setMode('SNAPSHOT')}
              style={{ flex: 1, padding: '7px 12px', fontSize: '0.75rem', fontWeight: 600 }}
            >
              📸 ภาพ Snapshot สด (เบาเครื่อง/เร็ว)
            </button>
            {station.liveStreamUrl && (
              <button
                type="button"
                className={`btn-filter-chip ${mode === 'VIDEO' ? 'is-active' : ''}`}
                onClick={() => setMode('VIDEO')}
                style={{ flex: 1, padding: '7px 12px', fontSize: '0.75rem', fontWeight: 600 }}
              >
                ▶️ ดูวิดีโอเคลื่อนไหวสด (Live Stream)
              </button>
            )}
          </div>

          {/* Camera Viewport Area */}
          <div className="cctv-live-feed-wrap">
            <div className="cctv-viewport" style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', minHeight: '260px', background: '#090d16' }}>
              {/* Top HUD Overlay */}
              <div className="cctv-hud-top" style={{ position: 'absolute', top: '10px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <span className="cctv-live-rec" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.65)', padding: '4px 8px', borderRadius: '5px', backdropFilter: 'blur(6px)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', fontSize: '0.72rem', fontWeight: 700 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 8px #ef4444' }} />
                  {mode === 'SNAPSHOT' ? 'LIVE SNAPSHOT' : 'LIVE STREAM'}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="cctv-timestamp" style={{ background: 'rgba(0,0,0,0.65)', padding: '4px 8px', borderRadius: '5px', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: '#f1f5f9', fontSize: '0.72rem', fontVariantNumeric: 'tabular-nums' }}>
                    {timestamp}
                  </span>
                  {mode === 'SNAPSHOT' && (
                    <button
                      type="button"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      title="รีเฟรชภาพสดล่าสุด"
                      style={{ background: 'rgba(2,132,199,0.7)', border: '1px solid #38bdf8', color: '#fff', padding: '4px 8px', borderRadius: '5px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      🔄 {isRefreshing ? 'กำลังโหลด...' : 'รีเฟรช'}
                    </button>
                  )}
                </div>
              </div>

              {/* Feed Content */}
              {mode === 'SNAPSHOT' ? (
                <div style={{ position: 'relative', width: '100%', height: '260px' }}>
                  {!imgError ? (
                    <img
                      src={snapshotSrc}
                      alt={station.nameTh}
                      onError={() => setImgError(true)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    /* Fallback High-Tech SVG Viewport */
                    <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', color: '#94a3b8' }}>
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <span style={{ fontSize: '2rem' }}>{isCoastal ? '🌊' : '🏞️'}</span>
                        <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>
                          {station.nameTh}
                        </p>
                        <small style={{ color: '#64748b' }}>สัญญาณกล้องโทรมาตรพร้อมใช้งาน</small>
                      </div>
                    </div>
                  )}

                  {/* Subtle Vignette Overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />

                  {/* Telemetry Crosshair Overlay */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', opacity: 0.4 }}>
                    <svg width="48" height="48" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="18" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="12" y1="24" x2="36" y2="24" stroke="#38bdf8" strokeWidth="1" />
                      <line x1="24" y1="12" x2="24" y2="36" stroke="#38bdf8" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', height: '260px' }}>
                  <iframe
                    src={station.liveStreamUrl}
                    title={station.nameTh}
                    style={{ width: '100%', height: '100%', border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  {/* External Player Link fallback button */}
                  <div style={{ position: 'absolute', bottom: '10px', right: '12px', zIndex: 12 }}>
                    <a
                      href={station.liveStreamUrl?.replace('/embed/', '/watch?v=')}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background: 'rgba(239,68,68,0.85)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid #fca5a5' }}
                    >
                      ↗ เปิดชมสดบน YouTube ↗
                    </a>
                  </div>
                </div>
              )}

              {/* Bottom HUD Info Bar */}
              <div className="cctv-hud-bottom" style={{ position: 'absolute', bottom: '8px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, fontSize: '0.68rem', color: '#cbd5e1', background: 'rgba(0,0,0,0.65)', padding: '4px 8px', borderRadius: '5px', backdropFilter: 'blur(6px)' }}>
                <span>CAM-ID: <strong>{station.id.toUpperCase()}</strong></span>
                <span>📍 LAT: {station.latitude.toFixed(4)} LON: {station.longitude.toFixed(4)}</span>
              </div>
            </div>
          </div>

          {/* Telemetry Statistics Card Grid */}
          <div className="cctv-meta-grid">
            <div className="cctv-stat-card">
              <small>{isCoastal ? 'ระดับน้ำทะเล / น้ำขึ้น (Tide Level)' : 'ระดับน้ำปัจจุบัน (Water Level)'}</small>
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
                {isCoastal ? 'เกณฑ์เฝ้าระวังน้ำหนุน:' : 'ระดับตลิ่งเฝ้าระวัง:'} {station.bankLevelMsl.toFixed(2)} {isCoastal ? 'ม.' : 'ม.รทก.'}
              </p>
            </div>

            <div className="cctv-stat-card">
              <small>{isCoastal ? 'ความสูงคลื่นนัยสำคัญ & สภาพทะเล' : 'สถานะการระบายน้ำ'}</small>
              <div className="cctv-stat-val">
                {isCoastal ? (
                  <>
                    <strong style={{ color: '#38bdf8' }}>~{station.waveHeightM ?? 0.5}</strong>
                    <span>เมตร</span>
                  </>
                ) : (
                  <>
                    <strong style={{ color: '#10b981' }}>ปกติ</strong>
                    <span>(เปิดระบาย)</span>
                  </>
                )}
              </div>
              <div className="cctv-status-badge">
                <span className="live-dot" />
                <span>{isCoastal ? 'ทะเลมีคลื่นเล็กน้อยถึงปานกลาง' : 'ระบบสูบและระบายน้ำพร้อมใช้งาน'}</span>
              </div>
              <p className="cctv-threshold-hint">
                หน่วยงาน: {station.providerNameTh}
              </p>
            </div>
          </div>

          {/* Data Provenance Footer */}
          <div className="cctv-provenance-box">
            <small>📌 แหล่งที่มา: {station.sourceAttribution}</small>
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
