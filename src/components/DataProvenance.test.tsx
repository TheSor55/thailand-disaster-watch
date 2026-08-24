import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataProvenance } from './DataProvenance';

describe('DataProvenance', () => {
  it('makes unavailable live data explicit', () => {
    render(<DataProvenance />);
    expect(screen.getByText('Not connected')).toBeInTheDocument();
    expect(screen.getByText('No live data')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(4);
  });

  it('renders all required pilot provenance fields without inventing observation time', () => {
    render(
      <DataProvenance
        record={{
          source: 'GISTDA',
          provider: 'GISTDA Disaster Platform',
          dataset: 'Flood extent 1 day',
          authority: 'Official observation candidate',
          dataType: 'Observed Flood Extent',
          observedAt: null,
          publishedAt: null,
          retrievedAt: '2026-08-24T07:30:00Z',
          freshness: 'UNKNOWN',
          confidence: 'UNKNOWN',
          attribution: 'GISTDA · license review pending',
          status: 'PENDING — PILOT DISABLED',
        }}
      />,
    );

    expect(screen.getByText('GISTDA')).toBeInTheDocument();
    expect(screen.getByText('Observed Flood Extent')).toBeInTheDocument();
    expect(screen.getAllByText('UNKNOWN')).toHaveLength(2);
    expect(screen.getByText('PENDING — PILOT DISABLED')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(2);
  });

  it('renders missing attribution explicitly', () => {
    render(
      <DataProvenance
        record={{
          source: 'Example',
          provider: 'Example provider',
          dataset: 'Example dataset',
          authority: 'SYSTEM_ADVISORY',
          dataType: 'MODEL',
          observedAt: null,
          publishedAt: null,
          retrievedAt: null,
          freshness: 'UNKNOWN',
          confidence: 'UNKNOWN',
          attribution: null,
          status: 'PENDING',
        }}
      />,
    );
    expect(screen.getByText('Not provided')).toBeInTheDocument();
  });
});
