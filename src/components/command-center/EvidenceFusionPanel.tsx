"use client";

import type { DisasterAsset } from "@/lib/types/command-center";

interface EvidenceFusionPanelProps {
  asset: DisasterAsset;
}

const sourceIcons: Record<string, string> = {
  satellite: "S",
  drone: "D",
  citizen: "C",
  geospatial: "G",
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  verified: { label: "Verified", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-500/20" },
  validating: { label: "Validating", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-500/20" },
  received: { label: "Received", color: "text-slate-400", bg: "bg-slate-400/10 border-slate-500/20" },
  conflict: { label: "Conflict", color: "text-red-400", bg: "bg-red-400/10 border-red-500/20" },
  review_required: { label: "Review Required", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-500/20" },
  matched: { label: "Matched", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-500/20" },
};

export function EvidenceFusionPanel({ asset }: EvidenceFusionPanelProps) {
  return (
    <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold tracking-wider text-slate-300">EVIDENCE FUSION</h4>
        <span className="text-[10px] text-slate-500">CONCEPTUAL DEMONSTRATION</span>
      </div>

      {/* Source cards */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {asset.evidenceSources.map((ev) => {
          const config = statusConfig[ev.status] || statusConfig.received;
          return (
            <div
              key={ev.source}
              className={`rounded-md border p-2.5 ${config.bg}`}
            >
              <div className="flex items-center gap-2">
                <div className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${config.color}`}>
                  {sourceIcons[ev.source]}
                </div>
                <span className="text-[10px] font-medium text-slate-300">{ev.label}</span>
                <span className={`ml-auto text-[10px] font-medium ${config.color}`}>
                  {config.label}
                </span>
              </div>
              {ev.detail && (
                <p className="mt-1 text-[9px] text-slate-500 leading-relaxed">{ev.detail}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Fusion flow */}
      <div className="flex items-center justify-center gap-1 mb-3">
        {asset.evidenceSources.map((ev, i) => (
          <span key={ev.source} className="flex items-center gap-1">
            <span className={`inline-flex h-5 items-center rounded bg-slate-700/50 px-1.5 text-[9px] font-mono ${
              ev.status === "verified" || ev.status === "matched" ? "text-emerald-400" : ev.status === "conflict" ? "text-red-400" : "text-slate-400"
            }`}>
              {sourceIcons[ev.source]}
            </span>
            {i < asset.evidenceSources.length - 1 && (
              <span className="text-[10px] text-slate-600">+</span>
            )}
          </span>
        ))}
      </div>

      {/* Fusion arrow */}
      <div className="flex flex-col items-center gap-1">
        <div className="h-3 w-px bg-cyan-500/40" />
        <div className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
          EVIDENCE FUSION
        </div>
        <div className="h-3 w-px bg-cyan-500/40" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">CONFIDENCE:</span>
          <span className={`text-xs font-bold ${
            asset.overallEvidenceConfidence === "high" ? "text-emerald-400" :
            asset.overallEvidenceConfidence === "moderate" ? "text-yellow-400" : "text-slate-400"
          }`}>
            {asset.overallEvidenceConfidence.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
