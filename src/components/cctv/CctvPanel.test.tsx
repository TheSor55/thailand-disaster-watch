import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CctvPanel } from './CctvPanel';
import { OFFICIAL_CCTV_STATIONS } from '../../domain/cctv';

describe('CctvPanel component', () => {
  it('renders station list and water level tags correctly', () => {
    render(
      <CctvPanel
        stations={OFFICIAL_CCTV_STATIONS}
        provinceNameTh="กรุงเทพมหานคร"
      />
    );

    expect(screen.getByText(/CCTV Watch \(กรุงเทพมหานคร\)/)).toBeInTheDocument();
    expect(screen.getByText(/สถานีสูบน้ำคลองบางบอน/)).toBeInTheDocument();
  });

  it('opens CCTV inspection modal on button click', () => {
    render(
      <CctvPanel
        stations={OFFICIAL_CCTV_STATIONS}
        provinceNameTh="กรุงเทพมหานคร"
      />
    );

    const inspectButtons = screen.getAllByRole('button', { name: /ดูภาพสดและมาตรวัดระดับน้ำ/ });
    expect(inspectButtons.length).toBeGreaterThan(0);

    fireEvent.click(inspectButtons[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/CCTV LIVE INSPECTION/)).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /Close CCTV Modal/ });
    fireEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders empty state when no stations are provided', () => {
    render(
      <CctvPanel
        stations={[]}
        provinceNameTh="จังหวัดทดสอบ"
      />
    );

    expect(screen.getByText(/ไม่มีจุดกล้อง CCTV ตรวจระดับน้ำ/)).toBeInTheDocument();
  });
});
