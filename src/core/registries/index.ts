import { HazardDefinition, MapLayerDefinition, DataSource } from '../contracts';

export class HazardRegistry {
  private hazards: Map<string, HazardDefinition> = new Map();

  register(hazard: HazardDefinition) {
    if (this.hazards.has(hazard.id)) {
      console.warn(`Hazard ${hazard.id} is already registered.`);
    }
    this.hazards.set(hazard.id, hazard);
  }

  get(id: string): HazardDefinition | undefined {
    return this.hazards.get(id);
  }

  getAll(): HazardDefinition[] {
    return Array.from(this.hazards.values());
  }
}

export class MapLayerRegistry {
  private layers: Map<string, MapLayerDefinition> = new Map();

  register(layer: MapLayerDefinition) {
    if (this.layers.has(layer.id)) {
      console.warn(`Map layer ${layer.id} is already registered.`);
    }
    this.layers.set(layer.id, layer);
  }

  get(id: string): MapLayerDefinition | undefined {
    return this.layers.get(id);
  }

  getAll(): MapLayerDefinition[] {
    return Array.from(this.layers.values());
  }
}

export class DataSourceRegistry {
  private sources: Map<string, DataSource> = new Map();

  register(source: DataSource) {
    if (this.sources.has(source.id)) {
      console.warn(`Data source ${source.id} is already registered.`);
    }
    this.sources.set(source.id, source);
  }

  get(id: string): DataSource | undefined {
    return this.sources.get(id);
  }

  getAll(): DataSource[] {
    return Array.from(this.sources.values());
  }
}

// Singletons for global access during phase 1, can be moved to dependency injection later
export const hazardRegistry = new HazardRegistry();
export const mapLayerRegistry = new MapLayerRegistry();
export const dataSourceRegistry = new DataSourceRegistry();
