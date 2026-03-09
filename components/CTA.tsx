"use client";

import Image from "next/image";
import MagneticButton from "./MagneticButton";
import ScrollReveal from "./ScrollReveal";

export default function CTA() {
  return (
    <section id="cta" className="section-padding relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[500px] bg-cyan-glow/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6">
              Ready to give AI
              <br />
              <span className="text-cyan-glow">desktop superpowers</span>?
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
              Open source. One command to install. Works with Claude, Cursor, and
              any MCP-compatible client.
            </p>

            <div className="flex justify-center mb-8">
              <Image src="/assets/screenhand-logo.png" alt="ScreenHand" width={120} height={120} className="opacity-90" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton href="https://github.com/manushi4/Screenhand">
                <span className="px-8 py-4 rounded-full bg-cyan-glow text-black font-semibold text-lg hover:shadow-[0_0_40px_#00E5FF66] transition-all inline-block">
                  Get Started →
                </span>
              </MagneticButton>

              <div className="px-6 py-3.5 rounded-full border border-white/10 bg-white/5 font-mono text-xs sm:text-sm text-white/70 min-h-[44px] flex items-center">
                <span className="text-cyan-glow">$</span> npm install screenhand
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
