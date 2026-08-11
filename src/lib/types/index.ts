export type SeverityLevel = "critical" | "high" | "medium" | "monitored";

export type DataSource = "satellite" | "drone" | "citizen" | "geospatial";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DamageReport {
  id: string;
  location: string;
  coordinates: Coordinates;
  severity: SeverityLevel;
  type: string;
  description: string;
  sources: DataSource[];
  confidence: number;
  timestamp: string;
  assignedPriority: number;
  explanation: string;
}

export interface RecoveryTask {
  id: string;
  reportId: string;
  title: string;
  severity: SeverityLevel;
  status: "pending" | "in-progress" | "completed";
  estimatedDuration: string;
  resourcesRequired: string[];
  rationale: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  description: string;
  status: "active" | "completed" | "pending";
}

export interface IntelligenceSummary {
  totalIncidents: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  monitoredCount: number;
  lastUpdated: string;
  region: string;
}

export interface DataSourceStatus {
  source: DataSource;
  label: string;
  status: "online" | "delayed" | "offline";
  lastSync: string;
  recordsContributed: number;
}

export type {
  AssetType,
  DamageSeverity,
  ConsequenceLevel,
  AccessibilityLevel,
  EvidenceStatus,
  DisasterType,
  FilterPriority,
  EvidenceSource,
  WhyFirstReason,
  PriorityFactors,
  DisasterAsset,
  SimulationEvent,
  CommandCenterData,
} from "./command-center";
