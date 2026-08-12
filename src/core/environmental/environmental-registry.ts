import { EnvironmentalVariableId } from '@/core/contracts';

export interface EnvironmentalVariableDefinition {
  id: EnvironmentalVariableId;
  name: string;
  description: string;
  unit: string;
  category: 'Environment' | 'Hydrology' | 'Atmosphere';
  valueType: 'measurement';
  dataType: 'numeric';
  displayPrecision: number;
  acceptableRange: [number, number];
  supportedGeographicLevels: string[];
}

class EnvironmentalRegistry {
  private variables = new Map<EnvironmentalVariableId, EnvironmentalVariableDefinition>();

  register(variable: EnvironmentalVariableDefinition) {
    this.variables.set(variable.id, variable);
  }

  get(id: EnvironmentalVariableId): EnvironmentalVariableDefinition | undefined {
    return this.variables.get(id);
  }

  getAll(): EnvironmentalVariableDefinition[] {
    return Array.from(this.variables.values());
  }
}

export const environmentalRegistry = new EnvironmentalRegistry();

// Core Environmental Variables Registration
environmentalRegistry.register({
  id: 'temperature',
  name: 'Temperature',
  description: 'Air temperature at 2m above ground',
  unit: '°C',
  category: 'Atmosphere',
  valueType: 'measurement',
  dataType: 'numeric',
  displayPrecision: 1,
  acceptableRange: [-50, 60],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict', 'locality'],
});

environmentalRegistry.register({
  id: 'rainfall',
  name: 'Rainfall',
  description: 'Precipitation levels over a specific period',
  unit: 'mm',
  category: 'Atmosphere',
  valueType: 'measurement',
  dataType: 'numeric',
  displayPrecision: 1,
  acceptableRange: [0, 2000],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict', 'locality', 'cell'],
});

environmentalRegistry.register({
  id: 'humidity',
  name: 'Humidity',
  description: 'Relative humidity percentage',
  unit: '%',
  category: 'Atmosphere',
  valueType: 'measurement',
  dataType: 'numeric',
  displayPrecision: 0,
  acceptableRange: [0, 100],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict'],
});

environmentalRegistry.register({
  id: 'wind-speed',
  name: 'Wind Speed',
  description: 'Wind speed at 10m above ground',
  unit: 'km/h',
  category: 'Atmosphere',
  valueType: 'measurement',
  dataType: 'numeric',
  displayPrecision: 1,
  acceptableRange: [0, 400],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict'],
});

environmentalRegistry.register({
  id: 'soil-moisture',
  name: 'Soil Moisture',
  description: 'Volumetric soil moisture content',
  unit: '%',
  category: 'Environment',
  valueType: 'measurement',
  dataType: 'numeric',
  displayPrecision: 1,
  acceptableRange: [0, 100],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict', 'cell'],
});

environmentalRegistry.register({
  id: 'river-level',
  name: 'River Level',
  description: 'Water level in rivers and streams',
  unit: 'm',
  category: 'Hydrology',
  valueType: 'measurement',
  dataType: 'numeric',
  displayPrecision: 2,
  acceptableRange: [0, 50],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict'],
});

environmentalRegistry.register({
  id: 'water-level',
  name: 'Water Level',
  description: 'Water level in standing water bodies',
  unit: 'm',
  category: 'Hydrology',
  valueType: 'measurement',
  dataType: 'numeric',
  displayPrecision: 2,
  acceptableRange: [0, 100],
  supportedGeographicLevels: ['district', 'subdistrict', 'locality'],
});

environmentalRegistry.register({
  id: 'wind-direction',
  name: 'Wind Direction',
  description: 'Wind direction in degrees',
  unit: '°',
  category: 'Atmosphere',
  valueType: 'measurement',
  dataType: 'numeric',
  displayPrecision: 0,
  acceptableRange: [0, 360],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict'],
});

environmentalRegistry.register({
  id: 'pressure',
  name: 'Atmospheric Pressure',
  description: 'Atmospheric pressure at sea level',
  unit: 'hPa',
  category: 'Atmosphere',
  valueType: 'measurement',
  dataType: 'numeric',
  displayPrecision: 0,
  acceptableRange: [870, 1085],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict'],
});
