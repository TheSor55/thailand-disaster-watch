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
  // 1. สำนักงานและโรงงาน (Offices & Factories — ในเครือสาลี่ และเพชรสยาม)
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
  {
    id: 'site-salee-printing',
    name: 'บริษัท สาลี่ พริ้นท์ติ้ง จำกัด (มหาชน)',
    address: '19 หมู่ 10 ตำบลคลองสี่ อำเภอคลองหลวง จังหวัดปทุมธานี',
    category: 'FACTORY',
    province: 'ปทุมธานี',
    latitude: 14.1047,
    longitude: 100.6891,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำเจ้าพระยา-ป่าสัก (ทุ่งรังสิต คลองสี่ ปทุมธานี)',
  },
  {
    id: 'site-salee-colour',
    name: 'บริษัท สาลี่ คัลเล่อร์ จำกัด (มหาชน)',
    address: '858 หมู่ 2 ซอย 1C/1 นิคมอุตสาหกรรมบางปู ตำบลบางปูใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ',
    category: 'FACTORY',
    province: 'สมุทรปราการ',
    latitude: 13.5285,
    longitude: 100.6582,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำเจ้าพระยาตอนล่าง / อ่าวไทย (นิคมฯ บางปู)',
  },

  // 2. คลังสินค้า (Distribution Centers & Modern Trade Logistics)
  {
    id: 'site-dc-gowow',
    name: 'DC - Go! WOW / Central Retail (CRC)',
    address: 'อำเภอบางบัวทอง จังหวัดนนทบุรี (ลูกค้าเพชรสยาม)',
    category: 'WAREHOUSE',
    province: 'นนทบุรี',
    latitude: 13.9210,
    longitude: 100.4120,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำเจ้าพระยาฝั่งตะวันตก (บางบัวทอง นนทบุรี)',
  },
  {
    id: 'site-dc-cjmore',
    name: 'DC - CJ MORE / CJ Express (ซีเจ มอร์)',
    address: 'อำเภอกระทุ่มแบน จังหวัดสมุทรสาคร (ลูกค้าเพชรสยาม)',
    category: 'WAREHOUSE',
    province: 'สมุทรสาคร',
    latitude: 13.6550,
    longitude: 100.2850,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำท่าจีน / คลองภาษีเจริญ (กระทุ่มแบน)',
  },
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
  {
    id: 'site-dc-megahome',
    name: 'DC - Mega Home (ศูนย์กระจายสินค้า เมกาโฮม)',
    address: 'อำเภอวังน้อย จังหวัดพระนครศรีอยุธยา',
    category: 'WAREHOUSE',
    province: 'พระนครศรีอยุธยา',
    latitude: 14.2260,
    longitude: 100.7150,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำเจ้าพระยา-ป่าสัก (วังน้อย อยุธยา)',
  },
  {
    id: 'site-dc-dohome',
    name: 'DC - DoHome (ศูนย์กระจายสินค้า ดูโฮม รังสิต)',
    address: 'ตำบลคลองเจ็ด อำเภอคลองหลวง จังหวัดปทุมธานี',
    category: 'WAREHOUSE',
    province: 'ปทุมธานี',
    latitude: 14.0620,
    longitude: 100.7550,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำเจ้าพระยา-รังสิต (คลองเจ็ด ปทุมธานี)',
  },
  {
    id: 'site-rdc-lotus-khonkaen',
    name: 'RDC - Lotus ขอนแก่น (Hub ภาคอีสาน)',
    address: 'ตำบลท่าพระ อำเภอเมือง จังหวัดขอนแก่น',
    category: 'WAREHOUSE',
    province: 'ขอนแก่น',
    latitude: 16.3350,
    longitude: 102.8120,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำชี (เขื่อนอุบลรัตน์ / ขอนแก่น)',
  },
  {
    id: 'site-rdc-lotus-surat',
    name: 'RDC - Lotus สุราษฎร์ธานี (Hub ภาคใต้)',
    address: 'อำเภอพุนพิน จังหวัดสุราษฎร์ธานี',
    category: 'WAREHOUSE',
    province: 'สุราษฎร์ธานี',
    latitude: 9.1120,
    longitude: 99.2310,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำตาปี (เขื่อนรัชชประภา / สุราษฎร์ธานี)',
  },
  {
    id: 'site-rdc-cpall-lamphun',
    name: 'RDC - CP ALL / Lotus ลำพูน (Hub ภาคเหนือ)',
    address: 'ตำบลหนองหนาม อำเภอเมือง จังหวัดลำพูน',
    category: 'WAREHOUSE',
    province: 'ลำพูน',
    latitude: 18.5240,
    longitude: 99.0120,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำกวง-ปิง (เขื่อนแม่กวงอุดมธารา / ลำพูน)',
  },

  // 3. โซนนิคมอุตสาหกรรม (Industrial Estates & Parks)
  {
    id: 'site-ie-304-prachinburi',
    name: 'นิคมฯ 304 ปราจีนบุรี (304 Industrial Park)',
    address: 'ตำบลท่าตูม อำเภอศรีมหาโพธิ จังหวัดปราจีนบุรี',
    category: 'ESTATE',
    province: 'ปราจีนบุรี',
    latitude: 13.9142,
    longitude: 101.5540,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำปราจีนบุรี / อ่างเก็บน้ำนฤบดินทรจินดา',
  },
  {
    id: 'site-ie-maptaphut',
    name: 'นิคมฯ มาบตาพุด ระยอง (Map Ta Phut)',
    address: 'ตำบลมาบตาพุด อำเภอเมืองระยอง จังหวัดระยอง',
    category: 'ESTATE',
    province: 'ระยอง',
    latitude: 12.7150,
    longitude: 101.1620,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'อ่างเก็บน้ำดอกกราย / หนองปลาไหล (ระยอง)',
  },
  {
    id: 'site-ie-laemchabang',
    name: 'นิคมฯ แหลมฉบัง ศรีราชา ชลบุรี',
    address: 'ตำบลทุ่งสุขลา อำเภอศรีราชา จังหวัดชลบุรี',
    category: 'ESTATE',
    province: 'ชลบุรี',
    latitude: 13.0780,
    longitude: 100.9150,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'อ่าวไทย / ลุ่มน้ำชายฝั่งทะเลชลบุรี (แหลมฉบัง)',
  },
  {
    id: 'site-ie-sahagroup-sriracha',
    name: 'สวนอุตสาหกรรมเครือสหพัฒน์ ศรีราชา',
    address: 'ตำบลหนองขาม อำเภอศรีราชา จังหวัดชลบุรี',
    category: 'ESTATE',
    province: 'ชลบุรี',
    latitude: 13.1150,
    longitude: 100.9750,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'อ่างเก็บน้ำบางพระ (ชลบุรี)',
  },
  {
    id: 'site-ie-wellgrow',
    name: 'นิคมฯ เวลโกรว์ บางปะกง (Wellgrow)',
    address: 'ตำบลบางวัว อำเภอบางปะกง จังหวัดฉะเชิงเทรา',
    category: 'ESTATE',
    province: 'ฉะเชิงเทรา',
    latitude: 13.5650,
    longitude: 100.9520,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำบางปะกง (บางวัว ฉะเชิงเทรา)',
  },
  {
    id: 'site-ie-gateway',
    name: 'นิคมฯ เกตเวย์ ซิตี้ (Gateway City)',
    address: 'ตำบลหัวสำโรง อำเภอแปลงยาว จังหวัดฉะเชิงเทรา',
    category: 'ESTATE',
    province: 'ฉะเชิงเทรา',
    latitude: 13.6250,
    longitude: 101.3550,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'ลุ่มน้ำบางปะกง / คลองระบม (แปลงยาว ฉะเชิงเทรา)',
  },
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
  {
    id: 'site-ie-pinthong4',
    name: 'นิคมฯ ปิ่นทอง 4 ศรีราชา ชลบุรี',
    address: 'ตำบลบึง อำเภอศรีราชา จังหวัดชลบุรี',
    category: 'ESTATE',
    province: 'ชลบุรี',
    latitude: 13.0650,
    longitude: 101.0350,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'อ่างเก็บน้ำหนองค้อ / บึง (ชลบุรี)',
  },
  {
    id: 'site-ie-pinthong5',
    name: 'นิคมฯ ปิ่นทอง 5 ศรีราชา ชลบุรี',
    address: 'ตำบลเขาคันทรง อำเภอศรีราชา จังหวัดชลบุรี',
    category: 'ESTATE',
    province: 'ชลบุรี',
    latitude: 13.1180,
    longitude: 101.1450,
    rainRisk: 'LOW',
    floodRisk: 'NORMAL',
    damProximity: 'อ่างเก็บน้ำห้วยสะพาน / เขาคันทรง (ชลบุรี)',
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
