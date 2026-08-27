import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SeismoWatchView } from './SeismoWatchView';

describe('SeismoWatchView component', () => {
  it('renders SeismoWatch header and embedded iframe correctly', () => {
    render(<SeismoWatchView />);

    expect(screen.getByText(/SEISMIC & TSUNAMI WATCH/)).toBeInTheDocument();
    expect(
      screen.getByText(/SeismoWatch: แผนที่เฝ้าระวังแผ่นดินไหวและคลื่นสึนามิ/)
    ).toBeInTheDocument();

    const iframe = screen.getByTitle(/SeismoWatch Earthquake Monitoring System/);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://thesor55.github.io/seismowatch/');
  });

  it('calls onBack handler when back button is clicked', () => {
    const handleBack = vi.fn();
    render(<SeismoWatchView onBack={handleBack} />);

    const backButton = screen.getByRole('button', { name: /← กลับหน้าหลัก/ });
    fireEvent.click(backButton);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });
});
