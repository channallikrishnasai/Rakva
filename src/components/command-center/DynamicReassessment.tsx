"use client";

import type { Asset } from "@/core/contracts";
import type { SimulationEvent } from "@/lib/types/command-center";

interface DynamicReassessmentProps {
  asset: Asset;
  simulationEvent: SimulationEvent | null;
  onSimulate: () => void;
  simulated: boolean;
}

export function DynamicReassessment({ asset, simulationEvent, onSimulate, simulated }: DynamicReassessmentProps) {
  const event = simulationEvent;

  return (
    <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold tracking-wider text-slate-300">DYNAMIC REASSESSMENT</h4>
        <span className="text-[10px] text-slate-500">CONCEPTUAL DEMONSTRATION</span>
      </div>

      {!simulated ? (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            Simulate new incoming evidence to demonstrate how the priority engine re-evaluates assets.
          </p>
          <div className="rounded-md border border-slate-700/20 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">CURRENT ASSET</span>
              <span className="text-[10px] font-mono text-slate-400">{asset.id}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[10px] text-slate-500">Priority:</span>
              <span className="text-lg font-bold text-cyan-400">{asset.priorityMetrics?.score}</span>
            </div>
          </div>
          <button
            onClick={onSimulate}
            className="w-full rounded-md border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition-colors hover:bg-cyan-500/20 hover:border-cyan-500/50"
          >
            SIMULATE NEW EVIDENCE
          </button>
        </div>
      ) : event ? (
        <div className="space-y-3">
          {/* New evidence notification */}
          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-400">{event.title}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">{event.detail}</p>
          </div>

          {/* Priority animation */}
          <div className="rounded-md border border-slate-700/20 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500">PRIORITY UPDATED</span>
              <span className="text-[10px] text-emerald-400 font-medium">REASSESSED</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-lg text-slate-500 line-through">{event.priorityChange.from}</span>
              <span className="text-xs text-slate-600">→</span>
              <span className="text-2xl font-bold text-cyan-400">{event.priorityChange.to}</span>
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3">
            <p className="text-[11px] text-cyan-300/80 leading-relaxed">
              New evidence changed the consequence assessment. The updated priority reflects increased downstream impact and reduced route availability.
            </p>
          </div>

          {/* Key insight */}
          <div className="flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 p-2.5">
            <span className="text-emerald-400 text-sm">→</span>
            <p className="text-[10px] text-emerald-300/80">
              <strong>Key insight:</strong> Moderate damage + high consequence = higher priority than severe damage + low consequence.
            </p>
          </div>

          <button
            onClick={onSimulate}
            className="w-full rounded-md border border-slate-600/30 bg-slate-700/20 px-4 py-2 text-[10px] font-medium text-slate-400 transition-colors hover:bg-slate-700/40"
          >
            RESET SIMULATION
          </button>
        </div>
      ) : null}
    </div>
  );
}
