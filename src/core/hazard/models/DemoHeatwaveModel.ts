import type { 
  HazardAssessment, 
  HazardAssessmentInput, 
  HazardFactor,
  HazardCategory
} from '@/core/contracts';
import type { HazardModel } from '../HazardModel';

export class DemoHeatwaveModel implements HazardModel {
  readonly id = 'heatwave';
  readonly version = '1.0.0-demo';

  async assess(input: HazardAssessmentInput): Promise<HazardAssessment> {
    const { location, environmentalConditions } = input;
    
    const factors: HazardFactor[] = [];
    const riskReducing: HazardFactor[] = [];
    let missingInputs: string[] = [];

    let susceptibility = 30; // Base
    let signal = 0;

    // Evaluate Static Context
    if (location.urbanDensity !== undefined) {
      if (location.urbanDensity > 70) {
        susceptibility += 30;
        factors.push({ id: 'urban-heat', label: 'Urban Heat Island', contribution: 'positive', explanation: 'High urban density traps heat' });
      } else if (location.urbanDensity < 20) {
        susceptibility -= 10;
        riskReducing.push({ id: 'rural-cooling', label: 'Rural Open Space', contribution: 'negative', explanation: 'Open space allows natural cooling' });
      }
    } else {
      missingInputs.push('urbanDensity');
    }

    // Evaluate Dynamic Environmental Conditions
    let temp = environmentalConditions.find(c => c.variable === 'temperature')?.value;
    let humidity = environmentalConditions.find(c => c.variable === 'humidity')?.value;

    if (temp !== undefined && temp !== null) {
      if (temp > 42) {
        signal += 60;
        factors.push({ id: 'temp-extreme', label: 'Extreme Temperature', value: temp, unit: '°C', contribution: 'positive', explanation: 'Temperatures are critically high' });
      } else if (temp > 38) {
        signal += 30;
        factors.push({ id: 'temp-high', label: 'High Temperature', value: temp, unit: '°C', contribution: 'positive', explanation: 'Temperatures are elevated' });
      }
    } else {
      missingInputs.push('temperature');
    }

    if (humidity !== undefined && humidity !== null && temp !== undefined && temp !== null && temp > 35) {
      if (humidity > 60) {
        signal += 20;
        factors.push({ id: 'wet-bulb', label: 'High Humidity', value: humidity, unit: '%', contribution: 'positive', explanation: 'High humidity restricts evaporative cooling' });
      }
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
    if (missingInputs.includes('temperature')) confidence -= 50;

    const status = missingInputs.includes('temperature') ? 'insufficient-data' : 'assessed';
    const dataCompleteness = Math.max(0, 100 - (missingInputs.length * 15));

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
      limitations: ['Deterministic demo model'],
      keyMissingInputs: missingInputs,
      modelId: 'demo-heatwave-v1',
      modelVersion: this.version,
      configurationVersion: '1.0',
      assessmentTimestamp: new Date().toISOString(),
      provenance: {
        source: 'demo-heatwave-model',
        sourceType: 'model',
        confidence: 60,
        timestamp: new Date().toISOString(), lastUpdated: new Date().toISOString(), quality: 'estimated',
        
      }
    };
  }
}

