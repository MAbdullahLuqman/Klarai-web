"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, ScrollControls, useScroll, Html, Text, Billboard } from "@react-three/drei";
import { useRef, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";

const SERVICES_DATA = [
  { id: "aeo", href: "/aeo-services", shape: "icosahedron", radiusX: 38, radiusZ: 25, tiltX: 0.15, tiltY: 0.1, tiltZ: -0.15, angle: 0.5, orbitSpeed: 0.002, spinSpeed: 0.01, size: 3.5, color: "#fcd34d", label: "AEO" }, 
  { id: "seo", href: "/seo-services", shape: "torus", radiusX: 55, radiusZ: 40, tiltX: -0.25, tiltY: -0.15, tiltZ: 0.2, angle: 2.1, orbitSpeed: 0.0015, spinSpeed: 0.008, size: 3.8, color: "#185FA5", label: "SEO" }, 
  { id: "webdev", href: "/web-development", shape: "box", radiusX: 75, radiusZ: 50, tiltX: 0.25, tiltY: 0.05, tiltZ: 0.25, angle: 4.0, orbitSpeed: 0.001, spinSpeed: 0.02, size: 3.2, color: "#10b981", label: "WEB" }, 
  { id: "performance", href: "/meta-ads", shape: "cone", radiusX: 95, radiusZ: 60, tiltX: -0.2, tiltY: 0.2, tiltZ: -0.3, angle: 1.2, orbitSpeed: 0.0008, spinSpeed: 0.005, size: 4.2, color: "#ea580c", label: "ADS" }, 
  { id: "smma", href: "/social-media-marketing", shape: "torusknot", radiusX: 115, radiusZ: 80, tiltX: 0.35, tiltY: -0.2, tiltZ: 0.15, angle: 5.5, orbitSpeed: 0.0005, spinSpeed: 0.012, size: 4.0, color: "#8b5cf6", label: "SMMA" } 
];

function MovingStars() {
  const starsRef = useRef();
  useFrame((state, delta) => { if(starsRef.current) starsRef.current.rotation.y += delta * 0.005; });
  return <group ref={starsRef} frustumCulled={false}><Stars radius={300} depth={200} count={6000} factor={15} saturation={1.0} fade speed={1.5} /></group>;
}

function OrbitLine({ data, isMobile }) {
  const rX = isMobile ? data.radiusX * 0.65 : data.radiusX;
  const rZ = isMobile ? data.radiusZ * 0.65 : data.radiusZ;
  const scaleY = rZ / rX; 
  return (
    <group rotation={[data.tiltX, data.tiltY, data.tiltZ]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1, scaleY, 1]} frustumCulled={false}>
        <ringGeometry args={[rX - 0.25, rX + 0.25, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function ShapeGeometry({ shape, size, color, hovered }) {
  const materialProps = useMemo(() => ({
    color: color, metalness: 0.8, roughness: 0.2, clearcoat: 1.0, clearcoatRoughness: 0.1, emissive: color, emissiveIntensity: hovered ? 0.7 : 0.3,
  }), [color, hovered]);

  switch (shape) {
    case "icosahedron": return <mesh><icosahedronGeometry args={[size, 0]} /><meshPhysicalMaterial {...materialProps} /></mesh>;
    case "torus": return <group><mesh><torusGeometry args={[size, size * 0.3, 16, 32]} /><meshPhysicalMaterial {...materialProps} /></mesh><mesh><sphereGeometry args={[size * 0.5, 16, 16]} /><meshPhysicalMaterial {...materialProps} /></mesh></group>;
    case "box": return <mesh><boxGeometry args={[size * 1.5, size * 1.5, size * 1.5]} /><meshPhysicalMaterial {...materialProps} /></mesh>;
    case "cone": return <mesh><coneGeometry args={[size, size * 2, 16]} /><meshPhysicalMaterial {...materialProps} /></mesh>;
    case "torusknot": return <mesh><torusKnotGeometry args={[size * 0.8, size * 0.25, 64, 16]} /><meshPhysicalMaterial {...materialProps} /></mesh>;
    default: return <mesh><sphereGeometry args={[size, 32, 32]} /><meshPhysicalMaterial {...materialProps} /></mesh>;
  }
}

function Planet({ data, isMobile }) {
  const router = useRouter();
  const orbitGroupRef = useRef(); 
  const planetMeshRef = useRef(); 
  const currentAngle = useRef(data.angle);
  const scroll = useScroll();
  const lastScroll = useRef(0);
  const scaleRef = useRef(1);
  const [hovered, setHovered] = useState(false);
  
  const baseScale = isMobile ? 1.3 : 1.0;
  const rX = isMobile ? data.radiusX * 0.65 : data.radiusX;
  const rZ = isMobile ? data.radiusZ * 0.65 : data.radiusZ;

  useFrame(() => {
    if(!orbitGroupRef.current || !planetMeshRef.current || !scroll) return;
    currentAngle.current += data.orbitSpeed;
    const localX = Math.cos(currentAngle.current) * rX;
    const localZ = Math.sin(currentAngle.current) * rZ;
    const pos = new THREE.Vector3(localX, 0, localZ);
    const euler = new THREE.Euler(data.tiltX, data.tiltY, data.tiltZ);
    pos.applyEuler(euler);
    orbitGroupRef.current.position.copy(pos);
    planetMeshRef.current.rotation.y += data.spinSpeed;
    planetMeshRef.current.rotation.x += data.spinSpeed * 0.5;

    let scrollDelta = Math.abs(scroll.offset - lastScroll.current);
    if (scrollDelta > 0.5) scrollDelta = 0; 
    lastScroll.current = scroll.offset;

    const activeScale = scrollDelta > 0.0001 ? 1.2 * baseScale : baseScale;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, activeScale, 0.08);
    orbitGroupRef.current.scale.setScalar(hovered ? 1.1 * scaleRef.current : scaleRef.current);
  });

  return (
    <group 
      ref={orbitGroupRef} frustumCulled={false} 
      onClick={(e) => { e.stopPropagation(); router.push(data.href); }} 
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={planetMeshRef} frustumCulled={false}>
          <ShapeGeometry shape={data.shape} size={data.size} color={data.color} hovered={hovered} />
          <mesh frustumCulled={false}>
            <sphereGeometry args={[data.size * 1.4, 16, 16]} />
            <meshBasicMaterial color={data.color} wireframe transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      </Float>

      <Billboard follow={true}>
        <Text 
          position={[0, data.size + 2.5, 0]} 
          fontSize={data.size * (isMobile ? 1.2 : 0.9)} 
          color="#fcd34d" 
          fontWeight="bold" 
          anchorX="center" 
          anchorY="middle"
          outlineWidth={data.size * 0.03}
          outlineColor="#000000"
        >
          {data.label}
        </Text>
      </Billboard>
    </group>
  );
}

function TopHeroText({ isStrategyModalOpen, onOpenModal }) {
  const scroll = useScroll();
  const opacityRef = useRef();

  useFrame(() => {
    if(!scroll) return;
    // Fades out faster now (by 15% of the new, shorter scroll)
    let opacity = scroll.offset > 0.15 ? 0 : 1 - (scroll.offset / 0.15); 
    if (isStrategyModalOpen) opacity = 0;
    if (opacityRef.current) opacityRef.current.style.opacity = Math.max(0, opacity);
  });

  return (
    <Html fullscreen style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
      <div ref={opacityRef} style={{ pointerEvents: 'none', opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-20 md:pt-24 will-change-[opacity]">
        
        <div className="relative z-10 w-full flex flex-col items-center text-center max-w-[95%] sm:max-w-2xl md:max-w-4xl mx-auto bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 p-8 sm:p-12 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-[#111] border border-white/10 text-[#3b82f6] text-[9px] md:text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#3b82f6]"></span>
                Next-Gen Answer Engine Optimization
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 md:mb-6 leading-snug drop-shadow-md">
                AI-Powered Digital<br className="hidden sm:block" /> Marketing Agency for <br className="block sm:hidden" />
                <span className="text-[#3b82f6]">UK &<br className="block sm:hidden"/> European Businesses</span>
            </h1>
            
            <p className="text-xs sm:text-sm md:text-lg text-gray-200 font-medium max-w-2xl mx-auto mb-8 md:mb-10 px-2 leading-relaxed drop-shadow-sm">
                Klarai is a results-driven digital marketing agency offering SEO, web design, Meta Ads, and social media management for UK and European businesses.
            </p>

            <button
                style={{ pointerEvents: 'auto' }}
                onClick={onOpenModal}
                className="bg-[#185FA5] hover:bg-[#144d85] text-white font-bold px-8 md:px-12 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(24,95,165,0.4)] hover:shadow-[0_0_35px_rgba(24,95,165,0.7)] text-sm md:text-lg w-full sm:w-auto"
            >
                Get Free Audit
            </button>

            {/* NEW CATCHY TEXT: Built directly into the card so it never gets lost at the bottom */}
            <div className="mt-8 md:mt-10 flex flex-col items-center gap-2 animate-bounce opacity-80">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-400 font-bold drop-shadow-md">
                    [ Ignite Launch Sequence ]
                </span>
                <svg className="w-4 h-4 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </div>
        </div>
      </div>
    </Html>
  );
}

function TransitionSlideShow() {
  const scroll = useScroll();
  const slide1Ref = useRef();
  const slide2Ref = useRef();

  useFrame(() => {
    if(!scroll || !slide1Ref.current || !slide2Ref.current) return;
    const offset = scroll.offset;

    // Adjusted Math for the faster 5-page scroll
    // Slide 1: Engine Start (15% to 35%)
    let op1 = 0;
    if (offset > 0.15 && offset < 0.35) {
      const p = (offset - 0.15) / 0.20; 
      op1 = Math.sin(p * Math.PI); 
    }
    slide1Ref.current.style.opacity = Math.max(0, op1);

    // Slide 2: Selection Ready (35% to 65%)
    let op2 = 0;
    if (offset > 0.35 && offset < 0.65) {
      const p = (offset - 0.35) / 0.30;
      op2 = Math.sin(p * Math.PI); 
    }
    slide2Ref.current.style.opacity = Math.max(0, op2);
  });

  return (
    <Html fullscreen style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
      {/* Slide 1 */}
      <div ref={slide1Ref} className="fixed bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 w-[95%] md:w-auto flex justify-center will-change-[opacity]" style={{ opacity: 0 }}>
         <div className="flex flex-col items-center gap-2 bg-[#050505]/95 px-6 md:px-10 py-4 md:py-5 rounded-2xl backdrop-blur-xl border border-[#3b82f6]/40 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
           <span className="text-[#3b82f6] text-[10px] md:text-sm font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] text-center">
             [ SYS_INIT ]
           </span>
           <span className="text-gray-200 text-xs md:text-base font-semibold tracking-widest uppercase text-center">
             Synchronizing Orbital Grid...
           </span>
         </div>
      </div>

      {/* Slide 2 */}
      <div ref={slide2Ref} className="fixed bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 w-[95%] md:w-auto flex justify-center will-change-[opacity]" style={{ opacity: 0 }}>
        <div className="flex flex-col items-center gap-3 bg-[#050505]/95 px-8 md:px-12 py-5 rounded-3xl backdrop-blur-xl border border-[#fcd34d]/40 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
          <span className="text-[#fcd34d] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(252,211,77,0.8)] text-center">
            [ READY ]
          </span>
          <p className="text-sm md:text-lg text-white font-extrabold tracking-widest uppercase text-center flex items-center gap-3">
            Select a module to explore
            <span className="w-2 h-2 rounded-full bg-[#fcd34d] animate-pulse shadow-[0_0_10px_rgba(252,211,77,0.8)]"></span>
          </p>
        </div>
      </div>

    </Html>
  );
}

function DynamicFooter() {
  const scroll = useScroll();
  const footerRef = useRef();

  useFrame(() => {
    if(!scroll || !footerRef.current) return;
    let opacity = 0;
    // Shows up sooner since the total scroll is shorter
    if (scroll.offset > 0.80) { 
      opacity = (scroll.offset - 0.80) / 0.20; 
    }
    opacity = Math.min(Math.max(opacity, 0), 1); 
    footerRef.current.style.opacity = opacity;
    footerRef.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
  });

  return (
    <Html fullscreen style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
      <div 
        ref={footerRef} 
        className="fixed bottom-0 left-0 w-full p-4 md:py-4 md:px-8 bg-[#030303]/90 backdrop-blur-xl border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 will-change-[opacity]"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center gap-3">
            <img src="/klarailogo.webp" alt="Klarai Logo" className="h-4 md:h-5 object-contain opacity-80" />
            <div className="h-4 w-px bg-white/20 hidden md:block"></div>
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wide">
                © {new Date().getFullYear()} KLARAI. All Rights Reserved.
            </span>
        </div>
        
        <p className="text-[8px] sm:text-[10px] text-gray-500 text-center md:text-right max-w-xs md:max-w-md uppercase tracking-wider">
            Strictly Protected. Copyright infringement & unauthorized duplication is prohibited.
        </p>
      </div>
    </Html>
  );
}

function CameraFlyer({ isStrategyModalOpen, isMobile }) {
  const scroll = useScroll(); 
  useFrame((state) => {
    if(!scroll) return;
    const time = state.clock.elapsedTime;
    const driftRadius = 20; 
    
    let targetX, targetZ, targetY;
    
    if (isStrategyModalOpen) {
      targetX = Math.cos(time * 0.15) * driftRadius; 
      targetZ = Math.sin(time * 0.15) * driftRadius;
      targetY = 120; 
    } else {
      const angle = (Math.PI / 2) - (scroll.offset * Math.PI * 2);
      targetX = Math.cos(angle) * driftRadius;
      targetZ = Math.sin(angle) * driftRadius;
      
      // Camera drops EARLIER (at 60% scroll depth) so users reach the planets much faster
      if (scroll.offset < 0.60) {
          targetY = isMobile ? 260 : 200; 
      } else {
          targetY = isMobile ? 80 : 50; 
      }
    }
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.03);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.03);
    state.camera.lookAt(0, 0, 0); 
  });
  return null;
}

export default function SolarSystem({ onOpenModal, isStrategyModalOpen }) {
  const [sunHovered, setSunHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-[100dvh]">
      <Canvas camera={{ position: [0, 200, 20], fov: 60 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#030303']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 0, 0]} intensity={600} color="#fffbeb" distance={800} decay={1.5} /> 
        
        <MovingStars />
        {SERVICES_DATA.map((service) => <OrbitLine key={`orbit-${service.id}`} data={service} isMobile={isMobile} />)}

        {/* FASTER SCROLL: Reduced pages from 8 to 5 to make the scroll sequence much faster */}
        <ScrollControls pages={5} damping={0.2}>
          
          <group position={[0, 0, 0]} frustumCulled={false} onClick={(e) => { e.stopPropagation(); onOpenModal(); }} onPointerOver={() => { setSunHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { setSunHovered(false); document.body.style.cursor = 'auto'; }}>
            <mesh frustumCulled={false}>
              <sphereGeometry args={[11.0, 64, 64]} />
              <meshPhysicalMaterial color="#ea580c" emissive="#c2410c" emissiveIntensity={0.8} clearcoat={1} roughness={0.7} />
            </mesh>
            <mesh frustumCulled={false} scale={1.05}>
              <sphereGeometry args={[11.0, 32, 32]} />
              <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.2} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh frustumCulled={false} scale={1.2}>
              <sphereGeometry args={[11.0, 32, 32]} />
              <meshBasicMaterial color="#facc15" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          </group>
          
          <TopHeroText isStrategyModalOpen={isStrategyModalOpen} onOpenModal={onOpenModal} />
          <TransitionSlideShow />
          {SERVICES_DATA.map((service) => <Planet key={service.id} data={service} isMobile={isMobile} />)}
          <CameraFlyer isStrategyModalOpen={isStrategyModalOpen} isMobile={isMobile} />
          <DynamicFooter />
          
        </ScrollControls>
      </Canvas>
    </div>
  );
}