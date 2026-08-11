"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { storyStore } from "./storyStore";

const keyframes = [
  { pos: [0, 22, 28] as [number, number, number], target: [0, 0, 0] as [number, number, number] },
  { pos: [0, 16, 20] as [number, number, number], target: [0, 0, 1] as [number, number, number] },
  { pos: [-4, 10, 10] as [number, number, number], target: [-3, 2, 0] as [number, number, number] },
  { pos: [0, 9, 14] as [number, number, number], target: [0, 0, 2] as [number, number, number] },
  { pos: [2, 13, 16] as [number, number, number], target: [0, 0, 2] as [number, number, number] },
  { pos: [0, 11, 13] as [number, number, number], target: [0, 0, 2] as [number, number, number] },
  { pos: [3, 7, 10] as [number, number, number], target: [3, 1, 0] as [number, number, number] },
  { pos: [0, 18, 24] as [number, number, number], target: [0, 0, 0] as [number, number, number] },
];

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

export function CameraRig() {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (storyStore.reducedMotion) return;

    const progress = storyStore.progress;
    const total = keyframes.length;
    const sectionProgress = progress * total;
    const idx = Math.min(Math.floor(sectionProgress), total - 1);
    const nextIdx = Math.min(idx + 1, total - 1);
    const t = smoothstep(sectionProgress - idx);

    const from = keyframes[idx];
    const to = keyframes[nextIdx];

    const px = from.pos[0] + (to.pos[0] - from.pos[0]) * t;
    const py = from.pos[1] + (to.pos[1] - from.pos[1]) * t;
    const pz = from.pos[2] + (to.pos[2] - from.pos[2]) * t;

    const tx = from.target[0] + (to.target[0] - from.target[0]) * t;
    const ty = from.target[1] + (to.target[1] - from.target[1]) * t;
    const tz = from.target[2] + (to.target[2] - from.target[2]) * t;

    camera.position.set(px, py, pz);
    lookAtTarget.current.set(tx, ty, tz);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
