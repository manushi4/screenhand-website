"use client";

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════
   Interactive 3D Laptop — ScreenHand mascot
   • Drag to rotate (orbit controls)
   • Click screen → cycle terminal commands
   • Click hands → they react (wave burst / thumbs wiggle)
   • Hover → parts glow cyan
   ═══════════════════════════════════════════════════ */

const COMMAND_SEQUENCES = [
  [
    { text: "mcp@screenhand:~$ screenhand.sh", color: "#7ee787" },
    { text: "✓ Native bridge connected", color: "#00E5FF" },
    { text: "✓ Accessibility API ready", color: "#00E5FF" },
    { text: "✓ 82 MCP tools loaded", color: "#00FF88" },
    { text: "", color: "#000" },
    { text: "Ready. Click screen for more →", color: "#555" },
  ],
  [
    { text: 'mcp@screenhand:~$ click "Submit"', color: "#7ee787" },
    { text: "🎯 Located at (834, 456)", color: "#c9d1d9" },
    { text: "✓ Click successful", color: "#00FF88" },
    { text: "", color: "#000" },
    { text: "mcp@screenhand:~$ ocr", color: "#7ee787" },
    { text: '→ "Welcome back, Alex"', color: "#67e8f9" },
  ],
  [
    { text: "mcp@screenhand:~$ screenshot", color: "#7ee787" },
    { text: "📸 Captured 2560×1440", color: "#c9d1d9" },
    { text: "→ Found 23 interactive elements", color: "#67e8f9" },
    { text: "", color: "#000" },
    { text: 'mcp@screenhand:~$ type "Hello"', color: "#7ee787" },
    { text: "✓ Typed 5 chars at 40ms/char", color: "#00FF88" },
  ],
  [
    { text: "mcp@screenhand:~$ ui_tree", color: "#7ee787" },
    { text: "→ Window: Dashboard", color: "#67e8f9" },
    { text: "  → Button: Submit (834,456)", color: "#67e8f9" },
    { text: "  → Input: Search (200,100)", color: "#67e8f9" },
    { text: "  → Menu: File, Edit, View", color: "#67e8f9" },
    { text: "→ 47 elements mapped ✓", color: "#00FF88" },
  ],
];

/* ── Screen texture ── */
function useScreenTexture() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const initialized = useRef(false);

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

  const draw = (lines: { text: string; color: string }[], flash: boolean) => {
    ensureInit();
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;

    // Background
    ctx.fillStyle = flash ? "#0a2030" : "#0d1117";
    ctx.fillRect(0, 0, c.width, c.height);

    // Scanlines
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    for (let y = 0; y < c.height; y += 3) ctx.fillRect(0, y, c.width, 1);

    // Title bar
    ctx.fillStyle = "#161b22";
    ctx.fillRect(0, 0, c.width, 32);
    ["#FF5F57", "#FEBC2E", "#28C840"].forEach((col, i) => {
      ctx.beginPath();
      ctx.arc(18 + i * 20, 16, 5, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    });

    // Title
    ctx.font = "11px monospace";
    ctx.fillStyle = "#555";
    ctx.fillText("screenhand — terminal", 80, 19);

    // Lines
    ctx.font = "14px monospace";
    lines.forEach((line, i) => {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 14, 55 + i * 24);
    });

    // Blinking cursor
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      const lastLine = lines[lines.length - 1];
      if (lastLine) {
        const w = ctx.measureText(lastLine.text).width;
        ctx.fillStyle = "#00E5FF";
        ctx.fillRect(14 + w + 4, 42 + (lines.length - 1) * 24, 8, 15);
      }
    }

    if (textureRef.current) textureRef.current.needsUpdate = true;
  };

  return { texture: textureRef.current, draw, getTexture: () => { ensureInit(); return textureRef.current; } };
}

/* ── Interactive Cartoon Hand ── */
function CartoonHand({
  position,
  side,
  onClick,
}: {
  position: [number, number, number];
  side: "left" | "right";
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  // Smooth animation: track rotation targets and lerp toward them
  const rotTarget = useRef({ z: 0, x: 0 });
  const rotCurrent = useRef({ z: 0, x: 0 });
  const burstEnergy = useRef(0);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Smoothly decay burst energy
    burstEnergy.current = Math.max(0, burstEnergy.current - delta * 2.5);
    const burst = burstEnergy.current;

    if (side === "left") {
      // Smooth wave: fixed speed, burst only affects amplitude
      const amp = 0.25 + burst * 0.6;
      rotTarget.current.z = Math.sin(t * 2.2) * amp + 0.15;
      rotTarget.current.x = Math.cos(t * 1.4) * (0.08 + burst * 0.2);
    } else {
      // Smooth thumbs-up bob
      const amp = 0.04 + burst * 0.3;
      rotTarget.current.z = Math.sin(t * 0.9) * amp - 0.3;
      rotTarget.current.x = Math.sin(t * 1.2) * 0.03;
      groupRef.current.position.y = position[1] + Math.sin(t * 1.3) * 0.025 + burst * 0.1;
    }

    // Lerp current toward target for smoothness
    const lerpSpeed = 6 * delta;
    rotCurrent.current.z += (rotTarget.current.z - rotCurrent.current.z) * lerpSpeed;
    rotCurrent.current.x += (rotTarget.current.x - rotCurrent.current.x) * lerpSpeed;
    groupRef.current.rotation.z = rotCurrent.current.z;
    groupRef.current.rotation.x = rotCurrent.current.x;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    burstEnergy.current = 1;
    onClick();
  };

  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.25 }),
    []
  );
  const hoverMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#d0ffff", roughness: 0.2, emissive: "#00E5FF", emissiveIntensity: 0.15 }),
    []
  );
  const outlineMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#1a1a2e", roughness: 1, side: THREE.BackSide }),
    []
  );

  const activeMat = hovered ? hoverMat : mat;
  const flip = side === "left" ? 1 : -1;

  const handlers = {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; },
    onPointerOut: () => { setHovered(false); document.body.style.cursor = "none"; },
    onClick: handleClick,
  };

  if (side === "right") {
    // Thumbs up: palm, one thumb up, 3 curled fingers with z-spread
    return (
      <group ref={groupRef} position={position} scale={[flip * 0.3, 0.3, 0.3]} {...handlers}>
        {/* Palm */}
        <mesh material={activeMat}><sphereGeometry args={[0.42, 20, 20]} /></mesh>
        <mesh material={outlineMat} scale={[1.06, 1.06, 1.06]}><sphereGeometry args={[0.42, 20, 20]} /></mesh>
        {/* Thumb pointing up */}
        <group position={[0.05, 0.42, 0.05]} rotation={[0, 0, 0.08]}>
          <mesh material={activeMat}><capsuleGeometry args={[0.11, 0.55, 12, 16]} /></mesh>
          <mesh material={outlineMat} scale={[1.1, 1.04, 1.1]}><capsuleGeometry args={[0.11, 0.55, 12, 16]} /></mesh>
          {/* Thumb tip */}
          <mesh material={activeMat} position={[0, 0.35, 0]}><sphereGeometry args={[0.11, 12, 12]} /></mesh>
        </group>
        {/* 3 curled fingers — spread on z-axis */}
        {[-0.22, 0, 0.22].map((z, i) => (
          <group key={i} position={[0.32, -0.08, z]} rotation={[0, 0, -1.3]}>
            <mesh material={activeMat}><capsuleGeometry args={[0.08, 0.18, 10, 16]} /></mesh>
          </group>
        ))}
        {hovered && (
          <Html position={[0, 1.3, 0]} center>
            <div className="bg-black/80 text-cyan-glow text-xs px-2 py-1 rounded whitespace-nowrap font-mono pointer-events-none">
              Click me!
            </div>
          </Html>
        )}
      </group>
    );
  }

  // Waving hand: palm + 5 fingers clearly spread in both x AND z
  return (
    <group ref={groupRef} position={position} scale={[flip * 0.3, 0.3, 0.3]} {...handlers}>
      {/* Palm — slightly flattened */}
      <mesh material={activeMat} scale={[1, 1, 0.7]}>
        <sphereGeometry args={[0.48, 20, 20]} />
      </mesh>
      <mesh material={outlineMat} scale={[1.06, 1.06, 0.76]}>
        <sphereGeometry args={[0.48, 20, 20]} />
      </mesh>
      {/* 5 fingers — well separated in x and z, with fingertip spheres */}
      {[
        { x: -0.38, y: 0.52, z: -0.12, rotZ: 0.4,  len: 0.38, r: 0.075 }, // pinky
        { x: -0.17, y: 0.65, z: -0.06, rotZ: 0.18, len: 0.48, r: 0.08 },  // ring
        { x: 0.04,  y: 0.72, z: 0,     rotZ: 0,    len: 0.52, r: 0.085 }, // middle
        { x: 0.26,  y: 0.65, z: 0.06,  rotZ: -0.18, len: 0.48, r: 0.08 }, // index
        { x: 0.48,  y: 0.22, z: 0.12,  rotZ: -0.75, len: 0.35, r: 0.09 }, // thumb
      ].map((f, i) => (
        <group key={i} position={[f.x, f.y, f.z]} rotation={[0, 0, f.rotZ]}>
          {/* Finger shaft */}
          <mesh material={activeMat}>
            <capsuleGeometry args={[f.r, f.len, 12, 16]} />
          </mesh>
          <mesh material={outlineMat} scale={[1.1, 1.03, 1.1]}>
            <capsuleGeometry args={[f.r, f.len, 12, 16]} />
          </mesh>
          {/* Rounded fingertip */}
          <mesh material={activeMat} position={[0, f.len / 2 + f.r * 0.5, 0]}>
            <sphereGeometry args={[f.r, 12, 12]} />
          </mesh>
        </group>
      ))}
      {hovered && (
        <Html position={[0, 1.6, 0]} center>
          <div className="bg-black/80 text-cyan-glow text-xs px-2 py-1 rounded whitespace-nowrap font-mono pointer-events-none">
            Click me!
          </div>
        </Html>
      )}
    </group>
  );
}

/* ── Sparkles ── */
function Sparkles() {
  const ref = useRef<THREE.Points>(null);
  const count = 35;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 3;
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
    for (let i = 0; i < count; i++) arr[i * 3 + 1] += Math.sin(t * 2 + i) * 0.001;
    pos.needsUpdate = true;
    (ref.current.material as THREE.PointsMaterial).opacity = 0.4 + Math.sin(t * 3) * 0.3;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#67e8f9" transparent opacity={0.6} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ── Main Laptop ── */
function LaptopScene() {
  const groupRef = useRef<THREE.Group>(null);
  const screen = useScreenTexture();
  const [cmdIndex, setCmdIndex] = useState(0);
  const [screenFlash, setScreenFlash] = useState(false);
  const [screenHovered, setScreenHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Draw screen every frame
  useFrame(() => {
    screen.draw(COMMAND_SEQUENCES[cmdIndex]!, screenFlash);

    // Gentle idle float
    if (groupRef.current) {
      const t = Date.now() * 0.001;
      groupRef.current.position.y = -0.2 + Math.sin(t * 0.8) * 0.03;
    }
  });

  const handleScreenClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setScreenFlash(true);
    setTimeout(() => setScreenFlash(false), 150);
    setCmdIndex((prev) => (prev + 1) % COMMAND_SEQUENCES.length);
    setClickCount((c) => c + 1);
  }, []);

  const handleHandClick = useCallback(() => {
    setClickCount((c) => c + 1);
  }, []);

  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2a2a40", roughness: 0.35, metalness: 0.7 }),
    []
  );
  const bezelMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#35354d", roughness: 0.4, metalness: 0.5 }),
    []
  );
  const screenBorderMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#00E5FF", roughness: 0.3, metalness: 0.8, emissive: "#00E5FF", emissiveIntensity: 0.1 }),
    []
  );

  const tex = screen.getTexture();

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Laptop base */}
      <mesh position={[0, -0.55, 0.3]} rotation={[-0.1, 0, 0]} material={bodyMat}>
        <boxGeometry args={[2.4, 0.1, 1.5]} />
      </mesh>
      {/* Base edge glow */}
      <mesh position={[0, -0.49, 0.3]} rotation={[-0.1, 0, 0]} material={screenBorderMat}>
        <boxGeometry args={[2.42, 0.005, 1.52]} />
      </mesh>

      {/* Screen bezel */}
      <mesh position={[0, 0.35, -0.15]} rotation={[0.2, 0, 0]} material={bezelMat}>
        <boxGeometry args={[2.3, 1.5, 0.06]} />
      </mesh>
      {/* Screen border glow */}
      <mesh position={[0, 0.35, -0.118]} rotation={[0.2, 0, 0]} material={screenBorderMat}>
        <boxGeometry args={[2.12, 1.35, 0.005]} />
      </mesh>

      {/* Clickable Screen */}
      <mesh
        position={[0, 0.37, -0.11]}
        rotation={[0.2, 0, 0]}
        onClick={handleScreenClick}
        onPointerOver={(e) => { e.stopPropagation(); setScreenHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setScreenHovered(false); document.body.style.cursor = "none"; }}
      >
        <planeGeometry args={[2.05, 1.28]} />
        {tex ? (
          <meshBasicMaterial map={tex} />
        ) : (
          <meshBasicMaterial color="#0d1117" />
        )}
      </mesh>

      {/* Screen hover glow */}
      {screenHovered && (
        <mesh position={[0, 0.37, -0.09]} rotation={[0.2, 0, 0]}>
          <planeGeometry args={[2.1, 1.33]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.06} />
        </mesh>
      )}

      {/* Screen tooltip */}
      {screenHovered && (
        <Html position={[0, 1.3, -0.15]} center>
          <div className="bg-black/80 text-cyan-glow text-xs px-2 py-1 rounded whitespace-nowrap font-mono pointer-events-none">
            ▶ Click to run next command
          </div>
        </Html>
      )}

      {/* Trackpad */}
      <mesh position={[0, -0.5, 0.55]} rotation={[-1.47, 0, 0]} material={bodyMat}>
        <planeGeometry args={[0.6, 0.35]} />
      </mesh>

      {/* Hinge */}
      <mesh position={[0, -0.25, -0.42]}>
        <cylinderGeometry args={[0.035, 0.035, 2.2, 12]} />
        <meshStandardMaterial color="#4a5070" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Hands */}
      <CartoonHand position={[-1.6, 0.1, 0.1]} side="left" onClick={handleHandClick} />
      <CartoonHand position={[1.6, 0.3, 0.1]} side="right" onClick={handleHandClick} />

      {/* Sparkles */}
      <Sparkles />

      {/* Ground glow */}
      <mesh position={[0, -0.65, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 32]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.05} />
      </mesh>

      {/* Interaction counter */}
      {clickCount > 0 && (
        <Html position={[0, -0.85, 0.3]} center>
          <div className="text-white/30 text-[10px] font-mono pointer-events-none">
            {clickCount} interaction{clickCount !== 1 ? "s" : ""}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ── Exported Component ── */
export default function ParticleHand({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      {/* Drag hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-white/20 text-[11px] font-mono pointer-events-none flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4M6.34 6.34l2.83 2.83m5.66 5.66l2.83 2.83M6.34 17.66l2.83-2.83m5.66-5.66l2.83-2.83" />
        </svg>
        Drag to rotate · Click to interact
      </div>

      <Canvas
        camera={{ position: [0, 0.3, 3.8], fov: 38 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={0.7} color="#e0e8ff" />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#67e8f9" />
        {/* Rim light for visibility against dark bg */}
        <pointLight position={[0, 0, -2.5]} intensity={1.2} color="#00E5FF" distance={8} />
        {/* Screen glow */}
        <pointLight position={[0, 0.3, 0.8]} intensity={0.8} color="#00E5FF" distance={4} />
        {/* Under glow */}
        <pointLight position={[0, -1.5, 0.5]} intensity={0.4} color="#00E5FF" distance={5} />

        <LaptopScene />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2.5}
          maxDistance={6}
          minPolarAngle={Math.PI * 0.25}
          maxPolarAngle={Math.PI * 0.65}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
