"use client";

import { EvidenceFilter, EvidenceType, EvidenceStatus, EvidenceConfidence } from '@/core/contracts';
import { cn } from '@/lib/utils';

const typeOptions: { value: EvidenceType; label: string }[] = [
  { value: 'satellite_image', label: 'Satellite' },
  { value: 'drone_footage', label: 'Drone' },
  { value: 'citizen_report', label: 'Citizen' },
  { value: 'sensor_reading', label: 'Sensor' },
  { value: 'official_report', label: 'Official' },
  { value: 'social_media', label: 'Social' },
];

const statusOptions: { value: EvidenceStatus; label: string }[] = [
  { value: 'verified', label: 'Verified' },
  { value: 'verifying', label: 'Verifying' },
  { value: 'pending', label: 'Pending' },
  { value: 'conflict', label: 'Conflict' },
];

const confidenceOptions: { value: EvidenceConfidence; label: string }[] = [
  { value: 'very-high', label: 'Very High' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

interface EvidenceFiltersProps {
  filter: EvidenceFilter;
  onChange: (filter: EvidenceFilter) => void;
}

export function EvidenceFiltersComponent({ filter, onChange }: EvidenceFiltersProps) {
  const toggleArrayFilter = <T extends string>(key: keyof EvidenceFilter, value: T) => {
    const current = (filter[key] as T[] | undefined) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ ...filter, [key]: updated.length > 0 ? updated : undefined });
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search evidence..."
          value={filter.searchQuery || ''}
          onChange={(e) => onChange({ ...filter, searchQuery: e.target.value || undefined })}
          className="w-full px-3 py-1.5 text-[10px] bg-slate-800/50 border border-slate-700/50 rounded text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      {/* Types */}
      <div>
        <label className="text-[9px] font-medium text-slate-500 mb-1.5 block">SOURCE TYPE</label>
        <div className="flex flex-wrap gap-1">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleArrayFilter('types', opt.value)}
              className={cn(
                "px-2 py-0.5 text-[9px] rounded border transition-colors",
                filter.types?.includes(opt.value)
                  ? "bg-cyan-600/20 text-cyan-400 border-cyan-500/30"
                  : "bg-slate-800/30 text-slate-400 border-slate-700/30 hover:border-slate-600/50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="text-[9px] font-medium text-slate-500 mb-1.5 block">STATUS</label>
        <div className="flex flex-wrap gap-1">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleArrayFilter('statuses', opt.value)}
              className={cn(
                "px-2 py-0.5 text-[9px] rounded border transition-colors",
                filter.statuses?.includes(opt.value)
                  ? "bg-cyan-600/20 text-cyan-400 border-cyan-500/30"
                  : "bg-slate-800/30 text-slate-400 border-slate-700/30 hover:border-slate-600/50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Confidence */}
      <div>
        <label className="text-[9px] font-medium text-slate-500 mb-1.5 block">CONFIDENCE</label>
        <div className="flex flex-wrap gap-1">
          {confidenceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleArrayFilter('confidence', opt.value)}
              className={cn(
                "px-2 py-0.5 text-[9px] rounded border transition-colors",
                filter.confidence?.includes(opt.value)
                  ? "bg-cyan-600/20 text-cyan-400 border-cyan-500/30"
                  : "bg-slate-800/30 text-slate-400 border-slate-700/30 hover:border-slate-600/50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {(filter.types?.length || filter.statuses?.length || filter.confidence?.length || filter.searchQuery) && (
        <button
          onClick={() => onChange({})}
          className="text-[9px] text-cyan-400 hover:text-cyan-300"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
