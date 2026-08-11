"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CityScene } from "./CityScene";
import { SceneEffects } from "./SceneEffects";
import { CameraRig } from "./CameraRig";

export function CinematicCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 22, 28], fov: 42 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.NoToneMapping,
      }}
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#0a0e1a");
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.shadowMap.type = THREE.PCFShadowMap;
      }}
    >
      <CameraRig />
      <CityScene />
      <SceneEffects />
    </Canvas>
  );
}
