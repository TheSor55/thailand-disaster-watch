import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LayerControl } from './LayerControl';

describe('LayerControl (v1.2)', () => {
  it('renders GISTDA satellite flood layer checkbox and invokes onFloodVisibilityChange on toggle', () => {
    const handleFloodChange = vi.fn();
    render(
      <LayerControl
        basemapMode="dark"
        showProvinces
        showFlood={false}
        onBasemapChange={vi.fn()}
        onProvinceVisibilityChange={vi.fn()}
        onFloodVisibilityChange={handleFloodChange}
      />,
    );

    const floodCheckbox = screen.getByLabelText('เปิด/ปิด เลเยอร์ภาพถ่ายดาวเทียมน้ำท่วมขัง');
    expect(floodCheckbox).not.toBeChecked();

    fireEvent.click(floodCheckbox);
    expect(handleFloodChange).toHaveBeenCalledWith(true);
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
