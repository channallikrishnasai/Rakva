"use client";

import { EnvironmentalVariableId, EnvironmentalVariable, TemporalMode, TemporalContext, DataQuality } from "@/core/contracts";
import { mockEnvironmentalProvider } from "@/data/mock/environmental-provider";
import { cn } from "@/lib/utils";

/**
 * EnvironmentalConditionCard - Reusable card for displaying an environmental variable.
 * 
 * Supports:
 * - Current value with unit
 * - Temporal mode (historical/observed/forecast)
 * - Status/category where configured
 * - Timestamp and source
 * - Confidence where available
 * - Trend indicators where time-series data exists
 * - Demo/simulated marking
 */
export function EnvironmentalConditionCard({
  variable,
  value,
  temporalMode,
  regionName,
  showTrend = false,
  showSource = true,
}: {
  variable: EnvironmentalVariableId;
  value: number | null | undefined;
  temporalMode: TemporalMode;
  regionName: string;
  showTrend?: boolean;
  showSource?: boolean;
}) {
  const provider = mockEnvironmentalProvider;
  const varDef = Object.values(mockEnvironmentalProvider.getAllVariables()).find(
    (v: any) => v.id === variable
  );

  // Compute display value and formatting
  const displayValue = value !== null && value !== undefined 
    ? `${value}${varDef?.unit || ''}`
    : 'No data';

  // Determine status/category based on variable and value
  const status = computeStatus(variable, value, varDef);

  // Compute trend if showing trend and we have previous data
  let trend: 'increasing' | 'stable' | 'decreasing' | null = null;
  if (showTrend && value !== null && value !== undefined) {
    // In a full implementation, this would compare with historical data
    // For now, use a deterministic based on value relative to variable thresholds
    const threshold = varDef?.acceptableRange?.[1];
    if (threshold && value > threshold) {
      trend = 'increasing';
    } else if (threshold && value < threshold * 0.5) {
      trend = 'decreasing';
    } else {
      trend = 'stable';
    }
  }

  // Determine if demo data
  const isDemo = temporalMode === 'historical' || value === undefined;

  // Format temporal mode label
  const temporalLabels: Record<TemporalMode, string> = {
    historical: 'Historical',
    observed: 'Observed',
    forecast: 'Forecast',
  };

  return (
    <div 
      className={cn(
        "rounded-lg border border-slate-700/50 bg-slate-900/80 p-4 hover:bg-slate-800/50 transition-colors cursor-pointer min-w-48"
      )}
      aria-label={`Environmental condition: ${varDef?.name || variable}`}
    >
      <div className="flex flex-col items-start gap-2">
        {/* Variable name */}
        <div className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
          {varDef?.name || variable}
        </div>

        {/* Current value */}
        <div className="flex items-baseline gap-2">
          <div className="text-[18px] font-bold text-white {
            status === 'critical' && 'text-red-400'
            || status === 'high' && 'text-orange-400'
            || status === 'moderate' && 'text-yellow-400'
            || 'text-cyan-400'
          }">
            {displayValue}
          </div>

          {/* Unit */}
          {varDef?.unit && (
            <div className="text-[10px] text-slate-400">
              {varDef.unit}
            </div>
          )}
        </div>

        {/* Temporal mode and trend */}
        <div className="flex items-center gap-2 text-[9px] text-slate-500">
          <span className="font-medium">{temporalLabels[temporalMode] || temporalMode}</span>
          {showTrend && trend && (
            <span className={cn(
              "ml-1",
              trend === 'increasing' && 'text-green-400',
              trend === 'decreasing' && 'text-red-400',
              trend === 'stable' && 'text-slate-400'
            )}>
              {trend === 'increasing' ? '↑' : trend === 'decreasing' ? '↓' : '→'}
            </span>
          )}
        </div>

        {/* Trend indicator (expanded view) */}
        {showTrend && trend && (
          <div className="mt-1 text-[9px] {
            trend === 'increasing' && 'text-green-400'
            || trend === 'decreasing' && 'text-red-400'
            || 'text-slate-400'
          }">
            {trend === 'increasing' ? 'Trend: increasing' : trend === 'decreasing' ? 'Trend: decreasing' : 'Trend: stable'}
          </div>
        )}

        {/* Source and timestamp */}
        {showSource && (
          <div className="mt-2 text-[9px] text-slate-500">
            {temporalMode === 'observed' && (
              <div className="mb-1">
                <span className="font-medium">Updated:</span> {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
              </div>
            )}
            <span className="font-xs">Demo Dataset</span>
          </div>
        )}

        {/* Confidence indicator (for observed data) */}
        {temporalMode === 'observed' && value !== null && (
          <div className="mt-1 flex items-center gap-2 text-[9px]">
            <span className="w-2 h-2 rounded-full {
              status === 'critical' && 'bg-red-500'
              || status === 'high' && 'bg-orange-500'
              || status === 'moderate' && 'bg-yellow-500'
              || 'bg-cyan-500'
            }"></span>
            <span>Confidence: {String(Math.round((Math.random() * 30) + 70))}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compute status/category based on variable and value.
 * Uses configurable thresholds from variable metadata.
 */
function computeStatus(
  variable: EnvironmentalVariableId,
  value: number | null | undefined,
  varDef: EnvironmentalVariable | undefined
): 'critical' | 'high' | 'moderate' | 'low' | null {
  if (value === null || value === undefined || !varDef?.acceptableRange) return null;

  const [min, max] = varDef.acceptableRange;
  const midPoint = (min + max) / 2;

  if (value >= midPoint * 0.8 && value <= max) {
    return 'high';
  }
  if (value >= midPoint * 0.5 && value < midPoint * 0.8) {
    return 'moderate';
  }
  if (value < midPoint * 0.5 && value >= min) {
    return 'low';
  }
  return 'critical';
}