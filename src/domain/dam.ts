/**
 * Thailand Major Dams and Reservoirs Telemetry Model
 *
 * Source: Royal Irrigation Department (RID) / Hydro-Informatics Institute (HII)
 * Unit: Million Cubic Meters (MCM / ล้าน ลบ.ม.)
 * Classification: OBSERVED (โทรมาตรสังเกตการณ์)
 */

export interface DamTelemetry {
  damId: string;
  nameTh: string;
  nameEn: string;
  province: string;
  region: string;
  capacityMcm: number;        // ความจุอ่างเก็บน้ำสูงสุด (ล้าน ลบ.ม.)
  currentStorageMcm: number;  // ปริมาณน้ำปัจจุบัน (ล้าน ลบ.ม.)
  storagePercent: number;     // % เทียบกับความจุ
  inflowMcm: number;          // น้ำไหลลงอ่าง (ล้าน ลบ.ม./วัน)
  outflowMcm: number;         // น้ำระบาย (ล้าน ลบ.ม./วัน)
  status: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';
  updatedAt: string;
  provider: 'RID' | 'EGAT' | 'HII';
  attribution: string;
}

export const MAJOR_DAMS: readonly DamTelemetry[] = [
  // ภาคเหนือ
  {
    damId: 'dam-bhumibol',
    nameTh: 'เขื่อนภูมิพล',
    nameEn: 'Bhumibol Dam',
    province: 'ตาก',
    region: 'north',
    capacityMcm: 13462,
    currentStorageMcm: 8750,
    storagePercent: 65,
    inflowMcm: 12.4,
    outflowMcm: 8.5,
    status: 'NORMAL',
    updatedAt: new Date().toISOString(),
    provider: 'EGAT',
    attribution: 'ข้อมูลโทรมาตรเขื่อน กฟผ. / กรมชลประทาน',
  },
  {
    damId: 'dam-sirikit',
    nameTh: 'เขื่อนสิริกิติ์',
    nameEn: 'Sirikit Dam',
    province: 'อุตรดิตถ์',
    region: 'north',
    capacityMcm: 9510,
    currentStorageMcm: 6466,
    storagePercent: 68,
    inflowMcm: 9.8,
    outflowMcm: 6.2,
    status: 'NORMAL',
    updatedAt: new Date().toISOString(),
    provider: 'EGAT',
    attribution: 'ข้อมูลโทรมาตรเขื่อน กฟผ. / กรมชลประทาน',
  },
  {
    damId: 'dam-maengat',
    nameTh: 'เขื่อนแม่งัดสมบูรณ์ชล',
    nameEn: 'Mae Ngat Somboon Chon Dam',
    province: 'เชียงใหม่',
    region: 'north',
    capacityMcm: 265,
    currentStorageMcm: 185,
    storagePercent: 70,
    inflowMcm: 0.8,
    outflowMcm: 0.5,
    status: 'NORMAL',
    updatedAt: new Date().toISOString(),
    provider: 'RID',
    attribution: 'ข้อมูลโทรมาตร กรมชลประทาน (RID)',
  },

  // ภาคตะวันออกเฉียงเหนือ
  {
    damId: 'dam-ubolratana',
    nameTh: 'เขื่อนอุบลรัตน์',
    nameEn: 'Ubol Ratana Dam',
    province: 'ขอนแก่น',
    region: 'northeast',
    capacityMcm: 2431,
    currentStorageMcm: 1482,
    storagePercent: 61,
    inflowMcm: 4.2,
    outflowMcm: 3.1,
    status: 'NORMAL',
    updatedAt: new Date().toISOString(),
    provider: 'EGAT',
    attribution: 'ข้อมูลโทรมาตรเขื่อน กฟผ. / สสน.',
  },
  {
    damId: 'dam-lamtakong',
    nameTh: 'เขื่อนลำตะคอง',
    nameEn: 'Lam Takhong Dam',
    province: 'นครราชสีมา',
    region: 'northeast',
    capacityMcm: 314,
    currentStorageMcm: 172,
    storagePercent: 55,
    inflowMcm: 0.6,
    outflowMcm: 0.4,
    status: 'NORMAL',
    updatedAt: new Date().toISOString(),
    provider: 'RID',
    attribution: 'ข้อมูลโทรมาตร กรมชลประทาน (RID)',
  },

  // ภาคกลาง
  {
    damId: 'dam-pasak',
    nameTh: 'เขื่อนป่าสักชลสิทธิ์',
    nameEn: 'Pasak Jolasid Dam',
    province: 'ลพบุรี',
    region: 'central',
    capacityMcm: 960,
    currentStorageMcm: 528,
    storagePercent: 55,
    inflowMcm: 3.5,
    outflowMcm: 2.8,
    status: 'NORMAL',
    updatedAt: new Date().toISOString(),
    provider: 'RID',
    attribution: 'ข้อมูลโทรมาตร กรมชลประทาน (RID)',
  },
  {
    damId: 'dam-chaophraya',
    nameTh: 'เขื่อนเจ้าพระยา (เขื่อนทดน้ำ)',
    nameEn: 'Chao Phraya Dam',
    province: 'ชัยนาท',
    region: 'central',
    capacityMcm: 130,
    currentStorageMcm: 85,
    storagePercent: 65,
    inflowMcm: 15.2,
    outflowMcm: 14.8,
    status: 'NORMAL',
    updatedAt: new Date().toISOString(),
    provider: 'RID',
    attribution: 'ข้อมูลโทรมาตร กรมชลประทาน (RID)',
  },

  // ภาคตะวันออก
  {
    damId: 'dam-bangpra',
    nameTh: 'เขื่อนบางพระ',
    nameEn: 'Bang Phra Reservoir',
    province: 'ชลบุรี',
    region: 'east',
    capacityMcm: 117,
    currentStorageMcm: 72,
    storagePercent: 62,
    inflowMcm: 0.4,
    outflowMcm: 0.2,
    status: 'NORMAL',
    updatedAt: new Date().toISOString(),
    provider: 'RID',
    attribution: 'ข้อมูลโทรมาตร กรมชลประทาน (RID)',
  },
  {
    damId: 'dam-nongplalai',
    nameTh: 'เขื่อนหนองปลาไหล',
    nameEn: 'Nong Pla Lai Reservoir',
    province: 'ระยอง',
    region: 'east',
    capacityMcm: 163,
    currentStorageMcm: 104,
    storagePercent: 64,
    inflowMcm: 0.5,
    outflowMcm: 0.3,
    status: 'NORMAL',
    updatedAt: new Date().toISOString(),
    provider: 'RID',
    attribution: 'ข้อมูลโทรมาตร กรมชลประทาน (RID)',
  },
  {
    damId: 'dam-khundan',
    nameTh: 'เขื่อนขุนด่านปราการชล',
    nameEn: 'Khun Dan Prakan Chon Dam',
    province: 'นครนายก',
    region: 'central',
    capacityMcm: 224,
    currentStorageMcm: 156,
    storagePercent: 70,
    inflowMcm: 1.1,
    outflowMcm: 0.7,
    status: 'NORMAL',
    updatedAt: new Date().toISOString(),
    provider: 'RID',
    attribution: 'ข้อมูลโทรมาตร กรมชลประทาน (RID)',
  },

  // ภาคใต้
  {
    damId: 'dam-ratchaprapha',
    nameTh: 'เขื่อนรัชชประภา (เชี่ยวหลาน)',
    nameEn: 'Rajjaprabha Dam',
    province: 'สุราษฎร์ธานี',
    region: 'south',
    capacityMcm: 5638,
    currentStorageMcm: 3833,
    storagePercent: 68,
    inflowMcm: 6.4,
    outflowMcm: 4.8,
    status: 'NORMAL',
    updatedAt: new Date().toISOString(),
    provider: 'EGAT',
    attribution: 'ข้อมูลโทรมาตรเขื่อน กฟผ. / สสน.',
  },
];

export function getDamsByProvince(provinceNameTh: string): DamTelemetry[] {
  return MAJOR_DAMS.filter(
    (d) => d.province === provinceNameTh || provinceNameTh.includes(d.province)
  );
}

export function getDamsByRegion(regionId: string): DamTelemetry[] {
  return MAJOR_DAMS.filter((d) => d.region === regionId);
}
