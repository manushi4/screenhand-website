"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import dynamic from "next/dynamic";
import MagneticButton from "./MagneticButton";

const ParticleHand = dynamic(() => import("./ParticleHand"), { ssr: false });

const PRELOADER_LINES = [
  "I can think.",
  "I can reason.",
  "I can write code.",
  "",
  "But I can't see.",
  "I can't click.",
  "I can't touch.",
];

export default function Hero() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [preloaderText, setPreloaderText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const [installText, setInstallText] = useState("");
  const cancelledRef = useRef(false);

  // Preloader typing
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      setPreloaderDone(true);
      setShowContent(true);
      setInstallText("npm install screenhand");
      return;
    }

    cancelledRef.current = false;

    const run = async () => {
      let fullText = "";
      for (const line of PRELOADER_LINES) {
        if (cancelledRef.current) return;
        for (const char of line) {
          if (cancelledRef.current) return;
          fullText += char;
          setPreloaderText(fullText);
          await new Promise((r) => setTimeout(r, 40));
        }
        fullText += "\n";
        setPreloaderText(fullText);
        await new Promise((r) => setTimeout(r, 300));
      }
      await new Promise((r) => setTimeout(r, 800));

      // Fade out preloader
      if (preloaderRef.current && !cancelledRef.current) {
        gsap.to(preloaderRef.current, {
          opacity: 0,
          duration: 0.6,
          onComplete: () => {
            if (!cancelledRef.current) {
              setPreloaderDone(true);
              setTimeout(() => setShowContent(true), 100);
            }
          },
        });
      }
    };
    run();
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  // Headline reveal animation
  useEffect(() => {
    if (!showContent || !headlineRef.current || !contentRef.current) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    const chars = headlineRef.current.querySelectorAll(".char");
    const tl = gsap.timeline();

    tl.fromTo(
      chars,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.03, duration: 0.5, ease: "power3.out" }
    );

    tl.fromTo(
      contentRef.current.querySelectorAll(".reveal-item"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: "power2.out" },
      "-=0.2"
    );

    // Type install command
    const cmd = "npm install screenhand";
    let i = 0;
    const interval = setInterval(() => {
      if (i <= cmd.length) {
        setInstallText(cmd.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [showContent]);

  const headlineText = "Give AI Hands.";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ambient orbs */}
      <div
        className="ambient-orb w-[600px] h-[600px] bg-cyan-glow/10 -top-40 -right-40"
        style={{ animationDelay: "0s" }}
        aria-hidden="true"
      />
      <div
        className="ambient-orb w-[400px] h-[400px] bg-cyan-glow/5 bottom-20 -left-20"
        style={{ animationDelay: "-7s" }}
        aria-hidden="true"
      />

      {/* Preloader */}
      {!preloaderDone && (
        <div ref={preloaderRef} className="preloader">
          <div className="preloader-text whitespace-pre-wrap">
            {preloaderText}
            <span className="cursor-blink" />
          </div>
        </div>
      )}

      {/* Main content */}
      {showContent && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          <div ref={contentRef}>
            <h1
              ref={headlineRef}
              className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[0.95] mb-6"
            >
              {(() => {
                const handsStart = headlineText.indexOf("Hands.");
                const beforeHands = headlineText.slice(0, handsStart);
                const handsWord = headlineText.slice(handsStart);
                let charIndex = 0;

                return (
                  <>
                    {beforeHands.split("").map((char) => {
                      const i = charIndex++;
                      return (
                        <span
                          key={i}
                          className={`char inline-block ${char === " " ? "w-[0.3em]" : ""}`}
                          style={{ opacity: 0 }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </span>
                      );
                    })}
                    <span className="whitespace-nowrap">
                      {handsWord.split("").map((char) => {
                        const i = charIndex++;
                        return (
                          <span
                            key={i}
                            className="char inline-block text-cyan-glow"
                            style={{ opacity: 0 }}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </span>
                  </>
                );
              })()}
            </h1>

            <p className="reveal-item text-lg sm:text-xl text-white/60 max-w-lg mb-8 leading-relaxed" style={{ opacity: 0 }}>
              Native desktop control for AI agents. See, click, type, drag —
              everything a human can do, now your AI can too.
            </p>

            <div className="reveal-item flex flex-wrap gap-4 items-center" style={{ opacity: 0 }}>
              <MagneticButton href="#cta">
                <span className="px-8 py-3.5 rounded-full bg-cyan-glow text-black font-semibold text-base hover:shadow-[0_0_30px_#00E5FF66] transition-all min-h-[44px] inline-flex items-center">
                  Get Started
                </span>
              </MagneticButton>

              <div className="px-5 py-3 rounded-full border border-white/10 bg-white/5 font-mono text-xs sm:text-sm text-white/80 flex items-center gap-2 min-h-[44px]">
                <span className="text-cyan-glow">$</span>
                <span>{installText}</span>
                <span className="w-[2px] h-[1em] bg-cyan-glow animate-pulse" />
              </div>
            </div>

            <div className="reveal-item mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/40" style={{ opacity: 0 }}>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-accent" />
                macOS + Windows
              </span>
              <span>82 MCP Tools</span>
              <span>Open Source</span>
            </div>
          </div>

          {/* Particle Hand */}
          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
            <ParticleHand className="w-full h-full" />
            {/* Floating AI cursor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div
                className="w-4 h-4 rounded-full bg-cyan-glow"
                style={{
                  boxShadow: "0 0 20px #00E5FF, 0 0 40px #00E5FF44",
                  animation: "ai-cursor 4s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      {showContent && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs animate-bounce">
          <span>Scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 12L2 6h12L8 12z" />
          </svg>
        </div>
      )}
    </section>
  );
}
