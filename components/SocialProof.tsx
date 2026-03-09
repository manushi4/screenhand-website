"use client";

import ScrollReveal from "./ScrollReveal";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
  { value: 82, suffix: "+", label: "MCP Tools" },
  { value: 202, suffix: "", label: "Tests Passing" },
  { value: 2, suffix: "", label: "Platforms" },
  { value: 5, suffix: "", label: "Adapters" },
];

export default function SocialProof() {
  return (
    <section className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        {/* Testimonial */}
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <svg
              className="w-10 h-10 text-cyan-glow/30 mx-auto mb-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote className="text-2xl sm:text-3xl font-heading font-medium leading-relaxed mb-6 text-white/90">
              &ldquo;ScreenHand is what I imagined when I first heard about AI agents —
              an AI that can actually <span className="text-cyan-glow">use my computer</span>.&rdquo;
            </blockquote>
            <div className="text-white/40 text-sm">
              — Built with conviction by the ScreenHand team
            </div>
          </div>
        </ScrollReveal>

        {/* Stats bar */}
        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-xl border border-white/5 bg-white/[0.02]"
              >
                <div className="font-heading font-bold text-4xl sm:text-5xl text-cyan-glow mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/40 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
