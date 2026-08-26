import { useState } from 'react';

export interface PinnedSite {
  id: string;
  name: string;
  category: 'FACTORY' | 'WAREHOUSE' | 'OFFICE' | 'RETAIL';
  province: string;
  latitude: number;
  longitude: number;
  rainRisk: 'LOW' | 'MODERATE' | 'HIGH';
  floodRisk: 'NORMAL' | 'WATCH' | 'HIGH';
  damProximity: string;
}

const INITIAL_SITES: PinnedSite[] = [
  {
    id: 'site-amata-chonburi',
    name: 'นิคมอุตสาหกรรมอมตะซิตี้ ชลบุรี',
    category: 'FACTORY',
    province: 'ชลบุรี',
    latitude: 13.4214,
    longitude: 101.0145,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'เขื่อนบางพระ (72 MCM, 62%)',
  },
  {
    id: 'site-khonkaen-plant',
    name: 'โรงงานแปรรูปขอนแก่น (ท่าพระ)',
    category: 'FACTORY',
    province: 'ขอนแก่น',
    latitude: 16.3312,
    longitude: 102.8124,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'เขื่อนอุบลรัตน์ (1,482 MCM, 61%)',
  },
  {
    id: 'site-bangplee-dc',
    name: 'ศูนย์กระจายสินค้า บางพลี',
    category: 'WAREHOUSE',
    province: 'สมุทรปราการ',
    latitude: 13.6042,
    longitude: 100.7012,
    rainRisk: 'MODERATE',
    floodRisk: 'WATCH',
    damProximity: 'ท้ายน้ำลุ่มน้ำเจ้าพระยา',
  },
  {
    id: 'site-chiangmai-hub',
    name: 'สำนักงานภาคเหนือ (เชียงใหม่)',
    category: 'OFFICE',
    province: 'เชียงใหม่',
    latitude: 18.7953,
    longitude: 98.962,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'เขื่อนแม่งัด (185 MCM, 70%)',
  },
];

interface MySitesPanelProps {
  onSelectSite?: (site: PinnedSite) => void;
}

export function MySitesPanel({ onSelectSite }: MySitesPanelProps) {
  const [sites] = useState<PinnedSite[]>(INITIAL_SITES);
  const [filter, setFilter] = useState<'ALL' | 'FACTORY' | 'WAREHOUSE' | 'OFFICE'>('ALL');

  const filteredSites = filter === 'ALL' ? sites : sites.filter((s) => s.category === filter);

  return (
    <section className="panel mysites-panel" aria-label="My Sites Asset Monitoring">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">ASSET RISK MONITORING</span>
          <h2>📍 พื้นที่เฝ้าระวังของฉัน (My Sites)</h2>
        </div>
        <span className="status-chip status-chip--dev-preview">PROTOTYPE</span>
      </div>

      {/* Filter tabs */}
      <div className="mysites-filter-tabs">
        {(['ALL', 'FACTORY', 'WAREHOUSE', 'OFFICE'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            className={`mysites-tab ${filter === cat ? 'is-active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'ALL' ? 'ทั้งหมด' : cat === 'FACTORY' ? 'โรงงาน' : cat === 'WAREHOUSE' ? 'คลังสินค้า' : 'สำนักงาน'}
          </button>
        ))}
      </div>

      {/* Sites list */}
      <div className="mysites-list">
        {filteredSites.map((site) => {
          const rainBadgeClass =
            site.rainRisk === 'HIGH' ? 'danger' : site.rainRisk === 'MODERATE' ? 'warning' : 'safe';
          const floodBadgeClass =
            site.floodRisk === 'HIGH' ? 'danger' : site.floodRisk === 'WATCH' ? 'warning' : 'safe';

          return (
            <article
              key={site.id}
              className="mysite-item"
              onClick={() => onSelectSite?.(site)}
              role="button"
              tabIndex={0}
            >
              <div className="mysite-item__header">
                <div>
                  <strong className="mysite-name">{site.name}</strong>
                  <span className="mysite-prov">จ.{site.province}</span>
                </div>
                <span className="mysite-cat">{site.category}</span>
              </div>

              <div className="mysite-badges">
                <span className={`risk-pill risk-pill--${rainBadgeClass}`}>
                  ฝน: {site.rainRisk === 'HIGH' ? 'เสี่ยงสูง' : site.rainRisk === 'MODERATE' ? 'เฝ้าระวัง' : 'ปกติ'}
                </span>
                <span className={`risk-pill risk-pill--${floodBadgeClass}`}>
                  น้ำท่วม: {site.floodRisk === 'HIGH' ? 'เสี่ยงสูง' : site.floodRisk === 'WATCH' ? 'เฝ้าระวัง' : 'ปกติ'}
                </span>
              </div>

              <div className="mysite-proximity">
                <small>เขื่อน/ลุ่มน้ำ:</small>
                <span>{site.damProximity}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
