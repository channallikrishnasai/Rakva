import { EvidenceSource, EvidenceType } from '@/core/contracts';

const evidenceSources: EvidenceSource[] = [
  {
    id: 'satellite-1',
    name: 'Sentinel-2 Satellite',
    type: 'satellite_image',
    provider: 'European Space Agency',
    reliability: 85,
    timeliness: 70,
    spatialResolution: 80,
    status: 'active',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'drone-1',
    name: 'DJI Matrice Drone Fleet',
    type: 'drone_footage',
    provider: 'Field Operations',
    reliability: 92,
    timeliness: 95,
    spatialResolution: 95,
    status: 'active',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'citizen-1',
    name: 'Citizen Report Network',
    type: 'citizen_report',
    provider: 'Community Volunteers',
    reliability: 65,
    timeliness: 85,
    spatialResolution: 50,
    status: 'active',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sensor-1',
    name: 'IoT Sensor Array',
    type: 'sensor_reading',
    provider: 'Environmental Monitoring',
    reliability: 88,
    timeliness: 98,
    spatialResolution: 70,
    status: 'active',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'official-1',
    name: 'NDMA Situation Reports',
    type: 'official_report',
    provider: 'National Disaster Management Authority',
    reliability: 95,
    timeliness: 60,
    spatialResolution: 75,
    status: 'active',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'social-1',
    name: 'Social Media Monitor',
    type: 'social_media',
    provider: 'Social Intelligence',
    reliability: 45,
    timeliness: 90,
    spatialResolution: 40,
    status: 'active',
    lastUpdated: new Date().toISOString(),
  },
];

export class EvidenceSourceRegistry {
  private sources: Map<string, EvidenceSource> = new Map();

  constructor() {
    evidenceSources.forEach(s => this.sources.set(s.id, s));
  }

  getSource(id: string): EvidenceSource | undefined {
    return this.sources.get(id);
  }

  getAllSources(): EvidenceSource[] {
    return Array.from(this.sources.values());
  }

  getSourcesByType(type: EvidenceType): EvidenceSource[] {
    return Array.from(this.sources.values()).filter(s => s.type === type);
  }

  getActiveSources(): EvidenceSource[] {
    return Array.from(this.sources.values()).filter(s => s.status === 'active');
  }

  getSourceWeight(sourceId: string): number {
    const source = this.sources.get(sourceId);
    if (!source) return 0;
    return (source.reliability * 0.4 + source.timeliness * 0.3 + source.spatialResolution * 0.3) / 100;
  }

  updateSourceStatus(id: string, status: EvidenceSource['status']): void {
    const source = this.sources.get(id);
    if (source) {
      this.sources.set(id, { ...source, status, lastUpdated: new Date().toISOString() });
    }
  }
}

export const evidenceSourceRegistry = new EvidenceSourceRegistry();
