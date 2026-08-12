import type { 
  EnvironmentalObservation, 
  EnvironmentalVariableId, 
  NormalizedObservation, 
  TemporalContext,
  TemporalMode,
  DataQuality
} from '@/core/contracts';
import { mockEnvironmentalProvider } from '@/data/mock/environmental-provider';
import type { GeographicLevel } from '@/geospatial/types/geographic';

/**
 * EnvironmentalRepository - Repository abstraction for environmental data.
 * 
 * Provides a clean separation between the application logic
 * and the data source (mock, live provider, or historical store).
 */
export interface EnvironmentalRepository {
  /** Get observations for a variable and region */
  getObservations(
    variable: EnvironmentalVariableId,
    regionId: string,
    temporalMode?: TemporalMode
  ): Promise<EnvironmentalObservation[]>;

  /** Get observations for multiple variables and a region */
  getObservationsByRegion(
    regionId: string,
    variables: EnvironmentalVariableId[]
  ): Promise<EnvironmentalObservation[]>;

  /** Get historical observations for a variable and region */
  getHistoricalObservations(
    variable: EnvironmentalVariableId,
    regionId: string,
    startDate: string,
    endDate: string
  ): Promise<EnvironmentalObservation[]>;

  /** Get forecast for a variable and region */
  getForecast(
    variable: EnvironmentalVariableId,
    regionId: string,
    leadTimeHours?: number
  ): Promise<EnvironmentalObservation>;

  /** Get all variables available for a region */
  getRegionVariables(regionId: string): Promise<EnvironmentalVariableId[]>;

  /** Get a normalized observation (ensures value is numeric, etc.) */
  getNormalizedObservation(
    variable: EnvironmentalVariableId,
    regionId: string,
    temporalMode?: TemporalMode
  ): Promise<NormalizedObservation>;

  /** Get all environmental variables with their definitions */
  getAllVariables(): Promise<Record<EnvironmentalVariableId, import('@/core/contracts').EnvironmentalVariable>>;
}

/**
 * MockEnvironmentalRepository - Demo implementation using deterministic mock data.
 * 
 * All values are explicitly marked as demo data through the provenance system.
 * Never presents values as live/official unless a real provider is connected.
 */
export class MockEnvironmentalRepository implements EnvironmentalRepository {
  private variablesCache: Record<EnvironmentalVariableId, import('@/core/contracts').EnvironmentalVariable> | null = null;

  async getObservations(
    variable: EnvironmentalVariableId,
    regionId: string,
    temporalMode: TemporalMode = 'observed'
  ): Promise<EnvironmentalObservation[]> {
    return mockEnvironmentalProvider.getObservations(variable, regionId, temporalMode);
  }

  async getObservationsByRegion(
    regionId: string,
    variables: EnvironmentalVariableId[]
  ): Promise<EnvironmentalObservation[]> {
    return mockEnvironmentalProvider.getObservationsByRegion(regionId, variables);
  }

  async getHistoricalObservations(
    variable: EnvironmentalVariableId,
    regionId: string,
    startDate: string,
    endDate: string
  ): Promise<EnvironmentalObservation[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockEnvironmentalProvider.getHistoricalObservations(variable, regionId, startDate, endDate);
  }

  async getForecast(
    variable: EnvironmentalVariableId,
    regionId: string,
    leadTimeHours = 24
  ): Promise<EnvironmentalObservation> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockEnvironmentalProvider.getForecast(variable, regionId, leadTimeHours);
  }

  async getRegionVariables(regionId: string): Promise<EnvironmentalVariableId[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockEnvironmentalProvider.getRegionVariables(regionId);
  }

  async getNormalizedObservation(
    variable: EnvironmentalVariableId,
    regionId: string,
    temporalMode: TemporalMode = 'observed'
  ): Promise<NormalizedObservation> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockEnvironmentalProvider.getNormalizedObservation(variable, regionId, temporalMode);
  }

  async getAllVariables(): Promise<Record<EnvironmentalVariableId, import('@/core/contracts').EnvironmentalVariable>> {
    if (!this.variablesCache) {
      this.variablesCache = await mockEnvironmentalProvider.getAllVariables();
    }
    return this.variablesCache;
  }
}

/**
 * EnvironmentalDataNormalizer - Handles unit normalization and value validation.
 * 
 * Ensures all environmental values are stored in canonical units
 * and that conversions are properly recorded in provenance.
 */
export class EnvironmentalDataNormalizer {
  private conversionHistory: Array<{
    fromUnit: string;
    toUnit: string;
    originalValue: number;
    convertedValue: number;
    timestamp: string;
  }> = [];

  /**
   * Convert temperature from °F to °C.
   * Records the conversion in history for provenance.
   */
  celsiusToFahrenheit(c: number): number {
    const f = (c * 9/5) + 32;
    this.conversionHistory.push({
      fromUnit: '°C',
      toUnit: '°F',
      originalValue: c,
      convertedValue: f,
      timestamp: new Date().toISOString(),
    });
    return f;
  }

  /**
   * Convert temperature from °C to °F.
   * Records the conversion in history for provenance.
   */
  fahrenheitToCelsius(f: number): number {
    const c = (f - 32) * 5/9;
    this.conversionHistory.push({
      fromUnit: '°F',
      toUnit: '°C',
      originalValue: f,
      convertedValue: c,
      timestamp: new Date().toISOString(),
    });
    return c;
  }

  /**
   * Convert wind speed from mph to km/h.
   * Records the conversion in history for provenance.
   */
  mphToKmh(mph: number): number {
    const kmh = mph * 1.60934;
    this.conversionHistory.push({
      fromUnit: 'mph',
      toUnit: 'km/h',
      originalValue: mph,
      convertedValue: kmh,
      timestamp: new Date().toISOString(),
    });
    return kmh;
  }

  /**
   * Convert wind speed from km/h to mph.
   * Records the conversion in history for provenance.
   */
  kmhToMph(kmh: number): number {
    const mph = kmh / 1.60934;
    this.conversionHistory.push({
      fromUnit: 'km/h',
      toUnit: 'mph',
      originalValue: kmh,
      convertedValue: mph,
      timestamp: new Date().toISOString(),
    });
    return mph;
  }

  /**
   * Convert rainfall from inches to mm.
   * Records the conversion in history for provenance.
   */
  inchesToMm(inches: number): number {
    const mm = inches * 25.4;
    this.conversionHistory.push({
      fromUnit: 'inches',
      toUnit: 'mm',
      originalValue: inches,
      convertedValue: mm,
      timestamp: new Date().toISOString(),
    });
    return mm;
  }

  /**
   * Convert rainfall from mm to inches.
   * Records the conversion in history for provenance.
   */
  mmToInches(mm: number): number {
    const inches = mm / 25.4;
    this.conversionHistory.push({
      fromUnit: 'mm',
      toUnit: 'inches',
      originalValue: mm,
      convertedValue: inches,
      timestamp: new Date().toISOString(),
    });
    return inches;
  }

  /** Get the full conversion history for provenance tracking */
  getConversionHistory() {
    return this.conversionHistory;
  }
}

/**
 * EnvironmentalFilter - Represents a filter that can be applied to environmental queries.
 * 
 * Extends the existing filter architecture to support environmental variables.
 */
export interface EnvironmentalFilter {
  variable: EnvironmentalVariableId;
  temporalMode?: TemporalMode;
  minValue?: number;
  maxValue?: number;
  source?: string;
  quality?: DataQuality;
  /** Date range in ISO format */
  dateRange?: [string, string];
  /** Resolution filter (e.g., 'district', 'grid') */
  resolution?: string;
}

/**
 * EnvironmentalQuery - A reusable query contract for environmental data.
 * 
 * Adapted to existing project conventions.
 */
export interface EnvironmentalQuery {
  regionId?: string;
  geographicLevel?: GeographicLevel;
  variables: EnvironmentalVariableId[];
  temporalMode?: TemporalContext['mode'];
  startTime?: string;
  endTime?: string;
  sourceId?: string;
  resolution?: string;
  filter?: EnvironmentalFilter;
}