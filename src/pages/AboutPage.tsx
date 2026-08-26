/**
 * AboutPage — Project identity and system information.
 *
 * Contains:
 * - Thailand Disaster Watch identity
 * - FutureGreen Disaster Intelligence Platform
 * - Project Creator and Lead Developer: Sorawit Suwannarong
 * - System purpose and status
 * - Data disclaimer
 */

interface AboutPageProps {
  onBack?: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="about-page" aria-label="About Thailand Disaster Watch">
      <header className="about-page__header">
        <div className="about-page__logo-area" aria-label="FutureGreen Logo">
          <img
            src="/futuregreen-logo.png"
            alt="FutureGreen Consulting Logo"
            className="about-page__logo"
            width="80"
            height="80"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <div>
          <h2 className="about-page__title">Thailand Disaster Watch</h2>
          <p className="about-page__platform">FutureGreen Disaster Intelligence Platform</p>
        </div>
      </header>

      <section className="about-section">
        <h3>ระบบและวัตถุประสงค์</h3>
        <p>
          Thailand Disaster Watch เป็นแพลตฟอร์มสนับสนุนการตัดสินใจด้านภัยพิบัติและความต่อเนื่องทางธุรกิจ (BCM)
          สำหรับประเทศไทย ระบบนี้รวบรวมและแสดงข้อมูลจากหลายแหล่งโดยแยกประเภทข้อมูลอย่างชัดเจน
          เพื่อสนับสนุนการตัดสินใจในสถานการณ์ภัยพิบัติ
        </p>
      </section>

      <section className="about-section">
        <h3>สถานะระบบ</h3>
        <div className="about-status-badge" role="status">
          <strong>DEVELOPMENT PREVIEW / NOT OPERATIONAL</strong>
          <p>
            ระบบนี้อยู่ระหว่างการพัฒนา ยังไม่ใช่ระบบปฏิบัติการจริง
            ห้ามใช้ข้อมูลจากระบบนี้เป็นพื้นฐานของการตัดสินใจในสถานการณ์ฉุกเฉิน
          </p>
        </div>
      </section>

      <section className="about-section">
        <h3>ข้อสงวนสิทธิ์ด้านข้อมูล</h3>
        <p>
          การแจ้งเตือนภัยทางการยังคงเป็นอำนาจของหน่วยงานที่มีอำนาจตามกฎหมาย เช่น
          กรมอุตุนิยมวิทยา (TMD) กรมชลประทาน (RID) และกรมป้องกันและบรรเทาสาธารณภัย (DDPM)
          ข้อมูลจากระบบนี้ไม่มีผลแทนประกาศทางการ
        </p>
      </section>

      <section className="about-section about-section--identity">
        <h3>ผู้พัฒนา</h3>
        <dl className="about-identity">
          <div>
            <dt>ผู้สร้างโครงการ (Project Creator)</dt>
            <dd>Sorawit Suwannarong</dd>
          </div>
          <div>
            <dt>นักพัฒนาหลัก (Lead Developer)</dt>
            <dd>Sorawit Suwannarong</dd>
          </div>
          <div>
            <dt>แพลตฟอร์ม</dt>
            <dd>FutureGreen Disaster Intelligence Platform</dd>
          </div>
        </dl>
        <p className="about-credit">Developed by Sorawit Suwannarong</p>
      </section>

      <section className="about-section">
        <h3>เวอร์ชัน</h3>
        <dl className="about-identity">
          <div><dt>Phase</dt><dd>3.3 — Real User Acceptance Test &amp; UX Refinement</dd></div>
          <div><dt>Repository</dt><dd>TheSor55/thailand-disaster-watch</dd></div>
        </dl>
      </section>

      {onBack && (
        <button type="button" className="about-page__back" onClick={onBack} aria-label="กลับไปหน้าหลัก">
          ← กลับ
        </button>
      )}
    </div>
  );
}
