import { MapLayerDefinition } from '@/core/contracts';
import { mapLayerRegistry } from '@/core/registries';

// ═══════════════════════════════════════════════
// Map Layer Definitions - Registered with the MapLayerRegistry
// Each layer defines its visualization parameters,
// color scale, thresholds, and supported geographic levels.
// ═══════════════════════════════════════════════

// Environmental layers
mapLayerRegistry.register({
  id: 'rainfall',
  name: 'Rainfall',
  description: 'Precipitation levels measured in millimeters',
  category: 'Environment',
  unit: 'mm / 24h',
  valueType: 'measurement',
  dataType: 'numeric',
  thresholds: [20, 50, 100, 200],
  colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#e0f2fe'],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict', 'locality'],
  supportedZoomLevels: [1, 17],
  source: 'Demo Geographic Data',
});

mapLayerRegistry.register({
  id: 'temperature',
  name: 'Temperature',
  description: 'Air temperature at 2m above ground',
  category: 'Environment',
  unit: '°C',
  valueType: 'measurement',
  dataType: 'numeric',
  thresholds: [25, 30, 35],
  colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', ' #f87171'],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict'],
  supportedZoomLevels: [1, 12],
  source: 'Demo Geographic Data',
});

mapLayerRegistry.register({
  id: 'humidity',
  name: 'Humidity',
  description: 'Relative humidity percentage',
  category: 'Environment',
  unit: '%',
  valueType: 'measurement',
  dataType: 'numeric',
  thresholds: [50, 70, 80],
  colors: ['#60a5fa', '#93c5fd', '#bfdbfe', ' #f87171'],
  supportedGeographicLevels: ['country', 'state', 'district'],
  supportedZoomLevels: [1, 12],
  source: 'Demo Geographic Data',
});

mapLayerRegistry.register({
  id: 'soil_moisture',
  name: 'Soil Moisture',
  description: 'Volumetric soil moisture content',
  category: 'Environment',
  unit: '%',
  valueType: 'measurement',
  dataType: 'numeric',
  thresholds: [20, 40, 60],
  colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict'],
  supportedZoomLevels: [1, 12],
  source: 'Demo Geographic Data',
});

mapLayerRegistry.register({
  id: 'river_level',
  name: 'River Level',
  description: 'Water level in rivers and streams',
  category: 'Environment',
  unit: 'meters',
  valueType: 'measurement',
  dataType: 'numeric',
  thresholds: [3, 5, 8],
  colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#f87171'],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict'],
  supportedZoomLevels: [1, 12],
  source: 'Demo Geographic Data',
});

// Population / Human layers
mapLayerRegistry.register({
  id: 'population',
  name: 'Population',
  description: 'Total population count',
  category: 'Human',
  unit: 'people',
  valueType: 'count',
  dataType: 'numeric',
  thresholds: [100000, 500000, 1000000],
  colors: ['#fbbf24', '#f59e0b', '#ef4444', '#dc2626'],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict', 'locality'],
  supportedZoomLevels: [1, 17],
  source: 'Demo Geographic Data',
});

mapLayerRegistry.register({
  id: 'population_density',
  name: 'Population Density',
  description: 'People per square kilometer',
  category: 'Human',
  unit: 'people / km²',
  valueType: 'density',
  dataType: 'numeric',
  thresholds: [100, 500, 1000, 5000],
  colors: ['#fbbf24', '#f59e0b', '#ef4444', '#dc2626', '#7f1d1d'],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict', 'locality'],
  supportedZoomLevels: [1, 17],
  source: 'Demo Geographic Data',
});

mapLayerRegistry.register({
  id: 'vulnerability',
  name: 'Vulnerability',
  description: 'Community vulnerability index (0-100)',
  category: 'Human',
  unit: 'score',
  valueType: 'score',
  dataType: 'numeric',
  thresholds: [20, 40, 60, 80],
  colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#f59e0b', '#ef4444'],
  supportedGeographicLevels: ['country', 'state', 'district'],
  supportedZoomLevels: [1, 12],
  source: 'Demo Geographic Data',
});

// Infrastructure layers
mapLayerRegistry.register({
  id: 'critical_infrastructure',
  name: 'Critical Infrastructure',
  description: 'Locations of hospitals, schools, power plants',
  category: 'Infrastructure',
  unit: 'count',
  valueType: 'count',
  dataType: 'count',
  thresholds: [1, 5, 10],
  colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#f59e0b'],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict'],
  supportedZoomLevels: [1, 12],
  source: 'Demo Geographic Data',
});

mapLayerRegistry.register({
  id: 'infrastructure_exposure',
  name: 'Infrastructure Exposure',
  description: 'Infrastructure at risk of damage',
  category: 'Infrastructure',
  unit: 'count',
  valueType: 'count',
  dataType: 'count',
  thresholds: [1, 5, 10, 20],
  colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#f59e0b', '#ef4444'],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict'],
  supportedZoomLevels: [1, 12],
  source: 'Demo Geographic Data',
});

// Hazard / Risk layers
mapLayerRegistry.register({
  id: 'flood_risk',
  name: 'Flood Risk',
  description: 'Flood risk score (0-100)',
  category: 'Risk',
  unit: 'score',
  valueType: 'score',
  dataType: 'numeric',
  thresholds: [20, 40, 60, 80],
  colors: ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict', 'locality'],
  supportedZoomLevels: [1, 17],
  source: 'Demo Geographic Data',
});

mapLayerRegistry.register({
  id: 'landslide_risk',
  name: 'Landslide Risk',
  description: 'Landslide susceptibility and risk score',
  category: 'Risk',
  unit: 'score',
  valueType: 'score',
  dataType: 'numeric',
  thresholds: [20, 40, 60, 80],
  colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#f59e0b', '#ef4444'],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict'],
  supportedZoomLevels: [1, 12],
  source: 'Demo Geographic Data',
});

mapLayerRegistry.register({
  id: 'heat_risk',
  name: 'Heat Risk',
  description: 'Heat exposure risk score',
  category: 'Risk',
  unit: 'score',
  dataType: 'numeric',
  thresholds: [20, 40, 60, 80],
  colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#f59e0b', '#ef4444'],
  supportedGeographicLevels: ['country', 'state', 'district'],
  supportedZoomLevels: [1, 12],
  source: 'Demo Geographic Data',
});

mapLayerRegistry.register({
  id: 'overall_hazard_risk',
  name: 'Overall Hazard Risk',
  description: 'Composite hazard risk score',
  category: 'Risk',
  unit: 'score',
  valueType: 'score',
  dataType: 'numeric',
  thresholds: [20, 40, 60, 80],
  colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#f59e0b', '#ef4444'],
  supportedGeographicLevels: ['country', 'state', 'district'],
  supportedZoomLevels: [1, 12],
  source: 'Demo Geographic Data',
});

// Operational layers
mapLayerRegistry.register({
  id: 'priority_assets',
  name: 'Priority Assets',
  description: 'Assets ranked by recovery priority',
  category: 'Operations',
  unit: 'count',
  valueType: 'count',
  dataType: 'count',
  thresholds: [1, 5, 10],
  colors: ['#ef4444', '#f97316', '#eab308', '#60a5fa'],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict'],
  supportedZoomLevels: [1, 12],
  source: 'Command Center Data',
});

mapLayerRegistry.register({
  id: 'active_alerts',
  name: 'Active Alerts',
  description: 'Currently active disaster alerts',
  category: 'Operations',
  unit: 'count',
  valueType: 'count',
  dataType: 'count',
  thresholds: [1, 3, 5],
  colors: ['#ef4444', '#f97316', '#eab308'],
  supportedGeographicLevels: ['country', 'state', 'district'],
  supportedZoomLevels: [1, 12],
  source: 'Demo Geographic Data',
});

mapLayerRegistry.register({
  id: 'evidence_confidence',
  name: 'Evidence Confidence',
  description: 'Confidence level in the data assessment',
  category: 'Operations',
  unit: 'percentage',
  valueType: 'percentage',
  dataType: 'numeric',
  thresholds: [50, 75, 90],
  colors: ['#64748b', '#f59e0b', '#ef4444', '#3b82f6'],
  supportedGeographicLevels: ['country', 'state', 'district'],
  supportedZoomLevels: [1, 12],
  source: 'Command Center Data',
});

// Export all registered layer IDs for use in the UI
export const ALL_LAYER_IDS = mapLayerRegistry.getAll().map((l) => l.id);

// Re-export the registry for external access
export { mapLayerRegistry };