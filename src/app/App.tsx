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
  BANGKOK_METRO_PROVINCE_CODES,
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [appView, setAppView] = useState<'gis' | 'weather' | 'about'>('gis');
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
              src="/futuregreen-logo.svg"
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
            <span className="brand-mark" aria-hidden="true" style={{ display: 'none' }}>FG</span>
          </a>
          <div>
            <p>Thailand Disaster Watch</p>
            <h1>{appView === 'weather' ? 'สภาพอากาศ' : appView === 'about' ? 'เกี่ยวกับระบบ' : titleForNavigation(navigation)}</h1>
          </div>
        </div>
        <div className="header-status" role="status">
          <span className="status-chip"><span aria-hidden="true">○</span> LIVE DATA NOT CONNECTED</span>
          <span className="status-chip status-chip--dev-preview" aria-label="Development Preview">DEV PREVIEW</span>
          <span className="safety-label">Decision-support information · Not an official emergency warning</span>
          <span className="updated-time">Last update: —</span>
        </div>
        <div className="header-actions">
          <button className="icon-button" type="button" onClick={() => setSettingsOpen((open) => !open)} aria-label="เปิดการตั้งค่า" aria-expanded={settingsOpen}>⚙</button>
          <button
            className="icon-button"
            type="button"
            onClick={() => setBasemapMode((mode) => (mode === 'dark' ? 'standard' : 'dark'))}
            aria-label={basemapMode === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
          >
            {basemapMode === 'dark' ? '☀' : '◐'}
          </button>
          <button className="icon-button mobile-menu-button" type="button" onClick={(event) => { mobileSheetTrigger.current = event.currentTarget; setMobileSheet('navigation'); }} aria-label="เปิดเมนูมือถือ">☰</button>
        </div>
      </header>

      <SafetyBanner
        state="NO_LIVE_DATA"
        detail="Provider approval gates remain closed. Decision-support information only."
        compact
      />

      {settingsOpen && (
        <aside className="settings-popover" aria-label="การตั้งค่า">
          <strong>Display settings</strong>
          <p>Theme preference applies to this session. Persistent preferences will be evaluated in a later phase.</p>
          <SystemHealthPanel
            providers={providerHealth}
            operationalStatusByProviderId={{ 'GISTDA Disaster Platform': 'PENDING' }}
          />
        </aside>
      )}

      <nav className="breadcrumb" aria-label="ตำแหน่งปัจจุบัน">
        {breadcrumbItems.map((item, index) => (
          <span key={item.path}>
            {index > 0 && <span aria-hidden="true">›</span>}
            <button
              type="button"
              aria-current={item.current ? 'page' : undefined}
              onClick={() => {
                if (item.path === '/') {
                  setAppView('gis');
                } else if (item.path === '/weather') {
                  setAppView('weather');
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
        {appView === 'gis' && (
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
                className={`module-nav-item${appView === 'gis' ? ' is-active' : ''}`}
                onClick={() => setAppView('gis')}
                aria-pressed={appView === 'gis'}
              >
                <span className="icon">🗺</span>
                <span>GIS Map View</span>
              </button>
              <button
                type="button"
                className={`module-nav-item${appView === 'weather' ? ' is-active' : ''}`}
                onClick={() => setAppView('weather')}
                aria-pressed={appView === 'weather'}
              >
                <span className="icon">🌤</span>
                <span>สภาพอากาศ</span>
                <span className="tag">PREVIEW</span>
              </button>
              <button type="button" className="module-nav-item is-disabled" disabled aria-disabled="true" title="My Sites — Coming Soon in Phase 3">
                <span className="icon">🏢</span>
                <span>My Sites</span>
                <span className="tag">COMING SOON</span>
              </button>
              <button type="button" className="module-nav-item is-disabled" disabled aria-disabled="true" title="Incident Watch — Coming Soon in Phase 3">
                <span className="icon">🚨</span>
                <span>Incident Watch</span>
                <span className="tag">COMING SOON</span>
              </button>
              <button type="button" className="module-nav-item is-disabled" disabled aria-disabled="true" title="BCM Actions — Coming Soon in Phase 3">
                <span className="icon">🛡</span>
                <span>BCM Actions</span>
                <span className="tag">COMING SOON</span>
              </button>
              <button type="button" className="module-nav-item is-disabled" disabled aria-disabled="true" title="Reports — Coming Soon in Phase 3">
                <span className="icon">📋</span>
                <span>Reports</span>
                <span className="tag">COMING SOON</span>
              </button>
              <button
                type="button"
                className={`module-nav-item${appView === 'about' ? ' is-active' : ''}`}
                onClick={() => setAppView('about')}
                aria-pressed={appView === 'about'}
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
                  {navigation.region.provinceIsoCodes.map((isoCode) => {
                    const province = PROVINCE_BY_ISO.get(isoCode);
                    return province ? <button type="button" key={isoCode} onClick={() => handleProvinceSelect(province)}>{province.nameTh}</button> : null;
                  })}
                </div>
              </div>
            )}
            <button
              className={navigation.viewLevel === 'quick-view' ? 'quick-view is-active' : 'quick-view'}
              type="button"
              onClick={() => navigate({ viewLevel: 'quick-view', quickView: 'bangkok-metro' })}
            >
              <span aria-hidden="true">◎</span>
              <span><strong>กรุงเทพฯ และปริมณฑล</strong><small>Operational Quick View · {BANGKOK_METRO_PROVINCE_CODES.length} จังหวัด</small></span>
            </button>
          </section>

          <section className="panel layer-panel">
            <div className="panel-heading"><h2>Map Layers</h2><span className="eyebrow">PHASE 2.5</span></div>
            <LayerControl
              basemapMode={basemapMode}
              showProvinces={showProvinces}
              onBasemapChange={setBasemapMode}
              onProvinceVisibilityChange={setShowProvinces}
            />
          </section>
        </aside>
        )}

        {appView === 'gis' && (
          <>
            <section className="map-column">
              <div className="map-toolbar">
                <div>
                  <span className="eyebrow">CURRENT VIEW</span>
                  <strong>{titleForNavigation(navigation)}</strong>
                </div>
                <button type="button" onClick={() => navigate({ viewLevel: 'national' })}>⌂ Reset Thailand</button>
              </div>
              <ModuleErrorBoundary moduleName="Map">
                <Suspense fallback={<div className="map-shell map-loading" role="status">Loading map module…</div>}>
                  <ThailandMap
                    basemapMode={basemapMode}
                    selectedIsoCodes={selectedIsoCodes}
                    selectedProvinceIso={selectedProvinceIso}
                    showProvinces={showProvinces}
                    onProvinceSelect={handleProvinceSelect}
                  />
                </Suspense>
              </ModuleErrorBoundary>
              <div className="summary-strip" aria-label="Situation summary">
                {situationModules.map((module) => (
                  <article key={module} className="summary-card">
                    <span className="status-dot" aria-hidden="true" />
                    <div><small>{module}</small><strong>—</strong><span>No live data</span></div>
                  </article>
                ))}
              </div>
            </section>

            <ModuleErrorBoundary moduleName="Situation panels">
              <aside className="right-rail" aria-label="Situation information">
              <section className="panel situation-panel">
                <span className="eyebrow">SITUATION OVERVIEW</span>
                <h2>{navigation.viewLevel === 'province' ? navigation.province.nameTh : 'ประเทศไทย'}</h2>
                <p className="no-data-banner"><span aria-hidden="true">○</span> DEMO / NO LIVE DATA</p>
                <DataProvenance />
                {navigation.viewLevel === 'province' && (
                  <div className="module-grid" aria-label="Province data modules">
                    {['Overview', 'Rain', 'Flood', 'River', 'Dam', 'CCTV', 'Alerts', 'Timeline'].map((module) => (
                      <div key={module}><strong>{module}</strong><span>DATA SOURCE NOT CONNECTED</span></div>
                    ))}
                  </div>
                )}
              </section>
              <section className="panel alert-panel">
                <div className="panel-heading"><h2>Situation Alerts</h2><span className="status-chip status-chip--small">NO SOURCE</span></div>
                <div className="empty-state"><span aria-hidden="true">!</span><p>No official alert source connected.</p></div>
              </section>
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

        {appView === 'weather' && (
          <div className="full-content-column" aria-label="สภาพอากาศ">
            <ModuleErrorBoundary moduleName="Weather Situation">
              <Suspense fallback={<div className="page-loading" role="status">กำลังโหลดหน้าสภาพอากาศ…</div>}>
                <WeatherSituationPage onBack={() => setAppView('gis')} />
              </Suspense>
            </ModuleErrorBoundary>
          </div>
        )}

        {appView === 'about' && (
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
        <div className="footer-credit" aria-label="Developer credit">
          <span>Developed by <strong>Sorawit Suwannarong</strong></span>
          <span className="footer-credit__platform">FutureGreen Disaster Intelligence Platform</span>
        </div>
      </footer>

      <nav className="mobile-dock" aria-label="Mobile command center navigation">
        <button
          type="button"
          className={appView === 'gis' ? 'is-active' : ''}
          onClick={(event) => {
            setAppView('gis');
            mobileSheetTrigger.current = event.currentTarget;
            setMobileSheet('navigation');
          }}
        >
          <span aria-hidden="true">🗺</span>แผนที่
        </button>
        <button
          type="button"
          onClick={(event) => {
            mobileSheetTrigger.current = event.currentTarget;
            setMobileSheet('layers');
          }}
        >
          <span aria-hidden="true">▱</span>Layers
        </button>
        <button
          type="button"
          className={appView === 'weather' ? 'is-active' : ''}
          onClick={() => {
            setAppView('weather');
            setMobileSheet(null);
          }}
        >
          <span aria-hidden="true">🌤</span>อากาศ
        </button>
        <button
          type="button"
          onClick={(event) => {
            mobileSheetTrigger.current = event.currentTarget;
            setMobileSheet('situation');
          }}
        >
          <span aria-hidden="true">○</span>สถานการณ์
        </button>
      </nav>

      {mobileSheet && (
        <div className="mobile-sheet-backdrop" role="presentation" onClick={() => setMobileSheet(null)}>
          <section className="mobile-sheet" role="dialog" aria-modal="true" aria-label="Mobile command panel" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-sheet-heading"><strong>{mobileSheet === 'navigation' ? 'เลือกพื้นที่' : mobileSheet === 'layers' ? 'Map Layers' : 'Situation overview'}</strong><button type="button" onClick={() => setMobileSheet(null)} aria-label="ปิดแผง" autoFocus>×</button></div>
            {mobileSheet === 'navigation' && (
              <>
                <div className="mobile-module-nav" aria-label="เลือกโมดูลคำสั่ง">
                  <button
                    type="button"
                    className={`mobile-module-btn${appView === 'gis' ? ' is-active' : ''}`}
                    onClick={() => { setAppView('gis'); setMobileSheet(null); }}
                  >
                    <span>🗺 GIS Map View</span>
                  </button>
                  <button
                    type="button"
                    className={`mobile-module-btn${appView === 'weather' ? ' is-active' : ''}`}
                    onClick={() => { setAppView('weather'); setMobileSheet(null); }}
                  >
                    <span>🌤 สภาพอากาศ (Weather)</span>
                    <span className="tag">PREVIEW</span>
                  </button>
                  <button
                    type="button"
                    className={`mobile-module-btn${appView === 'about' ? ' is-active' : ''}`}
                    onClick={() => { setAppView('about'); setMobileSheet(null); }}
                  >
                    <span>ℹ เกี่ยวกับระบบ (About)</span>
                  </button>
                </div>
                <NavigationSearch
                  onProvinceSelect={(province) => { handleProvinceSelect(province); setAppView('gis'); setMobileSheet(null); }}
                  onRegionSelect={(region) => { navigate({ viewLevel: 'region', region }); setAppView('gis'); setMobileSheet(null); }}
                />
                <div className="mobile-region-list">
                  <button type="button" onClick={() => { navigate({ viewLevel: 'national' }); setAppView('gis'); setMobileSheet(null); }}>ประเทศไทย</button>
                  {REGIONS.map((region) => <button type="button" key={region.id} onClick={() => { navigate({ viewLevel: 'region', region }); setAppView('gis'); setMobileSheet(null); }}>{region.nameTh}</button>)}
                </div>
              </>
            )}
            {mobileSheet === 'layers' && <LayerControl basemapMode={basemapMode} showProvinces={showProvinces} onBasemapChange={setBasemapMode} onProvinceVisibilityChange={setShowProvinces} />}
            {mobileSheet === 'situation' && (
              <div className="mobile-situation-content">
                <span className="eyebrow">SITUATION OVERVIEW</span>
                <h3 className="mobile-situation-title">{navigation.viewLevel === 'province' ? navigation.province.nameTh : 'ประเทศไทย'}</h3>
                <p className="no-data-banner"><span aria-hidden="true">○</span> DEMO / NO LIVE DATA</p>

                {navigation.viewLevel === 'province' && (
                  <div className="module-grid" aria-label="Province data modules">
                    {['Overview', 'Rain', 'Flood', 'River', 'Dam', 'CCTV', 'Alerts', 'Timeline'].map((module) => (
                      <div key={module}><strong>{module}</strong><span>DATA SOURCE NOT CONNECTED</span></div>
                    ))}
                  </div>
                )}

                <DataProvenance />

                <div className="mobile-share-section">
                  <span className="eyebrow">EXPORT & SHARE</span>
                  <div className="share-grid">
                    <button type="button" disabled aria-disabled="true" title="Share Situation — Coming Soon" className="share-button">
                      <span>🔗 Share Situation</span>
                    </button>
                    <button type="button" disabled aria-disabled="true" title="Capture Map — Coming Soon" className="share-button">
                      <span>📸 Capture Map</span>
                    </button>
                    <button type="button" disabled aria-disabled="true" title="Export Report — Coming Soon" className="share-button">
                      <span>📄 Export PDF Report</span>
                    </button>
                    <button type="button" disabled aria-disabled="true" title="BCM Report — Coming Soon" className="share-button">
                      <span>🛡 BCM Report</span>
                    </button>
                    <button type="button" disabled aria-disabled="true" title="Copy Summary — Coming Soon" className="share-button">
                      <span>✍ Copy Summary</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
