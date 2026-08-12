import React, { useEffect, useState } from 'react';
import { EnvironmentalObservation, EnvironmentalVariableId } from '@/core/contracts';
import { mockEnvironmentalProvider } from '@/data/mock/MockEnvironmentalProvider';
import { environmentalRegistry } from '@/core/environmental/environmental-registry';

interface EnvironmentalSummaryPanelProps {
  regionId?: string;
}

export function EnvironmentalSummaryPanel({ regionId }: EnvironmentalSummaryPanelProps) {
  const [observations, setObservations] = useState<EnvironmentalObservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!regionId) return;
      setLoading(true);
      const varsToFetch: EnvironmentalVariableId[] = [
        'rainfall', 'temperature', 'humidity', 'wind-speed', 'soil-moisture', 'river-level'
      ];
      try {
        const obs = await mockEnvironmentalProvider.getCurrent(regionId, varsToFetch);
        setObservations(obs);
      } catch (err) {
        console.error('Failed to load environmental data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [regionId]);

  if (!regionId) {
    return <div className="p-4 text-slate-400 text-sm">Select a region to view environmental conditions.</div>;
  }

  if (loading) {
    return <div className="p-4 text-slate-400 text-sm">Loading environmental data...</div>;
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getAnomalyValue = (obs: EnvironmentalObservation) => {
    // Generate a stable fake anomaly based on value
    if (obs.value === null || obs.quality === 'missing') return null;
    const def = environmentalRegistry.get(obs.variable);
    if (!def) return null;
    
    // just for demo purposes, fake an anomaly
    const baseVal = (def.acceptableRange[0] + def.acceptableRange[1]) / 2;
    const diff = obs.value - baseVal;
    const pct = (diff / baseVal) * 100;
    return {
      absolute: diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1),
      percentage: diff > 0 ? `+${pct.toFixed(0)}%` : `${pct.toFixed(0)}%`
    };
  };

  return (
    <div className="rounded-lg border border-slate-700/30 bg-slate-800/20 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-white">Environmental Conditions</h3>
        {observations.length > 0 && (
          <span className="text-[10px] text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-1 rounded">
            {observations[0].temporalContext.mode}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {observations.map(obs => {
          const def = environmentalRegistry.get(obs.variable);
          const name = def ? def.name : obs.variable;
          const isMissing = obs.quality === 'missing' || obs.value === null;
          const anomaly = getAnomalyValue(obs);
          
          return (
            <div key={obs.id} className="bg-slate-900/50 rounded-md p-3 border border-slate-700/20">
              <div className="text-xs text-slate-400 mb-1">{name}</div>
              <div className="flex items-baseline gap-1">
                <span className={`text-lg font-mono font-medium ${isMissing ? 'text-slate-500' : 'text-slate-100'}`}>
                  {isMissing ? '--' : obs.value}
                </span>
                <span className="text-xs text-slate-500">{obs.unit}</span>
              </div>
              {!isMissing && anomaly && (
                <div className={`text-[10px] mt-1 ${anomaly.absolute.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {anomaly.absolute} {obs.unit} vs norm
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {observations.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-700/30 text-[10px] text-slate-500 flex justify-between">
          <span>Source: {observations[0].source}</span>
          <span>Updated: {formatDate(observations[0].timestamp)}</span>
        </div>
      )}
    </div>
  );
}
