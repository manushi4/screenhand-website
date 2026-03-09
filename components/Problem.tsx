"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const problems = [
  {
    title: "Blind",
    description: "AI can't see your screen. No pixels, no context, no understanding of what's in front of it.",
    image: "/assets/pain-slow.webp",
    accent: "border-red-accent/30 hover:border-red-accent/60",
  },
  {
    title: "Siloed",
    description: "Trapped in chat boxes and APIs. No way to interact with the apps you actually use.",
    image: "/assets/pain-silo.webp",
    accent: "border-red-accent/30 hover:border-red-accent/60",
  },
  {
    title: "Broken",
    description: "Pixel-based automation breaks on every UI change. Fragile, slow, unreliable.",
    image: "/assets/pain-broken.webp",
    accent: "border-red-accent/30 hover:border-red-accent/60",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="font-mono text-sm text-red-accent tracking-widest uppercase mb-4 block">
              The Problem
            </span>
            <h2 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              AI agents are{" "}
              <span className="text-red-accent">blind</span> and{" "}
              <span className="text-red-accent">handless</span>.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.15}>
              <div
                className={`group rounded-2xl border ${p.accent} bg-[#0a0a0a] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(255,59,59,0.15)]`}
              >
                <div className="relative h-48 rounded-lg overflow-hidden mb-5 bg-black">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2 text-red-accent">
                  {p.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {p.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
