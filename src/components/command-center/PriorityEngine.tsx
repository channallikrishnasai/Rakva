"use client";

import { useCommandCenter } from '@/hooks/CommandCenterContext';

export function PriorityEngine() {
  const { selectedAsset } = useCommandCenter();
  const assessment = selectedAsset?.priorityMetrics;

  const factorsArray = Array.isArray(assessment?.factors) 
    ? assessment.factors 
    : assessment?.factors 
      ? Object.entries(assessment.factors).map(([name, value]) => ({ id: name, name, normalizedValue: value, explanation: '' }))
      : [];
  const whyFirstItems = Array.isArray(assessment?.whyFirst) ? assessment.whyFirst : [];

  return (
    <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold tracking-wider text-slate-300">RECOVERY PRIORITY ENGINE</h4>
        <span className="text-[10px] text-slate-500">CONCEPTUAL PRIORITIZATION FRAMEWORK</span>
      </div>

      {/* Factor chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {factorsArray.map((f: any) => (
          <span key={f.id} className="flex items-center gap-1.5">
            <span className="inline-flex h-6 items-center gap-1 rounded border border-slate-600/40 bg-slate-700/30 px-2 text-[10px] font-medium text-slate-300">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-slate-600/50 text-[8px] font-bold text-slate-400">
                {f.name.charAt(0).toUpperCase()}
              </span>
              {f.name}
            </span>
          </span>
        ))}
      </div>

      {/* Why First Reasons */}
      {whyFirstItems.length > 0 && (
        <div className="mb-4">
          <h4 className="text-[10px] font-bold text-slate-300 mb-2">WHY THIS COMES FIRST</h4>
          <div className="space-y-1.5">
            {whyFirstItems.slice(0, 3).map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-2 text-[9px]">
                <span className="text-cyan-400 font-bold">{item.order}.</span>
                <div>
                  <span className="text-slate-300 font-medium">{item.title}: </span>
                  <span className="text-slate-400">{item.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Arrow */}
      <div className="flex flex-col items-center gap-1 mb-3">
        <div className="h-3 w-px bg-cyan-500/30" />
        <div className="rounded bg-cyan-500/10 px-3 py-0.5 text-[10px] font-semibold text-cyan-400 tracking-wider">
          ↓ RECOVERY PRIORITY
        </div>
        <div className="h-3 w-px bg-cyan-500/30" />
      </div>

      {/* Output */}
      <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 text-center">
        <p className="text-[10px] text-slate-400 mb-1">
          Multi-factor evidence fusion produces a <strong className="text-cyan-400">recommendation</strong>, not a decision.
        </p>
        <p className="text-[10px] text-slate-500">{whyFirstItems.length > 0 ? 'See above for reasoning.' : 'Select an asset to see the explanation.'}</p>
      </div>
    </div>
  );
}
