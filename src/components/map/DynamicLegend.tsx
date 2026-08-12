"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { getLayerDefinition, formatValue, getVisualCategory, classifyValue } from "@/geospatial/layers/layer-utils";

interface DynamicLegendProps {
  layerId: string;
  value: number | string | undefined | null;
  compact?: boolean;
}

/**
 * DynamicLegend - Legend that updates automatically based on the selected layer.
 * Shows thresholds, current value, and description.
 */
export default function DynamicLegend({
  layerId,
  value,
  compact = true,
}: DynamicLegendProps) {
  const definition = getLayerDefinition(layerId);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!definition) {
    return (
      <div className="p-4 bg-slate-900/50 rounded-border border-slate-700/30 text-slate-400">
        <p className="text-sm">Layer unavailable</p>
      </div>
    );
  }

  // Compute visual category if value provided
  const visualCategory = value !== undefined && value !== null ? getVisualCategory(
    Number(value),
    definition
  ) : null;

  const toggleExpand = useCallback(() => setIsExpanded((s) => !s), []);

  // Build the value class string
  const valueClass = cn(
    "text-[10px] font-medium",
    visualCategory?.category === "Critical" && "text-red-400",
    visualCategory?.category === "High" && "text-orange-400",
    visualCategory?.category === "Moderate" && "text-yellow-400",
    visualCategory?.category === "Low" && "text-cyan-400"
  );

  const handleClick = useCallback(() => setIsExpanded((s) => !s), []);

  return (
    <div
      className={cn(
        "p-3 bg-slate-900/50 rounded-border border-slate-700/30 cursor-pointer hover:opacity-80 transition-opacity",
        isExpanded && "border-2 border-cyan-500"
      )}
      onClick={handleClick}
      aria-label={`Legend for ${definition.name}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-slate-300 truncate">
          {definition.name}
        </span>
        {isExpanded ? (
          <button
            onClick={toggleExpand}
            className="p-1 rounded hover:bg-slate-800 text-slate-400"
            aria-label="Collapse legend"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        ) : (
          <button
            onClick={toggleExpand}
            className="p-1 rounded hover:bg-slate-800 text-slate-400"
            aria-label="Expand legend"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        )}

        {/* Show value if provided */}
        {value !== undefined && value !== null && (
          <span className={valueClass}>
            {formatValue(value, definition)}
          </span>
        )}
      </div>

      {/* Legend thresholds */}
      <div className={cn(
        "mt-2 text-[10px] text-slate-500",
        compact ? "" : "grid grid-cols-2 gap-1 text-[9px] text-slate-400"
      )}>
        {definition.thresholds?.map((threshold, i) => {
          const nextThreshold = definition.thresholds?.[i + 1];
          const rangeLabel = threshold === definition.thresholds?.[0]
            ? `0–${threshold}`
            : nextThreshold
              ? `${threshold}-${nextThreshold}`
              : `>${threshold}`;

          const categoryLabel = classifyValue(
            (threshold + (definition.thresholds?.[i + 1] || threshold + 20)) / 2,
            definition.thresholds || [],
            ["Very Low", "Low", "Moderate", "High", "Critical"]
          )?.category || rangeLabel;

          return (
            <div
              key={threshold}
              className={cn(
                "flex items-center gap-1.5",
                compact ? "text-slate-500" : `bg-${['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'][i] || '#64748b'}10`
              )}
            >
              <div
                className={cn(
                  compact ? "" : `w-2 h-2 rounded`,
                  compact ? "" : `bg-${['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'][i] || '#64748b'}`
                )}
              ></div>
              <span className="whitespace-nowrap">{rangeLabel}</span>
            </div>
          );
        })}

        {!compact && definition.thresholds &&
          definition.thresholds.length > 0 && (
            <div key="extra" className="mt-1 text-[10px] text-slate-500">
              <span className="font-medium">{String('>')}{definition.thresholds[definition.thresholds.length - 1]}</span>
              <span className="ml-1">{definition.dataType === 'percentage' ? '%' : definition.unit || ''}</span>
            </div>
          )}
      </div>

      {/* Expanded view */}
      {isExpanded && (
        <div className="mt-3 p-3 bg-slate-900/70 rounded border border-slate-600/30 text-[10px] text-slate-400">
          <p className="font-medium">{definition.name}</p>
          <p className="mt-1">{definition.description || ''}</p>
          <p className="mt-1 text-[9px]">
            <span className="font-medium">Unit:</span> {definition.unit || "—"}
          </p>
          {value !== undefined && value !== null && (
            <p className="mt-2">
              <span className="font-medium">Current value:</span>{" "}{formatValue(value, definition)}
            </p>
          )}
          <p className="mt-2 text-xs">
            <span className="font-medium">Data source:</span>{" "}{definition.source || "—"}
          </p>
        </div>
      )}
    </div>
  );
}