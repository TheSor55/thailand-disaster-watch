import { describe, expect, it } from 'vitest';
import { PROVINCE_BY_SLUG, REGION_BY_ID } from '../config/regions';
import { breadcrumbsForNavigation, parseNavigationPath, pathForNavigation, provinceCodesForNavigation } from './navigation';

describe('deep-link navigation', () => {
  it('round-trips supported navigation paths', () => {
    const region = REGION_BY_ID.get('north')!;
    const province = PROVINCE_BY_SLUG.get('chiang-mai')!;
    const states = [
      { viewLevel: 'national' as const },
      { viewLevel: 'region' as const, region },
      { viewLevel: 'province' as const, province },
      { viewLevel: 'quick-view' as const, quickView: 'bangkok-metro' as const },
    ];
    states.forEach((state) => expect(parseNavigationPath(pathForNavigation(state))).toEqual(state));
  });

  it('falls back safely for unsupported paths', () => {
    expect(parseNavigationPath('/region/not-real')).toEqual({ viewLevel: 'national' });
    expect(parseNavigationPath('/anything')).toEqual({ viewLevel: 'national' });
  });

  it('returns selection codes and province breadcrumbs', () => {
    const province = PROVINCE_BY_SLUG.get('chiang-mai')!;
    const state = { viewLevel: 'province' as const, province };
    expect(provinceCodesForNavigation(state)).toEqual(['TH-50']);
    expect(breadcrumbsForNavigation(state).map(({ label }) => label)).toEqual(['ประเทศไทย', 'ภาคเหนือ', 'เชียงใหม่']);
  });
});
