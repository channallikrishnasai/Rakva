import {
  EvidenceIntelligence,
  EvidenceFusionInput,
  EvidenceFusionResult,
  EvidenceBreakdownItem,
  EvidenceConflictFlag,
  EvidenceConfidence,
  EvidenceStatus,
} from '@/core/contracts';
import { evidenceSourceRegistry } from './source-registry';

function computeConfidenceLabel(score: number): EvidenceConfidence {
  if (score >= 85) return 'very-high';
  if (score >= 65) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function computeTemporalWeight(timestamp: string, decayHours: number): number {
  const ageMs = Date.now() - new Date(timestamp).getTime();
  const ageHours = ageMs / (1000 * 60 * 60);
  if (decayHours <= 0) return 1;
  return Math.max(0, 1 - ageHours / decayHours);
}

function getStatusWeight(status: EvidenceStatus): number {
  switch (status) {
    case 'verified': return 1.0;
    case 'verifying': return 0.7;
    case 'pending': return 0.5;
    case 'conflict': return 0.3;
    case 'rejected': return 0;
    case 'superseded': return 0.1;
    default: return 0.5;
  }
}

function detectConflicts(items: EvidenceIntelligence[]): EvidenceConflictFlag[] {
  const conflicts: EvidenceConflictFlag[] = [];
  const byAsset = new Map<string, EvidenceIntelligence[]>();

  items.forEach(item => {
    if (item.assetId) {
      const existing = byAsset.get(item.assetId) || [];
      existing.push(item);
      byAsset.set(item.assetId, existing);
    }
  });

  byAsset.forEach((assetItems, assetId) => {
    const descriptions = assetItems.map(i => i.description.toLowerCase());
    const hasFlooding = descriptions.some(d => d.includes('flood') || d.includes('water'));
    const hasStructural = descriptions.some(d => d.includes('structural') || d.includes('damage'));
    const hasNormal = descriptions.some(d => d.includes('normal') || d.includes('passable'));

    if (hasFlooding && hasNormal) {
      conflicts.push({
        sourceA: assetItems.find(i => i.description.toLowerCase().includes('flood'))?.sourceId || 'unknown',
        sourceB: assetItems.find(i => i.description.toLowerCase().includes('normal'))?.sourceId || 'unknown',
        description: 'Conflicting reports about flooding conditions',
        severity: 'high',
      });
    }

    const statusConflicts = assetItems.filter(i => i.status === 'conflict');
    if (statusConflicts.length > 0) {
      statusConflicts.forEach(item => {
        conflicts.push({
          sourceA: item.sourceId,
          sourceB: 'other',
          description: `Sensor reported conflicting data: ${item.description.substring(0, 80)}...`,
          severity: 'medium',
        });
      });
    }
  });

  return conflicts;
}

export function fuseEvidence(input: EvidenceFusionInput): EvidenceFusionResult {
  const {
    evidenceItems,
    sourceWeights = {},
    temporalDecayHours = 48,
    minimumConfidence = 0,
  } = input;

  const filteredItems = evidenceItems.filter(item => {
    if (minimumConfidence > 0 && item.confidenceScore < minimumConfidence) return false;
    return true;
  });

  const breakdown: EvidenceBreakdownItem[] = [];
  let totalWeightedScore = 0;
  let totalWeight = 0;
  let verifiedCount = 0;
  let conflictCount = 0;
  const sources = new Set<string>();

  filteredItems.forEach(item => {
    const sourceWeight = sourceWeights[item.sourceId] ?? evidenceSourceRegistry.getSourceWeight(item.sourceId);
    const temporalWeight = computeTemporalWeight(item.timestamp, temporalDecayHours);
    const statusWeight = getStatusWeight(item.status);

    const contribution = item.confidenceScore * sourceWeight * temporalWeight * statusWeight;
    totalWeightedScore += contribution;
    totalWeight += sourceWeight * temporalWeight;

    breakdown.push({
      sourceId: item.sourceId,
      sourceName: evidenceSourceRegistry.getSource(item.sourceId)?.name || item.sourceId,
      evidenceType: item.type,
      weight: sourceWeight,
      contribution,
      confidence: item.confidenceScore,
      status: item.status,
    });

    if (item.status === 'verified') verifiedCount++;
    if (item.status === 'conflict') conflictCount++;
    sources.add(item.sourceId);
  });

  const fusedScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
  const conflicts = detectConflicts(filteredItems);

  const highConfItems = filteredItems.filter(i => i.confidenceScore >= 70);
  const summaryParts: string[] = [];
  summaryParts.push(`${filteredItems.length} evidence items from ${sources.size} sources.`);
  summaryParts.push(`${verifiedCount} verified, ${conflictCount} flagged for conflict.`);
  if (highConfItems.length > 0) {
    summaryParts.push(`High-confidence sources: ${highConfItems.map(i => evidenceSourceRegistry.getSource(i.sourceId)?.name || i.sourceId).join(', ')}.`);
  }
  if (conflicts.length > 0) {
    summaryParts.push(`${conflicts.length} conflict(s) detected requiring review.`);
  }

  return {
    id: `fusion-${Date.now()}`,
    targetId: filteredItems[0]?.assetId || filteredItems[0]?.regionId || 'unknown',
    targetType: filteredItems[0]?.assetId ? 'asset' : 'region',
    fusedConfidence: computeConfidenceLabel(fusedScore),
    fusedConfidenceScore: fusedScore,
    evidenceCount: filteredItems.length,
    verifiedCount,
    conflictCount,
    sources: Array.from(sources),
    summary: summaryParts.join(' '),
    breakdown,
    conflictFlags: conflicts,
    fusedAt: new Date().toISOString(),
    modelVersion: '1.0.0',
  };
}
