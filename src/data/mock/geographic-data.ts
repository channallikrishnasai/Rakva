import type { GeoRegion } from '@/core/contracts';
import type { RegionIntelligence } from '@/geospatial/types/geographic';
import type { GeographicLevel } from '@/geospatial/types/geographic';

// Demo geographic data - simplified boundaries
export const indiaRegion: GeoRegion = {
  id: 'IN',
  level: 'country',
  name: 'India',
  center: [20.5937, 78.9629] as [number, number],
  bounds: [[6.0, 68.0], [36.0, 98.0]] as [[number, number], [number, number]]
};

export const stateRegions: GeoRegion[] = [
  { id: 'IN-KA', level: 'state', name: 'Karnataka', parentId: 'IN', center: [15.3, 75.7] as [number, number] },
  { id: 'IN-MH', level: 'state', name: 'Maharashtra', parentId: 'IN', center: [19.7, 75.7] as [number, number] },
  { id: 'IN-TN', level: 'state', name: 'Tamil Nadu', parentId: 'IN', center: [11.1, 78.6] as [number, number] },
  { id: 'IN-KL', level: 'state', name: 'Kerala', parentId: 'IN', center: [10.8, 76.2] as [number, number] },
  { id: 'IN-MP', level: 'state', name: 'Madhya Pradesh', parentId: 'IN', center: [23.0, 78.6] as [number, number] },
  { id: 'IN-GJ', level: 'state', name: 'Gujarat', parentId: 'IN', center: [22.2, 71.1] as [number, number] }
];

export const districtRegions: GeoRegion[] = [
  { id: 'IN-KA-BLR', level: 'district', name: 'Bangalore Urban', parentId: 'IN-KA', center: [12.9, 77.5] as [number, number] },
  { id: 'IN-KA-BLG', level: 'district', name: 'Belagavi', parentId: 'IN-KA', center: [15.8, 74.4] as [number, number] },
  { id: 'IN-MH-MUM', level: 'district', name: 'Mumbai', parentId: 'IN-MH', center: [19.0, 72.8] as [number, number] },
  { id: 'IN-MP-BHP', level: 'district', name: 'Bhopal', parentId: 'IN-MP', center: [23.2, 77.4] as [number, number] },
  { id: 'IN-TN-CHN', level: 'district', name: 'Chennai', parentId: 'IN-TN', center: [13.0, 80.2] as [number, number] },
  { id: 'IN-GJ-AHD', level: 'district', name: 'Ahmedabad', parentId: 'IN-GJ', center: [23.0, 72.5] as [number, number] }
];

export const subdistricts: GeoRegion[] = [];
export const localities: GeoRegion[] = [];
export const gridCells: GeoRegion[] = [];
export const assets: GeoRegion[] = [];

export const intelligenceData: Record<string, RegionIntelligence> = {
  'IN': {
    regionId: 'IN', regionName: 'India', level: 'country',
    population: 1428627663, populationDensity: 464,
    activeAlerts: [{ id: '1', type: 'flood', severity: 'high', message: 'Monsoon season', timestamp: '2024-01-15T08:00:00Z' }],
    confidence: 85, lastUpdated: '2024-01-15T10:00:00Z', dataSource: 'Demo Data', dataQuality: 'estimated'
  },
  'IN-KA': {
    regionId: 'IN-KA', regionName: 'Karnataka', level: 'state',
    population: 61095297, populationDensity: 319, temperature: 32, rainfall: 45.2,
    floodRisk: 45, heatRisk: 65, activeAlerts: [],
    confidence: 78, lastUpdated: '2024-01-15T10:00:00Z', dataSource: 'Demo Data', dataQuality: 'estimated'
  },
  'IN-MP': {
    regionId: 'IN-MP', regionName: 'Madhya Pradesh', level: 'state',
    population: 72626809, populationDensity: 236, temperature: 33, rainfall: 95.4,
    floodRisk: 35, heatRisk: 70, droughtRisk: 65, activeAlerts: [],
    confidence: 75, lastUpdated: '2024-01-15T10:00:00Z', dataSource: 'Demo Data', dataQuality: 'estimated'
  },
  'IN-KA-BLR': {
    regionId: 'IN-KA-BLR', regionName: 'Bangalore Urban', level: 'district',
    population: 12000000, populationDensity: 4378, temperature: 30, rainfall: 50.2,
    floodRisk: 40, heatRisk: 60, activeAlerts: [],
    confidence: 80, lastUpdated: '2024-01-15T10:00:00Z', dataSource: 'Demo Data', dataQuality: 'estimated'
  },
  'IN-MP-BHP': {
    regionId: 'IN-MP-BHP', regionName: 'Bhopal', level: 'district',
    population: 2700000, populationDensity: 855, temperature: 32, rainfall: 85.3,
    floodRisk: 35, heatRisk: 65, activeAlerts: [],
    confidence: 78, lastUpdated: '2024-01-15T10:00:00Z', dataSource: 'Demo Data', dataQuality: 'estimated'
  },
  'IN-MH-MUM': {
    regionId: 'IN-MH-MUM', regionName: 'Mumbai', level: 'district',
    population: 12400000, populationDensity: 20680, temperature: 33, rainfall: 150.8,
    floodRisk: 75, activeAlerts: [{ id: '2', type: 'flood', severity: 'critical', message: 'Flood warning', timestamp: '2024-01-15T03:00:00Z' }],
    confidence: 88, lastUpdated: '2024-01-15T10:00:00Z', dataSource: 'Demo Data', dataQuality: 'estimated'
  }
};

export function getAllRegions(): GeoRegion[] {
  return [indiaRegion, ...stateRegions, ...districtRegions, ...subdistricts, ...localities, ...gridCells, ...assets];
}

export function getRegionsByLevel(level: GeographicLevel): GeoRegion[] {
  return getAllRegions().filter(r => r.level === level);
}

export function getRegionById(id: string): GeoRegion | undefined {
  return getAllRegions().find(r => r.id === id);
}

export function getChildren(parentId: string): GeoRegion[] {
  return getAllRegions().filter(r => r.parentId === parentId);
}

export function getRegionIntelligence(regionId: string): RegionIntelligence | undefined {
  return intelligenceData[regionId];
}

export function searchRegions(query: string): Array<{ region: GeoRegion; path: GeoRegion[] }> {
  const results: Array<{ region: GeoRegion; path: GeoRegion[] }> = [];
  const allRegions = getAllRegions();
  const lowerQuery = query.toLowerCase();
  for (const region of allRegions) {
    if (region.name.toLowerCase().includes(lowerQuery)) {
      const path = getRegionPath(region.id);
      results.push({ region, path });
    }
  }
  return results.slice(0, 20);
}

export function getRegionPath(regionId: string): GeoRegion[] {
  const path: GeoRegion[] = [];
  let current = getRegionById(regionId);
  while (current) {
    path.unshift(current);
    current = current.parentId ? getRegionById(current.parentId) : undefined;
  }
  return path;
}
