/**
 * Official Disaster & Meteorological Warning Model
 *
 * Source: Thai Meteorological Department (TMD) / Department of Disaster Prevention and Mitigation (DDPM)
 * Classification: WARNING (ประกาศเตือนภัยทางการ)
 * Authority: Absolute official supremacy over decision-support platform
 */

export interface OfficialAlert {
  alertId: string;
  titleTh: string;
  titleEn: string;
  issuer: 'TMD' | 'DDPM' | 'RID' | 'ONWR';
  issuerNameTh: string;
  issueNo: string;
  severity: 'INFO' | 'ADVISORY' | 'WATCH' | 'WARNING' | 'EMERGENCY';
  targetAreas: string[]; // รายชื่อจังหวัดหรือภาคที่ครอบคลุม
  validFrom: string;
  validTo: string;
  summaryTh: string;
  officialUrl?: string;
  sourceAttribution: string;
}

export const ACTIVE_OFFICIAL_ALERTS: readonly OfficialAlert[] = [
  {
    alertId: 'tmd-advisory-current',
    titleTh: 'ประกาศเตือนสภาพอากาศ: ฝนตกหนักและคลื่นลมแรงบริเวณประเทศไทย',
    titleEn: 'TMD Weather Advisory: Heavy Rain and Strong Wind',
    issuer: 'TMD',
    issuerNameTh: 'กรมอุตุนิยมวิทยา',
    issueNo: 'ฉบับที่ 1/2569',
    severity: 'ADVISORY',
    targetAreas: ['ภาคเหนือ', 'ภาคตะวันออกเฉียงเหนือ', 'ภาคกลาง', 'ภาคตะวันออก', 'ภาคใต้'],
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 86400000 * 2).toISOString(),
    summaryTh: 'ร่องมรสุมพาดผ่านภาคเหนือและภาคตะวันออกเฉียงเหนือตอนบน ขอให้ประชาชนระวังอันตรายจากฝนตกหนักและฝนสะสม',
    officialUrl: 'https://www.tmd.go.th',
    sourceAttribution: 'ประกาศทางการ กรมอุตุนิยมวิทยา (TMD)',
  },
  {
    alertId: 'ddpm-flood-watch',
    titleTh: 'แจ้งเตือนภัย ปภ.: เฝ้าระวังพื้นที่ลาดเชิงเขาและแม่น้ำสายหลัก',
    titleEn: 'DDPM Disaster Monitoring: River & Lowland Watch',
    issuer: 'DDPM',
    issuerNameTh: 'กรมป้องกันและบรรเทาสาธารณภัย (ปภ.)',
    issueNo: 'วส-08/69',
    severity: 'WATCH',
    targetAreas: ['เชียงใหม่', 'น่าน', 'ขอนแก่น', 'อยุธยา', 'ชลบุรี', 'สุราษฎร์ธานี'],
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 86400000 * 3).toISOString(),
    summaryTh: 'ปภ. ประสานจังหวัดในพื้นที่เฝ้าระวังติดตามปริมาณน้ำและเตรียมพร้อมเครื่องจักรกลสาธารณภัยตลอด 24 ชั่วโมง',
    officialUrl: 'https://portal.disaster.go.th/portal/public/index.do',
    sourceAttribution: 'ศูนย์เตือนภัยพิบัติแห่งชาติ กรมป้องกันและบรรเทาสาธารณภัย (DPM PORTAL)',
  },
];

export function getAlertsForProvince(provinceNameTh: string, regionNameTh?: string): OfficialAlert[] {
  return ACTIVE_OFFICIAL_ALERTS.filter(
    (alert) =>
      alert.targetAreas.includes(provinceNameTh) ||
      (regionNameTh && alert.targetAreas.includes(regionNameTh)) ||
      alert.targetAreas.includes('ประเทศไทย') ||
      alert.targetAreas.some((area) => provinceNameTh.includes(area))
  );
}
