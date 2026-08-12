import type { MapLayerDefinition } from '@/core/contracts';
import { mapLayerRegistry } from '@/core/registries';
import type { GeographicLevel } from '@/geospatial/types/geographic';

/**
 * Get a registered layer definition by ID
 */
export function getLayerDefinition(layerId: string): MapLayerDefinition | undefined {
  return mapLayerRegistry.get(layerId);
}

/**
 * Get all registered layer definitions
 */
export function getAllLayerDefinitions(): MapLayerDefinition[] {
  return mapLayerRegistry.getAll();
}

/**
 * Get layer definitions filtered by category
 */
export function getLayersByCategory(category: string): MapLayerDefinition[] {
  return mapLayerRegistry.getAll().filter(
    (layer) => layer.category === category
  );
}

/**
 * Classify a numeric value into a category based on layer thresholds
 */
export function classifyValue(
  value: number | undefined | null,
  thresholds: number[],
  labels: string[]
): { category: string; range: string } | null {
  if (value === undefined || value === null || isNaN(value)) {
    return null;
  }

  // Sort thresholds ascending
  const sorted = [...thresholds].sort((a, b) => a - b);
  const sortedLabels = [...labels].sort((a, b) => {
    // Keep original order alignment - this is a simplification
    return 0;
  });

  // Determine category
  if (value <= sorted[0]) {
    return { category: sortedLabels[0] || 'Very Low', range: `0–${sorted[0]}` };
  }

  for (let i = 0; i < sorted.length - 1; i++) {
    if (value > sorted[i] && value <= sorted[i + 1]) {
      return {
        category: sortedLabels[i + 1] || `${sorted[i]}-${sorted[i + 1]}`,
        range: `${sorted[i]}-${sorted[i + 1]}`,
      };
    }
  }

  // Value above all thresholds
  const lastThreshold = sorted[sorted.length - 1];
  return {
    category: sortedLabels[sortedLabels.length - 1] || `>${lastThreshold}`,
    range: `>${lastThreshold}`,
  };
}

/**
 * Get formatted value with unit based on layer definition
 */
export function formatValue(
  value: number | string | undefined | null,
  layer: MapLayerDefinition
): string {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return 'No data';
  }

  const numValue = Number(value);

  // If dataType is 'percentage', show as percentage
  if (layer.dataType === 'numeric' && layer.unit === 'percentage') {
    return `${numValue}%`;
  }

  // If unit exists, append it
  if (layer.unit) {
    return `${numValue} ${layer.unit}`;
  }

  return String(numValue);
}

/**
 * Get the visual category token for a value
 * Returns the category label and color index
 */
export function getVisualCategory(
  value: number | undefined | null,
  layer: MapLayerDefinition
): {
  category: string;
  range: string;
  colorIndex: number;
} | null {
  if (value === undefined || value === null || isNaN(value)) {
    return null;
  }

  const thresholds = layer.thresholds || [];
  const colors = layer.colors || [];

  const result = classifyValue(value, thresholds, [
    'Very Low',
    'Low',
    'Moderate',
    'High',
    'Critical',
  ]);

  if (!result) {
    return null;
  }

  // Find color index based on category position
  const colorIndex = Math.min(result.category.split(' ').length - 1, colors.length - 1);

  return {
    category: result.category,
    range: result.range,
    colorIndex: colorIndex >= 0 ? colorIndex : 0,
  };
}

/**
 * Supported geographic levels per layer (from layer definition)
 */
export function getSupportedGeographicLevels(layerId: string): GeographicLevel[] {
  const definition = getLayerDefinition(layerId);
  if (!definition) return ['district'];

  return definition.supportedGeographicLevels as GeographicLevel[];
}

/**
 * Check if a layer is supported at a given geographic level
 */
export function isLayerSupportedAtLevel(
  layerId: string,
  level: string
): boolean {
  const config = require('@/geospatial/constants/levels').GEOGRAPHIC_LEVELS[level];
  if (!config) return false;
  return config.supportedLayers.includes(layerId);
}

export type { MapLayerDefinition };