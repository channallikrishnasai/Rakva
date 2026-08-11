"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Line } from "@react-three/drei";
import * as THREE from "three";

function Terrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(50, 50, 80, 80);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      let h = 0;
      h += Math.sin(x * 0.3) * 0.08;
      h += Math.cos(z * 0.25) * 0.06;
      h += Math.sin(x * 0.15 + z * 0.1) * 0.12;
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter > 12) h += (distFromCenter - 12) * 0.015;
      const riverDist = Math.abs(z + 1.8 + Math.sin(x * 0.4) * 0.6);
      if (riverDist < 1.8) h -= (1.8 - riverDist) * 0.12;
      if (x < -6) {
        const mountainFactor = Math.max(0, (-6 - x) * 0.8);
        h += mountainFactor * (1 - Math.abs(z) * 0.06);
      }
      pos.setZ(i, h);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow geometry={geo}>
        <meshStandardMaterial color="#3a6a7a" roughness={0.85} metalness={0.05} />
      </mesh>
      <gridHelper args={[50, 50, "#4a7a8a", "#3a6a7a"]} position={[0, -0.09, 0]} />
    </group>
  );
}

function Mountains() {
  const peaks = useMemo(() => [
    { x: -10, z: -6, h: 5, r: 3.5 },
    { x: -14, z: -4, h: 4, r: 3 },
    { x: -8, z: -8, h: 3.5, r: 2.8 },
    { x: -12, z: -7, h: 4.5, r: 3.2 },
    { x: -16, z: -5, h: 3, r: 2.5 },
  ], []);

  return (
    <group>
      {peaks.map((p, i) => (
        <mesh key={i} position={[p.x, p.h / 2 - 0.3, p.z]} castShadow>
          <coneGeometry args={[p.r, p.h, 6]} />
          <meshStandardMaterial color="#4a7a8a" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[-11, 0.8, -5]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[12, 1.6, 6]} />
        <meshStandardMaterial color="#3a6a7a" roughness={0.85} />
      </mesh>
    </group>
  );
}

function River() {
  const ref = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (ref.current) {
      elapsed.current += delta;
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.55 + Math.sin(elapsed.current * 0.5) * 0.05;
    }
  });

  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-20, 0.03, -1.0),
    new THREE.Vector3(-12, 0.03, -2.2),
    new THREE.Vector3(-4, 0.03, -1.6),
    new THREE.Vector3(0, 0.03, -2.5),
    new THREE.Vector3(4, 0.03, -1.9),
    new THREE.Vector3(8, 0.03, -2.4),
    new THREE.Vector3(14, 0.03, -1.7),
    new THREE.Vector3(20, 0.03, -2.0),
  ], false), []);

  const points = useMemo(() => curve.getPoints(80), [curve]);

  return (
    <group>
      <Line points={points.map((p) => [p.x, p.y + 0.01, p.z])} color="#5cc0e8" lineWidth={3.5} opacity={0.85} transparent />
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1.9]}>
        <planeGeometry args={[42, 2.8]} />
        <meshStandardMaterial color="#2a9ad0" transparent opacity={0.55} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -1.9]}>
        <planeGeometry args={[42, 4.5]} />
        <meshStandardMaterial color="#3ab0e0" transparent opacity={0.18} roughness={0.5} />
      </mesh>
      <Text position={[11, 0.25, -3.2]} fontSize={0.3} color="#6ad0f0" anchorX="center" anchorY="middle" font={undefined} fillOpacity={0.85}>
        RIVER
      </Text>
    </group>
  );
}

function Road({ points, color = "#5a7a8a" }: { points: [number, number, number][]; color?: string }) {
  const geo = useMemo(() => {
    if (points.length < 2) return null;
    const pts3d = points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
    const curve = new THREE.CatmullRomCurve3(pts3d, false, "catmullrom", 0.5);
    return new THREE.TubeGeometry(curve, points.length * 8, 0.18, 4, false);
  }, [points]);

  if (!geo) return null;

  return (
    <mesh geometry={geo} position={[0, 0.02, 0]} receiveShadow>
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

function ProceduralBuilding({ x, z, h, w = 0.6, d = 0.6, color = "#4a6a8a", opacity = 1 }: {
  x: number; z: number; h: number; w?: number; d?: number; color?: string; opacity?: number;
}) {
  return (
    <mesh position={[x, h / 2, z]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={0.75} transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
}

function CityBlock({ center, seed, opacity }: { center: [number, number]; seed: number; opacity: number }) {
  const buildings = useMemo(() => {
    const rng = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };
    const result: { x: number; z: number; h: number; w: number; d: number; color: string }[] = [];
    const colors = ["#5a7a9a", "#4a7a8a", "#6a8a9a", "#5a8a9a", "#7a9aaa"];
    for (let i = 0; i < 14; i++) {
      const bx = center[0] + (rng(seed + i * 7) - 0.5) * 4;
      const bz = center[1] + (rng(seed + i * 13) - 0.5) * 4;
      const bh = 0.3 + rng(seed + i * 19) * 1.8;
      const bw = 0.3 + rng(seed + i * 23) * 0.6;
      const bd = 0.3 + rng(seed + i * 29) * 0.6;
      const color = colors[Math.floor(rng(seed + i * 31) * colors.length)];
      result.push({ x: bx, z: bz, h: bh, w: bw, d: bd, color });
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
          color={b.color}
          opacity={opacity}
        />
      ))}
    </group>
  );
}

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
          <meshStandardMaterial color="#5a8a9a" roughness={0.8} transparent opacity={opacity} />
        </mesh>
      ))}
      <Text
        position={[position[0], 1.3, position[2]]}
        fontSize={0.22}
        color="#a0c8d8"
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

function Bridge({ opacity }: { opacity: number }) {
  return (
    <group position={[3, 0, 0]}>
      <mesh position={[-2.8, 0.08, 0]} receiveShadow>
        <boxGeometry args={[1.8, 0.12, 0.9]} />
        <meshStandardMaterial color="#6a8a9a" transparent opacity={opacity} />
      </mesh>
      <mesh position={[2.8, 0.08, 0]} receiveShadow>
        <boxGeometry args={[1.8, 0.12, 0.9]} />
        <meshStandardMaterial color="#6a8a9a" transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.22, 1.0]} />
        <meshStandardMaterial color="#8aaaba" transparent opacity={opacity} roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.35, 0.48]}>
        <boxGeometry args={[4.2, 0.12, 0.04]} />
        <meshStandardMaterial color="#9abaca" transparent opacity={opacity * 0.85} />
      </mesh>
      <mesh position={[0, 1.35, -0.48]}>
        <boxGeometry args={[4.2, 0.12, 0.04]} />
        <meshStandardMaterial color="#9abaca" transparent opacity={opacity * 0.85} />
      </mesh>
      {[[-1.4, 0], [0, 0], [1.4, 0]].map(([px, pz], i) => (
        <group key={i}>
          <mesh position={[px, 0.55, pz]} castShadow>
            <boxGeometry args={[0.2, 1.1, 0.2]} />
            <meshStandardMaterial color="#7a9aaa" transparent opacity={opacity} />
          </mesh>
          <mesh position={[px, 0.02, pz]}>
            <boxGeometry args={[0.5, 0.04, 0.5]} />
            <meshStandardMaterial color="#6a8a9a" transparent opacity={opacity} />
          </mesh>
        </group>
      ))}
      <Text position={[0, 1.85, 0]} fontSize={0.24} color="#f0f4f8" anchorX="center" anchorY="middle" font={undefined} fillOpacity={opacity}>
        BRIDGE
      </Text>
    </group>
  );
}

function Hospital({ opacity }: { opacity: number }) {
  return (
    <group position={[6, 0, -4]}>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 1.8, 1.4]} />
        <meshStandardMaterial color="#5a7a9a" roughness={0.7} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-1.3, 0.6, 0]} castShadow>
        <boxGeometry args={[0.8, 1.2, 1.0]} />
        <meshStandardMaterial color="#4a6a8a" roughness={0.75} transparent opacity={opacity} />
      </mesh>
      <mesh position={[1.3, 0.6, 0]} castShadow>
        <boxGeometry args={[0.8, 1.2, 1.0]} />
        <meshStandardMaterial color="#4a6a8a" roughness={0.75} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 1.2, 0.71]}>
        <boxGeometry args={[0.4, 0.12, 0.01]} />
        <meshStandardMaterial color="#ff6666" emissive="#ff4444" emissiveIntensity={1.2} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 1.2, 0.71]}>
        <boxGeometry args={[0.12, 0.4, 0.01]} />
        <meshStandardMaterial color="#ff6666" emissive="#ff4444" emissiveIntensity={1.2} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <boxGeometry args={[0.6, 0.15, 0.6]} />
        <meshStandardMaterial color="#6a8aaa" roughness={0.6} transparent opacity={opacity} />
      </mesh>
      <Text position={[0, 2.3, 0]} fontSize={0.22} color="#f0f4f8" anchorX="center" anchorY="middle" font={undefined} fillOpacity={opacity}>
        HOSPITAL
      </Text>
    </group>
  );
}

export function CityScene() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <hemisphereLight args={["#8ab0d0", "#3a5a6a", 0.6]} />
      <directionalLight
        position={[8, 14, 6]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight position={[-5, 8, -4]} intensity={0.6} color="#8ab0d0" />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#60a0c0" distance={30} />
      <fog attach="fog" args={["#0a0e1a", 50, 90]} />

      <Terrain />
      <Mountains />
      <River />

      <Road points={[[-16, 0.04, -2], [-8, 0.04, -2.2], [0, 0.04, -2], [8, 0.04, -1.8], [16, 0.04, -2.1]]} />
      <Road points={[[0, 0.04, -16], [0.2, 0.04, -8], [0, 0.04, 0], [-0.2, 0.04, 8], [0, 0.04, 16]]} />
      <Road points={[[-9, 0.04, 5], [-4, 0.04, 2], [1, 0.04, 0], [6, 0.04, -2], [10, 0.04, -4]]} color="#4a6a8a" />

      <CityBlock center={[-5, 1]} seed={42} opacity={1} />
      <CityBlock center={[7, 3]} seed={99} opacity={0.8} />
      <CityBlock center={[-2, -6]} seed={17} opacity={0.7} />
      <CityBlock center={[4, 5]} seed={73} opacity={0.75} />

      <CommunityCluster position={[6, 0, -9]} label="COMMUNITY A" opacity={1} />
      <CommunityCluster position={[-6, 0, 5]} label="COMMUNITY B" opacity={1} />

      <Bridge opacity={1} />
      <Hospital opacity={1} />
    </>
  );
}
