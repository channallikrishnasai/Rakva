import Link from "next/link";
import { Card } from "@/components/ui";
import { pipelineStages } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-4">
        <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
          DEMO MODE
        </span>
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Disaster Intelligence
        <span className="block text-cyan-400">& Recovery Planning</span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-slate-400">
        RAKVA doesn&apos;t just detect damage. It determines what should be
        addressed first — and explains why.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/command-center"
          className="rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
        >
          Open Command Center
        </Link>
        <Link
          href="/how-it-works"
          className="rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          How It Works
        </Link>
      </div>

      <div className="mt-16">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Pipeline
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-5">
          {pipelineStages.map((stage, i) => (
            <Card key={stage.id} className="text-center">
              <div
                className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  stage.status === "completed"
                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                    : stage.status === "active"
                      ? "border-cyan-400 bg-cyan-400/30 text-cyan-300"
                      : "border-slate-600 bg-slate-700/50 text-slate-500"
                }`}
              >
                {i + 1}
              </div>
              <h3 className="text-sm font-semibold text-white">{stage.label}</h3>
              <p className="mt-1 text-xs text-slate-400">{stage.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-lg border border-slate-700/50 bg-slate-800/30 p-6">
        <h3 className="text-sm font-semibold text-slate-300">About This Demo</h3>
        <p className="mt-2 text-sm text-slate-400">
          All data shown throughout this application is synthetic demo data
          created for illustration purposes. It does not represent real disaster
          events, real locations, or real assessments. The pipeline and
          reasoning capabilities shown are architectural demonstrations of how
          RAKVA would function with real data sources.
        </p>
      </div>
    </div>
  );
}
