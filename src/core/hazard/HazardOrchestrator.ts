import type { 
  HazardAssessment, 
  EnvironmentalObservation,
  GeographicContextData,
  TemporalContext,
  HistoricalHazardContext
} from '@/core/contracts';

/**
 * Interface for the centralized Hazard Orchestrator.
 * Responsible for routing assessments to specific models and handling batch assessments.
 */
export interface HazardOrchestrator {
  /**
   * Registers a new hazard model.
   */
  registerModel(model: import('./HazardModel').HazardModel): void;

  /**
   * Assesses a specific hazard for a specific location.
   */
  assessHazard(
    hazardId: string,
    regionId: string,
    location: GeographicContextData,
    environmentalConditions: EnvironmentalObservation[],
    staticContext: GeographicContextData,
    temporalContext: TemporalContext,
    historicalContext?: HistoricalHazardContext,
    inputOverrides?: Record<string, number>
  ): Promise<HazardAssessment>;

  /**
   * Assesses all applicable hazards for a specific location.
   */
  assessAllHazards(
    regionId: string,
    location: GeographicContextData,
    environmentalConditions: EnvironmentalObservation[],
    staticContext: GeographicContextData,
    temporalContext: TemporalContext,
    historicalContext?: HistoricalHazardContext
  ): Promise<HazardAssessment[]>;
}

