import { describe, expect, it } from 'vitest';
import {
  evaluateProviderActivation,
  GISTDA_PHASE_2_6_APPROVAL,
  type ProviderActivationInput,
} from './providerGovernance';

const approved: ProviderActivationInput = {
  ...GISTDA_PHASE_2_6_APPROVAL,
  providerId: 'approved-provider',
  productionStatus: 'APPROVED',
  licenseApproved: true,
  displayRightsApproved: true,
  schemaVerified: true,
  timestampSemanticsVerified: true,
  operationalPolicyApproved: true,
  attributionApproved: true,
  humanApproval: true,
};

describe('evaluateProviderActivation', () => {
  it.each(['PENDING', 'RESTRICTED'] as const)(
    'blocks a %s provider even when technical gates pass',
    (productionStatus) => {
      const decision = evaluateProviderActivation({ ...approved, productionStatus });
      expect(decision.activationAllowed).toBe(false);
      expect(decision.blockingGates).toContain('productionStatus');
    },
  );

  it.each(['licenseApproved', 'humanApproval'] as const)(
    'blocks activation when %s is missing',
    (gate) => {
      const decision = evaluateProviderActivation({ ...approved, [gate]: false });
      expect(decision.activationAllowed).toBe(false);
      expect(decision.blockingGates).toContain(gate);
    },
  );

  it('keeps GISTDA blocked after technical connectivity verification', () => {
    const decision = evaluateProviderActivation(GISTDA_PHASE_2_6_APPROVAL);
    expect(decision.activationAllowed).toBe(false);
    expect(decision.blockingGates).toEqual(
      expect.arrayContaining([
        'productionStatus',
        'licenseApproved',
        'displayRightsApproved',
        'schemaVerified',
        'timestampSemanticsVerified',
        'operationalPolicyApproved',
        'attributionApproved',
        'humanApproval',
      ]),
    );
  });

  it('allows activation only when every mandatory gate passes', () => {
    expect(evaluateProviderActivation(approved)).toEqual({
      activationAllowed: true,
      blockingGates: [],
    });
  });
});
