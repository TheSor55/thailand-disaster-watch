import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RadarControlPanel } from './RadarControlPanel';
import { getDemoRadarFrames } from '../../services/radar';

describe('RadarControlPanel Component (Phase 3.4)', () => {
  const demoData = getDemoRadarFrames();

  it('renders nothing when frames list is empty', () => {
    const { container } = render(
      <RadarControlPanel
        frames={[]}
        selectedFrameIndex={0}
        onSelectFrameIndex={vi.fn()}
        opacity={0.7}
        onOpacityChange={vi.fn()}
        isPlaying={false}
        onTogglePlay={vi.fn()}
        onClose={vi.fn()}
        mode="DEMO"
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders frame time, attribution, coverage note, and non-operational disclaimers', () => {
    render(
      <RadarControlPanel
        frames={demoData.frames}
        selectedFrameIndex={0}
        onSelectFrameIndex={vi.fn()}
        opacity={0.7}
        onOpacityChange={vi.fn()}
        isPlaying={false}
        onTogglePlay={vi.fn()}
        onClose={vi.fn()}
        mode="DEMO"
      />,
    );

    expect(screen.getByText('🌤 เรดาร์ตรวจอากาศสังเกตการณ์')).toBeInTheDocument();
    expect(screen.getByText('DEMO PREVIEW')).toBeInTheDocument();
    expect(screen.getByText(/Weather radar data by RainViewer/)).toBeInTheDocument();
    expect(screen.getByText(/COVERAGE MAY BE INCOMPLETE/)).toBeInTheDocument();
    expect(screen.getByText(/ไม่ใช่การแจ้งเตือนภัยทางการ/)).toBeInTheDocument();
  });

  it('calls onSelectFrameIndex when Next/Prev buttons or timeline ticks are clicked', () => {
    const handleSelect = vi.fn();
    render(
      <RadarControlPanel
        frames={demoData.frames}
        selectedFrameIndex={2}
        onSelectFrameIndex={handleSelect}
        opacity={0.7}
        onOpacityChange={vi.fn()}
        isPlaying={false}
        onTogglePlay={vi.fn()}
        onClose={vi.fn()}
        mode="DEMO"
      />,
    );

    const nextBtn = screen.getByTitle('เฟรมถัดไป');
    fireEvent.click(nextBtn);
    expect(handleSelect).toHaveBeenCalledWith(3);

    const prevBtn = screen.getByTitle('เฟรมก่อนหน้า');
    fireEvent.click(prevBtn);
    expect(handleSelect).toHaveBeenCalledWith(1);
  });

  it('calls onTogglePlay when Play button is clicked', () => {
    const handleTogglePlay = vi.fn();
    render(
      <RadarControlPanel
        frames={demoData.frames}
        selectedFrameIndex={0}
        onSelectFrameIndex={vi.fn()}
        opacity={0.7}
        onOpacityChange={vi.fn()}
        isPlaying={false}
        onTogglePlay={handleTogglePlay}
        onClose={vi.fn()}
        mode="DEMO"
      />,
    );

    const playBtn = screen.getByTitle('เล่น');
    fireEvent.click(playBtn);
    expect(handleTogglePlay).toHaveBeenCalledWith(true);
  });

  it('calls onOpacityChange when opacity slider changes', () => {
    const handleOpacityChange = vi.fn();
    render(
      <RadarControlPanel
        frames={demoData.frames}
        selectedFrameIndex={0}
        onSelectFrameIndex={vi.fn()}
        opacity={0.7}
        onOpacityChange={handleOpacityChange}
        isPlaying={false}
        onTogglePlay={vi.fn()}
        onClose={vi.fn()}
        mode="DEMO"
      />,
    );

    const slider = screen.getByLabelText('ปรับความโปร่งใสของเรดาร์');
    fireEvent.change(slider, { target: { value: '0.4' } });
    expect(handleOpacityChange).toHaveBeenCalledWith(0.4);
  });
});
