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
  const breadcrumbItems = breadcrumbsForNavigation(navigation);

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
          <span className="brand-mark" aria-hidden="true">TD</span>
          <div>
            <p>Thailand Disaster Watch</p>
            <h1>{titleForNavigation(navigation)}</h1>
          </div>
        </div>
        <div className="header-status" role="status">
          <span className="status-chip"><span aria-hidden="true">○</span> LIVE DATA NOT CONNECTED</span>
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
              onClick={() => navigate(parseNavigationPath(item.path))}
            >
              {item.label}
            </button>
          </span>
        ))}
      </nav>

      <main className="workspace">
        <aside className="left-rail" aria-label="Region and layer navigation">
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
          </aside>
        </ModuleErrorBoundary>
      </main>

      <footer className="timeline-bar">
        <div><span className="eyebrow">SITUATION TIMELINE</span><strong>Timeline unavailable — live data not connected</strong></div>
        <div className="timeline-options" aria-label="Timeline unavailable">
          {['-24h', '-12h', '-6h', '-3h', '-1h', 'Now'].map((time) => <span key={time}>{time}</span>)}
        </div>
      </footer>

      <nav className="mobile-dock" aria-label="Mobile command center navigation">
        <button type="button" onClick={(event) => { mobileSheetTrigger.current = event.currentTarget; setMobileSheet('navigation'); }}><span aria-hidden="true">⌕</span>พื้นที่</button>
        <button type="button" onClick={(event) => { mobileSheetTrigger.current = event.currentTarget; setMobileSheet('layers'); }}><span aria-hidden="true">▱</span>Layers</button>
        <button type="button" onClick={(event) => { mobileSheetTrigger.current = event.currentTarget; setMobileSheet('situation'); }}><span aria-hidden="true">○</span>สถานการณ์</button>
      </nav>

      {mobileSheet && (
        <div className="mobile-sheet-backdrop" role="presentation" onClick={() => setMobileSheet(null)}>
          <section className="mobile-sheet" role="dialog" aria-modal="true" aria-label="Mobile command panel" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-sheet-heading"><strong>{mobileSheet === 'navigation' ? 'เลือกพื้นที่' : mobileSheet === 'layers' ? 'Map Layers' : 'Situation overview'}</strong><button type="button" onClick={() => setMobileSheet(null)} aria-label="ปิดแผง" autoFocus>×</button></div>
            {mobileSheet === 'navigation' && (
              <>
                <NavigationSearch onProvinceSelect={(province) => { handleProvinceSelect(province); setMobileSheet(null); }} onRegionSelect={(region) => { navigate({ viewLevel: 'region', region }); setMobileSheet(null); }} />
                <div className="mobile-region-list">
                  <button type="button" onClick={() => { navigate({ viewLevel: 'national' }); setMobileSheet(null); }}>ประเทศไทย</button>
                  {REGIONS.map((region) => <button type="button" key={region.id} onClick={() => { navigate({ viewLevel: 'region', region }); setMobileSheet(null); }}>{region.nameTh}</button>)}
                </div>
              </>
            )}
            {mobileSheet === 'layers' && <LayerControl basemapMode={basemapMode} showProvinces={showProvinces} onBasemapChange={setBasemapMode} onProvinceVisibilityChange={setShowProvinces} />}
            {mobileSheet === 'situation' && <><p className="no-data-banner"><span aria-hidden="true">○</span> DEMO / NO LIVE DATA</p><DataProvenance /></>}
          </section>
        </div>
      )}
    </div>
  );
}
