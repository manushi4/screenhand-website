"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const LaptopStoryScene = dynamic(() => import("./LaptopScene"), { ssr: false });

/* ═══════════════════════════════════════════
   Story Section — Scroll-driven narrative
   Left: Sticky 3D laptop that evolves
   Right: Scrolling story panels
   ═══════════════════════════════════════════ */

interface StoryPanel {
  id: string;
  label: string;
  labelColor: string;
  title: React.ReactNode;
  description: string;
  cards?: { image: string; title: string; desc: string; accent: string }[];
  detail?: React.ReactNode;
}

const panels: StoryPanel[] = [
  {
    id: "hero",
    label: "Act I",
    labelColor: "text-white/30",
    title: (
      <>
        <span className="text-white/40">I can think.</span>
        <br />
        <span className="text-white/40">I can reason.</span>
        <br />
        <br />
        <span className="text-white">But I can&apos;t <span className="text-red-accent">see</span>.</span>
        <br />
        <span className="text-white">I can&apos;t <span className="text-red-accent">touch</span>.</span>
      </>
    ),
    description: "AI is trapped in a text box. It can write a novel, solve equations, generate code — but it can't click a button.",
  },
  {
    id: "problem",
    label: "The Problem",
    labelColor: "text-red-accent",
    title: (
      <>
        AI agents are <span className="text-red-accent">blind</span> and{" "}
        <span className="text-red-accent">handless</span>.
      </>
    ),
    description: "Every attempt at desktop automation fails. Pixel matching breaks on UI changes. Screenshot parsing is slow and inaccurate. There's no reliable way for AI to interact with the real world.",
    cards: [
      { image: "/assets/pain-slow.webp", title: "Blind", desc: "Can't see what's on screen", accent: "border-red-accent/40" },
      { image: "/assets/pain-silo.webp", title: "Siloed", desc: "Trapped in chat boxes and APIs", accent: "border-red-accent/40" },
      { image: "/assets/pain-broken.webp", title: "Broken", desc: "Pixel automation always breaks", accent: "border-red-accent/40" },
    ],
  },
  {
    id: "solution",
    label: "The Solution",
    labelColor: "text-cyan-glow",
    title: (
      <>
        ScreenHand gives AI{" "}
        <span className="text-cyan-glow">native desktop control</span>.
      </>
    ),
    description: "Not pixels. Not screenshots. Native accessibility APIs — the same system VoiceOver and screen readers use. Instant, structured, reliable.",
    cards: [
      { image: "/assets/solution-see.webp", title: "01 — See", desc: "Structured understanding of every element", accent: "border-cyan-glow/40" },
      { image: "/assets/solution-click.webp", title: "02 — Click", desc: "Precise clicks through the OS accessibility layer", accent: "border-cyan-glow/40" },
      { image: "/assets/solution-speed.webp", title: "03 — Control", desc: "Type, drag, scroll — full control at native speed", accent: "border-cyan-glow/40" },
    ],
  },
  {
    id: "demo",
    label: "In Action",
    labelColor: "text-cyan-glow",
    title: (
      <>
        Watch it <span className="text-cyan-glow">work</span>.
      </>
    ),
    description: "82 MCP tools. One protocol. Works with Claude, Cursor, and any MCP-compatible AI client. macOS and Windows.",
    detail: (
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-green-accent" />
          <span className="text-sm text-white/50">Native bridge connected</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-green-accent" />
          <span className="text-sm text-white/50">82 MCP tools loaded</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-green-accent" />
          <span className="text-sm text-white/50">Cross-app control ready</span>
        </div>
        <div className="mt-6 px-5 py-3 rounded-full border border-white/10 bg-white/5 font-mono text-sm text-white/70 inline-block">
          <span className="text-cyan-glow">$</span> npm install screenhand
        </div>
      </div>
    ),
  },
];

export default function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activePanel, setActivePanel] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const containerHeight = container.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / containerHeight));
      setProgress(p);
      setActivePanel(Math.min(Math.floor(p * panels.length), panels.length - 1));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative" id="story">
      {/* Progress indicator */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2">
        {panels.map((p, i) => (
          <div
            key={p.id}
            className={`w-1.5 rounded-full transition-all duration-500 ${
              i === activePanel
                ? "h-8 bg-cyan-glow shadow-[0_0_8px_#00E5FF]"
                : i < activePanel
                  ? "h-3 bg-cyan-glow/40"
                  : "h-3 bg-white/10"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sticky 3D laptop — left side */}
        <div className="lg:w-[48%] lg:h-screen lg:sticky lg:top-0 flex items-center justify-center">
          <div className="w-full h-[50vh] lg:h-[80vh] relative">
            {/* Subtle background differentiation — not pure black */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#030308] via-[#050510] to-[#030308] rounded-3xl lg:rounded-none" />
            {/* Soft edge glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full transition-all duration-1000"
                style={{
                  background: `radial-gradient(circle, ${
                    activePanel <= 1 ? "rgba(255,60,60,0.06)" : "rgba(0,229,255,0.08)"
                  } 0%, transparent 70%)`,
                }}
              />
            </div>
            <LaptopStoryScene progress={progress} className="relative z-10 w-full h-full" />
          </div>
        </div>

        {/* Scrolling story content — right side */}
        <div className="lg:w-[52%]">
          {panels.map((panel, i) => (
            <div
              key={panel.id}
              id={panel.id === "hero" ? undefined : panel.id}
              className="min-h-screen flex items-center px-6 lg:px-12 xl:px-20"
            >
              <div
                className={`max-w-xl transition-all duration-700 ${
                  i === activePanel ? "opacity-100 translate-y-0" : "opacity-30 translate-y-4"
                }`}
              >
                {/* Section label */}
                <span className={`font-mono text-xs tracking-[0.2em] uppercase ${panel.labelColor} mb-4 block`}>
                  {panel.label}
                </span>

                {/* Title */}
                <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-6">
                  {panel.title}
                </h2>

                {/* Description */}
                <p className="text-white/50 text-base lg:text-lg leading-relaxed mb-8">
                  {panel.description}
                </p>

                {/* Cards */}
                {panel.cards && (
                  <div className="grid gap-3">
                    {panel.cards.map((card) => (
                      <div
                        key={card.title}
                        className={`flex items-center gap-4 rounded-xl border ${card.accent} bg-white/[0.02] p-3 transition-all hover:-translate-x-1`}
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative bg-black">
                          <Image src={card.image} alt={card.title} fill className="object-cover opacity-80" />
                        </div>
                        <div>
                          <div className="font-heading font-semibold text-sm">{card.title}</div>
                          <div className="text-white/40 text-xs">{card.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Extra detail */}
                {panel.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transition gradient at bottom — story fades into rest of page */}
      <div className="h-32 bg-gradient-to-b from-transparent to-black" />
    </div>
  );
}
