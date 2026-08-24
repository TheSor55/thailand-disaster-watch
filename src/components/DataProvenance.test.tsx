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
});
