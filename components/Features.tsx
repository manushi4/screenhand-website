"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const features = [
  {
    num: "82",
    title: "MCP Tools",
    description:
      "Complete desktop automation toolkit — from screenshots to drag-and-drop, all through a single protocol.",
    icon: "🛠",
  },
  {
    num: "12",
    title: "ms Response",
    description:
      "Native accessibility APIs mean instant element discovery. No image processing, no waiting.",
    icon: "⚡",
  },
  {
    num: "∞",
    title: "App Support",
    description:
      "Works with any application through OS-level accessibility. Chrome, Slack, Figma, Excel — everything.",
    icon: "🌐",
  },
  {
    num: "24/7",
    title: "Reliability",
    description:
      "Session resilience, auto-recovery, supervisor daemon. Built for unattended, long-running automation.",
    icon: "🔒",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateX.set(((e.clientY - cy) / rect.height) * -5);
    rotateY.set(((e.clientX - cx) / rect.width) * 5);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <ScrollReveal delay={index * 0.1}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformPerspective: 800,
        }}
        className="group relative rounded-2xl border border-white/5 hover:border-cyan-glow/30 bg-[#0a0a0a] p-8 transition-colors duration-300 h-full"
      >
        {/* Background number */}
        <span className="absolute top-4 right-4 font-heading font-bold text-7xl text-white/[0.03] group-hover:text-cyan-glow/[0.08] transition-colors">
          {feature.num}
        </span>

        <span className="text-3xl mb-4 block">{feature.icon}</span>

        <h3 className="font-heading font-semibold text-xl mb-1 group-hover:text-cyan-glow transition-colors">
          <span className="text-cyan-glow">{feature.num}</span> {feature.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed">
          {feature.description}
        </p>
      </motion.div>
    </ScrollReveal>
  );
}

export default function Features() {
  return (
    <section id="features" className="section-padding relative overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="font-mono text-sm text-cyan-glow tracking-widest uppercase mb-4 block">
              Features
            </span>
            <h2 className="font-heading font-bold text-4xl sm:text-5xl tracking-tight">
              Built for <span className="text-cyan-glow">serious</span> automation.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
