"use client";

import Link from "next/link";

interface StoryOverlayProps {
  currentSection: number;
}

export function StoryOverlay({ currentSection }: StoryOverlayProps) {
  return (
    <div className="pointer-events-none relative z-10" style={{ height: "800vh" }}>
      <Section0 active={currentSection === 0} />
      <Section1 active={currentSection === 1} />
      <Section2 active={currentSection === 2} />
      <Section3 active={currentSection === 3} />
      <Section4 active={currentSection === 4} />
      <Section5 active={currentSection === 5} />
      <Section6 active={currentSection === 6} />
      <Section7 active={currentSection === 7} />
    </div>
  );
}

function Section0({ active }: { active: boolean }) {
  return (
    <section className="flex h-screen items-center justify-center px-6">
      <div className={`text-center transition-all duration-1000 ${active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
        <h1 className="mb-3 text-6xl font-bold tracking-tight text-white md:text-7xl" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
          RAKVA
        </h1>
        <p className="mb-2 text-sm font-medium tracking-[0.2em] text-slate-300" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}>
          AI-POWERED DISASTER INTELLIGENCE & RECOVERY PLANNING
        </p>
        <p className="mt-12 text-xs text-slate-400" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
          Scroll to experience the story
        </p>
      </div>
    </section>
  );
}

function Section1({ active }: { active: boolean }) {
  return (
    <section className="flex h-screen items-center justify-center px-6">
      <div className={`max-w-xl text-center transition-all duration-1000 ${active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
        <p className="mb-2 text-xs font-medium tracking-[0.25em] text-cyan-400" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>DETECT</p>
        <h2 className="text-4xl font-bold text-white md:text-5xl" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>
          Detect the damage.
        </h2>
        <p className="mt-4 text-sm text-slate-300" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
          A landslide destabilizes the mountain slope. Infrastructure is affected.
          Roads are blocked. The bridge is compromised.
        </p>
      </div>
    </section>
  );
}

function Section2({ active }: { active: boolean }) {
  return (
    <section className="flex h-screen items-center justify-center px-6">
      <div className={`max-w-xl text-center transition-all duration-1000 ${active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
        <p className="mb-2 text-xs font-medium tracking-[0.25em] text-red-400" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>CONSEQUENCES</p>
        <h2 className="text-4xl font-bold text-white md:text-5xl" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>
          Understand the impact.
        </h2>
        <div className="mt-6 space-y-2 text-left">
          {[
            { label: "Road blocked — primary access severed", color: "red" },
            { label: "Bridge damaged — structural compromise", color: "orange" },
            { label: "Hospital access at risk — critical dependency", color: "yellow" },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 backdrop-blur-sm ${
                item.color === "red"
                  ? "border-red-500/25 bg-red-950/40"
                  : item.color === "orange"
                  ? "border-orange-500/25 bg-orange-950/40"
                  : "border-yellow-500/25 bg-yellow-950/40"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${
                item.color === "red" ? "bg-red-500" : item.color === "orange" ? "bg-orange-500" : "bg-yellow-500"
              }`} />
              <span className="text-sm text-slate-200">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Section3({ active }: { active: boolean }) {
  return (
    <section className="flex h-screen items-center justify-center px-6">
      <div className={`max-w-xl text-center transition-all duration-1000 ${active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
        <p className="mb-2 text-xs font-medium tracking-[0.25em] text-cyan-400" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>ASSESSMENT INITIATED</p>
        <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>
          RAKVA activates.
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {["SATELLITE", "DRONE", "CITIZEN", "GEOSPATIAL"].map((src) => (
            <div
              key={src}
              className="flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-950/30 px-4 py-2 backdrop-blur-sm"
            >
              <span className="text-xs font-bold text-cyan-400">✓</span>
              <span className="text-sm text-slate-200">{src}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs font-medium tracking-[0.2em] text-cyan-400" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
          EVIDENCE FUSION
        </p>
      </div>
    </section>
  );
}

function Section4({ active }: { active: boolean }) {
  return (
    <section className="flex h-screen items-center justify-center px-6">
      <div className={`max-w-xl text-center transition-all duration-1000 ${active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
        <p className="mb-2 text-xs font-medium tracking-[0.25em] text-slate-400" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>INTELLIGENCE</p>
        <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>
          Understand the damage.
        </h2>
        <p className="mb-6 text-base text-slate-300" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
          DAMAGE DETECTED
        </p>
        <div className="mx-auto max-w-sm rounded-xl border border-slate-600/40 bg-slate-900/50 p-5 backdrop-blur-sm">
          <p className="text-sm italic text-slate-300">
            &ldquo;Damage alone does not determine what comes first.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

function Section5({ active }: { active: boolean }) {
  return (
    <section className="flex h-screen items-center justify-center px-6">
      <div className={`max-w-2xl text-center transition-all duration-1000 ${active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
        <p className="mb-2 text-xs font-medium tracking-[0.25em] text-cyan-400" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>PRIORITY ANALYSIS</p>
        <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>
          Three assets. Different damage. Different priorities.
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "BUILDING-031", severity: "SEVERE", priority: 68, color: "red" },
            { id: "ROAD-017", severity: "HIGH", priority: 82, color: "orange" },
            { id: "BRIDGE-024", severity: "MODERATE", priority: 94, color: "yellow" },
          ].map((a) => (
            <div key={a.id} className={`rounded-xl border p-4 backdrop-blur-sm ${
              a.color === "red"
                ? "border-red-500/30 bg-red-950/40"
                : a.color === "orange"
                ? "border-orange-500/30 bg-orange-950/40"
                : "border-yellow-500/30 bg-yellow-950/40"
            }`}>
              <p className="text-[10px] text-slate-400">{a.id}</p>
              <p className={`text-xs font-medium ${
                a.color === "red" ? "text-red-400" : a.color === "orange" ? "text-orange-400" : "text-yellow-400"
              }`}>{a.severity} DAMAGE</p>
              <p className="mt-1 text-[10px] text-slate-500">RECOVERY PRIORITY</p>
              <p className={`text-3xl font-bold ${
                a.color === "red" ? "text-red-400" : a.color === "orange" ? "text-orange-400" : "text-yellow-400"
              }`}>{a.priority}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Section6({ active }: { active: boolean }) {
  return (
    <section className="flex h-screen items-center justify-center px-6">
      <div className={`max-w-2xl transition-all duration-1000 ${active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
        <div className="text-center">
          <p className="mb-2 text-xs font-medium tracking-[0.25em] text-cyan-400" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>WHY FIRST?</p>
          <h2 className="mb-2 text-4xl font-bold text-white md:text-5xl" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>
            BRIDGE-024
          </h2>
          <p className="mb-1 text-lg text-yellow-400" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>Recovery Priority #94</p>
          <p className="mb-8 text-sm text-slate-300" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>Moderate damage — but the highest recovery priority.</p>
        </div>
        <div className="mx-auto max-w-md space-y-2.5">
          {[
            { num: "01", text: "Hospital connection", desc: "HOSPITAL-002 depends on this bridge" },
            { num: "02", text: "Population impact", desc: "COMMUNITY A and COMMUNITY B affected" },
            { num: "03", text: "Limited alternate routes", desc: "No viable bypass available" },
            { num: "04", text: "High urgency", desc: "Time-critical medical access" },
          ].map((item) => (
            <div key={item.num} className="flex items-start gap-4 rounded-lg border border-slate-600/40 bg-slate-900/40 p-4 backdrop-blur-sm">
              <span className="text-lg font-bold text-cyan-400">{item.num}</span>
              <div>
                <p className="text-sm font-medium text-white">{item.text}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Section7({ active }: { active: boolean }) {
  return (
    <section className="flex h-screen items-center justify-center px-6">
      <div className={`max-w-2xl text-center transition-all duration-1000 ${active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
        <div className="mb-6 flex items-center justify-center gap-2">
          {["SATELLITE", "DRONE", "CITIZEN", "GEOSPATIAL"].map((src) => (
            <span key={src} className="rounded-md bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-400 backdrop-blur-sm">
              {src} ✓
            </span>
          ))}
        </div>
        <p className="mb-6 text-xs font-medium tracking-[0.2em] text-cyan-400" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>HIGH CONFIDENCE</p>

        <h2 className="mb-3 text-5xl font-bold text-white md:text-6xl" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
          RAKVA
        </h2>
        <p className="mb-2 text-base text-slate-200" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}>
          Detect the damage. Understand the impact. Prioritize the recovery.
        </p>
        <p className="mb-8 text-sm italic text-slate-400" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
          &ldquo;From fragmented disaster evidence to explainable recovery priorities.&rdquo;
        </p>
        <p className="mb-8 text-base font-medium text-white" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}>
          What should be addressed first — and why?
        </p>

        <div className="pointer-events-auto">
          <Link
            href="/command-center"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-500"
          >
            ENTER COMMAND CENTER
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <p className="mt-8 text-[10px] text-slate-500">
          DEMO MODE · CONCEPTUAL DEMONSTRATION · SYNTHETIC DATA
        </p>
      </div>
    </section>
  );
}
