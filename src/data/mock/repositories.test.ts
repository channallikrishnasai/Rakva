import { expect, test, describe } from 'vitest';
import { MockAssetRepository } from './repositories';

describe('MockAssetRepository', () => {
  const repo = new MockAssetRepository();

  test('should fetch all assets', async () => {
    const assets = await repo.getAllAssets();
    expect(assets.length).toBeGreaterThan(0);
    expect(assets[0]).toHaveProperty('id');
    expect(assets[0]).toHaveProperty('location');
  });

  test('should fetch asset by id', async () => {
    const asset = await repo.getAssetById('BRIDGE-024');
    expect(asset).toBeDefined();
    expect(asset?.id).toBe('BRIDGE-024');
    expect(asset?.type).toBe('bridge');
  });

  test('should return null for unknown id', async () => {
    const asset = await repo.getAssetById('UNKNOWN-123');
    expect(asset).toBeNull();
  });
});
