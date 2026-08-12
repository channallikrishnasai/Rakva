import { describe, it, expect } from 'vitest';
import { EvidenceSourceRegistry, evidenceSourceRegistry } from '../source-registry';

describe('EvidenceSourceRegistry', () => {
  it('should return all sources', () => {
    const sources = evidenceSourceRegistry.getAllSources();
    expect(sources.length).toBeGreaterThan(0);
  });

  it('should get source by id', () => {
    const source = evidenceSourceRegistry.getSource('satellite-1');
    expect(source).toBeDefined();
    expect(source?.name).toBe('Sentinel-2 Satellite');
  });

  it('should return undefined for unknown source', () => {
    const source = evidenceSourceRegistry.getSource('unknown');
    expect(source).toBeUndefined();
  });

  it('should filter sources by type', () => {
    const satelliteSources = evidenceSourceRegistry.getSourcesByType('satellite_image');
    expect(satelliteSources.length).toBeGreaterThan(0);
    expect(satelliteSources.every(s => s.type === 'satellite_image')).toBe(true);
  });

  it('should filter active sources', () => {
    const activeSources = evidenceSourceRegistry.getActiveSources();
    expect(activeSources.length).toBeGreaterThan(0);
    expect(activeSources.every(s => s.status === 'active')).toBe(true);
  });

  it('should calculate source weight', () => {
    const weight = evidenceSourceRegistry.getSourceWeight('satellite-1');
    expect(weight).toBeGreaterThan(0);
    expect(weight).toBeLessThanOrEqual(1);
  });

  it('should return 0 weight for unknown source', () => {
    const weight = evidenceSourceRegistry.getSourceWeight('unknown');
    expect(weight).toBe(0);
  });

  it('should update source status', () => {
    const source = evidenceSourceRegistry.getSource('satellite-1');
    const originalStatus = source?.status;
    
    evidenceSourceRegistry.updateSourceStatus('satellite-1', 'degraded');
    const updated = evidenceSourceRegistry.getSource('satellite-1');
    expect(updated?.status).toBe('degraded');
    
    evidenceSourceRegistry.updateSourceStatus('satellite-1', originalStatus!);
  });
});
