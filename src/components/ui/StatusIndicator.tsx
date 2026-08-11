interface StatusIndicatorProps {
  status: "online" | "delayed" | "offline";
  label: string;
}

const statusConfig = {
  online: { dot: "bg-emerald-400", text: "text-emerald-400", label: "Online" },
  delayed: { dot: "bg-yellow-400", text: "text-yellow-400", label: "Delayed" },
  offline: { dot: "bg-red-400", text: "text-red-400", label: "Offline" },
} as const;

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      <span className="text-xs text-slate-300">{label}</span>
      <span className={`text-xs ${config.text}`}>{config.label}</span>
    </div>
  );
}
