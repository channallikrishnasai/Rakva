import {
  Asset,
  Evidence,
  HazardDefinition,
  GeoRegion,
  Observation,
} from '@/core/contracts';

export interface AssetRepository {
  getAssetById(id: string): Promise<Asset | null>;
  getAssetsByRegion(regionId: string): Promise<Asset[]>;
  getAllAssets(): Promise<Asset[]>;
}

export interface EvidenceRepository {
  getEvidenceById(id: string): Promise<Evidence | null>;
  getEvidenceForAsset(assetId: string): Promise<Evidence[]>;
  getRecentEvidence(limit?: number): Promise<Evidence[]>;
}

export interface HazardRepository {
  getHazardById(id: string): Promise<HazardDefinition | null>;
  getAllHazards(): Promise<HazardDefinition[]>;
  getActiveHazardsByRegion(regionId: string): Promise<any[]>; // Could be HazardPrediction
}

export interface RegionRepository {
  getRegionById(id: string): Promise<GeoRegion | null>;
  getChildrenRegions(parentId: string): Promise<GeoRegion[]>;
}

export interface WeatherRepository {
  getCurrentWeather(location: [number, number]): Promise<Observation[]>;
  getForecast(location: [number, number]): Promise<Observation[]>;
}

export interface PopulationRepository {
  getPopulationDensity(regionId: string): Promise<number>;
  getVulnerablePopulation(regionId: string): Promise<number>;
}
