import type { DamageReport } from "@/lib/types";

export const damageReports: DamageReport[] = [
  {
    id: "RPT-001",
    location: "Coastal District — Sector 7",
    coordinates: { lat: 28.6139, lng: 77.209 },
    severity: "critical",
    type: "Structural Collapse",
    description:
      "Multi-story residential building partially collapsed following flooding. Foundation undermined. Immediate evacuation zone established.",
    sources: ["satellite", "drone", "citizen"],
    confidence: 0.94,
    timestamp: "2026-08-10T14:32:00Z",
    assignedPriority: 1,
    explanation:
      "Highest priority: active structural hazard in densely populated area with confirmed casualties reported via citizen reports. Satellite imagery confirms collapse extent. Drone footage shows ongoing instability.",
  },
  {
    id: "RPT-002",
    location: "River Bridge — Route 12",
    coordinates: { lat: 28.62, lng: 77.215 },
    severity: "critical",
    type: "Infrastructure Failure",
    description:
      "Primary bridge over river showing significant structural damage. Approach roads partially washed out. Critical evacuation route compromised.",
    sources: ["satellite", "geospatial"],
    confidence: 0.91,
    timestamp: "2026-08-10T13:15:00Z",
    assignedPriority: 2,
    explanation:
      "Critical infrastructure at risk: bridge serves as primary evacuation corridor for 3 neighborhoods. Geospatial analysis confirms approach road washout. Failure would isolate approximately 12,000 residents.",
  },
  {
    id: "RPT-003",
    location: "Municipal Hospital — East Wing",
    coordinates: { lat: 28.608, lng: 77.22 },
    severity: "high",
    type: "Utility Disruption",
    description:
      "Hospital backup generators failing. Main power grid offline. Medical operations at risk within 6 hours.",
    sources: ["citizen", "geospatial"],
    confidence: 0.87,
    timestamp: "2026-08-10T12:45:00Z",
    assignedPriority: 3,
    explanation:
      "High priority: active medical facility with critical care patients. Power restoration is prerequisite for continued operations. Geospatial data confirms grid outage radius. Citizen reports verify generator fuel shortage.",
  },
  {
    id: "RPT-004",
    location: "Residential Area — Block C",
    coordinates: { lat: 28.618, lng: 77.203 },
    severity: "high",
    type: "Flooding",
    description:
      "Sustained flooding in residential block. Water levels rising. Multiple families trapped on upper floors.",
    sources: ["drone", "citizen"],
    confidence: 0.89,
    timestamp: "2026-08-10T15:10:00Z",
    assignedPriority: 4,
    explanation:
      "High priority: confirmed trapped civilians with rising water levels. Drone imagery shows 14 structures affected. Citizen distress calls corroborate ongoing entrapment. Time-sensitive rescue window.",
  },
  {
    id: "RPT-005",
    location: "Industrial Zone — North",
    coordinates: { lat: 28.635, lng: 77.218 },
    severity: "medium",
    type: "Chemical Hazard",
    description:
      "Industrial facility reporting potential chemical leak. Wind analysis suggests drift toward residential area.",
    sources: ["satellite", "geospatial"],
    confidence: 0.78,
    timestamp: "2026-08-10T11:20:00Z",
    assignedPriority: 5,
    explanation:
      "Medium priority with escalation potential: chemical release vector depends on wind shift. Satellite thermal imaging confirms anomaly. Geospatial wind modeling shows residential exposure possible within 4 hours if conditions change.",
  },
  {
    id: "RPT-006",
    location: "Highway Interchange — Junction 5",
    coordinates: { lat: 28.625, lng: 77.228 },
    severity: "medium",
    type: "Road Obstruction",
    description:
      "Landslide debris blocking major highway interchange. Alternate routes available but congested.",
    sources: ["satellite", "citizen"],
    confidence: 0.92,
    timestamp: "2026-08-10T10:55:00Z",
    assignedPriority: 6,
    explanation:
      "Medium priority: road obstruction impacts logistics and supply chain. Alternate routes functional but degraded. Not immediately life-threatening but affects recovery resource delivery.",
  },
  {
    id: "RPT-007",
    location: "Agricultural Sector — East",
    coordinates: { lat: 28.64, lng: 77.235 },
    severity: "monitored",
    type: "Crop Damage",
    description:
      "Extensive crop damage from flooding. Long-term food supply impact under assessment.",
    sources: ["satellite"],
    confidence: 0.85,
    timestamp: "2026-08-10T09:30:00Z",
    assignedPriority: 7,
    explanation:
      "Monitored: significant agricultural impact with no immediate life safety concern. Satellite multispectral analysis confirms crop loss. Long-term food security assessment underway.",
  },
  {
    id: "RPT-008",
    location: "Water Treatment — Plant 2",
    coordinates: { lat: 28.612, lng: 77.198 },
    severity: "high",
    type: "Utility Disruption",
    description:
      "Water treatment plant offline. Contamination risk in downstream supply. Boil-water advisory issued.",
    sources: ["geospatial", "citizen"],
    confidence: 0.88,
    timestamp: "2026-08-10T14:00:00Z",
    assignedPriority: 8,
    explanation:
      "High priority: public health risk from contaminated water supply. Affects approximately 45,000 residents. Geospatial flow analysis maps contamination radius. Restoration estimated at 18-24 hours.",
  },
];
