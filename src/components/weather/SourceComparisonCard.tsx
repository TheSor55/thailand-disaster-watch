/**
 * SourceComparisonCard — Phase 3.5
 *
 * Section F: Source Status & Semantic Comparison
 *
 * Requirements:
 * - Provider status list (TMD, RainViewer, Open-Meteo)
 * - Deterministic, conservative source comparison result
 * - Explicitly shows confidence as UNKNOWN (no synthetic score)
 * - Highlights that availability does NOT imply operational approval
 */

import type { SourceComparisonResult } from '../../domain/intelligence';

interface SourceComparisonCardProps {
  comparison: SourceComparisonResult;
  tmdStatus: 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';
  radarStatus: 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';
  forecastStatus: 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';
}

function getBadgeClass(state: string): string {
  switch (state) {
    case 'CONSISTENT':
      return 'comparison-badge--consistent';
    case 'PARTIAL_AGREEMENT':
      return 'comparison-badge--partial';
    case 'CONFLICT':
      return 'comparison-badge--conflict';
    case 'INSUFFICIENT_DATA':
    default:
      return 'comparison-badge--insufficient';
  }
}

export function SourceComparisonCard({
  comparison,
  tmdStatus,
  radarStatus,
  forecastStatus,
}: SourceComparisonCardProps) {
  return (
    <section className="weather-intel-section" aria-label="สถานะแหล่งข้อมูลและการเปรียบเทียบเชิงความหมาย">
      <div className="weather-intel-section__header">
        <span className="eyebrow">SOURCE STATUS &amp; CONSERVATIVE COMPARISON</span>
        <h3 className="weather-intel-section__title">⚖ การเปรียบเทียบข้อมูลและการทำงานของแต่ละแหล่ง (Source Comparison)</h3>
      </div>

      <div className="comparison-card-grid">
        {/* Comparison Result Box */}
        <div className="comparison-result-box">
          <div className="comparison-result-header">
            <span className="eyebrow">ผลการประเมินความสอดคล้อง (Semantic Comparison)</span>
            <span className={`comparison-badge ${getBadgeClass(comparison.state)}`}>
              {comparison.state}
            </span>
          </div>
          <h4 className="comparison-summary-title">{comparison.summaryTh}</h4>
          <p className="comparison-summary-details">{comparison.detailsTh}</p>
          <div className="comparison-meta-row">
            <span className="comparison-meta-item">
              ระดับความมั่นใจระบบ (System Confidence): <strong>{comparison.confidence} (ตามมาตรฐานความปลอดภัย)</strong>
            </span>
          </div>
        </div>

        {/* Source Availability Status List */}
        <div className="source-status-list-box">
          <span className="eyebrow">สถานะความพร้อมของแต่ละผู้ให้บริการ</span>
          <div className="source-status-items">
            <div className="source-status-item">
              <div className="source-status-item__left">
                <span className="status-dot" aria-hidden="true" />
                <div>
                  <strong>TMD (กรมอุตุนิยมวิทยา)</strong>
                  <small>OBSERVED · สถานีตรวจวัดจริง</small>
                </div>
              </div>
              <span className={`status-chip status-chip--small status-chip--${tmdStatus.toLowerCase()}`}>
                {tmdStatus}
              </span>
            </div>

            <div className="source-status-item">
              <div className="source-status-item__left">
                <span className="status-dot" aria-hidden="true" />
                <div>
                  <strong>RainViewer (เรดาร์โมเสก)</strong>
                  <small>OBSERVED_REMOTE_SENSING · เรดาร์สังเกตการณ์</small>
                </div>
              </div>
              <span className={`status-chip status-chip--small status-chip--${radarStatus.toLowerCase()}`}>
                {radarStatus}
              </span>
            </div>

            <div className="source-status-item">
              <div className="source-status-item__left">
                <span className="status-dot" aria-hidden="true" />
                <div>
                  <strong>Open-Meteo (แบบจำลองพยากรณ์)</strong>
                  <small>MODEL_FORECAST · แบบจำลองตัวเลข</small>
                </div>
              </div>
              <span className={`status-chip status-chip--small status-chip--${forecastStatus.toLowerCase()}`}>
                {forecastStatus}
              </span>
            </div>
          </div>
          <small className="source-status-disclaimer">
            * สถานะ AVAILABLE หมายถึงการเชื่อมต่อข้อมูลในโหมดทดสอบสำเร็จ ไม่ได้หมายความถึงการอนุมัติใช้งานเป็นระบบเตือนภัยทางการ
          </small>
        </div>
      </div>
    </section>
  );
}
