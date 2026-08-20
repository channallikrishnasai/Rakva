import { describe, it, expect, beforeEach } from 'vitest';
import { evidenceRepository } from '../evidence-repository';
import { evidenceSourceRegistry } from '../source-registry';
import { fuseEvidence } from '../fusion-engine';
import type { EvidenceIntelligence, EvidenceFusionInput } from '@/core/contracts';

describe('Evidence Intelligence Workflow Integration', () => {
  let testEvidence: EvidenceIntelligence[];

  beforeEach(async () => {
    // Get fresh evidence for each test
    testEvidence = await evidenceRepository.getAllEvidence();
  });

  describe('Evidence Lifecycle', () => {
    it('should retrieve evidence from repository', () => {
      expect(testEvidence.length).toBeGreaterThan(0);
      expect(testEvidence[0]).toHaveProperty('id');
      expect(testEvidence[0]).toHaveProperty('sourceId');
      expect(testEvidence[0]).toHaveProperty('type');
    });

    it('should get evidence by asset ID', async () => {
      const assetEvidence = await evidenceRepository.getEvidenceByAsset('BRIDGE-024');
      expect(assetEvidence.length).toBeGreaterThan(0);
      expect(assetEvidence.every(e => e.assetId === 'BRIDGE-024')).toBe(true);
    });

    it('should get evidence by region', async () => {
      const regionEvidence = await evidenceRepository.getEvidenceByRegion('eastern-district');
      expect(regionEvidence.length).toBeGreaterThan(0);
      expect(regionEvidence.every(e => e.regionId === 'eastern-district')).toBe(true);
    });
  });

  describe('Source Registry Integration', () => {
    it('should verify all evidence sources are registered', () => {
      const sources = evidenceSourceRegistry.getAllSources();
      expect(sources.length).toBeGreaterThan(0);

      // Verify each evidence item has a valid source
      testEvidence.forEach(evidence => {
        const source = evidenceSourceRegistry.getSource(evidence.sourceId);
        expect(source).toBeDefined();
      });
    });

    it('should calculate source weights for evidence', () => {
      testEvidence.forEach(evidence => {
        const weight = evidenceSourceRegistry.getSourceWeight(evidence.sourceId);
        expect(weight).toBeGreaterThan(0);
        expect(weight).toBeLessThanOrEqual(1);
      });
    });

    it('should filter active sources', () => {
      const activeSources = evidenceSourceRegistry.getActiveSources();
      expect(activeSources.length).toBeGreaterThan(0);
      expect(activeSources.every(s => s.status === 'active')).toBe(true);
    });
  });

  describe('Evidence Fusion Workflow', () => {
    it('should fuse evidence from multiple sources', () => {
      const fusionInput: EvidenceFusionInput = {
        evidenceItems: testEvidence,
        temporalDecayHours: 48,
      };

      const result = fuseEvidence(fusionInput);

      expect(result).toBeDefined();
      expect(result.evidenceCount).toBe(testEvidence.length);
      expect(result.fusedConfidenceScore).toBeGreaterThan(0);
      expect(result.fusedConfidenceScore).toBeLessThanOrEqual(100);
      expect(result.breakdown.length).toBeGreaterThan(0);
    });

    it('should detect conflicts between evidence items', () => {
      const conflictingEvidence: EvidenceIntelligence[] = [
        {
          id: 'EV-CONFLICT-1',
          sourceId: 'satellite-1',
          type: 'satellite_image',
          status: 'verified',
          description: 'Bridge is flooded and impassable',
          location: [23.81, 90.41],
          regionId: 'test-region',
          assetId: 'CONFLICT-ASSET',
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
          id: 'EV-CONFLICT-2',
          sourceId: 'drone-1',
          type: 'drone_footage',
          status: 'verified',
          description: 'Bridge is passable and normal',
          location: [23.81, 90.41],
          regionId: 'test-region',
          assetId: 'CONFLICT-ASSET',
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
      ];

      const result = fuseEvidence({ evidenceItems: conflictingEvidence });

      expect(result.conflictFlags.length).toBeGreaterThan(0);
    });

    it('should handle temporal decay correctly', () => {
      const oldEvidence: EvidenceIntelligence[] = [
        {
          ...testEvidence[0],
          timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), // 3 days old
        },
      ];

      const recentEvidence: EvidenceIntelligence[] = [
        {
          ...testEvidence[0],
          timestamp: new Date().toISOString(), // Now
        },
      ];

      const oldResult = fuseEvidence({ evidenceItems: oldEvidence, temporalDecayHours: 48 });
      const recentResult = fuseEvidence({ evidenceItems: recentEvidence, temporalDecayHours: 48 });

      expect(oldResult.fusedConfidenceScore).toBeLessThan(recentResult.fusedConfidenceScore);
    });

    it('should filter by minimum confidence', () => {
      const highConfidenceEvidence = testEvidence.filter(e => e.confidenceScore >= 85);
      
      const result = fuseEvidence({
        evidenceItems: testEvidence,
        minimumConfidence: 85,
      });

      expect(result.evidenceCount).toBe(highConfidenceEvidence.length);
    });

    it('should handle empty evidence gracefully', () => {
      const result = fuseEvidence({ evidenceItems: [] });

      expect(result.evidenceCount).toBe(0);
      expect(result.fusedConfidenceScore).toBe(0);
      expect(result.breakdown.length).toBe(0);
      expect(result.conflictFlags.length).toBe(0);
    });
  });

  describe('Evidence Filtering Integration', () => {
    it('should filter evidence by type', async () => {
      const satelliteEvidence = await evidenceRepository.getFilteredEvidence({
        types: ['satellite_image'],
      });

      expect(satelliteEvidence.length).toBeGreaterThan(0);
      expect(satelliteEvidence.every(e => e.type === 'satellite_image')).toBe(true);
    });

    it('should filter evidence by status', async () => {
      const verifiedEvidence = await evidenceRepository.getFilteredEvidence({
        statuses: ['verified'],
      });

      expect(verifiedEvidence.length).toBeGreaterThan(0);
      expect(verifiedEvidence.every(e => e.status === 'verified')).toBe(true);
    });

    it('should filter evidence by search query', async () => {
      const bridgeEvidence = await evidenceRepository.getFilteredEvidence({
        searchQuery: 'bridge',
      });

      expect(bridgeEvidence.length).toBeGreaterThan(0);
      expect(bridgeEvidence.some(e => 
        e.description.toLowerCase().includes('bridge')
      )).toBe(true);
    });

    it('should combine multiple filters', async () => {
      const filteredEvidence = await evidenceRepository.getFilteredEvidence({
        types: ['satellite_image'],
        statuses: ['verified'],
        searchQuery: 'flood',
      });

      expect(filteredEvidence.length).toBeGreaterThan(0);
      expect(filteredEvidence.every(e => 
        e.type === 'satellite_image' && 
        e.status === 'verified' &&
        e.description.toLowerCase().includes('flood')
      )).toBe(true);
    });
  });

  describe('Fusion Result Storage', () => {
    it('should save and retrieve fusion results', async () => {
      const fusionResult = fuseEvidence({ evidenceItems: testEvidence });
      
      const fusionResultWithId = {
        ...fusionResult,
        id: `fusion-integration-${Date.now()}`,
        targetId: 'BRIDGE-024',
        targetType: 'asset' as const,
        fusedAt: new Date().toISOString(),
        modelVersion: '1.0.0',
      };

      await evidenceRepository.saveFusionResult(fusionResultWithId);
      const retrieved = await evidenceRepository.getFusionResult('BRIDGE-024');

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(fusionResultWithId.id);
      expect(retrieved?.evidenceCount).toBe(fusionResult.evidenceCount);
    });
  });

  describe('Complete Workflow Scenario', () => {
    it('should execute end-to-end evidence processing workflow', async () => {
      // Step 1: Get evidence from repository
      const evidence = await evidenceRepository.getEvidenceByAsset('BRIDGE-024');
      expect(evidence.length).toBeGreaterThan(0);

      // Step 2: Verify sources are active
      evidence.forEach(e => {
        const source = evidenceSourceRegistry.getSource(e.sourceId);
        expect(source?.status).toBe('active');
      });

      // Step 3: Fuse evidence
      const fusionResult = fuseEvidence({ evidenceItems: evidence });
      expect(fusionResult.evidenceCount).toBe(evidence.length);
      expect(fusionResult.fusedConfidenceScore).toBeGreaterThan(0);

      // Step 4: Store fusion result
      const fusionResultWithId = {
        ...fusionResult,
        id: `workflow-test-${Date.now()}`,
        targetId: 'BRIDGE-024',
        targetType: 'asset' as const,
        fusedAt: new Date().toISOString(),
        modelVersion: '1.0.0',
      };

      await evidenceRepository.saveFusionResult(fusionResultWithId);

      // Step 5: Retrieve and verify
      const stored = await evidenceRepository.getFusionResult('BRIDGE-024');
      expect(stored).toBeDefined();
      expect(stored?.evidenceCount).toBe(fusionResult.evidenceCount);
    });
  });
});
