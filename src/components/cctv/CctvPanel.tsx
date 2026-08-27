import { useState } from 'react';
import type { CctvStation } from '../../domain/cctv';
import { CctvModal } from './CctvModal';

interface CctvPanelProps {
  stations: readonly CctvStation[];
  provinceNameTh: string;
}

export function CctvPanel({ stations, provinceNameTh }: CctvPanelProps) {
  const [selectedStation, setSelectedStation] = useState<CctvStation | null>(null);

  return (
    <section className="panel cctv-station-panel" aria-label="CCTV Watch">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">GROUND TRUTH MONITORING</span>
          <h2>📹 CCTV Watch ({provinceNameTh})</h2>
        </div>
        <span className="panel-count">{stations.length} จุดตรวจ</span>
      </div>

      {stations.length === 0 ? (
        <div className="empty-state">
          <span aria-hidden="true">📹</span>
          <p>ไม่มีจุดกล้อง CCTV ตรวจระดับน้ำที่บันทึกไว้ในพื้นที่ {provinceNameTh}</p>
        </div>
      ) : (
        <div className="cctv-station-list">
          {stations.map((station) => (
            <article key={station.id} className="cctv-card">
              <div className="cctv-card-header">
                <div>
                  <h4>{station.nameTh}</h4>
                  <small>{station.waterwayTh}</small>
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
                    <span>ระดับน้ำ:</span>
                    <strong>{station.waterLevelMsl.toFixed(2)} ม.รทก.</strong>
                  </div>
                  <div className="cctv-meta-row">
                    <span>ตลิ่ง:</span>
                    <span>{station.bankLevelMsl.toFixed(2)} ม.รทก.</span>
                  </div>
                  <div className="cctv-meta-row">
                    <span>หน่วยงาน:</span>
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
                  🔍 ดูภาพสดและมาตรวัดระดับน้ำ
                </button>
              </div>
            </article>
          ))}
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
