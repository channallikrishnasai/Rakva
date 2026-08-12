export type ConfidenceLevel = 'low' | 'medium' | 'high' | 'critical';
export type SeverityLevel = 'none' | 'minor' | 'moderate' | 'severe' | 'critical';

export interface DataProvenance {
  source: string;
  sourceType: 'sensor' | 'satellite' | 'citizen' | 'model' | 'official' | 'hybrid';
  timestamp: string;
  lastUpdated: string;
  spatialResolution?: string;
  temporalResolution?: string;
  processingMethod?: string;
  modelVersion?: string;
  confidence: number;
  quality: 'verified' | 'estimated' | 'raw';
}

export interface DataSource {
  id: string;
  name: string;
  type: string;
  provider: string;
  status: 'active' | 'inactive' | 'degraded';
}

export interface Observation {
  id: string;
  metric: string;
  value: number;
  unit: string;
  location: [number, number]; // [lat, lng]
  timestamp: string;
  provenance: DataProvenance;
}

export interface Evidence {
  id: string;
  type: 'image' | 'video' | 'sensor_reading' | 'report';
  url?: string;
  description: string;
  location: [number, number];
  timestamp: string;
  provenance: DataProvenance;
}

export interface GeoRegion {
  id: string;
  level: 'country' | 'state' | 'district' | 'subdistrict' | 'locality' | 'cell' | 'asset';
  name: string;
  parentId?: string;
  center?: [number, number];
  bounds?: [[number, number], [number, number]];
}

export interface Asset {
  id: string;
  name: string;
  type: string; // e.g., 'hospital', 'bridge', 'power_plant'
  location: [number, number];
  regionId: string;
  criticality: number; // 1-100
  capacity?: number;
  status: 'operational' | 'degraded' | 'failed' | 'unknown';
}

export interface Dependency {
  sourceAssetId: string;
  targetAssetId: string;
  type: 'power' | 'water' | 'access' | 'communication';
  critical: boolean;
}

export interface RiskAssessment {
  id: string;
  hazardId: string;
  targetId: string; // Region or Asset ID
  score: number; // 0-100
  probability: number; // 0-1
  severity: SeverityLevel;
  confidence: number;
  provenance: DataProvenance;
}

export interface PriorityAssessment {
  assetId: string;
  score: number;
  rank: number;
  factors: Array<{
    name: string;
    weight: number;
    value: number;
    contribution: number;
  }>;
}

export interface Intervention {
  id: string;
  type: string;
  description: string;
  targetAssetId?: string;
  targetRegionId?: string;
  estimatedImpact: number;
  requiredResources: string[];
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface SimulationResult {
  scenarioId: string;
  timestamp: string;
  predictedImpacts: ImpactAssessment[];
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  interventions: Intervention[];
  expectedBenefit: string;
}

export interface RecoveryTask {
  id: string;
  assetId: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  dependencies: string[]; // Task IDs
}

export interface ImpactAssessment {
  targetId: string;
  type: 'human' | 'infrastructure' | 'economic' | 'environmental';
  estimatedLoss: number;
  description: string;
}

export interface HazardDefinition {
  id: string;
  name: string;
  description: string;
  supportedRegions?: string[];
  units?: string[];
  requiredInputs: string[];
}

export interface HazardPrediction {
  hazardId: string;
  regionId: string;
  forecastWindow: string; // e.g. "Next 24 hours"
  probability: number;
  expectedSeverity: SeverityLevel;
  provenance: DataProvenance;
}

export interface MapLayerDefinition {
  id: string;
  name: string;
  description: string;
  unit?: string;
  dataType: 'numeric' | 'categorical' | 'boolean';
  legend: any; // Could be further typed based on legends
  min?: number;
  max?: number;
  thresholds?: number[];
  formatter?: (value: number) => string;
  source: string;
  supportedZoomLevels: [number, number];
  supportedGeographicLevels: string[];
}

