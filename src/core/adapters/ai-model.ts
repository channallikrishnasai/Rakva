export interface AIModelAdapter<Input, Output> {
  id: string;
  version: string;
  description: string;
  capabilities: string[];
  predict(input: Input): Promise<Output>;
}

export interface GeospatialModelInput {
  regionId: string;
  layers: string[];
  timestamp: string;
}

export interface GeospatialModelOutput {
  predictions: any[];
  confidenceMap: any;
}

export interface DamageDetectionInput {
  evidenceIds: string[];
}

export interface DamageDetectionOutput {
  assetId: string;
  estimatedDamageSeverity: string;
  confidence: number;
}
