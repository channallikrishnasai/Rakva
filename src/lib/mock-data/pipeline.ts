import type {
  PipelineStage,
  RecoveryTask,
  IntelligenceSummary,
  DataSourceStatus,
} from "@/lib/types";

export const pipelineStages: PipelineStage[] = [
  {
    id: "collect",
    label: "Collect",
    description: "Gathering data from satellite, drone, citizen, and geospatial sources",
    status: "completed",
  },
  {
    id: "understand",
    label: "Understand",
    description: "Fusing multi-source evidence into coherent damage assessment",
    status: "completed",
  },
  {
    id: "validate",
    label: "Validate",
    description: "Cross-referencing reports and confirming severity classifications",
    status: "completed",
  },
  {
    id: "prioritize",
    label: "Prioritize",
    description: "Ranking recovery actions by consequence and feasibility",
    status: "active",
  },
  {
    id: "explain",
    label: "Explain",
    description: "Generating transparent reasoning for each recommendation",
    status: "pending",
  },
];

export const recoveryTasks: RecoveryTask[] = [
  {
    id: "TSK-001",
    reportId: "RPT-001",
    title: "Emergency structural stabilization",
    severity: "critical",
    status: "pending",
    estimatedDuration: "12-18 hours",
    resourcesRequired: ["Structural engineering team", "Heavy machinery", "Hazmat assessment"],
    rationale: "Active collapse zone with potential survivors. Stabilization prerequisite for search-and-rescue operations.",
  },
  {
    id: "TSK-002",
    reportId: "RPT-002",
    title: "Emergency bridge assessment",
    severity: "critical",
    status: "pending",
    estimatedDuration: "6-8 hours",
    resourcesRequired: ["Bridge inspection team", "Temporary bridging equipment"],
    rationale: "Bridge integrity must be confirmed before reopening evacuation corridor. Failure would isolate 12,000 residents.",
  },
  {
    id: "TSK-003",
    reportId: "RPT-003",
    title: "Hospital power restoration",
    severity: "high",
    status: "in-progress",
    estimatedDuration: "4-6 hours",
    resourcesRequired: ["Emergency generator", "Fuel supply", "Electrical team"],
    rationale: "Active medical facility with critical care dependency. Power restoration is time-critical for patient safety.",
  },
  {
    id: "TSK-004",
    reportId: "RPT-004",
    title: "Water rescue operations",
    severity: "high",
    status: "in-progress",
    estimatedDuration: "8-12 hours",
    resourcesRequired: ["Water rescue teams", "Boats", "Medical evacuation"],
    rationale: "Confirmed trapped civilians with rising water. Time-sensitive extraction required.",
  },
  {
    id: "TSK-005",
    reportId: "RPT-008",
    title: "Water treatment plant restoration",
    severity: "high",
    status: "pending",
    estimatedDuration: "18-24 hours",
    resourcesRequired: ["Water treatment engineers", "Chemical testing equipment", "Pump systems"],
    rationale: "Public health risk from contaminated supply affecting 45,000 residents. Restoration eliminates ongoing contamination vector.",
  },
];

export const intelligenceSummary: IntelligenceSummary = {
  totalIncidents: 8,
  criticalCount: 2,
  highCount: 3,
  mediumCount: 2,
  monitoredCount: 1,
  lastUpdated: "2026-08-10T15:30:00Z",
  region: "Metro District — Flood Event",
};

export const dataSourceStatuses: DataSourceStatus[] = [
  {
    source: "satellite",
    label: "Satellite Imagery",
    status: "online",
    lastSync: "2026-08-10T15:25:00Z",
    recordsContributed: 342,
  },
  {
    source: "drone",
    label: "Drone Surveillance",
    status: "online",
    lastSync: "2026-08-10T15:28:00Z",
    recordsContributed: 128,
  },
  {
    source: "citizen",
    label: "Citizen Reports",
    status: "online",
    lastSync: "2026-08-10T15:30:00Z",
    recordsContributed: 89,
  },
  {
    source: "geospatial",
    label: "Geospatial Sensors",
    status: "delayed",
    lastSync: "2026-08-10T14:50:00Z",
    recordsContributed: 215,
  },
];
