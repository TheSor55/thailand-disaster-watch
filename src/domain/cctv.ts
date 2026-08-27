/**
 * CCTV Water & Flood Monitoring Domain Model
 *
 * Source: Hydro-Informatics Institute (HII / ThaiWater), BMA Drainage Department, RID
 * Classification: TELEMETRY (ภาพถ่ายตรวจวัดระดับน้ำและโทรมาตร)
 * Authority: Official Government Observational Infrastructure
 */

export interface CctvStation {
  id: string;
  nameTh: string;
  nameEn: string;
  provinceNameTh: string;
  regionId: string;
  waterwayTh: string;
  latitude: number;
  longitude: number;
  provider: 'HII' | 'BMA' | 'RID' | 'DOH';
  providerNameTh: string;
  status: 'ONLINE' | 'MAINTENANCE' | 'OFFLINE';
  waterLevelStatus: 'NORMAL' | 'MONITORING' | 'WARNING' | 'CRITICAL';
  waterLevelMsl: number; // Level above Mean Sea Level (m MSL)
  bankLevelMsl: number; // River bank level (m MSL)
  updatedAt: string;
  imageUrl?: string;
  sourceAttribution: string;
}

export const OFFICIAL_CCTV_STATIONS: readonly CctvStation[] = [
  {
    id: 'cctv-bma-c301',
    nameTh: 'สถานีสูบน้ำคลองบางบอน (บางบอน)',
    nameEn: 'Khlong Bang Bon Pumping Station (Bang Bon)',
    provinceNameTh: 'กรุงเทพมหานคร',
    regionId: 'central',
    waterwayTh: 'คลองบางบอน / คลองภาษีเจริญ',
    latitude: 13.6624,
    longitude: 100.3951,
    provider: 'BMA',
    providerNameTh: 'สำนักการระบายน้ำ กรุงเทพมหานคร',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 0.85,
    bankLevelMsl: 1.80,
    updatedAt: new Date().toISOString(),
    sourceAttribution: 'สำนักการระบายน้ำ กรุงเทพมหานคร (BMA Flood Control Center)',
  },
  {
    id: 'cctv-hii-c29a',
    nameTh: 'สถานีตรวจวัดแม่น้ำเจ้าพระยา C.29A (บางไทร)',
    nameEn: 'Chao Phraya River Station C.29A (Bang Sai)',
    provinceNameTh: 'พระนครศรีอยุธยา',
    regionId: 'central',
    waterwayTh: 'แม่น้ำเจ้าพระยา',
    latitude: 14.1678,
    longitude: 100.5186,
    provider: 'HII',
    providerNameTh: 'สถาบันสารสนเทศทรัพยากรน้ำ (สสน.) / กรมชลประทาน',
    status: 'ONLINE',
    waterLevelStatus: 'MONITORING',
    waterLevelMsl: 2.15,
    bankLevelMsl: 3.50,
    updatedAt: new Date().toISOString(),
    sourceAttribution: 'คลังข้อมูลน้ำแห่งชาติ สสน. (HII ThaiWater)',
  },
  {
    id: 'cctv-rid-rangsit',
    nameTh: 'ประตูระบายน้ำจุฬาลงกรณ์ (คลองรังสิตประยูรศักดิ์)',
    nameEn: 'Chulalongkorn Water Gate (Khlong Rangsit)',
    provinceNameTh: 'ปทุมธานี',
    regionId: 'central',
    waterwayTh: 'คลองรังสิตประยูรศักดิ์ / แม่น้ำเจ้าพระยา',
    latitude: 13.9856,
    longitude: 100.6128,
    provider: 'RID',
    providerNameTh: 'กรมชลประทาน (โครงการส่งน้ำและบำรุงรักษารังสิตใต้)',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 1.10,
    bankLevelMsl: 2.20,
    updatedAt: new Date().toISOString(),
    sourceAttribution: 'กรมชลประทาน (Royal Irrigation Department)',
  },
  {
    id: 'cctv-hii-p1',
    nameTh: 'สถานีสะพานนวรัฐ P.1 (แม่น้ำปิง)',
    nameEn: 'Nawarat Bridge Station P.1 (Ping River)',
    provinceNameTh: 'เชียงใหม่',
    regionId: 'north',
    waterwayTh: 'แม่น้ำปิง',
    latitude: 18.7882,
    longitude: 99.0034,
    provider: 'HII',
    providerNameTh: 'สถาบันสารสนเทศทรัพยากรน้ำ (สสน.) / กรมชลประทาน',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 2.30,
    bankLevelMsl: 3.70,
    updatedAt: new Date().toISOString(),
    sourceAttribution: 'ศูนย์อุทกวิทยาภาคเหนือตอนบน กรมชลประทาน',
  },
  {
    id: 'cctv-hii-m7',
    nameTh: 'สถานีสะพานเสรีประชาธิปไตย M.7 (แม่น้ำมูล)',
    nameEn: 'Seri Democrat Bridge Station M.7 (Mun River)',
    provinceNameTh: 'อุบลราชธานี',
    regionId: 'northeast',
    waterwayTh: 'แม่น้ำมูล',
    latitude: 15.2287,
    longitude: 104.8583,
    provider: 'HII',
    providerNameTh: 'สถาบันสารสนเทศทรัพยากรน้ำ (สสน.)',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 110.45,
    bankLevelMsl: 112.00,
    updatedAt: new Date().toISOString(),
    sourceAttribution: 'คลังข้อมูลน้ำแห่งชาติ สสน. (HII ThaiWater)',
  },
  {
    id: 'cctv-rid-pasak',
    nameTh: 'ท้ายเขื่อนป่าสักชลสิทธิ์ (แม่น้ำป่าสัก)',
    nameEn: 'Pasak Jolasid Dam Spillway (Pasak River)',
    provinceNameTh: 'ลพบุรี',
    regionId: 'central',
    waterwayTh: 'แม่น้ำป่าสัก',
    latitude: 14.8624,
    longitude: 101.0744,
    provider: 'RID',
    providerNameTh: 'กรมชลประทาน',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 38.20,
    bankLevelMsl: 42.00,
    updatedAt: new Date().toISOString(),
    sourceAttribution: 'กรมชลประทาน (Royal Irrigation Department)',
  },
];

export function getCctvStationsByProvince(provinceNameTh: string): CctvStation[] {
  return OFFICIAL_CCTV_STATIONS.filter((s) => s.provinceNameTh === provinceNameTh);
}

export function getCctvStationsByRegion(regionId: string): CctvStation[] {
  return OFFICIAL_CCTV_STATIONS.filter((s) => s.regionId === regionId);
}
