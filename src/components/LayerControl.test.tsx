import { render, screen } from '@testing-library/react';
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
});
