"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function sr(s: number) {
  const x = Math.sin(s) * 43758.5453;
  return x - Math.floor(x);
}

/* ─── MOUNTAIN PANORAMA BACKGROUND ─── */
function MountainBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.z = camera.position.z - 60;
      meshRef.current.lookAt(camera.position.x, camera.position.y, camera.position.z - 50);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 8, -60]}>
      <planeGeometry args={[160, 50]} />
      <meshBasicMaterial color="#3a5a6a" />
    </mesh>
  );
}

/* ─── GROUND PLANE ─── */
function GroundPlane() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(120, 100, 200, 160);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      let h = 0;
      h += Math.sin(x * 0.04) * Math.cos(y * 0.035) * 2.5;
      h += Math.sin(x * 0.09 + 1.3) * Math.cos(y * 0.07 + 0.8) * 1.2;
      h += Math.sin(x * 0.18) * 0.35;
      h += Math.cos(y * 0.14) * 0.3;
      h += sr(i * 0.1) * 0.12;
      const riverDist = Math.abs(y + 3.0 + Math.sin(x * 0.2) * 1.5);
      if (riverDist < 4.0) h -= (4.0 - riverDist) * 0.4;
      if (x < -15) { const mf = Math.max(0, (-15 - x) * 0.15); h += mf * (1.5 + Math.sin(y * 0.3) * 0.5); }
      pos.setZ(i, h);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow geometry={geo}>
      <meshStandardMaterial color="#3a5040" roughness={0.88} metalness={0.02} />
    </mesh>
  );
}

/* ─── RIDGE MOUNTAINS (silhouette) ─── */
function RidgeMountains() {
  const ridgeGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = -50 + t * 65;
      const z = -28 + Math.sin(t * Math.PI * 1.3) * 8 + sr(i * 7) * 3;
      const h = 6 + Math.sin(t * Math.PI * 2.1) * 5 + sr(i * 11) * 4 + Math.sin(t * Math.PI * 0.7) * 3;
      pts.push(new THREE.Vector3(x, h, z));
    }
    const curve = new THREE.CatmullRomCurve3(pts, false);
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, -8);
    shape.lineTo(5, -8);
    shape.lineTo(4, -3);
    shape.lineTo(2.5, -1);
    shape.lineTo(0, 0);
    return new THREE.ExtrudeGeometry(shape, { steps: 80, bevelEnabled: false, extrudePath: curve });
  }, []);

  const ridgeGeo2 = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 35; i++) {
      const t = i / 35;
      const x = -45 + t * 58;
      const z = -34 + Math.sin(t * Math.PI * 0.9 + 1) * 7 + sr(i * 13) * 2.5;
      const h = 4 + Math.sin(t * Math.PI * 1.8) * 4 + sr(i * 17) * 3;
      pts.push(new THREE.Vector3(x, h, z));
    }
    const curve = new THREE.CatmullRomCurve3(pts, false);
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, -7);
    shape.lineTo(4, -7);
    shape.lineTo(3, -2);
    shape.lineTo(0, 0);
    return new THREE.ExtrudeGeometry(shape, { steps: 70, bevelEnabled: false, extrudePath: curve });
  }, []);

  return (
    <group>
      <mesh geometry={ridgeGeo2} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#2a4050" roughness={0.9} metalness={0.01} />
      </mesh>
      <mesh geometry={ridgeGeo} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#345060" roughness={0.87} metalness={0.01} />
      </mesh>
      {[-38, -30, -24, -18].map((z, i) => (
        <mesh key={i} position={[-22 + i * 4, 0.3, z]} receiveShadow>
          <sphereGeometry args={[3.5 + sr(i * 5) * 2.5, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#3a5a48" roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── SNOW ZONES ─── */
function SnowZones() {
  const zones = useMemo(() => {
    const result: { x: number; y: number; z: number; r: number; ry: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 0.6 + 0.4;
      const dist = 30 + sr(i * 7) * 12;
      result.push({
        x: -18 + Math.cos(angle) * dist + sr(i * 13) * 4,
        y: 6 + sr(i * 17) * 5,
        z: -24 + Math.sin(angle) * dist * 0.5 + sr(i * 19) * 3,
        r: 0.8 + sr(i * 23) * 1.5,
        ry: sr(i * 29) * 0.5,
      });
    }
    return result;
  }, []);

  return (
    <group>
      {zones.map((z, i) => (
        <mesh key={i} position={[z.x, z.y, z.z]} rotation={[0.3, z.ry, 0.1]}>
          <planeGeometry args={[z.r * 2, z.r]} />
          <meshStandardMaterial color="#c8d4dc" roughness={0.6} transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── RIVER ─── */
function River() {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    if (ref.current) {
      t.current += dt;
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.5 + Math.sin(t.current * 0.3) * 0.05;
    }
  });

  return (
    <group>
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -3.6]}>
        <planeGeometry args={[120, 5.0]} />
        <meshStandardMaterial color="#1a4a5a" transparent opacity={0.5} roughness={0.1} metalness={0.25} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, -3.6]}>
        <planeGeometry args={[120, 7.5]} />
        <meshStandardMaterial color="#123a4a" transparent opacity={0.15} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── ROADS ─── */
function RoadSurface({ points, width = 3.8 }: { points: [number, number, number][]; width?: number }) {
  const geo = useMemo(() => {
    if (points.length < 2) return null;
    const pts3d = points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
    const curve = new THREE.CatmullRomCurve3(pts3d, false, "catmullrom", 0.2);
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(width / 2, 0);
    shape.lineTo(width / 2, 0.08);
    shape.lineTo(-width / 2, 0.08);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { steps: points.length * 14, bevelEnabled: false, extrudePath: curve });
  }, [points, width]);

  if (!geo) return null;
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial color="#2a2a2a" roughness={0.94} metalness={0.01} />
    </mesh>
  );
}

function LaneMarkings({ points }: { points: [number, number, number][] }) {
  const segments = useMemo(() => {
    const result: [number, number, number][][] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const dx = p2[0] - p1[0];
      const dz = p2[2] - p1[2];
      const len = Math.sqrt(dx * dx + dz * dz);
      const count = Math.floor(len / 1.4);
      for (let j = 0; j < count; j++) {
        if (j % 2 === 0) {
          const t = (j + 0.3) / count;
          const mx = p1[0] + dx * t;
          const mz = p1[2] + dz * t;
          result.push([
            [mx, 0.09, mz],
            [mx + dx / len * 0.5, 0.09, mz + dz / len * 0.5],
          ]);
        }
      }
    }
    return result;
  }, [points]);

  return (
    <group>
      {segments.map((seg, i) => {
        const dir = new THREE.Vector3(seg[1][0] - seg[0][0], 0, seg[1][2] - seg[0][2]).normalize();
        const angle = Math.atan2(dir.x, dir.z);
        return (
          <mesh key={i} position={[seg[0][0], seg[0][1], seg[0][2]]} rotation={[0, angle, 0]}>
            <planeGeometry args={[0.08, 0.5]} />
            <meshStandardMaterial color="#9a9a9a" roughness={0.85} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─── BUILDINGS ─── */
interface BldgDef {
  x: number; z: number; w: number; d: number; h: number;
  color: string; roofColor: string;
  type: "tower" | "apartment" | "commercial" | "house" | "utility";
}

function BuildingMesh({ b, opacity = 1 }: { b: BldgDef; opacity?: number }) {
  const winRows = Math.max(1, Math.floor(b.h / 0.45));
  const winCols = Math.max(1, Math.floor(b.w / 0.32));
  const hasBalcony = b.type === "tower" || b.type === "apartment";

  return (
    <group position={[b.x, 0, b.z]}>
      <mesh position={[0, b.h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[b.w, b.h, b.d]} />
        <meshStandardMaterial color={b.color} roughness={0.7} metalness={0.03} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* facade inset */}
      <mesh position={[0, b.h / 2, b.d / 2 + 0.01]}>
        <planeGeometry args={[b.w - 0.1, b.h - 0.1]} />
        <meshStandardMaterial color={new THREE.Color(b.color).multiplyScalar(0.82)} roughness={0.68} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* windows */}
      {Array.from({ length: winRows }).map((_, r) =>
        Array.from({ length: winCols }).map((_, c) => {
          const wx = -b.w / 2 + 0.22 + (c / winCols) * (b.w - 0.44);
          const wy = 0.35 + (r / winRows) * (b.h - 0.55);
          const lit = sr(b.x * 100 + b.z * 50 + r * 7 + c * 13) > 0.3;
          return (
            <mesh key={`${r}-${c}`} position={[wx, wy, b.d / 2 + 0.02]}>
              <planeGeometry args={[0.16, 0.24]} />
              <meshStandardMaterial
                color={lit ? "#6a9ab8" : "#0a1520"}
                emissive={lit ? "#2a4a5a" : "#000000"}
                emissiveIntensity={lit ? 0.2 : 0}
                transparent opacity={opacity * 0.92}
              />
            </mesh>
          );
        })
      )}
      {/* balconies */}
      {hasBalcony && Array.from({ length: Math.floor(b.h / 0.9) }).map((_, i) => (
        <mesh key={`bal-${i}`} position={[0, 0.7 + i * 0.9, b.d / 2 + 0.14]} castShadow>
          <boxGeometry args={[b.w * 0.88, 0.04, 0.22]} />
          <meshStandardMaterial color="#4a5a60" roughness={0.82} transparent={opacity < 1} opacity={opacity} />
        </mesh>
      ))}
      {/* roof */}
      <mesh position={[0, b.h + 0.05, 0]} receiveShadow>
        <boxGeometry args={[b.w + 0.1, 0.1, b.d + 0.1]} />
        <meshStandardMaterial color={b.roofColor} roughness={0.85} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {b.type === "tower" && (
        <mesh position={[b.w * 0.3, b.h + 0.22, 0]} castShadow>
          <boxGeometry args={[0.22, 0.35, 0.22]} />
          <meshStandardMaterial color="#3a4a50" roughness={0.82} transparent={opacity < 1} opacity={opacity} />
        </mesh>
      )}
      {b.type === "house" && (
        <mesh position={[0, b.h + 0.22, 0]} rotation={[0, Math.PI / 4, 0]} receiveShadow>
          <coneGeometry args={[b.w * 0.74, 0.38, 4]} />
          <meshStandardMaterial color={b.roofColor} roughness={0.76} transparent={opacity < 1} opacity={opacity} />
        </mesh>
      )}
    </group>
  );
}

function CityGrid() {
  const buildings = useMemo(() => {
    const result: BldgDef[] = [];
    const tC = ["#7a8890", "#6a7880", "#8a9698", "#6e7e86"];
    const aC = ["#6a7a78", "#5a6a68", "#7a8a88", "#606e6e", "#687870"];
    const cC = ["#6a7a88", "#5a6a78", "#7a8a96", "#607080"];
    const hC = ["#8a9088", "#7a8880", "#9aa098", "#8a9490"];
    const rT = ["#4a5a5a", "#3a4a4a", "#555555", "#4e5e5e"];
    const uC = ["#5a6068", "#4a5058"];

    let seed = 300;
    const rng = () => { seed++; return sr(seed); };

    for (let gx = -9; gx <= 16; gx += 2.4) {
      for (let gz = 2; gz <= 18; gz += 2.4) {
        if (Math.abs(gz + 3.6) < 3.2) continue;
        if (rng() < 0.1) continue;
        const dist = Math.sqrt(gx * gx + (gz + 2) * (gz + 2));
        const isCenter = dist < 7;
        const isOuter = dist > 11;

        let type: BldgDef["type"];
        let h: number, w: number, d: number, color: string;

        if (isCenter && rng() > 0.2) {
          type = rng() > 0.35 ? "tower" : "apartment";
          h = type === "tower" ? 3.5 + rng() * 4.0 : 2.0 + rng() * 2.2;
          w = 0.7 + rng() * 1.0;
          d = 0.6 + rng() * 0.8;
          color = type === "tower" ? tC[Math.floor(rng() * tC.length)] : aC[Math.floor(rng() * aC.length)];
        } else if (isOuter && rng() > 0.35) {
          type = "house";
          h = 0.5 + rng() * 0.7;
          w = 0.6 + rng() * 0.5;
          d = 0.5 + rng() * 0.45;
          color = hC[Math.floor(rng() * hC.length)];
        } else if (rng() > 0.55) {
          type = "commercial";
          h = 1.2 + rng() * 2.0;
          w = 0.9 + rng() * 1.3;
          d = 0.7 + rng() * 0.9;
          color = cC[Math.floor(rng() * cC.length)];
        } else {
          type = rng() > 0.75 ? "utility" : "apartment";
          h = type === "utility" ? 0.4 + rng() * 0.55 : 0.7 + rng() * 1.2;
          w = type === "utility" ? 0.9 + rng() * 0.7 : 0.5 + rng() * 0.7;
          d = type === "utility" ? 0.7 + rng() * 0.55 : 0.45 + rng() * 0.55;
          color = type === "utility" ? uC[Math.floor(rng() * uC.length)] : aC[Math.floor(rng() * aC.length)];
        }

        result.push({
          x: gx + (rng() - 0.5) * 0.7,
          z: gz + (rng() - 0.5) * 0.7,
          w, d, h, color,
          roofColor: rT[Math.floor(rng() * rT.length)],
          type,
        });
      }
    }
    return result;
  }, []);

  return (
    <group>
      {buildings.map((b, i) => <BuildingMesh key={i} b={b} />)}
    </group>
  );
}

/* ─── HOSPITAL ─── */
function Hospital() {
  return (
    <group position={[14, 0, -6.5]}>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 2.4, 2.2]} />
        <meshStandardMaterial color="#8a9098" roughness={0.65} metalness={0.03} />
      </mesh>
      <mesh position={[-2.2, 0.75, 0]} castShadow>
        <boxGeometry args={[1.4, 1.5, 1.6]} />
        <meshStandardMaterial color="#7a8088" roughness={0.7} />
      </mesh>
      <mesh position={[2.2, 0.75, 0]} castShadow>
        <boxGeometry args={[1.4, 1.5, 1.6]} />
        <meshStandardMaterial color="#7a8088" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.38, 1.25]} castShadow>
        <boxGeometry args={[1.5, 0.06, 0.55]} />
        <meshStandardMaterial color="#6a7078" roughness={0.7} />
      </mesh>
      {[-0.65, 0.65].map((sx, i) => (
        <mesh key={i} position={[sx, 0.2, 1.48]}>
          <boxGeometry args={[0.06, 0.38, 0.06]} />
          <meshStandardMaterial color="#6a7078" roughness={0.7} />
        </mesh>
      ))}
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 6 }).map((_, c) => (
          <mesh key={`mw-${r}-${c}`} position={[-1.15 + c * 0.46, 0.45 + r * 0.55, 1.12]}>
            <planeGeometry args={[0.24, 0.35]} />
            <meshStandardMaterial color="#5a7a90" emissive="#3a5a6a" emissiveIntensity={0.1} transparent opacity={0.9} />
          </mesh>
        ))
      )}
      {[-2.2, 2.2].map((wx, wi) =>
        Array.from({ length: 2 }).map((_, r) =>
          Array.from({ length: 3 }).map((_, c) => (
            <mesh key={`ww-${wi}-${r}-${c}`} position={[wx - 0.45 + c * 0.45, 0.4 + r * 0.55, 0.82]}>
              <planeGeometry args={[0.2, 0.3]} />
              <meshStandardMaterial color="#5a7a90" emissive="#3a5a6a" emissiveIntensity={0.08} transparent opacity={0.88} />
            </mesh>
          ))
        )
      )}
      <mesh position={[0, 1.5, 1.13]}>
        <planeGeometry args={[0.55, 0.14]} />
        <meshStandardMaterial color="#cc3333" emissive="#bb2222" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 1.5, 1.13]}>
        <planeGeometry args={[0.14, 0.55]} />
        <meshStandardMaterial color="#cc3333" emissive="#bb2222" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 2.44, 0]} receiveShadow>
        <boxGeometry args={[3.1, 0.08, 2.3]} />
        <meshStandardMaterial color="#5a6068" roughness={0.82} />
      </mesh>
      <mesh position={[0, 2.6, 0]} receiveShadow>
        <boxGeometry args={[0.55, 0.28, 0.55]} />
        <meshStandardMaterial color="#5a6068" roughness={0.82} />
      </mesh>
    </group>
  );
}

/* ─── BRIDGE ─── */
function Bridge() {
  const dc = "#6a7078";
  const sc = "#5a6068";

  return (
    <group position={[5.5, 0, -3.6]}>
      <mesh position={[0, 1.15, 0]} receiveShadow>
        <boxGeometry args={[7.0, 0.24, 1.5]} />
        <meshStandardMaterial color={dc} roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[6.8, 0.06, 1.4]} />
        <meshStandardMaterial color="#4a5058" roughness={0.82} />
      </mesh>
      <mesh position={[-3.3, 0.58, 0]} rotation={[0, 0, -0.12]} receiveShadow>
        <boxGeometry args={[2.8, 0.16, 1.6]} />
        <meshStandardMaterial color={dc} roughness={0.78} />
      </mesh>
      <mesh position={[3.3, 0.58, 0]} rotation={[0, 0, 0.12]} receiveShadow>
        <boxGeometry args={[2.8, 0.16, 1.6]} />
        <meshStandardMaterial color={dc} roughness={0.78} />
      </mesh>
      {[-2.0, 0, 2.0].map((px, i) => (
        <group key={i}>
          <mesh position={[px, 0.52, 0]} castShadow>
            <boxGeometry args={[0.2, 1.05, 0.2]} />
            <meshStandardMaterial color={sc} roughness={0.78} />
          </mesh>
          <mesh position={[px, 0.02, 0]}>
            <boxGeometry args={[0.55, 0.04, 0.55]} />
            <meshStandardMaterial color={sc} roughness={0.82} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.34, 0.77]}>
        <boxGeometry args={[7.0, 0.05, 0.02]} />
        <meshStandardMaterial color="#7a8088" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.34, -0.77]}>
        <boxGeometry args={[7.0, 0.05, 0.02]} />
        <meshStandardMaterial color="#7a8088" roughness={0.7} />
      </mesh>
      {Array.from({ length: 16 }).map((_, i) => (
        <group key={`rp-${i}`}>
          <mesh position={[-3.2 + i * 0.44, 1.2, 0.77]}>
            <boxGeometry args={[0.03, 0.24, 0.03]} />
            <meshStandardMaterial color="#7a8088" roughness={0.7} />
          </mesh>
          <mesh position={[-3.2 + i * 0.44, 1.2, -0.77]}>
            <boxGeometry args={[0.03, 0.24, 0.03]} />
            <meshStandardMaterial color="#7a8088" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ─── TREES ─── */
function Trees() {
  const trees = useMemo(() => {
    const result: { x: number; z: number; h: number; r: number; color: string }[] = [];
    const greens = ["#2a5a2a", "#3a6a34", "#2a4a24", "#3a7a3a", "#245624", "#2e6030"];
    for (let i = 0; i < 65; i++) {
      const x = (sr(i * 7) - 0.2) * 50;
      const z = sr(i * 13) * 28 - 4;
      const dist = Math.sqrt(x * x + (z + 3) * (z + 3));
      if (dist < 6) continue;
      if (Math.abs(z + 3.6) < 3.8) continue;
      result.push({
        x, z,
        h: 0.45 + sr(i * 19) * 0.8,
        r: 0.22 + sr(i * 23) * 0.25,
        color: greens[i % greens.length],
      });
    }
    return result;
  }, []);

  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh position={[0, t.h * 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.04, t.h * 0.45, 5]} />
            <meshStandardMaterial color="#4a3a2a" roughness={0.94} />
          </mesh>
          <mesh position={[0, t.h * 0.6, 0]} castShadow>
            <dodecahedronGeometry args={[t.r, 1]} />
            <meshStandardMaterial color={t.color} roughness={0.88} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ─── VEHICLES ─── */
function Vehicle({ position, rotation = 0, color = "#4a5a6a" }: { position: [number, number, number]; rotation?: number; color?: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.13, 0]} castShadow>
        <boxGeometry args={[0.26, 0.17, 0.52]} />
        <meshStandardMaterial color={color} roughness={0.52} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.26, -0.02]} castShadow>
        <boxGeometry args={[0.22, 0.13, 0.26]} />
        <meshStandardMaterial color={color} roughness={0.42} metalness={0.22} />
      </mesh>
      {[[-0.11, 0.04, -0.16], [0.11, 0.04, -0.16], [-0.11, 0.04, 0.16], [0.11, 0.04, 0.16]].map(([wx, wy, wz], i) => (
        <mesh key={i} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 6]} />
          <meshStandardMaterial color="#111111" roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

function Vehicles() {
  return (
    <group>
      <Vehicle position={[1.8, 0.05, 0.3]} rotation={0} color="#5a6a7a" />
      <Vehicle position={[3.5, 0.05, 0.3]} rotation={0} color="#4a5a5a" />
      <Vehicle position={[7.0, 0.05, 0.3]} rotation={0} color="#6a7a7a" />
      <Vehicle position={[-1.8, 0.05, -0.3]} rotation={Math.PI} color="#5a6a6a" />
      <Vehicle position={[-4.0, 0.05, -0.3]} rotation={Math.PI} color="#7a8a8a" />
      <Vehicle position={[9.0, 0.05, 0.3]} rotation={0} color="#6a7070" />
    </group>
  );
}

/* ─── MAIN SCENE ─── */
export function CityScene() {
  const mainRoad: [number, number, number][] = [[-18, 0.04, 0], [-12, 0.04, 0], [-6, 0.04, 0.1], [0, 0.04, 0], [6, 0.04, -0.1], [12, 0.04, 0], [18, 0.04, 0]];
  const crossRoad: [number, number, number][] = [[0, 0.04, -18], [0.1, 0.04, -12], [0, 0.04, -6], [-0.1, 0.04, 0], [0, 0.04, 6], [0, 0.04, 12], [0, 0.04, 18]];
  const diagRoad: [number, number, number][] = [[-12, 0.04, 9], [-6, 0.04, 5], [0, 0.04, 2.5], [6, 0.04, 0], [12, 0.04, -2.5]];

  return (
    <>
      <ambientLight intensity={0.3} />
      <hemisphereLight args={["#b0c8d8", "#3a5a3a", 0.4]} />
      <directionalLight
        position={[20, 28, 14]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={80}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-bias={-0.0006}
      />
      <directionalLight position={[-12, 16, -10]} intensity={0.2} color="#8aaac0" />
      <fog attach="fog" args={["#7a98a8", 45, 110]} />

      <MountainBackground />
      <RidgeMountains />
      <SnowZones />
      <GroundPlane />
      <River />

      <RoadSurface points={mainRoad} width={3.8} />
      <LaneMarkings points={mainRoad} />
      <RoadSurface points={crossRoad} width={3.5} />
      <LaneMarkings points={crossRoad} />
      <RoadSurface points={diagRoad} width={3.0} />

      <CityGrid />
      <Hospital />
      <Bridge />
      <Trees />
      <Vehicles />
    </>
  );
}
