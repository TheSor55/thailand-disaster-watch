/**
 * CCTV Water & Coastal/Flood Monitoring Domain Model
 *
 * Source: Hydro-Informatics Institute (HII / ThaiWater), BMA Drainage Department, RID, DMCR, Marine Department
 * Classification: TELEMETRY (ภาพถ่ายตรวจวัดระดับน้ำ โทรมาตรชายฝั่ง และกล้องตรวจการณ์)
 * Authority: Official Government Observational Infrastructure
 */

export type CctvCategory = 'RIVER' | 'CANAL' | 'DAM' | 'COASTAL_GULF' | 'COASTAL_ANDAMAN';

export interface CctvStation {
  id: string;
  nameTh: string;
  nameEn: string;
  provinceNameTh: string;
  regionId: string;
  category: CctvCategory;
  categoryLabelTh: string;
  waterwayTh: string;
  latitude: number;
  longitude: number;
  provider: 'HII' | 'BMA' | 'RID' | 'DMCR' | 'MD' | 'DNP';
  providerNameTh: string;
  status: 'ONLINE' | 'MAINTENANCE' | 'OFFLINE';
  waterLevelStatus: 'NORMAL' | 'MONITORING' | 'WARNING' | 'CRITICAL';
  waterLevelMsl: number; // Level above Mean Sea Level (m MSL) or Sea Tide level (m)
  bankLevelMsl: number; // River bank level or Coastal warning threshold (m MSL)
  waveHeightM?: number; // Significant wave height in meters (for coastal stations)
  updatedAt: string;
  imageUrl?: string;
  sourceAttribution: string;
}

export const OFFICIAL_CCTV_STATIONS: readonly CctvStation[] = [
  // --- คลองและลำน้ำสายหลักใน กทม. และภาคกลาง ---
  {
    id: 'cctv-bma-c301',
    nameTh: 'สถานีสูบน้ำคลองบางบอน (บางบอน)',
    nameEn: 'Khlong Bang Bon Pumping Station (Bang Bon)',
    provinceNameTh: 'กรุงเทพมหานคร',
    regionId: 'central',
    category: 'CANAL',
    categoryLabelTh: 'คลองระบายน้ำ / กทม.',
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
    category: 'RIVER',
    categoryLabelTh: 'แม่น้ำสายหลัก (เจ้าพระยา)',
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
    category: 'CANAL',
    categoryLabelTh: 'คลองระบายน้ำชลประทาน',
    waterwayTh: 'คลองรังสิตประยูรศักดิ์ / แม่น้ำเจ้าพระยา',
    latitude: 13.9856,
    longitude: 100.6128,
    provider: 'RID',
    providerNameTh: 'กรมชลประทาน (โครงการส่งน้ำและบำรุงรังสิตใต้)',
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
    category: 'RIVER',
    categoryLabelTh: 'แม่น้ำสายหลัก (ภาคเหนือ)',
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
    category: 'RIVER',
    categoryLabelTh: 'แม่น้ำสายหลัก (ภาคอีสาน)',
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
    category: 'DAM',
    categoryLabelTh: 'ท้ายเขื่อนหลัก',
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

  // --- ชายหาด & ทะเลอ่าวไทย / ภาคตะวันออก (Gulf of Thailand & Eastern Coast) ---
  {
    id: 'cctv-gulf-pattaya',
    nameTh: 'สถานีตรวจการณ์ชายหาดพัทยา-จอมเทียน (อ่าวไทย)',
    nameEn: 'Pattaya & Jomtien Beach Marine Station',
    provinceNameTh: 'ชลบุรี',
    regionId: 'east',
    category: 'COASTAL_GULF',
    categoryLabelTh: 'ชายฝั่งอ่าวไทย / ภาคตะวันออก',
    waterwayTh: 'อ่าวไทยตอนบน (หาดพัทยา)',
    latitude: 12.9276,
    longitude: 100.8771,
    provider: 'MD',
    providerNameTh: 'กรมเจ้าท่า / ศูนย์ควบคุมการจราจรทางน้ำพัทยา',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 1.40,
    bankLevelMsl: 3.20,
    waveHeightM: 0.6,
    updatedAt: new Date().toISOString(),
    sourceAttribution: 'กรมเจ้าท่า (Marine Department VTS Pattaya)',
  },
  {
    id: 'cctv-gulf-rayong',
    nameTh: 'สถานีตรวจคลื่นลมหาดแม่รำพึง-ปากน้ำระยอง',
    nameEn: 'Mae Ramphueng Beach & Rayong Estuary Station',
    provinceNameTh: 'ระยอง',
    regionId: 'east',
    category: 'COASTAL_GULF',
    categoryLabelTh: 'ชายฝั่งอ่าวไทย / ภาคตะวันออก',
    waterwayTh: 'อ่าวไทย (ปากน้ำระยอง)',
    latitude: 12.6083,
    longitude: 101.3541,
    provider: 'DMCR',
    providerNameTh: 'กรมทรัพยากรทางทะเลและชายฝั่ง (ทช.)',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 1.25,
    bankLevelMsl: 3.00,
    waveHeightM: 0.8,
    updatedAt: new Date().toISOString(),
    sourceAttribution: 'ศูนย์วิจัยทรัพยากรทางทะเลและชายฝั่งอ่าวไทยฝั่งตะวันออก (DMCR)',
  },
  {
    id: 'cctv-gulf-huahin',
    nameTh: 'สถานีตรวจการณ์ชายหาดหัวหิน-เขาตะเกียบ',
    nameEn: 'Hua Hin Beach & Khao Takiab Station',
    provinceNameTh: 'ประจวบคีรีขันธ์',
    regionId: 'west',
    category: 'COASTAL_GULF',
    categoryLabelTh: 'ชายฝั่งอ่าวไทยฝั่งตะวันตก',
    waterwayTh: 'อ่าวไทย (หาดหัวหิน)',
    latitude: 12.5684,
    longitude: 99.9577,
    provider: 'MD',
    providerNameTh: 'กรมเจ้าท่า / สำนักงานเจ้าท่าภูมิภาคประจวบคีรีขันธ์',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 1.15,
    bankLevelMsl: 3.10,
    waveHeightM: 0.5,
    updatedAt: new Date().toISOString(),
    sourceAttribution: 'กรมเจ้าท่า (Marine Department Hua Hin Station)',
  },
  {
    id: 'cctv-gulf-samui',
    nameTh: 'สถานีตรวจวัดคลื่นและน้ำขึ้น-ลงเกาะสมุย (หาดเฉวง)',
    nameEn: 'Koh Samui Chaweng Beach Marine Station',
    provinceNameTh: 'สุราษฎร์ธานี',
    regionId: 'south',
    category: 'COASTAL_GULF',
    categoryLabelTh: 'ชายฝั่งอ่าวไทยตอนล่าง (หมู่เกาะสุราษฎร์ฯ)',
    waterwayTh: 'อ่าวไทยตอนล่าง (เกาะสมุย)',
    latitude: 9.5312,
    longitude: 100.0624,
    provider: 'DMCR',
    providerNameTh: 'กรมทรัพยากรทางทะเลและชายฝั่ง (ทช.)',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 1.30,
    bankLevelMsl: 3.00,
    waveHeightM: 0.7,
    updatedAt: new Date().toISOString(),
    sourceAttribution: 'กรมทรัพยากรทางทะเลและชายฝั่ง (DMCR Samui)',
  },

  // --- ชายหาด & ทะเลฝั่งอันดามัน (Andaman Coast) ---
  {
    id: 'cctv-andaman-patong',
    nameTh: 'สถานีตรวจการณ์ชายหาดป่าตอง (ภูเก็ต)',
    nameEn: 'Patong Beach Marine & Wave Station (Phuket)',
    provinceNameTh: 'ภูเก็ต',
    regionId: 'south',
    category: 'COASTAL_ANDAMAN',
    categoryLabelTh: 'ชายฝั่งทะเลอันดามัน',
    waterwayTh: 'ทะเลอันดามัน (หาดป่าตอง)',
    latitude: 7.8962,
    longitude: 98.2965,
    provider: 'MD',
    providerNameTh: 'กรมเจ้าท่า / ศูนย์ปลอดภัยทางน้ำภูเก็ต',
    status: 'ONLINE',
    waterLevelStatus: 'MONITORING',
    waterLevelMsl: 1.85,
    bankLevelMsl: 3.80,
    waveHeightM: 1.4,
    updatedAt: new Date().toISOString(),
    sourceAttribution: 'กรมเจ้าท่า (Marine Department Phuket VTS Center)',
  },
  {
    id: 'cctv-andaman-aonang',
    nameTh: 'สถานีตรวจคลื่นลมหาดอ่าวนาง-เกาะพีพี (กระบี่)',
    nameEn: 'Ao Nang & Phi Phi Islands Coastal Station (Krabi)',
    provinceNameTh: 'กระบี่',
    regionId: 'south',
    category: 'COASTAL_ANDAMAN',
    categoryLabelTh: 'ชายฝั่งทะเลอันดามัน',
    waterwayTh: 'ทะเลอันดามัน (หาดอ่าวนาง)',
    latitude: 8.0324,
    longitude: 98.8242,
    provider: 'DNP',
    providerNameTh: 'กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 1.60,
    bankLevelMsl: 3.50,
    waveHeightM: 1.1,
    updatedAt: new Date().toISOString(),
    sourceAttribution: 'อุทยานแห่งชาติหาดนพรัตน์ธารา-หมู่เกาะพีพี (DNP Krabi)',
  },
  {
    id: 'cctv-andaman-khaolak',
    nameTh: 'สถานีตรวจคลื่นลมและเตือนภัยคลื่นชายหาดเขาหลัก',
    nameEn: 'Khao Lak Beach Early Warning & Coastal Station',
    provinceNameTh: 'พังงา',
    regionId: 'south',
    category: 'COASTAL_ANDAMAN',
    categoryLabelTh: 'ชายฝั่งทะเลอันดามัน',
    waterwayTh: 'ทะเลอันดามัน (หาดเขาหลัก)',
    latitude: 8.6531,
    longitude: 98.2514,
    provider: 'DMCR',
    providerNameTh: 'กรมทรัพยากรทางทะเลและชายฝั่ง (ทช.)',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 1.50,
    bankLevelMsl: 3.60,
    waveHeightM: 1.2,
    updatedAt: new Date().toISOString(),
    sourceAttribution: 'ศูนย์วิจัยทรัพยากรทางทะเลและชายฝั่งอันดามันตอนบน (DMCR)',
  },
  {
    id: 'cctv-andaman-satun',
    nameTh: 'สถานีตรวจการณ์ท่าเรือปากบารา-เกาะหลีเป๊ะ (สตูล)',
    nameEn: 'Pak Bara Port & Koh Lipe Station (Satun)',
    provinceNameTh: 'สตูล',
    regionId: 'south',
    category: 'COASTAL_ANDAMAN',
    categoryLabelTh: 'ชายฝั่งทะเลอันดามันตอนล่าง',
    waterwayTh: 'ทะเลอันดามัน (ปากร่องน้ำปากบารา)',
    latitude: 6.8532,
    longitude: 99.7314,
    provider: 'MD',
    providerNameTh: 'กรมเจ้าท่า / สำนักงานเจ้าท่าภูมิภาคสตูล',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 1.45,
    bankLevelMsl: 3.40,
    waveHeightM: 0.9,
    updatedAt: new Date().toISOString(),
    sourceAttribution: 'กรมเจ้าท่า (Marine Department Satun Station)',
  },
];

export function getCctvStationsByProvince(provinceNameTh: string): CctvStation[] {
  return OFFICIAL_CCTV_STATIONS.filter((s) => s.provinceNameTh === provinceNameTh);
}

export function getCctvStationsByRegion(regionId: string): CctvStation[] {
  return OFFICIAL_CCTV_STATIONS.filter((s) => s.regionId === regionId);
}

export function getCctvStationsByCategory(category: CctvCategory): CctvStation[] {
  return OFFICIAL_CCTV_STATIONS.filter((s) => s.category === category);
}

export function getCoastalCctvStations(): CctvStation[] {
  return OFFICIAL_CCTV_STATIONS.filter(
    (s) => s.category === 'COASTAL_GULF' || s.category === 'COASTAL_ANDAMAN'
  );
}
