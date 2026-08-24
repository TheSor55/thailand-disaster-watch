const baselineItems = [
  ['Architecture', 'React + Vite'],
  ['Data sources', 'ยังไม่เชื่อมต่อ'],
  ['Operational status', 'ยังไม่อนุมัติใช้งาน'],
] as const;

export function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Phase 0.5 · Architecture stabilization
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Thailand Disaster Watch
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          ระบบติดตามสถานการณ์น้ำและอุทกภัยเพื่อสนับสนุนการตัดสินใจ
          ขณะนี้อยู่ระหว่างเตรียมสถาปัตยกรรมและตรวจสอบแหล่งข้อมูลอย่างเป็นทางการ
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {baselineItems.map(([label, value]) => (
            <section
              key={label}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-5"
            >
              <h2 className="text-sm text-slate-400">{label}</h2>
              <p className="mt-2 font-semibold text-slate-100">{value}</p>
            </section>
          ))}
        </div>

        <aside className="mt-10 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100">
          ระบบนี้ไม่ใช่ระบบประกาศเตือนภัยของทางราชการ ไม่มีข้อมูลสถานการณ์จริงใน PHASE 0.5
          และยังไม่ได้ Deploy เพื่อใช้งานจริง
        </aside>
      </section>
    </main>
  );
}
