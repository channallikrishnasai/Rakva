"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { storyStore } from "./storyStore";

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(t: number) {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

function LandslideDebris() {
  const debrisCount = 18;
  const refs = useRef<THREE.Mesh[]>([]);

  useFrame(() => {
    const p = storyStore.progress;
    const section1 = 1 / 8;
    const section2 = 2 / 8;
    const lp = smoothstep((p - section1) / (section2 - section1));

    for (let i = 0; i < debrisCount; i++) {
      const ref = refs.current[i];
      if (!ref) continue;
      const delay = i * 0.04;
      const t = clamp01((lp - delay) / 0.6);
      const ease = t * t * (3 - 2 * t);
      ref.position.x = lerp(-9, -3 + (i % 5) * 0.8, ease);
      ref.position.y = lerp(4 + (i % 3) * 0.5, 0.15 + (i % 3) * 0.05, ease);
      ref.position.z = lerp(-4 + (i % 4) * 0.5, -1.5 + (i % 4) * 0.4, ease);
      ref.rotation.x += 0.01 * (i % 2 === 0 ? 1 : -1);
      ref.rotation.z += 0.008 * (i % 2 === 0 ? -1 : 1);
      ref.scale.setScalar(lp > 0 ? 1 : 0);
    }
  });

  return (
    <group>
      {Array.from({ length: debrisCount }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) refs.current[i] = el; }}
          position={[-9, 4, -4]}
        >
          <boxGeometry args={[
            0.2 + (i % 5) * 0.08,
            0.15 + (i % 3) * 0.06,
            0.2 + (i % 4) * 0.07,
          ]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#9a8a6a" : i % 3 === 1 ? "#8a7a5a" : "#aa9a7a"} />
        </mesh>
      ))}
    </group>
  );
}

function DustCloud() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = storyStore.progress;
    const section1 = 1 / 8;
    const section2 = 2 / 8;
    const lp = smoothstep((p - section1) / (section2 - section1));

    if (ref.current) {
      const scale = lerp(0.1, 4, lp);
      ref.current.scale.set(scale, scale * 0.4, scale);
      (ref.current.material as THREE.MeshStandardMaterial).opacity = lp * 0.18 * (1 - lp * 0.3);
    }
  });

  return (
    <mesh ref={ref} position={[-5, 1.2, -1.5]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial color="#c0b0a0" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function RoadBlockage() {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = storyStore.progress;
    const section1 = 1 / 8;
    const section2 = 2 / 8;
    const lp = smoothstep((p - section1) / (section2 - section1));

    if (ref.current) {
      ref.current.scale.setScalar(lp);
      ref.current.visible = lp > 0.01;
    }
  });

  return (
    <group ref={ref} position={[-4, 0.08, -2]}>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[2.5, 0.3, 0.8]} />
        <meshStandardMaterial color="#9a8a6a" roughness={0.8} />
      </mesh>
      <mesh position={[0.3, 0.35, 0.1]}>
        <boxGeometry args={[0.5, 0.15, 0.3]} />
        <meshStandardMaterial color="#aa9a7a" />
      </mesh>
      <mesh position={[-0.4, 0.3, -0.1]}>
        <boxGeometry args={[0.4, 0.2, 0.25]} />
        <meshStandardMaterial color="#7a6a4a" />
      </mesh>
    </group>
  );
}

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
        <planeGeometry args={[label.length * 0.12 + 0.4, 0.36]} />
        <meshStandardMaterial color="#cc3333" transparent opacity={0.85} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <Text fontSize={0.18} color="#ffcccc" anchorX="center" anchorY="middle" font={undefined}>
        {label}
      </Text>
    </group>
  );
}

function EvidenceSourceIndicator({ position, letter, color, visible, delay }: {
  position: [number, number, number]; letter: string; color: string; visible: boolean; delay: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    elapsed.current += delta;
    const p = storyStore.progress;
    const section3 = 3 / 8;
    const section4 = 4 / 8;
    const ep = smoothstep((p - section3) / (section4 - section3));
    const appear = ep > delay ? 1 : 0;
    const target = visible ? appear : 0;
    const current = ref.current.userData.opacity ?? 0;
    const next = lerp(current, target, 0.06);
    ref.current.userData.opacity = next;
    ref.current.visible = next > 0.01;
    ref.current.position.y = position[1] + Math.sin(elapsed.current * 1.5) * 0.15;
    ref.current.scale.setScalar(next);
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0.75} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <Text fontSize={0.16} color="white" anchorX="center" anchorY="middle" font={undefined}>
        {letter}
      </Text>
    </group>
  );
}

function ConvergenceLines({ visible }: { visible: boolean }) {
  const ref = useRef<THREE.Group>(null);

  const lines = useMemo(() => [
    { from: [-4, 3.5, -3] as [number, number, number], to: [-2, 0.5, -1] as [number, number, number] },
    { from: [-1, 3.5, -3] as [number, number, number], to: [-2, 0.5, -1] as [number, number, number] },
    { from: [2, 3.5, -3] as [number, number, number], to: [-2, 0.5, -1] as [number, number, number] },
    { from: [5, 3.5, -3] as [number, number, number], to: [-2, 0.5, -1] as [number, number, number] },
  ], []);

  useFrame(() => {
    if (!ref.current) return;
    const p = storyStore.progress;
    const section3 = 3 / 8;
    const section4 = 4 / 8;
    const ep = smoothstep((p - section3) / (section4 - section3));
    const target = visible ? ep : 0;
    const current = ref.current.userData.opacity ?? 0;
    ref.current.userData.opacity = lerp(current, target, 0.05);
    ref.current.visible = ref.current.userData.opacity > 0.01;
  });

  return (
    <group ref={ref}>
      {lines.map((l, i) => (
        <Line
          key={i}
          points={[l.from, l.to]}
          color="#20c0e0"
          lineWidth={1.5}
          opacity={0.65}
          transparent
        />
      ))}
    </group>
  );
}

function PriorityAssets() {
  const refs = useRef<THREE.Group[]>([]);

  const assets = useMemo(() => [
    { id: "BUILDING-031", pos: [-5, 0, 3.5] as [number, number, number], score: 68, severity: "SEVERE DAMAGE", color: "#ef4444" },
    { id: "ROAD-017", pos: [3, 0, 2] as [number, number, number], score: 82, severity: "HIGH DAMAGE", color: "#f97316" },
    { id: "BRIDGE-024", pos: [3, 0, 0] as [number, number, number], score: 94, severity: "MODERATE DAMAGE", color: "#eab308" },
  ], []);

  useFrame(() => {
    const p = storyStore.progress;
    const section5 = 5 / 8;
    const section6 = 6 / 8;
    const pp = smoothstep((p - section5) / (section6 - section5));

    refs.current.forEach((ref, i) => {
      if (!ref) return;
      const stagger = i * 0.25;
      const appear = pp > stagger ? 1 : 0;
      const target = appear;
      const current = ref.userData.opacity ?? 0;
      ref.userData.opacity = lerp(current, target, 0.06);
      ref.visible = ref.userData.opacity > 0.01;
      ref.scale.setScalar(ref.userData.opacity);
    });
  });

  return (
    <group>
      {assets.map((a, i) => (
        <group key={a.id} ref={(el) => { if (el) refs.current[i] = el; }} position={[a.pos[0], 2.5, a.pos[2]]}>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[2.2, 1.4]} />
            <meshStandardMaterial color="#1a2a4a" transparent opacity={0.85} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[2.24, 1.44]} />
            <meshStandardMaterial color={a.color} transparent opacity={0.55} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <Text position={[0, 0.35, 0]} fontSize={0.14} color="#b0c8e0" anchorX="center" anchorY="middle" font={undefined}>
            {a.id}
          </Text>
          <Text position={[0, 0.1, 0]} fontSize={0.1} color="#e0e8f0" anchorX="center" anchorY="middle" font={undefined}>
            {a.severity}
          </Text>
          <Text position={[0, -0.15, 0]} fontSize={0.08} color="#8a9ab0" anchorX="center" anchorY="middle" font={undefined}>
            RECOVERY PRIORITY
          </Text>
          <Text position={[0, -0.4, 0]} fontSize={0.35} color={a.color} anchorX="center" anchorY="middle" font={undefined}>
            {a.score}
          </Text>
        </group>
      ))}
    </group>
  );
}

function DependencyChain() {
  const refs = useRef<THREE.Group[]>([]);

  const segments = useMemo(() => [
    { from: [3, 1.5, 0] as [number, number, number], to: [6, 1.5, -4] as [number, number, number], label: "HOSPITAL DEPENDENCY" },
    { from: [6, 1.5, -4] as [number, number, number], to: [6, 1.5, -9] as [number, number, number], label: "POPULATION DEPENDENCY" },
    { from: [3, 1.5, 0] as [number, number, number], to: [8, 1.5, -2] as [number, number, number], label: "LIMITED ALTERNATE ROUTE" },
  ], []);

  useFrame(() => {
    const p = storyStore.progress;
    const section6 = 6 / 8;
    const section7 = 7 / 8;
    const dp = smoothstep((p - section6) / (section7 - section6));

    refs.current.forEach((ref, i) => {
      if (!ref) return;
      const stagger = i * 0.3;
      const appear = dp > stagger ? 1 : 0;
      const target = appear;
      const current = ref.userData.opacity ?? 0;
      ref.userData.opacity = lerp(current, target, 0.05);
      ref.visible = ref.userData.opacity > 0.01;
    });
  });

  return (
    <group>
      {segments.map((s, i) => {
        const mid: [number, number, number] = [
          (s.from[0] + s.to[0]) / 2,
          2.5,
          (s.from[2] + s.to[2]) / 2,
        ];
        return (
          <group key={i} ref={(el) => { if (el) refs.current[i] = el; }}>
            <Line
              points={[s.from, mid, s.to]}
              color="#20c0e0"
              lineWidth={1.8}
              opacity={0.7}
              transparent
            />
            <group position={mid}>
              <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[s.label.length * 0.11 + 0.3, 0.3]} />
                <meshStandardMaterial color="#1a8aa0" transparent opacity={0.7} side={THREE.DoubleSide} depthWrite={false} />
              </mesh>
              <Text fontSize={0.14} color="#f0ffff" anchorX="center" anchorY="middle" font={undefined}>
                {s.label}
              </Text>
            </group>
          </group>
        );
      })}
    </group>
  );
}

function AffectedRadius() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = storyStore.progress;
    const section2 = 2 / 8;
    const section3 = 3 / 8;
    const rp = smoothstep((p - section2) / (section3 - section2));

    if (ref.current) {
      const scale = lerp(0.1, 1, rp);
      ref.current.scale.set(scale, scale, 1);
      (ref.current.material as THREE.MeshStandardMaterial).opacity = rp * 0.1;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.025, -1.5]}>
      <circleGeometry args={[4, 48]} />
      <meshStandardMaterial color="#ff4444" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

export function SceneEffects() {
  return (
    <>
      <LandslideDebris />
      <DustCloud />
      <RoadBlockage />
      <AffectedRadius />

      <DamageIndicator position={[-4, 1.8, -2]} label="ROAD BLOCKED" visible={storyStore.section >= 2} />
      <DamageIndicator position={[3, 1.8, 0]} label="BRIDGE DAMAGED" visible={storyStore.section >= 2} />
      <DamageIndicator position={[6, 1.8, -4]} label="HOSPITAL ACCESS AT RISK" visible={storyStore.section >= 2} />
      <DamageIndicator position={[6, 1.8, -9]} label="COMMUNITY ISOLATED" visible={storyStore.section >= 2} />

      <EvidenceSourceIndicator position={[-4, 3.5, -3]} letter="S" color="#00ffff" visible delay={0} />
      <EvidenceSourceIndicator position={[-1, 3.5, -3]} letter="D" color="#00aaff" visible delay={0.25} />
      <EvidenceSourceIndicator position={[2, 3.5, -3]} letter="C" color="#00ff88" visible delay={0.5} />
      <EvidenceSourceIndicator position={[5, 3.5, -3]} letter="G" color="#ffaa00" visible delay={0.75} />
      <ConvergenceLines visible />

      <PriorityAssets />
      <DependencyChain />
    </>
  );
}
