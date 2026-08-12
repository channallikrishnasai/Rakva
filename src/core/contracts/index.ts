export type ConfidenceLevel = 'low' | 'medium' | 'high' | 'critical';
export type SeverityLevel = 'none' | 'minor' | 'moderate' | 'severe' | 'critical';
import type { GeographicLevel } from '@/geospatial/types/geographic';

export type EnvironmentalVariableId = 
  | 'temperature'
  | 'rainfall'
  | 'humidity'
  | 'wind-speed'
  | 'wind-direction'
  | 'pressure'
  | 'soil-moisture'
  | 'river-level'
  | 'water-level';

export interface EnvironmentalVariable {
  id: EnvironmentalVariableId;
  name: string;
  description: string;
  unit: string;
  category: 'temperature' | 'precipitation' | 'wind' | 'pressure' | 'soil' | 'hydro';
  valueType: 'measurement' | 'score' | 'probability' | 'count' | 'density';
  displayPrecision: number;
  validTemporalContexts: TemporalMode[];
  supportedGeographicLevels: GeographicLevel[];
  acceptableRange?: [number, number];
  visualizationConfiguration?: {
    thresholds?: number[];
    colors?: string[];
    labelTemplate?: string;
  };
}

export type TemporalMode = 'historical' | 'observed' | 'forecast';

export interface TemporalContext {
  mode: TemporalMode;
  timestamp: string;
  validFrom?: string;
  validTo?: string;
  forecastLeadTime?: number; // in hours, for forecast mode
}

export interface EnvironmentalObservation {
  id: string;
  variable: EnvironmentalVariableId;
  value: number | null;
  unit: string;
  timestamp: string;
  temporalContext: TemporalContext;
  location: GeoRegionReference;
  source: string;
  provenance: DataProvenance;
  confidence?: number;
  quality: DataQuality;
}

export type GeoRegionReference = 
  | { id: string; level: 'country' | 'state'; }
  | { id: string; level: 'district'; parentId: string }
  | { id: string; level: 'subdistrict'; parentId: string }
  | { id: string; level: 'locality'; parentId: string }
  | { id: string; level: 'cell'; parentId: string }
  | { id: string; level: 'asset'; parentId: string };

export type DataQuality = 'verified' | 'estimated' | 'raw' | 'suspect' | 'missing';

export interface EnvironmentalTimeSeries {
  variable: EnvironmentalVariableId;
  regionId: string;
  points: EnvironmentalObservation[];
}

export type AnomalyType = 'absolute' | 'percentage' | 'standardized';

export interface EnvironmentalAnomaly {
  variable: EnvironmentalVariableId;
  currentValue: number;
  baselineValue: number;
  anomalyValue: number;
  anomalyType: AnomalyType;
  baselineName: string;
}

/**
 * Provenance metadata describing the origin and processing of data.
 * Retained on observations, evidence and hazard assessments so every
 * result remains traceable to its inputs.
 */
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
  quality: DataQuality;
}

export interface NormalizedObservation {
  id: string;
  variable: EnvironmentalVariableId;
  value: number;
  unit: string;
  temporalContext: TemporalContext;
  location: GeoRegionReference;
  source: string;
  provenance: DataProvenance;
  confidence: number;
  quality: DataQuality;
  normalizedAt: string;
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
  priorityMetrics?: PriorityAssessment;
  visualization?: {
    mapPosition?: { x: number; y: number };
    scenePosition?: { x: number; z: number };
    affectedRadius?: number;
  };
  damageSeverity?: SeverityLevel;
  damageDescription?: string;
  impactDescription?: string;
  priorityMetrics?: {
    basePriority: number;
    recoveryPriority: number;
    priorityLabel: 'critical' | 'high' | 'medium' | 'low';
    factors: {
      damage: number;
      people: number;
      vulnerability: number;
      criticality: number;
      accessibility: number;
      urgency: number;
    };
    whyFirst?: Array<{
      order: number;
      title: string;
      description: string;
    }>;
  };
  evidence?: Array<{
    source: string;
    status: string;
    label: string;
    detail?: string;
  }>;
  overallEvidenceConfidence?: ConfidenceLevel | string;
  consequenceLevel?: 'low' | 'moderate' | 'high' | 'critical';
  consequenceDescription?: string;
  accessibility?: 'accessible' | 'restricted' | 'critical_route' | 'blocked';
  accessibilityDescription?: string;
  urgency?: 'low' | 'moderate' | 'high';
  urgencyDescription?: string;
  dependencies?: Array<{
    targetId: string;
    label: string;
  }>;
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

export type PriorityCategory = 'low' | 'moderate-low' | 'moderate' | 'high' | 'critical';

export interface PriorityFactor {
  id: string;
  name: string;
  rawValue?: number;
  normalizedValue?: number;
  unit?: string;
  weight?: number;
  contribution?: number;
  direction?: "positive" | "negative" | "neutral";
  confidence?: number;
  explanation: string;
  source?: DataProvenance;
}

export interface ExplanationReason {
  label: string;
  detail: string;
}

export interface WhyFirstExplanation {
  summary: string;
  primaryReasons: ExplanationReason[];
  contributingFactors: ExplanationReason[];
  riskIfDelayed?: string;
  affectedServices?: string[];
  affectedPopulation?: number;
  confidence?: number;
}

export interface PriorityAssessment {
  subjectId: string;
  score: number;
  rank?: number;
  category: PriorityCategory;
  factors: PriorityFactor[];
  whyFirst: WhyFirstExplanation;
  confidence?: number;
  provenance: DataProvenance;
  modelId: string;
  modelVersion: string;
  assessedAt: string;
}

export interface PriorityInput {
  subjectId: string;
  subjectType: 'asset' | 'region';
  damage?: { severity: SeverityLevel; percentage?: number; description?: string };
  peopleImpact?: { populationCount: number; dependentPopulation: number };
  vulnerability?: { score: number; descriptions: string[] };
  criticality?: { score: number; label: string };
  accessibility?: { status: string; alternativeRoutes: number };
  urgency?: { score: number; timeSensitive: boolean };
  dependencies?: { count: number; criticalServicesAffected: string[] };
  hazardContext?: HazardAssessment;
  evidenceConfidence?: number;
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

export interface HazardInputDefinition {
  id: string;
  label: string;
  unit?: string;
  required: boolean;
  dataType: 'measurement' | 'score' | 'probability' | 'count' | 'density' | 'status';
  source: 'environmental' | 'geographic' | 'historical' | 'seasonal';
  acceptableRange?: [number, number];
}

export interface HazardDefinition {
  id: string;
  name: string;
  description: string;
  supportedRegions?: string[];
  units?: string[];
  requiredInputs: string[];
  // Phase 6: structured input definitions
  inputDefinitions: HazardInputDefinition[];
  supportedGeographicLevels: string[];
  susceptibilityModel?: string;
  assessmentStrategy?: string;
  explain?: string;
  applicableContexts?: string[]; // e.g. 'coastal', 'mountain', 'urban-heat'
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
  category?: string;
  unit?: string;
  dataType: 'numeric' | 'categorical' | 'boolean' | 'count' | 'percentage';
  valueType?: 'measurement' | 'score' | 'probability' | 'count' | 'density' | 'status' | 'percentage';
  colors?: string[];
  legend?: any; // Could be further typed based on legends
  min?: number;
  max?: number;
  thresholds?: number[];
  formatter?: (value: number) => string;
  source: string;
  supportedZoomLevels: [number, number];
  supportedGeographicLevels: string[];
}

// ═══════════════════════════════════════════════════════════════
// Phase 6 — Location-Aware Hazard Intelligence Contracts
// ═══════════════════════════════════════════════════════════════

export type HazardCategory =
  | 'very-low'
  | 'low'
  | 'moderate'
  | 'high'
  | 'critical';

export type HazardAssessmentStatus =
  | 'assessed'
  | 'insufficient-data'
  | 'unsupported-geographic-context';

export type HazardContribution =
  | 'positive'       // contributing signal
  | 'negative'       // risk-reducing signal
  | 'neutral'        // contextual factor
  | 'unknown';

/**
 * A single structured factor used to explain a hazard assessment.
 * Uses neutral terminology: contributing signal / risk-reducing signal /
 * contextual factor — never asserts unproven causality.
 */
export interface HazardFactor {
  id: string;
  label: string;
  value?: number;
  unit?: string;
  contribution: HazardContribution;
  explanation: string;
  source?: DataProvenance;
}

/**
 * The structured result of evaluating a hazard at a location.
 * Susceptibility and environmental signal are kept separate; neither is
 * assumed to be a calibrated probability.
 */
export interface HazardAssessment {
  hazardId: string;
  regionId: string;
  resolution: string; // e.g. 'district'

  susceptibilityScore?: number; // 0-100 — natural/structural propensity
  hazardSignalScore?: number;   // 0-100 — current environmental/trigger conditions

  category?: HazardCategory;
  status: HazardAssessmentStatus;

  confidence: number; // 0-100
  dataCompleteness: number; // 0-100

  contributingFactors: HazardFactor[];
  riskReducingFactors: HazardFactor[];
  contextualFactors: HazardFactor[];

  limitations: string[];
  keyMissingInputs: string[];

  modelId: string;
  modelVersion: string;
  configurationVersion: string;
  assessmentTimestamp: string;

  provenance: DataProvenance;
}

/**
 * Structured input to a hazard assessment.
 */
export interface HazardAssessmentInput {
  hazardId: string;
  regionId: string;
  resolution: string;
  location: GeographicContextData;
  environmentalConditions: EnvironmentalObservation[];
  staticContext: GeographicContextData;
  historicalContext?: HistoricalHazardContext;
  temporalContext: TemporalContext;
  inputOverrides?: Record<string, number>; // for future scenario simulation
}

// ═══════════════════════════════════════════════════════════════
// Location / Geographic Context Data
// ═══════════════════════════════════════════════════════════════

/**
 * Static and slowly-changing geographic characteristics of a location.
 * All fields are optional — missing data is never fabricated.
 */
export interface GeographicContextData {
  region: GeoRegionReference;

  // Terrain
  elevation?: number;
  slope?: number;
  aspect?: number;
  terrainClass?: string;
  topographicPosition?: string;

  // Geology / soil
  geologyType?: string;
  soilType?: string;
  soilStability?: number;
  rockType?: string;
  faultProximity?: number;

  // Hydrology
  riverProximity?: number;
  riverLevel?: number;
  watershed?: string;
  catchment?: string;
  drainageDensity?: number;
  drainageCapacity?: number;
  floodplainStatus?: 'yes' | 'no' | 'partial' | 'unknown';
  waterBodiesProximity?: number;
  reservoirInfluence?: boolean;

  // Land cover / land use
  landCover?: string;
  landUse?: string;
  urbanDensity?: number;
  vegetation?: string;
  dryness?: number;

  // Seasonality
  season?: string;
  month?: number;
  monsoonPeriod?: boolean;
  drySeason?: boolean;
}

/**
 * Structured historical hazard context for a region.
 * Event data is only included where real records exist; it is never
 * manufactured to fill a model input.
 */
export interface HistoricalHazardContext {
  regionId: string;
  events: HistoricalHazardEvent[];
  source?: string;
  confidence?: number;
}

export interface HistoricalHazardEvent {
  hazardType: string;
  count: number;
  eventDates?: string[];
  severityLevel?: SeverityLevel;
  affectedArea?: string;
  confidence?: number;
  dataSource?: string;
}


