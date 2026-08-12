import type { GeoRegion } from '@/core/contracts';

/**
 * Geographic levels in hierarchical order
 */
export type GeographicLevel = 
  | 'country' 
  | 'state' 
  | 'district' 
  | 'subdistrict' 
  | 'locality' 
  | 'cell' 
  | 'asset';

/**
 * Geographic context - the current navigation state
 * Separate from analytical filters
 */
export interface GeographicContext {
  countryId: string;
  stateId?: string;
  districtId?: string;
  subdistrictId?: string;
  localityId?: string;
  cellId?: string;
  assetId?: string;
  level: GeographicLevel;
}

/**
 * Geographic level configuration
 */
export interface GeographicLevelConfig {
  id: GeographicLevel;
  name: string;
  displayName: string;
  parentLevel: GeographicLevel | null;
  childLevel: GeographicLevel | null;
  supportedLayers: string[];
  zoomRange: [number, number];
  maxChildrenPerLoad: number;
}

/**
 * Region intelligence data
 */
export interface RegionIntelligence {
  regionId: string;
  regionName: string;
  level: GeographicLevel;
  
  // Demographics
  population?: number;
  populationDensity?: number; // per km²
  
  // Environmental
  temperature?: number;
  rainfall?: number;
  humidity?: number;
  riverLevel?: number;
  soilMoisture?: number;
  
  // Risk assessments
  floodRisk?: number; // 0-100
  landslideRisk?: number;
  heatRisk?: number;
  droughtRisk?: number;
  wildfireRisk?: number;
  
  // Impact
  populationExposed?: number;
  criticalInfrastructureAtRisk?: number;
  
  // Active alerts
  activeAlerts: Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
  }>;
  
  // Metadata
  confidence: number;
  lastUpdated: string;
  dataSource: string;
  dataQuality: 'verified' | 'estimated' | 'raw';
}

/**
 * Search result for geographic navigation
 */
export interface GeographicSearchResult {
  region: GeoRegion;
  path: GeoRegion[]; // Full hierarchy path to this region
  intelligence?: RegionIntelligence;
}

/**
 * Map layer data for a region
 */
export interface RegionLayerData {
  regionId: string;
  layerId: string;
  value: number | string | boolean;
  displayValue: string;
  color?: string;
  metadata?: Record<string, any>;
}
