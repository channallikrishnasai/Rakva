"use client";

import { useEffect, useState, useRef, useCallback, useSyncExternalStore } from "react";
import { storyStore } from "./storyStore";
import { StoryOverlay } from "./StoryOverlay";
import { CinematicCanvas } from "./CinematicCanvas";

let cachedWebGL: boolean | null = null;

function getWebGLSupport(): boolean {
  if (cachedWebGL !== null) return cachedWebGL;
  try {
    const canvas = document.createElement("canvas");
    cachedWebGL = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    cachedWebGL = false;
  }
  return cachedWebGL;
}

function FallbackContent() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5">
        <span className="text-xs font-medium tracking-wider text-cyan-400">DEMO MODE</span>
      </div>
      <h1 className="mb-4 text-5xl font-bold tracking-tight text-white">RAKVA</h1>
      <p className="mb-3 text-lg font-medium text-slate-300">
        AI-POWERED DISASTER INTELLIGENCE &amp; RECOVERY PLANNING
      </p>
      <p className="mb-8 text-slate-400">
        Detect the damage. Understand the impact. Prioritize the recovery.
      </p>
      <p className="mb-8 text-sm italic text-slate-400">
        &ldquo;What should be addressed first — and why?&rdquo;
      </p>
      <a
        href="/command-center"
        className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-500"
      >
        ENTER COMMAND CENTER
      </a>
      <p className="mt-8 text-[10px] text-slate-600">
        3D experience requires WebGL. Showing text fallback.
      </p>
    </div>
  );
}

export default function CinematicHomepage() {
  const webglOk = useSyncExternalStore(
    () => () => {},
    getWebGLSupport,
    () => true
  );

  const [currentSection, setCurrentSection] = useState(0);
  const currentSectionRef = useRef(0);

  useEffect(() => {
    storyStore.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    storyStore.isMobile = window.innerWidth < 768;
  }, []);

  const handleScroll = useCallback(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const progress = Math.min(window.scrollY / maxScroll, 1);
    storyStore.progress = progress;
    const section = Math.min(Math.floor(progress * 8), 7);
    storyStore.section = section;
    if (section !== currentSectionRef.current) {
      currentSectionRef.current = section;
      setCurrentSection(section);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!webglOk) {
    return <FallbackContent />;
  }

  return (
    <div className="relative" style={{ minHeight: "100vh" }}>
      <div className="fixed inset-0 z-0">
        <CinematicCanvas />
      </div>

      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-20"
        style={{
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Cinematic letterbox bars */}
      <div
        className="pointer-events-none fixed left-0 right-0 top-0 z-20 h-[6vh]"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
        }}
      />
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-20 h-[6vh]"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
        }}
      />

      {/* Color grading */}
      <div
        className="pointer-events-none fixed inset-0 z-20 mix-blend-multiply"
        style={{
          background: "linear-gradient(180deg, rgba(20,40,60,0.08), rgba(10,20,30,0.05))",
        }}
      />

      <StoryOverlay currentSection={currentSection} />
    </div>
  );
}
