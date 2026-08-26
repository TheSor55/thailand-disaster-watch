import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LayerControl } from './LayerControl';

describe('LayerControl', () => {
  it('keeps the GISTDA pilot unavailable until human verification', () => {
    render(
      <LayerControl
        basemapMode="dark"
        showProvinces
        onBasemapChange={vi.fn()}
        onProvinceVisibilityChange={vi.fn()}
      />,
    );

    const pendingLayer = screen
      .getByText('Satellite / GISTDA Flood Extent')
      .closest('[aria-disabled="true"]');
    expect(pendingLayer).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(
      screen.getByText('License and response schema require human verification'),
    ).toBeInTheDocument();
  });

  it('renders radar layer checkbox default to false and invokes onRadarVisibilityChange on toggle', () => {
    const handleRadarChange = vi.fn();
    render(
      <LayerControl
        basemapMode="dark"
        showProvinces
        showRadar={false}
        onBasemapChange={vi.fn()}
        onProvinceVisibilityChange={vi.fn()}
        onRadarVisibilityChange={handleRadarChange}
      />,
    );

    const radarCheckbox = screen.getByLabelText('เปิด/ปิด เลเยอร์เรดาร์ตรวจอากาศ');
    expect(radarCheckbox).not.toBeChecked();

    fireEvent.click(radarCheckbox);
    expect(handleRadarChange).toHaveBeenCalledWith(true);
  });
});
