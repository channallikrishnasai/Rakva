import { SeverityLevel, ConfidenceLevel } from '../core/contracts';

export const RiskRanges = {
  LOW: [0, 20],
  MODERATE: [21, 40],
  HIGH: [41, 60],
  SEVERE: [61, 80],
  CRITICAL: [81, 100],
};

export const PriorityThresholds = {
  LOW: 40,
  MEDIUM: 60,
  HIGH: 80,
  CRITICAL: 90,
};

export const MapLayerLegends = {
  rainfall: {
    unit: 'mm',
    dataType: 'numeric',
    thresholds: [20, 50, 100, 200],
    colors: ['#3b82f6', '#2563eb', '#1d4ed8', '#1e3a8a', '#172554'],
  },
  risk: {
    unit: 'score',
    dataType: 'numeric',
    thresholds: [20, 40, 60, 80],
    colors: ['#22c55e', '#eab308', '#f97316', '#ef4444', '#7f1d1d'],
  }
};
