import type { PipelineStage } from "@/lib/types";

interface PipelineVisualProps {
  stages: PipelineStage[];
}

export function PipelineVisual({ stages }: PipelineVisualProps) {
  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, i) => (
        <div key={stage.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${
                stage.status === "completed"
                  ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                  : stage.status === "active"
                    ? "border-cyan-400 bg-cyan-400/30 text-cyan-300 animate-pulse"
                    : "border-slate-600 bg-slate-700/50 text-slate-500"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`mt-1.5 text-[10px] font-medium ${
                stage.status === "active"
                  ? "text-cyan-400"
                  : stage.status === "completed"
                    ? "text-slate-300"
                    : "text-slate-500"
              }`}
            >
              {stage.label}
            </span>
          </div>
          {i < stages.length - 1 && (
            <div
              className={`mx-1 mb-5 h-px w-8 ${
                stage.status === "completed" ? "bg-cyan-500/50" : "bg-slate-600/50"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
