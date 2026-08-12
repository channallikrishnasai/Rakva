export type AssetType = "bridge" | "road" | "building" | "hospital" | "utility";
export type DamageSeverity = "none" | "minor" | "moderate" | "severe" | "critical";
export type ConsequenceLevel = "low" | "moderate" | "high" | "critical";
export type AccessibilityLevel = "accessible" | "restricted" | "critical_route" | "blocked";
export type EvidenceStatus = "received" | "validating" | "verified" | "conflict" | "review_required" | "matched";
export type DisasterType = "flood" | "cyclone" | "landslide" | "earthquake";
export type FilterPriority = "critical" | "high" | "medium" | "low";

export interface EvidenceSource {
  source: "satellite" | "drone" | "citizen" | "geospatial";
  status: EvidenceStatus;
  label: string;
  detail?: string;
}

export interface WhyFirstReason {
  order: number;
  title: string;
  description: string;
}

export interface PriorityFactors {
  damage: number;
  people: number;
  vulnerability: number;
  criticality: number;
  accessibility: number;
  urgency: number;
}

export interface DisasterAsset {
  id: string;
  name: string;
  assetType: AssetType;
  mapPosition: { x: number; y: number };
  affectedRadius: number;
  damageSeverity: DamageSeverity;
  damageDescription: string;
  impactDescription: string;
  recoveryPriority: number;
  basePriority: number;
  category: "critical" | "high" | "moderate" | "moderate-low" | "low";
  confidence: "high" | "moderate" | "low";
  consequenceLevel: ConsequenceLevel;
  consequenceDescription: string;
  accessibility: AccessibilityLevel;
  accessibilityDescription: string;
  urgency: "high" | "moderate" | "low";
  urgencyDescription: string;
  whyFirst: WhyFirstReason[];
  evidenceSources: EvidenceSource[];
  overallEvidenceConfidence: "high" | "moderate" | "low";
  factors: PriorityFactors;
  region: string;
  nearestHospital?: string;
  populationImpact?: string;
  alternateRoutes?: string;
}

export interface SimulationEvent {
  assetId: string;
  title: string;
  detail: string;
  priorityChange: { from: number; to: number };
}

export interface CommandCenterData {
  disasterType: DisasterType;
  region: string;
  evidenceCount: number;
  status: string;
  totalAssets: number;
  highPriorityCount: number;
  criticalCount: number;
  evidenceConfidence: number;
  assets: DisasterAsset[];
}
