import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SystemHealthPanel } from './SystemHealthPanel';

describe('SystemHealthPanel', () => {
  it('renders disabled provider health without credential fields', () => {
    render(
      <SystemHealthPanel
        operationalStatusByProviderId={{ GISTDA: 'PENDING' }}
        providers={[{
          providerId: 'GISTDA',
          status: 'DISABLED',
          lastSuccessAt: null,
          lastFailureAt: null,
          latencyMs: null,
          consecutiveFailures: 0,
          freshness: 'UNKNOWN',
        }]}
      />,
    );
    expect(screen.getByRole('table')).toHaveTextContent('GISTDA');
    expect(screen.getByRole('table')).toHaveTextContent('DISABLED');
    expect(screen.getByRole('table')).toHaveTextContent('PENDING');
    expect(screen.getByRole('table')).not.toHaveTextContent(/api key|authorization/i);
  });
});
