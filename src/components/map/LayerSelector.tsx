"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  getAllLayerDefinitions,
  getLayersByCategory,
  getLayerDefinition,
} from "@/geospatial/layers/layer-utils";
import type { MapLayerDefinition } from "@/core/contracts";

const CATEGORIES = {
  Environment: "Environment",
  Human: "Human",
  Infrastructure: "Infrastructure",
  Operations: "Operations",
};

/**
 * Helper to build className for category toggle button
 */
function categoryButtonClass(
  selectedLayer: string,
  cat: { name: string; layers: MapLayerDefinition[] }
) {
  const isSelected = selectedLayer !== "placeholder" && cat.layers.some((l) => l.id === selectedLayer);
  return cn(
    "flex items-center gap-2 px-2 py-1 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors",
    isSelected && "bg-slate-800/50 text-cyan-400"
  );
}

/**
 * LayerSelector - Organized layer selection control.
 * Layers are grouped by category with logical grouping.
 */
export function LayerSelector({
  selectedLayer,
  onSelectLayer,
  showFilters,
  onToggleFilters,
}: {
  selectedLayer: string;
  onSelectLayer: (layerId: string) => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}) {
  const [showFilterToggle, setShowFilterToggle] = useState(!!showFilters);

  const definitions = getAllLayerDefinitions();

  // Group layers by category
  const groupedLayers = Object.entries(CATEGORIES).reduce<
    Record<string, { name: string; layers: MapLayerDefinition[] }>
  >((acc, [key, label]) => {
    acc[key] = { name: label, layers: [] };
    return acc;
  }, {} as Record<string, { name: string; layers: MapLayerDefinition[] }>);

  // Assign layers to categories
  definitions.forEach((layer) => {
    const category = layer.category || "Operations";
    if (groupedLayers[category]) {
      groupedLayers[category].layers.push(layer);
    } else {
      groupedLayers.Operations.layers.push(layer);
    }
  });

  // Ensure each category has at least one layer
  Object.values(groupedLayers).forEach((cat) => {
    if (cat.layers.length === 0) {
      cat.layers.push({
        id: "placeholder",
        name: "—",
        description: "No layers in this category",
        category: "Operations",
      } as MapLayerDefinition);
    }
  });

  const handleSelect = useCallback(
    (layerId: string) => {
      onSelectLayer(layerId);
      setShowFilterToggle(false);
    },
    [onSelectLayer]
  );

  return (
    <div className="space-y-2">
      {/* Category headers with layer grid */}
      {Object.entries(groupedLayers).map(([category, cat]) => (
        <div key={category} className="border-b border-slate-700/30 pb-3 last:pb-0">
          <button
            onClick={() => setShowFilterToggle(false)}
            className={categoryButtonClass(selectedLayer, cat)}
            aria-controls={`layer-category-${category}`}
            aria-expanded={
              !!(
                selectedLayer &&
                selectedLayer !== "placeholder" &&
                cat.layers.some((l) => l.id === selectedLayer)
              )
            }
          >
            {cat.name}
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {/* Layer grid */}
          {selectedLayer &&
            selectedLayer !== "placeholder" &&
            cat.layers.some((l) => l.id === selectedLayer)
              ? (
                <div id={`layer-category-${category}`} className="mt-2 grid grid-cols-2 gap-2">
                  {cat.layers.map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => handleSelect(layer.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors",
                        selectedLayer === layer.id && "bg-cyan-600 text-white"
                      )}
                      aria-label={`Select ${layer.name}`}
                    >
                      <span className="whitespace-nowrap">{layer.name}</span>
                    </button>
                  ))}
                </div>
              )
              : (
                <div className="mt-2 text-xs text-slate-500">
                  {cat.layers.map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => handleSelect(layer.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors bg-slate-800/50 text-slate-300 hover:text-slate-200"
                      )}
                    >
                      <span className="whitespace-nowrap">{layer.name}</span>
                    </button>
                  ))}
                </div>
              )}

          {!selectedLayer && (
            <div
              className="mt-1 text-xs text-slate-500 cursor-pointer hover:text-cyan-400 transition-colors underline"
              onClick={() => setShowFilterToggle((s) => !s)}
            >
              Show filters
            </div>
          )}
        </div>
      ))}

      {/* Filter controls when toggle is open */}
      {showFilterToggle && (
        <div className="mt-3 p-4 bg-slate-900/50 rounded-border border-slate-700/30">
          <h3 className="text-xs font-semibold text-slate-300 mb-3">Filters</h3>
          <div className="space-y-2">
            <button
              onClick={onToggleFilters}
              className="w-full flex items-center justify-between text-[10px] font-medium text-slate-400 hover:text-cyan-400 transition-colors"
              aria-label="Hide filters"
            >
              Collapse filters
              <svg
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 6l6 6M6 18l6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default LayerSelector;