interface MetricCardProps {
  label: string;
  value: number | string;
  accent?: "red" | "orange" | "yellow" | "cyan" | "slate";
}

const accentMap = {
  red: "text-red-400",
  orange: "text-orange-400",
  yellow: "text-yellow-400",
  cyan: "text-cyan-400",
  slate: "text-slate-300",
};

export function MetricCard({ label, value, accent = "cyan" }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accentMap[accent]}`}>{value}</p>
    </div>
  );
}
