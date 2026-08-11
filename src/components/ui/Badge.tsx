import type { SeverityLevel } from "@/lib/types";
import { severityColor, severityDot } from "@/lib/utils";

interface BadgeProps {
  severity: SeverityLevel;
  size?: "sm" | "md";
}

export function Badge({ severity, size = "sm" }: BadgeProps) {
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${severityColor(severity)} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${severityDot(severity)}`} />
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}
