import type { 
  EnvironmentalObservation, 
  EnvironmentalVariable, 
  EnvironmentalVariableId, 
  TemporalContext, 
  GeoRegionReference, 
  DataProvenance,
  DataQuality,
  NormalizedObservation
} from '@/core/contracts';
import type { GeoRegion } from '@/core/contracts';
import type { GeographicLevel } from '@/geospatial/types/geographic';
import { indiaRegion, stateRegions, districtRegions, getRegionById, getChildren } from '@/data/mock/geographic-data';

// ═══════════════════════════════════════════════
// Environmental Variable Definitions
// ═══════════════════════════════════════════════

export const ENVIRONMENTAL_VARIABLES: Record<EnvironmentalVariableId, EnvironmentalVariable> = {
  temperature: {
    id: 'temperature',
    name: 'Temperature',
    description: 'Air temperature at 2 meters above ground',
    unit: '°C',
    category: 'temperature',
    valueType: 'measurement',
    displayPrecision: 1,
    validTemporalContexts: ['historical', 'observed', 'forecast'],
    supportedGeographicLevels: ['country', 'state', 'district', 'locality'],
    acceptableRange: [-50, 60],
  },
  rainfall: {
    id: 'rainfall',
    name: 'Rainfall',
    description: 'Precipitation levels',
    unit: 'mm',
    category: 'precipitation',
    valueType: 'measurement',
    displayPrecision: 1,
    validTemporalContexts: ['historical', 'observed', 'forecast'],
    supportedGeographicLevels: ['country', 'state', 'district', 'locality'],
    acceptableRange: [0, 1000],
  },
  humidity: {
    id: 'humidity',
    name: 'Humidity',
    description: 'Relative humidity percentage',
    unit: '%',
    category: 'temperature',
    valueType: 'measurement',
    displayPrecision: 0,
    validTemporalContexts: ['historical', 'observed', 'forecast'],
    supportedGeographicLevels: ['country', 'state', 'district'],
    acceptableRange: [0, 100],
  },
  'wind-speed': {
    id: 'wind-speed',
    name: 'Wind Speed',
    description: 'Wind speed at 10m elevation',
    unit: 'km/h',
    category: 'wind',
    valueType: 'measurement',
    displayPrecision: 1,
    validTemporalContexts: ['historical', 'observed', 'forecast'],
    supportedGeographicLevels: ['country', 'state', 'district'],
    acceptableRange: [0, 300],
  },
  'wind-direction': {
    id: 'wind-direction',
    name: 'Wind Direction',
    description: 'Wind direction in degrees (0=N, 90=E, 180=S, 270=W)',
    unit: '°',
    category: 'wind',
    valueType: 'measurement',
    displayPrecision: 0,
    validTemporalContexts: ['historical', 'observed', 'forecast'],
    supportedGeographicLevels: ['country', 'state', 'district'],
    acceptableRange: [0, 360],
  },
  pressure: {
    id: 'pressure',
    name: 'Atmospheric Pressure',
    description: 'Atmospheric pressure at sea level',
    unit: 'hPa',
    category: 'pressure',
    valueType: 'measurement',
    displayPrecision: 1,
    validTemporalContexts: ['historical', 'observed', 'forecast'],
    supportedGeographicLevels: ['country', 'state', 'district'],
    acceptableRange: [870, 1080],
  },
  'soil-moisture': {
    id: 'soil-moisture',
    name: 'Soil Moisture',
    description: 'Volumetric soil moisture content',
    unit: '%',
    category: 'soil',
    valueType: 'measurement',
    displayPrecision: 0,
    validTemporalContexts: ['historical', 'observed'],
    supportedGeographicLevels: ['country', 'state', 'district', 'locality'],
    acceptableRange: [0, 100],
  },
  'river-level': {
    id: 'river-level',
    name: 'River Level',
    description: 'Water level in rivers and streams',
    unit: 'm',
    category: 'hydro',
    valueType: 'measurement',
    displayPrecision: 2,
    validTemporalContexts: ['historical', 'observed', 'forecast'],
    supportedGeographicLevels: ['country', 'state', 'district', 'locality'],
    acceptableRange: [0, 20],
  },
  'water-level': {
    id: 'water-level',
    name: 'Water Level',
    description: 'Flood water level above ground',
    unit: 'm',
    category: 'hydro',
    valueType: 'measurement',
    displayPrecision: 2,
    validTemporalContexts: ['historical', 'observed', 'forecast'],
    supportedGeographicLevels: ['country', 'state', 'district', 'locality'],
    acceptableRange: [0, 100],
  },
};

// ═══════════════════════════════════════════════
// Mock Environmental Provider
// Generates deterministic demo observations for Indian regions
// All values are marked with isDemo provenance
// ═══════════════════════════════════════════════

const DEMO_PROVENANCE: DataProvenance = {
  source: 'Demo Environmental Dataset',
  sourceType: 'model',
  timestamp: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  spatialResolution: 'district',
  temporalResolution: '24h',
  processingMethod: 'deterministic demo data',
  modelVersion: 'demo-v1',
  confidence: 75,
  quality: 'estimated',
};

function createTemporalContext(mode: TemporalMode, timestamp?: string): TemporalContext {
  const now = timestamp || new Date().toISOString();
  return {
    mode,
    timestamp: now,
    ...(mode === 'forecast' ? { forecastLeadTime: 24 } : {}),
  };
}

function createGeoRegionRef(region: GeoRegion): GeoRegionReference {
  if (region.level === 'country') {
    return { id: region.id, level: 'country' };
  }
  if (region.level === 'state') {
    return { id: region.id, level: 'state' };
  }
  if (region.level === 'district') {
    const parent = getRegionById(region.parentId || '');
    return { id: region.id, level: 'district', parentId: parent?.id || '' };
  }
  if (region.level === 'locality') {
    const parent = getRegionById(region.parentId || '');
    return { id: region.id, level: 'locality', parentId: parent?.id || '' };
  }
  return { id: region.id, level: 'cell' as const, parentId: '' };
}

function generateDemoValue(variable: EnvironmentalVariable, region: GeoRegion): number {
  const baseValues: Record<EnvironmentalVariableId, number> = {
    temperature: 30 + (region.center?.[0] || 0) * 0.5,
    rainfall: 50 + Math.abs(region.center?.[1] || 0) * 0.3,
    humidity: 70 - Math.abs((region.center?.[0] || 0) % 10),
    'wind-speed': 15 + Math.random() * 20,
    'wind-direction': Math.random() * 360,
    pressure: 1013 + Math.random() * 20,
    'soil-moisture': 50 + Math.random() * 30,
    'river-level': 2 + Math.random() * 5,
    'water-level': 5 + Math.random() * 10,
  };

  const base = baseValues[variable.id as EnvironmentalVariableId] || 0;
  const variation = (region.id.length % 7) * 2 - 3;
  return Math.max(variable.acceptableRange?.[0] || 0, 
    Math.min(variable.acceptableRange?.[1] || 100, base + variation));
}

export class MockEnvironmentalProvider {
  async getObservations(
    variable?: EnvironmentalVariableId,
    regionId?: string,
    temporalMode: TemporalMode = 'observed'
  ): Promise<EnvironmentalObservation[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const variableDef = Object.values(ENVIRONMENTAL_VARIABLES).find(
      (v: any) => v.id === variable
    );
    if (!variableDef) return [];

    let regions: GeoRegion[] = [];
    if (regionId) {
      const region = getRegionById(regionId);
      if (region) regions = [region];
      else regions = await this.getRegionsForLevel(variableDef.supportedGeographicLevels[0]);
    } else {
      regions = await this.getRegionsForLevel('state');
    }

    return regions.map(region => {
      const value = generateDemoValue(variableDef, region);
      const temporal = createTemporalContext(temporalMode);
      const ref = createGeoRegionRef(region);

      return {
        id: `${variableDef.id}-${region.id}-${Date.now()}`,
        variable: variableDef.id,
        value: value === undefined ? null : value,
        unit: variableDef.unit,
        timestamp: new Date().toISOString(),
        temporalContext: temporal,
        location: ref,
        source: 'Demo Environmental Dataset',
        provenance: DEMO_PROVENANCE,
        confidence: 75,
        quality: 'estimated',
      } as EnvironmentalObservation;
    });
  }

  async getObservationsByRegion(
    regionId: string,
    variables: EnvironmentalVariableId[]
  ): Promise<EnvironmentalObservation[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return Promise.all(
      variables.map(varId => this.getObservations(varId, regionId, 'observed'))
    ).then(results => results.flat());
  }

  async getHistoricalObservations(
    variable: EnvironmentalVariableId,
    regionId: string,
    startDate: string,
    endDate: string
  ): Promise<EnvironmentalObservation[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const observations: EnvironmentalObservation[] = [];
    const numPoints = 5;

    for (let i = 0; i < numPoints; i++) {
      const daysAgo = (numPoints - 1 - i) * 7;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      const obs = await this.getObservations(variable, regionId, 'historical');
      observations.push(...obs);
    }
    return observations.flat();
  }

  async getForecast(
    variable: EnvironmentalVariableId,
    regionId: string,
    leadTimeHours: number = 24
  ): Promise<EnvironmentalObservation> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const observations = await this.getObservations(variable, regionId, 'forecast');
    return observations[0] || {
      id: '',
      variable: variable,
      value: 0,
      unit: '',
      timestamp: new Date().toISOString(),
      temporalContext: { mode: 'forecast', timestamp: new Date().toISOString(), forecastLeadTime: leadTimeHours },
      location: { id: '', level: 'country' as const, parentId: '' },
      source: 'Demo Environmental Dataset',
      provenance: DEMO_PROVENANCE,
      confidence: 70,
      quality: 'estimated',
    };
  }

  async getRegionVariables(regionId: string): Promise<EnvironmentalVariableId[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const region = getRegionById(regionId);
    if (!region) return [];

    const level = region.level;
    const supported = ENVIRONMENTAL_VARIABLES[Object.keys(ENVIRONMENTAL_VARIABLES)[0] as EnvironmentalVariableId].supportedGeographicLevels;
    return supported.includes(level as any) 
      ? Object.keys(ENVIRONMENTAL_VARIABLES).map(k => k as EnvironmentalVariableId)
      : [];
  }

  getAllVariables(): Record<EnvironmentalVariableId, EnvironmentalVariable> {
    return { ...ENVIRONMENTAL_VARIABLES };
  }

  async getRegionsForLevel(level: GeographicLevel): Promise<GeoRegion[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    switch (level) {
      case 'country':
        return [indiaRegion];
      case 'state':
        return stateRegions;
      case 'district':
        return districtRegions;
      case 'locality':
        // Return districts as locality fallback
        return districtRegions.map(d => ({ ...d, level: 'locality' as const }));
      default:
        return [];
    }
  }

  async getNormalizedObservation(
    variable: EnvironmentalVariableId,
    regionId: string,
    temporalMode: TemporalMode = 'observed'
  ): Promise<NormalizedObservation> {
    const observations = await this.getObservations(variable, regionId, temporalMode);
    const obs = observations[0];
    if (!obs || obs.value === null) {
      throw new Error('No observation available');
    }
    return {
      id: obs.id,
      variable: obs.variable,
      value: obs.value,
      unit: obs.unit,
      temporalContext: obs.temporalContext,
      location: obs.location,
      source: obs.source,
      provenance: obs.provenance,
      confidence: obs.confidence || 75,
      quality: obs.quality || 'estimated',
      normalizedAt: new Date().toISOString(),
    };
  }

  // Unit conversion helpers
  celsiusToFahrenheit(c: number): number {
    return (c * 9/5) + 32;
  }

  fahrenheitToCelsius(f: number): number {
    return ((f - 32) * 5/9);
  }

  mphToKmh(mph: number): number {
    return mph * 1.60934;
  }

  kmhToMph(kmh: number): number {
    return kmh / 1.60934;
  }

  inchesToMm(inches: number): number {
    return inches * 25.4;
  }

  mmToInches(mm: number): number {
    return mm / 25.4;
  }
}

export const mockEnvironmentalProvider = new MockEnvironmentalProvider();
export type { EnvironmentalVariable, TemporalContext, GeoRegionReference, DataQuality };

// Helper type - TemporalMode should be imported from contracts
export type TemporalMode = 'historical' | 'observed' | 'forecast';