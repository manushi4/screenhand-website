"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    num: "01",
    title: "See",
    description: "Native accessibility APIs give AI structured understanding of every element on screen.",
    image: "/assets/solution-see.webp",
  },
  {
    num: "02",
    title: "Click",
    description: "Precise, reliable clicks through the OS accessibility layer. No pixel guessing.",
    image: "/assets/solution-click.webp",
  },
  {
    num: "03",
    title: "Control",
    description: "Type, drag, scroll, read — full desktop control at native speed.",
    image: "/assets/solution-speed.webp",
  },
];

export default function Solution() {
  return (
    <section id="solution" className="section-padding relative">
      {/* Divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-cyan-glow/50 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="font-mono text-sm text-cyan-glow tracking-widest uppercase mb-4 block">
              The Solution
            </span>
            <h2 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              ScreenHand gives AI{" "}
              <span className="text-cyan-glow">native desktop control</span>.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <ScrollReveal key={s.num} delay={i * 0.15}>
              <div className="group relative rounded-2xl border border-cyan-glow/10 hover:border-cyan-glow/30 bg-[#0a0a0a] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,229,255,0.15)]">
                {/* Step number */}
                <span className="absolute -top-4 -left-2 font-heading font-bold text-6xl text-cyan-glow/10 group-hover:text-cyan-glow/20 transition-colors">
                  {s.num}
                </span>

                <div className="relative h-48 rounded-lg overflow-hidden mb-5 bg-black">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                <h3 className="font-heading font-semibold text-xl mb-2 text-cyan-glow">
                  {s.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {s.description}
                </p>

                {/* Connector arrow (between cards) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 10H15M15 10L10 5M15 10L10 15" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
