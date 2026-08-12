import { EvidenceIntelligence, EvidenceFilter, EvidenceFusionResult } from '@/core/contracts';

const mockEvidence: EvidenceIntelligence[] = [
  {
    id: 'EV-001',
    sourceId: 'satellite-1',
    type: 'satellite_image',
    status: 'verified',
    description: 'Sentinel-2 imagery shows significant flooding in eastern district. Water extent has increased 35% in 24 hours.',
    location: [23.8103, 90.4125],
    regionId: 'eastern-district',
    assetId: 'BRIDGE-024',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    capturedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    url: '/evidence/satellite-flood-001.jpg',
    confidence: 'high',
    confidenceScore: 85,
    quality: 'verified',
    provenance: {
      source: 'Sentinel-2',
      sourceType: 'satellite',
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      lastUpdated: new Date(Date.now() - 2 * 3600000).toISOString(),
      spatialResolution: '10m',
      confidence: 85,
      quality: 'verified',
    },
    tags: ['flooding', 'water-extent', 'infrastructure'],
  },
  {
    id: 'EV-002',
    sourceId: 'drone-1',
    type: 'drone_footage',
    status: 'verified',
    description: 'Close-range inspection reveals moderate structural damage to bridge support pillars. Two pillars show exposed rebar.',
    location: [23.8105, 90.4128],
    regionId: 'eastern-district',
    assetId: 'BRIDGE-024',
    timestamp: new Date(Date.now() - 1.5 * 3600000).toISOString(),
    capturedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    url: '/evidence/drone-bridge-001.mp4',
    thumbnailUrl: '/evidence/drone-bridge-001-thumb.jpg',
    confidence: 'very-high',
    confidenceScore: 92,
    quality: 'verified',
    provenance: {
      source: 'DJI Matrice',
      sourceType: 'satellite',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      lastUpdated: new Date(Date.now() - 1.5 * 3600000).toISOString(),
      spatialResolution: '0.1m',
      confidence: 92,
      quality: 'verified',
    },
    tags: ['structural-damage', 'bridge', 'pillars'],
  },
  {
    id: 'EV-003',
    sourceId: 'citizen-1',
    type: 'citizen_report',
    status: 'verified',
    description: 'Multiple residents report bridge is partially passable but shakes under heavy vehicles. Debris visible on approach.',
    location: [23.8100, 90.4120],
    regionId: 'eastern-district',
    assetId: 'BRIDGE-024',
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
    confidence: 'medium',
    confidenceScore: 70,
    quality: 'estimated',
    provenance: {
      source: 'Citizen Network',
      sourceType: 'citizen',
      timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
      lastUpdated: new Date(Date.now() - 1 * 3600000).toISOString(),
      confidence: 70,
      quality: 'estimated',
    },
    tags: ['accessibility', 'bridge', 'debris'],
  },
  {
    id: 'EV-004',
    sourceId: 'sensor-1',
    type: 'sensor_reading',
    status: 'verified',
    description: 'Water level sensor at bridge approach reads 4.2m (above flood stage of 3.5m). Rising trend detected.',
    location: [23.8102, 90.4124],
    regionId: 'eastern-district',
    assetId: 'BRIDGE-024',
    timestamp: new Date(Date.now() - 0.5 * 3600000).toISOString(),
    confidence: 'high',
    confidenceScore: 88,
    quality: 'verified',
    provenance: {
      source: 'IoT Sensor',
      sourceType: 'sensor',
      timestamp: new Date(Date.now() - 0.5 * 3600000).toISOString(),
      lastUpdated: new Date(Date.now() - 0.5 * 3600000).toISOString(),
      confidence: 88,
      quality: 'verified',
    },
    tags: ['water-level', 'flooding', 'real-time'],
  },
  {
    id: 'EV-005',
    sourceId: 'official-1',
    type: 'official_report',
    status: 'verified',
    description: 'NDMA Situation Report #47: Bridge classified as high priority for assessment. Emergency vehicle access restricted.',
    location: [23.8103, 90.4125],
    regionId: 'eastern-district',
    assetId: 'BRIDGE-024',
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
    confidence: 'high',
    confidenceScore: 90,
    quality: 'verified',
    provenance: {
      source: 'NDMA',
      sourceType: 'official',
      timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
      lastUpdated: new Date(Date.now() - 6 * 3600000).toISOString(),
      confidence: 90,
      quality: 'verified',
    },
    tags: ['official', 'priority', 'access-restriction'],
  },
  {
    id: 'EV-006',
    sourceId: 'social-1',
    type: 'social_media',
    status: 'verifying',
    description: 'Social media posts indicate bridge approach road flooded. Some posts show water level higher than official reports.',
    location: [23.8101, 90.4122],
    regionId: 'eastern-district',
    assetId: 'BRIDGE-024',
    timestamp: new Date(Date.now() - 0.25 * 3600000).toISOString(),
    confidence: 'low',
    confidenceScore: 45,
    quality: 'raw',
    provenance: {
      source: 'Twitter/X',
      sourceType: 'hybrid',
      timestamp: new Date(Date.now() - 0.25 * 3600000).toISOString(),
      lastUpdated: new Date(Date.now() - 0.25 * 3600000).toISOString(),
      confidence: 45,
      quality: 'raw',
    },
    tags: ['social-media', 'flooding', 'unverified'],
  },
  {
    id: 'EV-007',
    sourceId: 'drone-1',
    type: 'drone_footage',
    status: 'verified',
    description: 'Drone survey of road network shows main arterial road partially submerged. Two sections underwater.',
    location: [23.8200, 90.4200],
    regionId: 'eastern-district',
    assetId: 'ROAD-017',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    capturedAt: new Date(Date.now() - 3.5 * 3600000).toISOString(),
    url: '/evidence/drone-road-001.mp4',
    thumbnailUrl: '/evidence/drone-road-001-thumb.jpg',
    confidence: 'very-high',
    confidenceScore: 94,
    quality: 'verified',
    provenance: {
      source: 'DJI Matrice',
      sourceType: 'satellite',
      timestamp: new Date(Date.now() - 3.5 * 3600000).toISOString(),
      lastUpdated: new Date(Date.now() - 3 * 3600000).toISOString(),
      spatialResolution: '0.1m',
      confidence: 94,
      quality: 'verified',
    },
    tags: ['road', 'flooding', 'infrastructure'],
  },
  {
    id: 'EV-008',
    sourceId: 'sensor-1',
    type: 'sensor_reading',
    status: 'conflict',
    description: 'Road moisture sensor reads normal levels at checkpoint A but elevated at checkpoint B (0.5km apart). Sensor malfunction suspected.',
    location: [23.8205, 90.4205],
    regionId: 'eastern-district',
    assetId: 'ROAD-017',
    timestamp: new Date(Date.now() - 0.75 * 3600000).toISOString(),
    confidence: 'low',
    confidenceScore: 40,
    quality: 'suspect',
    provenance: {
      source: 'IoT Sensor',
      sourceType: 'sensor',
      timestamp: new Date(Date.now() - 0.75 * 3600000).toISOString(),
      lastUpdated: new Date(Date.now() - 0.75 * 3600000).toISOString(),
      confidence: 40,
      quality: 'suspect',
    },
    tags: ['sensor-error', 'conflicting-data', 'road'],
  },
];

export class EvidenceRepository {
  private evidence: Map<string, EvidenceIntelligence> = new Map();
  private fusionResults: Map<string, EvidenceFusionResult> = new Map();

  constructor() {
    mockEvidence.forEach(e => this.evidence.set(e.id, e));
  }

  async getEvidenceById(id: string): Promise<EvidenceIntelligence | null> {
    return this.evidence.get(id) || null;
  }

  async getEvidenceByAsset(assetId: string): Promise<EvidenceIntelligence[]> {
    return Array.from(this.evidence.values()).filter(e => e.assetId === assetId);
  }

  async getEvidenceByRegion(regionId: string): Promise<EvidenceIntelligence[]> {
    return Array.from(this.evidence.values()).filter(e => e.regionId === regionId);
  }

  async getAllEvidence(): Promise<EvidenceIntelligence[]> {
    return Array.from(this.evidence.values());
  }

  async getFilteredEvidence(filter: EvidenceFilter): Promise<EvidenceIntelligence[]> {
    let results = Array.from(this.evidence.values());

    if (filter.types && filter.types.length > 0) {
      results = results.filter(e => filter.types!.includes(e.type));
    }
    if (filter.statuses && filter.statuses.length > 0) {
      results = results.filter(e => filter.statuses!.includes(e.status));
    }
    if (filter.confidence && filter.confidence.length > 0) {
      results = results.filter(e => filter.confidence!.includes(e.confidence));
    }
    if (filter.regionId) {
      results = results.filter(e => e.regionId === filter.regionId);
    }
    if (filter.assetId) {
      results = results.filter(e => e.assetId === filter.assetId);
    }
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      results = results.filter(e =>
        e.description.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filter.dateRange) {
      const from = new Date(filter.dateRange.from).getTime();
      const to = new Date(filter.dateRange.to).getTime();
      results = results.filter(e => {
        const t = new Date(e.timestamp).getTime();
        return t >= from && t <= to;
      });
    }

    return results;
  }

  async getFusionResult(targetId: string): Promise<EvidenceFusionResult | null> {
    return this.fusionResults.get(targetId) || null;
  }

  async saveFusionResult(result: EvidenceFusionResult): Promise<void> {
    this.fusionResults.set(result.targetId, result);
  }
}

export const evidenceRepository = new EvidenceRepository();
