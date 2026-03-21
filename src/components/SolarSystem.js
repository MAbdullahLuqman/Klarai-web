"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Stars, ScrollControls, useScroll, Html, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

const SERVICES_DATA = [
  {
    id: "aeo", position: [3.5, 0.5, -30], size: 1.5, color: "#8b5cf6", speed: 0.01, label: "AEO",
    title: "Answer Engine Optimization",
    teaser: "Click to explore AEO engineering.",
    extendedDescription: "In the era of Generative AI, traditional search is dying. We structure your brand's data so that when users ask ChatGPT, Gemini, or Claude questions about your industry, your business is cited as the definitive answer."
  },
  {
    id: "seo", position: [-3.5, -0.5, -60], size: 1.8, color: "#3b82f6", speed: 0.008, label: "SEO",
    title: "Search Engine Optimization",
    teaser: "Click to explore organic dominance.",
    extendedDescription: "Rank #1 on Google using data-backed regression models and intent-based keyword architecture. We engineer your site's content to mathematically outperform competitors in search algorithms."
  },
  {
    id: "webdev", position: [3.5, 1, -90], size: 1.2, color: "#10b981", speed: 0.02, label: "WEB",
    title: "Web Development",
    teaser: "Click to explore 3D web architecture.",
    extendedDescription: "We build high-performance, interactive 3D web experiences using Next.js and Three.js. Your website should be an immersive ecosystem that converts traffic into high-ticket clients."
  },
  {
    id: "performance", position: [-3.5, -1, -120], size: 2, color: "#f97316", speed: 0.005, label: "ADS",
    title: "Performance Marketing",
    teaser: "Click to explore paid scaling.",
    extendedDescription: "Data-backed paid advertising campaigns built to maximize ROI. We use advanced tracking and algorithmic bidding strategies to scale your revenue predictably."
  },
  {
    id: "smma", position: [3.5, 0, -150], size: 1.6, color: "#ec4899", speed: 0.012, label: "SMMA",
    title: "Social Media Marketing",
    teaser: "Click to explore brand authority.",
    extendedDescription: "Viral content creation and community management. We engineer attention, transforming your social channels into powerful sales funnels."
  }
];

function Planet({ data, onPlanetClick }) {
  const groupRef = useRef();
  const planetRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    groupRef.current.rotation.y += data.speed;
    const targetScale = hovered ? 1.05 : 1;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1));
  });

  const isRightSide = data.position[0] > 0;
  const htmlXOffset = isRightSide ? -(data.size + 1.2) : (data.size + 1.2);

  return (
    <group 
      position={data.position} 
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation(); 
        if (typeof onPlanetClick === 'function') onPlanetClick(data);
      }}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. SOLID PLANET BODY */}
      <Sphere ref={planetRef} args={[data.size, 64, 64]}>
        <meshPhysicalMaterial 
          color={data.color} 
          metalness={0.2} 
          roughness={0.6} 
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          emissive={data.color}
          emissiveIntensity={hovered ? 0.4 : 0.05}
        />
      </Sphere>

      {/* 2. ATMOSPHERIC HALO */}
      <Sphere args={[data.size * 1.05, 32, 32]}>
        <meshBasicMaterial 
          color={data.color}
          transparent={true}
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* 3D TEXT ON PLANET */}
      <Text position={[0, 0, data.size + 0.06]} fontSize={data.size * 0.4} color="white" fontWeight="bold" anchorX="center" anchorY="middle">
        {data.label}
      </Text>
      <Text position={[0, 0, -(data.size + 0.06)]} rotation={[0, Math.PI, 0]} fontSize={data.size * 0.4} color="white" fontWeight="bold" anchorX="center" anchorY="middle">
        {data.label}
      </Text>
      
      {/* HTML INFO BOX */}
      <Html distanceFactor={15} position={[htmlXOffset, 0, 0]} center zIndexRange={[100, 0]}>
        <div 
          className="text-white w-64 md:w-72 bg-black/50 p-5 md:p-6 rounded-2xl backdrop-blur-xl border border-white/10 transition-colors hover:bg-black/70 hover:border-white/30 cursor-pointer shadow-2xl pointer-events-auto"
          onClick={(e) => {
             e.stopPropagation(); 
             if (typeof onPlanetClick === 'function') onPlanetClick(data);
          }}
        >
          <h2 className="text-lg md:text-xl font-bold mb-2 tracking-wide text-white pointer-events-none drop-shadow-md">{data.title}</h2>
          <p className="text-xs md:text-sm text-gray-300 pointer-events-none">{data.teaser}</p>
        </div>
      </Html>
    </group>
  );
}

function CameraFlyer() {
  const scroll = useScroll(); 
  useFrame((state) => {
    const targetZ = 10 - scroll.offset * 190; 
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
  });
  return null;
}

export default function SolarSystem({ onPlanetClick }) {
  return (
    <div className="absolute inset-0 h-screen w-full bg-[#030303]">
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={150} color="#ffedd5" distance={300} decay={1.5} /> 
        <Stars radius={100} depth={50} count={8000} factor={3} saturation={0.5} fade speed={0.5} />

        {/* Reduced pages from 15 to 11 to increase the scroll speed */}
        <ScrollControls pages={11} damping={0.2}>
          
          <group position={[0, 0, 0]}>
            {/* Inner burning core - Changed from pure white to a deep solar yellow */}
            <Sphere args={[2.8, 64, 64]}>
              <meshBasicMaterial color="#ffb703" />
            </Sphere>
            
            {/* Primary Corona - Thickened slightly for realism */}
            <Sphere args={[3.2, 64, 64]}>
              <meshBasicMaterial 
                color="#ffaa00" 
                transparent={true} 
                opacity={0.8} 
                blending={THREE.AdditiveBlending} 
                depthWrite={false}
              />
            </Sphere>

            {/* Outer Atmospheric Glow */}
            <Sphere args={[4.5, 32, 32]}>
              <meshBasicMaterial 
                color="#ff4400" 
                transparent={true} 
                opacity={0.15} 
                blending={THREE.AdditiveBlending} 
                depthWrite={false}
              />
            </Sphere>

            <Html distanceFactor={20} position={[0, 4.5, 0]} center>
              <div className="text-center pointer-events-none w-96 mt-4">
                {/* Removed the KLARAI heading and styled the Growth Engine text to stand on its own */}
                <p className="text-xl md:text-2xl font-bold text-orange-100 tracking-[0.3em] uppercase drop-shadow-[0_0_15px_rgba(255,170,0,0.8)]">
                  AI Growth Engine
                </p>
              </div>
            </Html>
          </group>

          {SERVICES_DATA.map((service) => (
            <Planet 
              key={service.id} 
              data={service} 
              onPlanetClick={onPlanetClick} 
            />
          ))}

          <CameraFlyer />
        </ScrollControls>
      </Canvas>
    </div>
  );
}