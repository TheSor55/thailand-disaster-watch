import {
  BANGKOK_METRO_PROVINCE_CODES,
  PROVINCE_BY_SLUG,
  REGION_BY_ID,
  type ProvinceDefinition,
  type RegionDefinition,
} from '../config/regions';

export type ViewLevel = 'national' | 'region' | 'province' | 'quick-view';

export type NavigationState =
  | { viewLevel: 'national' }
  | { viewLevel: 'region'; region: RegionDefinition }
  | { viewLevel: 'province'; province: ProvinceDefinition }
  | { viewLevel: 'quick-view'; quickView: 'bangkok-metro' };

export function parseNavigationPath(pathname: string): NavigationState {
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === 'region' && segments[1]) {
    const region = REGION_BY_ID.get(segments[1] as RegionDefinition['id']);
    if (region) return { viewLevel: 'region', region };
  }

  if (segments[0] === 'province' && segments[1]) {
    const province = PROVINCE_BY_SLUG.get(segments[1]);
    if (province) return { viewLevel: 'province', province };
  }

  if (segments[0] === 'quick-view' && segments[1] === 'bangkok-metro') {
    return { viewLevel: 'quick-view', quickView: 'bangkok-metro' };
  }

  return { viewLevel: 'national' };
}

export function pathForNavigation(state: NavigationState): string {
  switch (state.viewLevel) {
    case 'region':
      return `/region/${state.region.id}`;
    case 'province':
      return `/province/${state.province.slug}`;
    case 'quick-view':
      return '/quick-view/bangkok-metro';
    default:
      return '/';
  }
}

export function provinceCodesForNavigation(state: NavigationState): readonly string[] {
  switch (state.viewLevel) {
    case 'region':
      return state.region.provinceIsoCodes;
    case 'province':
      return [state.province.isoCode];
    case 'quick-view':
      return BANGKOK_METRO_PROVINCE_CODES;
    default:
      return [];
  }
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  current: boolean;
}

export function breadcrumbsForNavigation(state: NavigationState): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: 'ประเทศไทย', path: '/', current: state.viewLevel === 'national' },
  ];

  if (state.viewLevel === 'region') {
    items.push({ label: state.region.nameTh, path: pathForNavigation(state), current: true });
  }

  if (state.viewLevel === 'province') {
    const region = REGION_BY_ID.get(state.province.regionId);
    if (region) {
      items.push({
        label: region.nameTh,
        path: pathForNavigation({ viewLevel: 'region', region }),
        current: false,
      });
    }
    items.push({ label: state.province.nameTh, path: pathForNavigation(state), current: true });
  }

  if (state.viewLevel === 'quick-view') {
    items.push({
      label: 'กรุงเทพฯ และปริมณฑล',
      path: pathForNavigation(state),
      current: true,
    });
  }

  return items;
}
