import Link from "next/link";
import { pipelineStages } from "@/lib/mock-data";

const evidenceSources = [
  {
    icon: "S",
    name: "Satellite",
    description: "Multi-spectral and SAR imagery for wide-area damage detection.",
  },
  {
    icon: "D",
    name: "Drone",
    description: "High-resolution orthophotos and thermal data for close-range inspection.",
  },
  {
    icon: "C",
    name: "Citizen",
    description: "Crowdsourced damage reports with photo verification.",
  },
  {
    icon: "G",
    name: "Geospatial",
    description: "IoT sensor networks measuring water levels, seismic activity, and structural health.",
  },
];

const differentiators = [
  {
    title: "Damage Severity",
    symbol: "≠",
    subtitle: "Recovery Priority",
    description:
      "A severely damaged building can have a lower recovery priority than a moderately damaged bridge. RAKVA evaluates consequence, not just destruction.",
  },
  {
    title: "Evidence Confidence",
    symbol: "→",
    subtitle: "Verified Assessment",
    description:
      "Citizen reports are not automatically treated as truth. Each source is cross-referenced, validated, and assigned a confidence level.",
  },
  {
    title: "Multi-Source Fusion",
    symbol: "→",
    subtitle: "Unified Understanding",
    description:
      "Satellite, drone, citizen, and geospatial data are fused into a single coherent damage picture with quantified confidence.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
      {/* Hero Section */}
      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
            DEMO MODE
          </span>
          <span className="rounded-full border border-slate-600/30 bg-slate-700/20 px-3 py-1 text-xs text-slate-400">
            CONCEPTUAL DEMONSTRATION
          </span>
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Disaster Intelligence
          <span className="block text-cyan-400">& Recovery Planning</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
          RAKVA doesn&apos;t just detect damage. It determines{" "}
          <strong className="text-slate-200">what should be addressed first</strong>{" "}
          — and explains{" "}
          <strong className="text-slate-200">why</strong>.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/command-center"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
          >
            Open Command Center
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            How It Works
          </Link>
        </div>
      </div>

      {/* Core Question */}
      <div className="mt-20 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent p-8 lg:p-12">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-10">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10">
            <span className="text-2xl font-bold text-cyan-400">?</span>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400/60">
              The Core Question
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              What should be addressed first — and why?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              In a disaster, everything is damaged. Resources are limited. RAKVA
              provides explainable prioritization recommendations that help
              decision-makers allocate recovery resources where they will have
              the greatest impact.
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline Flow */}
      <div className="mt-20">
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            RAKVA Pipeline
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">
            From Evidence to Explainable Recommendations
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-5">
          {pipelineStages.map((stage, i) => (
            <div key={stage.id} className="relative">
              <div
                className={`rounded-lg border p-4 text-center ${
                  stage.status === "completed"
                    ? "border-cyan-500/30 bg-cyan-500/5"
                    : stage.status === "active"
                      ? "border-cyan-400/40 bg-cyan-400/10"
                      : "border-slate-700/30 bg-slate-800/30"
                }`}
              >
                <div
                  className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ${
                    stage.status === "completed"
                      ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                      : stage.status === "active"
                        ? "border-cyan-400 bg-cyan-400/30 text-cyan-300 animate-pulse"
                        : "border-slate-600 bg-slate-700/50 text-slate-500"
                  }`}
                >
                  {i + 1}
                </div>
                <h3 className="text-sm font-semibold text-white">{stage.label}</h3>
                <p className="mt-1 text-xs text-slate-400">{stage.description}</p>
              </div>
              {i < pipelineStages.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 text-slate-600 sm:block">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pipeline Output Label */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="h-4 w-px bg-cyan-500/30" />
          <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-400">
            OUTPUT: Explainable Recovery Priority Recommendation
          </div>
        </div>
      </div>

      {/* Evidence Sources */}
      <div className="mt-20">
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Multi-Source Evidence
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">
            Four Data Sources, One Unified Assessment
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            No single source tells the whole story. RAKVA fuses evidence from
            multiple modalities to build a comprehensive damage picture.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {evidenceSources.map((src) => (
            <div
              key={src.name}
              className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-600/40 bg-slate-700/30 text-sm font-bold text-slate-300">
                {src.icon}
              </div>
              <h3 className="text-sm font-semibold text-white">{src.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {src.description}
              </p>
            </div>
          ))}
        </div>

        {/* Fusion Arrow */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-slate-700/40 px-2 py-0.5 text-[10px] font-mono text-slate-400">S</span>
            <span className="text-[10px] text-slate-600">+</span>
            <span className="rounded bg-slate-700/40 px-2 py-0.5 text-[10px] font-mono text-slate-400">D</span>
            <span className="text-[10px] text-slate-600">+</span>
            <span className="rounded bg-slate-700/40 px-2 py-0.5 text-[10px] font-mono text-slate-400">C</span>
            <span className="text-[10px] text-slate-600">+</span>
            <span className="rounded bg-slate-700/40 px-2 py-0.5 text-[10px] font-mono text-slate-400">G</span>
          </div>
          <div className="h-3 w-px bg-cyan-500/30" />
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-[10px] font-medium text-cyan-400">
            EVIDENCE FUSION
          </span>
        </div>
      </div>

      {/* Key Differentiator */}
      <div className="mt-20">
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Key Differentiator
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">
            Damage Severity ≠ Recovery Priority
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            RAKVA evaluates downstream consequence, not just physical destruction.
            A moderately damaged bridge with high consequence can outrank a
            severely damaged building with low consequence.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {differentiators.map((diff) => (
            <div
              key={diff.title}
              className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-bold text-slate-300">{diff.title}</span>
                <span className="text-lg font-bold text-cyan-400">{diff.symbol}</span>
                <span className="text-sm font-bold text-slate-300">{diff.subtitle}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                {diff.description}
              </p>
            </div>
          ))}
        </div>

        {/* Example Comparison */}
        <div className="mt-6 rounded-lg border border-slate-700/30 bg-slate-800/20 p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-4">
            Conceptual Example
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-md border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-500">BUILDING-031</span>
                <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
                  Severe Damage
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-300">Priority: 68</p>
              <p className="mt-1 text-xs text-slate-400">
                Lower downstream consequence. Localized impact.
              </p>
            </div>
            <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-500">BRIDGE-024</span>
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
                  Moderate Damage
                </span>
              </div>
              <p className="text-2xl font-bold text-cyan-400">Priority: 94</p>
              <p className="mt-1 text-xs text-slate-400">
                Hospital connection. Multiple communities dependent.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <span className="text-cyan-400 font-semibold">→</span>
            Moderate damage with high consequence ranks higher than severe damage with low consequence.
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 rounded-xl border border-slate-700/30 bg-slate-800/30 p-8 text-center lg:p-12">
        <h2 className="text-2xl font-bold text-white">
          See It In Action
        </h2>
        <p className="mt-3 max-w-lg mx-auto text-sm text-slate-400">
          The Command Center demonstrates RAKVA&apos;s full intelligence workflow:
          from multi-source evidence to explainable recovery prioritization.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/command-center"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-8 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
          >
            Open Command Center
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* About This Demo */}
      <div className="mt-12 rounded-lg border border-slate-700/50 bg-slate-800/30 p-6">
        <h3 className="text-sm font-semibold text-slate-300">About This Demo</h3>
        <p className="mt-2 text-sm text-slate-400">
          All data shown throughout this application is synthetic demo data
          created for illustration purposes. It does not represent real disaster
          events, real locations, or real assessments. The pipeline and
          reasoning capabilities shown are architectural demonstrations of how
          RAKVA would function with real data sources.
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
          <span>Conceptual Demonstration</span>
          <span className="text-slate-700">|</span>
          <span>No real data used</span>
          <span className="text-slate-700">|</span>
          <span>Architectural preview</span>
        </div>
      </div>
    </div>
  );
}
