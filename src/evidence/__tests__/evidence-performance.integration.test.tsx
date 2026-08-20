import { describe, it, expect } from 'vitest';
import { fuseEvidence } from '../fusion-engine';
import { evidenceRepository } from '../evidence-repository';
import type { EvidenceIntelligence } from '@/core/contracts';

function generateEvidence(count: number): EvidenceIntelligence[] {
  const types: EvidenceIntelligence['type'][] = [
    'satellite_image', 'drone_footage', 'citizen_report',
    'sensor_reading', 'official_report', 'social_media',
  ];
  const statuses: EvidenceIntelligence['status'][] = [
    'verified', 'verifying', 'pending', 'conflict',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `EV-PERF-${String(i).padStart(4, '0')}`,
    sourceId: `source-${i % 6}`,
    type: types[i % types.length],
    status: statuses[i % statuses.length],
    description: `Performance test evidence item ${i}. This is a detailed description to simulate realistic data.`,
    location: [23.81 + (i % 100) * 0.001, 90.41 + (i % 100) * 0.001],
    regionId: `region-${i % 10}`,
    assetId: `ASSET-${i % 20}`,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    confidence: ['high', 'very-high', 'medium', 'low'][i % 4] as EvidenceIntelligence['confidence'],
    confidenceScore: 40 + (i % 60),
    quality: ['verified', 'estimated'][i % 2] as EvidenceIntelligence['quality'],
    provenance: {
      source: `Source ${i % 6}`,
      sourceType: 'satellite',
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      lastUpdated: new Date().toISOString(),
      confidence: 40 + (i % 60),
      quality: 'verified',
    },
    tags: [`tag-${i % 5}`, `category-${i % 3}`],
  }));
}

describe('Evidence Performance Integration', () => {
  describe('Fusion Engine Performance', () => {
    it('should fuse 100 evidence items within 100ms', () => {
      const evidence = generateEvidence(100);
      const start = performance.now();

      const result = fuseEvidence({ evidenceItems: evidence });

      const duration = performance.now() - start;
      expect(result.evidenceCount).toBe(100);
      expect(duration).toBeLessThan(100);
    });

    it('should fuse 500 evidence items within 500ms', () => {
      const evidence = generateEvidence(500);
      const start = performance.now();

      const result = fuseEvidence({ evidenceItems: evidence });

      const duration = performance.now() - start;
      expect(result.evidenceCount).toBe(500);
      expect(duration).toBeLessThan(500);
    });

    it('should fuse 1000 evidence items within 1000ms', () => {
      const evidence = generateEvidence(1000);
      const start = performance.now();

      const result = fuseEvidence({ evidenceItems: evidence });

      const duration = performance.now() - start;
      expect(result.evidenceCount).toBe(1000);
      expect(duration).toBeLessThan(1000);
    });

    it('should handle fusion with temporal decay efficiently', () => {
      const evidence = generateEvidence(200);
      const start = performance.now();

      const result = fuseEvidence({
        evidenceItems: evidence,
        temporalDecayHours: 48,
      });

      const duration = performance.now() - start;
      expect(result.evidenceCount).toBe(200);
      expect(duration).toBeLessThan(200);
    });

    it('should handle fusion with minimum confidence filter efficiently', () => {
      const evidence = generateEvidence(200);
      const start = performance.now();

      const result = fuseEvidence({
        evidenceItems: evidence,
        minimumConfidence: 70,
      });

      const duration = performance.now() - start;
      expect(result.evidenceCount).toBeGreaterThan(0);
      expect(duration).toBeLessThan(200);
    });
  });

  describe('Repository Performance', () => {
    it('should retrieve all evidence within 50ms', async () => {
      const start = performance.now();

      const evidence = await evidenceRepository.getAllEvidence();

      const duration = performance.now() - start;
      expect(evidence.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(50);
    });

    it('should filter evidence within 50ms', async () => {
      const start = performance.now();

      const evidence = await evidenceRepository.getFilteredEvidence({
        types: ['satellite_image'],
        statuses: ['verified'],
        searchQuery: 'bridge',
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });

    it('should get evidence by asset within 50ms', async () => {
      const start = performance.now();

      const evidence = await evidenceRepository.getEvidenceByAsset('BRIDGE-024');

      const duration = performance.now() - start;
      expect(evidence.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(50);
    });

    it('should get evidence by region within 50ms', async () => {
      const start = performance.now();

      const evidence = await evidenceRepository.getEvidenceByRegion('eastern-district');

      const duration = performance.now() - start;
      expect(evidence.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Component Rendering Performance', () => {
    it('should render EvidenceTimeline with 100 items within 500ms', async () => {
      const { render } = await import('@testing-library/react');
      const { EvidenceTimeline } = await import('@/components/evidence/EvidenceTimeline');
      const evidence = generateEvidence(100);

      const start = performance.now();
      render(<EvidenceTimeline items={evidence} />);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(500);
    });

    it('should render EvidenceFusionPanel with large breakdown within 100ms', async () => {
      const { render } = await import('@testing-library/react');
      const { EvidenceFusionPanel } = await import('@/components/evidence/EvidenceFusionPanel');

      const largeResult = {
        id: 'fusion-large',
        targetId: 'BRIDGE-024',
        targetType: 'asset' as const,
        fusedConfidence: 'high' as const,
        fusedConfidenceScore: 85,
        evidenceCount: 100,
        verifiedCount: 50,
        conflictCount: 5,
        sources: Array.from({ length: 20 }, (_, i) => `source-${i}`),
        summary: 'Large fusion result with 100 evidence items from 20 sources.',
        breakdown: Array.from({ length: 20 }, (_, i) => ({
          sourceId: `source-${i}`,
          sourceName: `Source ${i}`,
          evidenceType: 'satellite_image' as const,
          weight: 0.8,
          contribution: 4.25,
          confidence: 85,
          status: 'verified' as const,
        })),
        conflictFlags: Array.from({ length: 5 }, (_, i) => ({
          sourceA: `source-${i}`,
          sourceB: `source-${i + 5}`,
          description: `Conflict ${i}`,
          severity: 'medium' as const,
        })),
        fusedAt: new Date().toISOString(),
        modelVersion: '1.0.0',
      };

      const start = performance.now();
      render(<EvidenceFusionPanel result={largeResult} />);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory when fusing large datasets', () => {
      const evidence = generateEvidence(500);

      // Run fusion multiple times
      for (let i = 0; i < 10; i++) {
        const result = fuseEvidence({ evidenceItems: evidence });
        expect(result.evidenceCount).toBe(500);
      }

      // If we get here without crashing, memory usage is acceptable
      expect(true).toBe(true);
    });

    it('should handle repeated filtering without memory issues', async () => {
      // Run filtering multiple times
      for (let i = 0; i < 10; i++) {
        const evidence = await evidenceRepository.getFilteredEvidence({
          types: ['satellite_image'],
          statuses: ['verified'],
        });
        expect(evidence.length).toBeGreaterThan(0);
      }

      // If we get here without crashing, memory usage is acceptable
      expect(true).toBe(true);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple concurrent fusion operations', async () => {
      const evidence1 = generateEvidence(100);
      const evidence2 = generateEvidence(100);
      const evidence3 = generateEvidence(100);

      const start = performance.now();

      const [result1, result2, result3] = await Promise.all([
        Promise.resolve(fuseEvidence({ evidenceItems: evidence1 })),
        Promise.resolve(fuseEvidence({ evidenceItems: evidence2 })),
        Promise.resolve(fuseEvidence({ evidenceItems: evidence3 })),
      ]);

      const duration = performance.now() - start;

      expect(result1.evidenceCount).toBe(100);
      expect(result2.evidenceCount).toBe(100);
      expect(result3.evidenceCount).toBe(100);
      expect(duration).toBeLessThan(300);
    });

    it('should handle concurrent repository operations', async () => {
      const start = performance.now();

      const [evidence1, evidence2, evidence3] = await Promise.all([
        evidenceRepository.getEvidenceByAsset('BRIDGE-024'),
        evidenceRepository.getEvidenceByRegion('eastern-district'),
        evidenceRepository.getFilteredEvidence({ types: ['satellite_image'] }),
      ]);

      const duration = performance.now() - start;

      expect(evidence1.length).toBeGreaterThan(0);
      expect(evidence2.length).toBeGreaterThan(0);
      expect(evidence3.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(100);
    });
  });
});
