"use client";

import type { Asset } from "@/core/contracts";

interface AssetIntelligencePanelProps {
  asset: Asset;
  animatingPriority?: { from: number; to: number } | null;
}

const priorityAccent: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
  high: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
  medium: { bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/30" },
  low: { bg: "bg-slate-500/15", text: "text-slate-400", border: "border-slate-500/30" },
};

const severityLabels: Record<string, string> = {
  none: "NONE",
  minor: "MINOR",
  moderate: "MODERATE",
  severe: "SEVERE",
  critical: "CRITICAL",
};

const confidenceColor: Record<string, string> = {
  high: "text-emerald-400",
  moderate: "text-yellow-400",
  low: "text-slate-400",
};

export function AssetIntelligencePanel({ asset, animatingPriority }: AssetIntelligencePanelProps) {
  const priorityLabel = asset.priorityMetrics?.priorityLabel || "low";
  const recoveryPriority = asset.priorityMetrics?.recoveryPriority || 0;
  const accent = priorityAccent[priorityLabel] || priorityAccent.low;
  const displayPriority = animatingPriority ? animatingPriority.to : recoveryPriority;
  const showChange = animatingPriority && animatingPriority.from !== animatingPriority.to;

  return (
    <div className="space-y-4">
      {/* Asset Header */}
      <div className={`rounded-lg border ${accent.border} ${accent.bg} p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-wider text-slate-500">
              {asset.type.toUpperCase()}
            </span>
            <h3 className="mt-0.5 text-sm font-bold text-white">{asset.id}</h3>
            <p className="text-xs text-slate-400">{asset.name}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500">RECOVERY PRIORITY</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-bold ${accent.text}`}>
                {displayPriority}
              </span>
              {showChange && (
                <span className="text-xs text-emerald-400 animate-pulse">
                  Updated
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono text-slate-500">#{priorityLabel.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md border border-slate-700/30 bg-slate-800/50 p-3">
          <span className="text-[10px] text-slate-500">DAMAGE</span>
          <p className="mt-0.5 text-sm font-semibold text-slate-200">
            {asset.damageSeverity ? severityLabels[asset.damageSeverity] || asset.damageSeverity.toUpperCase() : "UNKNOWN"}
          </p>
        </div>
        <div className="rounded-md border border-slate-700/30 bg-slate-800/50 p-3">
          <span className="text-[10px] text-slate-500">IMPACT</span>
          <p className="mt-0.5 text-sm font-semibold text-slate-200">
            {asset.consequenceLevel ? asset.consequenceLevel.toUpperCase() : "UNKNOWN"}
          </p>
        </div>
        <div className="rounded-md border border-slate-700/30 bg-slate-800/50 p-3">
          <span className="text-[10px] text-slate-500">ACCESSIBILITY</span>
          <p className="mt-0.5 text-sm font-semibold text-slate-200">
            {asset.accessibility ? asset.accessibility.replace("_", " ").toUpperCase() : "UNKNOWN"}
          </p>
        </div>
        <div className="rounded-md border border-slate-700/30 bg-slate-800/50 p-3">
          <span className="text-[10px] text-slate-500">URGENCY</span>
          <p className={`mt-0.5 text-sm font-semibold ${asset.urgency === "high" ? "text-red-400" : asset.urgency === "moderate" ? "text-yellow-400" : "text-slate-400"}`}>
            {asset.urgency ? asset.urgency.toUpperCase() : "UNKNOWN"}
          </p>
        </div>
      </div>

      {/* Damage & Impact Descriptions */}
      <div className="rounded-md border border-slate-700/30 bg-slate-800/30 p-3 space-y-2">
        <div>
          <span className="text-[10px] font-medium text-slate-500">DAMAGE ASSESSMENT</span>
          <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">{asset.damageDescription || "No description provided."}</p>
        </div>
        <div className="border-t border-slate-700/30 pt-2">
          <span className="text-[10px] font-medium text-slate-500">CONSEQUENCE</span>
          <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">{asset.consequenceDescription || "No consequence provided."}</p>
        </div>
      </div>

      {/* WHY FIRST - Most Important Section */}
      {asset.priorityMetrics?.whyFirst && asset.priorityMetrics.whyFirst.length > 0 && (
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-cyan-500/20 text-[10px] font-bold text-cyan-400">
              ?
            </div>
            <h4 className="text-xs font-bold tracking-wider text-cyan-400">WHY FIRST?</h4>
          </div>
          <div className="space-y-3">
            {asset.priorityMetrics.whyFirst.map((reason) => (
              <div key={reason.order} className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[10px] font-bold text-cyan-400">
                  {String(reason.order).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-slate-200">{reason.title}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Confidence */}
      <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium text-slate-500">EVIDENCE CONFIDENCE</span>
          <span className={`text-xs font-bold ${asset.overallEvidenceConfidence ? confidenceColor[asset.overallEvidenceConfidence] || "text-slate-400" : "text-slate-400"}`}>
            {(asset.overallEvidenceConfidence || "UNKNOWN").toUpperCase()}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {(asset.evidence || []).map((ev) => (
            <div
              key={ev.source}
              className="flex items-center gap-1.5 rounded bg-slate-900/50 px-2 py-1"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  ev.status === "verified"
                    ? "bg-emerald-400"
                    : ev.status === "validating"
                      ? "bg-yellow-400"
                      : ev.status === "conflict"
                        ? "bg-red-400"
                        : "bg-slate-500"
                }`}
              />
              <span className="text-[10px] text-slate-400">{ev.label}</span>
              <span
                className={`ml-auto text-[9px] ${
                  ev.status === "verified"
                    ? "text-emerald-400"
                    : ev.status === "validating"
                      ? "text-yellow-400"
                      : ev.status === "conflict"
                        ? "text-red-400"
                        : "text-slate-500"
                }`}
              >
                {ev.status === "verified"
                  ? "✓"
                  : ev.status === "validating"
                    ? "..."
                    : ev.status === "conflict"
                      ? "!"
                      : ev.status === "matched"
                        ? "✓"
                        : "–"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Factors Breakdown */}
      {asset.priorityMetrics?.factors && (
        <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-3">
          <span className="text-[10px] font-medium text-slate-500">PRIORITY FACTORS</span>
          <div className="mt-2 space-y-1.5">
            {Object.entries(asset.priorityMetrics.factors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-24 text-[10px] text-slate-400 capitalize">{key}</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      value >= 80 ? "bg-red-400" : value >= 60 ? "bg-orange-400" : value >= 40 ? "bg-yellow-400" : "bg-slate-500"
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[10px] font-mono text-slate-500">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
