"use client";

import { useCommandCenter } from '@/hooks/CommandCenterContext';

export function PriorityEngine() {
  const { selectedAsset } = useCommandCenter();
  const assessment = selectedAsset?.priorityMetrics;

  const factors = assessment?.factors ?? [];
  const whyFirst = assessment?.whyFirst?.summary ?? '';

  return (
    <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold tracking-wider text-slate-300">RECOVERY PRIORITY ENGINE</h4>
        <span className="text-[10px] text-slate-500">CONCEPTUAL PRIORITIZATION FRAMEWORK</span>
      </div>

      {/* Factor chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {factors.map((f: any) => (
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
        <p className="text-[10px] text-slate-500">{whyFirst || 'Select an asset to see the explanation.'}</p>
      </div>
    </div>
  );
}

  const factors = [
    { label: "DAMAGE", icon: "D" },
    { label: "PEOPLE", icon: "P" },
    { label: "VULNERABILITY", icon: "V" },
    { label: "CRITICALITY", icon: "C" },
    { label: "ACCESSIBILITY", icon: "A" },
    { label: "URGENCY", icon: "U" },
  ];

  return (
    <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold tracking-wider text-slate-300">RECOVERY PRIORITY ENGINE</h4>
        <span className="text-[10px] text-slate-500">CONCEPTUAL PRIORITIZATION FRAMEWORK</span>
      </div>

      {/* Factor chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {factors.map((f, i) => (
          <span key={f.label} className="flex items-center gap-1.5">
            <span className="inline-flex h-6 items-center gap-1 rounded border border-slate-600/40 bg-slate-700/30 px-2 text-[10px] font-medium text-slate-300">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-slate-600/50 text-[8px] font-bold text-slate-400">
                {f.icon}
              </span>
              {f.label}
            </span>
            {i < factors.length - 1 && (
              <span className="text-[10px] text-slate-600">+</span>
            )}
          </span>
        ))}
      </div>

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
        <p className="text-[10px] text-slate-500">
          Human judgment remains essential. This framework supports decision-makers with explainable prioritization.
        </p>
      </div>
    </div>
  );
}
