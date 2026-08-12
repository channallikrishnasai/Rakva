import type { HazardAssessmentInput, HazardAssessment } from '@/core/contracts';

/**
 * Interface for all pluggable hazard models in the system.
 */
export interface HazardModel {
  /**
   * Unique identifier matching a HazardDefinition ID (e.g., 'flood', 'landslide')
   */
  readonly id: string;

  /**
   * Version of this specific model implementation
   */
  readonly version: string;

  /**
   * Evaluates the hazard susceptibility and current signal for a specific location.
   */
  assess(input: HazardAssessmentInput): Promise<HazardAssessment>;
}

