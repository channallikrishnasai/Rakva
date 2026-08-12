"use client";

import type { Asset } from "@/core/contracts";

interface DisasterMapProps {
  assets: Asset[];
  selectedAssetId: string | null;
  onSelectAsset: (id: string) => void;
}

const priorityColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#64748b",
};

export function DisasterMap({ assets, selectedAssetId, onSelectAsset }: DisasterMapProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-slate-700/50 bg-slate-900/80">
      {/* Map Label */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
        <span className="rounded bg-slate-800/90 px-2 py-1 text-[10px] font-medium text-slate-400">
          SIMULATED GEOSPATIAL VIEW
        </span>
        <span className="rounded bg-slate-800/90 px-2 py-1 text-[10px] text-slate-500">
          Conceptual Demonstration
        </span>
      </div>

      <svg
        viewBox="0 0 100 75"
        className="h-full w-full"
        style={{ minHeight: "420px" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(51,65,85,0.3)" strokeWidth="0.15" />
          </pattern>
          <pattern id="water" width="2" height="2" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.2" fill="rgba(56,189,248,0.1)" />
          </pattern>
          <radialGradient id="floodZone" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(56,189,248,0.15)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="100" height="75" fill="#0c1222" />
        <rect width="100" height="75" fill="url(#grid)" />

        {/* Water body / river */}
        <path
          d="M 0 28 Q 15 25 25 30 Q 35 35 45 32 Q 55 29 65 33 Q 75 37 85 34 Q 95 31 100 35 L 100 42 Q 85 38 75 44 Q 65 48 55 40 Q 45 36 35 42 Q 25 48 15 40 Q 5 34 0 38 Z"
          fill="rgba(56,189,248,0.12)"
          stroke="rgba(56,189,248,0.25)"
          strokeWidth="0.2"
        />

        {/* Flood zone */}
        <ellipse cx="50" cy="42" rx="30" ry="22" fill="url(#floodZone)" />

        {/* Roads */}
        <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(100,116,139,0.5)" strokeWidth="0.6" strokeDasharray="1.5,0.5" />
        <line x1="50" y1="10" x2="50" y2="68" stroke="rgba(100,116,139,0.5)" strokeWidth="0.6" strokeDasharray="1.5,0.5" />
        <line x1="20" y1="15" x2="80" y2="65" stroke="rgba(100,116,139,0.35)" strokeWidth="0.4" strokeDasharray="1,0.5" />
        <line x1="80" y1="15" x2="20" y2="65" stroke="rgba(100,116,139,0.35)" strokeWidth="0.4" strokeDasharray="1,0.5" />

        {/* Road labels */}
        <text x="50" y="49" textAnchor="middle" fill="rgba(148,163,184,0.4)" fontSize="1.2" fontFamily="monospace">
          MAIN RD
        </text>
        <text x="51" y="22" textAnchor="middle" fill="rgba(148,163,184,0.4)" fontSize="1.2" fontFamily="monospace" transform="rotate(-90, 51, 22)">
          CROSS AVE
        </text>

        {/* Buildings (generic) */}
        {[
          { x: 30, y: 48, w: 3, h: 2.5 },
          { x: 33, y: 48, w: 2.5, h: 2 },
          { x: 65, y: 48, w: 3, h: 2.5 },
          { x: 68, y: 48, w: 2.5, h: 2.5 },
          { x: 30, y: 52, w: 2.5, h: 2 },
          { x: 65, y: 52, w: 2.5, h: 2 },
          { x: 15, y: 45, w: 2, h: 1.5 },
          { x: 80, y: 45, w: 2, h: 1.5 },
        ].map((b, i) => (
          <rect
            key={`building-bg-${i}`}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill="rgba(51,65,85,0.4)"
            stroke="rgba(71,85,105,0.5)"
            strokeWidth="0.15"
            rx="0.2"
          />
        ))}

        {/* Grid labels */}
        <text x="2" y="2" fill="rgba(100,116,139,0.25)" fontSize="0.8" fontFamily="monospace">N</text>
        <text x="2" y="73" fill="rgba(100,116,139,0.25)" fontSize="0.8" fontFamily="monospace">S</text>
        <text x="96" y="2" fill="rgba(100,116,139,0.25)" fontSize="0.8" fontFamily="monospace">E</text>
        <text x="96" y="73" fill="rgba(100,116,139,0.25)" fontSize="0.8" fontFamily="monospace">W</text>

        {/* Scale bar */}
        <line x1="80" y1="71" x2="95" y2="71" stroke="rgba(148,163,184,0.4)" strokeWidth="0.2" />
        <line x1="80" y1="70.5" x2="80" y2="71.5" stroke="rgba(148,163,184,0.4)" strokeWidth="0.2" />
        <line x1="95" y1="70.5" x2="95" y2="71.5" stroke="rgba(148,163,184,0.4)" strokeWidth="0.2" />
        <text x="87.5" y="70.3" textAnchor="middle" fill="rgba(148,163,184,0.35)" fontSize="0.8" fontFamily="monospace">
          5 km
        </text>

        {/* Compass */}
        <g transform="translate(93, 6)">
          <circle r="2.5" fill="rgba(15,23,42,0.8)" stroke="rgba(51,65,85,0.5)" strokeWidth="0.15" />
          <text y="-0.8" textAnchor="middle" fill="rgba(148,163,184,0.6)" fontSize="1.2" fontWeight="bold" fontFamily="sans-serif">N</text>
          <line x1="0" y1="-0.3" x2="0" y2="1.5" stroke="rgba(148,163,184,0.3)" strokeWidth="0.15" />
          <polygon points="0,-1.8 -0.4,-1 0.4,-1" fill="rgba(239,68,68,0.5)" />
        </g>

        {/* Asset markers */}
        {assets.map((asset) => {
          const isSelected = asset.id === selectedAssetId;
          const priorityLabel = asset.priorityMetrics?.priorityLabel || "low";
          const color = priorityColors[priorityLabel];
          const r = isSelected ? 2.8 : 2;
          const pulseR = isSelected ? 4.5 : 0;
          const mx = asset.visualization?.mapPosition?.x || 0;
          const my = asset.visualization?.mapPosition?.y || 0;

          return (
            <g
              key={asset.id}
              onClick={() => onSelectAsset(asset.id)}
              className="cursor-pointer"
              role="button"
              aria-label={`Select ${asset.name}`}
            >
              {/* Selection pulse ring */}
              {isSelected && (
                <>
                  <circle
                    cx={mx}
                    cy={my}
                    r={pulseR}
                    fill="none"
                    stroke={color}
                    strokeWidth="0.15"
                    opacity="0.3"
                  >
                    <animate
                      attributeName="r"
                      values={`${r};${pulseR};${r}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.5;0.1;0.5"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}

              {/* Affected radius */}
              <circle
                cx={mx}
                cy={my}
                r={(asset.visualization?.affectedRadius || 10) / 10}
                fill={`${color}10`}
                stroke={`${color}30`}
                strokeWidth="0.15"
                strokeDasharray="0.5,0.3"
              />

              {/* Marker background */}
              <circle
                cx={mx}
                cy={my}
                r={r}
                fill={isSelected ? color : `${color}cc`}
                stroke={isSelected ? "#fff" : color}
                strokeWidth={isSelected ? 0.4 : 0.25}
                filter={isSelected ? "url(#glow)" : undefined}
              />

              {/* Asset icon (simplified) */}
              <text
                x={mx}
                y={my + 0.1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="1.2"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {asset.type === "bridge" ? "B" :
                 asset.type === "road" ? "R" :
                 asset.type === "building" ? "H" :
                 asset.type === "hospital" ? "+" : "U"}
              </text>

              {/* Asset label */}
              <text
                x={mx}
                y={my + r + 1.5}
                textAnchor="middle"
                fill={isSelected ? "#e2e8f0" : "rgba(148,163,184,0.7)"}
                fontSize="0.9"
                fontFamily="monospace"
                fontWeight={isSelected ? "bold" : "normal"}
              >
                {asset.id}
              </text>

              {/* Priority label for selected */}
              {isSelected && (
                <text
                  x={mx}
                  y={my + r + 2.8}
                  textAnchor="middle"
                  fill={color}
                  fontSize="0.8"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  P:{asset.priorityMetrics?.recoveryPriority}
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(3, 62)">
          <rect x="-1" y="-1.5" width="18" height="12" fill="rgba(15,23,42,0.85)" rx="0.5" stroke="rgba(51,65,85,0.4)" strokeWidth="0.15" />
          <text x="0" y="0" fill="rgba(148,163,184,0.8)" fontSize="0.9" fontWeight="bold" fontFamily="sans-serif">LEGEND</text>

          <circle cx="1" cy="2" r="0.7" fill="#ef4444" />
          <text x="2.5" y="2.4" fill="rgba(148,163,184,0.6)" fontSize="0.8" fontFamily="monospace">CRITICAL</text>

          <circle cx="1" cy="4.2" r="0.7" fill="#f97316" />
          <text x="2.5" y="4.6" fill="rgba(148,163,184,0.6)" fontSize="0.8" fontFamily="monospace">HIGH</text>

          <circle cx="1" cy="6.4" r="0.7" fill="#eab308" />
          <text x="2.5" y="6.8" fill="rgba(148,163,184,0.6)" fontSize="0.8" fontFamily="monospace">MEDIUM</text>

          <circle cx="1" cy="8.6" r="0.7" fill="#64748b" />
          <text x="2.5" y="9" fill="rgba(148,163,184,0.6)" fontSize="0.8" fontFamily="monospace">MONITORED</text>
        </g>
      </svg>
    </div>
  );
}
