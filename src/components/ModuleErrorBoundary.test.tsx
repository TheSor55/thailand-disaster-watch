import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModuleErrorBoundary } from './ModuleErrorBoundary';

function BrokenModule(): never {
  throw new Error('test failure');
}

describe('ModuleErrorBoundary', () => {
  it('isolates a failed module and keeps a readable fallback', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(
      <ModuleErrorBoundary moduleName="Map">
        <BrokenModule />
      </ModuleErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Map unavailable');
    expect(screen.getByRole('alert')).toHaveTextContent('Other command-center modules remain available');
  });
});
