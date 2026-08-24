import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataProvenance } from './DataProvenance';

describe('DataProvenance', () => {
  it('makes unavailable live data explicit', () => {
    render(<DataProvenance />);
    expect(screen.getByText('Not connected')).toBeInTheDocument();
    expect(screen.getByText('No live data')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(3);
  });

  it('renders all required pilot provenance fields without inventing observation time', () => {
    render(
      <DataProvenance
        record={{
          source: 'GISTDA',
          dataset: 'Flood extent 1 day',
          dataType: 'Observed Flood Extent',
          observedAt: null,
          retrievedAt: '2026-08-24T07:30:00Z',
          freshness: 'UNKNOWN',
          attribution: 'GISTDA · license review pending',
          status: 'PENDING — PILOT DISABLED',
        }}
      />,
    );

    expect(screen.getByText('GISTDA')).toBeInTheDocument();
    expect(screen.getByText('Observed Flood Extent')).toBeInTheDocument();
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
    expect(screen.getByText('PENDING — PILOT DISABLED')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
