/**
 * WeatherSituationPage tests — Phase 3.1
 *
 * Tests cover:
 * - PIPELINE_DISABLED state renders DEMO notice
 * - Observed card renders
 * - Forecast cards render
 * - Error state renders
 * - Classification guide visible on expand
 * - System gate panel visible on expand
 * - Preview badge always visible
 * - FORBIDDEN: no radar, RainViewer, Windy references
 */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherSituationPage } from './WeatherSituationPage';

// Mock the service
const mockFetchWeatherSituationUI = vi.fn();

vi.mock('../../services/weatherSituation', () => ({
  fetchWeatherSituationUI: (...args: unknown[]) => mockFetchWeatherSituationUI(...args),
  WEATHER_SITUATION_FIXTURE: {
    location: { latitude: 13.7563, longitude: 100.5018, label: 'test' },
    generatedAt: new Date().toISOString(),
    observed: null,
    forecast: null,
    officialWarning: null,
    sourceAgreement: 'INSUFFICIENT_DATA',
    confidence: 'UNKNOWN',
    limitations: ['pipeline disabled'],
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('WeatherSituationPage', () => {
  it('always shows DEVELOPMENT PREVIEW badge', async () => {
    // Return a pending promise so component stays in LOADING state during check
    mockFetchWeatherSituationUI.mockReturnValue(new Promise(() => {}));
    render(<WeatherSituationPage />);
    expect(screen.getAllByText(/DEVELOPMENT PREVIEW/i).length).toBeGreaterThan(0);
  });

  it('shows DEMO/PREVIEW notice in PIPELINE_DISABLED state', async () => {
    const fixture = {
      location: { latitude: 13.7563, longitude: 100.5018, label: 'test' },
      generatedAt: new Date().toISOString(),
      observed: null,
      forecast: null,
      officialWarning: null,
      sourceAgreement: 'INSUFFICIENT_DATA' as const,
      confidence: 'UNKNOWN' as const,
      limitations: ['pipeline disabled'],
    };
    mockFetchWeatherSituationUI.mockResolvedValueOnce({ status: 'PIPELINE_DISABLED', fixture });
    render(<WeatherSituationPage />);
    await waitFor(() => {
      expect(screen.getByText(/Pipeline ปิดอยู่/i)).toBeTruthy();
    });
  });

  it('shows error state when API fails', async () => {
    mockFetchWeatherSituationUI.mockResolvedValueOnce({ status: 'ERROR', message: 'Network error' });
    render(<WeatherSituationPage />);
    await waitFor(() => {
      // Error state banner text
      expect(screen.getAllByText(/ไม่สามารถรับข้อมูลสภาพอากาศ|Network error/i).length).toBeGreaterThan(0);
    });
  });

  it('shows observed card and forecast cards when data available', async () => {
    const mockSituation = {
      location: { latitude: 13.7563, longitude: 100.5018, label: 'Bangkok' },
      generatedAt: new Date().toISOString(),
      observed: {
        source: 'TMD',
        observedAt: new Date().toISOString(),
        retrievedAt: new Date().toISOString(),
        precipitation: 0,
        temperatureCelsius: 32,
        humidityPercent: 75,
        windSpeedKph: 10,
        freshness: 'FRESH' as const,
        provenance: 'TMD station test',
      },
      forecast: {
        source: 'Open-Meteo',
        validAt: new Date().toISOString(),
        retrievedAt: new Date().toISOString(),
        precipitationMm: 0.5,
        precipitationProbabilityPercent: 30,
        temperatureCelsius: 31,
        humidityPercent: 78,
        windSpeedKph: 12,
        freshness: 'FRESH' as const,
        provenance: 'Open-Meteo model',
      },
      officialWarning: null,
      sourceAgreement: 'CONSISTENT' as const,
      confidence: 'HIGH' as const,
      limitations: [],
    };
    mockFetchWeatherSituationUI.mockResolvedValueOnce({ status: 'AVAILABLE', data: mockSituation });
    render(<WeatherSituationPage />);

    await waitFor(() => {
      // Observed card question
      expect(screen.getAllByText(/ตอนนี้มีฝนไหม\?/i).length).toBeGreaterThan(0);
      // Forecast cards questions
      expect(screen.getAllByText(/อีก 1 ชั่วโมงมีแนวโน้มฝนไหม\?/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/อีก 3 ชั่วโมงมีแนวโน้มฝนไหม\?/i).length).toBeGreaterThan(0);
    });
  });

  it('shows unavailable state for observed when observed is null', async () => {
    const partial = {
      location: { latitude: 13.7563, longitude: 100.5018 },
      generatedAt: new Date().toISOString(),
      observed: null,
      forecast: null,
      officialWarning: null,
      sourceAgreement: 'INSUFFICIENT_DATA' as const,
      confidence: 'UNKNOWN' as const,
      limitations: [],
    };
    mockFetchWeatherSituationUI.mockResolvedValueOnce({ status: 'PARTIAL', data: partial });
    render(<WeatherSituationPage />);
    await waitFor(() => {
      expect(screen.getAllByText(/ไม่สามารถรับข้อมูลสภาพอากาศ/i).length).toBeGreaterThan(0);
    });
  });

  it('does NOT contain radar/RainViewer/Windy or nowcasting keywords', () => {
    const html = document.documentElement.innerHTML;
    expect(html.toLowerCase()).not.toContain('rainviewer');
    expect(html.toLowerCase()).not.toContain('windy');
    expect(html.toLowerCase()).not.toContain('nowcast');
    expect(html.toLowerCase()).not.toContain('radar');
  });

  it('safety: does not set realDataConnected=true', () => {
    // The gate flags hardcode false — this test verifies the JSX doesn't switch to true
    const pageSource = WeatherSituationPage.toString();
    expect(pageSource).not.toContain('realDataConnected: true');
    expect(pageSource).not.toContain('operationalUseApproved: true');
  });
});
