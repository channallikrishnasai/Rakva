import type { 
  HazardAssessment, 
  EnvironmentalObservation,
  GeographicContextData,
  TemporalContext,
  HistoricalHazardContext,
  HazardAssessmentInput
} from '@/core/contracts';
import type { HazardModel } from './HazardModel';
import type { HazardOrchestrator } from './HazardOrchestrator';

export class HazardOrchestratorImpl implements HazardOrchestrator {
  private models: Map<string, HazardModel> = new Map();

  registerModel(model: HazardModel): void {
    if (this.models.has(model.id)) {
      console.warn(`Hazard model for ${model.id} is already registered. Overwriting.`);
    }
    this.models.set(model.id, model);
  }

  async assessHazard(
    hazardId: string,
    regionId: string,
    location: GeographicContextData,
    environmentalConditions: EnvironmentalObservation[],
    staticContext: GeographicContextData,
    temporalContext: TemporalContext,
    historicalContext?: HistoricalHazardContext,
    inputOverrides?: Record<string, number>
  ): Promise<HazardAssessment> {
    const model = this.models.get(hazardId);
    if (!model) {
      return this.createUnsupportedAssessment(hazardId, regionId, 'Model not registered');
    }

    const input: HazardAssessmentInput = {
      hazardId,
      regionId,
      resolution: location.region.level,
      location,
      environmentalConditions,
      staticContext,
      temporalContext,
      historicalContext,
      inputOverrides
    };

    try {
      return await model.assess(input);
    } catch (error) {
      console.error(`Error evaluating hazard ${hazardId} for region ${regionId}:`, error);
      return this.createUnsupportedAssessment(hazardId, regionId, 'Evaluation error');
    }
  }

  async assessAllHazards(
    regionId: string,
    location: GeographicContextData,
    environmentalConditions: EnvironmentalObservation[],
    staticContext: GeographicContextData,
    temporalContext: TemporalContext,
    historicalContext?: HistoricalHazardContext
  ): Promise<HazardAssessment[]> {
    const assessments: Promise<HazardAssessment>[] = [];
    
    for (const [hazardId, _] of this.models.entries()) {
      assessments.push(this.assessHazard(
        hazardId,
        regionId,
        location,
        environmentalConditions,
        staticContext,
        temporalContext,
        historicalContext
      ));
    }

    return Promise.all(assessments);
  }

  private createUnsupportedAssessment(
    hazardId: string, 
    regionId: string, 
    reason: string
  ): HazardAssessment {
    return {
      hazardId,
      regionId,
      resolution: 'unknown',
      status: 'unsupported-geographic-context',
      confidence: 0,
      dataCompleteness: 0,
      contributingFactors: [],
      riskReducingFactors: [],
      contextualFactors: [],
      limitations: [reason],
      keyMissingInputs: [],
      modelId: 'none',
      modelVersion: '0',
      configurationVersion: '0',
      assessmentTimestamp: new Date().toISOString(),
      provenance: {
        source: 'system',
        sourceType: 'model',
        confidence: 0,
        timestamp: new Date().toISOString(), lastUpdated: new Date().toISOString(), quality: 'estimated',
        
      }
    };
  }
}

// Singleton for easy access
export const hazardOrchestrator = new HazardOrchestratorImpl();

