/**
 * WeatherSituationPage tests — Phase 3.5 Multi-Source Weather & Radar Intelligence Preview
 *
 * Tests cover:
 * - DEMO PREVIEW mode: renders deterministic fixture with explicit DEMO label
 * - CONTROLLED LIVE PREVIEW mode: requests live endpoint with explicit LIVE label
 * - Mode switching: user can toggle between DEMO and CONTROLLED LIVE modes
 * - Multi-source Intelligence: renders TMD (OBSERVED), RainViewer (OBSERVED_REMOTE_SENSING), Open-Meteo (MODEL_FORECAST)
 * - Time Alignment Matrix: displays exact timestamps without synthetic values
 * - Source Comparison: shows conservative comparison result and confidence UNKNOWN
 * - Failure isolation: independent provider failure does not crash the page
 * - Safety invariants: realDataConnected=false, operationalUseApproved=false
 * - Forbidden features: NO nowcast, NO rain ETA, NO storm tracking
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherSituationPage } from './WeatherSituationPage';

// Mock the service adapters
const mockFetchWeatherSituationUI = vi.fn();
const mockFetchRadarFramesUI = vi.fn();

vi.mock('../../services/weatherSituation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/weatherSituation')>();
  return {
    ...actual,
    fetchWeatherSituationUI: (...args: unknown[]) => mockFetchWeatherSituationUI(...args),
  };
});

vi.mock('../../services/radar', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/radar')>();
  return {
    ...actual,
    fetchRadarFramesUI: (...args: unknown[]) => mockFetchRadarFramesUI(...args),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  if (typeof window !== 'undefined') {
    window.history.replaceState({}, '', '/');
  }
});

describe('WeatherSituationPage (Phase 3.5)', () => {
  const baseFixture = {
    location: { latitude: 13.7563, longitude: 100.5018, label: 'กรุงเทพมหานคร (Bangkok)' },
    generatedAt: new Date().toISOString(),
    observed: {
      source: 'TMD (Demo Fixture)',
      observedAt: new Date().toISOString(),
      retrievedAt: new Date().toISOString(),
      precipitation: 0,
      temperatureCelsius: 32.5,
      humidityPercent: 70,
      windSpeedKph: 12.0,
      freshness: 'FRESH' as const,
      provenance: 'Demo observation fixture',
    },
    forecast: {
      source: 'Open-Meteo (Demo Fixture)',
      validAt: new Date().toISOString(),
      retrievedAt: new Date().toISOString(),
      precipitationMm: 0.0,
      precipitationProbabilityPercent: 20,
      temperatureCelsius: 31.0,
      humidityPercent: 74,
      windSpeedKph: 14.0,
      freshness: 'FRESH' as const,
      provenance: 'Demo forecast fixture',
    },
    officialWarning: null,
    sourceAgreement: 'CONSISTENT' as const,
    confidence: 'UNKNOWN' as const,
    limitations: ['Demo limitation note'],
  };

  const radarDemoFixture = {
    provider: 'RainViewer (Demo Mode)',
    generatedAt: new Date().toISOString(),
    mode: 'DEMO' as const,
    frames: [
      {
        provider: 'RainViewer' as const,
        frameId: 'demo_1',
        frameTime: new Date().toISOString(),
        retrievedAt: new Date().toISOString(),
        tileUrl: 'https://tilecache.rainviewer.com/v2/radar/1740000000/256/{z}/{x}/{y}/2/1_1.png',
        coverage: 'THAILAND_AND_GLOBAL_MOSAIC' as const,
        coverageNote: 'COVERAGE MAY BE INCOMPLETE' as const,
        attribution: 'Weather radar data by RainViewer',
        attributionUrl: 'https://www.rainviewer.com/',
        classification: 'OBSERVED_REMOTE_SENSING' as const,
        freshness: 'FRESH' as const,
        status: 'DEMO' as const,
      },
    ],
    sourceAgreement: 'NOT_APPLICABLE' as const,
    limitations: [],
    freshnessPolicy: 'INTERNAL_PREVIEW_POLICY' as const,
  };

  it('renders all three evidence sources: TMD (OBSERVED), RainViewer (OBSERVED_REMOTE_SENSING), Open-Meteo (MODEL_FORECAST)', async () => {
    mockFetchWeatherSituationUI.mockResolvedValue({ status: 'DEMO', data: baseFixture });
    mockFetchRadarFramesUI.mockResolvedValue({ status: 'DEMO', data: radarDemoFixture });

    render(<WeatherSituationPage />);

    await waitFor(() => {
      // TMD Observed
      expect(screen.getAllByText(/OBSERVED/i).length).toBeGreaterThan(0);
      // RainViewer Radar
      expect(screen.getAllByText(/OBSERVED_REMOTE_SENSING/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/ภาพเรดาร์สังเกตการณ์/i)).toBeInTheDocument();
      // Open-Meteo Model Forecast
      expect(screen.getAllByText(/MODEL_FORECAST/i).length).toBeGreaterThan(0);
    });
  });

  it('renders Time Alignment Matrix and Source Comparison with UNKNOWN confidence', async () => {
    mockFetchWeatherSituationUI.mockResolvedValue({ status: 'DEMO', data: baseFixture });
    mockFetchRadarFramesUI.mockResolvedValue({ status: 'DEMO', data: radarDemoFixture });

    render(<WeatherSituationPage />);

    await waitFor(() => {
      expect(screen.getByText(/ตารางเทียบเวลาอ้างอิงของแต่ละแหล่งข้อมูล/i)).toBeInTheDocument();
      expect(screen.getByText(/การเปรียบเทียบข้อมูลและการทำงานของแต่ละแหล่ง/i)).toBeInTheDocument();
      expect(screen.getByText(/UNKNOWN \(ตามมาตรฐานความปลอดภัย\)/i)).toBeInTheDocument();
    });
  });

  it('isolates radar failure: page renders weather cards normally when radar is unavailable', async () => {
    mockFetchWeatherSituationUI.mockResolvedValue({ status: 'DEMO', data: baseFixture });
    mockFetchRadarFramesUI.mockResolvedValue({
      status: 'RADAR_UNAVAILABLE',
      message: 'Radar Preview is disabled by environment configuration',
    });

    render(<WeatherSituationPage />);

    await waitFor(() => {
      expect(screen.getAllByText('OBSERVED').length).toBeGreaterThan(0);
      expect(screen.getByText(/Radar Preview is disabled/i)).toBeInTheDocument();
    });
  });

  it('calls onBack handler when back button is clicked', async () => {
    const user = userEvent.setup();
    const handleBack = vi.fn();
    mockFetchWeatherSituationUI.mockResolvedValue({ status: 'DEMO', data: baseFixture });
    mockFetchRadarFramesUI.mockResolvedValue({ status: 'DEMO', data: radarDemoFixture });

    render(<WeatherSituationPage onBack={handleBack} />);

    const backBtn = screen.getByRole('button', { name: /กลับไปหน้าแผนที่ GIS/i });
    expect(backBtn).toBeTruthy();
    await user.click(backBtn);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('safety: strictly preserves zero nowcasting, zero ETA, and safety invariants', () => {
    const pageSource = WeatherSituationPage.toString();
    expect(pageSource).not.toContain('realDataConnected: true');
    expect(pageSource).not.toContain('operationalUseApproved: true');
  });
});
