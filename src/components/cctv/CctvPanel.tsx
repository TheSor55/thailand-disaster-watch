import { useState } from 'react';
import type { CctvStation } from '../../domain/cctv';
import { CctvModal } from './CctvModal';

interface CctvPanelProps {
  stations: readonly CctvStation[];
  provinceNameTh: string;
}

const THAIWATER_CCTV_URL = 'https://twa.thaiwater.net/th/map/basic/cctv/overall/0?p=modal&c=102.50313%2C15.83422%2C4.849z';

export function CctvPanel({ stations, provinceNameTh }: CctvPanelProps) {
  const [selectedStation, setSelectedStation] = useState<CctvStation | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'DAM' | 'INLAND' | 'COASTAL'>('ALL');
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(() =>
    new Date().toLocaleTimeString('th-TH')
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredStations = stations.filter((station) => {
    if (filterType === 'DAM') {
      return station.category === 'DAM';
    }
    if (filterType === 'COASTAL') {
      return station.category === 'COASTAL_GULF' || station.category === 'COASTAL_ANDAMAN';
    }
    if (filterType === 'INLAND') {
      return station.category === 'RIVER' || station.category === 'CANAL';
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
          <span className="eyebrow">GROUND TRUTH &amp; TELEMETRY · สสน. HII</span>
          <h2>📹 CCTV &amp; ระดับน้ำ ({provinceNameTh})</h2>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <a
            href={THAIWATER_CCTV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cctv-inspect"
            style={{ width: 'auto', padding: '4px 8px', fontSize: '0.62rem', textDecoration: 'none' }}
            title="เปิดกล้อง CCTV สดทั่วประเทศจาก สสน. (ThaiWater.net)"
          >
            📹 กล้อง สสน. ↗
          </a>
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
          className={`cctv-tab-btn ${filterType === 'DAM' ? 'is-active' : ''}`}
          onClick={() => setFilterType('DAM')}
        >
          🏞️ เขื่อน/อ่างเก็บน้ำ
        </button>
        <button
          type="button"
          className={`cctv-tab-btn ${filterType === 'INLAND' ? 'is-active' : ''}`}
          onClick={() => setFilterType('INLAND')}
        >
          🏞️ แม่น้ำ/คลองระบายน้ำ
        </button>
        <button
          type="button"
          className={`cctv-tab-btn ${filterType === 'COASTAL' ? 'is-active' : ''}`}
          onClick={() => setFilterType('COASTAL')}
        >
          🌊 ชายหาด/อ่าวไทย-อันดามัน
        </button>
      </div>

      {filteredStations.length === 0 ? (
        <div className="empty-state">
          <span aria-hidden="true">📹</span>
          <p>ไม่มีจุดตรวจวัดในหมวดหมู่นี้ในพื้นที่ {provinceNameTh}</p>
        </div>
      ) : (
        <div className="dam-table-container" style={{ marginTop: '8px' }}>
          <table className="dam-telemetry-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left', minWidth: '135px' }}>ชื่อสถานี</th>
                <th style={{ textAlign: 'center' }}>เวลา</th>
                <th style={{ textAlign: 'center' }}>ภาพ CCTV</th>
              </tr>
            </thead>
            <tbody>
              {filteredStations.map((station) => {
                return (
                  <tr key={station.id}>
                    <td style={{ textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.85rem' }}>📍</span>
                        <div>
                          <strong style={{ display: 'block', color: '#f8fafc', fontSize: '0.78rem' }}>{station.nameTh}</strong>
                          <small style={{ color: '#94a3b8', fontSize: '0.65rem' }}>{station.provinceNameTh}</small>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.7rem' }}>10:22</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedStation(station)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '16px',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          color: '#38bdf8',
                          background: 'rgba(56, 189, 248, 0.12)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          cursor: 'pointer',
                        }}
                        title={`ดูภาพมุมกล้องและโทรมาตรระดับน้ำ ${station.nameTh}`}
                        aria-label={`ดูภาพมุมกล้องและโทรมาตรระดับน้ำ ${station.nameTh}`}
                      >
                        ▶ ดูภาพ
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
