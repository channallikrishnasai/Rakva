import { describe, it, expect } from 'vitest';
import { fuseEvidence } from '../fusion-engine';
import { EvidenceIntelligence } from '@/core/contracts';

const mockEvidence: EvidenceIntelligence[] = [
  {
    id: 'EV-TEST-1',
    sourceId: 'satellite-1',
    type: 'satellite_image',
    status: 'verified',
    description: 'Test satellite evidence',
    location: [23.81, 90.41],
    regionId: 'test-region',
    assetId: 'ASSET-001',
    timestamp: new Date().toISOString(),
    confidence: 'high',
    confidenceScore: 85,
    quality: 'verified',
    provenance: {
      source: 'Test',
      sourceType: 'satellite',
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      confidence: 85,
      quality: 'verified',
    },
    tags: ['test'],
  },
  {
    id: 'EV-TEST-2',
    sourceId: 'drone-1',
    type: 'drone_footage',
    status: 'verified',
    description: 'Test drone evidence',
    location: [23.81, 90.41],
    regionId: 'test-region',
    assetId: 'ASSET-001',
    timestamp: new Date().toISOString(),
    confidence: 'very-high',
    confidenceScore: 92,
    quality: 'verified',
    provenance: {
      source: 'Test',
      sourceType: 'satellite',
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      confidence: 92,
      quality: 'verified',
    },
    tags: ['test'],
  },
];

describe('fuseEvidence', () => {
  it('should fuse evidence items correctly', () => {
    const result = fuseEvidence({
      evidenceItems: mockEvidence,
      temporalDecayHours: 48,
    });

    expect(result).toBeDefined();
    expect(result.evidenceCount).toBe(2);
    expect(result.verifiedCount).toBe(2);
    expect(result.conflictCount).toBe(0);
    expect(result.sources.length).toBe(2);
    expect(result.fusedConfidenceScore).toBeGreaterThan(0);
    expect(result.fusedConfidenceScore).toBeLessThanOrEqual(100);
    expect(result.breakdown.length).toBe(2);
  });

  it('should filter by minimum confidence', () => {
    const result = fuseEvidence({
      evidenceItems: mockEvidence,
      minimumConfidence: 90,
    });

    expect(result.evidenceCount).toBe(1);
    expect(result.breakdown.length).toBe(1);
  });

  it('should detect conflicts', () => {
    const conflictingEvidence: EvidenceIntelligence[] = [
      {
        ...mockEvidence[0],
        id: 'EV-CONFLICT-1',
        description: 'Bridge is flooded and impassable',
      },
      {
        ...mockEvidence[1],
        id: 'EV-CONFLICT-2',
        description: 'Bridge is passable and normal',
      },
    ];

    const result = fuseEvidence({
      evidenceItems: conflictingEvidence,
    });

    expect(result.conflictFlags.length).toBeGreaterThan(0);
  });

  it('should handle empty evidence', () => {
    const result = fuseEvidence({
      evidenceItems: [],
    });

    expect(result.evidenceCount).toBe(0);
    expect(result.fusedConfidenceScore).toBe(0);
  });

  it('should apply temporal decay', () => {
    const oldEvidence: EvidenceIntelligence[] = [
      {
        ...mockEvidence[0],
        timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), // 3 days old
      },
    ];

    const result = fuseEvidence({
      evidenceItems: oldEvidence,
      temporalDecayHours: 48,
    });

    expect(result.fusedConfidenceScore).toBeLessThan(85);
  });
});
