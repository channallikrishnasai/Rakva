import { useState, useMemo, useEffect } from 'react';
import { Asset } from '@/core/contracts';
import { MockAssetRepository } from '@/data/mock/repositories';
import { SceneLayer } from '@/components/command-center/DisasterScene3D';
import { commandCenterData, simulationEvents } from '@/data/mock/command-center';
import { priorityEngine } from '@/core/priority/PriorityEngine';
import { mockPriorityInputs } from '@/data/mock/MockPriorityProvider';
import type { AssetType, FilterPriority } from '@/lib/types/command-center';

export interface CommandCenterState {
  // Data
  assets: Asset[];
  isLoading: boolean;
  
  // Selection
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;
  selectedAsset: Asset | null;
  
  // Filters
  filterAsset: AssetType | "all";
  setFilterAsset: (filter: AssetType | "all") => void;
  filterPriority: FilterPriority | "all";
  setFilterPriority: (filter: FilterPriority | "all") => void;
  filterEvidence: string;
  setFilterEvidence: (filter: string) => void;
  
  // Derived
  filteredAssets: Asset[];
  priorityRankings: Asset[];
  
  // View state
  viewMode: '3d' | '2d';
  setViewMode: (mode: '3d' | '2d') => void;
  sceneLayer: SceneLayer;
  setSceneLayer: (layer: SceneLayer) => void;
  
  // Simulation
  whatIfActive: boolean;
  setWhatIfActive: (active: boolean) => void;
  simulationEvent: any;
}

export function useCommandCenterState(): CommandCenterState {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  
  const [filterAsset, setFilterAsset] = useState<AssetType | "all">("all");
  const [filterPriority, setFilterPriority] = useState<FilterPriority | "all">("all");
  const [filterEvidence, setFilterEvidence] = useState<string>("all");
  
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [sceneLayer, setSceneLayer] = useState<SceneLayer>("situation");
  const [whatIfActive, setWhatIfActive] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      setIsLoading(true);
      const repo = new MockAssetRepository();
      let data = await repo.getAllAssets();
      
      const priorityAssessments = priorityEngine.rank(mockPriorityInputs);
      data = data.map(asset => {
        const assessment = priorityAssessments.find(p => p.subjectId === asset.id);
        if (assessment) {
          asset.priorityMetrics = assessment;
        }
        return asset;
      });

      setAssets(data);
      // Default selection if available
      if (data.length > 0 && !selectedAssetId) {
        setSelectedAssetId(data[0].id);
      }
      setIsLoading(false);
    }
    loadAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (filterAsset !== "all" && a.type !== filterAsset) return false;
      if (filterPriority !== "all" && a.priorityMetrics?.category !== filterPriority) return false;
      if (filterEvidence !== "all" && !a.evidence?.some((e) => e.source === filterEvidence)) return false;
      return true;
    });
  }, [assets, filterAsset, filterPriority, filterEvidence]);

  const priorityRankings = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      const pA = a.priorityMetrics?.score || 0;
      const pB = b.priorityMetrics?.score || 0;
      return pB - pA;
    });
  }, [filteredAssets]);

  const selectedAsset = useMemo(() => {
    if (!selectedAssetId) return null;
    return assets.find(a => a.id === selectedAssetId) || null;
  }, [assets, selectedAssetId]);

  // Keep existing simulation mock event for now
  const simulationEvent = useMemo(() => {
    return selectedAsset ? simulationEvents.find((e) => e.assetId === selectedAsset.id) || null : null;
  }, [selectedAsset]);

  return {
    assets,
    isLoading,
    
    selectedAssetId,
    setSelectedAssetId,
    selectedAsset,
    
    filterAsset,
    setFilterAsset,
    filterPriority,
    setFilterPriority,
    filterEvidence,
    setFilterEvidence,
    
    filteredAssets,
    priorityRankings,
    
    viewMode,
    setViewMode,
    sceneLayer,
    setSceneLayer,
    
    whatIfActive,
    setWhatIfActive,
    simulationEvent,
  };
}
