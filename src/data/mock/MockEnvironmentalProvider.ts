import { EnvironmentalRepository, EnvironmentalQuery } from '@/core/environmental/EnvironmentalRepository';
import { EnvironmentalObservation, EnvironmentalTimeSeries, EnvironmentalVariableId, TemporalMode } from '@/core/contracts';
import { environmentalRegistry } from '@/core/environmental/environmental-registry';

// Mock data generator utilities
const seed = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return () => {
    h = Math.imul(1597334677, h);
    return ((h ^ h >>> 15) & 2147483647) / 2147483648;
  };
};

export class MockEnvironmentalProvider implements EnvironmentalRepository {
  private getProvenance() {
    return {
      source: 'Demo Environmental Dataset',
      sourceType: 'model' as const,
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      confidence: 85,
      quality: 'estimated' as const,
    };
  }

  private generateMockValue(regionId: string, variableId: EnvironmentalVariableId, mode: TemporalMode): number | null {
    const random = seed(`${regionId}-${variableId}-${mode}`);
    const def = environmentalRegistry.get(variableId);
    if (!def) return null;

    // specific hardcoded cases for the two-location test
    if (variableId === 'rainfall' && regionId.includes('BHP')) {
      return 146.7; // Very high rainfall
    }
    if (variableId === 'soil-moisture' && regionId.includes('BHP')) {
      return 85.0; // Saturated
    }
    if (variableId === 'river-level' && regionId.includes('FLAT')) {
      return 8.2; // High river level
    }

    const [min, max] = def.acceptableRange;
    const range = max - min;
    
    // Create a somewhat stable "random" value per region/variable
    const baseVal = min + (random() * range * 0.5); // stick to lower half of range usually
    
    return Number(baseVal.toFixed(def.displayPrecision));
  }

  async getCurrent(regionId: string, variables: EnvironmentalVariableId[]): Promise<EnvironmentalObservation[]> {
    return variables.map(variableId => {
      const def = environmentalRegistry.get(variableId);
      const value = this.generateMockValue(regionId, variableId, 'observed');
      
      return {
        id: `obs-${regionId}-${variableId}-current`,
        variable: variableId,
        value,
        unit: def ? def.unit : '',
        timestamp: new Date().toISOString(),
        temporalContext: {
          mode: 'observed',
          timestamp: new Date().toISOString()
        },
        location: { id: regionId, level: 'district', parentId: 'state-mp' } as any, // Cast for brevity
        source: 'Mock Provider',
        provenance: this.getProvenance(),
        confidence: value === null ? 0 : 85,
        quality: value === null ? 'missing' : 'estimated'
      };
    });
  }

  async getHistorical(query: EnvironmentalQuery): Promise<EnvironmentalObservation[]> {
    // Return a dummy historical observation
    if (!query.regionId) return [];
    const obs = await this.getCurrent(query.regionId, query.variables);
    return obs.map(o => ({
      ...o,
      id: `${o.id}-historical`,
      temporalContext: { mode: 'historical', timestamp: new Date(Date.now() - 86400000).toISOString() },
      value: (o.value || 0) * 0.8, // lower historical value
      quality: 'verified'
    }));
  }

  async getForecast(query: EnvironmentalQuery): Promise<EnvironmentalObservation[]> {
    if (!query.regionId) return [];
    const obs = await this.getCurrent(query.regionId, query.variables);
    return obs.map(o => ({
      ...o,
      id: `${o.id}-forecast`,
      temporalContext: { mode: 'forecast', timestamp: new Date(Date.now() + 86400000).toISOString(), forecastLeadTime: 24 },
      value: (o.value || 0) * 1.1, // higher forecast
      quality: 'estimated'
    }));
  }

  async getTimeSeries(regionId: string, variable: EnvironmentalVariableId, mode: TemporalMode): Promise<EnvironmentalTimeSeries> {
    const points: EnvironmentalObservation[] = [];
    const baseVal = this.generateMockValue(regionId, variable, mode) || 0;
    const def = environmentalRegistry.get(variable);
    
    // Generate 7 days of data
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      points.push({
        id: `ts-${regionId}-${variable}-${i}`,
        variable: variable,
        value: Number((baseVal + (Math.random() * 10 - 5)).toFixed(def?.displayPrecision || 1)),
        unit: def ? def.unit : '',
        timestamp: d.toISOString(),
        temporalContext: { mode, timestamp: d.toISOString() },
        location: { id: regionId, level: 'district', parentId: 'state-mp' } as any,
        source: 'Mock Provider',
        provenance: this.getProvenance(),
        confidence: 90,
        quality: 'estimated'
      });
    }

    return {
      variable,
      regionId,
      points
    };
  }
}

export const mockEnvironmentalProvider = new MockEnvironmentalProvider();
