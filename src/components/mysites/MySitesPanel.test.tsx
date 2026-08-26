import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MySitesPanel } from './MySitesPanel';

describe('MySitesPanel (Petchsiam & Salee Industry & BCM Intelligence)', () => {
  it('renders Petchsiam and Salee Industry sites with address', () => {
    render(<MySitesPanel />);

    expect(screen.getByText('บริษัท เพชรสยามประเทศไทย จำกัด')).toBeInTheDocument();
    expect(screen.getByText(/ซอยพระยามนธาตุฯ แยก 9/)).toBeInTheDocument();

    expect(screen.getByText('บริษัท สาลี่อุตสาหกรรม จำกัด (มหาชน)')).toBeInTheDocument();
    expect(screen.getByText(/ตำบลคลองสี่ อำเภอคลองหลวง/)).toBeInTheDocument();
  });

  it('triggers onSelectSite when clicking map action button', async () => {
    const user = userEvent.setup();
    const handleSelectSite = vi.fn();

    render(<MySitesPanel onSelectSite={handleSelectSite} />);

    const mapButtons = screen.getAllByRole('button', { name: /ดูบนแผนที่ GIS/ });
    await user.click(mapButtons[0]);

    expect(handleSelectSite).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'บริษัท เพชรสยามประเทศไทย จำกัด',
        province: 'กรุงเทพมหานคร',
      })
    );
  });

  it('triggers onCheckWeather when clicking weather action button', async () => {
    const user = userEvent.setup();
    const handleCheckWeather = vi.fn();

    render(<MySitesPanel onCheckWeather={handleCheckWeather} />);

    const weatherButtons = screen.getAllByRole('button', { name: /ตรวจสภาพอากาศ/ });
    await user.click(weatherButtons[1]); // Salee Industry

    expect(handleCheckWeather).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'บริษัท สาลี่อุตสาหกรรม จำกัด (มหาชน)',
        province: 'ปทุมธานี',
      })
    );
  });

  it('opens BCM Report Modal when clicking BCM report button and closes on close button', async () => {
    const user = userEvent.setup();
    render(<MySitesPanel />);

    const bcmButtons = screen.getAllByRole('button', { name: /สรุปรายงาน BCM/ });
    await user.click(bcmButtons[0]); // Petchsiam

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/รายงานประเมินความเสี่ยงอุทกภัยและความต่อเนื่องทางธุรกิจ/)).toBeInTheDocument();
    expect(screen.getByText('🖨️ พิมพ์ / บันทึก PDF รายงาน (Print BCM Report)')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'ปิดหน้าต่าง' });
    await user.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
