import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SafetyBanner } from './SafetyBanner';

describe('SafetyBanner', () => {
  it('labels offline cached information explicitly', () => {
    render(<SafetyBanner state="OFFLINE" />);
    expect(screen.getByRole('status')).toHaveTextContent(
      'OFFLINE — SHOWING CACHED INFORMATION',
    );
  });

  it('does not visually identify a system advisory as an official warning', () => {
    render(<SafetyBanner state="SYSTEM_ADVISORY" />);
    const banner = screen.getByRole('status');
    expect(banner).toHaveAttribute('data-safety-state', 'SYSTEM_ADVISORY');
    expect(banner).toHaveTextContent('NOT AN OFFICIAL WARNING');
  });

  it('labels exercise mode clearly', () => {
    render(<SafetyBanner state="EXERCISE" />);
    expect(screen.getByText(/NOT A REAL INCIDENT/)).toBeInTheDocument();
  });
});
