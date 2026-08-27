import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WindyView } from './WindyView';

describe('WindyView component', () => {
  it('renders interactive toolbar and default wind layer iframe', () => {
    render(
      <WindyView
        lat={13.7563}
        lon={100.5018}
        zoom={7}
        locationName="กรุงเทพมหานคร"
      />
    );

    expect(screen.getByText(/WINDY\.COM METEOROLOGICAL/)).toBeInTheDocument();
    expect(screen.getByText(/การจำลองกระแสลม พายุ และกล้องเว็บแคม \(กรุงเทพมหานคร\)/)).toBeInTheDocument();
    
    const iframe = screen.getByTitle(/Windy\.com Interactive Meteorological Map/);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('overlay=wind'));
  });

  it('switches layers when layer buttons are clicked', () => {
    render(
      <WindyView
        lat={14.1678}
        lon={100.5186}
        zoom={8}
        locationName="พระนครศรีอยุธยา"
      />
    );

    const rainButton = screen.getByRole('button', { name: /เรดาร์ & ฝน \(Rain\)/ });
    fireEvent.click(rainButton);

    const iframe = screen.getByTitle(/Windy\.com Interactive Meteorological Map/);
    expect(iframe).toHaveAttribute('src', expect.stringContaining('overlay=rain'));

    const stormButton = screen.getByRole('button', { name: /ติดตามพายุ \(Storm Tracker\)/ });
    fireEvent.click(stormButton);
    expect(iframe).toHaveAttribute('src', expect.stringContaining('overlay=hurricanes'));
  });
});
