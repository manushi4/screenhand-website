"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════
   Scroll-driven 3D Laptop — "The Character"
   States: dormant → frustrated → awakening → alive → triumphant
   ═══════════════════════════════════════════ */

interface LaptopState {
  screenColor: THREE.Color;
  screenBrightness: number;
  handScale: number;
  handWaveSpeed: number;
  shakeAmount: number;
  sparkleOpacity: number;
  rimIntensity: number;
  screenLines: string[];
  screenLineColors: string[];
  bodyTilt: number;
}

function lerpState(a: LaptopState, b: LaptopState, t: number): LaptopState {
  const lerp = (x: number, y: number) => x + (y - x) * t;
  return {
    screenColor: a.screenColor.clone().lerp(b.screenColor, t),
    screenBrightness: lerp(a.screenBrightness, b.screenBrightness),
    handScale: lerp(a.handScale, b.handScale),
    handWaveSpeed: lerp(a.handWaveSpeed, b.handWaveSpeed),
    shakeAmount: lerp(a.shakeAmount, b.shakeAmount),
    sparkleOpacity: lerp(a.sparkleOpacity, b.sparkleOpacity),
    rimIntensity: lerp(a.rimIntensity, b.rimIntensity),
    screenLines: t < 0.5 ? a.screenLines : b.screenLines,
    screenLineColors: t < 0.5 ? a.screenLineColors : b.screenLineColors,
    bodyTilt: lerp(a.bodyTilt, b.bodyTilt),
  };
}

const STATES: LaptopState[] = [
  // 0: Dormant (Hero)
  {
    screenColor: new THREE.Color("#111118"),
    screenBrightness: 0.05,
    handScale: 0,
    handWaveSpeed: 0,
    shakeAmount: 0,
    sparkleOpacity: 0,
    rimIntensity: 0.1,
    screenLines: ["", "  I can think...", "  I can reason...", "", "  But I can't see.", "  I can't touch."],
    screenLineColors: ["#333", "#555", "#555", "#333", "#555", "#555"],
    bodyTilt: 0.05,
  },
  // 1: Frustrated (Problem)
  {
    screenColor: new THREE.Color("#1a0505"),
    screenBrightness: 0.4,
    handScale: 0,
    handWaveSpeed: 0,
    shakeAmount: 0.015,
    sparkleOpacity: 0,
    rimIntensity: 0.3,
    screenLines: ["  $ click button", "  ✗ Element not found", "  $ screenshot", "  ✗ No visual access", "  $ type input", "  ✗ Permission denied"],
    screenLineColors: ["#888", "#FF4444", "#888", "#FF4444", "#888", "#FF4444"],
    bodyTilt: -0.03,
  },
  // 2: Awakening (Solution)
  {
    screenColor: new THREE.Color("#001a1f"),
    screenBrightness: 0.7,
    handScale: 0.8,
    handWaveSpeed: 1.5,
    shakeAmount: 0,
    sparkleOpacity: 0.3,
    rimIntensity: 0.8,
    screenLines: ["  $ screenhand start", "  ✓ Bridge connected", "  ✓ AX API ready", "  ✓ 82 tools loaded", "", "  Ready."],
    screenLineColors: ["#00E5FF", "#00FF88", "#00FF88", "#00FF88", "#000", "#00E5FF"],
    bodyTilt: 0,
  },
  // 3: Alive (Demo)
  {
    screenColor: new THREE.Color("#001a22"),
    screenBrightness: 0.9,
    handScale: 1,
    handWaveSpeed: 2.5,
    shakeAmount: 0,
    sparkleOpacity: 0.5,
    rimIntensity: 1.0,
    screenLines: ['  $ click "Submit"', "  ✓ Found at (834, 456)", "  ✓ Click OK", "  $ ocr", "  → 47 text regions", '  → "Welcome back"'],
    screenLineColors: ["#00E5FF", "#00FF88", "#00FF88", "#00E5FF", "#67e8f9", "#67e8f9"],
    bodyTilt: -0.02,
  },
  // 4: Triumphant (CTA)
  {
    screenColor: new THREE.Color("#002233"),
    screenBrightness: 1,
    handScale: 1,
    handWaveSpeed: 3,
    shakeAmount: 0,
    sparkleOpacity: 0.9,
    rimIntensity: 1.2,
    screenLines: ["", "  mcp@screenhand:~$", "  screenhand.sh", "", "  ✓ All systems go.", "  ✓ Your turn."],
    screenLineColors: ["#000", "#7ee787", "#ffffff", "#000", "#00E5FF", "#00FF88"],
    bodyTilt: 0,
  },
];

/* ── Screen texture drawn on Canvas 2D ── */
function useScreenTexture() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const initialized = useRef(false);

  // Lazy-init on first draw call (guaranteed client-side inside R3F)
  const ensureInit = () => {
    if (initialized.current) return;
    initialized.current = true;
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 320;
    canvasRef.current = c;
    textureRef.current = new THREE.CanvasTexture(c);
    textureRef.current.minFilter = THREE.LinearFilter;
  };

  const draw = (state: LaptopState, time: number) => {
    ensureInit();
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;

    // Background with screen color
    const r = state.screenColor.r * 255;
    const g = state.screenColor.g * 255;
    const b = state.screenColor.b * 255;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, c.width, c.height);

    // Scanlines effect
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    for (let y = 0; y < c.height; y += 3) {
      ctx.fillRect(0, y, c.width, 1);
    }

    // Title bar
    ctx.fillStyle = `rgba(20,20,30,${state.screenBrightness})`;
    ctx.fillRect(0, 0, c.width, 30);
    const dots = ["#FF5F57", "#FEBC2E", "#28C840"];
    dots.forEach((col, i) => {
      ctx.beginPath();
      ctx.arc(16 + i * 18, 15, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = state.screenBrightness > 0.2 ? col : "#222";
      ctx.fill();
    });

    // Text lines
    ctx.font = "15px monospace";
    state.screenLines.forEach((line, i) => {
      ctx.fillStyle = state.screenLineColors[i] || "#555";
      // Typewriter: reveal chars based on time
      const charsVisible = Math.floor(time * 12 - i * 8);
      const visible = line.slice(0, Math.max(0, charsVisible));
      ctx.fillText(visible, 12, 55 + i * 24);
    });

    // Blinking cursor
    if (Math.sin(time * 5) > 0) {
      const lastLineIdx = state.screenLines.length - 1;
      const lastLine = state.screenLines[lastLineIdx] || "";
      const charsVis = Math.floor(time * 12 - lastLineIdx * 8);
      const visText = lastLine.slice(0, Math.max(0, charsVis));
      ctx.fillStyle = "#00E5FF";
      ctx.fillRect(12 + ctx.measureText(visText).width + 2, 42 + lastLineIdx * 24, 8, 16);
    }

    // Screen glow vignette
    const grd = ctx.createRadialGradient(256, 160, 50, 256, 160, 300);
    grd.addColorStop(0, "rgba(0,229,255,0)");
    grd.addColorStop(1, `rgba(0,0,0,${0.3 * state.screenBrightness})`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, c.width, c.height);

    if (textureRef.current) textureRef.current.needsUpdate = true;
  };

  return { texture: textureRef.current, draw };
}

/* ── Cartoon hand ── */
function Hand({
  position,
  side,
  scale,
  waveSpeed,
}: {
  position: [number, number, number];
  side: "left" | "right";
  scale: number;
  waveSpeed: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.25, metalness: 0.0 }),
    []
  );
  const outlineMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#1a1a2e", roughness: 1, side: THREE.BackSide }),
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    if (side === "left") {
      groupRef.current.rotation.z = Math.sin(t * waveSpeed) * 0.35 + 0.2;
      groupRef.current.rotation.x = Math.sin(t * waveSpeed * 0.6) * 0.1;
    } else {
      groupRef.current.rotation.z = Math.sin(t * waveSpeed * 0.4) * 0.06 - 0.3;
      groupRef.current.position.y = position[1] + Math.sin(t * waveSpeed * 0.6) * 0.04;
    }
  });

  const flip = side === "left" ? 1 : -1;

  if (side === "right") {
    return (
      <group ref={groupRef} position={position} scale={[flip * 0.26 * scale, 0.26 * scale, 0.26 * scale]}>
        <mesh material={mat}><sphereGeometry args={[0.45, 16, 16]} /></mesh>
        <mesh material={outlineMat} scale={[1.08, 1.08, 1.08]}><sphereGeometry args={[0.45, 16, 16]} /></mesh>
        <group position={[0.05, 0.4, 0]} rotation={[0, 0, 0.1]}>
          <mesh material={mat}><capsuleGeometry args={[0.12, 0.5, 8, 16]} /></mesh>
          <mesh material={outlineMat} scale={[1.12, 1.05, 1.12]}><capsuleGeometry args={[0.12, 0.5, 8, 16]} /></mesh>
        </group>
        {[0.2, 0, -0.2].map((z, i) => (
          <group key={i} position={[0.35, -0.05, z]} rotation={[0, 0, -1.2]}>
            <mesh material={mat}><capsuleGeometry args={[0.09, 0.2, 8, 16]} /></mesh>
          </group>
        ))}
      </group>
    );
  }

  return (
    <group ref={groupRef} position={position} scale={[flip * 0.26 * scale, 0.26 * scale, 0.26 * scale]}>
      <mesh material={mat}><sphereGeometry args={[0.5, 16, 16]} /></mesh>
      <mesh material={outlineMat} scale={[1.08, 1.08, 1.08]}><sphereGeometry args={[0.5, 16, 16]} /></mesh>
      {[
        { pos: [-0.35, 0.55, 0] as [number, number, number], rot: [0, 0, 0.4] as [number, number, number], len: 0.4 },
        { pos: [-0.15, 0.65, 0] as [number, number, number], rot: [0, 0, 0.15] as [number, number, number], len: 0.5 },
        { pos: [0.05, 0.7, 0] as [number, number, number], rot: [0, 0, 0] as [number, number, number], len: 0.55 },
        { pos: [0.25, 0.65, 0] as [number, number, number], rot: [0, 0, -0.15] as [number, number, number], len: 0.5 },
        { pos: [0.5, 0.2, 0] as [number, number, number], rot: [0, 0, -0.8] as [number, number, number], len: 0.35 },
      ].map((f, i) => (
        <group key={i} position={f.pos} rotation={f.rot}>
          <mesh material={mat}><capsuleGeometry args={[0.1, f.len, 8, 16]} /></mesh>
          <mesh material={outlineMat} scale={[1.12, 1.05, 1.12]}><capsuleGeometry args={[0.1, f.len, 8, 16]} /></mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Sparkle particles ── */
function Sparkles({ opacity }: { opacity: number }) {
  const ref = useRef<THREE.Points>(null);
  const count = 40;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 3 + 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    if (!pos) return;
    const arr = pos.array as Float32Array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 1.5 + i * 0.5) * 0.0015;
    }
    pos.needsUpdate = true;
    (ref.current.material as THREE.PointsMaterial).opacity = opacity * (0.5 + Math.sin(t * 2) * 0.3);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#67e8f9"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Main Laptop ── */
function Laptop({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const screen = useScreenTexture();
  const rimLightRef = useRef<THREE.PointLight>(null);
  const screenGlowRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Compute current state from progress
  const getCurrentState = (p: number): LaptopState => {
    const segment = p * (STATES.length - 1);
    const idx = Math.min(Math.floor(segment), STATES.length - 2);
    const t = segment - idx;
    // Smooth easing
    const eased = t * t * (3 - 2 * t);
    return lerpState(STATES[idx]!, STATES[idx + 1]!, eased);
  };

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const state = getCurrentState(progress);

    // Mouse follow
    const targetY = mouseRef.current.x * 0.12;
    const targetX = -mouseRef.current.y * 0.08 + state.bodyTilt;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;

    // Shake (frustration)
    if (state.shakeAmount > 0.001) {
      groupRef.current.position.x = Math.sin(t * 25) * state.shakeAmount;
      groupRef.current.position.y = Math.cos(t * 30) * state.shakeAmount * 0.5 - 0.15;
    } else {
      groupRef.current.position.x *= 0.9;
      groupRef.current.position.y += (-0.15 - groupRef.current.position.y) * 0.05;
    }

    // Gentle float
    groupRef.current.position.y += Math.sin(t * 0.8) * 0.02;

    // Update screen texture
    screen.draw(state, t);

    // Rim light
    if (rimLightRef.current) {
      rimLightRef.current.intensity = state.rimIntensity * 1.5;
    }
    if (screenGlowRef.current) {
      screenGlowRef.current.intensity = state.screenBrightness * 2;
      screenGlowRef.current.color.copy(state.screenColor).multiplyScalar(3);
    }
  });

  const state = getCurrentState(progress);

  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2a3050", roughness: 0.35, metalness: 0.7 }),
    []
  );
  const bezelMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#3a4060", roughness: 0.4, metalness: 0.5 }),
    []
  );
  const edgeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#5a6080", roughness: 0.3, metalness: 0.8 }),
    []
  );

  return (
    <>
      {/* Lighting for visibility */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={0.6} color="#e0e8ff" />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#67e8f9" />
      {/* Rim light from behind — makes edges pop against dark bg */}
      <pointLight ref={rimLightRef} position={[0, 0, -2]} intensity={0.5} color="#00E5FF" distance={8} />
      {/* Screen glow illuminating the body */}
      <pointLight ref={screenGlowRef} position={[0, 0.3, 0.6]} intensity={1} color="#00E5FF" distance={4} />
      {/* Underlight */}
      <pointLight position={[0, -1.5, 0.5]} intensity={0.3} color="#00E5FF" distance={5} />

      <group ref={groupRef} position={[0, -0.15, 0]}>
        {/* === Laptop Base === */}
        <mesh position={[0, -0.5, 0.35]} rotation={[-0.08, 0, 0]} material={bodyMat}>
          <boxGeometry args={[2.4, 0.1, 1.6]} />
        </mesh>
        {/* Base edge highlight */}
        <mesh position={[0, -0.44, 0.35]} rotation={[-0.08, 0, 0]} material={edgeMat}>
          <boxGeometry args={[2.42, 0.01, 1.62]} />
        </mesh>
        {/* Trackpad */}
        <mesh position={[0, -0.445, 0.65]} rotation={[-0.08, 0, 0]}>
          <planeGeometry args={[0.65, 0.4]} />
          <meshStandardMaterial color="#354060" roughness={0.5} metalness={0.5} />
        </mesh>

        {/* === Screen === */}
        <mesh position={[0, 0.35, -0.15]} rotation={[0.18, 0, 0]} material={bezelMat}>
          <boxGeometry args={[2.3, 1.55, 0.07]} />
        </mesh>
        {/* Screen edge highlight */}
        <mesh position={[0, 0.35, -0.11]} rotation={[0.18, 0, 0]} material={edgeMat}>
          <boxGeometry args={[2.32, 1.57, 0.005]} />
        </mesh>
        {/* Screen display */}
        {screen.texture && (
          <mesh position={[0, 0.37, -0.105]} rotation={[0.18, 0, 0]}>
            <planeGeometry args={[2.05, 1.3]} />
            <meshBasicMaterial map={screen.texture} />
          </mesh>
        )}
        {/* Screen glow halo */}
        <mesh position={[0, 0.37, -0.08]} rotation={[0.18, 0, 0]}>
          <planeGeometry args={[2.6, 1.8]} />
          <meshBasicMaterial
            color="#00E5FF"
            transparent
            opacity={state.screenBrightness * 0.04}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* === Hinge === */}
        <mesh position={[0, -0.22, -0.45]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 2.2, 12]} />
          <meshStandardMaterial color="#4a5070" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* === Hands === */}
        <Hand position={[-1.55, 0.1, 0.15]} side="left" scale={state.handScale} waveSpeed={state.handWaveSpeed} />
        <Hand position={[1.55, 0.25, 0.15]} side="right" scale={state.handScale} waveSpeed={state.handWaveSpeed} />

        {/* === Sparkles === */}
        <Sparkles opacity={state.sparkleOpacity} />

        {/* === Ground glow === */}
        <mesh position={[0, -0.6, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.8, 32]} />
          <meshBasicMaterial
            color="#00E5FF"
            transparent
            opacity={state.rimIntensity * 0.05}
          />
        </mesh>
      </group>
    </>
  );
}

/* ── Exported component ── */
export default function LaptopStoryScene({
  progress,
  className = "",
}: {
  progress: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.2, 3.8], fov: 38 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <Laptop progress={progress} />
      </Canvas>
    </div>
  );
}
