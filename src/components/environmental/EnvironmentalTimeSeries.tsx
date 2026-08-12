import React, { useEffect, useState } from 'react';
import { EnvironmentalTimeSeries, EnvironmentalVariableId, TemporalMode } from '@/core/contracts';
import { mockEnvironmentalProvider } from '@/data/mock/MockEnvironmentalProvider';
import { environmentalRegistry } from '@/core/environmental/environmental-registry';

interface EnvironmentalTimeSeriesProps {
  regionId: string;
  variable: EnvironmentalVariableId;
  mode?: TemporalMode;
}

export function EnvironmentalTimeSeriesChart({ regionId, variable, mode = 'historical' }: EnvironmentalTimeSeriesProps) {
  const [timeSeries, setTimeSeries] = useState<EnvironmentalTimeSeries | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!regionId) return;
      setLoading(true);
      try {
        const ts = await mockEnvironmentalProvider.getTimeSeries(regionId, variable, mode);
        setTimeSeries(ts);
      } catch (err) {
        console.error('Failed to load time series', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [regionId, variable, mode]);

  if (loading) {
    return <div className="h-32 flex items-center justify-center text-xs text-slate-500">Loading series...</div>;
  }

  if (!timeSeries || timeSeries.points.length === 0) {
    return <div className="h-32 flex items-center justify-center text-xs text-slate-500">No data available</div>;
  }

  const def = environmentalRegistry.get(variable);
  const maxVal = Math.max(...timeSeries.points.map(p => p.value || 0));
  const minVal = Math.min(...timeSeries.points.map(p => p.value || 0));
  const range = maxVal - minVal || 1;

  return (
    <div className="w-full h-32 flex flex-col justify-end pt-4 pb-2 border-b border-l border-slate-700 relative pl-2">
      <div className="absolute top-0 left-2 text-[10px] text-slate-500">{maxVal.toFixed(1)} {def?.unit}</div>
      <div className="absolute bottom-0 left-2 text-[10px] text-slate-500">{minVal.toFixed(1)}</div>
      
      <div className="flex-1 flex items-end justify-between gap-1 w-full h-full mt-4">
        {timeSeries.points.map((pt, i) => {
          const val = pt.value || 0;
          const heightPct = ((val - minVal) / range) * 100;
          const h = Math.max(heightPct, 5); // min 5% height
          
          return (
            <div key={pt.id} className="group flex-1 flex flex-col items-center justify-end relative h-full">
              <div 
                className="w-full bg-blue-500/50 hover:bg-blue-400 rounded-t-sm transition-all"
                style={{ height: `${h}%` }}
              ></div>
              <div className="opacity-0 group-hover:opacity-100 absolute -top-6 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 shadow-lg border border-slate-700">
                {val} {pt.unit}
                <div className="text-slate-400 text-[8px] mt-0.5">
                  {new Date(pt.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
