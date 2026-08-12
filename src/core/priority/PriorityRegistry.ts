export interface PriorityModelConfig {
  id: string;
  name: string;
  description: string;
  weights: {
    damage: number;
    peopleImpact: number;
    vulnerability: number;
    criticality: number;
    accessibility: number;
    urgency: number;
    dependency: number;
    hazardContext: number;
    evidenceConfidence: number;
  };
}

class PriorityRegistry {
  private configs = new Map<string, PriorityModelConfig>();

  register(config: PriorityModelConfig) {
    this.configs.set(config.id, config);
  }

  get(id: string): PriorityModelConfig | undefined {
    return this.configs.get(id);
  }

  getAll(): PriorityModelConfig[] {
    return Array.from(this.configs.values());
  }
}

export const priorityRegistry = new PriorityRegistry();

// Core Configurations

priorityRegistry.register({
  id: 'default',
  name: 'RAKVA Demo Priority Model',
  description: 'Default deterministic configuration prioritizing human impact and dependencies over physical damage.',
  weights: {
    damage: 0.15,
    peopleImpact: 0.20,
    vulnerability: 0.10,
    criticality: 0.20,
    accessibility: 0.10,
    urgency: 0.10,
    dependency: 0.10,
    hazardContext: 0.03,
    evidenceConfidence: 0.02,
  }
});

priorityRegistry.register({
  id: 'flood',
  name: 'Flood Response Configuration',
  description: 'Prioritizes accessibility and hospital dependency heavily for flood contexts.',
  weights: {
    damage: 0.10,
    peopleImpact: 0.25,
    vulnerability: 0.10,
    criticality: 0.15,
    accessibility: 0.20,
    urgency: 0.05,
    dependency: 0.10,
    hazardContext: 0.03,
    evidenceConfidence: 0.02,
  }
});
