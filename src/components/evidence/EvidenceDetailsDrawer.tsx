"use client";

import { EvidenceIntelligence } from '@/core/contracts';
import { cn } from '@/lib/utils';

const typeLabels: Record<string, string> = {
  satellite_image: 'Satellite Image',
  drone_footage: 'Drone Footage',
  citizen_report: 'Citizen Report',
  sensor_reading: 'Sensor Reading',
  official_report: 'Official Report',
  social_media: 'Social Media',
  news_media: 'News Media',
  field_assessment: 'Field Assessment',
};

const statusColors: Record<string, string> = {
  verified: 'text-emerald-400',
  verifying: 'text-yellow-400',
  pending: 'text-slate-400',
  conflict: 'text-red-400',
  rejected: 'text-slate-500',
  superseded: 'text-slate-500',
};

interface EvidenceDetailsDrawerProps {
  evidence: EvidenceIntelligence | null;
  onClose: () => void;
}

export function EvidenceDetailsDrawer({ evidence, onClose }: EvidenceDetailsDrawerProps) {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-700/50 overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700/30 p-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Evidence Details</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Status & Type */}
          <div className="flex items-center gap-2">
            <span className={cn("text-[10px] font-medium", statusColors[evidence.status])}>
              {evidence.status.toUpperCase()}
            </span>
            <span className="text-[10px] text-slate-500">•</span>
            <span className="text-[10px] text-slate-400">{typeLabels[evidence.type] || evidence.type}</span>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-[10px] font-medium text-slate-500 mb-1">DESCRIPTION</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">{evidence.description}</p>
          </div>

          {/* Confidence */}
          <div>
            <h4 className="text-[10px] font-medium text-slate-500 mb-1">CONFIDENCE</h4>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    evidence.confidenceScore >= 85 ? "bg-emerald-500" :
                    evidence.confidenceScore >= 65 ? "bg-green-500" :
                    evidence.confidenceScore >= 40 ? "bg-yellow-500" : "bg-slate-500"
                  )}
                  style={{ width: `${evidence.confidenceScore}%` }}
                />
              </div>
              <span className="text-xs font-mono text-slate-400">{evidence.confidenceScore}%</span>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-slate-800/50 rounded">
              <span className="text-[8px] text-slate-500">SOURCE</span>
              <p className="text-[10px] text-slate-300">{evidence.provenance.source}</p>
            </div>
            <div className="p-2 bg-slate-800/50 rounded">
              <span className="text-[8px] text-slate-500">QUALITY</span>
              <p className="text-[10px] text-slate-300 capitalize">{evidence.quality}</p>
            </div>
            <div className="p-2 bg-slate-800/50 rounded">
              <span className="text-[8px] text-slate-500">CAPTURED</span>
              <p className="text-[10px] text-slate-300">
                {evidence.capturedAt
                  ? new Date(evidence.capturedAt).toLocaleString()
                  : new Date(evidence.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-slate-800/50 rounded">
              <span className="text-[8px] text-slate-500">PROCESSED</span>
              <p className="text-[10px] text-slate-300">
                {new Date(evidence.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Tags */}
          {evidence.tags.length > 0 && (
            <div>
              <h4 className="text-[10px] font-medium text-slate-500 mb-1">TAGS</h4>
              <div className="flex flex-wrap gap-1">
                {evidence.tags.map((tag) => (
                  <span key={tag} className="text-[9px] text-slate-400 bg-slate-700/30 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Media Preview */}
          {evidence.url && (
            <div>
              <h4 className="text-[10px] font-medium text-slate-500 mb-1">MEDIA</h4>
              <div className="rounded-md border border-slate-700/30 bg-slate-800/30 p-4 text-center">
                <span className="text-[10px] text-slate-500">{evidence.url}</span>
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <h4 className="text-[10px] font-medium text-slate-500 mb-1">LOCATION</h4>
            <p className="text-[10px] text-slate-400 font-mono">
              [{evidence.location[0].toFixed(4)}, {evidence.location[1].toFixed(4)}]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
