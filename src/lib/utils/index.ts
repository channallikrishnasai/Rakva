import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function severityColor(severity: string): string {
  switch (severity) {
    case "critical":
      return "text-red-500 bg-red-500/10 border-red-500/20";
    case "high":
      return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    case "medium":
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    case "monitored":
      return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    default:
      return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  }
}

export function severityDot(severity: string): string {
  switch (severity) {
    case "critical":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-yellow-500";
    case "monitored":
      return "bg-slate-400";
    default:
      return "bg-slate-400";
  }
}

export function dataSourceIcon(source: string): string {
  switch (source) {
    case "satellite":
      return "🛰";
    case "drone":
      return "🛩";
    case "citizen":
      return "👤";
    case "geospatial":
      return "📊";
    default:
      return "📁";
  }
}
