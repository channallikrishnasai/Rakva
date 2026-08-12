"use client";

import { EvidenceIntelligence } from '@/core/contracts';
import { cn } from '@/lib/utils';

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

const statusColors: Record<string, string> = {
  verified: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  verifying: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  pending: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  conflict: 'bg-red-500/15 text-red-400 border-red-500/30',
  rejected: 'bg-slate-500/15 text-slate-500 border-slate-600/30',
  superseded: 'bg-slate-500/15 text-slate-500 border-slate-600/30',
};

const confidenceColors: Record<string, string> = {
  very_high: 'text-emerald-400',
  high: 'text-green-400',
  medium: 'text-yellow-400',
  low: 'text-slate-400',
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface EvidenceTimelineProps {
  items: EvidenceIntelligence[];
  onSelect?: (item: EvidenceIntelligence) => void;
  selectedId?: string;
}

export function EvidenceTimeline({ items, onSelect, selectedId }: EvidenceTimelineProps) {
  const sorted = [...items].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-2">
      {sorted.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect?.(item)}
          className={cn(
            "w-full text-left rounded-lg border p-3 transition-all hover:bg-slate-700/30",
            selectedId === item.id
              ? "border-cyan-500/50 bg-cyan-500/10"
              : "border-slate-700/30 bg-slate-800/30"
          )}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg shrink-0">{typeIcons[item.type] || '📄'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded border", statusColors[item.status])}>
                  {item.status.toUpperCase()}
                </span>
                <span className={cn("text-[10px] font-mono", confidenceColors[item.confidence])}>
                  {item.confidenceScore}%
                </span>
                <span className="text-[9px] text-slate-500 ml-auto">{timeAgo(item.timestamp)}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">{item.description}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {item.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[8px] text-slate-500 bg-slate-700/30 px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </button>
      ))}
      {sorted.length === 0 && (
        <p className="text-center text-[11px] text-slate-500 py-6">No evidence items found.</p>
      )}
    </div>
  );
}
