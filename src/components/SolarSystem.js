"use client";
import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Stars, Float, useTexture, Scroll } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import GlobalFooter from '@/components/GlobalFooter';

const SERVICES = [
  { id: 'seo', title: 'ADVANCED SEO', subtitle: 'Search Engine Optimisation Architecture', color: '#ffffff', textureUrl: '/1.jpg', link: '/seo-services', ring: true },
  { id: 'aeo', title: 'AEO SYSTEMS', subtitle: 'Answer Engine Optimisation for AI', color: '#60a5fa', textureUrl: '/2.jpg', link: '/aeo-services', ring: false },
  { id: 'web', title: 'WEB DEV', subtitle: 'High-Converting 3D Web Design', color: '#34d399', textureUrl: '/3.jpg', link: '/web-development', ring: true },
  { id: 'ads', title: 'META ADS', subtitle: 'Predictable Revenue Scaling', color: '#a78bfa', textureUrl: '/4.jpg', link: '/meta-ads', ring: false },
  { id: 'smma', title: 'SOCIAL MEDIA', subtitle: 'Organic Brand Growth & Authority', color: '#fbbf24', textureUrl: '/5.jpg', link: '/social-media-marketing', ring: true },
];

function ThemeController({ isLightMode }) {
  const { scene } = useThree();
  const targetBg = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    targetBg.set(isLightMode ? '#ffffff' : '#000000');
    if (!scene.background) scene.background = new THREE.Color('#000000');
    scene.background.lerp(targetBg, 4 * delta); 
  });

  return null;
}

function Planet({ index, data, isLightMode }) {
  const scroll = useScroll();
  const groupRef = useRef(); 
  const spinRef = useRef();  
  
  const wireRef = useRef();
  const ringRef = useRef();
  const targetWireColor = useMemo(() => new THREE.Color(), []);
  
  const texture = useTexture(data.textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace; 
  
  const vec = useMemo(() => new THREE.Vector3(), []); 
  const rotationSpeedY = useMemo(() => Math.random() * 0.15 + 0.05, []); 
  const rotationSpeedX = useMemo(() => Math.random() * 0.15 + 0.05, []);

  const { width } = useThree().size;
  const isDesktop = width > 1024;
  const isTablet = width > 768 && width <= 1024;
  
  const activeScale = isDesktop ? 10 : (isTablet ? 7 : 5); 
  const activeY = isDesktop ? -8.5 : (isTablet ? -5.5 : -3.8);

  useFrame((state, delta) => {
    if (!groupRef.current || !spinRef.current || !scroll) return;

    spinRef.current.rotation.y += delta * rotationSpeedY;
    spinRef.current.rotation.x += delta * rotationSpeedX;

    const maxScrollIndex = SERVICES.length; 
    const totalPlanets = SERVICES.length - 1; 
    
    const currentScroll = scroll.offset * maxScrollIndex; 
    const clampedScroll = Math.max(0, Math.min(currentScroll, totalPlanets)); 
    const relativeScroll = clampedScroll - index; 
    
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

    if (wireRef.current) {
      targetWireColor.set(isLightMode ? '#000000' : '#ffffff');
      wireRef.current.color.lerp(targetWireColor, 4 * delta);
    }
    if (ringRef.current) {
      ringRef.current.color.lerp(targetWireColor, 4 * delta);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
        <group ref={spinRef}>
          <mesh>
            <sphereGeometry args={[1, 64, 64]} /> 
            <meshStandardMaterial map={texture} color="#ffffff" roughness={0.8} metalness={0.1} />
          </mesh>
          <mesh scale={1.01}>
            <icosahedronGeometry args={[1, 3]} />
            <meshBasicMaterial ref={wireRef} wireframe transparent opacity={0.15} />
          </mesh>
          {data.ring && (
            <mesh rotation={[Math.PI / 2.5, 0, 0]}>
              <torusGeometry args={[1.5, 0.005, 32, 100]} />
              <meshBasicMaterial ref={ringRef} transparent opacity={0.5} />
            </mesh>
          )}
        </group>
      </Float>
    </group>
  );
}

// 🕷️ NEW COMPONENT: ROCKY THE ERIDIAN
// 🕷️ ROCKY THE ERIDIAN (FIXED JUMP PHYSICS)
// 🕷️ UPGRADED PROCEDURAL ERIDIAN (5 LEGS & SURFACE MATH)
// 🕷️ HYPER-REALISTIC ERIDIAN (RIGHT-SIDE ANCHOR & SURFACE COLLISION)
// 🕷️ GLASS-CRAWLING ERIDIAN (SMALLER, PERIMETER CRAWL)
function RockyCharacter({ isLightMode }) {
  const scroll = useScroll();
  const rockyRef = useRef();
  const legsRef = useRef([]);

  const { width } = useThree().size;
  const isDesktop = width > 1024;
  const isTablet = width > 768 && width <= 1024;
  
  // 1. MATCHING THE HTML CARD BOUNDARIES IN 3D SPACE
  // These numbers perfectly frame the max-w-4xl text card overlay
  const w = isDesktop ? 4.8 : (isTablet ? 3.5 : 2.2); // Half-Width
  const h = isDesktop ? 2.3 : (isTablet ? 2.0 : 1.8); // Half-Height
  const perimeter = (w * 2) + (h * 2);
  
  // The HTML card is offset slightly higher (top-[45%]), so we shift his path up
  const yOffset = 0.4; 

  useFrame((state, delta) => {
    if (!rockyRef.current || !scroll) return;

    const currentScroll = scroll.offset * (SERVICES.length - 1);
    
    // 2. SCROLL TO PERIMETER MAPPING
    // He completes 2 full laps around the card over the whole page scroll
    const lapProgress = currentScroll / 2;
    const laps = Math.floor(lapProgress);
    const p = (lapProgress % 1) * perimeter; // Exact distance along the current lap

    let targetX, targetY, targetRotZ;
    
    // We base rotation on total laps so he doesn't wildly spin 360 degrees 
    // when crossing the finish line back to the start.
    const baseRot = -laps * Math.PI * 2; 

    if (p < w * 2) { 
      // TOP EDGE (Moving Left to Right)
      targetX = -w + p;
      targetY = h + yOffset;
      targetRotZ = baseRot + 0;
    } else if (p < (w * 2) + (h * 2)) { 
      // RIGHT EDGE (Moving Top to Bottom)
      targetX = w;
      targetY = (h + yOffset) - (p - (w * 2));
      targetRotZ = baseRot - Math.PI / 2;
    } else if (p < (w * 4) + (h * 2)) { 
      // BOTTOM EDGE (Moving Right to Left)
      targetX = w - (p - ((w * 2) + (h * 2)));
      targetY = -h + yOffset;
      targetRotZ = baseRot - Math.PI;
    } else { 
      // LEFT EDGE (Moving Bottom to Top)
      targetX = -w;
      targetY = (-h + yOffset) + (p - ((w * 4) + (h * 2)));
      targetRotZ = baseRot - (Math.PI * 1.5);
    }

    // Apply smooth damping for movement and corner turns
    rockyRef.current.position.x = THREE.MathUtils.damp(rockyRef.current.position.x, targetX, 8, delta);
    rockyRef.current.position.y = THREE.MathUtils.damp(rockyRef.current.position.y, targetY, 8, delta);
    rockyRef.current.rotation.z = THREE.MathUtils.damp(rockyRef.current.rotation.z, targetRotZ, 6, delta);
    
    // Slight breathing/wobble as he crawls
    rockyRef.current.rotation.y = Math.sin(currentScroll * 20) * 0.2;

    // 3. RAPID SCURRY ANIMATION
    const walkSpeed = currentScroll * 60; // Fast scurrying legs
    legsRef.current.forEach((legGroup, i) => {
      if (!legGroup) return;
      const phaseOffset = (i / 5) * Math.PI * 2;
      const crawlMotion = Math.sin(walkSpeed + phaseOffset) * 0.5; // Leg swing
      legGroup.rotation.z = THREE.MathUtils.damp(legGroup.rotation.z, crawlMotion, 10, delta);
      legGroup.rotation.x = 0; // Keep flat to surface
    });
  });

  return (
    // SCALED DOWN MASSIVELY (0.35 instead of 1.2)
    <group ref={rockyRef} scale={isDesktop ? 0.35 : 0.25} position={[0, 0, 1]}>
      
      <mesh position={[0, 0, 0]}>
        <dodecahedronGeometry args={[1.2, 1]} />
        <meshPhysicalMaterial 
          color={isLightMode ? "#2a221b" : "#0a0a0a"} 
          metalness={0.9} 
          roughness={0.2} 
          clearcoat={1.0} 
        />
      </mesh>

      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, angle, 0]} position={[0, -0.2, 0]}>
            <group ref={(el) => (legsRef.current[i] = el)} position={[0.8, 0, 0]}>
              <mesh rotation={[0, 0, Math.PI / 6]} position={[0.6, 0.3, 0]}>
                <cylinderGeometry args={[0.15, 0.08, 1.5, 12]} />
                <meshPhysicalMaterial color="#111111" metalness={0.8} roughness={0.4} clearcoat={0.5} />
              </mesh>
              <mesh rotation={[0, 0, -Math.PI / 4]} position={[1.5, -0.4, 0]}>
                <cylinderGeometry args={[0.08, 0.01, 1.8, 12]} />
                <meshPhysicalMaterial color="#050505" metalness={1.0} roughness={0.2} />
              </mesh>
            </group>
          </group>
        );
      })}

      <pointLight color="#ff3300" intensity={4} distance={6} position={[0, -0.5, 0]} />
      <mesh position={[0, -0.8, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#ff3300" />
      </mesh>
    </group>
  );
}

function SceneController({ onIndexChange, onReachEnd }) {
  const scroll = useScroll();
  const lastIndex = useRef(-1);
  const lastEnd = useRef(false);

  useFrame(() => {
    if (!scroll) return;

    const maxScrollIndex = SERVICES.length; 
    const totalPlanets = SERVICES.length - 1; 
    
    const currentScroll = scroll.offset * maxScrollIndex; 
    const clampedScroll = Math.max(0, Math.min(currentScroll, totalPlanets)); 

    const currentActive = Math.round(clampedScroll);
    if (currentActive !== lastIndex.current) {
      lastIndex.current = currentActive;
      setTimeout(() => onIndexChange(currentActive), 0); 
    }

    const isAtEnd = currentScroll > totalPlanets + 0.3;
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
  const isLightMode = activeIndex % 2 !== 0;

  return (
    <div className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 ${isLightMode ? 'bg-white' : 'bg-black'}`}>
      
      {/* 3D CANVAS */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ThemeController isLightMode={isLightMode} />
          
          <ambientLight intensity={isLightMode ? 0.8 : 0.2} /> 
          <directionalLight position={[10, 5, 2]} intensity={6} color="#ffffff" />
          <spotLight position={[-10, 10, 10]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" />
          
          <Stars radius={150} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

          <Suspense fallback={null}>
            <ScrollControls pages={SERVICES.length + 1} damping={0.25}>
              <SceneController onIndexChange={setActiveIndex} onReachEnd={setShowFooter} />
              
              {SERVICES.map((service, index) => (
                <Planet key={service.id} index={index} data={service} isLightMode={isLightMode} />
              ))}

              {/* 🕷️ ROCKY DEPLOYED HERE */}
              <RockyCharacter isLightMode={isLightMode} />

              {/* END SCREEN & FOOTER */}
              <Scroll html style={{ width: '100%', height: '100%' }}>
                <div 
                  className="absolute left-0 w-full h-screen flex flex-col justify-center items-center backdrop-blur-lg bg-black/60 pointer-events-none transition-all duration-1000 ease-out"
                  style={{ top: `${SERVICES.length * 100}vh` }}
                >
                  
                  <div className="flex flex-col items-center text-center p-8 pointer-events-auto mt-[-10vh]">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_#22c55e]"></div>
                       <p className="font-tech text-green-400 text-sm font-bold tracking-[0.4em] uppercase">SYSTEM.READY</p>
                    </div>
                    
                    <h2 className="font-nothing text-5xl md:text-7xl lg:text-8xl tracking-widest uppercase text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-10">
                      Scale Your <br className="md:hidden" /> Reality
                    </h2>

                    <Link href="/free-audit" className={`pointer-events-auto inline-flex relative items-center justify-center group px-10 py-5 font-tech font-bold text-sm uppercase tracking-[0.2em] transition-all duration-300 transform hover:-translate-y-1 ${
                      isLightMode 
                        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]' 
                        : 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]'
                    }`}>
                      <span className="relative z-10 flex items-center gap-3">
                        FREE SEO AUDIT
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </span>
                    </Link>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full pointer-events-auto">
                    <GlobalFooter isHomeOverlay={true} />
                  </div>
                  
                </div>
              </Scroll>

            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>

      {/* PLANET INFO OVERLAY */}
      <div className={`absolute inset-0 z-10 flex flex-col justify-between pt-32 pb-16 px-4 md:px-16 transition-opacity duration-700 pointer-events-none ${showFooter ? 'opacity-0' : 'opacity-100'}`}>
        
        <div className="absolute top-[40%] md:top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4">
          <div className={`flex flex-col items-center justify-center p-8 md:p-14 rounded-3xl backdrop-blur-xl transition-all duration-1000 ${
            isLightMode 
              ? 'bg-white/70 border border-black/10 shadow-[0_0_50px_rgba(0,0,0,0.1)]' 
              : 'bg-[#050505]/80 border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.05)]'
          }`}>
            
            <h2 className={`font-nothing text-4xl md:text-6xl lg:text-7xl tracking-widest mb-4 transition-colors duration-1000 text-center uppercase ${isLightMode ? 'text-black' : 'text-white'}`}>
              {activeService.title}
            </h2>
            
            <p className={`font-tech font-normal text-xs md:text-sm tracking-[0.2em] uppercase mb-10 transition-colors duration-1000 text-center max-w-xl ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
              [ {activeService.subtitle} ]
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link href={activeService.link} className={`pointer-events-auto inline-flex relative items-center justify-center group px-8 py-4 font-tech font-bold text-xs uppercase tracking-[0.2em] transition-all duration-1000 hover:scale-105 border ${
                isLightMode 
                  ? 'border-black/20 text-black hover:bg-black hover:text-white' 
                  : 'border-white/20 text-white hover:bg-white hover:text-black'
              }`}>
                <span className="relative z-10 flex items-center gap-3">
                  INITIATE
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
              </Link>

              <Link href="/free-audit" className={`pointer-events-auto inline-flex relative items-center justify-center group px-8 py-4 font-tech font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 transform hover:-translate-y-1 ${
                isLightMode 
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]' 
                  : 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]'
              }`}>
                <span className="relative z-10 flex items-center gap-3">
                  FREE SEO AUDIT
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </span>
              </Link>
            </div>

          </div>
        </div>

        {/* INITIATE SCROLL INDICATOR */}
        <div className={`absolute bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-opacity duration-700 pointer-events-none ${activeIndex === 0 ? 'opacity-100' : 'opacity-0'}`}>
          <p className="font-tech text-white text-[10px] md:text-sm font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] whitespace-nowrap drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            Initiate Scroll
          </p>
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-10 md:w-7 md:h-11 border-[2px] border-white rounded-full flex justify-center pt-2 shadow-[0_0_15px_rgba(255,255,255,0.3)] bg-black/20 backdrop-blur-sm">
              <div className="w-1.5 h-2.5 bg-white rounded-full animate-scroll-wheel shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
            </div>
            <svg className="w-5 h-5 text-white animate-bounce mt-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="miter" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Space+Mono:wght@400;700&display=swap');
        .font-nothing { font-family: 'DotGothic16', sans-serif; }
        .font-tech { font-family: 'Space Mono', monospace; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }

        @keyframes scrollWheel {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
        .animate-scroll-wheel {
          animation: scrollWheel 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
      `}} />
    </div>
  );
}