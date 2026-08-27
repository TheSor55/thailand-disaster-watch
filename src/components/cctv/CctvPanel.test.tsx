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

    expect(screen.getByText(/CCTV & ระดับน้ำ \(กรุงเทพมหานคร\)/)).toBeInTheDocument();
    expect(screen.getByText(/สถานีสูบน้ำคลองบางบอน/)).toBeInTheDocument();
  });

  it('filters coastal and inland stations using tabs', () => {
    render(
      <CctvPanel
        stations={OFFICIAL_CCTV_STATIONS}
        provinceNameTh="ประเทศไทย"
      />
    );

    const coastalTab = screen.getByRole('button', { name: /🌊 ชายหาด\/อ่าวไทย-อันดามัน/ });
    fireEvent.click(coastalTab);
    expect(screen.getByText(/หาดพัทยา-จอมเทียน/)).toBeInTheDocument();

    const inlandTab = screen.getByRole('button', { name: /🏞️ แม่น้ำ\/คลองระบายน้ำ/ });
    fireEvent.click(inlandTab);
    expect(screen.getByText(/สถานีสูบน้ำคลองบางบอน/)).toBeInTheDocument();
  });

  it('opens CCTV inspection modal on button click', () => {
    render(
      <CctvPanel
        stations={OFFICIAL_CCTV_STATIONS}
        provinceNameTh="กรุงเทพมหานคร"
      />
    );

    const inspectButtons = screen.getAllByRole('button', { name: /ดูภาพมุมกล้องและโทรมาตรระดับน้ำ/ });
    expect(inspectButtons.length).toBeGreaterThan(0);

    fireEvent.click(inspectButtons[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/RIVER\/CANAL CAMERA/)).toBeInTheDocument();

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

    expect(screen.getByText(/ไม่มีจุดตรวจวัดในหมวดหมู่นี้/)).toBeInTheDocument();
  });
});
