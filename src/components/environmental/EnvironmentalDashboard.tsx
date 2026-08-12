"use client";

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { TemporalMode, EnvironmentalVariableId } from '@/core/contracts';
import { EnvironmentalConditionCard } from './EnvironmentalConditionCard';
import { mockEnvironmentalProvider } from '@/data/mock/environmental-provider';

interface EnvironmentalDashboardProps {
  regionId: string;
  regionName: string;
  variables?: string[];
}

interface TrendIndicators {
  [variable: string]: 'increasing' | 'decreasing' | 'stable';
}

export function EnvironmentalDashboard({
  regionId,
  regionName,
  variables: propVariables,
}: EnvironmentalDashboardProps) {
  const [temporalMode, setTemporalMode] = useState<TemporalMode>('observed');
  const [observations, setObservations] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trendIndicators, setTrendIndicators] = useState<TrendIndicators | null>(null);

  const variables = propVariables || ['temperature', 'precipitation', 'wind-speed', 'soil-moisture'];

  const baselineData: Record<string, { average: number; stdDev: number }> = {
    temperature: { average: 28, stdDev: 5 },
    precipitation: { average: 10, stdDev: 8 },
    'wind-speed': { average: 12, stdDev: 4 },
    'soil-moisture': { average: 0.35, stdDev: 0.15 },
  };

  const toggleTemporalMode = useCallback((mode: TemporalMode) => {
    setTemporalMode(mode);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const newObs: Record<string, number> = {};
        const newTrends: TrendIndicators = {};

        for (const v of variables) {
          const varDef = Object.values(mockEnvironmentalProvider.getAllVariables()).find(
            (def: any) => def.id === v
          );
          if (varDef) {
            const base = baselineData[v]?.average || 50;
            const jitter = (Math.random() - 0.5) * 10;
            newObs[v] = Math.round((base + jitter) * 10) / 10;
            newTrends[v] = ['increasing', 'decreasing', 'stable'][
              Math.floor(Math.random() * 3)
            ] as 'increasing' | 'decreasing' | 'stable';
          }
        }

        setObservations(newObs);
        setTrendIndicators(newTrends);
        setLoading(false);
      } catch (err) {
        setError('Failed to load environmental data');
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [regionId, variables, temporalMode]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-white">
            {regionName} Environmental Conditions
          </h3>
          <p className="text-[10px] text-slate-400">
            {temporalMode === 'observed' ? 'Current conditions' : temporalMode === 'historical' ? 'Historical data' : 'Forecast'}
          </p>
        </div>

        <div className="flex gap-2">
          {(['historical', 'observed', 'forecast'] as TemporalMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => toggleTemporalMode(mode)}
              className={cn(
                "px-3 py-1 text-[10px] font-medium transition-colors border border-slate-700/50 rounded",
                temporalMode === mode && "bg-cyan-600 text-white border-cyan-500/30"
              )}
              aria-label={`Show ${mode} conditions`}
            >
              {mode === 'historical' ? 'Historical' : mode === 'observed' ? 'Observed' : 'Forecast'}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border border-slate-700/30 bg-slate-900/50 p-6 text-center">
          <span className="animate-spin inline-block h-4 w-4 mr-2"></span>
          <span className="text-[10px] text-slate-400">Loading environmental data...</span>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-slate-700/30 bg-slate-900/50 p-4 text-[10px] text-red-400">
          {error}
        </div>
      )}

      {!loading && variables.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {variables.map((variable) => {
            const value = observations[variable];
            return (
              <EnvironmentalConditionCard
                key={variable}
                variable={variable as EnvironmentalVariableId}
                value={value}
                temporalMode={temporalMode}
                regionName={regionName}
                showTrend={true}
                showSource={true}
              />
            );
          })}
        </div>
      )}

      {variables.length > 0 && (
        <div className="mt-4 p-3 bg-slate-900/50 rounded-border border-slate-700/30">
          <h4 className="text-[10px] font-semibold text-slate-300 mb-3">Baseline Comparison</h4>
          <div className="grid grid-cols-2 gap-2">
            {variables.map((variable) => {
              const val = observations[variable];
              const baseline = baselineData[variable];
              const varDef = Object.values(mockEnvironmentalProvider.getAllVariables()).find(
                (v: any) => v.id === variable
              );

              if (val !== null && val !== undefined && varDef && baseline) {
                const anomaly = val - baseline.average;
                const pctAnomaly = ((val - baseline.average) / baseline.average) * 100;

                return (
                  <div
                    key={variable}
                    className="flex items-center gap-2 px-2 py-1 text-[9px] rounded"
                    style={{
                      background: val > baseline.average ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 96, 0.1)',
                      border: val > baseline.average ? '1px solid #ef4444' : '1px solid #22c55e',
                    }}
                  >
                    <span className="font-medium">{varDef.name || variable}</span>
                    <span>
                      {val}{varDef.unit || ''} vs {baseline.average}{varDef.unit || ''}
                      {anomaly !== 0 && (
                        <span className="ml-2">
                          {anomaly >= 0 ? '+' : ''}{anomaly.toFixed(1)}{varDef.unit || ''}
                          ({pctAnomaly.toFixed(1)}%)
                        </span>
                      )}
                    </span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      {variables.length > 0 && trendIndicators && (
        <div className="mt-4 p-3 bg-slate-900/50 rounded-border border-slate-700/30">
          <h4 className="text-[10px] font-semibold text-slate-300 mb-2">Trend Indicators</h4>
          <div className="grid grid-cols-2 gap-2">
            {variables.map((variable) => {
              const trend = trendIndicators[variable];
              if (!trend) return null;
              const varDef = Object.values(mockEnvironmentalProvider.getAllVariables()).find(
                (v: any) => v.id === variable
              );
              const statusClass = trend === 'increasing' ? 'text-green-400' : trend === 'decreasing' ? 'text-red-400' : 'text-slate-400';

              return (
                <div
                  key={variable}
                  className="flex items-center gap-2 px-2 py-1 text-[9px] rounded"
                  style={{ border: `1px solid ${statusClass}`, color: statusClass }}
                >
                  <span className="font-medium">{varDef?.name || variable}</span>
                  <span>{trend === 'increasing' ? '↑ increasing' : trend === 'decreasing' ? '↓ decreasing' : '→ stable'}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-slate-900/50 rounded-border border-slate-700/30">
        <h4 className="text-[10px] font-semibold text-slate-300 mb-2">Time Context</h4>
        <div className="flex gap-2">
          {(['historical', 'observed', 'forecast'] as TemporalMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => toggleTemporalMode(mode)}
              className={cn(
                "px-3 py-1 text-[9px] font-medium transition-colors border border-slate-700/50 rounded",
                temporalMode === mode && "bg-cyan-600 text-white border-cyan-500/30"
              )}
              aria-label={`Show ${mode} conditions`}
            >
              {mode === 'historical' ? 'Historical' : mode === 'observed' ? 'Observed' : 'Forecast'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
