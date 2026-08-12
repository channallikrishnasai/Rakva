"use client";

import React, { useState, useEffect } from 'react';
import { HazardAssessment, HazardCategory } from '@/core/contracts';
import { cn } from '@/lib/utils';
import { hazardOrchestrator } from '@/core/hazard/HazardOrchestratorImpl';
import { mockGeographicContextProvider } from '@/data/mock/geographic-context-provider';
import { mockEnvironmentalProvider } from '@/data/mock/environmental-provider';
import { ALL_HAZARD_IDS } from '@/core/hazard/hazard-definitions';


interface HazardAssessmentPanelProps {
  regionId: string;
  className?: string;
}

const getCategoryColor = (category: HazardCategory | undefined) => {
  switch (category) {
    case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'moderate': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'very-low': return 'text-green-500 bg-green-500/10 border-green-500/20';
    default: return 'text-slate-400 bg-slate-800 border-slate-700';
  }
};

export function HazardAssessmentPanel({ regionId, className }: HazardAssessmentPanelProps) {
  const [assessments, setAssessments] = useState<HazardAssessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHazardId, setSelectedHazardId] = useState<string>('flood');

  useEffect(() => {
    async function fetchAssessments() {
      setLoading(true);
      try {
        const geoContext = await mockGeographicContextProvider.getContextForRegion(regionId);
        
        // Fetch all environmental variables to pass to the orchestrator
        const varIds = await mockEnvironmentalProvider.getRegionVariables(regionId);
        const envResults = await mockEnvironmentalProvider.getObservationsByRegion(regionId, varIds);
        
        const results = await hazardOrchestrator.assessAllHazards(
          regionId,
          geoContext,
          envResults,
          geoContext, // staticContext
          { mode: 'observed', timestamp: new Date().toISOString() } // temporalContext
        );
        
        setAssessments(results);
      } catch (e) {
        console.error('Failed to load hazard assessments', e);
      }
      setLoading(false);
    }
    
    fetchAssessments();
  }, [regionId]);

  if (loading) {
    return <div className={cn("p-4 animate-pulse flex flex-col gap-3", className)}>
      <div className="h-6 bg-slate-800 rounded w-1/3"></div>
      <div className="h-24 bg-slate-800/50 rounded"></div>
      <div className="h-24 bg-slate-800/50 rounded"></div>
    </div>;
  }

  const selectedAssessment = assessments.find(a => a.hazardId === selectedHazardId) || assessments[0];

  return (
    <div className={cn("flex flex-col gap-4 text-sm text-slate-300", className)}>
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {ALL_HAZARD_IDS.map(id => {
          const a = assessments.find(x => x.hazardId === id);
          const isSel = id === selectedHazardId;
          return (
            <button
              key={id}
              onClick={() => setSelectedHazardId(id)}
              className={cn(
                "px-3 py-1.5 rounded-t text-xs font-medium capitalize whitespace-nowrap border-b-2 transition-colors",
                isSel ? "border-blue-500 text-blue-400 bg-blue-500/10" : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              )}
            >
              {id}
            </button>
          );
        })}
      </div>

      {selectedAssessment && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Status Banner */}
          {selectedAssessment.status === 'insufficient-data' && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-3 rounded-md flex items-start gap-2">
              ??
              <div>
                <p className="font-semibold text-xs uppercase tracking-wider mb-1">Insufficient Data</p>
                <p className="text-xs opacity-90">Assessment incomplete due to missing required inputs: {selectedAssessment.keyMissingInputs.join(', ')}</p>
              </div>
            </div>
          )}

          {selectedAssessment.status === 'unsupported-geographic-context' && (
            <div className="bg-slate-800 border border-slate-700 text-slate-400 p-3 rounded-md flex items-start gap-2">
              ???
              <div>
                <p className="font-semibold text-xs uppercase tracking-wider mb-1">Unsupported Geography</p>
                <p className="text-xs opacity-90">{selectedAssessment.limitations[0]}</p>
              </div>
            </div>
          )}

          {/* Scores Overview */}
          {selectedAssessment.status === 'assessed' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-md">
                <p className="text-[10px] text-slate-500 font-semibold mb-1 uppercase">Susceptibility</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold font-mono text-slate-200">
                    {Math.round(selectedAssessment.susceptibilityScore || 0)}
                  </span>
                  <span className="text-xs text-slate-500 mb-1">/ 100</span>
                </div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-md">
                <p className="text-[10px] text-slate-500 font-semibold mb-1 uppercase">Hazard Signal</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold font-mono text-slate-200">
                    {Math.round(selectedAssessment.hazardSignalScore || 0)}
                  </span>
                  <span className="text-xs text-slate-500 mb-1">/ 100</span>
                </div>
              </div>
            </div>
          )}

          {/* Overall Assessment */}
          {selectedAssessment.status === 'assessed' && (
            <div className={cn("p-3 rounded-md border flex items-center justify-between", getCategoryColor(selectedAssessment.category))}>
              <div className="flex items-center gap-2">
                ??
                <span className="font-bold uppercase tracking-wider text-xs">
                  Overall Assessment: {selectedAssessment.category}
                </span>
              </div>
              <div className="text-xs font-mono font-medium opacity-80">
                Conf: {selectedAssessment.confidence}%
              </div>
            </div>
          )}

          {/* Contributing Factors */}
          {selectedAssessment.contributingFactors.length > 0 && (
            <div>
              <p className="text-[10px] uppercase font-semibold text-red-400 mb-2 flex items-center gap-1">
                ?? Contributing Signals
              </p>
              <div className="flex flex-col gap-2">
                {selectedAssessment.contributingFactors.map(f => (
                  <div key={f.id} className="bg-slate-900/40 border border-red-500/10 p-2 rounded text-xs flex flex-col gap-1">
                    <div className="flex justify-between items-center text-slate-200 font-medium">
                      <span>{f.label}</span>
                      {f.value !== undefined && <span className="font-mono text-red-300">{f.value}{f.unit}</span>}
                    </div>
                    <span className="text-slate-500">{f.explanation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Reducing Factors */}
          {selectedAssessment.riskReducingFactors.length > 0 && (
            <div>
              <p className="text-[10px] uppercase font-semibold text-green-400 mb-2 flex items-center gap-1">
                ? Risk-Reducing Context
              </p>
              <div className="flex flex-col gap-2">
                {selectedAssessment.riskReducingFactors.map(f => (
                  <div key={f.id} className="bg-slate-900/40 border border-green-500/10 p-2 rounded text-xs flex flex-col gap-1">
                    <div className="flex justify-between items-center text-slate-200 font-medium">
                      <span>{f.label}</span>
                      {f.value !== undefined && <span className="font-mono text-green-300">{f.value}{f.unit}</span>}
                    </div>
                    <span className="text-slate-500">{f.explanation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Provenance */}
          <div className="mt-2 pt-3 border-t border-slate-800 flex flex-col gap-1 text-[10px] text-slate-500 font-mono">
            <div className="flex justify-between">
              <span>Model ID:</span>
              <span className="text-slate-400">{selectedAssessment.modelId}</span>
            </div>
            <div className="flex justify-between">
              <span>Version:</span>
              <span className="text-slate-400">{selectedAssessment.modelVersion}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
