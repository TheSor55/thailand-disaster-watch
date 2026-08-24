import type { ProviderProductionStatus } from './governance';

export const PROVIDER_APPROVAL_GATES = [
  'licenseApproved',
  'displayRightsApproved',
  'authenticationConfigured',
  'schemaVerified',
  'timestampSemanticsVerified',
  'operationalPolicyApproved',
  'attributionApproved',
  'humanApproval',
] as const;

export type ProviderApprovalGate = (typeof PROVIDER_APPROVAL_GATES)[number];

export interface ProviderActivationInput
  extends Record<ProviderApprovalGate, boolean> {
  providerId: string;
  productionStatus: ProviderProductionStatus;
}

export interface ProviderActivationDecision {
  activationAllowed: boolean;
  blockingGates: readonly (ProviderApprovalGate | 'productionStatus')[];
}

export function evaluateProviderActivation(
  input: ProviderActivationInput,
): ProviderActivationDecision {
  const blockingGates: (ProviderApprovalGate | 'productionStatus')[] = [];
  if (
    input.productionStatus !== 'APPROVED' &&
    input.productionStatus !== 'APPROVED_WITH_CONDITIONS'
  ) {
    blockingGates.push('productionStatus');
  }
  for (const gate of PROVIDER_APPROVAL_GATES) {
    if (!input[gate]) blockingGates.push(gate);
  }
  return { activationAllowed: blockingGates.length === 0, blockingGates };
}

export const GISTDA_PHASE_2_6_APPROVAL: ProviderActivationInput = {
  providerId: 'gistda-disaster-platform',
  productionStatus: 'PENDING',
  licenseApproved: false,
  displayRightsApproved: false,
  authenticationConfigured: true,
  schemaVerified: false,
  timestampSemanticsVerified: false,
  operationalPolicyApproved: false,
  attributionApproved: false,
  humanApproval: false,
};
