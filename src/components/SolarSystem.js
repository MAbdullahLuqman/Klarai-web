"use client";
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, Stars, Float, Scroll } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import GlobalFooter from '@/components/GlobalFooter';

const SERVICES = [
  { id: 'seo', title: 'ADVANCED SEO', subtitle: 'Search Engine Optimisation Architecture', color: '#f87171', link: '/seo-services', ring: true },
  { id: 'aeo', title: 'AEO SYSTEMS', subtitle: 'Answer Engine Optimisation for AI', color: '#60a5fa', link: '/aeo-services', ring: false },
  { id: 'web', title: 'WEB DEV', subtitle: 'High-Converting 3D Web Design', color: '#34d399', link: '/web-development', ring: true },
  { id: 'ads', title: 'META ADS', subtitle: 'Predictable Revenue Scaling', color: '#a78bfa', link: '/meta-ads', ring: false },
  { id: 'smma', title: 'SOCIAL MEDIA', subtitle: 'Organic Brand Growth & Authority', color: '#fbbf24', link: '/social-media-marketing', ring: true },
];

const PLANET_SPACING = 12;

function Planet({ index, data }) {
  const meshRef = useRef();
  const xPos = index * PLANET_SPACING;
  const rotationSpeed = useMemo(() => Math.random() * 0.2 + 0.1, []);

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * rotationSpeed;
    meshRef.current.rotation.x += delta * (rotationSpeed * 0.2);

    const worldPosition = new THREE.Vector3();
    meshRef.current.getWorldPosition(worldPosition);
    const distFromCenter = Math.abs(worldPosition.x);
    
    const targetZ = -distFromCenter * 1.2; 
    const targetScale = Math.max(0.5, 2.2 - distFromCenter * 0.15);
    
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, 6, delta);
    meshRef.current.scale.setScalar(THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 6, delta));
  });

  return (
    <group position={[xPos, 0, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial color={data.color} metalness={0.6} roughness={0.4} />
          
          <mesh scale={1.15}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color={data.color} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>

          <mesh scale={1.02}>
            <icosahedronGeometry args={[1, 2]} />
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} blending={THREE.AdditiveBlending} />
          </mesh>

          {data.ring && (
            <mesh rotation={[Math.PI / 2.5, 0, 0]}>
              <torusGeometry args={[1.8, 0.02, 16, 100]} />
              <meshBasicMaterial color={data.color} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
            </mesh>
          )}
        </mesh>
      </Float>
    </group>
  );
}

// Passed uiRef down to control the text fade
function Carousel({ setActiveIndex, uiRef }) {
  const scroll = useScroll();
  const groupRef = useRef();

  useFrame((state, delta) => {
    // 1. Calculate precise scroll depth (adding 0.5 pages for the footer space)
    const totalScrollPages = SERVICES.length + 0.5 - 1; 
    const currentPage = scroll.offset * totalScrollPages; 
    
    // 2. Clamp horizontal panning so the planets stop moving when we hit the last one
    const clampedPage = Math.min(currentPage, SERVICES.length - 1);
    const targetX = -(clampedPage * PLANET_SPACING);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 5, delta);

    const currentActive = Math.round(clampedPage);
    setActiveIndex(currentActive);

    // 3. Smoothly fade out the central text as the user scrolls down into the footer zone
    if (uiRef.current) {
      const fadeStart = SERVICES.length - 1; // Start fading after the last planet
      const overScroll = Math.max(0, currentPage - fadeStart); 
      const opacity = 1 - (overScroll * 2.5); // Multiplier makes it fade out quickly
      uiRef.current.style.opacity = Math.max(0, opacity);
      
      // Optional: Add a slight upward drift to the text as it fades
      uiRef.current.style.transform = `translateY(-${overScroll * 50}px)`;
    }
  });

  return (
    <group ref={groupRef}>
      {SERVICES.map((service, index) => (
        <Planet key={service.id} index={index} data={service} />
      ))}
    </group>
  );
}

export default function SolarSystemCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const uiRef = useRef(); // Tracks the HTML overlay

  const activeService = SERVICES[activeIndex];
  const prevService = SERVICES[activeIndex - 1];
  const nextService = SERVICES[activeIndex + 1];

  return (
    <div className="relative w-full h-screen bg-[#030303] overflow-hidden">
      
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} className="z-0">
        <color attach="background" args={['#030303']} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={1} color={activeService.color} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

        {/* Added 0.5 extra pages for the footer to live in */}
        <ScrollControls pages={SERVICES.length + 0.5} damping={0.25} distance={1.5}>
          <Carousel setActiveIndex={setActiveIndex} uiRef={uiRef} />
          
          {/* THE NEW FOOTER INJECTION */}
          <Scroll html style={{ width: '100%' }}>
            {/* This math places the footer at the absolute, exact bottom edge 
              of the invisible 3D scroll container.
            */}
            <div style={{ position: 'absolute', top: `${(SERVICES.length + 0.5) * 100}vh`, width: '100%', transform: 'translateY(-100%)' }}>
              <GlobalFooter isHomeOverlay={true} />
            </div>
          </Scroll>

        </ScrollControls>
      </Canvas>

      {/* Attached uiRef to this wrapper so it can fade out smoothly */}
      <div ref={uiRef} className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between pt-32 pb-20 px-8 md:px-16 transition-opacity duration-75">
        
        <div className="text-center animate-fade-in">
          <p className="text-[#3b82f6] text-sm font-bold tracking-[0.3em] uppercase mb-2">Our Ecosystem</p>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Scroll to explore dimensions</p>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-2xl">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter mb-4" style={{ textShadow: `0 0 40px ${activeService.color}40` }}>
            {activeService.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-400 font-medium tracking-wide mb-10">
            {activeService.subtitle}
          </p>
          
          <div className="pointer-events-auto">
            <Link href={activeService.link} className="inline-block relative overflow-hidden group bg-white/5 border border-white/20 hover:border-white/60 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all backdrop-blur-md">
              <span className="relative z-10 flex items-center gap-3">
                Explore Service
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            </Link>
          </div>
        </div>

        {prevService && (
          <div className="absolute top-1/2 left-8 md:left-16 -translate-y-1/2 opacity-30 hidden md:block transition-all duration-500">
            <p className="text-xs text-gray-500 font-bold tracking-[0.2em] uppercase mb-1">Previous</p>
            <p className="text-lg text-white font-bold tracking-widest uppercase writing-vertical-lr rotate-180">{prevService.title}</p>
          </div>
        )}

        {nextService && (
          <div className="absolute top-1/2 right-8 md:right-16 -translate-y-1/2 opacity-30 hidden md:block transition-all duration-500 text-right">
            <p className="text-xs text-gray-500 font-bold tracking-[0.2em] uppercase mb-1">Next</p>
            <p className="text-lg text-white font-bold tracking-widest uppercase writing-vertical-rl">{nextService.title}</p>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
      `}} />
    </div>
  );
}