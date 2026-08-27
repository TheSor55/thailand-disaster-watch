import { useState } from 'react';
import { BcmReportModal } from './BcmReportModal';

export interface PinnedSite {
  id: string;
  name: string;
  address?: string;
  category: 'FACTORY' | 'WAREHOUSE' | 'ESTATE' | 'OFFICE';
  province: string;
  latitude: number;
  longitude: number;
  rainRisk: 'LOW' | 'MODERATE' | 'HIGH';
  floodRisk: 'NORMAL' | 'WATCH' | 'HIGH';
  damProximity: string;
}

const INITIAL_SITES: PinnedSite[] = [
  // 1. สำนักงานและโรงงาน (Offices & Factories)
  {
    id: 'site-petchsiam',
    name: 'บริษัท เพชรสยามประเทศไทย จำกัด',
    address: 'ซอยพระยามนธาตุฯ แยก 9 แขวงคลองบางบอน เขตบางบอน กรุงเทพมหานคร',
    category: 'FACTORY',
    province: 'กรุงเทพมหานคร',
    latitude: 13.6635,
    longitude: 100.4124,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำเจ้าพระยาตอนล่าง / คลองบางบอน (กทม.)',
  },
  {
    id: 'site-salee-industry',
    name: 'บริษัท สาลี่อุตสาหกรรม จำกัด (มหาชน)',
    address: 'ตำบลคลองสี่ อำเภอคลองหลวง จังหวัดปทุมธานี',
    category: 'FACTORY',
    province: 'ปทุมธานี',
    latitude: 14.0758,
    longitude: 100.6865,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำเจ้าพระยา-ป่าสัก (ทุ่งรังสิต คลองสี่)',
  },

  // 2. คลังสินค้า (Distribution Centers - DC)
  {
    id: 'site-dc-bigc',
    name: 'DC - BigC (ศูนย์กระจายสินค้า บิ๊กซี)',
    address: 'อำเภอวังน้อย จังหวัดพระนครศรีอยุธยา',
    category: 'WAREHOUSE',
    province: 'พระนครศรีอยุธยา',
    latitude: 14.2340,
    longitude: 100.7180,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำเจ้าพระยา-ป่าสัก (วังน้อย อยุธยา)',
  },
  {
    id: 'site-dc-lotus',
    name: 'DC - Lotus (ศูนย์กระจายสินค้า โลตัส)',
    address: 'อำเภอวังน้อย จังหวัดพระนครศรีอยุธยา',
    category: 'WAREHOUSE',
    province: 'พระนครศรีอยุธยา',
    latitude: 14.2250,
    longitude: 100.7120,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำเจ้าพระยา-ป่าสัก (วังน้อย อยุธยา)',
  },
  {
    id: 'site-dc-makro',
    name: 'DC - Makro (ศูนย์กระจายสินค้า แม็คโคร)',
    address: 'อำเภอวังน้อย จังหวัดพระนครศรีอยุธยา',
    category: 'WAREHOUSE',
    province: 'พระนครศรีอยุธยา',
    latitude: 14.2385,
    longitude: 100.7250,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำเจ้าพระยา-ป่าสัก (วังน้อย อยุธยา)',
  },
  {
    id: 'site-dc-thaiwatsadu',
    name: 'DC - ไทวัสดุ (ศูนย์กระจายสินค้า ไทวัสดุ)',
    address: 'อำเภอวังน้อย จังหวัดพระนครศรีอยุธยา',
    category: 'WAREHOUSE',
    province: 'พระนครศรีอยุธยา',
    latitude: 14.2150,
    longitude: 100.7050,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำเจ้าพระยา-ป่าสัก (วังน้อย อยุธยา)',
  },
  {
    id: 'site-dc-homepro',
    name: 'DC - Homepro (ศูนย์กระจายสินค้า โฮมโปร)',
    address: 'อำเภอวังน้อย จังหวัดพระนครศรีอยุธยา',
    category: 'WAREHOUSE',
    province: 'พระนครศรีอยุธยา',
    latitude: 14.2280,
    longitude: 100.7190,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำเจ้าพระยา-ป่าสัก (วังน้อย อยุธยา)',
  },

  // 3. โซนนิคมอุตสาหกรรม (Industrial Estates - นิคมฯ สำคัญ)
  {
    id: 'site-ie-bangkadi',
    name: 'นิคมฯ บางกะดี่ ปทุมธานี (สวนอุตสาหกรรมบางกะดี่)',
    address: 'ตำบลบางกะดี่ อำเภอเมือง จังหวัดปทุมธานี',
    category: 'ESTATE',
    province: 'ปทุมธานี',
    latitude: 13.9912,
    longitude: 100.5605,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'แม่น้ำเจ้าพระยา (ฝั่งตะวันออก ปทุมธานี)',
  },
  {
    id: 'site-ie-amata-chonburi',
    name: 'นิคมฯ อมตะซิตี้ ชลบุรี',
    address: 'ตำบลคลองตำหรุ อำเภอเมือง จังหวัดชลบุรี',
    category: 'ESTATE',
    province: 'ชลบุรี',
    latitude: 13.4214,
    longitude: 101.0145,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'เขื่อนบางพระ (72 MCM, 62%)',
  },
  {
    id: 'site-ie-hitech',
    name: 'นิคมฯ ไฮเทค บางปะอิน อยุธยา (Hi-Tech)',
    address: 'ตำบลบ้านหว้า อำเภอบางปะอิน จังหวัดพระนครศรีอยุธยา',
    category: 'ESTATE',
    province: 'พระนครศรีอยุธยา',
    latitude: 14.2560,
    longitude: 100.6010,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'แม่น้ำเจ้าพระยา (บางปะอิน) / ท้ายเขื่อนเจ้าพระยา',
  },
  {
    id: 'site-ie-bangpain',
    name: 'นิคมฯ บางปะอิน อยุธยา',
    address: 'ตำบลคลองจิก อำเภอบางปะอิน จังหวัดพระนครศรีอยุธยา',
    category: 'ESTATE',
    province: 'พระนครศรีอยุธยา',
    latitude: 14.2230,
    longitude: 100.5840,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'แม่น้ำเจ้าพระยา (บางปะอิน) / สถานีบางไทร',
  },
  {
    id: 'site-ie-rojana',
    name: 'นิคมฯ โรจนะ อยุธยา (สวนอุตสาหกรรมโรจนะ)',
    address: 'ตำบลคานหาม อำเภออุทัย จังหวัดพระนครศรีอยุธยา',
    category: 'ESTATE',
    province: 'พระนครศรีอยุธยา',
    latitude: 14.3310,
    longitude: 100.6480,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'แม่น้ำป่าสัก / คลองข้าวเม่า (อยุธยา)',
  },
  {
    id: 'site-ie-esie',
    name: 'นิคมฯ ESIE ปลวกแดง ระยอง (Eastern Seaboard)',
    address: 'ตำบลปลวกแดง อำเภอปลวกแดง จังหวัดระยอง',
    category: 'ESTATE',
    province: 'ระยอง',
    latitude: 13.0120,
    longitude: 101.1620,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'อ่างเก็บน้ำหนองปลาไหล (163 MCM) / ลุ่มน้ำระยอง',
  },
  {
    id: 'site-ie-pinthong1',
    name: 'นิคมฯ ปิ่นทอง 1 ศรีราชา ชลบุรี',
    address: 'ตำบลหนองขาม อำเภอศรีราชา จังหวัดชลบุรี',
    category: 'ESTATE',
    province: 'ชลบุรี',
    latitude: 13.1380,
    longitude: 100.9980,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'อ่างเก็บน้ำบางพระ (ชลบุรี)',
  },
  {
    id: 'site-ie-pinthong2',
    name: 'นิคมฯ ปิ่นทอง 2 ศรีราชา ชลบุรี',
    address: 'ตำบลหนองขาม อำเภอศรีราชา จังหวัดชลบุรี',
    category: 'ESTATE',
    province: 'ชลบุรี',
    latitude: 13.1150,
    longitude: 101.0350,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'อ่างเก็บน้ำหนองค้อ (ชลบุรี)',
  },
  {
    id: 'site-ie-pinthong3',
    name: 'นิคมฯ ปิ่นทอง 3 ศรีราชา ชลบุรี',
    address: 'ตำบลบ่อวิน อำเภอศรีราชา จังหวัดชลบุรี',
    category: 'ESTATE',
    province: 'ชลบุรี',
    latitude: 13.0860,
    longitude: 101.0820,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'อ่างเก็บน้ำหนองค้อ / บ่อวิน (ชลบุรี)',
  },
];

interface MySitesPanelProps {
  onSelectSite?: (site: PinnedSite) => void;
  onCheckWeather?: (site: PinnedSite) => void;
}

export function MySitesPanel({ onSelectSite, onCheckWeather }: MySitesPanelProps) {
  const [sites] = useState<PinnedSite[]>(INITIAL_SITES);
  const [filter, setFilter] = useState<'ALL' | 'FACTORY' | 'WAREHOUSE' | 'ESTATE'>('ALL');
  const [activeBcmSite, setActiveBcmSite] = useState<PinnedSite | null>(null);

  const filteredSites =
    filter === 'ALL'
      ? sites
      : filter === 'FACTORY'
      ? sites.filter((s) => s.category === 'FACTORY' || s.category === 'OFFICE')
      : sites.filter((s) => s.category === filter);

  const countAll = sites.length;
  const countFactory = sites.filter((s) => s.category === 'FACTORY' || s.category === 'OFFICE').length;
  const countWarehouse = sites.filter((s) => s.category === 'WAREHOUSE').length;
  const countEstate = sites.filter((s) => s.category === 'ESTATE').length;

  return (
    <section className="panel mysites-panel" aria-label="My Sites Asset Monitoring">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">ENTERPRISE ASSET RISK MONITORING</span>
          <h2>📍 พื้นที่เฝ้าระวังของฉัน (My Strategic Sites)</h2>
        </div>
        <span className="status-chip status-chip--dev-preview">BCM &amp; TELEMETRY READY</span>
      </div>

      {/* Filter tabs */}
      <div className="mysites-filter-tabs" role="tablist" aria-label="หมวดหมู่พื้นที่เฝ้าระวัง">
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'ALL'}
          className={`mysites-tab ${filter === 'ALL' ? 'is-active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          <span>ทั้งหมด</span>
          <span className="mysites-tab__count">{countAll}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'FACTORY'}
          className={`mysites-tab ${filter === 'FACTORY' ? 'is-active' : ''}`}
          onClick={() => setFilter('FACTORY')}
        >
          <span>🏭 สำนักงาน &amp; โรงงาน</span>
          <span className="mysites-tab__count">{countFactory}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'WAREHOUSE'}
          className={`mysites-tab ${filter === 'WAREHOUSE' ? 'is-active' : ''}`}
          onClick={() => setFilter('WAREHOUSE')}
        >
          <span>📦 คลังสินค้า DC</span>
          <span className="mysites-tab__count">{countWarehouse}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'ESTATE'}
          className={`mysites-tab ${filter === 'ESTATE' ? 'is-active' : ''}`}
          onClick={() => setFilter('ESTATE')}
        >
          <span>🏗️ โซนนิคมอุตสาหกรรม</span>
          <span className="mysites-tab__count">{countEstate}</span>
        </button>
      </div>

      {/* Sites list */}
      <div className="mysites-list">
        {filteredSites.map((site) => {
          const rainBadgeClass =
            site.rainRisk === 'HIGH' ? 'danger' : site.rainRisk === 'MODERATE' ? 'warning' : 'safe';
          const floodBadgeClass =
            site.floodRisk === 'HIGH' ? 'danger' : site.floodRisk === 'WATCH' ? 'warning' : 'safe';

          const categoryTag =
            site.category === 'FACTORY'
              ? 'โรงงาน / สำนักงาน'
              : site.category === 'WAREHOUSE'
              ? 'คลังสินค้า DC'
              : site.category === 'ESTATE'
              ? 'นิคมอุตสาหกรรม'
              : 'สำนักงาน';

          return (
            <article
              key={site.id}
              className="mysite-item"
              onClick={() => onSelectSite?.(site)}
              role="button"
              tabIndex={0}
              aria-label={`เฝ้าระวังพื้นที่ ${site.name}`}
            >
              <div className="mysite-item__header">
                <div>
                  <strong className="mysite-name">{site.name}</strong>
                  {site.address && <p className="mysite-address">{site.address}</p>}
                  <span className="mysite-prov">จ.{site.province}</span>
                </div>
                <span className="mysite-cat">{categoryTag}</span>
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

              <div className="mysite-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="btn-site-action btn-site-action--map"
                  onClick={() => onSelectSite?.(site)}
                >
                  🗺️ ดูบนแผนที่ GIS
                </button>
                {onCheckWeather && (
                  <button
                    type="button"
                    className="btn-site-action btn-site-action--weather"
                    onClick={() => onCheckWeather(site)}
                  >
                    🌤️ ตรวจสภาพอากาศ
                  </button>
                )}
                <button
                  type="button"
                  className="btn-site-action btn-site-action--bcm"
                  onClick={() => setActiveBcmSite(site)}
                >
                  📄 สรุปรายงาน BCM
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* BCM Report Executive Modal */}
      {activeBcmSite && (
        <BcmReportModal
          site={activeBcmSite}
          onClose={() => setActiveBcmSite(null)}
        />
      )}
    </section>
  );
}
