import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MapStatusMessages } from './ThailandMap';

describe('map fallback states', () => {
  it('shows loading and source failures without crashing the page', () => {
    render(<MapStatusMessages mapReady={false} mapUnavailable boundaryUnavailable />);
    expect(screen.getByRole('status')).toHaveTextContent('กำลังเตรียมแผนที่ประเทศไทย');
    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(screen.getByText('MAP SERVICE TEMPORARILY UNAVAILABLE')).toBeInTheDocument();
    expect(screen.getByText('PROVINCE BOUNDARY LAYER UNAVAILABLE')).toBeInTheDocument();
  });
});
