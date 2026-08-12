import type { GeographicLevelConfig } from '../types/geographic';

/**
 * Geographic Level Registry
 * 
 * Defines the configuration for each geographic level in the hierarchy.
 * This registry makes the system extensible - new levels can be added
 * without modifying the map rendering logic.
 */
export const GEOGRAPHIC_LEVELS: Record<string, GeographicLevelConfig> = {
  country: {
    id: 'country',
    name: 'country',
    displayName: 'Country',
    parentLevel: null,
    childLevel: 'state',
    supportedLayers: ['risk', 'population', 'alerts'],
    zoomRange: [1, 5],
    maxChildrenPerLoad: 50,
  },
  state: {
    id: 'state',
    name: 'state',
    displayName: 'State',
    parentLevel: 'country',
    childLevel: 'district',
    supportedLayers: ['risk', 'population', 'rainfall', 'temperature', 'humidity', 'alerts'],
    zoomRange: [5, 8],
    maxChildrenPerLoad: 50,
  },
  district: {
    id: 'district',
    name: 'district',
    displayName: 'District',
    parentLevel: 'state',
    childLevel: 'subdistrict',
    supportedLayers: ['risk', 'population', 'rainfall', 'temperature', 'humidity', 'river_level', 'alerts'],
    zoomRange: [8, 12],
    maxChildrenPerLoad: 30,
  },
  subdistrict: {
    id: 'subdistrict',
    name: 'subdistrict',
    displayName: 'Subdistrict / Taluk',
    parentLevel: 'district',
    childLevel: 'locality',
    supportedLayers: ['risk', 'population', 'rainfall', 'temperature', 'soil_moisture', 'alerts'],
    zoomRange: [12, 15],
    maxChildrenPerLoad: 20,
  },
  locality: {
    id: 'locality',
    name: 'locality',
    displayName: 'Local Area / Village',
    parentLevel: 'subdistrict',
    childLevel: 'cell',
    supportedLayers: ['risk', 'population', 'rainfall', 'temperature', 'alerts'],
    zoomRange: [15, 17],
    maxChildrenPerLoad: 15,
  },
  cell: {
    id: 'cell',
    name: 'cell',
    displayName: 'Grid Cell / Zone',
    parentLevel: 'locality',
    childLevel: 'asset',
    supportedLayers: ['risk', 'population', 'alerts'],
    zoomRange: [17, 19],
    maxChildrenPerLoad: 10,
  },
  asset: {
    id: 'asset',
    name: 'asset',
    displayName: 'Asset',
    parentLevel: 'cell',
    childLevel: null,
    supportedLayers: ['risk', 'damage', 'priority', 'dependencies'],
    zoomRange: [19, 20],
    maxChildrenPerLoad: 0,
  },
};

/**
 * Get configuration for a specific geographic level
 */
export function getLevelConfig(level: string): GeographicLevelConfig | undefined {
  return GEOGRAPHIC_LEVELS[level];
}

/**
 * Get the parent level for a given level
 */
export function getParentLevel(level: string): string | null {
  return GEOGRAPHIC_LEVELS[level]?.parentLevel || null;
}

/**
 * Get the child level for a given level
 */
export function getChildLevel(level: string): string | null {
  return GEOGRAPHIC_LEVELS[level]?.childLevel || null;
}

/**
 * Check if a layer is supported at a given geographic level
 */
export function isLayerSupportedAtLevel(layerId: string, level: string): boolean {
  const config = GEOGRAPHIC_LEVELS[level];
  return config ? config.supportedLayers.includes(layerId) : false;
}
