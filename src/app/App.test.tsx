import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.mock('../map/ThailandMap', () => ({
  ThailandMap: ({ selectedIsoCodes }: { selectedIsoCodes: readonly string[] }) => (
    <div aria-label="mock map">selected:{selectedIsoCodes.join(',')}</div>
  ),
}));

describe('command-center navigation', () => {
  beforeEach(() => window.history.replaceState({}, '', '/'));

  it('selects a region, exposes its province list, and resets nationally without reload', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^เหนือ17$/ }));
    expect(window.location.pathname).toBe('/region/north');
    expect(screen.getByRole('navigation', { name: 'ตำแหน่งปัจจุบัน' })).toHaveTextContent('ภาคเหนือ');
    expect(screen.getByRole('button', { name: 'เชียงใหม่' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Reset Thailand/ }));
    expect(window.location.pathname).toBe('/');
    expect(await screen.findByLabelText('mock map')).toHaveTextContent('selected:');
  }, 20000);

  it('restores province deep links and renders province hydrological telemetry', async () => {
    window.history.replaceState({}, '', '/province/chiang-mai');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Chiang Mai Situation' })).toBeInTheDocument();
    expect(screen.getByText('เชียงใหม่', { selector: '.situation-panel h2' })).toBeInTheDocument();
    expect(screen.getByText('เขื่อนแม่งัดสมบูรณ์ชล')).toBeInTheDocument();
    expect(screen.getByText('แม่น้ำปิง (สถานี P.1 สะพานนวรัฐ)')).toBeInTheDocument();
    expect(await screen.findByLabelText('mock map')).toHaveTextContent('selected:TH-50');
  });

  it('opens mobile navigation as an accessible dialog', async () => {
    const user = userEvent.setup();
    render(<App />);
    const trigger = screen.getByRole('button', { name: 'เปิดเมนูมือถือ' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Mobile command panel' })).toBeInTheDocument();
    expect(screen.getByText('เลือกพื้นที่')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Mobile command panel' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('exposes the GISTDA satellite flood layer in the mobile layer panel', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Layers/ }));
    const dialog = screen.getByRole('dialog', { name: 'Mobile command panel' });
    expect(dialog).toHaveTextContent('ภาพถ่ายดาวเทียมน้ำท่วมขัง (GISTDA Flood Inundation)');
    const floodCheckboxes = screen.getAllByLabelText('เปิด/ปิด เลเยอร์ภาพถ่ายดาวเทียมน้ำท่วมขัง');
    expect(floodCheckboxes[0]).not.toBeChecked();
  });

  it('keeps radar layer OFF by default and shows radar control panel when toggled ON', async () => {
    const user = userEvent.setup();
    render(<App />);
    const radarCheckboxes = screen.getAllByLabelText('เปิด/ปิด เลเยอร์เรดาร์ตรวจอากาศ');
    expect(radarCheckboxes[0]).not.toBeChecked();

    await user.click(radarCheckboxes[0]);
    expect(radarCheckboxes[0]).toBeChecked();
    expect(await screen.findByRole('region', { name: 'แผงควบคุมเรดาร์ตรวจอากาศ' })).toBeInTheDocument();
  });
});
