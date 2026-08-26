import { describe, it, expect } from 'vitest';
import { ACTIVE_OFFICIAL_ALERTS, getAlertsForProvince } from './warning';

describe('Official Warning Model (v1.1)', () => {
  it('contains official alert definitions with issuer and dates', () => {
    expect(ACTIVE_OFFICIAL_ALERTS.length).toBeGreaterThan(0);
    for (const alert of ACTIVE_OFFICIAL_ALERTS) {
      expect(alert.alertId).toBeTruthy();
      expect(['TMD', 'DDPM', 'RID', 'ONWR']).toContain(alert.issuer);
      expect(alert.titleTh).toBeTruthy();
      expect(alert.validFrom).toBeTruthy();
      expect(alert.validTo).toBeTruthy();
      expect(alert.sourceAttribution).toBeTruthy();
    }
  });

  it('filters active alerts for specific provinces', () => {
    const alerts = getAlertsForProvince('ชลบุรี', 'east');
    expect(alerts.length).toBeGreaterThanOrEqual(1);
  });
});
