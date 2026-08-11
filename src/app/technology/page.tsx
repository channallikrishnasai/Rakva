import { Card, CardHeader } from "@/components/ui";

const capabilities = [
  {
    title: "Satellite Integration",
    description:
      "Multi-spectral and SAR satellite imagery for wide-area damage detection. Change detection algorithms identify structural damage, flooding, and land subsidence.",
    sources: ["Optical imagery (Sentinel-2, Planet)", "SAR (Sentinel-1)", "Thermal (Landsat)"],
  },
  {
    title: "Drone Surveillance",
    description:
      "High-resolution orthophotos and thermal imagery from autonomous drone flights. Enables centimeter-level inspection of critical infrastructure.",
    sources: ["RGB orthomosaics", "Thermal imaging", "LiDAR point clouds"],
  },
  {
    title: "Citizen Reports",
    description:
      "Crowdsourced damage reports with photo verification. Natural language processing extracts structured damage data from free-text submissions.",
    sources: ["Web and mobile submissions", "Photo verification", "NLP extraction"],
  },
  {
    title: "Geospatial Sensors",
    description:
      "IoT sensor networks measuring water levels, seismic activity, air quality, and structural vibration. Real-time telemetry feeds into risk models.",
    sources: ["Hydrological sensors", "Seismometers", "Air quality monitors", "Structural health monitors"],
  },
  {
    title: "Evidence Fusion Engine",
    description:
      "Multi-modal data fusion combining satellite, drone, citizen, and sensor data into unified damage assessments with quantified confidence.",
    sources: ["Bayesian fusion", "Spatial interpolation", "Temporal alignment", "Source weighting"],
  },
  {
    title: "Explainable AI",
    description:
      "Every recommendation includes human-readable reasoning, source attribution, confidence intervals, and comparison to alternative actions. No black-box decisions.",
    sources: ["Per-decision rationale", "Source traceability", "Uncertainty quantification", "Audit trail"],
  },
];

export default function TechnologyPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Technology</h1>
          <p className="mt-1 text-sm text-slate-400">
            The technical architecture behind RAKVA
          </p>
        </div>
        <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
          DEMO DATA
        </span>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((cap) => (
          <Card key={cap.title}>
            <CardHeader title={cap.title} />
            <p className="text-sm text-slate-400">{cap.description}</p>
            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Data Sources
              </p>
              <ul className="mt-2 space-y-1">
                {cap.sources.map((src) => (
                  <li
                    key={src}
                    className="flex items-center gap-2 text-xs text-slate-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-cyan-400" />
                    {src}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-slate-700/50 bg-slate-800/30 p-6">
        <h3 className="text-sm font-semibold text-slate-300">
          Architecture Principles
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <h4 className="text-xs font-semibold text-cyan-400">Modular</h4>
            <p className="mt-1 text-xs text-slate-400">
              Each data source and processing stage is independently swappable.
              New sources integrate without modifying core pipeline.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-cyan-400">Auditable</h4>
            <p className="mt-1 text-xs text-slate-400">
              Every decision traces back to source data and reasoning. Full
              audit trail for accountability and improvement.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-cyan-400">Progressive</h4>
            <p className="mt-1 text-xs text-slate-400">
              Starts with demo data. Designed to seamlessly transition to live
              satellite feeds, drone fleets, and sensor networks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
