"use client";

import { useState, useEffect } from 'react';
import { EvidenceIntelligence, EvidenceFusionResult, EvidenceFilter } from '@/core/contracts';
import { evidenceRepository } from '@/evidence/evidence-repository';
import { fuseEvidence } from '@/evidence/fusion-engine';
import { evidenceSourceRegistry } from '@/evidence/source-registry';
import { EvidenceTimeline } from '@/components/evidence/EvidenceTimeline';
import { EvidenceFusionPanel } from '@/components/evidence/EvidenceFusionPanel';
import { EvidenceDetailsDrawer } from '@/components/evidence/EvidenceDetailsDrawer';
import { EvidenceFiltersComponent } from '@/components/evidence/EvidenceFilters';

export default function EvidenceIntelligencePage() {
  const [evidence, setEvidence] = useState<EvidenceIntelligence[]>([]);
  const [filteredEvidence, setFilteredEvidence] = useState<EvidenceIntelligence[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceIntelligence | null>(null);
  const [fusionResult, setFusionResult] = useState<EvidenceFusionResult | null>(null);
  const [filter, setFilter] = useState<EvidenceFilter>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'sources' | 'fusion'>('timeline');

  useEffect(() => {
    loadEvidence();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [evidence, filter]);

  const loadEvidence = async () => {
    setLoading(true);
    try {
      const allEvidence = await evidenceRepository.getAllEvidence();
      setEvidence(allEvidence);

      const bridgeEvidence = allEvidence.filter(e => e.assetId === 'BRIDGE-024');
      if (bridgeEvidence.length > 0) {
        const result = fuseEvidence({
          evidenceItems: bridgeEvidence,
          temporalDecayHours: 48,
        });
        setFusionResult(result);
        await evidenceRepository.saveFusionResult(result);
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = async () => {
    const results = await evidenceRepository.getFilteredEvidence(filter);
    setFilteredEvidence(results);
  };

  const sources = evidenceSourceRegistry.getAllSources();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Evidence Intelligence</h1>
          <p className="mt-1 text-sm text-slate-400">
            Multi-source evidence fusion and confidence assessment
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
            {evidence.length} Evidence Items
          </span>
          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
            DEMO DATA
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-slate-700/30">
        {(['timeline', 'sources', 'fusion'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab === 'timeline' ? 'Evidence Timeline' : tab === 'sources' ? 'Source Registry' : 'Fusion Results'}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
            <h3 className="text-xs font-bold text-slate-300 mb-3">FILTERS</h3>
            <EvidenceFiltersComponent filter={filter} onChange={setFilter} />
          </div>

          {/* Quick Stats */}
          <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
            <h3 className="text-xs font-bold text-slate-300 mb-3">EVIDENCE SUMMARY</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Total Items</span>
                <span className="text-white font-mono">{evidence.length}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Verified</span>
                <span className="text-emerald-400 font-mono">{evidence.filter(e => e.status === 'verified').length}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Pending</span>
                <span className="text-yellow-400 font-mono">{evidence.filter(e => e.status === 'verifying' || e.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Conflicts</span>
                <span className="text-red-400 font-mono">{evidence.filter(e => e.status === 'conflict').length}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Active Sources</span>
                <span className="text-cyan-400 font-mono">{sources.filter(s => s.status === 'active').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'timeline' && (
            <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
              <h3 className="text-xs font-bold text-slate-300 mb-3">EVIDENCE TIMELINE</h3>
              {loading ? (
                <p className="text-center text-[11px] text-slate-500 py-6">Loading evidence...</p>
              ) : (
                <EvidenceTimeline
                  items={filteredEvidence}
                  onSelect={setSelectedEvidence}
                  selectedId={selectedEvidence?.id}
                />
              )}
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
              <h3 className="text-xs font-bold text-slate-300 mb-3">SOURCE REGISTRY</h3>
              <div className="space-y-2">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center gap-3 rounded-md border border-slate-700/30 bg-slate-900/50 p-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-white">{source.name}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                          source.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-500'
                        }`}>
                          {source.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 mt-0.5">{source.provider} • {source.type.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Weight</div>
                      <div className="text-xs font-mono text-cyan-400">
                        {Math.round(evidenceSourceRegistry.getSourceWeight(source.id) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fusion' && (
            <div className="space-y-4">
              {fusionResult ? (
                <EvidenceFusionPanel result={fusionResult} />
              ) : (
                <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-8 text-center">
                  <p className="text-[11px] text-slate-500">No fusion results available. Select evidence items to fuse.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details Drawer */}
      <EvidenceDetailsDrawer
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
}
