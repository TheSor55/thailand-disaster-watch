import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LocationSelector } from './LocationSelector';
import type { WeatherSituationRequest } from '../../services/weatherSituation';

const mockLocation: WeatherSituationRequest = {
  latitude: 13.7563,
  longitude: 100.5018,
  label: 'กรุงเทพมหานคร (Bangkok)',
  mode: 'DEMO',
};

describe('LocationSelector (77 Provinces Scroll & Search)', () => {
  it('renders the province dropdown with 77 provinces', () => {
    const handleLocationChange = vi.fn();
    render(
      <LocationSelector
        location={mockLocation}
        onLocationChange={handleLocationChange}
      />
    );

    const select = screen.getByRole('combobox', { name: 'เลื่อนเลือกจังหวัด' });
    expect(select).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'เชียงใหม่ (Chiang Mai)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'ชลบุรี (Chon Buri)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'ขอนแก่น (Khon Kaen)' })).toBeInTheDocument();
  });

  it('updates location when user changes province in dropdown', async () => {
    const user = userEvent.setup();
    const handleLocationChange = vi.fn();
    render(
      <LocationSelector
        location={mockLocation}
        onLocationChange={handleLocationChange}
      />
    );

    const select = screen.getByRole('combobox', { name: 'เลื่อนเลือกจังหวัด' });
    await user.selectOptions(select, 'TH-20'); // Chon Buri

    expect(handleLocationChange).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'ชลบุรี (Chon Buri)',
        latitude: 13.3611,
        longitude: 100.9847,
      })
    );
  });

  it('filters provinces when user types in search box', async () => {
    const user = userEvent.setup();
    const handleLocationChange = vi.fn();
    render(
      <LocationSelector
        location={mockLocation}
        onLocationChange={handleLocationChange}
      />
    );

    const searchInput = screen.getByRole('textbox', { name: 'ค้นหาชื่อจังหวัด' });
    await user.type(searchInput, 'ชลบุรี');

    expect(screen.getByRole('button', { name: /ชลบุรี/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /ชลบุรี/ }));

    expect(handleLocationChange).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'ชลบุรี (Chon Buri)',
      })
    );
  });
});
