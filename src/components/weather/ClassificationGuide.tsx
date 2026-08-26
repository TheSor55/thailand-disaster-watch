/**
 * ClassificationGuide — explains the data classification vocabulary.
 * Never allows a category to silently change meaning.
 */

const CLASSIFICATIONS = [
  {
    code: 'OBSERVED',
    th: 'ข้อมูลสังเกตการณ์',
    desc: 'วัดได้จากสถานีตรวจวัดจริง ณ เวลาสังเกตการณ์',
  },
  {
    code: 'MODEL_FORECAST',
    th: 'ข้อมูลแบบจำลองพยากรณ์',
    desc: 'ผลลัพธ์จากแบบจำลองเชิงตัวเลข ไม่ใช่ข้อมูลสังเกตการณ์จริง',
  },
  {
    code: 'OFFICIAL_FORECAST',
    th: 'พยากรณ์ทางการ',
    desc: 'พยากรณ์อากาศที่ออกโดยหน่วยงานอุตุนิยมวิทยาทางการ',
  },
  {
    code: 'OFFICIAL_WARNING',
    th: 'ประกาศเตือนจากหน่วยงานทางการ',
    desc: 'ประกาศเตือนภัยที่มีผลบังคับทางการจากหน่วยงานที่มีอำนาจ',
  },
  {
    code: 'SYSTEM_ADVISORY',
    th: 'คำแนะนำจากระบบ',
    desc: 'การวิเคราะห์จากระบบ ไม่ใช่ประกาศทางการ',
  },
] as const;

interface ClassificationGuideProps {
  collapsed?: boolean;
}

export function ClassificationGuide({ collapsed = false }: ClassificationGuideProps) {
  return (
    <section className="classification-guide" aria-label="Data Classification Guide">
      <div className="classification-guide__header">
        <span className="eyebrow">DATA CLASSIFICATION</span>
        <h3>ประเภทข้อมูล</h3>
      </div>
      {!collapsed && (
        <ul className="classification-guide__list" role="list">
          {CLASSIFICATIONS.map((c) => (
            <li key={c.code} className="classification-guide__item">
              <span className={`classification-badge classification-badge--${c.code.toLowerCase().replace('_', '-')}`}>
                {c.code}
              </span>
              <div>
                <strong>{c.th}</strong>
                <p>{c.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
