"use client";

import { useState } from 'react';
import { GeographicProvider, useGeographic } from '@/hooks/GeographicContext';
import {
  HierarchicalMap,
  Breadcrumbs,
  GeographicSelector,
  GeographicSearch,
  RegionIntelligencePanel,
} from '@/components/geospatial';
import {
  CommandCenterProvider,
  useCommandCenter,
} from '@/hooks/CommandCenterContext';
import {
  DisasterMap,
  FilterControls,
  AssetIntelligencePanel,
} from '@/components/command-center';

function GeographicCommandCenterContent() {
  const [showCommandCenter, setShowCommandCenter] = useState(false);
  const { selectedRegionId } = useGeographic();
  const { filteredAssets, selectedAssetId, setSelectedAssetId, filterAsset, setFilterAsset, filterPriority, setFilterPriority, filterEvidence, setFilterEvidence } = useCommandCenter();

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            RAKVA GEOGRAPHIC COMMAND CENTER
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Hierarchical Disaster Intelligence & Recovery Prioritization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-yellow-400">
            DEMO MODE
          </span>
          <span className="rounded-full border border-slate-600/30 bg-slate-700/20 px-2.5 py-0.5 text-[10px] text-slate-400">
            PHASE 3: GEOGRAPHIC HIERARCHY
          </span>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumbs />
      </div>

      {/* Geographic Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <GeographicSearch />
        </div>
        <div>
          <GeographicSelector />
        </div>
        <div>
          <button
            onClick={() => setShowCommandCenter(!showCommandCenter)}
            className="rounded border border-cyan-500/50 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-colors"
          >
            {showCommandCenter ? 'Hide' : 'Show'} Asset Intelligence
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Map */}
        <div className={showCommandCenter ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <HierarchicalMap />
        </div>

        {/* Intelligence Panel */}
        <div className="space-y-4">
          <RegionIntelligencePanel />
        </div>
      </div>

      {/* Command Center (Asset Intelligence) */}
      {showCommandCenter && (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-300">
                Asset Intelligence
                {selectedRegionId && (
                  <span className="ml-2 text-[10px] text-slate-500">
                    (Filtered by: {selectedRegionId})
                  </span>
                )}
              </h2>
            </div>
            <DisasterMap
              assets={filteredAssets}
              selectedAssetId={selectedAssetId}
              onSelectAsset={setSelectedAssetId}
            />
          </div>
          <div>
            <FilterControls
              disasterType={'all'}
              assetType={filterAsset as 'all' | 'bridge' | 'road' | 'building' | 'hospital' | 'utility'}
              priority={filterPriority as 'all' | 'critical' | 'high' | 'medium' | 'low'}
              evidence={filterEvidence}
              onDisasterTypeChange={() => {}}
              onAssetTypeChange={setFilterAsset}
              onPriorityChange={setFilterPriority}
              onEvidenceChange={setFilterEvidence}
            />
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-4 rounded-lg border border-slate-700/20 bg-slate-800/20 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-500">
              Geographic Hierarchy: <span className="text-cyan-400">India → State → District</span>
            </span>
            <span className="text-[10px] text-slate-600">|</span>
            <span className="text-[10px] text-slate-500">
              Data: <span className="text-yellow-400">Demo/Mock Data</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-600">
            Simplified boundaries for demonstration
          </span>
        </div>
      </div>
    </div>
  );
}

export default function GeographicCommandCenterPage() {
  return (
    <CommandCenterProvider>
      <GeographicProvider>
        <GeographicCommandCenterContent />
      </GeographicProvider>
    </CommandCenterProvider>
  );
}
