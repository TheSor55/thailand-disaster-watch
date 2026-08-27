import { useState } from 'react';
import type { CctvStation } from '../../domain/cctv';
import { CctvModal } from './CctvModal';

interface CctvPanelProps {
  stations: readonly CctvStation[];
  provinceNameTh: string;
}

export function CctvPanel({ stations, provinceNameTh }: CctvPanelProps) {
  const [selectedStation, setSelectedStation] = useState<CctvStation | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'INLAND' | 'COASTAL'>('ALL');
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(() =>
    new Date().toLocaleTimeString('th-TH')
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredStations = stations.filter((station) => {
    if (filterType === 'COASTAL') {
      return station.category === 'COASTAL_GULF' || station.category === 'COASTAL_ANDAMAN';
    }
    if (filterType === 'INLAND') {
      return station.category === 'RIVER' || station.category === 'CANAL' || station.category === 'DAM';
    }
    return true;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshedAt(new Date().toLocaleTimeString('th-TH'));
      setIsRefreshing(false);
    }, 450);
  };

  return (
    <section className="panel cctv-station-panel" aria-label="CCTV Watch">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">GROUND TRUTH &amp; TELEMETRY</span>
          <h2>📹 CCTV &amp; ระดับน้ำ ({provinceNameTh})</h2>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-refresh-telemetry"
            onClick={handleRefresh}
            title="รีเฟรชค่าระดับน้ำโทรมาตรเรียลไทม์"
            disabled={isRefreshing}
          >
            <span className={isRefreshing ? 'is-spinning' : ''}>🔄</span>
            <small>{lastRefreshedAt}</small>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="cctv-filter-tabs" role="tablist" aria-label="กรองประเภทสถานี CCTV">
        <button
          type="button"
          className={`cctv-tab-btn ${filterType === 'ALL' ? 'is-active' : ''}`}
          onClick={() => setFilterType('ALL')}
        >
          ทั้งหมด ({stations.length})
        </button>
        <button
          type="button"
          className={`cctv-tab-btn ${filterType === 'COASTAL' ? 'is-active' : ''}`}
          onClick={() => setFilterType('COASTAL')}
        >
          🌊 ชายหาด/อ่าวไทย-อันดามัน
        </button>
        <button
          type="button"
          className={`cctv-tab-btn ${filterType === 'INLAND' ? 'is-active' : ''}`}
          onClick={() => setFilterType('INLAND')}
        >
          🏞️ แม่น้ำ/คลองระบายน้ำ
        </button>
      </div>

      {filteredStations.length === 0 ? (
        <div className="empty-state">
          <span aria-hidden="true">📹</span>
          <p>ไม่มีจุดตรวจวัดในหมวดหมู่นี้ในพื้นที่ {provinceNameTh}</p>
        </div>
      ) : (
        <div className="cctv-station-list">
          {filteredStations.map((station) => {
            const isCoastal = station.category === 'COASTAL_GULF' || station.category === 'COASTAL_ANDAMAN';
            return (
              <article key={station.id} className="cctv-card">
                <div className="cctv-card-header">
                  <div>
                    <span className="cctv-category-badge">{station.categoryLabelTh}</span>
                    <h4>{station.nameTh}</h4>
                    <small>{station.waterwayTh} · {station.provinceNameTh}</small>
                  </div>
                  <span className={`cctv-status-tag cctv-status--${station.waterLevelStatus.toLowerCase()}`}>
                    {station.waterLevelStatus}
                  </span>
                </div>

                <div className="cctv-card-body">
                  <div className="cctv-thumbnail-preview" onClick={() => setSelectedStation(station)} role="button" tabIndex={0}>
                    <div className="cctv-thumb-overlay">
                      <span>● สด {station.waterLevelMsl.toFixed(2)} ม.</span>
                      <small>กดเพื่อดูภาพขยาย 🔍</small>
                    </div>
                  </div>

                  <div className="cctv-card-meta">
                    <div className="cctv-meta-row">
                      <span>{isCoastal ? 'ระดับน้ำทะเล/น้ำขึ้น:' : 'ระดับน้ำปัจจุบัน:'}</span>
                      <strong>{station.waterLevelMsl.toFixed(2)} {isCoastal ? 'ม.' : 'ม.รทก.'}</strong>
                    </div>
                    {isCoastal && station.waveHeightM !== undefined ? (
                      <div className="cctv-meta-row">
                        <span>ความสูงคลื่นนัยสำคัญ:</span>
                        <strong style={{ color: '#38bdf8' }}>~{station.waveHeightM.toFixed(1)} เมตร</strong>
                      </div>
                    ) : (
                      <div className="cctv-meta-row">
                        <span>ระดับตลิ่งเฝ้าระวัง:</span>
                        <span>{station.bankLevelMsl.toFixed(2)} ม.รทก.</span>
                      </div>
                    )}
                    <div className="cctv-meta-row">
                      <span>หน่วยงานกำกับดูแล:</span>
                      <small>{station.providerNameTh}</small>
                    </div>
                  </div>
                </div>

                <div className="cctv-card-footer">
                  <button
                    type="button"
                    className="btn-cctv-inspect"
                    onClick={() => setSelectedStation(station)}
                  >
                    🔍 ดูภาพมุมกล้องและโทรมาตรระดับน้ำ
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedStation && (
        <CctvModal
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
        />
      )}
    </section>
  );
}
