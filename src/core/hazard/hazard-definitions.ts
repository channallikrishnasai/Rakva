import { hazardRegistry } from '@/core/registries';

hazardRegistry.register({
  id: 'flood',
  name: 'Flood',
  description: 'Riverine and surface water flooding',
  inputDefinitions: [
    { id: 'rainfall', required: true, label: 'Rainfall', dataType: 'measurement', source: 'environmental' },
    { id: 'river-level', required: false, label: 'River Level', dataType: 'measurement', source: 'environmental' },
    { id: 'soil-moisture', required: false, label: 'Soil Moisture', dataType: 'measurement', source: 'environmental' }
  ],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict', 'locality'],
  requiredInputs: [], susceptibilityModel: 'demo-flood-v1'
});

hazardRegistry.register({
  id: 'landslide',
  name: 'Landslide',
  description: 'Slope instability and mass movement',
  inputDefinitions: [
    { id: 'rainfall', required: true, label: 'Rainfall', dataType: 'measurement', source: 'environmental' },
    { id: 'soil-moisture', required: false, label: 'Soil Moisture', dataType: 'measurement', source: 'environmental' }
  ],
  supportedGeographicLevels: ['district', 'subdistrict', 'locality'],
  requiredInputs: [], susceptibilityModel: 'demo-landslide-v1'
});

hazardRegistry.register({
  id: 'heatwave',
  name: 'Heatwave',
  description: 'Extreme heat events',
  inputDefinitions: [
    { id: 'temperature', required: true, label: 'Temperature', dataType: 'measurement', source: 'environmental' },
    { id: 'humidity', required: false, label: 'Humidity', dataType: 'measurement', source: 'environmental' }
  ],
  supportedGeographicLevels: ['country', 'state', 'district', 'subdistrict'],
  requiredInputs: [], susceptibilityModel: 'demo-heatwave-v1'
});

hazardRegistry.register({
  id: 'wildfire',
  name: 'Wildfire',
  description: 'Uncontrolled fire in combustible vegetation',
  inputDefinitions: [
    { id: 'temperature', required: true, label: 'Temperature', dataType: 'measurement', source: 'environmental' },
    { id: 'humidity', required: true, label: 'Humidity', dataType: 'measurement', source: 'environmental' }
  ],
  supportedGeographicLevels: ['state', 'district', 'subdistrict', 'locality'],
  requiredInputs: [], susceptibilityModel: 'demo-wildfire-v1'
});

hazardRegistry.register({
  id: 'drought',
  name: 'Drought',
  description: 'Prolonged shortages in the water supply',
  inputDefinitions: [
    { id: 'rainfall', required: true, label: 'Rainfall', dataType: 'measurement', source: 'environmental' },
    { id: 'soil-moisture', required: false, label: 'Soil Moisture', dataType: 'measurement', source: 'environmental' }
  ],
  supportedGeographicLevels: ['country', 'state', 'district'],
  requiredInputs: [], susceptibilityModel: 'demo-drought-v1'
});

hazardRegistry.register({
  id: 'cyclone',
  name: 'Cyclone / Severe Wind',
  description: 'Tropical cyclones and severe wind storms',
  inputDefinitions: [
    { id: 'wind-speed', required: true, label: 'Wind Speed', dataType: 'measurement', source: 'environmental' }
  ],
  supportedGeographicLevels: ['state', 'district'],
  requiredInputs: [], susceptibilityModel: 'demo-cyclone-v1'
});

import { hazardOrchestrator } from './HazardOrchestratorImpl';
import { DemoFloodModel } from './models/DemoFloodModel';
import { DemoLandslideModel } from './models/DemoLandslideModel';
import { DemoHeatwaveModel } from './models/DemoHeatwaveModel';
import { DemoWildfireModel } from './models/DemoWildfireModel';
import { DemoDroughtModel } from './models/DemoDroughtModel';
import { DemoCycloneModel } from './models/DemoCycloneModel';

hazardOrchestrator.registerModel(new DemoFloodModel());
hazardOrchestrator.registerModel(new DemoLandslideModel());
hazardOrchestrator.registerModel(new DemoHeatwaveModel());
hazardOrchestrator.registerModel(new DemoWildfireModel());
hazardOrchestrator.registerModel(new DemoDroughtModel());
hazardOrchestrator.registerModel(new DemoCycloneModel());

export const ALL_HAZARD_IDS = hazardRegistry.getAll().map(h => h.id);

