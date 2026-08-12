"use client";

import { useState, useMemo } from 'react';
import { useGeographic } from '@/hooks/GeographicContext';

export function HierarchicalMap() {
  const { context, childRegions, isLoading, navigateToRegion, goBack } = useGeographic();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const regions = useMemo(() => {
    if (context.level === 'country') {
      return [
        { id: 'IN-KA', name: 'Karnataka', center: [15.3, 75.7] as [number, number] },
        { id: 'IN-MH', name: 'Maharashtra', center: [19.7, 75.7] as [number, number] },
        { id: 'IN-TN', name: 'Tamil Nadu', center: [11.1, 78.6] as [number, number] },
        { id: 'IN-KL', name: 'Kerala', center: [10.8, 76.2] as [number, number] },
        { id: 'IN-MP', name: 'Madhya Pradesh', center: [23.0, 78.6] as [number, number] },
        { id: 'IN-GJ', name: 'Gujarat', center: [22.2, 71.1] as [number, number] },
      ];
    }
    return childRegions;
  }, [context.level, childRegions]);

  const projectToSVG = (center: [number, number] | undefined) => {
    if (!center) return { x: 50, y: 50 };
    const [lat, lng] = center;
    const x = ((lng - 68) / 30) * 100;
    const y = ((36 - lat) / 30) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-900/80">
        <div className="text-cyan-400 font-mono text-sm animate-pulse">
          LOADING...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-slate-700/50 bg-slate-900/80">
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
        <span className="rounded bg-slate-800/90 px-2 py-1 text-[10px] font-medium text-slate-400">
          GEOGRAPHIC MAP
        </span>
        <span className="rounded bg-slate-800/90 px-2 py-1 text-[10px] text-slate-500">
          {context.level.toUpperCase()} VIEW
        </span>
      </div>

      {context.level !== 'country' && (
        <div className="absolute left-3 top-10 z-10">
          <button
            onClick={goBack}
            className="rounded bg-slate-800/90 px-2 py-1 text-[10px] text-slate-400 hover:text-white"
          >
            ← Back to India
          </button>
        </div>
      )}

      <svg viewBox="0 0 100 100" className="h-full w-full" style={{ minHeight: '420px' }}>
        <defs>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(51,65,85,0.3)" strokeWidth="0.15" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="#0c1222" />
        <rect width="100" height="100" fill="url(#grid)" />

        <path
          d="M 35 10 Q 45 8 55 12 Q 65 15 75 10 L 85 15 Q 88 25 85 35 Q 90 45 85 55 Q 82 65 75 70 Q 65 75 55 72 Q 45 78 35 75 Q 25 70 20 60 Q 15 50 18 40 Q 15 30 20 20 Q 25 12 35 10 Z"
          fill="rgba(51, 65, 85, 0.15)"
          stroke="rgba(51, 65, 85, 0.4)"
          strokeWidth="0.3"
        />

        {regions.map((region) => {
          const pos = projectToSVG(region.center);
          const isHovered = hoveredId === region.id;
          const size = context.level === 'country' ? 5 : 4;
          
          return (
            <g key={region.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={size}
                fill={isHovered ? 'rgba(6, 182, 212, 0.4)' : 'rgba(51, 65, 85, 0.3)'}
                stroke={isHovered ? '#06b6d4' : '#334155'}
                strokeWidth="0.3"
                className="cursor-pointer"
                onClick={() => navigateToRegion(region.id)}
                onMouseEnter={() => setHoveredId(region.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
              <text
                x={pos.x}
                y={pos.y + size + 1.5}
                textAnchor="middle"
                fill={isHovered ? '#e2e8f0' : 'rgba(148,163,184,0.7)'}
                fontSize="1.5"
                fontFamily="sans-serif"
              >
                {region.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
