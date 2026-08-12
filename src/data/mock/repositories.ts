import { AssetRepository } from '../repositories';
import { Asset, GeoRegion } from '@/core/contracts';
import { commandCenterData } from './command-center';

const assetPositions: Record<string, { x: number; z: number }> = {
  "BRIDGE-024": { x: 0, z: -2 },
  "HOSPITAL-002": { x: 5, z: -5.5 },
  "BUILDING-031": { x: -5, z: 3.5 },
  "ROAD-017": { x: 3, z: 2 },
  "ROAD-041": { x: 7, z: -2.5 },
  "BUILDING-018": { x: -3, z: 0.5 },
  "UTILITY-009": { x: -7, z: -2.5 },
  "BRIDGE-031": { x: 2, z: 5.5 },
};

const dependencyConnections: Record<string, { targetId: string; label: string }[]> = {
  "BRIDGE-024": [
    { targetId: "HOSPITAL-002", label: "HOSPITAL DEPENDENCY" },
    { targetId: "BUILDING-031", label: "POPULATION DEPENDENCY" },
    { targetId: "ROAD-017", label: "ACCESSIBILITY" },
  ],
};

// Adapter to convert old mock data to new Asset contract format
function adaptDisasterAssetToAsset(da: any): Asset {
  return {
    id: da.id,
    name: da.name,
    type: da.assetType,
    location: [da.mapPosition.x, da.mapPosition.y], // Mapping x/y to lat/lng conceptual
    regionId: da.region,
    criticality: da.factors.criticality,
    status: da.damageSeverity === 'critical' || da.damageSeverity === 'severe' ? 'failed' : 
            da.damageSeverity === 'moderate' || da.damageSeverity === 'minor' ? 'degraded' : 'operational',
    visualization: {
      mapPosition: da.mapPosition,
      scenePosition: assetPositions[da.id],
      affectedRadius: da.affectedRadius,
    },
    damageSeverity: da.damageSeverity,
    damageDescription: da.damageDescription,
    impactDescription: da.impactDescription,
    priorityMetrics: {
      basePriority: da.basePriority,
      recoveryPriority: da.recoveryPriority,
      priorityLabel: da.priorityLabel,
      factors: da.factors,
      whyFirst: da.whyFirst,
    },
    evidence: da.evidenceSources,
    overallEvidenceConfidence: da.overallEvidenceConfidence,
    consequenceLevel: da.consequenceLevel,
    consequenceDescription: da.consequenceDescription,
    accessibility: da.accessibility,
    accessibilityDescription: da.accessibilityDescription,
    urgency: da.urgency,
    urgencyDescription: da.urgencyDescription,
    dependencies: dependencyConnections[da.id] || [],
  };
}

export class MockAssetRepository implements AssetRepository {
  async getAssetById(id: string): Promise<Asset | null> {
    const found = commandCenterData.assets.find((a: any) => a.id === id);
    return found ? adaptDisasterAssetToAsset(found) : null;
  }

  async getAssetsByRegion(regionId: string): Promise<Asset[]> {
    return commandCenterData.assets
      .filter((a: any) => a.region === regionId)
      .map(adaptDisasterAssetToAsset);
  }

  async getAllAssets(): Promise<Asset[]> {
    return commandCenterData.assets.map(adaptDisasterAssetToAsset);
  }
}
