"use client";

import type { DisasterType, AssetType, FilterPriority } from "@/lib/types/command-center";

interface FilterControlsProps {
  disasterType: DisasterType | "all";
  assetType: AssetType | "all";
  priority: FilterPriority | "all";
  evidence: string;
  onDisasterTypeChange: (v: DisasterType | "all") => void;
  onAssetTypeChange: (v: AssetType | "all") => void;
  onPriorityChange: (v: FilterPriority | "all") => void;
  onEvidenceChange: (v: string) => void;
}

const disasterTypes: { value: DisasterType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "flood", label: "Flood" },
  { value: "cyclone", label: "Cyclone" },
  { value: "landslide", label: "Landslide" },
  { value: "earthquake", label: "Earthquake" },
];

const assetTypes: { value: AssetType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "bridge", label: "Bridge" },
  { value: "road", label: "Road" },
  { value: "building", label: "Building" },
  { value: "hospital", label: "Hospital" },
  { value: "utility", label: "Utility" },
];

const priorities: { value: FilterPriority | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const evidenceTypes = [
  { value: "all", label: "All" },
  { value: "satellite", label: "Satellite" },
  { value: "drone", label: "Drone" },
  { value: "citizen", label: "Citizen" },
  { value: "geospatial", label: "Geospatial" },
];

export function FilterControls({
  disasterType,
  assetType,
  priority,
  evidence,
  onDisasterTypeChange,
  onAssetTypeChange,
  onPriorityChange,
  onEvidenceChange,
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-slate-500">DISASTER</span>
        <select
          value={disasterType}
          onChange={(e) => onDisasterTypeChange(e.target.value as DisasterType | "all")}
          className="rounded border border-slate-700/50 bg-slate-800/80 px-2 py-1 text-[10px] text-slate-300 outline-none focus:border-cyan-500/50"
        >
          {disasterTypes.map((dt) => (
            <option key={dt.value} value={dt.value}>{dt.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-slate-500">ASSET</span>
        <select
          value={assetType}
          onChange={(e) => onAssetTypeChange(e.target.value as AssetType | "all")}
          className="rounded border border-slate-700/50 bg-slate-800/80 px-2 py-1 text-[10px] text-slate-300 outline-none focus:border-cyan-500/50"
        >
          {assetTypes.map((at) => (
            <option key={at.value} value={at.value}>{at.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-slate-500">PRIORITY</span>
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as FilterPriority | "all")}
          className="rounded border border-slate-700/50 bg-slate-800/80 px-2 py-1 text-[10px] text-slate-300 outline-none focus:border-cyan-500/50"
        >
          {priorities.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-slate-500">EVIDENCE</span>
        <select
          value={evidence}
          onChange={(e) => onEvidenceChange(e.target.value)}
          className="rounded border border-slate-700/50 bg-slate-800/80 px-2 py-1 text-[10px] text-slate-300 outline-none focus:border-cyan-500/50"
        >
          {evidenceTypes.map((et) => (
            <option key={et.value} value={et.value}>{et.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
