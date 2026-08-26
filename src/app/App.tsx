import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  PROVINCE_BY_ISO,
  REGIONS,
  REGION_BY_ID,
  type ProvinceDefinition,
  type RegionId,
} from '../config/regions';
import {
  breadcrumbsForNavigation,
  parseNavigationPath,
  pathForNavigation,
  provinceCodesForNavigation,
  type NavigationState,
} from '../domain/navigation';
import type { BasemapMode } from '../map/ThailandMap';
import { DataProvenance } from '../components/DataProvenance';
import { LayerControl } from '../components/LayerControl';
import { ModuleErrorBoundary } from '../components/ModuleErrorBoundary';
import { NavigationSearch } from '../components/NavigationSearch';
import { SafetyBanner } from '../components/SafetyBanner';
import { SystemHealthPanel } from '../components/SystemHealthPanel';
import { RadarControlPanel } from '../components/radar/RadarControlPanel';
import { fetchRadarFramesUI, type RadarFrame } from '../services/radar';
import { getDamsByProvince, getDamsByRegion, MAJOR_DAMS } from '../domain/dam';
import { getRiverStationsByProvince, getRiverStationsByRegion, MAJOR_RIVER_STATIONS } from '../domain/river';
import { getAlertsForProvince, ACTIVE_OFFICIAL_ALERTS } from '../domain/warning';
import { DamSituationCard } from '../components/water/DamSituationCard';
import { RiverStationCard } from '../components/water/RiverStationCard';
import { SituationAlertCard } from '../components/alerts/SituationAlertCard';
import { MySitesPanel } from '../components/mysites/MySitesPanel';

const ThailandMap = lazy(() =>
  import('../map/ThailandMap').then((module) => ({ default: module.ThailandMap })),
);

const WeatherSituationPage = lazy(() =>
  import('../features/weather/WeatherSituationPage').then((m) => ({ default: m.WeatherSituationPage })),
);

const AboutPage = lazy(() =>
  import('../pages/AboutPage').then((m) => ({ default: m.AboutPage })),
);

const providerHealth = [
  {
    providerId: 'GISTDA Disaster Platform',
    status: 'DISABLED' as const,
    lastSuccessAt: null,
    lastFailureAt: null,
    latencyMs: null,
    consecutiveFailures: 0,
    freshness: 'UNKNOWN' as const,
  },
];

const situationModules = ['Flood', 'Rain', 'River', 'Dam', 'Alerts', 'CCTV'] as const;

function titleForNavigation(state: NavigationState) {
  if (state.viewLevel === 'region') return `${state.region.nameEn} Situation`;
  if (state.viewLevel === 'province') return `${state.province.nameEn} Situation`;
  if (state.viewLevel === 'quick-view') return 'Bangkok Metropolitan Quick View';
  return 'National Situation Monitoring';
}

export function App() {
  const [navigation, setNavigation] = useState<NavigationState>(() =>
    parseNavigationPath(window.location.pathname),
  );
  const [basemapMode, setBasemapMode] = useState<BasemapMode>('dark');
  const [showProvinces, setShowProvinces] = useState(true);
  const [showRadar, setShowRadar] = useState(false);
  const [showFlood, setShowFlood] = useState(false);
  const [radarFrames, setRadarFrames] = useState<RadarFrame[]>([]);
  const [selectedRadarIndex, setSelectedRadarIndex] = useState(0);
  const [radarOpacity, setRadarOpacity] = useState(0.7);
  const [isRadarPlaying, setIsRadarPlaying] = useState(false);
  const [radarMode] = useState<'DEMO' | 'LIVE'>('DEMO');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [appView, setAppView] = useState<'gis' | 'weather' | 'mysites' | 'about'>('gis');
  const isGisView = appView === 'gis';
  const isWeatherView = appView === 'weather';
  const isMySitesView = appView === 'mysites';
  const isAboutView = appView === 'about';

  const [mobileSheet, setMobileSheet] = useState<
    'navigation' | 'layers' | 'situation' | null
  >(null);
  const mobileSheetTrigger = useRef<HTMLElement | null>(null);

  const navigate = useCallback((nextState: NavigationState) => {
    const path = pathForNavigation(nextState);
    window.history.pushState({}, '', path);
    setNavigation(nextState);
  }, []);

  useEffect(() => {
    const handlePopState = () => setNavigation(parseNavigationPath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!mobileSheet) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileSheet(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      mobileSheetTrigger.current?.focus();
    };
  }, [mobileSheet]);

  useEffect(() => {
    if (!showRadar || radarFrames.length > 0) return;
    const controller = new AbortController();
    fetchRadarFramesUI(radarMode, controller.signal).then((state) => {
      if (state.status === 'DEMO' || state.status === 'AVAILABLE') {
        setRadarFrames(state.data.frames);
        setSelectedRadarIndex(Math.max(0, state.data.frames.length - 1));
      }
    });
    return () => controller.abort();
  }, [showRadar, radarMode, radarFrames.length]);

  const selectedIsoCodes = useMemo(
    () => provinceCodesForNavigation(navigation),
    [navigation],
  );
  const selectedProvinceIso =
    navigation.viewLevel === 'province' ? navigation.province.isoCode : null;

  const breadcrumbItems = useMemo(() => {
    if (appView === 'weather') {
      return [
        { label: 'แผนที่ GIS', path: '/', current: false },
        { label: 'สภาพอากาศ (Weather Situation)', path: '/weather', current: true },
      ];
    }
    if (appView === 'mysites') {
      return [
        { label: 'แผนที่ GIS', path: '/', current: false },
        { label: 'พื้นที่เฝ้าระวังของฉัน (My Sites)', path: '/mysites', current: true },
      ];
    }
    if (appView === 'about') {
      return [
        { label: 'แผนที่ GIS', path: '/', current: false },
        { label: 'เกี่ยวกับระบบ (About)', path: '/about', current: true },
      ];
    }
    return breadcrumbsForNavigation(navigation);
  }, [appView, navigation]);

  const handleRegionSelect = (regionId: RegionId) => {
    const region = REGION_BY_ID.get(regionId);
    if (region) navigate({ viewLevel: 'region', region });
  };

  const handleProvinceSelect = (province: ProvinceDefinition) => {
    navigate({ viewLevel: 'province', province });
  };

  // Province-specific water & alert data calculations
  const currentProvinceName = navigation.viewLevel === 'province' ? navigation.province.nameTh : 'ประเทศไทย';
  const provinceRegionId = navigation.viewLevel === 'province' ? navigation.province.regionId : 'central';

  const displayedDams = useMemo(() => {
    if (navigation.viewLevel === 'province') {
      const local = getDamsByProvince(currentProvinceName);
      return local.length > 0 ? local : getDamsByRegion(provinceRegionId);
    }
    return MAJOR_DAMS.slice(0, 4);
  }, [navigation.viewLevel, currentProvinceName, provinceRegionId]);

  const displayedRivers = useMemo(() => {
    if (navigation.viewLevel === 'province') {
      const local = getRiverStationsByProvince(currentProvinceName);
      return local.length > 0 ? local : getRiverStationsByRegion(provinceRegionId);
    }
    return MAJOR_RIVER_STATIONS.slice(0, 3);
  }, [navigation.viewLevel, currentProvinceName, provinceRegionId]);

  const displayedAlerts = useMemo(() => {
    if (navigation.viewLevel === 'province') {
      return getAlertsForProvince(currentProvinceName, provinceRegionId);
    }
    return [...ACTIVE_OFFICIAL_ALERTS];
  }, [navigation.viewLevel, currentProvinceName, provinceRegionId]);

  return (
    <div className="command-center" data-theme={basemapMode}>
      <header className="app-header">
        <div className="brand-lockup">
          <a
            href="#"
            className="brand-logo-link"
            onClick={(e) => { e.preventDefault(); setAppView('about'); }}
            aria-label="FutureGreen — Thailand Disaster Watch — เกี่ยวกับระบบ"
            title="FutureGreen Disaster Intelligence Platform"
          >
            <img
              src="/futuregreen-logo.png"
              alt="FutureGreen Logo"
              className="brand-logo"
              width="38"
              height="38"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = 'grid';
              }}
            />
            <span className="brand-logo-fallback" style={{ display: 'none' }} aria-hidden="true">
              FG
            </span>
          </a>
          <div>
            <span className="eyebrow">THAILAND DISASTER WATCH</span>
            <h1>{titleForNavigation(navigation)}</h1>
          </div>
        </div>

        <div className="header-meta">
          <div className="meta-pill meta-pill--danger">
            <span className="status-dot status-dot--off" aria-hidden="true" />
            <span>LIVE DATA NOT CONNECTED</span>
          </div>
          <div className="meta-pill meta-pill--dev">
            <span>v1.1 PREVIEW</span>
          </div>
          <p className="caption">Decision-support information · Not an official emergency warning</p>
          <div className="header-actions">
            <button
              type="button"
              className="icon-button"
              aria-label="System Settings"
              aria-expanded={settingsOpen}
              onClick={() => setSettingsOpen((prev) => !prev)}
            >
              ⚙
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="Toggle Theme"
              onClick={() => setBasemapMode((prev) => (prev === 'dark' ? 'standard' : 'dark'))}
            >
              {basemapMode === 'dark' ? '☀' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <SafetyBanner state="NO_LIVE_DATA" />

      {settingsOpen && (
        <section className="settings-drawer" aria-label="System Settings Drawer">
          <div className="settings-drawer__header">
            <span className="eyebrow">SYSTEM GOVERNANCE</span>
            <h3>Data Source &amp; Provider Health</h3>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setSettingsOpen(false)}
              aria-label="Close Settings"
            >
              ✕
            </button>
          </div>
          <SystemHealthPanel
            providers={providerHealth}
          />
        </section>
      )}

      <nav className="breadcrumb-bar" aria-label="ตำแหน่งปัจจุบัน">
        {breadcrumbItems.map((item, index) => (
          <span key={item.path} className="breadcrumb-bar__item">
            {index > 0 && <span className="breadcrumb-bar__separator" aria-hidden="true">›</span>}
            <button
              type="button"
              className={`breadcrumb-bar__button${item.current ? ' is-current' : ''}`}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => {
                if (item.path === '/weather') {
                  setAppView('weather');
                } else if (item.path === '/mysites') {
                  setAppView('mysites');
                } else if (item.path === '/about') {
                  setAppView('about');
                } else {
                  setAppView('gis');
                  navigate(parseNavigationPath(item.path));
                }
              }}
            >
              {item.label}
            </button>
          </span>
        ))}
      </nav>

      <main className="workspace">
        {isGisView && (
          <aside className="left-rail" aria-label="Region and layer navigation">
          <section className="panel module-nav-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">COMMAND MODULES</span>
                <h2>ระบบปฏิบัติการ</h2>
              </div>
            </div>
            <div className="module-nav-list" role="navigation" aria-label="Operations Modules">
              <button
                type="button"
                className={`module-nav-item${isGisView ? ' is-active' : ''}`}
                onClick={() => setAppView('gis')}
                aria-pressed={isGisView}
              >
                <span className="icon">🗺</span>
                <span>GIS Map View</span>
              </button>
              <button
                type="button"
                className={`module-nav-item${isWeatherView ? ' is-active' : ''}`}
                onClick={() => setAppView('weather')}
                aria-pressed={isWeatherView}
              >
                <span className="icon">🌤</span>
                <span>สภาพอากาศ</span>
                <span className="tag">PREVIEW</span>
              </button>
              <button
                type="button"
                className={`module-nav-item${isMySitesView ? ' is-active' : ''}`}
                onClick={() => setAppView('mysites')}
                aria-pressed={isMySitesView}
              >
                <span className="icon">🏢</span>
                <span>My Sites</span>
                <span className="tag">PROTOTYPE</span>
              </button>
              <button type="button" className="module-nav-item is-disabled" disabled aria-disabled="true" title="Incident Watch — Coming Soon">
                <span className="icon">🚨</span>
                <span>Incident Watch</span>
                <span className="tag">COMING SOON</span>
              </button>
              <button type="button" className="module-nav-item is-disabled" disabled aria-disabled="true" title="BCM Actions — Coming Soon">
                <span className="icon">🛡</span>
                <span>BCM Actions</span>
                <span className="tag">COMING SOON</span>
              </button>
              <button type="button" className="module-nav-item is-disabled" disabled aria-disabled="true" title="Reports — Coming Soon">
                <span className="icon">📋</span>
                <span>Reports</span>
                <span className="tag">COMING SOON</span>
              </button>
              <button
                type="button"
                className={`module-nav-item${isAboutView ? ' is-active' : ''}`}
                onClick={() => setAppView('about')}
                aria-pressed={isAboutView}
              >
                <span className="icon">ℹ</span>
                <span>เกี่ยวกับระบบ</span>
              </button>
            </div>
          </section>

          <section className="panel region-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">NAVIGATION</span>
                <h2>พื้นที่ติดตาม</h2>
              </div>
              <span className="panel-count">77 จังหวัด</span>
            </div>
            <button
              className={navigation.viewLevel === 'national' ? 'nav-card is-active' : 'nav-card'}
              type="button"
              onClick={() => navigate({ viewLevel: 'national' })}
            >
              <span>ประเทศไทย</span><small>National extent</small>
            </button>
            <NavigationSearch
              visibleProvinceIsoCodes={selectedIsoCodes}
              onProvinceSelect={handleProvinceSelect}
              onRegionSelect={(region) => navigate({ viewLevel: 'region', region })}
            />
            <div className="region-grid">
              {REGIONS.map((region) => (
                <button
                  key={region.id}
                  className={navigation.viewLevel === 'region' && navigation.region.id === region.id ? 'region-button is-active' : 'region-button'}
                  type="button"
                  onClick={() => handleRegionSelect(region.id)}
                >
                  <strong>{region.shortLabel}</strong>
                  <span>{region.provinceIsoCodes.length}</span>
                </button>
              ))}
            </div>
            {navigation.viewLevel === 'region' && (
              <div className="region-province-list" aria-label={`จังหวัดใน${navigation.region.nameTh}`}>
                <strong>จังหวัดในพื้นที่</strong>
                <div>
                  {navigation.region.provinceIsoCodes.map((iso) => {
                    const province = PROVINCE_BY_ISO.get(iso);
                    if (!province) return null;
                    return (
                      <button
                        key={iso}
                        className="chip-button"
                        type="button"
                        onClick={() => navigate({ viewLevel: 'province', province })}
                      >
                        {province.nameTh}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="quick-views" aria-label="Operational quick views">
              <span className="eyebrow">OPERATIONAL QUICK VIEWS</span>
              <button
                type="button"
                className={navigation.viewLevel === 'quick-view' && navigation.quickView === 'bangkok-metro' ? 'quick-view-btn is-active' : 'quick-view-btn'}
                onClick={() =>
                  navigate({
                    viewLevel: 'quick-view',
                    quickView: 'bangkok-metro',
                  })
                }
              >
                <span>ปริมณฑล</span>
                <small>Operational Quick View · 6 จังหวัด</small>
              </button>
            </div>
          </section>

          <LayerControl
            basemapMode={basemapMode}
            showProvinces={showProvinces}
            onBasemapChange={setBasemapMode}
            onProvinceVisibilityChange={setShowProvinces}
            showRadar={showRadar}
            onRadarVisibilityChange={setShowRadar}
            showFlood={showFlood}
            onFloodVisibilityChange={setShowFlood}
          />
          </aside>
        )}

        {isGisView && (
          <>
            <section className="map-stage" aria-label="Map visualization area">
              <div className="map-stage__header">
                <div>
                  <span className="eyebrow">CURRENT VIEW</span>
                  <h2>{titleForNavigation(navigation)}</h2>
                </div>
                {navigation.viewLevel !== 'national' && (
                  <button
                    className="btn-ghost"
                    type="button"
                    onClick={() => navigate({ viewLevel: 'national' })}
                  >
                    ↺ Reset Thailand
                  </button>
                )}
              </div>

              <div className="map-container-wrap">
                <ModuleErrorBoundary moduleName="GIS Map">
                  <Suspense fallback={<div className="map-loading" role="status">กำลังเตรียมแผนที่ประเทศไทย…</div>}>
                    <ThailandMap
                      basemapMode={basemapMode}
                      selectedIsoCodes={selectedIsoCodes}
                      selectedProvinceIso={selectedProvinceIso}
                      showProvinces={showProvinces}
                      showRadar={showRadar}
                      radarTileUrl={radarFrames[selectedRadarIndex]?.tileUrl ?? null}
                      radarOpacity={radarOpacity}
                      showFlood={showFlood}
                      onProvinceSelect={handleProvinceSelect}
                    />
                  </Suspense>
                </ModuleErrorBoundary>

                {/* Radar Floating Control Panel */}
                {showRadar && radarFrames.length > 0 && (
                  <RadarControlPanel
                    frames={radarFrames}
                    selectedFrameIndex={selectedRadarIndex}
                    onSelectFrameIndex={setSelectedRadarIndex}
                    opacity={radarOpacity}
                    onOpacityChange={setRadarOpacity}
                    isPlaying={isRadarPlaying}
                    onTogglePlay={setIsRadarPlaying}
                    onClose={() => setShowRadar(false)}
                    mode={radarMode}
                  />
                )}
              </div>

              <div className="module-strip" aria-label="Disaster modules status">
                {situationModules.map((module) => (
                  <article key={module} className="module-pill">
                    <span className="status-dot" aria-hidden="true" />
                    <div><small>{module}</small><strong>—</strong><span>{module === 'Dam' || module === 'River' ? 'TELEMETRY READY' : module === 'Flood' ? 'SATELLITE PILOT' : 'No live data'}</span></div>
                  </article>
                ))}
              </div>
            </section>

            <ModuleErrorBoundary moduleName="Situation panels">
              <aside className="right-rail" aria-label="Situation information">
              <section className="panel situation-panel">
                <span className="eyebrow">SITUATION OVERVIEW</span>
                <h2>{currentProvinceName}</h2>
                <p className="no-data-banner"><span aria-hidden="true">○</span> v1.1 TELEMETRY EXPANSION</p>

                {/* Quick Weather Action */}
                {navigation.viewLevel === 'province' && (
                  <div className="quick-weather-banner" style={{ margin: '8px 0' }}>
                    <button
                      type="button"
                      className="btn-quick-weather"
                      onClick={() => setAppView('weather')}
                    >
                      <span>🌤️ ตรวจสภาพอากาศ &amp; ภาพเรดาร์ {navigation.province.nameTh}</span>
                      <span>➔</span>
                    </button>
                  </div>
                )}

                <DataProvenance />
              </section>

              {/* Official Situation Alerts */}
              <SituationAlertCard
                alerts={displayedAlerts}
                provinceNameTh={currentProvinceName}
              />

              {/* Dam Telemetry */}
              <DamSituationCard
                dams={displayedDams}
                provinceNameTh={currentProvinceName}
              />

              {/* River Telemetry */}
              <RiverStationCard
                stations={displayedRivers}
                provinceNameTh={currentProvinceName}
              />

              <section className="panel cctv-panel">
                <div className="panel-heading"><h2>CCTV Watch</h2><span className="eyebrow">PHASE 2+</span></div>
                <div className="cctv-placeholder" aria-hidden="true"><span>▦</span></div>
                <p>No authorized CCTV source connected</p>
                <dl className="cctv-fields">
                  {['Station', 'Location', 'Owner', 'Observed', 'Status'].map((field) => <div key={field}><dt>{field}</dt><dd>—</dd></div>)}
                </dl>
              </section>

              <section className="panel share-export-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">EXPORT &amp; SHARE</span>
                    <h2>ส่งออกข้อมูล</h2>
                  </div>
                </div>
                <div className="share-grid">
                  <button type="button" disabled aria-disabled="true" title="Share Situation — Coming Soon" className="share-button">
                    <span>🔗 Share Situation</span>
                  </button>
                  <button type="button" disabled aria-disabled="true" title="Capture Map — Coming Soon" className="share-button">
                    <span>📸 Capture Map</span>
                  </button>
                  <button type="button" disabled aria-disabled="true" title="Export PDF Report — Coming Soon" className="share-button">
                    <span>📄 Export PDF Report</span>
                  </button>
                  <button type="button" disabled aria-disabled="true" title="BCM Report — Coming Soon" className="share-button">
                    <span>🛡 BCM Report</span>
                  </button>
                  <button type="button" disabled aria-disabled="true" title="Copy Summary — Coming Soon" className="share-button">
                    <span>✍ Copy Summary</span>
                  </button>
                </div>
              </section>
              </aside>
            </ModuleErrorBoundary>
          </>
        )}

        {isWeatherView && (
          <div className="full-content-column" aria-label="สภาพอากาศ">
            <ModuleErrorBoundary moduleName="Weather Situation">
              <Suspense fallback={<div className="page-loading" role="status">กำลังโหลดหน้าสภาพอากาศ…</div>}>
                <WeatherSituationPage onBack={() => setAppView('gis')} />
              </Suspense>
            </ModuleErrorBoundary>
          </div>
        )}

        {isMySitesView && (
          <div className="full-content-column" aria-label="พื้นที่เฝ้าระวัง">
            <ModuleErrorBoundary moduleName="My Sites">
              <div className="mysites-page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
                <header className="page-section-header" style={{ marginBottom: '16px' }}>
                  <button type="button" className="btn-ghost" onClick={() => setAppView('gis')}>
                    ← กลับไปหน้าแผนที่ GIS
                  </button>
                </header>
                <MySitesPanel
                  onSelectSite={(site) => {
                    const prov = Array.from(PROVINCE_BY_ISO.values()).find(
                      (p) => p.nameTh === site.province || site.province.includes(p.nameTh)
                    );
                    if (prov) {
                      navigate({ viewLevel: 'province', province: prov });
                      setAppView('gis');
                    }
                  }}
                  onCheckWeather={(site) => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('lat', site.latitude.toFixed(4));
                    url.searchParams.set('lon', site.longitude.toFixed(4));
                    window.history.replaceState({}, '', url.toString());
                    setAppView('weather');
                  }}
                />
              </div>
            </ModuleErrorBoundary>
          </div>
        )}

        {isAboutView && (
          <div className="full-content-column" aria-label="เกี่ยวกับระบบ">
            <ModuleErrorBoundary moduleName="About">
              <Suspense fallback={<div className="page-loading" role="status">กำลังโหลด…</div>}>
                <AboutPage onBack={() => setAppView('gis')} />
              </Suspense>
            </ModuleErrorBoundary>
          </div>
        )}
      </main>

      <footer className="timeline-bar">
        <div><span className="eyebrow">SITUATION TIMELINE</span><strong>Timeline unavailable — live data not connected</strong></div>
        <div className="timeline-options" aria-label="Timeline unavailable">
          {['-24h', '-12h', '-6h', '-3h', '-1h', 'Now'].map((time) => <span key={time}>{time}</span>)}
        </div>
      </footer>

      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <button
          type="button"
          ref={(el) => { if (mobileSheet === 'navigation') mobileSheetTrigger.current = el; }}
          className={`mobile-bottom-nav__item${mobileSheet === 'navigation' ? ' is-active' : ''}`}
          onClick={() => setMobileSheet((prev) => (prev === 'navigation' ? null : 'navigation'))}
          aria-expanded={mobileSheet === 'navigation'}
          aria-label="เปิดเมนูมือถือ"
        >
          <span className="mobile-bottom-nav__icon">🗺</span>
          <span>แผนที่</span>
        </button>
        <button
          type="button"
          ref={(el) => { if (mobileSheet === 'layers') mobileSheetTrigger.current = el; }}
          className={`mobile-bottom-nav__item${mobileSheet === 'layers' ? ' is-active' : ''}`}
          onClick={() => setMobileSheet((prev) => (prev === 'layers' ? null : 'layers'))}
          aria-expanded={mobileSheet === 'layers'}
        >
          <span className="mobile-bottom-nav__icon">▤</span>
          <span>Layers</span>
        </button>
        <button
          type="button"
          className={`mobile-bottom-nav__item${isWeatherView ? ' is-active' : ''}`}
          onClick={() => { setMobileSheet(null); setAppView('weather'); }}
        >
          <span className="mobile-bottom-nav__icon">🌤</span>
          <span>อากาศ</span>
        </button>
        <button
          type="button"
          className={`mobile-bottom-nav__item${isMySitesView ? ' is-active' : ''}`}
          onClick={() => { setMobileSheet(null); setAppView('mysites'); }}
        >
          <span className="mobile-bottom-nav__icon">🏢</span>
          <span>My Sites</span>
        </button>
        <button
          type="button"
          ref={(el) => { if (mobileSheet === 'situation') mobileSheetTrigger.current = el; }}
          className={`mobile-bottom-nav__item${mobileSheet === 'situation' ? ' is-active' : ''}`}
          onClick={() => setMobileSheet((prev) => (prev === 'situation' ? null : 'situation'))}
          aria-expanded={mobileSheet === 'situation'}
        >
          <span className="mobile-bottom-nav__icon">📊</span>
          <span>สถานการณ์</span>
        </button>
      </nav>

      {mobileSheet && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileSheet(null)}>
          <section
            role="dialog"
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile command panel"
          >
            <div className="mobile-drawer__header">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setMobileSheet(null)}
                aria-label="ปิดเมนูมือถือ"
              >
                ✕ ปิด
              </button>
            </div>
            {mobileSheet === 'navigation' && (
              <div className="mobile-nav-content">
                <span className="eyebrow">NAVIGATION</span>
                <h3>เลือกพื้นที่</h3>
                <button
                  className={navigation.viewLevel === 'national' ? 'nav-card is-active' : 'nav-card'}
                  type="button"
                  onClick={() => {
                    navigate({ viewLevel: 'national' });
                    setMobileSheet(null);
                  }}
                >
                  <span>ประเทศไทย</span><small>National extent</small>
                </button>
                <NavigationSearch
                  visibleProvinceIsoCodes={selectedIsoCodes}
                  onProvinceSelect={(province) => {
                    handleProvinceSelect(province);
                    setMobileSheet(null);
                  }}
                  onRegionSelect={(region) => {
                    navigate({ viewLevel: 'region', region });
                    setMobileSheet(null);
                  }}
                />
              </div>
            )}
            {mobileSheet === 'layers' && (
              <LayerControl
                basemapMode={basemapMode}
                showProvinces={showProvinces}
                onBasemapChange={setBasemapMode}
                onProvinceVisibilityChange={setShowProvinces}
                showRadar={showRadar}
                onRadarVisibilityChange={setShowRadar}
                showFlood={showFlood}
                onFloodVisibilityChange={setShowFlood}
              />
            )}
            {mobileSheet === 'situation' && (
              <div className="mobile-situation-content">
                <span className="eyebrow">SITUATION OVERVIEW</span>
                <h3 className="mobile-situation-title">{currentProvinceName}</h3>

                {/* Quick Weather Action */}
                {navigation.viewLevel === 'province' && (
                  <div className="quick-weather-banner" style={{ margin: '8px 0' }}>
                    <button
                      type="button"
                      className="btn-quick-weather"
                      onClick={() => {
                        setMobileSheet(null);
                        setAppView('weather');
                      }}
                    >
                      <span>🌤️ ตรวจสภาพอากาศ &amp; ภาพเรดาร์ {navigation.province.nameTh}</span>
                      <span>➔</span>
                    </button>
                  </div>
                )}

                {/* Official Situation Alerts */}
                <SituationAlertCard
                  alerts={displayedAlerts}
                  provinceNameTh={currentProvinceName}
                />

                {/* Dam Telemetry */}
                <DamSituationCard
                  dams={displayedDams}
                  provinceNameTh={currentProvinceName}
                />

                {/* River Telemetry */}
                <RiverStationCard
                  stations={displayedRivers}
                  provinceNameTh={currentProvinceName}
                />

                <DataProvenance />
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
