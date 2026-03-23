"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Icosahedron, Torus, Box, Cone, TorusKnot, Float, Stars, ScrollControls, useScroll, Html, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";

const SERVICES_DATA = [
  { id: "aeo", href: "/aeo-services", shape: "icosahedron", orbitRadius: 28, angle: 0.5, orbitSpeed: 0.002, spinSpeed: 0.01, size: 4.5, color: "#8b5cf6", label: "AEO" }, 
  { id: "seo", href: "/seo-services", shape: "torus", orbitRadius: 42, angle: 2.1, orbitSpeed: 0.0015, spinSpeed: 0.008, size: 4.8, color: "#0ea5e9", label: "SEO" }, 
  { id: "webdev", href: "/web-development", shape: "box", orbitRadius: 58, angle: 4.0, orbitSpeed: 0.001, spinSpeed: 0.02, size: 4.0, color: "#10b981", label: "WEB" }, 
  { id: "performance", href: "/meta-ads", shape: "cone", orbitRadius: 75, angle: 1.2, orbitSpeed: 0.0008, spinSpeed: 0.005, size: 5.5, color: "#f43f5e", label: "ADS" }, 
  { id: "smma", href: "/social-media-marketing", shape: "torusknot", orbitRadius: 95, angle: 5.5, orbitSpeed: 0.0005, spinSpeed: 0.012, size: 5.0, color: "#f59e0b", label: "SMMA" } 
];

function MovingStars() {
  const starsRef = useRef();
  useFrame((state, delta) => { starsRef.current.rotation.y += delta * 0.01; });
  return <group ref={starsRef} frustumCulled={false}><Stars radius={250} depth={150} count={12000} factor={6} saturation={0.8} fade speed={1} /></group>;
}

function OrbitLine({ radius }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} frustumCulled={false}>
      <ringGeometry args={[radius - 0.15, radius + 0.15, 128]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
    </mesh>
  );
}

function ShapeGeometry({ shape, size, color, hovered }) {
  const materialProps = {
    color: color, metalness: 0.7, roughness: 0.15, clearcoat: 1.0, clearcoatRoughness: 0.1, emissive: color, emissiveIntensity: hovered ? 0.6 : 0.2,
  };

  switch (shape) {
    case "icosahedron": return <Icosahedron args={[size, 0]}><meshPhysicalMaterial {...materialProps} /></Icosahedron>;
    case "torus": return <group><Torus args={[size, size * 0.3, 32, 64]}><meshPhysicalMaterial {...materialProps} /></Torus><Sphere args={[size * 0.5, 32, 32]}><meshPhysicalMaterial {...materialProps} /></Sphere></group>;
    case "box": return <Box args={[size * 1.5, size * 1.5, size * 1.5]}><meshPhysicalMaterial {...materialProps} /></Box>;
    case "cone": return <Cone args={[size, size * 2, 32]}><meshPhysicalMaterial {...materialProps} /></Cone>;
    case "torusknot": return <TorusKnot args={[size * 0.8, size * 0.25, 128, 32]}><meshPhysicalMaterial {...materialProps} /></TorusKnot>;
    default: return <Sphere args={[size, 64, 64]}><meshPhysicalMaterial {...materialProps} /></Sphere>;
  }
}

function Planet({ data }) {
  const router = useRouter();
  const orbitGroupRef = useRef(); 
  const planetMeshRef = useRef(); 
  const currentAngle = useRef(data.angle);
  const scroll = useScroll();
  const lastScroll = useRef(0);
  const scaleRef = useRef(1);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    currentAngle.current += data.orbitSpeed;
    orbitGroupRef.current.position.x = Math.cos(currentAngle.current) * data.orbitRadius;
    orbitGroupRef.current.position.z = Math.sin(currentAngle.current) * data.orbitRadius;
    planetMeshRef.current.rotation.y += data.spinSpeed;
    planetMeshRef.current.rotation.x += data.spinSpeed * 0.5;

    let scrollDelta = Math.abs(scroll.offset - lastScroll.current);
    if (scrollDelta > 0.5) scrollDelta = 0; 
    lastScroll.current = scroll.offset;

    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, scrollDelta > 0.0001 ? 1.2 : 1.0, 0.08);
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
          <Sphere args={[data.size * 1.4, 16, 16]} frustumCulled={false}>
            <meshBasicMaterial color={data.color} wireframe transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
          </Sphere>

          {/* MASSIVELY UPGRADED TEXT: Bigger size, pushed out, thick black outline for extreme contrast */}
          <Text 
            position={[0, 0, data.size + 2.0]} 
            fontSize={data.size * 0.6} 
            color="#ffffff" 
            fontWeight="bold" 
            anchorX="center" 
            anchorY="middle"
            outlineWidth={data.size * 0.06}
            outlineColor="#000000"
          >
            {data.label}
          </Text>
          <Text 
            position={[0, 0, -(data.size + 2.0)]} 
            rotation={[0, Math.PI, 0]} 
            fontSize={data.size * 0.6} 
            color="#ffffff" 
            fontWeight="bold" 
            anchorX="center" 
            anchorY="middle"
            outlineWidth={data.size * 0.06}
            outlineColor="#000000"
          >
            {data.label}
          </Text>
        </group>
      </Float>
    </group>
  );
}

function TopHeroText({ isStrategyModalOpen, onOpenModal }) {
  const scroll = useScroll();
  const opacityRef = useRef();

  useFrame(() => {
    let opacity = scroll.offset > 0.05 ? 0 : 1 - (scroll.offset / 0.05); 
    if (isStrategyModalOpen) opacity = 0;
    if (opacityRef.current) opacityRef.current.style.opacity = opacity;
  });

  return (
    <Html fullscreen zIndexRange={[10, 0]}>
      <div ref={opacityRef} className="absolute inset-0 pointer-events-none flex flex-col items-center pt-24 md:pt-32 transition-opacity duration-300 px-4">
        
        <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 p-8 md:p-14 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col items-center max-w-4xl mx-auto text-center mt-10 md:mt-0 overflow-hidden">
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#185FA5]/20 blur-[80px] rounded-full -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full -translate-y-1/2 pointer-events-none"></div>

            <div className="relative z-10 w-full flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#3b82f6] text-[10px] md:text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse"></span>
                    Next-Gen Answer Engine Optimization
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.1] drop-shadow-lg">
                    AI-Powered Digital<br />Marketing Agency for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]">UK &<br/>European Businesses</span>
                </h1>
                
                <p className="text-sm md:text-lg text-gray-300 max-w-2xl mx-auto mb-10 drop-shadow-md">
                    Klarai is a results-driven digital marketing agency offering SEO, web design, Meta Ads, and social media management for UK and European businesses.
                </p>

                {/* THE SINGLE BUTTON: Replaces the inline form and triggers the big modal */}
                <button
                    onClick={onOpenModal}
                    className="pointer-events-auto bg-[#185FA5] hover:bg-[#144d85] text-white font-extrabold px-10 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(24,95,165,0.4)] hover:shadow-[0_0_35px_rgba(24,95,165,0.7)] whitespace-nowrap transform hover:scale-105 text-lg"
                >
                    Get Free Audit
                </button>
            </div>
        </div>
      </div>
    </Html>
  );
}

function CameraFlyer({ isStrategyModalOpen }) {
  const scroll = useScroll(); 
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const radius = 160; 
    let targetX, targetZ, targetY;
    
    if (isStrategyModalOpen) {
      targetX = Math.cos(time * 0.15) * radius; 
      targetZ = Math.sin(time * 0.15) * radius;
      targetY = 40; 
    } else {
      const angle = (Math.PI / 2) - (scroll.offset * Math.PI * 2);
      targetX = Math.cos(angle) * radius;
      targetZ = Math.sin(angle) * radius;
      targetY = 30 + Math.sin(scroll.offset * Math.PI) * 15; 
    }
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    state.camera.lookAt(0, 0, 0); 
  });
  return null;
}

export default function SolarSystem({ onOpenModal, isStrategyModalOpen }) {
  const [sunHovered, setSunHovered] = useState(false);

  return (
    <div className="absolute inset-0 h-screen w-full bg-[#030303]">
      <Canvas camera={{ position: [0, 30, 160], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={450} color="#fffbeb" distance={800} decay={1.5} /> 
        <MovingStars />
        {SERVICES_DATA.map((service) => <OrbitLine key={`orbit-${service.id}`} radius={service.orbitRadius} />)}

        <ScrollControls pages={10} damping={0.2}>
          <group position={[0, 0, 0]} frustumCulled={false} onClick={(e) => { e.stopPropagation(); onOpenModal(); }} onPointerOver={() => { setSunHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { setSunHovered(false); document.body.style.cursor = 'auto'; }}>
            <Sphere args={[10.0, 64, 64]} frustumCulled={false}><meshBasicMaterial color="#fffbeb" /></Sphere>
            <Sphere args={[12.0, 64, 64]} frustumCulled={false}><meshBasicMaterial color="#f59e0b" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} /></Sphere>
            <Sphere args={[16.0, 32, 32]} frustumCulled={false}><meshBasicMaterial color="#ea580c" transparent opacity={sunHovered ? 0.3 : 0.15} blending={THREE.AdditiveBlending} depthWrite={false} /></Sphere>
            <Html center position={[0, 0, 0]} style={{ pointerEvents: "none" }} zIndexRange={[100, 0]}>
                <div className={`transition-opacity duration-300 whitespace-nowrap ${sunHovered && !isStrategyModalOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-white font-bold tracking-widest uppercase drop-shadow-md bg-black/50 px-4 py-2 rounded-full border border-white/20">Initiate Strategy</p>
                </div>
            </Html>
          </group>
          
          {/* Passed onOpenModal to TopHeroText */}
          <TopHeroText isStrategyModalOpen={isStrategyModalOpen} onOpenModal={onOpenModal} />
          
          {SERVICES_DATA.map((service) => <Planet key={service.id} data={service} />)}
          <CameraFlyer isStrategyModalOpen={isStrategyModalOpen} />
        </ScrollControls>
      </Canvas>
    </div>
  );
}