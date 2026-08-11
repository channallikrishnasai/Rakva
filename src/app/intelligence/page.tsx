import { Card, CardHeader, MetricCard } from "@/components/ui";
import { damageReports, intelligenceSummary } from "@/lib/mock-data";
import { severityColor } from "@/lib/utils";

export default function IntelligencePage() {
  const summary = intelligenceSummary;
  const bySeverity = {
    critical: damageReports.filter((r) => r.severity === "critical"),
    high: damageReports.filter((r) => r.severity === "high"),
    medium: damageReports.filter((r) => r.severity === "medium"),
    monitored: damageReports.filter((r) => r.severity === "monitored"),
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Intelligence</h1>
          <p className="mt-1 text-sm text-slate-400">
            Aggregated damage assessment and severity classification
          </p>
        </div>
        <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
          DEMO DATA
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Critical" value={summary.criticalCount} accent="red" />
        <MetricCard label="High" value={summary.highCount} accent="orange" />
        <MetricCard label="Medium" value={summary.mediumCount} accent="yellow" />
        <MetricCard label="Monitored" value={summary.monitoredCount} accent="slate" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {(["critical", "high", "medium", "monitored"] as const).map((severity) => (
          <Card key={severity}>
            <CardHeader
              title={`${severity.charAt(0).toUpperCase() + severity.slice(1)} Severity`}
              subtitle={`${bySeverity[severity].length} incidents`}
            />
            {bySeverity[severity].length === 0 ? (
              <p className="text-sm text-slate-500">No incidents at this severity.</p>
            ) : (
              <div className="space-y-3">
                {bySeverity[severity].map((report) => (
                  <div
                    key={report.id}
                    className="rounded-md border border-slate-700/30 bg-slate-900/50 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">
                        {report.id}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${severityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                    </div>
                    <h4 className="mt-1 text-sm font-medium text-white">
                      {report.type}
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-400">{report.location}</p>
                    <p className="mt-2 text-xs text-slate-500">{report.description}</p>
                    <div className="mt-3 rounded-md bg-slate-800/50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                        Explainability
                      </p>
                      <p className="mt-1 text-xs text-slate-300">{report.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
