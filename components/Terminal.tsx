"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface TerminalLine {
  type: "command" | "output" | "status";
  text: string;
  color?: string;
}

const SEQUENCES: TerminalLine[][] = [
  [
    { type: "command", text: "screenhand start" },
    { type: "status", text: "✓ Native bridge connected", color: "text-green-accent" },
    { type: "status", text: "✓ Accessibility API ready", color: "text-green-accent" },
    { type: "status", text: "✓ 82 MCP tools loaded", color: "text-green-accent" },
    { type: "output", text: "ScreenHand is running on localhost:3100" },
  ],
  [
    { type: "command", text: "screenshot" },
    { type: "output", text: "📸 Captured 2560×1440 screenshot" },
    { type: "output", text: "→ Found 23 interactive elements" },
  ],
  [
    { type: "command", text: 'click "Submit Button"' },
    { type: "output", text: '🎯 Located "Submit Button" at (834, 456)' },
    { type: "status", text: "✓ Click successful", color: "text-green-accent" },
  ],
  [
    { type: "command", text: "ocr" },
    { type: "output", text: "📝 Extracted 47 text regions" },
    { type: "output", text: '→ "Welcome back, Alex"' },
    { type: "output", text: '→ "Dashboard" "Settings" "Logout"' },
  ],
  [
    { type: "command", text: 'type_text "Hello from AI"' },
    { type: "output", text: "⌨️ Typed 13 characters at 40ms/char" },
    { type: "status", text: "✓ Text input verified", color: "text-green-accent" },
  ],
];

const CHAR_DELAY = 35;
const LINE_PAUSE = 400;
const SEQUENCE_PAUSE = 2500;

export default function Terminal({
  onAction,
}: {
  onAction?: (action: string) => void;
}) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentTyping, setCurrentTyping] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(true);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const typeCommand = useCallback(async (text: string) => {
    setIsTyping(true);
    setCurrentTyping("");
    for (let i = 0; i <= text.length; i++) {
      if (!activeRef.current) return;
      setCurrentTyping(text.slice(0, i));
      await sleep(CHAR_DELAY);
    }
    setIsTyping(false);
    setCurrentTyping("");
    return text;
  }, []);

  useEffect(() => {
    activeRef.current = true;
    let running = true;

    const run = async () => {
      while (running && activeRef.current) {
        for (const seq of SEQUENCES) {
          if (!activeRef.current) return;
          for (const line of seq) {
            if (!activeRef.current) return;
            if (line.type === "command") {
              await typeCommand(line.text);
              onAction?.(line.text);
              setLines((prev) => [...prev, line]);
            } else {
              await sleep(LINE_PAUSE);
              setLines((prev) => [...prev, line]);
            }
          }
          await sleep(SEQUENCE_PAUSE);
        }
        // Reset for loop
        setLines([]);
        await sleep(1000);
      }
    };

    run();
    return () => {
      running = false;
      activeRef.current = false;
    };
  }, [typeCommand, onAction]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, currentTyping]);

  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden font-mono text-sm shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#111]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-white/40 text-xs ml-2">screenhand — zsh</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-accent animate-pulse" />
          <span className="text-green-accent text-xs">LIVE</span>
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={containerRef}
        className="p-4 h-[320px] overflow-y-auto space-y-1"
      >
        {lines.map((line, i) => (
          <div key={i} className="flex">
            {line.type === "command" ? (
              <>
                <span className="text-cyan-glow mr-2">$</span>
                <span className="text-white">{line.text}</span>
              </>
            ) : (
              <span className={line.color || "text-white/60"}>
                {"  "}
                {line.text}
              </span>
            )}
          </div>
        ))}

        {/* Currently typing */}
        {isTyping && (
          <div className="flex">
            <span className="text-cyan-glow mr-2">$</span>
            <span className="text-white">{currentTyping}</span>
            <span className="inline-block w-[2px] h-[1em] bg-cyan-glow ml-[1px] animate-pulse" />
          </div>
        )}

        {/* Idle prompt */}
        {!isTyping && (
          <div className="flex opacity-60">
            <span className="text-cyan-glow mr-2">$</span>
            <span className="inline-block w-[2px] h-[1em] bg-cyan-glow ml-[1px] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
