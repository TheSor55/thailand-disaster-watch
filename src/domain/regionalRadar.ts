/**
 * Regional Radar Stations & Coverage Network Domain Model
 *
 * Source: TMD (Thai Meteorological Department), BMA (Bangkok Metropolitan Administration), ThaiWater (HII)
 * Classification: OBSERVED_REMOTE_SENSING
 * Authority: Official Meteorological Observation Infrastructure
 */

export interface RegionalRadarStation {
  id: string;
  nameTh: string;
  nameEn: string;
  agency: 'TMD' | 'BMA' | 'ROYAL_NAVY' | 'HII';
  provinceNameTh: string;
  regionId: string;
  latitude: number;
  longitude: number;
  rangeKm: number;
  coverageTh: string;
  onlineStatus: 'ACTIVE' | 'MAINTENANCE';
  viewUrl: string;
}

export const REGIONAL_RADAR_STATIONS: readonly RegionalRadarStation[] = [
  // --- กรุงเทพฯ และปริมณฑล ---
  {
    id: 'radar-bma-nongkhaem',
    nameTh: 'สถานีเรดาร์ตรวจฝน กทม. หนองแขม',
    nameEn: 'BMA Nong Khaem Weather Radar',
    agency: 'BMA',
    provinceNameTh: 'กรุงเทพมหานคร',
    regionId: 'central',
    latitude: 13.7050,
    longitude: 100.3580,
    rangeKm: 120,
    coverageTh: 'กรุงเทพมหานครฝั่งธนบุรี (เขตบางบอน, หนองแขม, บางขุนเทียน), สมุทรสาคร, นครปฐม, นนทบุรี',
    onlineStatus: 'ACTIVE',
    viewUrl: 'http://weather.bangkok.go.th/radar/',
  },
  {
    id: 'radar-bma-nongchok',
    nameTh: 'สถานีเรดาร์ตรวจฝน กทม. หนองจอก',
    nameEn: 'BMA Nong Chok Weather Radar',
    agency: 'BMA',
    provinceNameTh: 'กรุงเทพมหานคร',
    regionId: 'central',
    latitude: 13.8540,
    longitude: 100.8620,
    rangeKm: 120,
    coverageTh: 'กรุงเทพมหานครฝั่งตะวันออก (หนองจอก, มีนบุรี, ลาดกระบัง), ปทุมธานี, ฉะเชิงเทรา, สมุทรปราการ',
    onlineStatus: 'ACTIVE',
    viewUrl: 'http://weather.bangkok.go.th/radar/',
  },

  // --- ภาคกลาง / ลุ่มน้ำเจ้าพระยา ---
  {
    id: 'radar-tmd-chainat',
    nameTh: 'สถานีเรดาร์ตรวจอากาศชัยนาท',
    nameEn: 'TMD Chai Nat Weather Radar',
    agency: 'TMD',
    provinceNameTh: 'ชัยนาท',
    regionId: 'central',
    latitude: 15.1850,
    longitude: 100.1250,
    rangeKm: 240,
    coverageTh: 'ชัยนาท, สิงห์บุรี, อ่างทอง, พระนครศรีอยุธยา, สุพรรณบุรี, ลพบุรี, สระบุรี, อุทัยธานี',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/cntLoop.php',
  },
  {
    id: 'radar-tmd-takhli',
    nameTh: 'สถานีเรดาร์ตรวจอากาศตาคลี (นครสวรรค์)',
    nameEn: 'TMD Takhli Weather Radar (Nakhon Sawan)',
    agency: 'TMD',
    provinceNameTh: 'นครสวรรค์',
    regionId: 'central',
    latitude: 15.2670,
    longitude: 100.3170,
    rangeKm: 240,
    coverageTh: 'นครสวรรค์, ชัยนาท, ลพบุรี, เพชรบูรณ์ตอนล่าง, พิจิตร',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/',
  },

  // --- ภาคเหนือ ---
  {
    id: 'radar-tmd-lamphun',
    nameTh: 'สถานีเรดาร์ตรวจอากาศลำพูน (ครอบคลุมเชียงใหม่)',
    nameEn: 'TMD Lamphun Weather Radar (Chiang Mai Coverage)',
    agency: 'TMD',
    provinceNameTh: 'ลำพูน',
    regionId: 'north',
    latitude: 18.5780,
    longitude: 99.0350,
    rangeKm: 240,
    coverageTh: 'เชียงใหม่, ลำพูน, ลำปาง, แม่ฮ่องสอน, เชียงรายตอนล่าง, พะเยา',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/lpnLoop.php',
  },
  {
    id: 'radar-tmd-phitsanulok',
    nameTh: 'สถานีเรดาร์ตรวจอากาศพิษณุโลก',
    nameEn: 'TMD Phitsanulok Weather Radar',
    agency: 'TMD',
    provinceNameTh: 'พิษณุโลก',
    regionId: 'north',
    latitude: 16.7820,
    longitude: 100.2790,
    rangeKm: 240,
    coverageTh: 'พิษณุโลก, สุโขทัย, อุตรดิตถ์, พิจิตร, กำแพงเพชร, เพชรบูรณ์, ตาก',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/pslLoop.php',
  },
  {
    id: 'radar-tmd-omkoi',
    nameTh: 'สถานีเรดาร์ตรวจอากาศอมก๋อย (เชียงใหม่)',
    nameEn: 'TMD Omkoi Weather Radar (Chiang Mai)',
    agency: 'TMD',
    provinceNameTh: 'เชียงใหม่',
    regionId: 'north',
    latitude: 17.7980,
    longitude: 98.4350,
    rangeKm: 240,
    coverageTh: 'เชียงใหม่ตอนล่าง, ตาก, แม่ฮ่องสอน, ลำพูน',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/omkLoop.php',
  },

  // --- ภาคตะวันออกเฉียงเหนือ (อีสาน) ---
  {
    id: 'radar-tmd-khonkaen',
    nameTh: 'สถานีเรดาร์ตรวจอากาศขอนแก่น',
    nameEn: 'TMD Khon Kaen Weather Radar',
    agency: 'TMD',
    provinceNameTh: 'ขอนแก่น',
    regionId: 'northeast',
    latitude: 16.4630,
    longitude: 102.7840,
    rangeKm: 240,
    coverageTh: 'ขอนแก่น, มหาสารคาม, กาฬสินธุ์, ร้อยเอ็ด, ชัยภูมิ, อุดรธานี, หนองบัวลำภู',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/kknLoop.php',
  },
  {
    id: 'radar-tmd-phimai',
    nameTh: 'สถานีเรดาร์ตรวจอากาศพิมาย (นครราชสีมา)',
    nameEn: 'TMD Phimai Weather Radar (Nakhon Ratchasima)',
    agency: 'TMD',
    provinceNameTh: 'นครราชสีมา',
    regionId: 'northeast',
    latitude: 15.2180,
    longitude: 102.4850,
    rangeKm: 240,
    coverageTh: 'นครราชสีมา, บุรีรัมย์, สุรินทร์, ชัยภูมิ, ลพบุรีฝั่งตะวันออก, สระแก้ว',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/pmiLoop.php',
  },
  {
    id: 'radar-tmd-sakonnakhon',
    nameTh: 'สถานีเรดาร์ตรวจอากาศสกลนคร',
    nameEn: 'TMD Sakon Nakhon Weather Radar',
    agency: 'TMD',
    provinceNameTh: 'สกลนคร',
    regionId: 'northeast',
    latitude: 17.1580,
    longitude: 104.1480,
    rangeKm: 240,
    coverageTh: 'สกลนคร, นครพนม, มุกดาหาร, บึงกาฬ, อุดรธานี, หนองคาย',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/sknLoop.php',
  },
  {
    id: 'radar-tmd-ubon',
    nameTh: 'สถานีเรดาร์ตรวจอากาศอุบลราชธานี',
    nameEn: 'TMD Ubon Ratchathani Weather Radar',
    agency: 'TMD',
    provinceNameTh: 'อุบลราชธานี',
    regionId: 'northeast',
    latitude: 15.2510,
    longitude: 104.8710,
    rangeKm: 240,
    coverageTh: 'อุบลราชธานี, ศรีสะเกษ, ยโสธร, อำนาจเจริญ, มุกดาหารตอนล่าง',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/ubnLoop.php',
  },

  // --- ภาคตะวันออก ---
  {
    id: 'radar-tmd-sattahip',
    nameTh: 'สถานีเรดาร์ตรวจอากาศสัตหีบ (ชลบุรี-ระยอง)',
    nameEn: 'TMD Sattahip Weather Radar (Chon Buri - Rayong)',
    agency: 'TMD',
    provinceNameTh: 'ชลบุรี',
    regionId: 'east',
    latitude: 12.6730,
    longitude: 100.9950,
    rangeKm: 240,
    coverageTh: 'ชลบุรี (พัทยา), ระยอง, จันทบุรี, ตราด, ฉะเชิงเทรา, สมุทรปราการ, อ่าวไทยตอนบน',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/stpLoop.php',
  },

  // --- ภาคตะวันตก ---
  {
    id: 'radar-tmd-huahin',
    nameTh: 'สถานีเรดาร์ตรวจอากาศหัวหิน (ประจวบคีรีขันธ์)',
    nameEn: 'TMD Hua Hin Weather Radar (Prachuap Khiri Khan)',
    agency: 'TMD',
    provinceNameTh: 'ประจวบคีรีขันธ์',
    regionId: 'west',
    latitude: 12.5830,
    longitude: 99.9500,
    rangeKm: 240,
    coverageTh: 'ประจวบคีรีขันธ์, เพชรบุรี, สมุทรสงคราม, สมุทรสาคร, ราชบุรี, อ่าวไทยฝั่งตะวันตก',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/hhnLoop.php',
  },

  // --- ภาคใต้ ---
  {
    id: 'radar-tmd-surat',
    nameTh: 'สถานีเรดาร์ตรวจอากาศสุราษฎร์ธานี (พุนพิน)',
    nameEn: 'TMD Surat Thani Weather Radar (Phunphin)',
    agency: 'TMD',
    provinceNameTh: 'สุราษฎร์ธานี',
    regionId: 'south',
    latitude: 9.1330,
    longitude: 99.1410,
    rangeKm: 240,
    coverageTh: 'สุราษฎร์ธานี (เกาะสมุย, เกาะพะงัน), ชุมพร, นครศรีธรรมราช, ระนอง, อ่าวไทยตอนล่าง',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/srtLoop.php',
  },
  {
    id: 'radar-tmd-phuket',
    nameTh: 'สถานีเรดาร์ตรวจอากาศภูเก็ต',
    nameEn: 'TMD Phuket Weather Radar',
    agency: 'TMD',
    provinceNameTh: 'ภูเก็ต',
    regionId: 'south',
    latitude: 8.1130,
    longitude: 98.3070,
    rangeKm: 240,
    coverageTh: 'ภูเก็ต, พังงา (เขาหลัก), กระบี่ (อ่าวนาง, เกาะพีพี), ทะเลอันดามัน',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/pktLoop.php',
  },
  {
    id: 'radar-tmd-krabi',
    nameTh: 'สถานีเรดาร์ตรวจอากาศกระบี่',
    nameEn: 'TMD Krabi Weather Radar',
    agency: 'TMD',
    provinceNameTh: 'กระบี่',
    regionId: 'south',
    latitude: 8.0980,
    longitude: 98.9850,
    rangeKm: 240,
    coverageTh: 'กระบี่, ตรัง, พังงา, สุราษฎร์ธานีตอนล่าง, นครศรีธรรมราช',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/kbiLoop.php',
  },
  {
    id: 'radar-tmd-songkhla',
    nameTh: 'สถานีเรดาร์ตรวจอากาศสิงหนคร (สงขลา)',
    nameEn: 'TMD Singhanakhon Weather Radar (Songkhla)',
    agency: 'TMD',
    provinceNameTh: 'สงขลา',
    regionId: 'south',
    latitude: 7.2210,
    longitude: 100.5680,
    rangeKm: 240,
    coverageTh: 'สงขลา (หาดใหญ่), พัทลุง, ปัตตานี, ยะลา, นราธิวาส, สตูล, อ่าวไทยตอนล่าง',
    onlineStatus: 'ACTIVE',
    viewUrl: 'https://weather.tmd.go.th/skaLoop.php',
  },
];

/**
 * Calculates distance between two GPS coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface NearestRadarMatch {
  radar: RegionalRadarStation;
  distanceKm: number;
  isWithinRange: boolean;
}

/**
 * Finds the nearest official Regional Weather Radar for any latitude and longitude in Thailand.
 */
export function getNearestRegionalRadar(lat: number, lon: number): NearestRadarMatch {
  let nearestRadar = REGIONAL_RADAR_STATIONS[0];
  let minDistance = Infinity;

  for (const station of REGIONAL_RADAR_STATIONS) {
    const dist = calculateDistanceKm(lat, lon, station.latitude, station.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearestRadar = station;
    }
  }

  return {
    radar: nearestRadar,
    distanceKm: Math.round(minDistance * 10) / 10,
    isWithinRange: minDistance <= nearestRadar.rangeKm,
  };
}
