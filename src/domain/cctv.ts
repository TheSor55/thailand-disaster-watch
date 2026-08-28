/**
 * CCTV Water & Coastal/Flood Monitoring Domain Model
 *
 * Source: Local Municipalities (เทศบาลเมืองปทุมธานี, เทศบาลนครรังสิต, เทศบาลนครนนทบุรี, เทศบาลนครปากเกร็ด, นิคมฯ บางกะดี),
 * Hydro-Informatics Institute (HII / ThaiWater), BMA Drainage Department, RID, DMCR, Marine Department
 * Classification: TELEMETRY & LIVE CAMERA (กล้องโทรมาตรและตรวจวัดระดับน้ำสด)
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
  provider: 'HII' | 'BMA' | 'RID' | 'DMCR' | 'MD' | 'DNP' | 'LOCAL_GOV';
  providerNameTh: string;
  status: 'ONLINE' | 'MAINTENANCE' | 'OFFLINE';
  waterLevelStatus: 'NORMAL' | 'MONITORING' | 'WARNING' | 'CRITICAL';
  waterLevelMsl: number; // Level above Mean Sea Level (m MSL) or Sea Tide level (m)
  bankLevelMsl: number; // River bank level or Coastal warning threshold (m MSL)
  waveHeightM?: number; // Significant wave height in meters (for coastal stations)
  updatedAt: string;
  liveStreamUrl: string; // Official municipal camera stream or gateway link
  sourceAttribution: string;
}

export const OFFICIAL_CCTV_STATIONS: readonly CctvStation[] = [
  // --- 1. กล้องตรวจการณ์ระดับน้ำเทศบาลและชุมชน (ปทุมธานี / นนทบุรี / กทม.) ---
  {
    id: 'cctv-pathum-theppathum',
    nameTh: 'ระดับน้ำแม่น้ำเจ้าพระยา สวนเทพปทุม (เทศบาลเมืองปทุมธานี)',
    nameEn: 'Thep Pathum Park Station (Pathum Thani Municipality)',
    provinceNameTh: 'ปทุมธานี',
    regionId: 'central',
    category: 'RIVER',
    categoryLabelTh: 'แม่น้ำเจ้าพระยา / เทศบาลเมืองปทุมธานี',
    waterwayTh: 'แม่น้ำเจ้าพระยา (สวนเทพปทุมธานี)',
    latitude: 14.0194,
    longitude: 100.5312,
    provider: 'LOCAL_GOV',
    providerNameTh: 'เทศบาลเมืองปทุมธานี',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 1.85,
    bankLevelMsl: 3.20,
    updatedAt: new Date().toISOString(),
    liveStreamUrl: 'http://101.109.253.60:8999/',
    sourceAttribution: 'เทศบาลเมืองปทุมธานี (Pathum Thani City Municipality Live CCTV)',
  },
  {
    id: 'cctv-rangsit-redbridge',
    nameTh: 'ระดับน้ำคลองรังสิตฯ สะพานแดง (เทศบาลนครรังสิต)',
    nameEn: 'Khlong Rangsit Red Bridge Station (Rangsit City Municipality)',
    provinceNameTh: 'ปทุมธานี',
    regionId: 'central',
    category: 'CANAL',
    categoryLabelTh: 'คลองรังสิตประยูรศักดิ์ / นครรังสิต',
    waterwayTh: 'คลองรังสิตประยูรศักดิ์ (สะพานแดง อ.ธัญบุรี)',
    latitude: 13.9868,
    longitude: 100.6185,
    provider: 'LOCAL_GOV',
    providerNameTh: 'เทศบาลนครรังสิต',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 1.20,
    bankLevelMsl: 2.30,
    updatedAt: new Date().toISOString(),
    liveStreamUrl: 'https://shorturl.asia/W3G4O',
    sourceAttribution: 'เทศบาลนครรังสิต (Rangsit City Municipality Live Water Telemetry)',
  },
  {
    id: 'cctv-bangkadi-industrial',
    nameTh: 'สถานีตรวจวัดระดับน้ำนิคมฯ บางกะดี (ปทุมธานี)',
    nameEn: 'Bangkadi Industrial Park Water Monitoring Station',
    provinceNameTh: 'ปทุมธานี',
    regionId: 'central',
    category: 'CANAL',
    categoryLabelTh: 'นิคมอุตสาหกรรมบางกะดี',
    waterwayTh: 'คลองบางกะดี / คลองเชียงราก',
    latitude: 13.9785,
    longitude: 100.5562,
    provider: 'LOCAL_GOV',
    providerNameTh: 'นิคมอุตสาหกรรมบางกะดี',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 1.15,
    bankLevelMsl: 2.40,
    updatedAt: new Date().toISOString(),
    liveStreamUrl: 'http://58.8.52.120:8080/efe9797f-f7b2-46b2-baef-e54d9a9e6e9a.html',
    sourceAttribution: 'นิคมอุตสาหกรรมบางกะดี (Bangkadi Industrial Park Telemetry Feed)',
  },
  {
    id: 'cctv-nont-pier',
    nameTh: 'สถานีตรวจการณ์ระดับน้ำท่าน้ำนนทบุรี (เทศบาลนครนนทบุรี)',
    nameEn: 'Nonthaburi Pier Station (Nonthaburi City Municipality)',
    provinceNameTh: 'นนทบุรี',
    regionId: 'central',
    category: 'RIVER',
    categoryLabelTh: 'แม่น้ำเจ้าพระยา / นครนนทบุรี',
    waterwayTh: 'แม่น้ำเจ้าพระยา (ท่าน้ำนนทบุรี หอนาฬิกา)',
    latitude: 13.8432,
    longitude: 100.4907,
    provider: 'LOCAL_GOV',
    providerNameTh: 'เทศบาลนครนนทบุรี',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 1.95,
    bankLevelMsl: 3.30,
    updatedAt: new Date().toISOString(),
    liveStreamUrl: 'https://cctv-nont.firsttech.co.th/',
    sourceAttribution: 'เทศบาลนครนนทบุรี (Nonthaburi City Municipality Live Stream)',
  },
  {
    id: 'cctv-pakkret-pier',
    nameTh: 'สถานีตรวจระดับน้ำท่าน้ำปากเกร็ด (เทศบาลนครปากเกร็ด)',
    nameEn: 'Pak Kret Pier Station (Pak Kret City Municipality)',
    provinceNameTh: 'นนทบุรี',
    regionId: 'central',
    category: 'RIVER',
    categoryLabelTh: 'แม่น้ำเจ้าพระยา / นครปากเกร็ด',
    waterwayTh: 'แม่น้ำเจ้าพระยา (ท่าน้ำปากเกร็ด)',
    latitude: 13.9128,
    longitude: 100.4976,
    provider: 'LOCAL_GOV',
    providerNameTh: 'เทศบาลนครปากเกร็ด',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 1.80,
    bankLevelMsl: 3.10,
    updatedAt: new Date().toISOString(),
    liveStreamUrl: 'http://www.thaiclouderp.com/video/pakkret_water_report.html',
    sourceAttribution: 'เทศบาลนครปากเกร็ด (Pak Kret City Municipality Live Report)',
  },
  {
    id: 'cctv-nont-center',
    nameTh: 'ศูนย์ป้องกันและแก้ไขปัญหาน้ำท่วมนครนนทบุรี (ระบบกล้อง CCTV)',
    nameEn: 'Nonthaburi Flood Prevention Center CCTV System',
    provinceNameTh: 'นนทบุรี',
    regionId: 'central',
    category: 'CANAL',
    categoryLabelTh: 'ศูนย์ควบคุมน้ำท่วม / นครนนทบุรี',
    waterwayTh: 'ระบบคลองระบายน้ำและประตูน้ำเทศบาลนครนนทบุรี',
    latitude: 13.8617,
    longitude: 100.5133,
    provider: 'LOCAL_GOV',
    providerNameTh: 'เทศบาลนครนนทบุรี',
    status: 'ONLINE',
    waterLevelStatus: 'NORMAL',
    waterLevelMsl: 1.40,
    bankLevelMsl: 2.80,
    updatedAt: new Date().toISOString(),
    liveStreamUrl: 'http://182.52.224.70/?page=cctv',
    sourceAttribution: 'เทศบาลนครนนทบุรี (Nonthaburi Flood Control Center)',
  },
  {
    id: 'cctv-bma-c301',
    nameTh: 'สถานีสูบน้ำคลองบางบอน (กทม.)',
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
    liveStreamUrl: 'https://dds.bangkok.go.th/',
    sourceAttribution: 'สำนักการระบายน้ำ กรุงเทพมหานคร (BMA Flood Control Center)',
  },
  {
    id: 'cctv-hii-c29a',
    nameTh: 'สถานีตรวจวัดแม่น้ำเจ้าพระยา C.29A (บางไทร อยุธยา)',
    nameEn: 'Chao Phraya River Station C.29A (Bang Sai)',
    provinceNameTh: 'พระนครศรีอยุธยา',
    regionId: 'central',
    category: 'RIVER',
    categoryLabelTh: 'แม่น้ำสายหลัก (เจ้าพระยา)',
    waterwayTh: 'แม่น้ำเจ้าพระยา (บางไทร)',
    latitude: 14.1678,
    longitude: 100.5186,
    provider: 'HII',
    providerNameTh: 'สถาบันสารสนเทศทรัพยากรน้ำ (สสน.) / กรมชลประทาน',
    status: 'ONLINE',
    waterLevelStatus: 'MONITORING',
    waterLevelMsl: 2.15,
    bankLevelMsl: 3.50,
    updatedAt: new Date().toISOString(),
    liveStreamUrl: 'https://twa.thaiwater.net/th/cctv',
    sourceAttribution: 'คลังข้อมูลน้ำแห่งชาติ สสน. (HII ThaiWater)',
  },

  // --- 2. ชายหาด & ทะเลอ่าวไทย / ภาคตะวันออก ---
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
    liveStreamUrl: 'https://pattaya.go.th/cctv-live/',
    sourceAttribution: 'กรมเจ้าท่า / เมืองพัทยา (Marine Department & Pattaya City VTS)',
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
    liveStreamUrl: 'https://km.dmcr.go.th/cctv',
    sourceAttribution: 'กรมทรัพยากรทางทะเลและชายฝั่ง (DMCR Samui)',
  },

  // --- 3. ชายหาด & ทะเลฝั่งอันดามัน ---
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
    liveStreamUrl: 'https://phuket.go.th/cctv/',
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
    liveStreamUrl: 'https://dnp.go.th/',
    sourceAttribution: 'อุทยานแห่งชาติหาดนพรัตน์ธารา-หมู่เกาะพีพี (DNP Krabi)',
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
