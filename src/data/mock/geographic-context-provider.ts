import type { GeographicContextData } from '@/core/contracts';
import { getRegionById } from './geographic-data';

// Add the two test regions to the geographic-data so they can be looked up
// We'll augment the getRegionById logic slightly in a separate file if needed, 
// or just return mock data directly here based on regionId.

const defaultContext: GeographicContextData = {
  region: { id: 'default', level: 'district', parentId: 'IN' },
  elevation: 200,
  slope: 5,
  terrainClass: 'Plains',
  soilStability: 80,
  drainageCapacity: 60,
  floodplainStatus: 'no',
  urbanDensity: 40,
  season: 'monsoon'
};

const contexts: Record<string, GeographicContextData> = {
  'IN-MP-BHP-FLAT': {
    region: { id: 'IN-MP-BHP-FLAT', level: 'subdistrict', parentId: 'IN-MP-BHP',  },
    elevation: 250,
    slope: 2, // very flat
    terrainClass: 'Plains',
    soilStability: 80,
    drainageCapacity: 90, // excellent drainage
    floodplainStatus: 'no', // outside floodplain
    urbanDensity: 30,
    season: 'monsoon'
  },
  'IN-MP-BHP-STEEP': {
    region: { id: 'IN-MP-BHP-STEEP', level: 'subdistrict', parentId: 'IN-MP-BHP',  },
    elevation: 450,
    slope: 22, // steep slope
    terrainClass: 'Hills',
    soilStability: 30, // unstable soil
    drainageCapacity: 30, // poor drainage
    floodplainStatus: 'yes', // floodplain exposure at base
    urbanDensity: 60,
    season: 'monsoon'
  },
  'IN-MH-MUM': {
    region: { id: 'IN-MH-MUM', level: 'district', parentId: 'IN-MH' },
    elevation: 14,
    slope: 3,
    terrainClass: 'Coastal Plains',
    soilStability: 60,
    drainageCapacity: 40,
    floodplainStatus: 'yes',
    urbanDensity: 95,
    season: 'monsoon'
  }
};

export class MockGeographicContextProvider {
  async getContextForRegion(regionId: string): Promise<GeographicContextData> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    if (contexts[regionId]) {
      return contexts[regionId];
    }

    const region = getRegionById(regionId);
    return {
      ...defaultContext,
      region: (region ? { id: region.id, level: region.level, parentId: region.parentId } : defaultContext.region) as any
    };
  }
}

export const mockGeographicContextProvider = new MockGeographicContextProvider();
