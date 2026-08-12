"use client";

import { useState, useCallback, useMemo } from 'react';
import type { GeographicContext, GeographicLevel } from '@/geospatial/types/geographic';
import type { GeoRegion } from '@/core/contracts';
import type { RegionIntelligence } from '@/geospatial/types/geographic';
import type { RegionRepository } from '@/data/repositories';
import { MockRegionRepository } from '@/geospatial/repositories/region-repository';

const DEFAULT_CONTEXT: GeographicContext = {
  countryId: 'IN',
  level: 'country',
};

export interface GeographicState {
  context: GeographicContext;
  selectedRegionId: string | null;
  selectedRegion: GeoRegion | null;
  regionIntelligence: RegionIntelligence | null;
  isLoading: boolean;
  error: string | null;
  childRegions: GeoRegion[];
  navigateToRegion: (regionId: string) => Promise<void>;
  goBack: () => void;
  goUpOneLevel: () => Promise<void>;
  selectRegion: (regionId: string | null) => Promise<void>;
  resetToCountry: () => void;
  loadChildren: (parentId: string) => Promise<GeoRegion[]>;
  searchRegions: (query: string) => Promise<Array<{ region: GeoRegion; path: GeoRegion[] }>>;
}

export function useGeographicContext(): GeographicState {
  const [context, setContext] = useState<GeographicContext>(DEFAULT_CONTEXT);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<GeoRegion | null>(null);
  const [regionIntelligence, setRegionIntelligence] = useState<RegionIntelligence | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [childRegions, setChildRegions] = useState<GeoRegion[]>([]);

  const repo = useMemo(() => new MockRegionRepository(), []);

  const loadRegionData = useCallback(async (regionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [region, intelligence] = await Promise.all([
        repo.getRegionById(regionId),
        repo.getRegionIntelligence(regionId).catch(() => null),
      ]);
      if (!region) throw new Error(`Region not found: ${regionId}`);
      setSelectedRegion(region);
      setSelectedRegionId(regionId);
      setRegionIntelligence(intelligence);
      const children = await repo.getChildrenRegions(regionId);
      setChildRegions(children);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load region');
      setSelectedRegion(null);
      setSelectedRegionId(null);
      setRegionIntelligence(null);
      setChildRegions([]);
    } finally {
      setIsLoading(false);
    }
  }, [repo]);

  const navigateToRegion = useCallback(async (regionId: string) => {
    await loadRegionData(regionId);
    const region = await repo.getRegionById(regionId);
    if (!region) return;
    
    const newContext: GeographicContext = {
      countryId: 'IN',
      level: region.level,
    };
    
    if (region.level === 'state') {
      newContext.stateId = regionId;
    } else if (region.level === 'district') {
      newContext.stateId = region.parentId || undefined;
      newContext.districtId = regionId;
    }
    
    setContext(newContext);
  }, [repo, loadRegionData]);

  const goBack = useCallback(() => {
    setContext(DEFAULT_CONTEXT);
    setSelectedRegionId(null);
    setSelectedRegion(null);
    setRegionIntelligence(null);
    setChildRegions([]);
    setError(null);
  }, []);

  const goUpOneLevel = useCallback(async () => {
    if (!selectedRegion?.parentId) {
      goBack();
      return;
    }
    await navigateToRegion(selectedRegion.parentId);
  }, [selectedRegion, navigateToRegion, goBack]);

  const selectRegion = useCallback(async (regionId: string | null) => {
    if (!regionId) {
      setSelectedRegionId(null);
      setSelectedRegion(null);
      setRegionIntelligence(null);
      setChildRegions([]);
      return;
    }
    await loadRegionData(regionId);
  }, [loadRegionData]);

  const resetToCountry = useCallback(() => {
    goBack();
  }, [goBack]);

  const loadChildren = useCallback(async (parentId: string): Promise<GeoRegion[]> => {
    return repo.getChildrenRegions(parentId);
  }, [repo]);

  const searchRegionsCallback = useCallback(async (query: string) => {
    return repo.searchRegions(query);
  }, [repo]);

  return {
    context,
    selectedRegionId,
    selectedRegion,
    regionIntelligence,
    isLoading,
    error,
    childRegions,
    navigateToRegion,
    goBack,
    goUpOneLevel,
    selectRegion,
    resetToCountry,
    loadChildren,
    searchRegions: searchRegionsCallback,
  };
}
