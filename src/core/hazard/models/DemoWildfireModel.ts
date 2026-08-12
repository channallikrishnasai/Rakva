import type { 
  HazardAssessment, 
  HazardAssessmentInput, 
  HazardFactor,
  HazardCategory
} from '@/core/contracts';
import type { HazardModel } from '../HazardModel';

export class DemoWildfireModel implements HazardModel {
  readonly id = 'wildfire';
  readonly version = '1.0.0-demo';

  async assess(input: HazardAssessmentInput): Promise<HazardAssessment> {
    const { location, environmentalConditions } = input;
    
    const factors: HazardFactor[] = [];
    const riskReducing: HazardFactor[] = [];
    let missingInputs: string[] = [];

    let susceptibility = 30; // Base
    let signal = 0;

    // Evaluate Static Context
    if (location.vegetation !== undefined) {
      if (location.vegetation === 'dense_forest' || location.vegetation === 'dry_scrub') {
        susceptibility += 40;
        factors.push({ id: 'high-fuel', label: 'High Fuel Load', contribution: 'positive', explanation: 'Dense or dry vegetation provides abundant fuel' });
      } else if (location.vegetation === 'urban' || location.vegetation === 'sparse') {
        susceptibility -= 15;
        riskReducing.push({ id: 'low-fuel', label: 'Low Fuel Load', contribution: 'negative', explanation: 'Sparse vegetation limits fire spread' });
      }
    } else {
      missingInputs.push('vegetation');
    }

    if (location.dryness !== undefined && location.dryness > 70) {
      susceptibility += 20;
      factors.push({ id: 'arid-environment', label: 'Arid Environment', contribution: 'positive', explanation: 'Region is historically prone to dry conditions' });
    }

    // Evaluate Dynamic Environmental Conditions
    let temp = environmentalConditions.find(c => c.variable === 'temperature')?.value;
    let humidity = environmentalConditions.find(c => c.variable === 'humidity')?.value;
    let wind = environmentalConditions.find(c => c.variable === 'wind-speed')?.value;

    if (temp !== undefined && temp !== null) {
      if (temp > 40) {
        signal += 40;
        factors.push({ id: 'extreme-heat', label: 'Extreme Heat', value: temp, unit: '°C', contribution: 'positive', explanation: 'Temperatures are critically high' });
      } else if (temp > 35) {
        signal += 20;
        factors.push({ id: 'high-heat', label: 'High Heat', value: temp, unit: '°C', contribution: 'positive', explanation: 'Elevated temperatures increase ignition risk' });
      }
    } else {
      missingInputs.push('temperature');
    }

    if (humidity !== undefined && humidity !== null) {
      if (humidity < 20) {
        signal += 30;
        factors.push({ id: 'very-low-humidity', label: 'Very Low Humidity', value: humidity, unit: '%', contribution: 'positive', explanation: 'Extremely dry air dries out fuel rapidly' });
      } else if (humidity > 60) {
        riskReducing.push({ id: 'high-humidity', label: 'High Humidity', value: humidity, unit: '%', contribution: 'negative', explanation: 'Moist air reduces ignition risk' });
      }
    } else {
      missingInputs.push('humidity');
    }

    if (wind !== undefined && wind !== null) {
      if (wind > 40) {
        signal += 30;
        factors.push({ id: 'high-wind', label: 'High Winds', value: wind, unit: 'km/h', contribution: 'positive', explanation: 'Winds can rapidly spread fire' });
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
    if (missingInputs.includes('temperature')) confidence -= 30;
    if (missingInputs.includes('humidity')) confidence -= 20;

    const status = missingInputs.includes('temperature') && missingInputs.includes('humidity') ? 'insufficient-data' : 'assessed';
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
      limitations: ['Deterministic demo model'],
      keyMissingInputs: missingInputs,
      modelId: 'demo-wildfire-v1',
      modelVersion: this.version,
      configurationVersion: '1.0',
      assessmentTimestamp: new Date().toISOString(),
      provenance: {
        source: 'demo-wildfire-model',
        sourceType: 'model',
        confidence: 60,
        timestamp: new Date().toISOString(), lastUpdated: new Date().toISOString(), quality: 'estimated',
      }
    };
  }
}
