"use client";

import type { DisasterAsset } from "@/lib/types/command-center";

interface EvidenceTimelineProps {
  asset: DisasterAsset;
}

const timelineData: Record<string, { time: string; source: string; event: string; isPriorityUpdate?: boolean }[]> = {
  "BRIDGE-024": [
    { time: "08:12", source: "SATELLITE", event: "Flood extent detected around bridge area" },
    { time: "09:04", source: "CITIZEN", event: "Bridge obstruction reported by local resident" },
    { time: "09:31", source: "DRONE", event: "Pillar damage confirmed via close-range inspection" },
    { time: "09:42", source: "GEOSPATIAL", event: "Hospital dependency identified in route analysis" },
    { time: "09:45", source: "RAKVA", event: "Priority reassessed", isPriorityUpdate: true },
  ],
  "ROAD-017": [
    { time: "08:30", source: "SATELLITE", event: "Flood submersion detected on main arterial" },
    { time: "09:15", source: "DRONE", event: "Debris accumulation assessed, two lanes blocked" },
    { time: "09:40", source: "CITIZEN", event: "Conflicting reports on passability received" },
    { time: "09:50", source: "RAKVA", event: "Priority reassessed", isPriorityUpdate: true },
  ],
  "BUILDING-031": [
    { time: "08:45", source: "SATELLITE", event: "Thermal anomaly detected at residential complex" },
    { time: "09:20", source: "CITIZEN", event: "Displacement confirmed by building residents" },
    { time: "09:35", source: "DRONE", event: "Structural inspection in progress" },
    { time: "09:48", source: "RAKVA", event: "Priority reassessed", isPriorityUpdate: true },
  ],
  "HOSPITAL-002": [
    { time: "08:00", source: "SATELLITE", event: "Facility status confirmed operational" },
    { time: "08:20", source: "DRONE", event: "Access route assessment complete" },
    { time: "08:35", source: "CITIZEN", event: "Staff reports minor flooding in parking area" },
    { time: "08:50", source: "GEOSPATIAL", event: "Critical facility mapping confirmed" },
    { time: "08:55", source: "RAKVA", event: "Priority reassessed", isPriorityUpdate: true },
  ],
};

const sourceColors: Record<string, string> = {
  SATELLITE: "text-cyan-400",
  DRONE: "text-blue-400",
  CITIZEN: "text-yellow-400",
  GEOSPATIAL: "text-emerald-400",
  RAKVA: "text-cyan-400",
};

const sourceBg: Record<string, string> = {
  SATELLITE: "bg-cyan-500/10",
  DRONE: "bg-blue-500/10",
  CITIZEN: "bg-yellow-500/10",
  GEOSPATIAL: "bg-emerald-500/10",
  RAKVA: "bg-cyan-500/10",
};

export function EvidenceTimeline({ asset }: EvidenceTimelineProps) {
  const events = timelineData[asset.id] || [];

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold tracking-wider text-slate-300">EVIDENCE TIMELINE</h4>
          <span className="text-[10px] text-slate-500">CONCEPTUAL</span>
        </div>
        <p className="text-[11px] text-slate-500">Timeline data available for BRIDGE-024, ROAD-017, BUILDING-031, HOSPITAL-002.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold tracking-wider text-slate-300">EVIDENCE TIMELINE</h4>
        <span className="text-[10px] text-slate-500">CONCEPTUAL</span>
      </div>

      <div className="relative space-y-0">
        {/* Vertical line */}
        <div className="absolute left-[18px] top-2 bottom-2 w-px bg-slate-700/50" />

        {events.map((event, i) => (
          <div key={i} className="relative flex gap-3 py-2">
            {/* Dot */}
            <div className={`relative z-10 mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full ${
              event.isPriorityUpdate ? "bg-cyan-500/20 border border-cyan-500/50" : sourceBg[event.source] || "bg-slate-700"
            }`}>
              {event.isPriorityUpdate && (
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">{event.time}</span>
                <span className={`text-[10px] font-semibold ${sourceColors[event.source] || "text-slate-400"}`}>
                  {event.source}
                </span>
              </div>
              <p className={`mt-0.5 text-[11px] leading-relaxed ${
                event.isPriorityUpdate ? "text-cyan-300 font-medium" : "text-slate-400"
              }`}>
                {event.event}
              </p>
              {event.isPriorityUpdate && i > 0 && (
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500">78</span>
                  <span className="text-[10px] text-cyan-400">→</span>
                  <span className="text-[10px] text-cyan-400 font-bold">94</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
