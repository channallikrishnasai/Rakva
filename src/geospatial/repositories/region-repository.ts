import type { GeoRegion } from '@/core/contracts';
import type { RegionIntelligence } from '@/geospatial/types/geographic';
import type { RegionRepository } from '@/data/repositories';
import { getAllRegions, getRegionById, getChildren, getRegionIntelligence, searchRegions } from '@/data/mock/geographic-data';

export class MockRegionRepository implements RegionRepository {
  async getRegionById(id: string): Promise<GeoRegion | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return getRegionById(id) || null;
  }

  async getChildrenRegions(parentId: string): Promise<GeoRegion[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return getChildren(parentId);
  }

  async getRegionIntelligence(regionId: string): Promise<RegionIntelligence | null> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return getRegionIntelligence(regionId) || null;
  }

  async searchRegions(query: string): Promise<Array<{ region: GeoRegion; path: GeoRegion[] }>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return searchRegions(query);
  }

  async getRegionsByLevel(level: string): Promise<GeoRegion[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return getAllRegions().filter(r => r.level === level);
  }

  async getRegionPath(regionId: string): Promise<GeoRegion[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const path: GeoRegion[] = [];
    let current = await this.getRegionById(regionId);
    while (current) {
      path.unshift(current);
      current = current.parentId ? await this.getRegionById(current.parentId) : null;
    }
    return path;
  }

  async validateHierarchy(parentId: string, childId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const parent = await this.getRegionById(parentId);
    const child = await this.getRegionById(childId);
    if (!parent || !child || !child.parentId) return false;
    return child.parentId === parentId;
  }
}
