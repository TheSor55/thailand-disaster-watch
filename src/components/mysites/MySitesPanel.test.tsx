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

  it('filters by Warehouse DC and Industrial Estate zones correctly', async () => {
    const user = userEvent.setup();
    render(<MySitesPanel />);

    // Filter DC Warehouses
    const warehouseTab = screen.getByRole('tab', { name: /คลังสินค้า DC/ });
    await user.click(warehouseTab);

    expect(screen.getByText('DC - BigC (ศูนย์กระจายสินค้า บิ๊กซี)')).toBeInTheDocument();
    expect(screen.getByText('DC - Lotus (ศูนย์กระจายสินค้า โลตัส)')).toBeInTheDocument();
    expect(screen.getByText('DC - Makro (ศูนย์กระจายสินค้า แม็คโคร)')).toBeInTheDocument();
    expect(screen.getByText('DC - ไทวัสดุ (ศูนย์กระจายสินค้า ไทวัสดุ)')).toBeInTheDocument();
    expect(screen.getByText('DC - Homepro (ศูนย์กระจายสินค้า โฮมโปร)')).toBeInTheDocument();
    expect(screen.queryByText('บริษัท เพชรสยามประเทศไทย จำกัด')).not.toBeInTheDocument();

    // Filter Industrial Estates
    const estateTab = screen.getByRole('tab', { name: /โซนนิคมอุตสาหกรรม/ });
    await user.click(estateTab);

    expect(screen.getByText(/นิคมฯ บางกะดี่ ปทุมธานี/)).toBeInTheDocument();
    expect(screen.getByText(/นิคมฯ อมตะซิตี้ ชลบุรี/)).toBeInTheDocument();
    expect(screen.getByText(/นิคมฯ ไฮเทค บางปะอิน อยุธยา/)).toBeInTheDocument();
    expect(screen.getByText(/นิคมฯ บางปะอิน อยุธยา/)).toBeInTheDocument();
    expect(screen.getByText(/นิคมฯ โรจนะ อยุธยา/)).toBeInTheDocument();
    expect(screen.getByText(/นิคมฯ ESIE ปลวกแดง ระยอง/)).toBeInTheDocument();
    expect(screen.getByText(/นิคมฯ ปิ่นทอง 1 ศรีราชา ชลบุรี/)).toBeInTheDocument();
    expect(screen.getByText(/นิคมฯ ปิ่นทอง 2 ศรีราชา ชลบุรี/)).toBeInTheDocument();
    expect(screen.getByText(/นิคมฯ ปิ่นทอง 3 ศรีราชา ชลบุรี/)).toBeInTheDocument();
  });
});
