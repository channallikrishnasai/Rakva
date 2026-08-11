"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { storyStore } from "./storyStore";

interface CameraKeyframe {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
}

const keyframes: CameraKeyframe[] = [
  { pos: [10, 22, 28], target: [2, 0, -2], fov: 42 },
  { pos: [6, 16, 20], target: [0, 0, -2], fov: 44 },
  { pos: [-4, 14, 16], target: [-8, 3, -8], fov: 46 },
  { pos: [2, 10, 12], target: [4, 0, -3], fov: 46 },
  { pos: [5, 8, 10], target: [5, 0.5, -3.4], fov: 44 },
  { pos: [4, 7, 9], target: [5, 0.5, -3.4], fov: 42 },
  { pos: [5, 5, 7], target: [5, 0.8, -3.4], fov: 40 },
  { pos: [8, 20, 24], target: [4, 0, -3], fov: 42 },
];

function smootherstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

export function CameraRig() {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(2, 0, -2));
  const currentPos = useRef(new THREE.Vector3(10, 22, 28));
  const currentTarget = useRef(new THREE.Vector3(2, 0, -2));
  const currentFov = useRef(42);

  useFrame(() => {
    if (storyStore.reducedMotion) return;

    const progress = storyStore.progress;
    const total = keyframes.length;
    const rawIndex = progress * (total - 1);
    const idx = Math.min(Math.floor(rawIndex), total - 2);
    const t = smootherstep(rawIndex - idx);

    const from = keyframes[idx];
    const to = keyframes[idx + 1];

    const tx = from.pos[0] + (to.pos[0] - from.pos[0]) * t;
    const ty = from.pos[1] + (to.pos[1] - from.pos[1]) * t;
    const tz = from.pos[2] + (to.pos[2] - from.pos[2]) * t;

    const lx = from.target[0] + (to.target[0] - from.target[0]) * t;
    const ly = from.target[1] + (to.target[1] - from.target[1]) * t;
    const lz = from.target[2] + (to.target[2] - from.target[2]) * t;

    const targetFov = from.fov + (to.fov - from.fov) * t;

    const lerpFactor = 0.045;
    currentPos.current.lerp(new THREE.Vector3(tx, ty, tz), lerpFactor);
    currentTarget.current.lerp(new THREE.Vector3(lx, ly, lz), lerpFactor);
    currentFov.current += (targetFov - currentFov.current) * lerpFactor;

    camera.position.copy(currentPos.current);
    lookAtTarget.current.copy(currentTarget.current);
    camera.lookAt(lookAtTarget.current);

    const perspCam = camera as THREE.PerspectiveCamera;
    if (perspCam.fov !== undefined) {
      perspCam.fov = currentFov.current;
      perspCam.updateProjectionMatrix();
    }
  });

  return null;
}
