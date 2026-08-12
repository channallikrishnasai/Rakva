"use client";

import type { Asset } from "@/core/contracts";

interface WhatIfPanelProps {
  asset: Asset;
  isActive: boolean;
  onToggle: () => void;
}

const whatIfScenarios: Record<string, { title: string; impact: string; priorityChange: { from: number; to: number }; explanation: string }> = {
  "BRIDGE-024": {
    title: "WHAT IF BRIDGE-024 FAILS?",
    impact: "Bridge becomes unavailable. Hospital access cut. Two communities isolated.",
    priorityChange: { from: 94, to: 97 },
    explanation: "Priority increased because bridge failure creates greater downstream consequences. Hospital access becomes critical. Emergency vehicle routing severely impacted.",
  },
  "ROAD-017": {
    title: "WHAT IF ROAD-017 FAILS?",
    impact: "Main arterial blocked. Supply chain disrupted. Emergency response delayed.",
    priorityChange: { from: 82, to: 89 },
    explanation: "Priority increased due to complete loss of primary emergency response corridor. Alternative routes insufficient for emergency vehicle volume.",
  },
  "HOSPITAL-002": {
    title: "WHAT IF HOSPITAL-002 FAILS?",
    impact: "Regional healthcare capacity lost. Patients must be transferred. Medical emergencies unaddressed.",
    priorityChange: { from: 88, to: 96 },
    explanation: "Priority increased dramatically. Hospital failure cascades across entire disaster response. No nearby alternative facility.",
  },
  "UTILITY-009": {
    title: "WHAT IF UTILITY-009 FAILS?",
    impact: "Water supply cut. Fire suppression compromised. Public health risk increases.",
    priorityChange: { from: 85, to: 92 },
    explanation: "Priority increased. Water supply failure creates secondary hazards. Disease risk and fire risk both elevated.",
  },
  "BUILDING-031": {
    title: "WHAT IF BUILDING-031 FAILS?",
    impact: "Structural collapse. Additional displacement. Debris blocks local access.",
    priorityChange: { from: 68, to: 74 },
    explanation: "Priority increased but remains lower than critical infrastructure. Localized impact with limited downstream consequences.",
  },
};

export function WhatIfPanel({ asset, isActive, onToggle }: WhatIfPanelProps) {
  const scenario = whatIfScenarios[asset.id];
  const supportedAssetIds = Object.keys(whatIfScenarios);
  const isSupported = supportedAssetIds.includes(asset.id);

  if (!isSupported || !scenario) {
    return (
      <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold tracking-wider text-slate-300">WHAT-IF SIMULATION</h4>
          <span className="text-[10px] text-slate-500">CONCEPTUAL SIMULATION</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Select BRIDGE-024, ROAD-017, HOSPITAL-002, UTILITY-009, or BUILDING-031 to run a failure scenario.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold tracking-wider text-slate-300">WHAT-IF SIMULATION</h4>
        <span className="text-[10px] text-slate-500">CONCEPTUAL SIMULATION</span>
      </div>

      {!isActive ? (
        <div className="space-y-3">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Simulate infrastructure failure to understand how consequences would change.
          </p>
          <div className="rounded-md border border-slate-700/20 bg-slate-900/50 p-3">
            <p className="text-[10px] text-slate-500 mb-1">SCENARIO</p>
            <p className="text-xs font-medium text-white">{scenario.title}</p>
            <p className="mt-1 text-[10px] text-slate-400">{scenario.impact}</p>
          </div>
          <button
            onClick={onToggle}
            className="w-full rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/20 hover:border-amber-500/50"
          >
            SIMULATE FAILURE
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Active scenario */}
          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-400">{scenario.title}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">{scenario.impact}</p>
          </div>

          {/* Priority change */}
          <div className="rounded-md border border-slate-700/20 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500">PRIORITY UPDATED</span>
              <span className="text-[10px] text-amber-400 font-medium">REASSESSED</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-lg text-slate-500 line-through">{scenario.priorityChange.from}</span>
              <span className="text-xs text-slate-600">→</span>
              <span className="text-2xl font-bold text-amber-400">{scenario.priorityChange.to}</span>
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="text-[11px] text-amber-300/80 leading-relaxed">
              {scenario.explanation}
            </p>
          </div>

          <button
            onClick={onToggle}
            className="w-full rounded-md border border-slate-600/30 bg-slate-700/20 px-4 py-2 text-[10px] font-medium text-slate-400 transition-colors hover:bg-slate-700/40"
          >
            RESET SIMULATION
          </button>
        </div>
      )}
    </div>
  );
}
