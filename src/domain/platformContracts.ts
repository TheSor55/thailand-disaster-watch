import type { DataClassification, FreshnessState, HazardType } from './governance';

export type ExportClassification = 'PUBLIC' | 'INTERNAL' | 'DRAFT' | 'EXERCISE';
export type ExportFormat =
  | 'PNG_SNAPSHOT'
  | 'PDF_SITUATION_REPORT'
  | 'BCM_REPORT'
  | 'ACTION_CHECKLIST'
  | 'SHARE_LINK'
  | 'QR_CODE';

export interface ExportDocument {
  documentId: string;
  incidentId: string | null;
  generatedAt: string;
  observedAt: string | null;
  sourceList: readonly string[];
  documentVersion: string;
  classification: ExportClassification;
  dataStatus: 'LIVE' | 'DELAYED' | 'STALE' | 'OFFLINE' | 'UNKNOWN';
  disclaimer: string;
  format: ExportFormat;
}

export interface OfflineCacheMetadata {
  cachedAt: string;
  observedAt: string | null;
  source: string;
  freshness: FreshnessState;
}

export interface SiteDefinition {
  id: string;
  organizationId: string;
  name: string;
  type: 'OFFICE' | 'FACTORY' | 'WAREHOUSE' | 'SUPPLIER' | 'CUSTOMER' | 'OTHER';
  latitude: number;
  longitude: number;
  geofence: unknown | null;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';
}

export interface BusinessImpact {
  criticalProcessId: string;
  mtpd: string | null;
  rto: string | null;
  rpo: string | null;
  criticality: SiteDefinition['criticality'];
}

export interface BcmRecommendation {
  id: string;
  hazard: HazardType;
  exposure: string;
  businessImpact: BusinessImpact;
  recommendation: string;
  humanDecision: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  actionOwner: string | null;
  escalationLevel: string | null;
  classification: DataClassification;
}

export interface EventSourceAssociation {
  providerId: string;
  sourceEventId: string;
  officialBulletinId: string | null;
}

export interface NormalizedHazardEvent {
  id: string;
  hazard: HazardType;
  occurredAt: string;
  latitude: number;
  longitude: number;
  magnitude: number | null;
  depthKm: number | null;
  sources: readonly EventSourceAssociation[];
}

export interface ShareCapabilities {
  nativeShare: boolean;
  download: boolean;
  copySummary: boolean;
}

export function detectShareCapabilities(environment: {
  hasNavigatorShare: boolean;
  hasDownloadSupport: boolean;
  hasClipboardWrite: boolean;
}): ShareCapabilities {
  return {
    nativeShare: environment.hasNavigatorShare,
    download: environment.hasDownloadSupport,
    copySummary: environment.hasClipboardWrite,
  };
}
