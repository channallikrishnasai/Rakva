"use client";

import { useState, useMemo, useCallback } from "react";
import { commandCenterData, heroAssetId, simulationEvents } from "@/lib/mock-data";
import type { DisasterType, AssetType, FilterPriority } from "@/lib/types/command-center";
import type { SceneLayer } from "@/components/command-center";
import {
  DisasterMap,
  DisasterScene3D,
  AssetIntelligencePanel,
  EvidenceFusionPanel,
  DynamicReassessment,
  PriorityEngine,
  FilterControls,
  WhatIfPanel,
  EvidenceTimeline,
} from "@/components/command-center";

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

const sceneLayers: { value: SceneLayer; label: string }[] = [
  { value: "situation", label: "Situation" },
  { value: "damage", label: "Damage" },
  { value: "dependencies", label: "Dependencies" },
  { value: "recovery", label: "Recovery" },
];

export default function CommandCenterPage() {
  const data = commandCenterData;

  const [selectedAssetId, setSelectedAssetId] = useState(heroAssetId);
  const [filterDisaster, setFilterDisaster] = useState<DisasterType | "all">("all");
  const [filterAsset, setFilterAsset] = useState<AssetType | "all">("all");
  const [filterPriority, setFilterPriority] = useState<FilterPriority | "all">("all");
  const [filterEvidence, setFilterEvidence] = useState("all");
  const [simulated, setSimulated] = useState(false);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [webglSupported] = useState(checkWebGLSupport);
  const [whatIfActive, setWhatIfActive] = useState(false);
  const [sceneLayer, setSceneLayer] = useState<SceneLayer>("situation");

  const filteredAssets = useMemo(() => {
    return data.assets.filter((a) => {
      if (filterAsset !== "all" && a.assetType !== filterAsset) return false;
      if (filterPriority !== "all" && a.priorityLabel !== filterPriority) return false;
      if (filterEvidence !== "all" && !a.evidenceSources.some((e) => e.source === filterEvidence)) return false;
      return true;
    });
  }, [data.assets, filterAsset, filterPriority, filterEvidence]);

  const selectedAsset = filteredAssets.find((a) => a.id === selectedAssetId) || filteredAssets[0];

  const simulationEvent = selectedAsset
    ? simulationEvents.find((e) => e.assetId === selectedAsset.id) || null
    : null;

  const handleSimulate = useCallback(() => {
    setSimulated((prev) => !prev);
  }, []);

  const handleSelectAsset = useCallback((id: string) => {
    setSelectedAssetId(id);
    setSimulated(false);
    setWhatIfActive(false);
  }, []);

  const handleWhatIfToggle = useCallback(() => {
    setWhatIfActive((prev) => !prev);
  }, []);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 lg:px-6">
      {/* Top Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            RAKVA COMMAND CENTER
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Disaster Intelligence & Recovery Prioritization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-yellow-400">
            DEMO MODE
          </span>
          <span className="rounded-full border border-slate-600/30 bg-slate-700/20 px-2.5 py-0.5 text-[10px] text-slate-400">
            CONCEPTUAL DEMONSTRATION DATA
          </span>
        </div>
      </div>

      {/* Situation Summary Bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-slate-700/30 bg-slate-800/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Disaster:</span>
          <span className="text-xs font-medium text-slate-200 capitalize">{data.disasterType}</span>
        </div>
        <div className="h-3 w-px bg-slate-700/50" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Region:</span>
          <span className="text-xs font-medium text-slate-200">{data.region}</span>
        </div>
        <div className="h-3 w-px bg-slate-700/50" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Evidence Sources:</span>
          <span className="text-xs font-medium text-cyan-400">{data.evidenceCount}</span>
        </div>
        <div className="h-3 w-px bg-slate-700/50" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Status:</span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {data.status}
          </span>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-700/30 bg-slate-800/40 p-3 text-center">
          <p className="text-[10px] text-slate-500 mb-1">AFFECTED ASSETS</p>
          <p className="text-2xl font-bold text-white">{data.totalAssets}</p>
        </div>
        <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3 text-center">
          <p className="text-[10px] text-slate-500 mb-1">HIGH PRIORITY</p>
          <p className="text-2xl font-bold text-orange-400">{data.highPriorityCount}</p>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-center">
          <p className="text-[10px] text-slate-500 mb-1">CRITICAL</p>
          <p className="text-2xl font-bold text-red-400">{data.criticalCount}</p>
        </div>
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 text-center">
          <p className="text-[10px] text-slate-500 mb-1">EVIDENCE CONFIDENCE</p>
          <p className="text-2xl font-bold text-cyan-400">{data.evidenceConfidence}%</p>
        </div>
      </div>

      {/* Filter Controls + View/Layer Controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-slate-700/30 bg-slate-800/30 px-4 py-2.5">
        <FilterControls
          disasterType={filterDisaster}
          assetType={filterAsset}
          priority={filterPriority}
          evidence={filterEvidence}
          onDisasterTypeChange={setFilterDisaster}
          onAssetTypeChange={setFilterAsset}
          onPriorityChange={setFilterPriority}
          onEvidenceChange={setFilterEvidence}
        />

        <div className="flex items-center gap-3">
          {/* Scene Layers (3D only) */}
          {webglSupported && viewMode === "3d" && (
            <div className="flex items-center gap-1 rounded-md border border-slate-700/50 bg-slate-900/50 p-0.5">
              {sceneLayers.map((layer) => (
                <button
                  key={layer.value}
                  onClick={() => setSceneLayer(layer.value)}
                  className={`rounded px-2.5 py-1.5 text-[10px] font-semibold transition-colors ${
                    sceneLayer === layer.value
                      ? "bg-slate-700/50 text-cyan-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          )}

          {/* 2D/3D Toggle */}
          {webglSupported && (
            <div className="flex items-center gap-1 rounded-md border border-slate-700/50 bg-slate-900/50 p-0.5">
              <button
                onClick={() => setViewMode("2d")}
                className={`rounded px-3 py-1.5 text-[10px] font-semibold transition-colors ${
                  viewMode === "2d"
                    ? "bg-slate-700/50 text-cyan-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                2D MAP
              </button>
              <button
                onClick={() => setViewMode("3d")}
                className={`rounded px-3 py-1.5 text-[10px] font-semibold transition-colors ${
                  viewMode === "3d"
                    ? "bg-slate-700/50 text-cyan-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                3D SCENE
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Map/Scene + Intelligence Panel */}
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        {/* Left: Map or 3D Scene */}
        <div className="space-y-4">
          {viewMode === "3d" && webglSupported ? (
            <div className="h-[450px] lg:h-[520px]">
              <DisasterScene3D
                assets={filteredAssets}
                selectedAssetId={selectedAsset?.id || ""}
                onSelectAsset={handleSelectAsset}
                whatIfActive={whatIfActive}
                sceneLayer={sceneLayer}
              />
            </div>
          ) : (
            <DisasterMap
              assets={filteredAssets}
              selectedAssetId={selectedAsset?.id || ""}
              onSelectAsset={handleSelectAsset}
            />
          )}

          {/* Evidence Fusion + Dynamic Reassessment + WhatIf side by side below map */}
          {selectedAsset && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <EvidenceFusionPanel asset={selectedAsset} />
              <DynamicReassessment
                asset={selectedAsset}
                simulationEvent={simulated ? simulationEvent : null}
                onSimulate={handleSimulate}
                simulated={simulated}
              />
              <WhatIfPanel
                asset={selectedAsset}
                isActive={whatIfActive}
                onToggle={handleWhatIfToggle}
              />
            </div>
          )}
        </div>

        {/* Right: Intelligence Panel */}
        <div className="space-y-4">
          {selectedAsset && (
            <>
              <AssetIntelligencePanel
                asset={selectedAsset}
                animatingPriority={
                  simulated && simulationEvent
                    ? simulationEvent.priorityChange
                    : whatIfActive
                      ? (() => {
                          const scenarios: Record<string, { from: number; to: number }> = {
                            "BRIDGE-024": { from: 94, to: 97 },
                            "ROAD-017": { from: 82, to: 89 },
                            "HOSPITAL-002": { from: 88, to: 96 },
                            "UTILITY-009": { from: 85, to: 92 },
                            "BUILDING-031": { from: 68, to: 74 },
                          };
                          const s = scenarios[selectedAsset.id];
                          return s || null;
                        })()
                      : null
                }
              />
              <EvidenceTimeline asset={selectedAsset} />
              <PriorityEngine />
            </>
          )}
        </div>
      </div>

      {/* Bottom: Additional Context */}
      <div className="mt-4 rounded-lg border border-slate-700/20 bg-slate-800/20 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-500">
              Pipeline: <span className="text-cyan-400">Collect → Understand → Validate → Prioritize → Explain</span>
            </span>
            <span className="text-[10px] text-slate-600">|</span>
            <span className="text-[10px] text-slate-500">
              Data: <span className="text-emerald-400">Satellite</span> · <span className="text-emerald-400">Drone</span> · <span className="text-yellow-400">Citizen</span> · <span className="text-emerald-400">Geospatial</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-600">
            Last updated: Demo timestamp
          </span>
        </div>
      </div>
    </div>
  );
}
