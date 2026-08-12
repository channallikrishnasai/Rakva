import { AssetRepository } from '../repositories';
import { Asset, GeoRegion } from '@/core/contracts';
import { commandCenterData } from './command-center';

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
            da.damageSeverity === 'moderate' || da.damageSeverity === 'minor' ? 'degraded' : 'operational'
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
