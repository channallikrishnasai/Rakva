import { describe, it, expect } from 'vitest';
import { fuseEvidence } from '../fusion-engine';
import { evidenceSourceRegistry } from '../source-registry';
import { evidenceRepository } from '../evidence-repository';
import type { EvidenceIntelligence, EvidenceFusionInput } from '@/core/contracts';

describe('Evidence Error Handling Integration', () => {
  describe('Graceful Degradation', () => {
    it('should handle empty evidence array', () => {
      const result = fuseEvidence({ evidenceItems: [] });

      expect(result.evidenceCount).toBe(0);
      expect(result.fusedConfidenceScore).toBe(0);
      expect(result.breakdown).toEqual([]);
      expect(result.conflictFlags).toEqual([]);
      expect(result.sources).toEqual([]);
    });

    it('should handle evidence with missing optional fields', () => {
      const incompleteEvidence: EvidenceIntelligence[] = [
        {
          id: 'EV-INCOMPLETE',
          sourceId: 'satellite-1',
          type: 'citizen_report',
          status: 'pending',
          description: 'Incomplete evidence item',
          location: [0, 0],
          regionId: 'unknown',
          timestamp: new Date().toISOString(),
          confidence: 'low',
          confidenceScore: 30,
          quality: 'estimated',
          provenance: {
            source: 'Unknown',
            sourceType: 'citizen',
            timestamp: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            confidence: 30,
            quality: 'estimated',
          },
          tags: [],
        },
      ];

      const result = fuseEvidence({ evidenceItems: incompleteEvidence });

      expect(result.evidenceCount).toBe(1);
      expect(result.fusedConfidenceScore).toBeGreaterThanOrEqual(0);
    });

    it('should handle evidence with zero confidence score', () => {
      const zeroConfidenceEvidence: EvidenceIntelligence[] = [
        {
          id: 'EV-ZERO',
          sourceId: 'satellite-1',
          type: 'satellite_image',
          status: 'verified',
          description: 'Zero confidence evidence',
          location: [23.81, 90.41],
          regionId: 'test-region',
          assetId: 'TEST-ASSET',
          timestamp: new Date().toISOString(),
          confidence: 'low',
          confidenceScore: 0,
          quality: 'estimated',
          provenance: {
            source: 'Test',
            sourceType: 'satellite',
            timestamp: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            confidence: 0,
            quality: 'estimated',
          },
          tags: [],
        },
      ];

      const result = fuseEvidence({ evidenceItems: zeroConfidenceEvidence });

      expect(result.evidenceCount).toBe(1);
      expect(result.fusedConfidenceScore).toBe(0);
    });

    it('should handle evidence with maximum confidence score', () => {
      const maxConfidenceEvidence: EvidenceIntelligence[] = [
        {
          id: 'EV-MAX',
          sourceId: 'satellite-1',
          type: 'satellite_image',
          status: 'verified',
          description: 'Maximum confidence evidence',
          location: [23.81, 90.41],
          regionId: 'test-region',
          assetId: 'TEST-ASSET',
          timestamp: new Date().toISOString(),
          confidence: 'very-high',
          confidenceScore: 100,
          quality: 'verified',
          provenance: {
            source: 'Test',
            sourceType: 'satellite',
            timestamp: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            confidence: 100,
            quality: 'verified',
          },
          tags: [],
        },
      ];

      const result = fuseEvidence({ evidenceItems: maxConfidenceEvidence });

      expect(result.evidenceCount).toBe(1);
      expect(result.fusedConfidenceScore).toBe(100);
    });
  });

  describe('Invalid Data Handling', () => {
    it('should handle evidence with invalid timestamp', () => {
      const invalidTimestampEvidence: EvidenceIntelligence[] = [
        {
          id: 'EV-INVALID-TS',
          sourceId: 'satellite-1',
          type: 'satellite_image',
          status: 'verified',
          description: 'Evidence with invalid timestamp',
          location: [23.81, 90.41],
          regionId: 'test-region',
          assetId: 'TEST-ASSET',
          timestamp: 'invalid-date',
          confidence: 'high',
          confidenceScore: 85,
          quality: 'verified',
          provenance: {
            source: 'Test',
            sourceType: 'satellite',
            timestamp: 'invalid-date',
            lastUpdated: 'invalid-date',
            confidence: 85,
            quality: 'verified',
          },
          tags: [],
        },
      ];

      // Should not throw an error
      const result = fuseEvidence({ evidenceItems: invalidTimestampEvidence });
      expect(result.evidenceCount).toBe(1);
    });

    it('should handle evidence with undefined assetId', () => {
      const noAssetEvidence: EvidenceIntelligence[] = [
        {
          id: 'EV-NO-ASSET',
          sourceId: 'satellite-1',
          type: 'satellite_image',
          status: 'verified',
          description: 'Evidence without assetId',
          location: [23.81, 90.41],
          regionId: 'test-region',
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
          tags: [],
        },
      ];

      const result = fuseEvidence({ evidenceItems: noAssetEvidence });

      expect(result.evidenceCount).toBe(1);
      expect(result.targetType).toBe('region');
    });
  });

  describe('Source Registry Error Handling', () => {
    it('should return 0 weight for unknown source', () => {
      const weight = evidenceSourceRegistry.getSourceWeight('unknown-source-id');
      expect(weight).toBe(0);
    });

    it('should return undefined for unknown source', () => {
      const source = evidenceSourceRegistry.getSource('unknown-source-id');
      expect(source).toBeUndefined();
    });

    it('should handle empty source type filter', () => {
      const sources = evidenceSourceRegistry.getSourcesByType('unknown_type' as any);
      expect(sources).toEqual([]);
    });
  });

  describe('Repository Error Handling', () => {
    it('should return null for unknown evidence ID', async () => {
      const evidence = await evidenceRepository.getEvidenceById('UNKNOWN-ID');
      expect(evidence).toBeNull();
    });

    it('should return empty array for unknown asset ID', async () => {
      const evidence = await evidenceRepository.getEvidenceByAsset('UNKNOWN-ASSET');
      expect(evidence).toEqual([]);
    });

    it('should return empty array for unknown region ID', async () => {
      const evidence = await evidenceRepository.getEvidenceByRegion('UNKNOWN-REGION');
      expect(evidence).toEqual([]);
    });

    it('should handle filter with no matches', async () => {
      const evidence = await evidenceRepository.getFilteredEvidence({
        searchQuery: 'nonexistent-evidence-query',
      });
      expect(evidence).toEqual([]);
    });
  });

  describe('Fusion Edge Cases', () => {
    it('should handle minimum confidence filter that excludes all items', () => {
      const evidence: EvidenceIntelligence[] = [
        {
          id: 'EV-LOW',
          sourceId: 'satellite-1',
          type: 'satellite_image',
          status: 'verified',
          description: 'Low confidence evidence',
          location: [23.81, 90.41],
          regionId: 'test-region',
          timestamp: new Date().toISOString(),
          confidence: 'low',
          confidenceScore: 30,
          quality: 'estimated',
          provenance: {
            source: 'Test',
            sourceType: 'satellite',
            timestamp: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            confidence: 30,
            quality: 'estimated',
          },
          tags: [],
        },
      ];

      const result = fuseEvidence({
        evidenceItems: evidence,
        minimumConfidence: 50,
      });

      expect(result.evidenceCount).toBe(0);
      expect(result.fusedConfidenceScore).toBe(0);
    });

    it('should handle temporal decay with negative decay hours', () => {
      const evidence: EvidenceIntelligence[] = [
        {
          id: 'EV-DECAY',
          sourceId: 'satellite-1',
          type: 'satellite_image',
          status: 'verified',
          description: 'Evidence for decay test',
          location: [23.81, 90.41],
          regionId: 'test-region',
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
          tags: [],
        },
      ];

      // Negative decay should not cause errors
      const result = fuseEvidence({
        evidenceItems: evidence,
        temporalDecayHours: -1,
      });

      expect(result.evidenceCount).toBe(1);
    });

    it('should handle evidence with rejected status', () => {
      const rejectedEvidence: EvidenceIntelligence[] = [
        {
          id: 'EV-REJECTED',
          sourceId: 'satellite-1',
          type: 'satellite_image',
          status: 'rejected',
          description: 'Rejected evidence',
          location: [23.81, 90.41],
          regionId: 'test-region',
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
          tags: [],
        },
      ];

      const result = fuseEvidence({ evidenceItems: rejectedEvidence });

      expect(result.evidenceCount).toBe(1);
      // Rejected evidence should have 0 status weight, so contribution is 0
      expect(result.breakdown[0].contribution).toBe(0);
    });

    it('should handle evidence with superseded status', () => {
      const supersededEvidence: EvidenceIntelligence[] = [
        {
          id: 'EV-SUPERSEDED',
          sourceId: 'satellite-1',
          type: 'satellite_image',
          status: 'superseded',
          description: 'Superseded evidence',
          location: [23.81, 90.41],
          regionId: 'test-region',
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
          tags: [],
        },
      ];

      const result = fuseEvidence({ evidenceItems: supersededEvidence });

      expect(result.evidenceCount).toBe(1);
      // Superseded evidence should have 0.1 status weight
      expect(result.breakdown[0].contribution).toBeGreaterThan(0);
      expect(result.breakdown[0].contribution).toBeLessThan(85);
    });
  });

  describe('Component Error Handling', () => {
    it('should render EvidenceTimeline with empty items', async () => {
      const { render, screen } = await import('@testing-library/react');
      const { EvidenceTimeline } = await import('@/components/evidence/EvidenceTimeline');

      render(<EvidenceTimeline items={[]} />);
      expect(screen.getByText(/no evidence items found/i)).toBeInTheDocument();
    });

    it('should render EvidenceFusionPanel with zero counts', async () => {
      const { render, screen } = await import('@testing-library/react');
      const { EvidenceFusionPanel } = await import('@/components/evidence/EvidenceFusionPanel');

      const emptyResult = {
        id: 'fusion-empty',
        targetId: 'unknown',
        targetType: 'region' as const,
        fusedConfidence: 'low' as const,
        fusedConfidenceScore: 0,
        evidenceCount: 0,
        verifiedCount: 0,
        conflictCount: 0,
        sources: [],
        summary: 'No evidence available',
        breakdown: [],
        conflictFlags: [],
        fusedAt: new Date().toISOString(),
        modelVersion: '1.0.0',
      };

      render(<EvidenceFusionPanel result={emptyResult} />);
      expect(screen.getAllByText('0').length).toBeGreaterThan(0);
      expect(screen.getByText(/no evidence available/i)).toBeInTheDocument();
    });

    it('should render EvidenceDetailsDrawer with null evidence', async () => {
      const { render } = await import('@testing-library/react');
      const { EvidenceDetailsDrawer } = await import('@/components/evidence/EvidenceDetailsDrawer');

      const { container } = render(<EvidenceDetailsDrawer evidence={null} onClose={() => {}} />);
      expect(container.firstChild).toBeNull();
    });
  });
});
