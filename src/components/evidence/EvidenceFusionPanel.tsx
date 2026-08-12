"use client";

import { EvidenceFusionResult } from '@/core/contracts';
import { cn } from '@/lib/utils';

const confidenceColors: Record<string, { bg: string; text: string; border: string }> = {
  very_high: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  high: { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/30' },
  medium: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  low: { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30' },
};

const typeIcons: Record<string, string> = {
  satellite_image: '🛰',
  drone_footage: '🚁',
  citizen_report: '👥',
  sensor_reading: '📊',
  official_report: '📋',
  social_media: '📱',
  news_media: '📰',
  field_assessment: '🔍',
};

interface EvidenceFusionPanelProps {
  result: EvidenceFusionResult;
}

export function EvidenceFusionPanel({ result }: EvidenceFusionPanelProps) {
  const colors = confidenceColors[result.fusedConfidence] || confidenceColors.low;

  return (
    <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[10px] font-bold tracking-wider text-slate-300">EVIDENCE FUSION</h4>
        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded border", colors.bg, colors.text, colors.border)}>
          {result.fusedConfidence.toUpperCase()} ({result.fusedConfidenceScore}%)
        </span>
      </div>

      {/* Summary */}
      <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">{result.summary}</p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 bg-slate-900/50 rounded">
          <span className="text-lg font-bold text-white">{result.evidenceCount}</span>
          <p className="text-[8px] text-slate-500 mt-0.5">TOTAL</p>
        </div>
        <div className="text-center p-2 bg-slate-900/50 rounded">
          <span className="text-lg font-bold text-emerald-400">{result.verifiedCount}</span>
          <p className="text-[8px] text-slate-500 mt-0.5">VERIFIED</p>
        </div>
        <div className="text-center p-2 bg-slate-900/50 rounded">
          <span className="text-lg font-bold text-yellow-400">{result.sources.length}</span>
          <p className="text-[8px] text-slate-500 mt-0.5">SOURCES</p>
        </div>
        <div className="text-center p-2 bg-slate-900/50 rounded">
          <span className={cn("text-lg font-bold", result.conflictCount > 0 ? "text-red-400" : "text-slate-500")}>
            {result.conflictCount}
          </span>
          <p className="text-[8px] text-slate-500 mt-0.5">CONFLICTS</p>
        </div>
      </div>

      {/* Breakdown */}
      {result.breakdown.length > 0 && (
        <div className="mb-4">
          <h5 className="text-[9px] font-bold text-slate-400 mb-2">SOURCE BREAKDOWN</h5>
          <div className="space-y-1.5">
            {result.breakdown.map((item) => (
              <div key={item.sourceId} className="flex items-center gap-2 text-[9px]">
                <span className="shrink-0">{typeIcons[item.evidenceType] || '📄'}</span>
                <span className="w-28 text-slate-400 truncate">{item.sourceName}</span>
                <div className="flex-1 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500/60 rounded-full"
                    style={{ width: `${Math.min(100, item.contribution)}%` }}
                  />
                </div>
                <span className="w-8 text-right text-slate-500">{Math.round(item.contribution)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conflicts */}
      {result.conflictFlags.length > 0 && (
        <div className="rounded-md border border-red-500/20 bg-red-500/5 p-3">
          <h5 className="text-[9px] font-bold text-red-400 mb-2">CONFLICTS DETECTED</h5>
          <div className="space-y-1.5">
            {result.conflictFlags.map((flag, i) => (
              <div key={i} className="text-[9px] text-slate-400">
                <span className="text-red-400 font-medium">[{flag.severity.toUpperCase()}]</span>{' '}
                {flag.description}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
