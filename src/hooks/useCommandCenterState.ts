import { useState, useMemo, useEffect } from 'react';
import { Asset } from '@/core/contracts';
import { MockAssetRepository } from '@/data/mock/repositories';
import { SceneLayer } from '@/components/command-center/DisasterScene3D';
import { commandCenterData, simulationEvents } from '@/data/mock/command-center';
import { priorityEngine } from '@/core/priority/PriorityEngine';
import { mockPriorityInputs } from '@/data/mock/MockPriorityProvider';

export interface CommandCenterState {
  // Data
  assets: Asset[];
  isLoading: boolean;
  
  // Selection
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;
  selectedAsset: Asset | null;
  
  // Filters
  filterAsset: string;
  setFilterAsset: (filter: string) => void;
  filterPriority: string;
  setFilterPriority: (filter: string) => void;
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
  
  const [filterAsset, setFilterAsset] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterEvidence, setFilterEvidence] = useState<string>("all");
  
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [sceneLayer, setSceneLayer] = useState<SceneLayer>("situation");
  const [whatIfActive, setWhatIfActive] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      setIsLoading(true);
      const repo = new MockAssetRepository();
      const data = await repo.getAllAssets();
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
      if (filterPriority !== "all" && a.priorityMetrics?.priorityLabel !== filterPriority) return false;
      if (filterEvidence !== "all" && !a.evidence?.some((e) => e.source === filterEvidence)) return false;
      return true;
    });
  }, [assets, filterAsset, filterPriority, filterEvidence]);

  const priorityRankings = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      const pA = a.priorityMetrics?.recoveryPriority || 0;
      const pB = b.priorityMetrics?.recoveryPriority || 0;
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
