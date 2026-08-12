import type { 
  HazardAssessment, 
  HazardAssessmentInput, 
  HazardFactor,
  HazardCategory
} from '@/core/contracts';
import type { HazardModel } from '../HazardModel';

export class DemoDroughtModel implements HazardModel {
  readonly id = 'drought';
  readonly version = '1.0.0-demo';

  async assess(input: HazardAssessmentInput): Promise<HazardAssessment> {
    const { location, environmentalConditions } = input;
    
    const factors: HazardFactor[] = [];
    const riskReducing: HazardFactor[] = [];
    let missingInputs: string[] = [];

    let susceptibility = 30; // Base
    let signal = 0;

    // Evaluate Static Context
    if (location.dryness !== undefined) {
      if (location.dryness > 70) {
        susceptibility += 30;
        factors.push({ id: 'high-aridity', label: 'High Aridity', contribution: 'positive', explanation: 'Region is historically arid' });
      } else if (location.dryness < 30) {
        susceptibility -= 20;
        riskReducing.push({ id: 'low-aridity', label: 'Low Aridity', contribution: 'negative', explanation: 'Region has naturally low aridity' });
      }
    }

    if (location.vegetation !== undefined) {
      if (location.vegetation === 'sparse') {
        susceptibility += 20;
        factors.push({ id: 'sparse-veg', label: 'Sparse Vegetation', contribution: 'positive', explanation: 'Lack of vegetation reduces water retention' });
      }
    }

    // Evaluate Dynamic Environmental Conditions
    let moisture = environmentalConditions.find(c => c.variable === 'soil-moisture')?.value;
    let temp = environmentalConditions.find(c => c.variable === 'temperature')?.value;
    let rainfall = environmentalConditions.find(c => c.variable === 'rainfall')?.value;

    if (moisture !== undefined && moisture !== null) {
      if (moisture < 20) {
        signal += 50;
        factors.push({ id: 'low-soil-moisture', label: 'Critical Soil Moisture', value: moisture, unit: '%', contribution: 'positive', explanation: 'Soil is critically dry' });
      } else if (moisture < 40) {
        signal += 20;
        factors.push({ id: 'moderate-soil-moisture', label: 'Low Soil Moisture', value: moisture, unit: '%', contribution: 'positive', explanation: 'Soil moisture is depleted' });
      } else if (moisture > 60) {
        riskReducing.push({ id: 'good-soil-moisture', label: 'Healthy Soil Moisture', value: moisture, unit: '%', contribution: 'negative', explanation: 'Sufficient soil moisture' });
      }
    } else {
      missingInputs.push('soil-moisture');
    }

    if (rainfall !== undefined && rainfall !== null) {
      if (rainfall < 10) {
        signal += 30;
        factors.push({ id: 'low-rainfall', label: 'Low Rainfall', value: rainfall, unit: 'mm', contribution: 'positive', explanation: 'Significant rainfall deficit' });
      }
    } else {
      missingInputs.push('rainfall');
    }

    if (temp !== undefined && temp !== null && temp > 35) {
      signal += 20;
      factors.push({ id: 'high-evapotranspiration', label: 'High Temperature', value: temp, unit: '°C', contribution: 'positive', explanation: 'High temperatures accelerate evaporation' });
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
    if (missingInputs.includes('soil-moisture')) confidence -= 30;
    if (missingInputs.includes('rainfall')) confidence -= 20;

    const status = missingInputs.includes('soil-moisture') && missingInputs.includes('rainfall') ? 'insufficient-data' : 'assessed';
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
      limitations: ['Deterministic demo model', 'Requires temporal analysis for accurate drought definition'],
      keyMissingInputs: missingInputs,
      modelId: 'demo-drought-v1',
      modelVersion: this.version,
      configurationVersion: '1.0',
      assessmentTimestamp: new Date().toISOString(),
      provenance: {
        source: 'demo-drought-model',
        sourceType: 'model',
        confidence: 60,
        timestamp: new Date().toISOString(), lastUpdated: new Date().toISOString(), quality: 'estimated',
      }
    };
  }
}
