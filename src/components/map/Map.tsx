"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { getLayerDefinition, getAllLayerDefinitions, getSupportedGeographicLevels, classifyValue, formatValue, getVisualCategory } from "@/geospatial/layers/layer-utils";
import type { MapLayerDefinition } from "@/core/contracts";
import DynamicLegend from "./DynamicLegend";
import LayerSelector from "./LayerSelector";

interface MapProps {
  /** Initial layer to select */
  initialLayer?: string;
  /** Initial geographic level (country|state|district|...) */
  initialLevel?: string;
  /** Available regions data - regionId -> {name, level, value, ...} */
  regions?: Record<string, { name: string; level: string; value?: number | string }>;
  /** Selected asset ID for command center sync */
  selectedAssetId?: string;
  onRegionSelect?: (regionId: string, regionName: string) => void;
  onLayerChange?: (layerId: string) => void;
  /** Current geographic context */
  geographicContext?: {
    countryId?: string;
    stateId?: string;
    districtId?: string;
  };
}

/**
 * Map - Multi-layer intelligence visualization system.
 * 
 * Features:
 * - Layer selector with categorized organization
 * - Dynamic legend with per-layer color scales
 * - Hover exact values with units
 * - Click region intelligence panel
 * - Persistent filters across geographic drill-down
 * - Missing data handling
 * - Color consistency between value and category
 */
export function IntelligenceMap({ 
  initialLayer = 'rainfall', 
  initialLevel = 'state',
  regions,
  selectedAssetId,
  onRegionSelect,
  onLayerChange,
  geographicContext = {}
}: MapProps) {
  const [selectedLayer, setSelectedLayer] = useState(initialLayer);
  const [geographicLevel, setGeographicLevel] = useState(initialLevel);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [clickedRegion, setClickedRegion] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Memoize layer definition
  const definition = useMemo(() => getLayerDefinition(selectedLayer), [selectedLayer]);

  // Update geographic level when layer changes (different layers support different levels)
  useEffect(() => {
    const def = getLayerDefinition(selectedLayer);
    if (def && def.supportedGeographicLevels.length > 0) {
      // Use first supported level that matches or default
      const supported = def.supportedGeographicLevels;
      const currentIndex = supported.indexOf(geographicLevel);
      if (currentIndex === -1) {
        setGeographicLevel(supported[0] || 'district');
      }
    }
  }, [selectedLayer, geographicLevel]);

  // Format hovered value
  const formattedHoverValue = useMemo(() => {
    if (!hoveredRegion || !regions?.[hoveredRegion]) return '';
    const region = regions[hoveredRegion];
    if (region.value === undefined || region.value === null) return 'No data';
    return formatValue(region.value, definition!);
  }, [hoveredRegion, definition, regions]);

  // Format clicked value
  const formattedClickValue = useMemo(() => {
    if (!clickedRegion || !regions?.[clickedRegion]) return '';
    const region = regions[clickedRegion];
    if (region.value === undefined || region.value === null) return 'No data';
    return formatValue(region.value, definition!);
  }, [clickedRegion, definition, regions]);

  // Get visual category for display
  const visualCategory = useMemo(() => {
    if (!hoveredRegion || !regions?.[hoveredRegion] || definition === undefined) return null;
    const value = regions[hoveredRegion].value;
    if (value === undefined || value === null || isNaN(Number(value))) return null;
    return getVisualCategory(Number(value), definition);
  }, [hoveredRegion, definition]);

  // Handle layer selection
  const handleLayerChange = useCallback((layerId: string) => {
    setSelectedLayer(layerId);
    setGeographicLevel('state'); // reset to default level
    onLayerChange?.(layerId);
  }, [onLayerChange]);

  // Handle geographic level change
  const handleLevelChange = useCallback((level: string) => {
    setGeographicLevel(level);
  }, []);

  // Handle region hover
  const handleRegionHover = useCallback((regionId: string | null) => {
    setHoveredRegion(regionId);
    setClickedRegion(null); // reset click state on hover
  }, []);

  // Handle region click
  const handleRegionClick = useCallback((regionId: string, regionName: string) => {
    setClickedRegion(regionId);
    setHoveredRegion(null);
    onRegionSelect?.(regionId, regionName);
  }, [onRegionSelect]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Reset clicked state when layer changes
  useEffect(() => {
    setClickedRegion(null);
  }, [selectedLayer]);

  return (
    <div className="space-y-4">
      {/* Layer selector and controls row */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-4">
        {/* Left column: layer selector and filters */}
        <div>
          <LayerSelector
            selectedLayer={selectedLayer}
            onSelectLayer={handleLayerChange}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((s) => !s)}
          />
        </div>

        {/* Right column: map and legend */}
        <div className="space-y-4">
          {/* Legend - dynamic, updates with layer */}
          <DynamicLegend
            layerId={selectedLayer}
            value={clickedRegion ? (regions?.[clickedRegion]?.value) : undefined}
            compact={geographicLevel !== 'asset'}
          />

          {/* Map visualization area */}
          <div className="rounded-lg border border-slate-700/50 bg-slate-900/80 p-4">
            {/* Map title and current layer info */}
            {definition && (
              <div className="mb-3 text-[10px] text-slate-400 mb-2">
                <span className="font-medium">{definition.name}</span>
                <span className="ml-2 text-[9px] text-slate-500">{definition.unit || ''}</span>
              </div>
            )}

            {/* No regions data message */}
            {!regions || Object.keys(regions).length === 0 && (
              <div className="h-[200px] flex items-center justify-center text-[10px] text-slate-500">
                No region data loaded
              </div>
            )}

            {/* Regions grid */}
            {regions && Object.keys(regions).length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(regions).map(([regionId, region]) => {
                  const isHovered = hoveredRegion === regionId;
                  const isClicked = clickedRegion === regionId;
                  const value = region.value;
                  const level = region.level;
                  
                  // Get visual category
                  const category = value !== undefined && value !== null && !isNaN(Number(value))
                    ? getVisualCategory(Number(value), definition!)
                    : null;

                  // Get color based on category
                  const color = category?.colorIndex !== undefined 
                    ? `rgba(${['3b, 82, 246', '60, 165, 235', '93, 197, 253', '191, 219, 254', '228, 242, 252'][category.colorIndex] || '15, 35, 59'}, 0.8)`
                    : 'rgba(15, 35, 59, 0.8)';

                  // Get category label for display
                  const categoryLabel = category?.category || 'No data';

                  return (
                    <button
                      key={regionId}
                      onClick={() => handleRegionClick(regionId, region.name)}
                      onMouseEnter={() => handleRegionHover(regionId)}
                      onMouseLeave={() => handleRegionHover(null)}
                      className={`flex flex-col items-center rounded-lg p-3 transition-colors hover:bg-slate-800/50 ${
                        isClicked 
                          ? 'bg-cyan-600/20 border-cyan-500/50' 
                          : isHovered
                            ? 'bg-slate-800/60 border-cyan-500/30'
                            : 'bg-slate-900/50'
                      } cursor-pointer`}
                      aria-label={`Select ${region.name} - ${category?.category || 'no data'} region`}
                    >
                      {/* Color circle */}
                      <div
        className={`
          w-6 h-6 rounded-full mb-2 ${isClicked ? 'animate-pulse' : ''}
        `}
        style={{ backgroundColor: color }}
      />
                      {/* Region name */}
                      <div className="text-[9px] font-medium text-slate-300 whitespace-nowrap {level === 'asset' ? 'truncate' : ''}">
                        {region.name}
                      </div>
                      
                      {/* Exact value */}
                      <div className="text-[8px] text-slate-500 mt-1 whitespace-nowrap">
                        {value !== undefined && value !== null 
                          ? formatValue(value, definition!)
                          : 'No data'}
                      </div>
                      
                      {/* Category label */}
                      <div className="text-[7px] text-slate-400 mt-0.5 whitespace-nowrap">
                        {categoryLabel}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-[10px] text-slate-500">
                Select a layer to view regions
              </div>
            )}
          </div>

          {/* Clicked region intelligence panel */}
          {clickedRegion && definition && (
            <div className="mt-3 p-3 bg-slate-900/70 rounded border border-cyan-500/20">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-medium text-slate-300">{regions?.[clickedRegion]?.name || 'Region'}</span>
                <button
                  onClick={() => setClickedRegion(null)}
                  className="text-[9px] text-cyan-400 hover-underline"
                >
                  Close
                </button>
              </div>
              <div className="mt-2">
                <p className="text-[9px] text-slate-400">
                  <span className="font-medium">Layer:</span> {definition.name}
                </p>
                <p className="mt-1 text-[9px]">
                  <span className="font-medium">Value:</span> {formatValue(
                    regions?.[clickedRegion]?.value,
                    definition
                  )}
                </p>
                {visualCategory && (
                  <p className="mt-1 text-[9px]">
                    <span className="font-medium">Category:</span> {visualCategory.category}
                  </p>
                )}
                {definition.source && (
                  <p className="mt-1 text-[9px]">
                    <span className="font-medium">Source:</span> {definition.source}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Filters panel when toggled */}
          {showFilters && definition && (
            <div className="mt-3 p-3 bg-slate-900/50 rounded-border border-slate-700/30">
              <h3 className="text-xs font-semibold text-slate-300 mb-3">Filters</h3>
              <div className="space-y-2">
                <p className="text-[9px] text-slate-500">Geographic level: {geographicLevel}</p>
                <button
                  onClick={() => setGeographicLevel('state')}
                  className="w-full flex items-center justify-between text-[9px] font-medium text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Change to State
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default IntelligenceMap;