import { 
  PriorityInput, 
  PriorityAssessment, 
  PriorityCategory, 
  PriorityFactor, 
  WhyFirstExplanation,
  SeverityLevel
} from '../contracts';
import { priorityRegistry } from './PriorityRegistry';

export class PriorityEngine {
  private readonly VERSION = '1.0.0';

  private normalizeDamage(severity?: SeverityLevel, pct?: number): number {
    if (pct !== undefined) return pct;
    if (!severity) return 0;
    const map: Record<SeverityLevel, number> = {
      'none': 0, 'minor': 25, 'moderate': 50, 'severe': 75, 'critical': 100, 'unknown': 50
    };
    return map[severity] || 0;
  }

  private normalizeCriticality(score?: number, label?: string): number {
    if (score !== undefined) return score;
    if (!label) return 0;
    const map: Record<string, number> = {
      'low': 25, 'medium': 50, 'high': 75, 'critical': 100
    };
    return map[label.toLowerCase()] || 0;
  }

  private getCategory(score: number): PriorityCategory {
    if (score > 80) return 'critical';
    if (score > 60) return 'high';
    if (score > 40) return 'moderate';
    if (score > 20) return 'moderate-low';
    return 'low';
  }

  private buildWhyFirst(factors: PriorityFactor[], score: number, subjectId: string): WhyFirstExplanation {
    const sorted = [...factors].sort((a, b) => (b.contribution || 0) - (a.contribution || 0));
    const top = sorted.slice(0, 4);
    return top.map((f, i) => ({
      order: i + 1,
      title: f.name,
      description: f.explanation,
    }));
  }

  public assess(input: PriorityInput, configId: string = 'default'): PriorityAssessment {
    const config = priorityRegistry.get(configId) || priorityRegistry.get('default')!;
    const factors: PriorityFactor[] = [];
    let score = 0;
    let confidenceSum = 0;
    let factorCount = 0;

    const addFactor = (
      id: string, name: string, rawVal: number, normVal: number, weight: number, explanation: string, confidence: number
    ) => {
      const contribution = normVal * weight;
      score += contribution;
      confidenceSum += confidence;
      factorCount++;

      factors.push({
        id, name, rawValue: rawVal, normalizedValue: normVal, weight, contribution,
        explanation, direction: 'positive', confidence
      });
    };

    // 1. Damage
    if (input.damage) {
      const norm = this.normalizeDamage(input.damage.severity, input.damage.percentage);
      addFactor('damage', 'Physical Damage', norm, norm, config.weights.damage, 
        input.damage.description || `Damage severity: ${input.damage.severity}`, 
        input.evidenceConfidence || 80);
    }

    // 2. Criticality
    if (input.criticality) {
      const norm = this.normalizeCriticality(input.criticality.score, input.criticality.label);
      addFactor('criticality', 'Infrastructure Criticality', input.criticality.score || norm, norm, config.weights.criticality,
        `Asset is classified as ${input.criticality.label}`, 90);
    }

    // 3. Dependency Impact
    if (input.dependencies) {
      // Very basic normalization for demo: 1 dep = 30, 2 = 60, 3+ = 100
      const norm = Math.min(100, input.dependencies.count * 35);
      addFactor('dependency', 'Dependency Impact', input.dependencies.count, norm, config.weights.dependency,
        `Affects downstream services: ${input.dependencies.criticalServicesAffected.join(', ') || 'multiple'}`, 90);
    }

    // 4. People Impact
    if (input.peopleImpact) {
      // Demo normalization: 10,000+ people = 100
      const total = input.peopleImpact.populationCount + input.peopleImpact.dependentPopulation;
      const norm = Math.min(100, (total / 10000) * 100);
      addFactor('people', 'Population Impact', total, norm, config.weights.peopleImpact,
        `Directly or indirectly impacts ${total.toLocaleString()} people`, 85);
    }

    // 5. Accessibility
    if (input.accessibility) {
      const norm = input.accessibility.alternativeRoutes === 0 ? 100 : Math.max(0, 50 - (input.accessibility.alternativeRoutes * 15));
      addFactor('accessibility', 'Accessibility Impairment', input.accessibility.alternativeRoutes, norm, config.weights.accessibility,
        input.accessibility.alternativeRoutes === 0 ? 'Only access route' : `${input.accessibility.alternativeRoutes} alternative routes available`, 95);
    }

    const overallConfidence = factorCount > 0 ? Math.round(confidenceSum / factorCount) : 0;
    
    // Add Evidence factor explicitly
    if (input.evidenceConfidence) {
      addFactor('evidence', 'Evidence Confidence', input.evidenceConfidence, input.evidenceConfidence, config.weights.evidenceConfidence,
        `Input data confidence is ${input.evidenceConfidence}%`, 100);
    }

    return {
      subjectId: input.subjectId,
      score: Number(score.toFixed(1)),
      category: this.getCategory(score),
      factors,
      whyFirst: this.buildWhyFirst(factors, score, input.subjectId),
      confidence: overallConfidence,
      provenance: {
        source: 'Priority Engine',
        sourceType: 'model',
        timestamp: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        confidence: overallConfidence,
        quality: 'estimated'
      },
      modelId: 'rakva-priority-engine',
      modelVersion: this.VERSION,
      assessedAt: new Date().toISOString()
    };
  }

  public rank(inputs: PriorityInput[], configId: string = 'default'): PriorityAssessment[] {
    const assessments = inputs.map(i => this.assess(i, configId));
    
    // Sort descending by score, tie break deterministically by subjectId
    assessments.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.subjectId.localeCompare(b.subjectId);
    });

    // Assign ranks
    assessments.forEach((a, i) => {
      a.rank = i + 1;
    });

    return assessments;
  }
}

export const priorityEngine = new PriorityEngine();
