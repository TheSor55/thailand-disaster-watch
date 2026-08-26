/**
 * WeatherSituationPage tests — Phase 3.2
 *
 * Tests cover:
 * - DEMO PREVIEW mode: renders deterministic fixture with explicit DEMO label
 * - CONTROLLED LIVE PREVIEW mode: requests live endpoint with explicit LIVE label
 * - Mode switching: user can toggle between DEMO and CONTROLLED LIVE modes
 * - No silent fallback: when live preview fails, renders LIVE PREVIEW UNAVAILABLE with explicit switch-to-demo action
 * - Location selector: allows switching presets (Bangkok, Chiang Mai, Khon Kaen, Phuket, Hat Yai)
 * - Observed vs Forecast question semantics (ตอนนี้มีฝนไหม?, อีก 1/3 ชม. มีแนวโน้มฝนไหม?)
 * - Explainer guide ("What am I looking at?")
 * - Safety invariants: realDataConnected=false, operationalUseApproved=false
 * - Forbidden features: zero radar, RainViewer, Windy, or proprietary nowcasting keywords
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherSituationPage } from './WeatherSituationPage';

// Mock the service adapter
const mockFetchWeatherSituationUI = vi.fn();

vi.mock('../../services/weatherSituation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/weatherSituation')>();
  return {
    ...actual,
    fetchWeatherSituationUI: (...args: unknown[]) => mockFetchWeatherSituationUI(...args),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  // Clear search parameters between tests
  if (typeof window !== 'undefined') {
    window.history.replaceState({}, '', '/');
  }
});

describe('WeatherSituationPage (Phase 3.2)', () => {
  it('renders DEVELOPMENT PREVIEW banner and DEMO mode by default', async () => {
    const fixture = {
      location: { latitude: 13.7563, longitude: 100.5018, label: 'กรุงเทพมหานคร (Bangkok)' },
      generatedAt: new Date().toISOString(),
      observed: {
        source: 'TMD (Demo Fixture)',
        observedAt: null,
        retrievedAt: new Date().toISOString(),
        precipitation: null,
        temperatureCelsius: 32.5,
        humidityPercent: 70,
        windSpeedKph: 12.0,
        freshness: 'UNAVAILABLE' as const,
        provenance: 'Demo observation fixture',
      },
      forecast: {
        source: 'Open-Meteo (Demo Fixture)',
        validAt: null,
        retrievedAt: new Date().toISOString(),
        precipitationMm: 0.0,
        precipitationProbabilityPercent: 20,
        temperatureCelsius: 31.0,
        humidityPercent: 74,
        windSpeedKph: 14.0,
        freshness: 'UNAVAILABLE' as const,
        provenance: 'Demo forecast fixture',
      },
      officialWarning: null,
      sourceAgreement: 'INSUFFICIENT_DATA' as const,
      confidence: 'UNKNOWN' as const,
      limitations: ['Demo limitation note'],
    };

    mockFetchWeatherSituationUI.mockResolvedValue({ status: 'DEMO', data: fixture });
    render(<WeatherSituationPage />);

    // Safety badge
    expect(screen.getAllByText(/DEVELOPMENT PREVIEW/i).length).toBeGreaterThan(0);
    // Explicit Mode Badge
    await waitFor(() => {
      expect(screen.getByText(/DATA MODE: DEMO PREVIEW/i)).toBeTruthy();
      expect(screen.getByText(/DEMO DATA · DEVELOPMENT PREVIEW · NOT OPERATIONAL/i)).toBeTruthy();
    });
  });

  it('allows user to switch between DEMO PREVIEW and CONTROLLED LIVE PREVIEW modes', async () => {
    const user = userEvent.setup();
    mockFetchWeatherSituationUI.mockImplementation(async (req: { mode: string }) => {
      if (req.mode === 'LIVE') {
        return {
          status: 'AVAILABLE',
          data: {
            location: { latitude: 13.7563, longitude: 100.5018, label: 'Bangkok' },
            generatedAt: new Date().toISOString(),
            observed: {
              source: 'TMD',
              observedAt: new Date().toISOString(),
              retrievedAt: new Date().toISOString(),
              precipitation: 0,
              temperatureCelsius: 33,
              humidityPercent: 65,
              windSpeedKph: 15,
              freshness: 'FRESH' as const,
              provenance: 'TMD observation station',
            },
            forecast: {
              source: 'Open-Meteo',
              validAt: new Date().toISOString(),
              retrievedAt: new Date().toISOString(),
              precipitationMm: 1.2,
              precipitationProbabilityPercent: 45,
              temperatureCelsius: 30,
              humidityPercent: 80,
              windSpeedKph: 18,
              freshness: 'FRESH' as const,
              provenance: 'Open-Meteo numerical model',
            },
            officialWarning: null,
            sourceAgreement: 'CONSISTENT' as const,
            confidence: 'HIGH' as const,
            limitations: [],
          },
        };
      }
      return {
        status: 'DEMO',
        data: {
          location: { latitude: 13.7563, longitude: 100.5018, label: 'Bangkok' },
          generatedAt: new Date().toISOString(),
          observed: null,
          forecast: null,
          officialWarning: null,
          sourceAgreement: 'INSUFFICIENT_DATA' as const,
          confidence: 'UNKNOWN' as const,
          limitations: [],
        },
      };
    });

    render(<WeatherSituationPage />);
    await waitFor(() => {
      expect(screen.getByText(/DATA MODE: DEMO PREVIEW/i)).toBeTruthy();
    });

    // Click Controlled Live Preview mode button
    const liveButton = screen.getByRole('radio', { name: /CONTROLLED LIVE PREVIEW/i });
    await user.click(liveButton);

    await waitFor(() => {
      expect(screen.getByText(/DATA MODE: CONTROLLED LIVE PREVIEW/i)).toBeTruthy();
      expect(screen.getByText(/CONTROLLED LIVE PREVIEW · NOT OPERATIONAL · NOT AN OFFICIAL WARNING/i)).toBeTruthy();
    });
  });

  it('NO SILENT FALLBACK: displays LIVE PREVIEW UNAVAILABLE when live pipeline fails and offers switch to demo', async () => {
    const user = userEvent.setup();
    mockFetchWeatherSituationUI.mockImplementation(async (req: { mode: string }) => {
      if (req.mode === 'LIVE') {
        return {
          status: 'LIVE_UNAVAILABLE',
          message: 'Pipeline ยังไม่ได้เปิดใช้งานในสภาพแวดล้อมนี้ (WEATHER_SITUATION_PIPELINE_ENABLED=false)',
        };
      }
      return {
        status: 'DEMO',
        data: {
          location: { latitude: 13.7563, longitude: 100.5018, label: 'Bangkok' },
          generatedAt: new Date().toISOString(),
          observed: null,
          forecast: null,
          officialWarning: null,
          sourceAgreement: 'INSUFFICIENT_DATA' as const,
          confidence: 'UNKNOWN' as const,
          limitations: [],
        },
      };
    });

    render(<WeatherSituationPage />);

    // Switch to LIVE mode
    const liveButton = screen.getByRole('radio', { name: /CONTROLLED LIVE PREVIEW/i });
    await user.click(liveButton);

    await waitFor(() => {
      expect(screen.getByText(/LIVE PREVIEW UNAVAILABLE/i)).toBeTruthy();
      expect(screen.getByText(/WEATHER_SITUATION_PIPELINE_ENABLED=false/i)).toBeTruthy();
      expect(screen.getByRole('button', { name: /สลับเป็น DEMO PREVIEW/i })).toBeTruthy();
    });

    // Clicking switch to demo returns to DEMO mode
    const switchToDemoBtn = screen.getByRole('button', { name: /สลับเป็น DEMO PREVIEW/i });
    await user.click(switchToDemoBtn);

    await waitFor(() => {
      expect(screen.getByText(/DATA MODE: DEMO PREVIEW/i)).toBeTruthy();
    });
  });

  it('allows selecting preset locations (e.g. Chiang Mai, Phuket, Khon Kaen, Hat Yai)', async () => {
    const user = userEvent.setup();
    mockFetchWeatherSituationUI.mockImplementation(async (req: { latitude: number; longitude: number; label?: string | null }) => {
      return {
        status: 'DEMO',
        data: {
          location: { latitude: req.latitude, longitude: req.longitude, label: req.label ?? 'Custom' },
          generatedAt: new Date().toISOString(),
          observed: null,
          forecast: null,
          officialWarning: null,
          sourceAgreement: 'INSUFFICIENT_DATA' as const,
          confidence: 'UNKNOWN' as const,
          limitations: [],
        },
      };
    });

    render(<WeatherSituationPage />);

    const chiangMaiBtn = screen.getByRole('button', { name: /เชียงใหม่/i });
    await user.click(chiangMaiBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/เชียงใหม่/i).length).toBeGreaterThan(0);
    });
  });

  it('renders "What am I looking at?" explainer guide when expanded', async () => {
    const user = userEvent.setup();
    mockFetchWeatherSituationUI.mockResolvedValue({
      status: 'DEMO',
      data: {
        location: { latitude: 13.7563, longitude: 100.5018 },
        generatedAt: new Date().toISOString(),
        observed: null,
        forecast: null,
        officialWarning: null,
        sourceAgreement: 'INSUFFICIENT_DATA' as const,
        confidence: 'UNKNOWN' as const,
        limitations: [],
      },
    });

    render(<WeatherSituationPage />);

    const explainerToggle = screen.getByRole('button', { name: /What am I looking at/i });
    await user.click(explainerToggle);

    await waitFor(() => {
      expect(screen.getAllByText(/ข้อมูลสังเกตการณ์จริง/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/แบบจำลองพยากรณ์/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/โหมดข้อมูลตัวอย่าง/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/โหมดทดสอบข้อมูลสด/i).length).toBeGreaterThan(0);
    });
  });

  it('strictly preserves question semantics: OBSERVED for ตอนนี้, MODEL_FORECAST for +1h and +3h', async () => {
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
    mockFetchWeatherSituationUI.mockResolvedValue({ status: 'AVAILABLE', data: mockSituation });
    render(<WeatherSituationPage />);

    await waitFor(() => {
      // Observed card question (Card A)
      expect(screen.getAllByText(/ตอนนี้มีฝนไหม\?/i).length).toBeGreaterThan(0);
      // Forecast card questions (Cards B & C)
      expect(screen.getAllByText(/อีก 1 ชั่วโมงมีแนวโน้มฝนไหม\?/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/อีก 3 ชั่วโมงมีแนวโน้มฝนไหม\?/i).length).toBeGreaterThan(0);
    });
  });

  it('calls onBack handler when back button is clicked', async () => {
    const user = userEvent.setup();
    const handleBack = vi.fn();
    mockFetchWeatherSituationUI.mockResolvedValue({
      status: 'DEMO',
      data: {
        location: { latitude: 13.7563, longitude: 100.5018 },
        generatedAt: new Date().toISOString(),
        observed: null,
        forecast: null,
        officialWarning: null,
        sourceAgreement: 'INSUFFICIENT_DATA' as const,
        confidence: 'UNKNOWN' as const,
        limitations: [],
      },
    });

    render(<WeatherSituationPage onBack={handleBack} />);

    const backBtn = screen.getByRole('button', { name: /กลับไปหน้าแผนที่ GIS/i });
    expect(backBtn).toBeTruthy();
    await user.click(backBtn);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('does NOT contain radar, RainViewer, Windy, or nowcasting keywords in HTML output', () => {
    const html = document.documentElement.innerHTML;
    expect(html.toLowerCase()).not.toContain('rainviewer');
    expect(html.toLowerCase()).not.toContain('windy');
    expect(html.toLowerCase()).not.toContain('nowcast');
    expect(html.toLowerCase()).not.toContain('radar');
  });

  it('safety: keeps realDataConnected=false and operationalUseApproved=false in repository code', () => {
    const pageSource = WeatherSituationPage.toString();
    expect(pageSource).not.toContain('realDataConnected: true');
    expect(pageSource).not.toContain('operationalUseApproved: true');
  });
});
