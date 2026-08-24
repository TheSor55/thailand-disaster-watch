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
  });

  it('restores province deep links and keeps all situation modules explicitly disconnected', async () => {
    window.history.replaceState({}, '', '/province/chiang-mai');
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Chiang Mai Situation' })).toBeInTheDocument();
    expect(screen.getByText('เชียงใหม่', { selector: '.situation-panel h2' })).toBeInTheDocument();
    expect(screen.getAllByText('DATA SOURCE NOT CONNECTED')).toHaveLength(8);
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

  it('exposes the pending GISTDA layer in the mobile layer panel without enabling it', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Layers/ }));
    const dialog = screen.getByRole('dialog', { name: 'Mobile command panel' });
    expect(dialog).toHaveTextContent('Satellite / GISTDA Flood Extent');
    expect(dialog).toHaveTextContent('PENDING');
    expect(dialog.querySelector('[aria-disabled="true"]')).toBeInTheDocument();
  });
});
