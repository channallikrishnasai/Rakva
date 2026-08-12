import type { 
  HazardAssessment, 
  HazardAssessmentInput, 
  HazardFactor,
  HazardCategory
} from '@/core/contracts';
import type { HazardModel } from '../HazardModel';

export class DemoLandslideModel implements HazardModel {
  readonly id = 'landslide';
  readonly version = '1.0.0-demo';

  async assess(input: HazardAssessmentInput): Promise<HazardAssessment> {
    const { location, environmentalConditions } = input;
    
    const factors: HazardFactor[] = [];
    const riskReducing: HazardFactor[] = [];
    let missingInputs: string[] = [];

    let susceptibility = 20; // Base 20 for landslide
    let signal = 0;

    // Evaluate Static Context (Susceptibility)
    if (location.slope !== undefined) {
      if (location.slope > 25) {
        susceptibility += 40;
        factors.push({ id: 'slope-extreme', label: 'Extreme Slope', contribution: 'positive', explanation: 'Steep incline dramatically increases landslide potential' });
      } else if (location.slope > 15) {
        susceptibility += 20;
        factors.push({ id: 'slope-steep', label: 'Steep Slope', contribution: 'positive', explanation: 'Moderate incline contributes to susceptibility' });
      } else if (location.slope < 5) {
        susceptibility -= 10;
        riskReducing.push({ id: 'slope-flat', label: 'Flat Terrain', contribution: 'negative', explanation: 'Flat terrain practically eliminates landslide risk' });
      }
    } else {
      missingInputs.push('slope');
    }

    if (location.soilStability !== undefined) {
      if (location.soilStability < 40) {
        susceptibility += 20;
        factors.push({ id: 'soil-unstable', label: 'Unstable Soil', contribution: 'positive', explanation: 'Loose or friable soil structure' });
      }
    } else {
      missingInputs.push('soilStability');
    }

    // Evaluate Dynamic Environmental Conditions (Hazard Signal)
    let rainfall = environmentalConditions.find(c => c.variable === 'rainfall')?.value;
    let soilMoisture = environmentalConditions.find(c => c.variable === 'soil-moisture')?.value;

    if (rainfall !== undefined && rainfall !== null) {
      if (rainfall > 80) {
        signal += 50;
        factors.push({ id: 'rainfall-extreme', label: 'Extreme Rainfall', value: rainfall, unit: 'mm', contribution: 'positive', explanation: 'Heavy precipitation acts as a primary trigger' });
      } else if (rainfall > 30) {
        signal += 20;
        factors.push({ id: 'rainfall-high', label: 'High Rainfall', value: rainfall, unit: 'mm', contribution: 'positive', explanation: 'Elevated precipitation' });
      }
    } else {
      missingInputs.push('rainfall');
    }

    if (soilMoisture !== undefined && soilMoisture !== null) {
      if (soilMoisture > 85) {
        signal += 30;
        factors.push({ id: 'soil-sat', label: 'Saturated Soil', value: soilMoisture, unit: '%', contribution: 'positive', explanation: 'Complete soil saturation reduces shear strength' });
      }
    } else {
      missingInputs.push('soil-moisture');
    }

    susceptibility = Math.max(0, Math.min(100, susceptibility));
    signal = Math.max(0, Math.min(100, signal));

    let overallRisk = (signal * 0.7) + (susceptibility * 0.3);
    
    // Landslides generally don't happen on flat ground no matter how much it rains
    if (susceptibility < 15) {
      factors.push({ id: 'context-buffer', label: 'Geographic Buffer', contribution: 'negative', explanation: 'Flat terrain prevents landslides despite environmental conditions' });
      overallRisk = Math.min(overallRisk, 10); 
    }

    let category: HazardCategory = 'very-low';
    if (overallRisk > 80) category = 'critical';
    else if (overallRisk > 60) category = 'high';
    else if (overallRisk > 40) category = 'moderate';
    else if (overallRisk > 20) category = 'low';

    let confidence = 95;
    if (missingInputs.includes('slope')) confidence -= 30;
    if (missingInputs.includes('rainfall')) confidence -= 30;

    const status = (missingInputs.includes('rainfall') || missingInputs.includes('slope')) ? 'insufficient-data' : 'assessed';
    const dataCompleteness = Math.max(0, 100 - (missingInputs.length * 15));

    return {
      hazardId: this.id,
      regionId: input.regionId,
      resolution: input.resolution,
      susceptibilityScore: susceptibility,
      hazardSignalScore: signal,
      category: category,
      status: status,
      confidence: Math.max(0, confidence),
      dataCompleteness,
      contributingFactors: factors.filter(f => f.contribution === 'positive'),
      riskReducingFactors: riskReducing.concat(factors.filter(f => f.contribution === 'negative')),
      contextualFactors: factors.filter(f => f.contribution === 'neutral'),
      limitations: ['Deterministic demo model'],
      keyMissingInputs: missingInputs,
      modelId: 'demo-landslide-v1',
      modelVersion: this.version,
      configurationVersion: '1.0',
      assessmentTimestamp: new Date().toISOString(),
      provenance: {
        source: 'demo-landslide-model',
        sourceType: 'model',
        confidence: 60,
        timestamp: new Date().toISOString(), lastUpdated: new Date().toISOString(), quality: 'estimated',
        
      }
    };
  }
}

