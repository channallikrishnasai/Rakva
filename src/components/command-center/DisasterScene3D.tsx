"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
import * as THREE from "three";
import type { Asset } from "@/core/contracts";

export type SceneLayer = "situation" | "damage" | "dependencies" | "recovery";

interface DisasterScene3DProps {
  assets: Asset[];
  selectedAssetId: string | null;
  onSelectAsset: (id: string) => void;
  whatIfActive: boolean;
  sceneLayer: SceneLayer;
}

const priorityColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#64748b",
};

function CameraController({ assets, selectedAssetId }: { assets: Asset[]; selectedAssetId: string | null }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 14, 16));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const t = useRef(0);

  useEffect(() => {
    t.current = 0;
    const asset = assets.find(a => a.id === selectedAssetId);
    const pos = asset?.visualization?.scenePosition;
    if (pos) {
      targetPos.current.set(pos.x + 4, 9, pos.z + 9);
      targetLookAt.current.set(pos.x, 0.5, pos.z);
    } else {
      targetPos.current.set(0, 14, 16);
      targetLookAt.current.set(0, 0, 0);
    }
  }, [assets, selectedAssetId]);

  useFrame((_, delta) => {
    t.current = Math.min(t.current + delta * 1.2, 1);
    const ease = 1 - Math.pow(1 - t.current, 3);
    camera.position.lerp(targetPos.current, 0.04 * ease + 0.01);
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const currentTarget = dir.multiplyScalar(12).add(camera.position);
    currentTarget.lerp(targetLookAt.current, 0.04 * ease + 0.01);
    camera.lookAt(currentTarget);
  });

  return null;
}

/* ─────────────────────── TERRAIN ─────────────────────── */

function Terrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(32, 32, 64, 64);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      const distFromCenter = Math.sqrt(x * x + z * z);
      let h = 0;
      h += Math.sin(x * 0.3) * 0.08;
      h += Math.cos(z * 0.25) * 0.06;
      h += Math.sin(x * 0.15 + z * 0.1) * 0.12;
      if (distFromCenter > 10) h += (distFromCenter - 10) * 0.02;
      const riverDist = Math.abs(z + 1.8 + Math.sin(x * 0.4) * 0.6);
      if (riverDist < 1.5) h -= (1.5 - riverDist) * 0.15;
      pos.setZ(i, h);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow geometry={geo}>
        <meshStandardMaterial color="#0d1321" roughness={0.95} metalness={0.05} />
      </mesh>
      <gridHelper args={[32, 32, "#151d30", "#111827"]} position={[0, -0.07, 0]} />
    </group>
  );
}

/* ─────────────────────── WATER / RIVER ─────────────────────── */

function River() {
  const ref = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (ref.current) {
      elapsed.current += delta;
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.35 + Math.sin(elapsed.current * 0.5) * 0.05;
    }
  });

  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-16, 0.03, -1.0),
    new THREE.Vector3(-10, 0.03, -2.2),
    new THREE.Vector3(-4, 0.03, -1.6),
    new THREE.Vector3(0, 0.03, -2.5),
    new THREE.Vector3(4, 0.03, -1.9),
    new THREE.Vector3(8, 0.03, -2.4),
    new THREE.Vector3(12, 0.03, -1.7),
    new THREE.Vector3(16, 0.03, -2.0),
  ], false), []);

  const points = useMemo(() => curve.getPoints(80), [curve]);

  return (
    <group>
      <Line points={points.map((p) => [p.x, p.y + 0.01, p.z])} color="#1e6091" lineWidth={3} opacity={0.6} transparent />
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1.9]}>
        <planeGeometry args={[34, 2.8]} />
        <meshStandardMaterial color="#0c4a6e" transparent opacity={0.35} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -1.9]}>
        <planeGeometry args={[34, 4.5]} />
        <meshStandardMaterial color="#0369a1" transparent opacity={0.08} roughness={0.5} />
      </mesh>
      <Text position={[9, 0.25, -3.2]} fontSize={0.3} color="#2980b9" anchorX="center" anchorY="middle" font={undefined} fillOpacity={0.6}>
        RIVER
      </Text>
    </group>
  );
}

function FloodBoundary() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, -1.9]}>
      <ringGeometry args={[14, 17, 64]} />
      <meshStandardMaterial color="#0369a1" transparent opacity={0.04} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─────────────────────── ROADS ─────────────────────── */

function Road({ points, width = 0.35, color = "#1a2236" }: { points: [number, number, number][]; width?: number; color?: string }) {
  const geo = useMemo(() => {
    if (points.length < 2) return null;
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(width / 2, 0);
    shape.lineTo(width / 2, 0.04);
    shape.lineTo(-width / 2, 0.04);
    shape.closePath();

    const pts3d = points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
    const curve = new THREE.CatmullRomCurve3(pts3d, false, "catmullrom", 0.5);
    return new THREE.TubeGeometry(curve, points.length * 8, 0.18, 4, false);
  }, [points, width]);

  if (!geo) return null;

  return (
    <mesh geometry={geo} position={[0, 0.02, 0]} receiveShadow>
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

/* ─────────────────────── PROCEDURAL CITY ─────────────────────── */

function ProceduralBuilding({ x, z, h, w = 0.6, d = 0.6, color = "#141c2e", opacity = 1 }: {
  x: number; z: number; h: number; w?: number; d?: number; color?: string; opacity?: number;
}) {
  return (
    <mesh position={[x, h / 2, z]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={0.85} transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
}

function CityBlock({ center, seed, opacity }: { center: [number, number]; seed: number; opacity: number }) {
  const buildings = useMemo(() => {
    const rng = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };
    const result: { x: number; z: number; h: number; w: number; d: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const bx = center[0] + (rng(seed + i * 7) - 0.5) * 3.5;
      const bz = center[1] + (rng(seed + i * 13) - 0.5) * 3.5;
      const bh = 0.3 + rng(seed + i * 19) * 1.4;
      const bw = 0.3 + rng(seed + i * 23) * 0.5;
      const bd = 0.3 + rng(seed + i * 29) * 0.5;
      result.push({ x: bx, z: bz, h: bh, w: bw, d: bd });
    }
    return result;
  }, [center, seed]);

  return (
    <group>
      {buildings.map((b, i) => (
        <ProceduralBuilding
          key={i}
          x={b.x}
          z={b.z}
          h={b.h}
          w={b.w}
          d={b.d}
          color="#111827"
          opacity={opacity}
        />
      ))}
    </group>
  );
}

/* ─────────────────────── COMMUNITY CLUSTERS ─────────────────────── */

function CommunityCluster({ position, label, opacity }: { position: [number, number, number]; label: string; opacity: number }) {
  const buildings = useMemo(() => {
    const offsets: [number, number, number][] = [
      [-0.8, -0.6, 0.4], [0.2, 0.5, 0.35], [-0.3, 0.7, -0.5],
      [0.6, -0.4, 0.7], [-0.5, 0.3, -0.7], [0.15, -0.7, 0.15],
      [0.7, 0.1, -0.3], [-0.7, -0.2, 0.55],
    ];
    const heights = [0.45, 0.6, 0.35, 0.7, 0.5, 0.4, 0.55, 0.3];
    return offsets.map((off, i) => ({
      pos: [position[0] + off[0], 0, position[2] + off[2]] as [number, number, number],
      h: heights[i],
      w: 0.35 + (i % 3) * 0.1,
    }));
  }, [position]);

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.pos[0], b.h / 2, b.pos[2]]} castShadow>
          <boxGeometry args={[b.w, b.h, b.w]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} transparent opacity={opacity} />
        </mesh>
      ))}
      <Text
        position={[position[0], 1.3, position[2]]}
        fontSize={0.22}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
        font={undefined}
        fillOpacity={opacity}
      >
        {label}
      </Text>
    </group>
  );
}

/* ─────────────────────── BRIDGE (detailed) ─────────────────────── */

function Bridge({ asset, isSelected, isSimulated, isSubdued, onClick }: {
  asset: Asset; isSelected: boolean; isSimulated: boolean; isSubdued: boolean; onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pos = asset.visualization?.scenePosition || { x: 0, z: 0 };
  const opacity = isSubdued ? 0.25 : 1;
  const col = isSimulated ? "#334155" : priorityColors[asset.priorityMetrics?.category || "low"];

  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (groupRef.current) {
      elapsed.current += delta;
      groupRef.current.position.y = isSelected ? Math.sin(elapsed.current * 2) * 0.03 : 0;
    }
  });

  return (
    <group ref={groupRef} position={[pos.x, 0, pos.z]} onClick={onClick}>
      {/* Approach roads */}
      <mesh position={[-2.8, 0.08, 0]} receiveShadow>
        <boxGeometry args={[1.8, 0.12, 0.9]} />
        <meshStandardMaterial color="#1a2236" transparent opacity={opacity} />
      </mesh>
      <mesh position={[2.8, 0.08, 0]} receiveShadow>
        <boxGeometry args={[1.8, 0.12, 0.9]} />
        <meshStandardMaterial color="#1a2236" transparent opacity={opacity} />
      </mesh>
      {/* Bridge deck */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.22, 1.0]} />
        <meshStandardMaterial color={isSimulated ? "#1e293b" : "#374151"} transparent opacity={opacity} roughness={0.7} />
      </mesh>
      {/* Railings */}
      <mesh position={[0, 1.35, 0.48]}>
        <boxGeometry args={[4.2, 0.12, 0.04]} />
        <meshStandardMaterial color="#4b5563" transparent opacity={opacity * 0.7} />
      </mesh>
      <mesh position={[0, 1.35, -0.48]}>
        <boxGeometry args={[4.2, 0.12, 0.04]} />
        <meshStandardMaterial color="#4b5563" transparent opacity={opacity * 0.7} />
      </mesh>
      {/* Pillars */}
      {[[-1.4, 0], [0, 0], [1.4, 0]].map(([px, pz], i) => (
        <group key={i}>
          <mesh position={[px, 0.55, pz]} castShadow>
            <boxGeometry args={[0.2, 1.1, 0.2]} />
            <meshStandardMaterial color={isSimulated ? "#111827" : "#2d3748"} transparent opacity={opacity} />
          </mesh>
          <mesh position={[px, 0.02, pz]}>
            <boxGeometry args={[0.5, 0.04, 0.5]} />
            <meshStandardMaterial color="#1a2236" transparent opacity={opacity} />
          </mesh>
        </group>
      ))}
      {/* Priority indicator */}
      <mesh position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.22, 8]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={isSelected ? 0.7 : 0.2} transparent opacity={opacity} />
      </mesh>
      {/* Selection ring */}
      {isSelected && !isSimulated && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.4, 2.7, 48]} />
          <meshStandardMaterial color={col} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Labels */}
      <Text position={[0, 2.15, 0]} fontSize={0.26} color="white" anchorX="center" anchorY="middle" font={undefined} fillOpacity={opacity}>
        {isSelected ? asset.id : "BRIDGE"}
      </Text>
      {isSelected && (
        <Text position={[0, 2.5, 0]} fontSize={0.2} color={col} anchorX="center" anchorY="middle" font={undefined}>
          Priority: {asset.priorityMetrics?.score}
        </Text>
      )}
    </group>
  );
}

/* ─────────────────────── HOSPITAL (distinctive) ─────────────────────── */

function Hospital({ asset, isSelected, isSubdued, onClick }: {
  asset: Asset; isSelected: boolean; isSubdued: boolean; onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pos = asset.visualization?.scenePosition || { x: 5, z: -5.5 };
  const opacity = isSubdued ? 0.25 : 1;
  const col = priorityColors[asset.priorityMetrics?.category || "low"];

  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (groupRef.current) {
      elapsed.current += delta;
      groupRef.current.position.y = isSelected ? Math.sin(elapsed.current * 2) * 0.03 : 0;
    }
  });

  return (
    <group ref={groupRef} position={[pos.x, 0, pos.z]} onClick={onClick}>
      {/* Main building */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 1.8, 1.4]} />
        <meshStandardMaterial color="#1a2744" roughness={0.8} transparent opacity={opacity} />
      </mesh>
      {/* Wing left */}
      <mesh position={[-1.3, 0.6, 0]} castShadow>
        <boxGeometry args={[0.8, 1.2, 1.0]} />
        <meshStandardMaterial color="#162036" roughness={0.85} transparent opacity={opacity} />
      </mesh>
      {/* Wing right */}
      <mesh position={[1.3, 0.6, 0]} castShadow>
        <boxGeometry args={[0.8, 1.2, 1.0]} />
        <meshStandardMaterial color="#162036" roughness={0.85} transparent opacity={opacity} />
      </mesh>
      {/* Red cross */}
      <mesh position={[0, 1.2, 0.71]}>
        <boxGeometry args={[0.4, 0.12, 0.01]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 1.2, 0.71]}>
        <boxGeometry args={[0.12, 0.4, 0.01]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} transparent opacity={opacity} />
      </mesh>
      {/* Roof element */}
      <mesh position={[0, 1.9, 0]}>
        <boxGeometry args={[0.6, 0.15, 0.6]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.7} transparent opacity={opacity} />
      </mesh>
      {/* Priority indicator */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={isSelected ? 0.7 : 0.2} transparent opacity={opacity} />
      </mesh>
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.2, 48]} />
          <meshStandardMaterial color={col} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
      <Text position={[0, 2.55, 0]} fontSize={0.24} color="white" anchorX="center" anchorY="middle" font={undefined} fillOpacity={opacity}>
        {isSelected ? asset.id : "HOSPITAL"}
      </Text>
    </group>
  );
}

/* ─────────────────────── BUILDING (varied) ─────────────────────── */

function Building({ asset, isSelected, isSubdued, onClick }: {
  asset: Asset; isSelected: boolean; isSubdued: boolean; onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pos = asset.visualization?.scenePosition || { x: -5, z: 3.5 };
  const opacity = isSubdued ? 0.25 : 1;
  const col = priorityColors[asset.priorityMetrics?.category || "low"];

  const dims = useMemo(() => {
    const h = asset.damageSeverity === "severe" ? 1.0 : asset.damageSeverity === "moderate" ? 1.3 : 1.6;
    const w = asset.id === "BUILDING-031" ? 1.8 : 1.2;
    return { h, w };
  }, [asset.damageSeverity, asset.id]);

  const bColor = asset.damageSeverity === "severe" ? "#4a1515" : asset.damageSeverity === "moderate" ? "#422006" : "#141c2e";

  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (groupRef.current) {
      elapsed.current += delta;
      groupRef.current.position.y = isSelected ? Math.sin(elapsed.current * 2) * 0.03 : 0;
    }
  });

  return (
    <group ref={groupRef} position={[pos.x, 0, pos.z]} onClick={onClick}>
      <mesh position={[0, dims.h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[dims.w, dims.h, dims.w * 0.8]} />
        <meshStandardMaterial color={bColor} roughness={0.85} transparent opacity={opacity} />
      </mesh>
      {/* Window strips */}
      {[0.3, 0.7].map((y, i) => (
        <mesh key={i} position={[0, y, dims.w * 0.4 + 0.01]}>
          <boxGeometry args={[dims.w * 0.6, 0.06, 0.01]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={opacity * 0.5} />
        </mesh>
      ))}
      {/* Priority indicator */}
      <mesh position={[0, dims.h + 0.15, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.18, 8]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={isSelected ? 0.7 : 0.2} transparent opacity={opacity} />
      </mesh>
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.6, 48]} />
          <meshStandardMaterial color={col} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
      <Text position={[0, dims.h + 0.5, 0]} fontSize={0.22} color="white" anchorX="center" anchorY="middle" font={undefined} fillOpacity={opacity}>
        {isSelected ? asset.id : asset.name.split(" ")[0]}
      </Text>
    </group>
  );
}

/* ─────────────────────── UTILITY ─────────────────────── */

function Utility({ asset, isSelected, isSubdued, onClick }: {
  asset: Asset; isSelected: boolean; isSubdued: boolean; onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pos = asset.visualization?.scenePosition || { x: -7, z: -2.5 };
  const opacity = isSubdued ? 0.25 : 1;
  const col = priorityColors[asset.priorityMetrics?.category || "low"];

  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (groupRef.current) {
      elapsed.current += delta;
      groupRef.current.position.y = isSelected ? Math.sin(elapsed.current * 2) * 0.03 : 0;
    }
  });

  return (
    <group ref={groupRef} position={[pos.x, 0, pos.z]} onClick={onClick}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.85, 1.4, 8]} />
        <meshStandardMaterial color="#141c2e" roughness={0.8} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.15, 8]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={isSelected ? 0.7 : 0.2} transparent opacity={opacity} />
      </mesh>
      {isSelected && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.5, 48]} />
          <meshStandardMaterial color={col} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
      <Text position={[0, 1.85, 0]} fontSize={0.22} color="white" anchorX="center" anchorY="middle" font={undefined} fillOpacity={opacity}>
        {isSelected ? asset.id : "UTILITY"}
      </Text>
    </group>
  );
}

/* ─────────────────────── DEPENDENCY LINES (progressive) ─────────────────────── */

function DependencyLine({ from, to, label, visible, delay }: {
  from: [number, number, number]; to: [number, number, number]; label: string; visible: boolean; delay: number;
}) {
  const [opacity, setOpacity] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (visible) {
      timerRef.current = setTimeout(() => setShowLabel(true), delay);
    } else {
      timerRef.current = setTimeout(() => setShowLabel(false), 0);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [visible, delay]);

  useFrame(() => {
    const target = visible ? 0.65 : 0;
    setOpacity((prev) => prev + (target - prev) * 0.06);
  });

  if (opacity < 0.01) return null;

  const mid = [(from[0] + to[0]) / 2, 2.2, (from[2] + to[2]) / 2] as [number, number, number];

  return (
    <group>
      <Line
        points={[from, mid, to]}
        color="#0891b2"
        lineWidth={1.5}
        opacity={opacity}
        transparent
      />
      {showLabel && (
        <group position={mid}>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[label.length * 0.13 + 0.3, 0.32]} />
            <meshStandardMaterial color="#0e7490" transparent opacity={opacity * 0.6} />
          </mesh>
          <Text fontSize={0.17} color="#ecfeff" anchorX="center" anchorY="middle" font={undefined}>
            {label}
          </Text>
        </group>
      )}
    </group>
  );
}

/* ─────────────────────── EVIDENCE CLUSTER (3D) ─────────────────────── */

function EvidenceCluster({ position, visible, confidence }: { position: [number, number, number]; visible: boolean; confidence: string }) {
  const [opacity, setOpacity] = useState(0);
  const sources = ["SATELLITE", "DRONE", "CITIZEN", "GEOSPATIAL"];

  useFrame(() => {
    const target = visible ? 0.8 : 0;
    setOpacity((prev) => prev + (target - prev) * 0.05);
  });

  if (opacity < 0.01) return null;

  return (
    <group position={[position[0] + 2.2, 1.8, position[2]]}>
      {sources.map((src, i) => {
        const angle = (i / sources.length) * Math.PI * 2 - Math.PI / 2;
        const r = 0.55;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        return (
          <group key={src} position={[x, y, 0]}>
            <mesh>
              <circleGeometry args={[0.12, 16]} />
              <meshStandardMaterial color="#0e7490" transparent opacity={opacity * 0.5} side={THREE.DoubleSide} />
            </mesh>
            <Text fontSize={0.08} color="#67e8f9" anchorX="center" anchorY="middle" font={undefined} fillOpacity={opacity}>
              {src.slice(0, 1)}
            </Text>
          </group>
        );
      })}
      <Text position={[0, 0, 0.01]} fontSize={0.1} color="#a5f3fc" anchorX="center" anchorY="middle" font={undefined} fillOpacity={opacity}>
        {confidence.toUpperCase()}
      </Text>
    </group>
  );
}

/* ─────────────────────── AFFECTED ZONE ─────────────────────── */

function AffectedZone({ asset, visible }: { asset: Asset; visible: boolean }) {
  const pos = asset.visualization?.scenePosition || { x: 0, z: 0 };
  const [opacity, setOpacity] = useState(0);

  useFrame(() => {
    const target = visible ? 0.12 : 0;
    setOpacity((prev) => prev + (target - prev) * 0.04);
  });

  if (opacity < 0.01) return null;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[pos.x, 0.025, pos.z]}>
      <circleGeometry args={[(asset.visualization?.affectedRadius || 10) / 3.5, 48]} />
      <meshStandardMaterial color={priorityColors[asset.priorityMetrics?.category || "low"]} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─────────────────────── MAIN SCENE ─────────────────────── */

function Scene({ assets, selectedAssetId, onSelectAsset, whatIfActive, sceneLayer }: DisasterScene3DProps) {
  const selectedAsset = assets.find((a) => a.id === selectedAssetId);

  const isRelatedToSelection = useCallback((assetId: string) => {
    if (!selectedAssetId) return false;
    if (assetId === selectedAssetId) return true;
    const asset = assets.find(a => a.id === selectedAssetId);
    if (asset?.dependencies) return asset.dependencies.some((d) => d.targetId === assetId);
    return false;
  }, [selectedAssetId, assets]);

  const isSubdued = useCallback((assetId: string) => {
    if (!selectedAssetId) return false;
    return !isRelatedToSelection(assetId);
  }, [selectedAssetId, isRelatedToSelection]);

  const getOpacity = useCallback((assetId: string) => {
    if (!selectedAssetId) return 1;
    return isRelatedToSelection(assetId) ? 1 : 0.2;
  }, [selectedAssetId, isRelatedToSelection]);

  const getAssetComponent = useCallback((asset: Asset) => {
    const isSelected = asset.id === selectedAssetId;
    const isSim = whatIfActive && asset.id === "BRIDGE-024";
    const subdued = sceneLayer === "dependencies" || sceneLayer === "recovery" ? isSubdued(asset.id) : false;
    const onClick = () => onSelectAsset(asset.id);

    switch (asset.type) {
      case "bridge":
        return <Bridge key={asset.id} asset={asset} isSelected={isSelected} isSimulated={isSim} isSubdued={subdued} onClick={onClick} />;
      case "hospital":
        return <Hospital key={asset.id} asset={asset} isSelected={isSelected} isSubdued={subdued} onClick={onClick} />;
      case "building":
        return <Building key={asset.id} asset={asset} isSelected={isSelected} isSubdued={subdued} onClick={onClick} />;
      case "utility":
        return <Utility key={asset.id} asset={asset} isSelected={isSelected} isSubdued={subdued} onClick={onClick} />;
      default:
        return <Building key={asset.id} asset={asset} isSelected={isSelected} isSubdued={subdued} onClick={onClick} />;
    }
  }, [selectedAssetId, onSelectAsset, whatIfActive, sceneLayer, isSubdued]);

  const dependencyLines = useMemo(() => {
    if (!selectedAssetId) return [];
    const sourceAsset = assets.find(a => a.id === selectedAssetId);
    if (!sourceAsset || !sourceAsset.dependencies) return [];
    const sourcePos = sourceAsset.visualization?.scenePosition;
    if (!sourcePos) return [];
    return sourceAsset.dependencies.map((dep, i) => {
      const targetAsset = assets.find(a => a.id === dep.targetId);
      const targetPos = targetAsset?.visualization?.scenePosition;
      if (!targetPos) return null;
      return {
        from: [sourcePos.x, 1.5, sourcePos.z] as [number, number, number],
        to: [targetPos.x, 1.5, targetPos.z] as [number, number, number],
        label: dep.label,
        targetId: dep.targetId,
        delay: i * 400,
      };
    }).filter(Boolean);
  }, [selectedAssetId, assets]);

  const showDeps = sceneLayer === "dependencies" || sceneLayer === "situation";
  const showDamage = sceneLayer === "damage" || sceneLayer === "situation";

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#1a2744", "#0d1321", 0.3]} />
      <directionalLight
        position={[8, 14, 6]}
        intensity={0.55}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight position={[-5, 8, -4]} intensity={0.15} color="#4a6fa5" />
      <fog attach="fog" args={["#0a0e1a", 18, 40]} />

      <CameraController assets={assets} selectedAssetId={selectedAssetId} />

      {/* Environment */}
      <Terrain />
      <River />
      <FloodBoundary />

      {/* Roads */}
      <Road points={[[-12, 0.04, -2], [-6, 0.04, -2.2], [0, 0.04, -2], [6, 0.04, -1.8], [12, 0.04, -2.1]]} width={0.35} />
      <Road points={[[0, 0.04, -12], [0.2, 0.04, -6], [0, 0.04, 0], [-0.2, 0.04, 6], [0, 0.04, 12]]} width={0.3} />
      <Road points={[[-7, 0.04, 4], [-3, 0.04, 2], [1, 0.04, 0], [5, 0.04, -2], [8, 0.04, -3]]} width={0.25} color="#151d2e" />

      {/* City blocks */}
      <CityBlock center={[-4, 1]} seed={42} opacity={getOpacity("BUILDING-018")} />
      <CityBlock center={[6, 3]} seed={99} opacity={0.6} />
      <CityBlock center={[-2, -5]} seed={17} opacity={0.5} />

      {/* Community clusters */}
      <CommunityCluster position={[5, 0, -8]} label="COMMUNITY A" opacity={getOpacity("HOSPITAL-002")} />
      <CommunityCluster position={[-5, 0, 5]} label="COMMUNITY B" opacity={getOpacity("BUILDING-031")} />

      {/* Assets */}
      {assets.map((asset) => getAssetComponent(asset))}

      {/* Affected zones */}
      {showDamage && assets.map((asset) => (
        <AffectedZone key={asset.id} asset={asset} visible={asset.id === selectedAssetId} />
      ))}

      {/* Dependency lines */}
      {showDeps && dependencyLines.map((line) => line && (
        <DependencyLine
          key={line.targetId}
          from={line.from}
          to={line.to}
          label={line.label}
          visible={!!selectedAssetId}
          delay={line.delay}
        />
      ))}

      {/* Evidence cluster */}
      {selectedAsset && (
        <EvidenceCluster
          position={[selectedAsset.visualization?.scenePosition?.x ?? 0, 0, selectedAsset.visualization?.scenePosition?.z ?? 0]}
          visible={!!selectedAssetId}
          confidence={String(selectedAsset.overallEvidenceConfidence || "low")}
        />
      )}

      <OrbitControls
        makeDefault
        minDistance={5}
        maxDistance={28}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.1}
        enablePan={true}
        panSpeed={0.4}
        rotateSpeed={0.4}
        zoomSpeed={0.7}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

/* ─────────────────────── EXPORT ─────────────────────── */

export function DisasterScene3D({ assets, selectedAssetId, onSelectAsset, whatIfActive, sceneLayer }: DisasterScene3DProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-slate-700/50 bg-[#0a0e1a]">
      <Canvas
        shadows
        camera={{ position: [0, 14, 16], fov: 48 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0a0e1a");
          gl.toneMapping = THREE.NoToneMapping;
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
      >
        <Scene
          assets={assets}
          selectedAssetId={selectedAssetId}
          onSelectAsset={onSelectAsset}
          whatIfActive={whatIfActive}
          sceneLayer={sceneLayer}
        />
      </Canvas>

      {/* Scene Label */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
        <span className="rounded bg-slate-800/90 px-2 py-1 text-[10px] font-medium text-slate-400">
          3D DISASTER SCENE
        </span>
        <span className="rounded bg-slate-800/90 px-2 py-1 text-[10px] text-slate-500">
          Conceptual Demonstration
        </span>
      </div>

      {/* Camera instructions */}
      <div className="absolute bottom-3 left-3 z-10">
        <span className="rounded bg-slate-800/80 px-2 py-1 text-[9px] text-slate-500">
          Orbit: drag · Zoom: scroll · Pan: right-drag
        </span>
      </div>
    </div>
  );
}
