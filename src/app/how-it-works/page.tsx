import { Card } from "@/components/ui";
import { pipelineStages } from "@/data/mock";

const pipelineDetails = [
  {
    stage: "Collect",
    description:
      "Gather evidence from multiple sources: satellite imagery, drone surveillance, citizen reports, and geospatial sensor networks.",
    details: [
      "Satellite multispectral and SAR imagery",
      "Drone-captured orthophotos and thermal data",
      "Crowdsourced citizen damage reports",
      "Seismic, hydrological, and meteorological sensors",
    ],
  },
  {
    stage: "Understand",
    description:
      "Fuse multi-source evidence into a coherent damage picture. Cross-reference spatial, temporal, and contextual data.",
    details: [
      "Multi-modal evidence fusion",
      "Spatial correlation analysis",
      "Temporal progression tracking",
      "Contextual enrichment from GIS layers",
    ],
  },
  {
    stage: "Validate",
    description:
      "Cross-reference reports against each other and against known infrastructure data to confirm severity classifications.",
    details: [
      "Cross-source verification",
      "Confidence scoring per incident",
      "Anomaly detection and flagging",
      "Human-in-the-loop review triggers",
    ],
  },
  {
    stage: "Prioritize",
    description:
      "Rank recovery actions based on consequence analysis, resource availability, and cascading risk assessment.",
    details: [
      "Life-safety impact scoring",
      "Cascading failure analysis",
      "Resource optimization modeling",
      "Time-critical window identification",
    ],
  },
  {
    stage: "Explain",
    description:
      "Generate transparent, auditable reasoning for every recommendation. No black-box decisions.",
    details: [
      "Per-recommendation rationale",
      "Source attribution for each claim",
      "Confidence intervals and uncertainty",
      "Alternative scenario comparison",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">How It Works</h1>
          <p className="mt-1 text-sm text-slate-400">
            The RAKVA pipeline: from evidence collection to explainable
            recommendations
          </p>
        </div>
        <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
          DEMO DATA
        </span>
      </div>

      <div className="mt-8 flex items-center gap-2">
        {pipelineStages.map((stage, i) => (
          <div key={stage.id} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${
                stage.status === "completed"
                  ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                  : stage.status === "active"
                    ? "border-cyan-400 bg-cyan-400/30 text-cyan-300"
                    : "border-slate-600 bg-slate-700/50 text-slate-500"
              }`}
            >
              {i + 1}
            </div>
            <span className="ml-2 text-sm font-medium text-slate-300">
              {stage.label}
            </span>
            {i < pipelineStages.length - 1 && (
              <div className="mx-4 h-px w-12 bg-slate-600/50" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-6">
        {pipelineDetails.map((item, i) => (
          <Card key={item.stage}>
            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-cyan-500 bg-cyan-500/20 text-lg font-bold text-cyan-400">
                {i + 1}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{item.stage}</h3>
                <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {item.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-center gap-2 text-xs text-slate-300"
                    >
                      <span className="h-1 w-1 rounded-full bg-cyan-400" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
