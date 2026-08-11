"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { storyStore } from "./storyStore";

function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function smoothstep(t: number) { const c = clamp01(t); return c * c * (3 - 2 * c); }
function sr(s: number) { const x = Math.sin(s) * 43758.5453; return x - Math.floor(x); }

const slopePath = [
  new THREE.Vector3(-18, 10, -14),
  new THREE.Vector3(-16, 7.5, -11),
  new THREE.Vector3(-13, 5, -9),
  new THREE.Vector3(-10, 3, -7),
  new THREE.Vector3(-8, 1.5, -5),
  new THREE.Vector3(-6.5, 0.5, -3.8),
  new THREE.Vector3(-5.5, 0.15, -3),
  new THREE.Vector3(-5, 0.08, -2.5),
];

/* ─── LANDSLIDE DEBRIS ─── */
function LandslideDebris() {
  const count = 55;
  const refs = useRef<THREE.Mesh[]>([]);

  const data = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    size: 0.06 + sr(i * 7) * 0.35,
    latOff: (sr(i * 11) - 0.5) * 2.5,
    rotSpd: new THREE.Vector3(
      (sr(i * 13) - 0.5) * 0.15,
      (sr(i * 17) - 0.5) * 0.08,
      (sr(i * 19) - 0.5) * 0.12
    ),
    delay: sr(i * 23) * 0.3,
    seed: i,
  })), []);

  useFrame(() => {
    const p = storyStore.progress;
    const lp = smoothstep((p - 1 / 8) / (1 / 8));

    for (let i = 0; i < count; i++) {
      const ref = refs.current[i];
      if (!ref) continue;
      const d = data[i];
      const t = clamp01((lp - d.delay) / (0.6 - d.delay));
      const e = t * t * (3 - 2 * t);
      const pi = e * (slopePath.length - 1);
      const idx = Math.min(Math.floor(pi), slopePath.length - 2);
      const pt = pi - idx;
      const from = slopePath[idx];
      const to = slopePath[idx + 1];

      ref.position.x = lerp(from.x, to.x, pt) + d.latOff * (1 - e) * 0.4;
      ref.position.y = lerp(from.y, to.y, pt) + Math.sin(e * Math.PI) * 0.3 * (1 - e);
      ref.position.z = lerp(from.z, to.z, pt) + d.latOff * (1 - e) * 0.25;
      ref.rotation.x += d.rotSpd.x * (1 - e);
      ref.rotation.y += d.rotSpd.y * (1 - e);
      ref.rotation.z += d.rotSpd.z * (1 - e);
      ref.scale.setScalar(lp > d.delay ? 1 : 0);
    }
  });

  return (
    <group>
      {data.map((d, i) => (
        <mesh key={i} ref={el => { if (el) refs.current[i] = el; }} position={[-18, 10, -14]}>
          <dodecahedronGeometry args={[d.size, 0]} />
          <meshStandardMaterial
            color={d.seed % 5 === 0 ? "#7a6a5a" : d.seed % 5 === 1 ? "#6a5a4a" : d.seed % 5 === 2 ? "#8a7a6a" : d.seed % 5 === 3 ? "#5a4a3a" : "#6a5040"}
            roughness={0.94} metalness={0.02}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── DUST CLOUDS ─── */
function DustClouds() {
  const count = 15;
  const refs = useRef<THREE.Mesh[]>([]);

  const data = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    base: new THREE.Vector3(
      -10 + sr(i * 7) * 6,
      0.2 + sr(i * 11) * 3,
      -3.5 + sr(i * 13) * 3
    ),
    scale: 1.0 + sr(i * 17) * 3.5,
    delay: sr(i * 19) * 0.25,
  })), []);

  useFrame(() => {
    const p = storyStore.progress;
    const lp = smoothstep((p - 1 / 8) / (1 / 8));

    refs.current.forEach((ref, i) => {
      if (!ref) return;
      const d = data[i];
      const t = clamp01((lp - d.delay) / 0.5);
      const rise = smoothstep(t);
      const fade = t > 0.5 ? 1 - (t - 0.5) / 0.5 : 1;
      const s = d.scale * rise;
      ref.scale.set(s, s * 0.4, s);
      ref.position.set(d.base.x + rise * 3, d.base.y + rise * 2, d.base.z);
      (ref.material as THREE.MeshStandardMaterial).opacity = rise * 0.1 * fade;
      ref.visible = rise > 0.01;
    });
  });

  return (
    <group>
      {data.map((d, i) => (
        <mesh key={i} ref={el => { if (el) refs.current[i] = el; }} position={d.base}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color="#c0b0a0" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── TERRAIN SCAR ─── */
function TerrainScar() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = storyStore.progress;
    const lp = smoothstep((p - 1 / 8) / (1 / 8));
    if (ref.current) {
      (ref.current.material as THREE.MeshStandardMaterial).opacity = lp * 0.5;
      ref.current.visible = lp > 0.01;
    }
  });

  return (
    <mesh ref={ref} position={[-13, 5, -9]} rotation={[-0.3, 0.2, 0.05]}>
      <planeGeometry args={[5.5, 10]} />
      <meshStandardMaterial color="#3a2a1a" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

/* ─── ROAD BLOCKAGE ─── */
function RoadBlockage() {
  const groupRef = useRef<THREE.Group>(null);
  const rockRefs = useRef<THREE.Mesh[]>([]);

  useFrame(() => {
    const p = storyStore.progress;
    const lp = smoothstep((p - 1 / 8) / (1 / 8));

    if (groupRef.current) {
      groupRef.current.scale.setScalar(lp);
      groupRef.current.visible = lp > 0.01;
    }

    rockRefs.current.forEach((r, i) => {
      if (!r) return;
      const dt = clamp01((lp - 0.4 - i * 0.035) / 0.2);
      r.position.y = lerp(3, 0.1 + sr(i * 31) * 0.12, dt);
      r.rotation.x += 0.02 * (1 - dt);
      r.rotation.z += 0.015 * (1 - dt);
      r.scale.setScalar(dt > 0.01 ? 1 : 0);
    });
  });

  return (
    <group ref={groupRef} position={[-5.5, 0, -2.5]}>
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh key={i} ref={el => { if (el) rockRefs.current[i] = el; }}
          position={[(sr(i * 7) - 0.5) * 4, 3, (sr(i * 11) - 0.5) * 1.8]}>
          <dodecahedronGeometry args={[0.1 + sr(i * 13) * 0.32, 0]} />
          <meshStandardMaterial
            color={i % 4 === 0 ? "#8a7a6a" : i % 4 === 1 ? "#7a6a5a" : i % 4 === 2 ? "#9a8a7a" : "#6a5a4a"}
            roughness={0.94}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── DAMAGE INDICATORS ─── */
function DamageIndicator({ position, label, visible }: {
  position: [number, number, number]; label: string; visible: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const target = visible ? 1 : 0;
    const current = ref.current.userData.opacity ?? 0;
    const next = lerp(current, target, 0.06);
    ref.current.userData.opacity = next;
    ref.current.visible = next > 0.01;
    ref.current.scale.setScalar(next);
  });

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[label.length * 0.085 + 0.22, 0.24]} />
        <meshStandardMaterial color="#991b1b" transparent opacity={0.9} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <Text fontSize={0.12} color="#ffcccc" anchorX="center" anchorY="middle" font={undefined}>
        {label}
      </Text>
    </group>
  );
}

/* ─── EVIDENCE SOURCES ─── */
function EvidenceSource({ position, letter, color, visible, delay }: {
  position: [number, number, number]; letter: string; color: string; visible: boolean; delay: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  useFrame((_, dt) => {
    if (!ref.current) return;
    elapsed.current += dt;
    const p = storyStore.progress;
    const ep = smoothstep((p - 3 / 8) / (1 / 8));
    const appear = ep > delay ? 1 : 0;
    const target = visible ? appear : 0;
    const current = ref.current.userData.opacity ?? 0;
    const next = lerp(current, target, 0.06);
    ref.current.userData.opacity = next;
    ref.current.visible = next > 0.01;
    ref.current.position.y = position[1] + Math.sin(elapsed.current * 0.8) * 0.12;
    ref.current.scale.setScalar(next);
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <circleGeometry args={[0.13, 10]} />
        <meshStandardMaterial color={color} transparent opacity={0.72} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <Text fontSize={0.1} color="white" anchorX="center" anchorY="middle" font={undefined}>
        {letter}
      </Text>
    </group>
  );
}

/* ─── CONVERGENCE LINES ─── */
function ConvergenceLines({ visible }: { visible: boolean }) {
  const ref = useRef<THREE.Group>(null);

  const lines = useMemo(() => [
    { from: [-5, 5, -3.5] as [number, number, number], to: [-2, 0.5, -2.5] as [number, number, number] },
    { from: [-1, 5, -3.5] as [number, number, number], to: [-2, 0.5, -2.5] as [number, number, number] },
    { from: [3, 5, -3.5] as [number, number, number], to: [-2, 0.5, -2.5] as [number, number, number] },
    { from: [6, 5, -3.5] as [number, number, number], to: [-2, 0.5, -2.5] as [number, number, number] },
  ], []);

  useFrame(() => {
    if (!ref.current) return;
    const p = storyStore.progress;
    const ep = smoothstep((p - 3 / 8) / (1 / 8));
    const target = visible ? ep : 0;
    const current = ref.current.userData.opacity ?? 0;
    ref.current.userData.opacity = lerp(current, target, 0.05);
    ref.current.visible = ref.current.userData.opacity > 0.01;
  });

  return (
    <group ref={ref}>
      {lines.map((l, i) => (
        <Line key={i} points={[l.from, l.to]} color="#30b0d0" lineWidth={1.0} opacity={0.5} transparent />
      ))}
    </group>
  );
}

/* ─── PRIORITY ASSETS ─── */
function PriorityAssets() {
  const refs = useRef<THREE.Group[]>([]);

  const assets = useMemo(() => [
    { id: "BUILDING-031", pos: [-5, 0, 5] as [number, number, number], score: 68, severity: "SEVERE DAMAGE", color: "#ef4444" },
    { id: "ROAD-017", pos: [3, 0, 2.5] as [number, number, number], score: 82, severity: "HIGH DAMAGE", color: "#f97316" },
    { id: "BRIDGE-024", pos: [5.5, 0, -3.6] as [number, number, number], score: 94, severity: "MODERATE DAMAGE", color: "#eab308" },
  ], []);

  useFrame(() => {
    const p = storyStore.progress;
    const pp = smoothstep((p - 5 / 8) / (1 / 8));

    refs.current.forEach((ref, i) => {
      if (!ref) return;
      const target = pp > i * 0.25 ? 1 : 0;
      const current = ref.userData.opacity ?? 0;
      ref.userData.opacity = lerp(current, target, 0.06);
      ref.visible = ref.userData.opacity > 0.01;
      ref.scale.setScalar(ref.userData.opacity);
    });
  });

  return (
    <group>
      {assets.map((a, i) => (
        <group key={a.id} ref={el => { if (el) refs.current[i] = el; }} position={[a.pos[0], 4, a.pos[2]]}>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[1.7, 1.0]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={0.92} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[1.74, 1.04]} />
            <meshStandardMaterial color={a.color} transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <Text position={[0, 0.26, 0]} fontSize={0.1} color="#94a3b8" anchorX="center" anchorY="middle" font={undefined}>
            {a.id}
          </Text>
          <Text position={[0, 0.08, 0]} fontSize={0.075} color="#e0e8f0" anchorX="center" anchorY="middle" font={undefined}>
            {a.severity}
          </Text>
          <Text position={[0, -0.07, 0]} fontSize={0.055} color="#64748b" anchorX="center" anchorY="middle" font={undefined}>
            RECOVERY PRIORITY
          </Text>
          <Text position={[0, -0.3, 0]} fontSize={0.26} color={a.color} anchorX="center" anchorY="middle" font={undefined}>
            {a.score}
          </Text>
        </group>
      ))}
    </group>
  );
}

/* ─── DEPENDENCY CHAIN ─── */
function DependencyChain() {
  const refs = useRef<THREE.Group[]>([]);

  const segments = useMemo(() => [
    { from: [5.5, 1.5, -3.6] as [number, number, number], to: [14, 1.5, -6.5] as [number, number, number], label: "HOSPITAL DEPENDENCY" },
    { from: [14, 1.5, -6.5] as [number, number, number], to: [14, 1.5, -11] as [number, number, number], label: "POPULATION DEPENDENCY" },
    { from: [5.5, 1.5, -3.6] as [number, number, number], to: [16, 1.5, -4.5] as [number, number, number], label: "LIMITED ALTERNATE ROUTE" },
  ], []);

  useFrame(() => {
    const p = storyStore.progress;
    const dp = smoothstep((p - 6 / 8) / (1 / 8));

    refs.current.forEach((ref, i) => {
      if (!ref) return;
      const target = dp > i * 0.3 ? 1 : 0;
      const current = ref.userData.opacity ?? 0;
      ref.userData.opacity = lerp(current, target, 0.05);
      ref.visible = ref.userData.opacity > 0.01;
    });
  });

  return (
    <group>
      {segments.map((s, i) => {
        const mid: [number, number, number] = [
          (s.from[0] + s.to[0]) / 2, 3,
          (s.from[2] + s.to[2]) / 2,
        ];
        return (
          <group key={i} ref={el => { if (el) refs.current[i] = el; }}>
            <Line points={[s.from, mid, s.to]} color="#20b0d0" lineWidth={1.2} opacity={0.55} transparent />
            <group position={mid}>
              <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[s.label.length * 0.075 + 0.18, 0.2]} />
                <meshStandardMaterial color="#0e7490" transparent opacity={0.72} side={THREE.DoubleSide} depthWrite={false} />
              </mesh>
              <Text fontSize={0.09} color="#f0ffff" anchorX="center" anchorY="middle" font={undefined}>
                {s.label}
              </Text>
            </group>
          </group>
        );
      })}
    </group>
  );
}

/* ─── AFFECTED RADIUS ─── */
function AffectedRadius() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = storyStore.progress;
    const rp = smoothstep((p - 2 / 8) / (1 / 8));
    if (ref.current) {
      const s = lerp(0.1, 1, rp);
      ref.current.scale.set(s, s, 1);
      (ref.current.material as THREE.MeshStandardMaterial).opacity = rp * 0.1;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.05, -2.5]}>
      <circleGeometry args={[5.5, 48]} />
      <meshStandardMaterial color="#ef4444" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

/* ─── MAIN ─── */
export function SceneEffects() {
  return (
    <>
      <LandslideDebris />
      <DustClouds />
      <TerrainScar />
      <RoadBlockage />
      <AffectedRadius />

      <DamageIndicator position={[-5.5, 1.5, -2.5]} label="ROAD BLOCKED" visible={storyStore.section >= 2} />
      <DamageIndicator position={[5.5, 1.5, -3.6]} label="BRIDGE DAMAGED" visible={storyStore.section >= 2} />
      <DamageIndicator position={[14, 1.5, -6.5]} label="HOSPITAL ACCESS AT RISK" visible={storyStore.section >= 2} />
      <DamageIndicator position={[14, 1.5, -11]} label="COMMUNITY ISOLATED" visible={storyStore.section >= 2} />

      <EvidenceSource position={[-5, 5, -3.5]} letter="S" color="#00ffff" visible delay={0} />
      <EvidenceSource position={[-1, 5, -3.5]} letter="D" color="#00aaff" visible delay={0.25} />
      <EvidenceSource position={[3, 5, -3.5]} letter="C" color="#00ff88" visible delay={0.5} />
      <EvidenceSource position={[6, 5, -3.5]} letter="G" color="#ffaa00" visible delay={0.75} />
      <ConvergenceLines visible />

      <PriorityAssets />
      <DependencyChain />
    </>
  );
}
