"use client";

import { useGeographic } from '@/hooks/GeographicContext';

export function RegionIntelligencePanel() {
  const { selectedRegion, regionIntelligence, isLoading } = useGeographic();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
        <div className="animate-pulse text-cyan-400 font-mono text-sm">LOADING...</div>
      </div>
    );
  }

  if (!selectedRegion || !regionIntelligence) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
        <h3 className="text-sm font-semibold text-slate-400">Geographic Intelligence</h3>
        <p className="text-xs text-slate-500 mt-2">Select a region to view intelligence.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white">{regionIntelligence.regionName}</h3>
        <p className="text-[10px] text-slate-500 font-mono uppercase">
          {regionIntelligence.level} • {selectedRegion.id}
        </p>
      </div>

      <div className="space-y-3">
        {(regionIntelligence.population || regionIntelligence.populationDensity) && (
          <div>
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Demographics</h4>
            <div className="grid grid-cols-2 gap-2">
              {regionIntelligence.population && (
                <div>
                  <div className="text-[10px] text-slate-500">Population</div>
                  <div className="text-xs text-slate-300 font-mono">
                    {(regionIntelligence.population / 1000000).toFixed(1)}M
                  </div>
                </div>
              )}
              {regionIntelligence.populationDensity && (
                <div>
                  <div className="text-[10px] text-slate-500">Density</div>
                  <div className="text-xs text-slate-300 font-mono">
                    {regionIntelligence.populationDensity.toLocaleString()}/km²
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {(regionIntelligence.temperature || regionIntelligence.rainfall) && (
          <div>
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Environmental</h4>
            <div className="grid grid-cols-3 gap-2">
              {regionIntelligence.temperature && (
                <div>
                  <div className="text-[10px] text-slate-500">Temp</div>
                  <div className="text-xs text-slate-300 font-mono">{regionIntelligence.temperature}°C</div>
                </div>
              )}
              {regionIntelligence.rainfall && (
                <div>
                  <div className="text-[10px] text-slate-500">Rain</div>
                  <div className="text-xs text-slate-300 font-mono">{regionIntelligence.rainfall}mm</div>
                </div>
              )}
            </div>
          </div>
        )}

        {(regionIntelligence.floodRisk || regionIntelligence.heatRisk) && (
          <div>
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Risk Assessment</h4>
            <div className="space-y-1">
              {regionIntelligence.floodRisk && (
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-400">Flood Risk</span>
                  <span className="text-xs font-mono text-cyan-400">{regionIntelligence.floodRisk}/100</span>
                </div>
              )}
              {regionIntelligence.heatRisk && (
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-400">Heat Risk</span>
                  <span className="text-xs font-mono text-orange-400">{regionIntelligence.heatRisk}/100</span>
                </div>
              )}
            </div>
          </div>
        )}

        {regionIntelligence.activeAlerts.length > 0 && (
          <div>
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase mb-1">
              Active Alerts ({regionIntelligence.activeAlerts.length})
            </h4>
            <div className="space-y-1">
              {regionIntelligence.activeAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="rounded border border-slate-700/50 bg-slate-900/50 p-2">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-semibold text-slate-300 uppercase">{alert.type}</span>
                    <span className={`text-[9px] font-semibold uppercase ${
                      alert.severity === 'critical' ? 'text-red-400' : 'text-orange-400'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-700/50 text-[9px] text-slate-600">
          <div>Source: {regionIntelligence.dataSource}</div>
          <div>Updated: {new Date(regionIntelligence.lastUpdated).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}
