import { describe, it, expect } from 'vitest';
import { EvidenceRepository, evidenceRepository } from '../evidence-repository';

describe('EvidenceRepository', () => {
  it('should return all evidence', async () => {
    const evidence = await evidenceRepository.getAllEvidence();
    expect(evidence.length).toBeGreaterThan(0);
  });

  it('should get evidence by id', async () => {
    const evidence = await evidenceRepository.getEvidenceById('EV-001');
    expect(evidence).toBeDefined();
    expect(evidence?.id).toBe('EV-001');
  });

  it('should return null for unknown id', async () => {
    const evidence = await evidenceRepository.getEvidenceById('UNKNOWN');
    expect(evidence).toBeNull();
  });

  it('should get evidence by asset', async () => {
    const evidence = await evidenceRepository.getEvidenceByAsset('BRIDGE-024');
    expect(evidence.length).toBeGreaterThan(0);
    expect(evidence.every(e => e.assetId === 'BRIDGE-024')).toBe(true);
  });

  it('should get evidence by region', async () => {
    const evidence = await evidenceRepository.getEvidenceByRegion('eastern-district');
    expect(evidence.length).toBeGreaterThan(0);
    expect(evidence.every(e => e.regionId === 'eastern-district')).toBe(true);
  });

  it('should filter evidence by type', async () => {
    const evidence = await evidenceRepository.getFilteredEvidence({
      types: ['satellite_image'],
    });
    expect(evidence.length).toBeGreaterThan(0);
    expect(evidence.every(e => e.type === 'satellite_image')).toBe(true);
  });

  it('should filter evidence by status', async () => {
    const evidence = await evidenceRepository.getFilteredEvidence({
      statuses: ['verified'],
    });
    expect(evidence.length).toBeGreaterThan(0);
    expect(evidence.every(e => e.status === 'verified')).toBe(true);
  });

  it('should filter evidence by search query', async () => {
    const evidence = await evidenceRepository.getFilteredEvidence({
      searchQuery: 'bridge',
    });
    expect(evidence.length).toBeGreaterThan(0);
    expect(evidence.some(e => e.description.toLowerCase().includes('bridge'))).toBe(true);
  });

  it('should save and retrieve fusion result', async () => {
    const mockResult = {
      id: 'fusion-test',
      targetId: 'ASSET-001',
      targetType: 'asset' as const,
      fusedConfidence: 'high' as const,
      fusedConfidenceScore: 80,
      evidenceCount: 2,
      verifiedCount: 2,
      conflictCount: 0,
      sources: ['satellite-1', 'drone-1'],
      summary: 'Test fusion',
      breakdown: [],
      conflictFlags: [],
      fusedAt: new Date().toISOString(),
      modelVersion: '1.0.0',
    };

    await evidenceRepository.saveFusionResult(mockResult);
    const retrieved = await evidenceRepository.getFusionResult('ASSET-001');
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe('fusion-test');
  });
});
