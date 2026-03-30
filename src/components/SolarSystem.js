"use client";
import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Stars, Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import GlobalFooter from '@/components/GlobalFooter';

const SERVICES = [
  { id: 'seo', title: 'ADVANCED SEO', subtitle: 'Search Engine Optimisation Architecture', color: '#ffffff', textureUrl: '/1.jpg', link: '/seo-services', ring: true },
  { id: 'aeo', title: 'AEO SYSTEMS', subtitle: 'Answer Engine Optimisation for AI', color: '#ffffff', textureUrl: '/2.jpg', link: '/aeo-services', ring: false },
  { id: 'web', title: 'WEB DEV', subtitle: 'High-Converting 3D Web Design', color: '#ffffff', textureUrl: '/3.jpg', link: '/web-development', ring: true },
  { id: 'ads', title: 'META ADS', subtitle: 'Predictable Revenue Scaling', color: '#ffffff', textureUrl: '/4.jpg', link: '/meta-ads', ring: false },
  { id: 'smma', title: 'SOCIAL MEDIA', subtitle: 'Organic Brand Growth & Authority', color: '#ffffff', textureUrl: '/5.jpg', link: '/social-media-marketing', ring: true },
];

function Planet({ index, data }) {
  const scroll = useScroll();
  const groupRef = useRef(); 
  const spinRef = useRef();  
  
  const texture = useTexture(data.textureUrl);
  // Optional: If you want the textures to look even more realistic, you can tell Three.js to encode them properly
  texture.colorSpace = THREE.SRGBColorSpace;
  
  const vec = useMemo(() => new THREE.Vector3(), []); 
  const rotationSpeedY = useMemo(() => Math.random() * 0.08 + 0.02, []); // Even slower, heavier realism
  const rotationSpeedX = useMemo(() => Math.random() * 0.05 + 0.01, []);

  const { width } = useThree().size;
  const isDesktop = width > 1024;
  const isTablet = width > 768 && width <= 1024;
  
  const activeScale = isDesktop ? 10 : (isTablet ? 7 : 5); 
  const activeY = isDesktop ? -8.5 : (isTablet ? -5.5 : -3.8);

  useFrame((state, delta) => {
    if (!groupRef.current || !spinRef.current || !scroll) return;

    spinRef.current.rotation.y += delta * rotationSpeedY;
    spinRef.current.rotation.x += delta * rotationSpeedX;

    const totalPlanets = SERVICES.length - 1;
    const currentScroll = scroll.offset * (totalPlanets + 0.5); 
    const relativeScroll = currentScroll - index; 
    
    const targetX = -relativeScroll * 14; 
    const targetZ = -Math.abs(relativeScroll) * 10; 
    const targetY = activeY - (Math.abs(relativeScroll) * 2); 
    const targetScale = Math.max(0.1, activeScale - (Math.abs(relativeScroll) * 2)); 
    
    const targetRotY = relativeScroll * 0.6; 

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 5, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 5, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 5, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 5, delta);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 5, delta));
  });

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
        <group ref={spinRef}>
          
          {/* REALISTIC PLANET MATERIAL */}
          <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial 
              map={texture} 
              metalness={0.1} 
              roughness={0.9} 
            />
          </mesh>

          {/* TIGHTER, DARKER ATMOSPHERE */}
          <mesh scale={1.03}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>

          {/* SHARP, MINIMALIST RINGS */}
          {data.ring && (
            <mesh rotation={[Math.PI / 2.5, 0, 0]}>
              <torusGeometry args={[1.5, 0.005, 32, 100]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
            </mesh>
          )}

        </group>
      </Float>
    </group>
  );
}

function SceneController({ onIndexChange, onReachEnd }) {
  const scroll = useScroll();
  const lastIndex = useRef(-1);
  const lastEnd = useRef(false);

  useFrame(() => {
    if (!scroll) return;

    const totalPlanets = SERVICES.length - 1; 
    const currentScroll = scroll.offset * (totalPlanets + 0.5); 
    const clampedScroll = Math.max(0, Math.min(currentScroll, totalPlanets)); 

    const currentActive = Math.round(clampedScroll);
    if (currentActive !== lastIndex.current) {
      lastIndex.current = currentActive;
      setTimeout(() => onIndexChange(currentActive), 0); 
    }

    const isAtEnd = currentScroll > totalPlanets + 0.1;
    if (isAtEnd !== lastEnd.current) {
      lastEnd.current = isAtEnd;
      setTimeout(() => onReachEnd(isAtEnd), 0);
    }
  });

  return null; 
}

export default function SolarSystemCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFooter, setShowFooter] = useState(false);

  const activeService = SERVICES[activeIndex] || SERVICES[0];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          {/* PURE OLED BLACK BACKGROUND */}
          <color attach="background" args={['#000000']} />
          
          {/* REALISTIC DEEP-SPACE LIGHTING */}
          {/* Very low ambient light creates pitch-black shadows on the dark side of the planets */}
          <ambientLight intensity={0.15} /> 
          {/* Extremely bright, directional "Sun" light creates harsh realism */}
          <directionalLight position={[8, 5, 2]} intensity={5} color="#ffffff" />
          
          <Stars radius={150} depth={50} count={4000} factor={4} saturation={0} fade speed={0.5} />

          <Suspense fallback={null}>
            <ScrollControls pages={SERVICES.length + 0.5} damping={0.25} distance={1.5}>
              <SceneController onIndexChange={setActiveIndex} onReachEnd={setShowFooter} />
              
              {SERVICES.map((service, index) => (
                <Planet key={service.id} index={index} data={service} />
              ))}
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>

      <div className={`absolute inset-0 pointer-events-none z-10 flex flex-col justify-between pt-32 pb-20 px-4 md:px-16 transition-opacity duration-700 ${showFooter ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* TOP STATUS INDICATOR (Nothing Phone Vibe) */}
        <div className="text-center mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
             <p className="font-tech text-white text-xs md:text-sm font-bold tracking-[0.4em] uppercase">SYSTEM.ACTIVE</p>
          </div>
          <p className="font-tech text-gray-500 text-[10px] md:text-xs uppercase tracking-[0.3em]">Axis_Scroll_Engaged</p>
        </div>

        <div className="absolute top-[40%] md:top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4">
          
          {/* DEEP BLACK GLASSMORPHISM */}
          <div className="flex flex-col items-center justify-center p-8 md:p-14 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-all duration-500">
            
            {/* NOTHING PHONE DOTTED FONT */}
            <h2 className="font-nothing text-4xl md:text-6xl lg:text-7xl text-white tracking-widest mb-4 transition-all duration-300 text-center uppercase" style={{ textShadow: `0 0 20px rgba(255,255,255,0.2)` }}>
              {activeService.title}
            </h2>
            
            {/* TECHNICAL MONOSPACE FONT */}
            <p className="font-tech text-xs md:text-sm text-gray-400 tracking-[0.2em] uppercase mb-10 transition-all duration-300 text-center max-w-xl">
              [ {activeService.subtitle} ]
            </p>
            
            {/* SHARP, MINIMALIST BUTTON */}
            <Link href={activeService.link} className="pointer-events-auto inline-flex relative items-center justify-center group bg-transparent border border-white/40 hover:bg-white hover:text-black text-white px-10 py-4 font-tech font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300">
              <span className="relative z-10 flex items-center gap-4">
                INITIATE
                <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
            </Link>

          </div>
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 w-full z-50 pointer-events-auto transition-transform duration-700 ease-in-out ${showFooter ? 'translate-y-0' : 'translate-y-full'}`}>
        <GlobalFooter isHomeOverlay={true} />
      </div>

      {/* CSS INJECTIONS: Nothing Phone Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Space+Mono:wght@400;700&display=swap');
        
        .font-nothing { 
          font-family: 'DotGothic16', sans-serif; 
        }
        .font-tech {
          font-family: 'Space Mono', monospace;
        }
      `}} />
    </div>
  );
}