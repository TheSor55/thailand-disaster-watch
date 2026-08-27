import type { CctvStation } from '../../domain/cctv';

interface CctvModalProps {
  station: CctvStation;
  onClose: () => void;
}

export function CctvModal({ station, onClose }: CctvModalProps) {
  const isCoastal = station.category === 'COASTAL_GULF' || station.category === 'COASTAL_ANDAMAN';
  const percentage = Math.min(100, Math.max(0, Math.round((station.waterLevelMsl / station.bankLevelMsl) * 100)));

  return (
    <div className="cctv-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cctv-modal-content" onClick={(e) => e.stopPropagation()}>
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

        <div className="cctv-modal-body">
          <div className="cctv-live-feed-wrap">
            {/* Real Snapshot Simulation / Feed viewport with live overlays */}
            <div className="cctv-viewport">
              <div className="cctv-hud-top">
                <span className="cctv-live-rec">● LIVE SNAPSHOT</span>
                <span className="cctv-timestamp">{new Date().toLocaleString('th-TH')}</span>
              </div>
              <div className="cctv-camera-simulation">
                {isCoastal ? (
                  /* Coastal Beach & Ocean Wave Simulation */
                  <svg viewBox="0 0 400 240" className="cctv-scene-svg" aria-label="Coastal Marine CCTV Stream">
                    <defs>
                      <linearGradient id="skyGradSea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#1e3a5f" />
                      </linearGradient>
                      <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0369a1" />
                        <stop offset="100%" stopColor="#082f49" />
                      </linearGradient>
                      <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ca8a04" />
                        <stop offset="100%" stopColor="#713f12" />
                      </linearGradient>
                    </defs>
                    {/* Sky & Horizon */}
                    <rect width="400" height="110" fill="url(#skyGradSea)" />
                    {/* Ocean Water */}
                    <rect y="110" width="400" height="85" fill="url(#seaGrad)" />
                    {/* Animated Wave Lines */}
                    <path d="M 0,130 Q 100,125 200,130 T 400,130" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
                    <path d="M 0,150 Q 80,145 160,150 T 320,150 T 400,150" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" fill="none" />
                    <path d="M 0,175 Q 120,168 240,175 T 400,175" stroke="rgba(255,255,255,0.7)" strokeWidth="3" fill="none" />
                    {/* Sandy Beach Shore */}
                    <path d="M 0,185 Q 200,175 400,185 L 400,240 L 0,240 Z" fill="url(#sandGrad)" />
                    {/* Coastal Watchtower / Navigation Buoy */}
                    <circle cx="90" cy="140" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                    <line x1="90" y1="133" x2="90" y2="125" stroke="#facc15" strokeWidth="2" />
                    <circle cx="90" cy="123" r="2.5" fill="#facc15" />
                    {/* Tide Scale Gauge */}
                    <rect x="340" y="80" width="12" height="110" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
                    <line x1="340" y1="100" x2="352" y2="100" stroke="#ef4444" strokeWidth="2" />
                    <line x1="340" y1="130" x2="352" y2="130" stroke="#eab308" strokeWidth="2" />
                    <line x1="340" y1="160" x2="352" y2="160" stroke="#10b981" strokeWidth="2" />
                    <text x="290" y="103" fill="#fca5a5" fontSize="7" fontWeight="bold">HIGH TIDE</text>
                    <text x="285" y="133" fill="#fef08a" fontSize="7" fontWeight="bold">SURGE WATCH</text>
                    <text x="300" y="163" fill="#86efac" fontSize="7" fontWeight="bold">LOW TIDE</text>
                    {/* Crosshair Overlay */}
                    <circle cx="200" cy="120" r="18" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="190" y1="120" x2="210" y2="120" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1" />
                    <line x1="200" y1="110" x2="200" y2="130" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1" />
                  </svg>
                ) : (
                  /* River / Canal Water Gate Simulation */
                  <svg viewBox="0 0 400 240" className="cctv-scene-svg" aria-label="River CCTV Stream View">
                    <defs>
                      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#334155" />
                      </linearGradient>
                      <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284c7" />
                        <stop offset="100%" stopColor="#0369a1" />
                      </linearGradient>
                    </defs>
                    <rect width="400" height="140" fill="url(#skyGrad)" />
                    <path d="M 0,140 Q 200,120 400,140 L 400,240 L 0,240 Z" fill="url(#waterGrad)" />
                    <rect x="160" y="70" width="80" height="90" fill="#475569" rx="4" />
                    <rect x="175" y="85" width="50" height="60" fill="#0f172a" rx="2" />
                    <rect x="280" y="80" width="12" height="110" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
                    <line x1="280" y1="100" x2="292" y2="100" stroke="#ef4444" strokeWidth="2" />
                    <line x1="280" y1="130" x2="292" y2="130" stroke="#eab308" strokeWidth="2" />
                    <line x1="280" y1="160" x2="292" y2="160" stroke="#10b981" strokeWidth="2" />
                    <text x="298" y="103" fill="#fca5a5" fontSize="8" fontWeight="bold">CRITICAL</text>
                    <text x="298" y="133" fill="#fef08a" fontSize="8" fontWeight="bold">WARNING</text>
                    <text x="298" y="163" fill="#86efac" fontSize="8" fontWeight="bold">NORMAL</text>
                    <circle cx="200" cy="120" r="18" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="190" y1="120" x2="210" y2="120" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1" />
                    <line x1="200" y1="110" x2="200" y2="130" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1" />
                  </svg>
                )}
              </div>
              <div className="cctv-hud-bottom">
                <span>CAM-ID: {station.id.toUpperCase()}</span>
                <span>LAT: {station.latitude.toFixed(4)} LON: {station.longitude.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div className="cctv-meta-grid">
            <div className="cctv-stat-card">
              <small>{isCoastal ? 'ระดับน้ำทะเล / น้ำขึ้น (Tide Level)' : 'ระดับน้ำปัจจุบัน (Water Level)'}</small>
              <strong>
                {station.waterLevelMsl.toFixed(2)}{' '}
                <span className="unit">{isCoastal ? 'ม.' : 'ม.รทก.'}</span>
              </strong>
              <div className="cctv-bar-track">
                <div
                  className={`cctv-bar-fill ${station.waterLevelStatus === 'CRITICAL' ? 'cctv-bar--danger' : station.waterLevelStatus === 'WARNING' ? 'cctv-bar--warning' : 'cctv-bar--normal'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <small>
                {isCoastal
                  ? `เกณฑ์เฝ้าระวังน้ำหนุน: ${station.bankLevelMsl.toFixed(2)} ม.`
                  : `${percentage}% ของความจุตลิ่ง (ตลิ่ง: ${station.bankLevelMsl.toFixed(2)} ม.รทก.)`}
              </small>
            </div>

            <div className="cctv-stat-card">
              <small>{isCoastal ? 'ความสูงคลื่นนัยสำคัญ & สภาพทะเล' : 'สถานะกล้องโทรมาตร (Status)'}</small>
              {isCoastal && station.waveHeightM !== undefined ? (
                <div>
                  <strong style={{ color: '#38bdf8' }}>~{station.waveHeightM.toFixed(1)} <span className="unit">เมตร</span></strong>
                  <div style={{ marginTop: '2px' }}>
                    <small style={{ color: '#10b981' }}>● ทะเลมีคลื่นเล็กน้อยถึงปานกลาง</small>
                  </div>
                </div>
              ) : (
                <div>
                  <strong className="status-online">● {station.status}</strong>
                  <div><small>เชื่อมต่อเครือข่ายโทรมาตรสมบูรณ์</small></div>
                </div>
              )}
              <small style={{ marginTop: '4px', display: 'block' }}>หน่วยงาน: {station.providerNameTh}</small>
            </div>
          </div>

          <div className="cctv-provenance-note">
            <small>📌 แหล่งที่มา: {station.sourceAttribution}</small>
          </div>
        </div>

        <footer className="cctv-modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            ปิดหน้าต่าง
          </button>
        </footer>
      </div>
    </div>
  );
}
