import type { 
  HazardAssessment, 
  HazardAssessmentInput, 
  HazardFactor,
  HazardCategory
} from '@/core/contracts';
import type { HazardModel } from '../HazardModel';

export class DemoCycloneModel implements HazardModel {
  readonly id = 'cyclone';
  readonly version = '1.0.0-demo';

  async assess(input: HazardAssessmentInput): Promise<HazardAssessment> {
    const { location, environmentalConditions } = input;
    
    const factors: HazardFactor[] = [];
    const riskReducing: HazardFactor[] = [];
    let missingInputs: string[] = [];

    let susceptibility = 30; // Base
    let signal = 0;

    // Evaluate Static Context
    if (location.elevation !== undefined) {
      if (location.elevation > 500) {
        return {
          hazardId: this.id,
          regionId: input.regionId,
          resolution: input.resolution,
          susceptibilityScore: 0,
          hazardSignalScore: 0,
          category: 'very-low',
          status: 'unsupported-geographic-context',
          confidence: 90,
          dataCompleteness: 100,
          contributingFactors: [],
          riskReducingFactors: [],
          contextualFactors: [],
          limitations: ['Location is inland/high elevation. Cyclones pose minimal primary threat here.'],
          keyMissingInputs: [],
          modelId: 'demo-cyclone-v1',
          modelVersion: this.version,
          configurationVersion: '1.0',
          assessmentTimestamp: new Date().toISOString(),
          provenance: { source: 'demo', sourceType: 'model', confidence: 60, timestamp: new Date().toISOString(), lastUpdated: new Date().toISOString(), quality: 'estimated' }
        };
      } else if (location.elevation < 20) {
        susceptibility += 40;
        factors.push({ id: 'low-elevation', label: 'Low Elevation', contribution: 'positive', explanation: 'High susceptibility to coastal storm surges' });
      }
    } else {
      missingInputs.push('elevation');
    }

    // Evaluate Dynamic Environmental Conditions
    let wind = environmentalConditions.find(c => c.variable === 'wind-speed')?.value;
    let pressure = environmentalConditions.find(c => c.variable === 'pressure')?.value;

    if (wind !== undefined && wind !== null) {
      if (wind > 119) {
        signal += 70;
        factors.push({ id: 'hurricane-force-wind', label: 'Hurricane Force Winds', value: wind, unit: 'km/h', contribution: 'positive', explanation: 'Extremely dangerous wind speeds' });
      } else if (wind > 60) {
        signal += 30;
        factors.push({ id: 'gale-force-wind', label: 'Gale Force Winds', value: wind, unit: 'km/h', contribution: 'positive', explanation: 'Strong, potentially damaging winds' });
      }
    } else {
      missingInputs.push('wind-speed');
    }

    if (pressure !== undefined && pressure !== null) {
      if (pressure < 980) {
        signal += 30;
        factors.push({ id: 'low-pressure', label: 'Low Atmospheric Pressure', value: pressure, unit: 'hPa', contribution: 'positive', explanation: 'Indicative of intense cyclonic activity' });
      }
    } else {
      missingInputs.push('pressure');
    }

    susceptibility = Math.max(0, Math.min(100, susceptibility));
    signal = Math.max(0, Math.min(100, signal));

    let overallRisk = (signal * 0.7) + (susceptibility * 0.3);

    let category: HazardCategory = 'very-low';
    if (overallRisk > 80) category = 'critical';
    else if (overallRisk > 60) category = 'high';
    else if (overallRisk > 40) category = 'moderate';
    else if (overallRisk > 20) category = 'low';

    let confidence = 95;
    if (missingInputs.includes('wind-speed')) confidence -= 40;
    if (missingInputs.includes('elevation')) confidence -= 10;

    const status = missingInputs.includes('wind-speed') ? 'insufficient-data' : 'assessed';
    const dataCompleteness = Math.max(0, 100 - (missingInputs.length * 20));

    return {
      hazardId: this.id,
      regionId: input.regionId,
      resolution: input.resolution,
      susceptibilityScore: susceptibility,
      hazardSignalScore: signal,
      category,
      status,
      confidence: Math.max(0, confidence),
      dataCompleteness,
      contributingFactors: factors.filter(f => f.contribution === 'positive'),
      riskReducingFactors: riskReducing.concat(factors.filter(f => f.contribution === 'negative')),
      contextualFactors: factors.filter(f => f.contribution === 'neutral'),
      limitations: ['Deterministic demo model', 'Ignores storm surge interactions with tides'],
      keyMissingInputs: missingInputs,
      modelId: 'demo-cyclone-v1',
      modelVersion: this.version,
      configurationVersion: '1.0',
      assessmentTimestamp: new Date().toISOString(),
      provenance: {
        source: 'demo-cyclone-model',
        sourceType: 'model',
        confidence: 60,
        timestamp: new Date().toISOString(), lastUpdated: new Date().toISOString(), quality: 'estimated',
      }
    };
  }
}
