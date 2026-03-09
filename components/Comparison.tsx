"use client";

import ScrollReveal from "./ScrollReveal";

const rows = [
  { feature: "Native OS integration", screenhand: true, selenium: false, pyautogui: false, applescript: false },
  { feature: "Cross-application control", screenhand: true, selenium: false, pyautogui: true, applescript: false },
  { feature: "Accessibility API access", screenhand: true, selenium: false, pyautogui: false, applescript: false },
  { feature: "Browser automation", screenhand: true, selenium: true, pyautogui: false, applescript: false },
  { feature: "MCP protocol support", screenhand: true, selenium: false, pyautogui: false, applescript: false },
  { feature: "Session resilience", screenhand: true, selenium: false, pyautogui: false, applescript: false },
  { feature: "AI-native design", screenhand: true, selenium: false, pyautogui: false, applescript: false },
  { feature: "Works with any app", screenhand: true, selenium: false, pyautogui: true, applescript: false },
];

const tools = [
  { key: "screenhand", label: "ScreenHand" },
  { key: "selenium", label: "Selenium" },
  { key: "pyautogui", label: "PyAutoGUI" },
  { key: "applescript", label: "AppleScript" },
];

function Check() {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-accent/20 text-green-accent text-base">
      ✓
    </span>
  );
}

function Cross() {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-accent/20 text-red-accent text-base">
      ✗
    </span>
  );
}

export default function Comparison() {
  return (
    <section className="section-padding relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="font-mono text-sm text-cyan-glow tracking-widest uppercase mb-4 block">
              Comparison
            </span>
            <h2 className="font-heading font-bold text-4xl sm:text-5xl tracking-tight">
              Why <span className="text-cyan-glow">ScreenHand</span>?
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0" style={{ WebkitOverflowScrolling: "touch" }}>
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/40 font-normal">Feature</th>
                  {tools.map((t) => (
                    <th
                      key={t.key}
                      className={`py-4 px-4 text-center font-medium ${
                        t.key === "screenhand"
                          ? "text-cyan-glow text-base bg-cyan-glow/[0.03]"
                          : "text-white/40"
                      }`}
                    >
                      {t.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-4 text-white/70 font-medium">{row.feature}</td>
                    {tools.map((t) => (
                      <td key={t.key} className={`py-3.5 px-4 text-center ${t.key === "screenhand" ? "bg-cyan-glow/[0.03]" : ""}`}>
                        {row[t.key as keyof typeof row] ? <Check /> : <Cross />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
