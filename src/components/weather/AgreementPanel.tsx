/**
 * AgreementPanel — displays source agreement between observed and forecast.
 * Does not present agreement when data is not semantically/time comparable.
 */

type Agreement = 'CONSISTENT' | 'PARTIAL_AGREEMENT' | 'CONFLICT' | 'INSUFFICIENT_DATA';

const AGREEMENT_LABEL: Record<Agreement, string> = {
  CONSISTENT: 'ข้อมูลสอดคล้องกัน',
  PARTIAL_AGREEMENT: 'สอดคล้องกันบางส่วน',
  CONFLICT: 'ข้อมูลขัดแย้งกัน',
  INSUFFICIENT_DATA: 'ข้อมูลยังไม่เพียงพอสำหรับการเปรียบเทียบ',
};

const AGREEMENT_CLASS: Record<Agreement, string> = {
  CONSISTENT: 'agreement--consistent',
  PARTIAL_AGREEMENT: 'agreement--partial',
  CONFLICT: 'agreement--conflict',
  INSUFFICIENT_DATA: 'agreement--insufficient',
};

interface AgreementPanelProps {
  agreement: Agreement;
  limitations?: string[];
}

export function AgreementPanel({ agreement, limitations = [] }: AgreementPanelProps) {
  return (
    <section className={`agreement-panel ${AGREEMENT_CLASS[agreement]}`} aria-label="Source Agreement">
      <div className="agreement-panel__header">
        <span className="eyebrow">SOURCE AGREEMENT</span>
        <h3>ความสอดคล้องของข้อมูล</h3>
      </div>
      <p className="agreement-panel__status">{AGREEMENT_LABEL[agreement]}</p>
      {limitations.length > 0 && (
        <ul className="agreement-panel__limitations" aria-label="Limitations">
          {limitations.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
