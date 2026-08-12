import type { 
  HazardAssessment, 
  HazardAssessmentInput, 
  HazardFactor,
  HazardCategory
} from '@/core/contracts';
import type { HazardModel } from '../HazardModel';

export class DemoFloodModel implements HazardModel {
  readonly id = 'flood';
  readonly version = '1.0.0-demo';

  async assess(input: HazardAssessmentInput): Promise<HazardAssessment> {
    const { location, environmentalConditions } = input;
    
    const factors: HazardFactor[] = [];
    const riskReducing: HazardFactor[] = [];
    let missingInputs: string[] = [];

    let susceptibility = 50; // Base 50
    let signal = 0;

    // Evaluate Static Context (Susceptibility)
    if (location.elevation !== undefined) {
      if (location.elevation < 50) {
        susceptibility += 20;
        factors.push({ id: 'elev-low', label: 'Low Elevation', contribution: 'positive', explanation: 'Low elevation increases flood pooling risk' });
      } else if (location.elevation > 500) {
        susceptibility -= 20;
        riskReducing.push({ id: 'elev-high', label: 'High Elevation', contribution: 'negative', explanation: 'High elevation promotes natural drainage' });
      }
    } else {
      missingInputs.push('elevation');
    }

    if (location.slope !== undefined) {
      if (location.slope < 5) {
        susceptibility += 10;
        factors.push({ id: 'slope-flat', label: 'Flat Terrain', contribution: 'positive', explanation: 'Flat terrain reduces natural water runoff rate' });
      } else if (location.slope > 15) {
        susceptibility -= 15;
        riskReducing.push({ id: 'slope-steep', label: 'Steep Slope', contribution: 'negative', explanation: 'Steep terrain prevents surface water accumulation' });
      }
    } else {
      missingInputs.push('slope');
    }

    if (location.floodplainStatus === 'yes') {
      susceptibility += 30;
      factors.push({ id: 'floodplain', label: 'Floodplain Exposure', contribution: 'positive', explanation: 'Location is inside a known active floodplain' });
    } else if (location.floodplainStatus === 'no') {
      susceptibility -= 20;
      riskReducing.push({ id: 'no-floodplain', label: 'Outside Floodplain', contribution: 'negative', explanation: 'Location is geographically isolated from historical river flooding' });
    } else {
      missingInputs.push('floodplainStatus');
    }
    
    if (location.drainageCapacity !== undefined) {
      if (location.drainageCapacity < 40) {
        susceptibility += 10;
        factors.push({ id: 'drainage-poor', label: 'Poor Drainage', contribution: 'positive', explanation: 'Low drainage capacity increases surface flooding' });
      } else if (location.drainageCapacity > 80) {
        susceptibility -= 10;
        riskReducing.push({ id: 'drainage-good', label: 'Strong Drainage', contribution: 'negative', explanation: 'High drainage capacity rapidly removes excess surface water' });
      }
    } else {
      missingInputs.push('drainageCapacity');
    }

    // Evaluate Dynamic Environmental Conditions (Hazard Signal)
    let rainfall = environmentalConditions.find(c => c.variable === 'rainfall')?.value;
    let riverLevel = environmentalConditions.find(c => c.variable === 'river-level' || c.variable === 'water-level')?.value; // fallback just in case
    let soilMoisture = environmentalConditions.find(c => c.variable === 'soil-moisture')?.value;

    if (rainfall !== undefined && rainfall !== null) {
      if (rainfall > 100) {
        signal += 60;
        factors.push({ id: 'rainfall-extreme', label: 'Extreme Rainfall', value: rainfall, unit: 'mm', contribution: 'positive', explanation: 'Current precipitation is at extreme levels' });
      } else if (rainfall > 50) {
        signal += 30;
        factors.push({ id: 'rainfall-high', label: 'High Rainfall', value: rainfall, unit: 'mm', contribution: 'positive', explanation: 'Elevated precipitation' });
      } else {
        signal += 10;
      }
    } else {
      missingInputs.push('rainfall');
    }

    if (riverLevel !== undefined && riverLevel !== null) {
      if (riverLevel > 8) {
        signal += 30;
        factors.push({ id: 'river-extreme', label: 'Critical River Level', value: riverLevel, unit: 'm', contribution: 'positive', explanation: 'Nearby rivers are exceeding flood stage' });
      } else if (riverLevel > 5) {
        signal += 15;
        factors.push({ id: 'river-high', label: 'High River Level', value: riverLevel, unit: 'm', contribution: 'positive', explanation: 'River levels are elevated' });
      }
    } else {
      missingInputs.push('river-level');
    }

    if (soilMoisture !== undefined && soilMoisture !== null) {
      if (soilMoisture > 80) {
        signal += 10;
        factors.push({ id: 'soil-sat', label: 'Saturated Soil', value: soilMoisture, unit: '%', contribution: 'positive', explanation: 'Soil is saturated, maximizing surface runoff' });
      }
    }

    susceptibility = Math.max(0, Math.min(100, susceptibility));
    signal = Math.max(0, Math.min(100, signal));

    // Combine them: a high signal only causes high risk if susceptibility is at least moderate,
    // OR if signal is incredibly extreme, it can overcome low susceptibility.
    // This is the core logic proving separation.
    let overallRisk = (signal * 0.6) + (susceptibility * 0.4);
    
    // If susceptibility is very low, even high rain might just pool briefly
    if (susceptibility < 30 && signal > 80) {
      factors.push({ id: 'context-buffer', label: 'Geographic Buffer', contribution: 'negative', explanation: 'Current environmental conditions are extreme, but local geographic susceptibility reduces the likelihood of significant flooding.' });
      overallRisk = Math.min(overallRisk, 40); // Cap risk if susceptibility is low
    }

    let category: HazardCategory = 'very-low';
    if (overallRisk > 80) category = 'critical';
    else if (overallRisk > 60) category = 'high';
    else if (overallRisk > 40) category = 'moderate';
    else if (overallRisk > 20) category = 'low';

    // Confidence drops if missing key inputs
    let confidence = 95;
    if (missingInputs.includes('elevation')) confidence -= 10;
    if (missingInputs.includes('rainfall')) confidence -= 30;
    if (missingInputs.includes('floodplainStatus')) confidence -= 20;

    const dataCompleteness = Math.max(0, 100 - (missingInputs.length * 15));
    const status = (missingInputs.includes('rainfall') || missingInputs.includes('elevation')) ? 'insufficient-data' : 'assessed';

    return {
      hazardId: this.id,
      regionId: input.regionId,
      resolution: input.resolution,
      susceptibilityScore: susceptibility,
      hazardSignalScore: signal,
      category: category,
      status: status,
      confidence: Math.max(0, confidence),
      dataCompleteness: dataCompleteness,
      contributingFactors: factors.filter(f => f.contribution === 'positive'),
      riskReducingFactors: riskReducing.concat(factors.filter(f => f.contribution === 'negative')),
      contextualFactors: factors.filter(f => f.contribution === 'neutral'),
      limitations: ['Deterministic demo model, not calibrated for real prediction'],
      keyMissingInputs: missingInputs,
      modelId: 'demo-flood-v1',
      modelVersion: this.version,
      configurationVersion: '1.0',
      assessmentTimestamp: new Date().toISOString(),
      provenance: {
        source: 'demo-flood-model',
        sourceType: 'model',
        confidence: 60,
        timestamp: new Date().toISOString(), lastUpdated: new Date().toISOString(), quality: 'estimated',
        
      }
    };
  }
}

