"use client";

import { useState, useCallback } from "react";
import Terminal from "./Terminal";
import ScrollReveal from "./ScrollReveal";

interface DesktopState {
  screenshot: boolean;
  clicked: boolean;
  ocrHighlights: boolean;
  typing: boolean;
  inputText: string;
}

export default function LiveDemo() {
  const [state, setState] = useState<DesktopState>({
    screenshot: false,
    clicked: false,
    ocrHighlights: false,
    typing: false,
    inputText: "",
  });

  const handleAction = useCallback((action: string) => {
    if (action.includes("screenshot")) {
      setState((s) => ({ ...s, screenshot: true, clicked: false, ocrHighlights: false, typing: false, inputText: "" }));
      setTimeout(() => setState((s) => ({ ...s, screenshot: false })), 200);
    } else if (action.includes("click")) {
      setState((s) => ({ ...s, clicked: true, ocrHighlights: false, typing: false }));
    } else if (action.includes("ocr")) {
      setState((s) => ({ ...s, ocrHighlights: true, clicked: false, typing: false }));
    } else if (action.includes("type_text")) {
      setState((s) => ({ ...s, typing: true, ocrHighlights: false, clicked: false, inputText: "" }));
      // Simulate typing
      const text = "Hello from AI";
      let i = 0;
      const iv = setInterval(() => {
        if (i <= text.length) {
          setState((s) => ({ ...s, inputText: text.slice(0, i) }));
          i++;
        } else {
          clearInterval(iv);
        }
      }, 50);
    } else if (action.includes("start")) {
      setState({ screenshot: false, clicked: false, ocrHighlights: false, typing: false, inputText: "" });
    }
  }, []);

  return (
    <section id="demo" className="section-padding relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="font-mono text-sm text-cyan-glow tracking-widest uppercase mb-4 block">
              Live Demo
            </span>
            <h2 className="font-heading font-bold text-4xl sm:text-5xl tracking-tight">
              Watch it <span className="text-cyan-glow">work</span>.
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Terminal */}
            <div className="order-2 lg:order-1">
              <Terminal onAction={handleAction} />
            </div>

            {/* Desktop simulation */}
            <div className="order-1 lg:order-2">
              <div
                className={`rounded-xl border border-white/10 bg-[#0c0c0c] overflow-hidden shadow-2xl transition-all ${
                  state.screenshot ? "ring-2 ring-cyan-glow shadow-[0_0_30px_#00E5FF33]" : ""
                }`}
              >
                {/* Desktop title bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-[#111]">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  </div>
                  <span className="text-white/30 text-xs ml-2">MyApp — Dashboard</span>
                </div>

                {/* Desktop content */}
                <div className="p-6 min-h-[280px] relative">
                  {/* Flash overlay on screenshot */}
                  {state.screenshot && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse z-20 rounded-b-xl" />
                  )}

                  {/* Nav bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                    <div className={`text-sm font-medium ${state.ocrHighlights ? "ring-1 ring-cyan-glow/50 rounded px-1 -mx-1" : ""}`}>
                      Welcome back, Alex
                    </div>
                    <div className="flex gap-3 text-xs text-white/40">
                      {["Dashboard", "Settings", "Logout"].map((item) => (
                        <span
                          key={item}
                          className={`${
                            state.ocrHighlights
                              ? "ring-1 ring-cyan-glow/50 rounded px-1"
                              : ""
                          } transition-all`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: "Tasks", value: "12" },
                      { label: "Done", value: "8" },
                      { label: "Pending", value: "4" },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className={`rounded-lg border border-white/5 bg-white/5 p-3 text-center ${
                          state.ocrHighlights ? "ring-1 ring-cyan-glow/40" : ""
                        }`}
                      >
                        <div className="text-2xl font-bold">{card.value}</div>
                        <div className="text-xs text-white/40">{card.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Input field */}
                  <div className="mb-4">
                    <div className={`rounded-lg border bg-white/5 px-3 py-2 text-sm ${
                      state.typing ? "border-cyan-glow/50" : "border-white/10"
                    }`}>
                      {state.typing ? (
                        <span>
                          {state.inputText}
                          <span className="inline-block w-[2px] h-[1em] bg-cyan-glow ml-[1px] animate-pulse" />
                        </span>
                      ) : (
                        <span className="text-white/20">Type something...</span>
                      )}
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      state.clicked
                        ? "bg-cyan-glow text-black scale-95 shadow-[0_0_20px_#00E5FF44]"
                        : "bg-white/10 text-white/60 hover:bg-white/15"
                    }`}
                  >
                    Submit
                  </button>

                  {/* AI cursor indicator */}
                  {state.clicked && (
                    <div className="absolute bottom-[52px] left-[72px] pointer-events-none">
                      <div className="w-3 h-3 rounded-full bg-cyan-glow shadow-[0_0_10px_#00E5FF] animate-ping" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
