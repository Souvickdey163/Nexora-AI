"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { SceneFallback, STEPS } from "./SceneFallback";

function ParticleField() {
  const count = 120;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const posArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#38bdf8"),
      new THREE.Color("#818cf8"),
      new THREE.Color("#c084fc"),
      new THREE.Color("#34d399"),
    ];

    for (let i = 0; i < count; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 16;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 8;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }
    return [posArray, colorArray];
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.05;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function PathwayNode({
  position,
  label,
  stepNumber,
  color,
}: {
  position: [number, number, number];
  label: string;
  stepNumber: string;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.6;
      meshRef.current.rotation.x = Math.sin(time * 0.4) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = time * -0.8;
      ringRef.current.rotation.x = Math.cos(time * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.9} position={position}>
      {/* Outer Orbit Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.95, 0.015, 16, 64]} />
        <meshBasicMaterial color={hovered ? "#38bdf8" : color} transparent opacity={0.6} />
      </mesh>

      {/* Main Glowing Node Octahedron */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.35 : 1}
      >
        <octahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={hovered ? "#38bdf8" : color}
          emissiveIntensity={hovered ? 0.9 : 0.4}
          roughness={0.15}
          metalness={0.85}
          wireframe={!hovered}
        />
      </mesh>

      {/* Step Badge HTML Label */}
      <Html position={[0, 1.25, 0]} center distanceFactor={10} zIndexRange={[0, 10]}>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 text-sky-400 font-extrabold text-[11px] tracking-wider border border-sky-500/40 shadow-lg shadow-sky-500/20 backdrop-blur-md pointer-events-none transition-transform duration-200">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span>{stepNumber}</span>
        </div>
      </Html>

      {/* Title Badge HTML Label */}
      <Html position={[0, -1.25, 0]} center distanceFactor={10} zIndexRange={[0, 10]}>
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/95 text-white font-bold text-xs tracking-tight border border-slate-700/80 shadow-xl backdrop-blur-md pointer-events-none whitespace-nowrap">
          {label}
        </div>
      </Html>
    </Float>
  );
}

function ConnectionBeam({
  start,
  end,
  beamColor = "#38bdf8",
}: {
  start: [number, number, number];
  end: [number, number, number];
  beamColor?: string;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);

  const lineObject = useMemo(() => {
    const points = [startVec, endVec];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: beamColor,
      transparent: true,
      opacity: 0.45,
    });
    return new THREE.Line(lineGeometry, lineMaterial);
  }, [startVec, endVec, beamColor]);

  useFrame((state) => {
    if (pulseRef.current) {
      const progress = (state.clock.elapsedTime * 0.4) % 1;
      pulseRef.current.position.lerpVectors(startVec, endVec, progress);
    }
  });

  return (
    <>
      <primitive object={lineObject} />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.9} />
      </mesh>
    </>
  );
}

function Scene() {
  const nodes: { pos: [number, number, number]; title: string; step: string; color: string }[] = [
    { pos: [-4.2, 0.5, 0], title: "Build Profile", step: "STEP 01", color: "#38bdf8" },
    { pos: [-1.4, -0.5, 0], title: "Skill Analysis", step: "STEP 02", color: "#818cf8" },
    { pos: [1.4, 0.5, 0], title: "AI Roadmap", step: "STEP 03", color: "#c084fc" },
    { pos: [4.2, -0.5, 0], title: "Track Growth", step: "STEP 04", color: "#34d399" },
  ];

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={2.0} color="#38bdf8" />
      <pointLight position={[-10, -10, -10]} intensity={1.2} color="#c084fc" />
      <directionalLight position={[0, 10, 5]} intensity={0.8} />

      <ParticleField />

      {nodes.map((node) => (
        <PathwayNode
          key={node.step}
          position={node.pos}
          label={node.title}
          stepNumber={node.step}
          color={node.color}
        />
      ))}

      <ConnectionBeam start={[-4.2, 0.5, 0]} end={[-1.4, -0.5, 0]} beamColor="#38bdf8" />
      <ConnectionBeam start={[-1.4, -0.5, 0]} end={[1.4, 0.5, 0]} beamColor="#818cf8" />
      <ConnectionBeam start={[1.4, 0.5, 0]} end={[4.2, -0.5, 0]} beamColor="#c084fc" />
    </>
  );
}

export function CareerJourney3D() {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return <SceneFallback />;
  }

  const borderColors = ["border-t-sky-500", "border-t-indigo-500", "border-t-purple-500", "border-t-emerald-500"];
  const badgeColors = [
    "bg-sky-500/10 text-sky-500 dark:text-sky-400",
    "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400",
    "bg-purple-500/10 text-purple-500 dark:text-purple-400",
    "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
  ];

  return (
    <div className="w-full space-y-8">
      {/* 3D Canvas Viewport Container */}
      <div className="relative z-0 isolate w-full h-[380px] md:h-[450px] rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800/80 overflow-hidden shadow-2xl shadow-sky-500/10 group">
        {/* Glow Accent Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 via-indigo-500/10 to-purple-500/10 opacity-70 pointer-events-none" />

        <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 text-xs font-semibold text-sky-400 bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-sky-500/30 shadow-md">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          <span>Interactive 3D Career Pathway (Hover to inspect nodes)</span>
        </div>

        <Suspense fallback={<SceneFallback />}>
          <Canvas>
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      {/* Synchronized Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 border-t-2 ${borderColors[idx % borderColors.length]} shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-extrabold tracking-wider px-2.5 py-1 rounded-full ${badgeColors[idx % badgeColors.length]}`}>
                    {step.number}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                  {step.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Progress bar line */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span>Phase 0{idx + 1}</span>
                <span className="text-sky-500 font-bold">100% Ready</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
