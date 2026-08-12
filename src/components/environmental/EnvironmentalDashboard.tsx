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
              const varDef = Object.values(mockEnvironmentalProvider.getAllVariables()).find(
                (v: any) => v.id === variable
              ) || Object.values(mockEnvironmentalProvider.getAllVariables())[0];
              
              return (
                <EnvironmentalConditionCard
                  key={variable}
                  variable={variable}
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

        {/* Baseline comparison section */}
        {variables.length > 0 && (
          <div className="mt-4 p-3 bg-slate-900/50 rounded-border border-slate-700/30">
            <h4 className="text-[10px] font-semibold text-slate-300 mb-3">Baseline Comparison</h4>
            <div className="grid grid-cols-2 gap-2">
              {variables.map((variable) => {
                const val = observations[variable];
                const varDef = Object.values(mockEnvironmentalProvider.getAllVariables()).find(
                  (v: any) => v.id === variable
                ) || Object.values(mockEnvironmentalProvider.getAllVariables())[0];
                const baseline = baselineData[variable];
                
                if (val !== null && val !== undefined && varDef && baseline) {
                  const currentVal = val;
                  const anomaly = currentVal - baseline.average;
                  const pctAnomaly = ((currentVal - baseline.average) / baseline.average) * 100;
                  
                  return (
                    <div
                      key={variable}
                      className="flex items-center gap-2 px-2 py-1 text-[9px] rounded"
                      style={{
                        background: currentVal > baseline.average ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 96, 0.1)',
                        border: currentVal > baseline.average ? '1px solid #ef4444' : '1px solid #22c55e',
                      }}
                    >
                      <span className="font-medium">{varDef.name || variable}</span>
                      <span>
                        {currentVal}{varDef.unit || ''} vs {baseline.average}{varDef.unit || ''}
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

        {/* Trend indicators */}
        {variables.length > 0 && trendIndicators && (
          <div className="mt-4 p-3 bg-slate-900/50 rounded-border border-slate-700/30">
            <h4 className="text-[10px] font-semibold text-slate-300 mb-2">Trend Indicators</h4>
            <div className="grid grid-cols-2 gap-2">
              {variables.map((variable) => {
                const trend = trendIndicators[variable];
                if (!trend) return null;
                const varDef = Object.values(mockEnvironmentalProvider.getAllVariables()).find(
                  (v: any) => v.id === variable
                ) || Object.values(mockEnvironmentalProvider.getAllVariables())[0];
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

        {/* Temporal mode toggle */}
        {variables.length > 0 && (
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
      {variables.length > 0 && trendIndicators && (
          <div className="mt-4 p-3 bg-slate-900/50 rounded-border border-slate-700/30">
            <h4 className="text-[10px] font-semibold text-slate-300 mb-2">Trend Indicators</h4>
            <div className="grid grid-cols-2 gap-2">
              {variables.map((variable) => {
                const trend = trendIndicators[variable];
                if (!trend) return null;
                const varDef = Object.values(mockEnvironmentalProvider.getAllVariables()).find(
                  (v: any) => v.id === variable
                ) || Object.values(mockEnvironmentalProvider.getAllVariables())[0];
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