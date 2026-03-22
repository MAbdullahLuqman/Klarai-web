"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Stars, ScrollControls, useScroll, Html, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

// 1. DATA: Increased sizes and converted to REALISTIC ASTRONOMICAL COLORS
const SERVICES_DATA = [
  {
    id: "aeo", orbitRadius: 22, angle: 0.5, orbitSpeed: 0.001, spinSpeed: 0.01, size: 3.5, color: "#1e40af", label: "AEO",
    type: "earthLike", title: "Answer Engine Optimization", teaser: "Click to explore AEO engineering & AI entity structuring."
  },
  {
    id: "seo", orbitRadius: 32, angle: 2.1, orbitSpeed: 0.005, spinSpeed: 0.008, size: 4.2, color: "#94a3b8", label: "SEO",
    type: "ice", title: "Search Engine Optimization", teaser: "Click to explore organic dominance and high-intent ranking."
  },
  {
    id: "webdev", orbitRadius: 45, angle: 4.0, orbitSpeed: 0.001, spinSpeed: 0.02, size: 3.0, color: "#9a3412", label: "WEB",
    type: "terrestrial", title: "Web Development", teaser: "Click to explore high-performance 3D web architecture."
  },
  {
    id: "performance", orbitRadius: 60, angle: 1.2, orbitSpeed: 0.0008, spinSpeed: 0.005, size: 5.5, color: "#b45309", label: "ADS",
    type: "gasGiant", title: "Performance Marketing", teaser: "Click to explore paid scaling and algorithmic bidding."
  },
  {
    id: "smma", orbitRadius: 75, angle: 5.5, orbitSpeed: 0.0005, spinSpeed: 0.012, size: 4.0, color: "#d97706", label: "SMMA",
    type: "terrestrial", title: "Social Media Marketing", teaser: "Click to explore viral content and brand authority."
  }
];

function MovingStars() {
  const starsRef = useRef();
  useFrame((state, delta) => {
    starsRef.current.rotation.y += delta * 0.01;
  });
  return (
    <group ref={starsRef} frustumCulled={false}>
      <Stars radius={200} depth={150} count={10000} factor={5} saturation={0.1} fade speed={1} />
    </group>
  );
}

function OrbitLine({ radius }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} frustumCulled={false}>
      <ringGeometry args={[radius - 0.1, radius + 0.1, 128]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Planet({ data, onPlanetClick }) {
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

    const currentScroll = scroll.offset;
    let scrollDelta = Math.abs(currentScroll - lastScroll.current);
    if (scrollDelta > 0.5) scrollDelta = 0; 
    lastScroll.current = currentScroll;

    const isScrolling = scrollDelta > 0.0001;
    const desiredScale = isScrolling ? 1.2 : 1.0;
    
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, desiredScale, 0.08);
    const finalScale = hovered ? 1.05 * scaleRef.current : scaleRef.current;
    
    orbitGroupRef.current.scale.setScalar(finalScale);
  });

  return (
    <group 
      ref={orbitGroupRef}
      frustumCulled={false} 
      onClick={(e) => {
        e.stopPropagation(); 
        if (typeof onPlanetClick === 'function') onPlanetClick(data);
      }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <group ref={planetMeshRef} frustumCulled={false}>
        <Sphere args={[data.size, 64, 64]} frustumCulled={false}>
          <meshPhysicalMaterial 
            color={data.color}
            metalness={0.4} 
            roughness={0.8} 
            clearcoat={0.2} 
            clearcoatRoughness={0.5}
            emissive={data.color}
            emissiveIntensity={hovered ? 0.3 : 0.05}
          />
        </Sphere>

        {(data.type === 'earthLike' || data.type === 'gasGiant') && (
          <Sphere args={[data.size * 1.05, 32, 32]} frustumCulled={false}>
            <meshBasicMaterial color={data.color} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
          </Sphere>
        )}

        <Text position={[0, 0, data.size + 0.1]} fontSize={data.size * 0.35} color="white" fontWeight="bold" anchorX="center" anchorY="middle">
          {data.label}
        </Text>
        <Text position={[0, 0, -(data.size + 0.1)]} rotation={[0, Math.PI, 0]} fontSize={data.size * 0.35} color="white" fontWeight="bold" anchorX="center" anchorY="middle">
          {data.label}
        </Text>
      </group>
    </group>
  );
}

function TopHeroText({ isModalOpen }) {
  const scroll = useScroll();
  const opacityRef = useRef();

  useFrame(() => {
    let opacity = 1;
    if (scroll.offset > 0.05 && scroll.offset < 0.95) opacity = 0;
    else if (scroll.offset <= 0.05) opacity = 1 - (scroll.offset / 0.05); 
    else if (scroll.offset >= 0.95) opacity = (scroll.offset - 0.95) / 0.05; 
    
    // Force hide if modal is open
    if (isModalOpen) opacity = 0;

    if (opacityRef.current) opacityRef.current.style.opacity = opacity;
  });

  return (
    <Html fullscreen style={{ pointerEvents: "none" }} zIndexRange={[10, 0]}>
      <div ref={opacityRef} className="absolute top-24 md:top-32 left-0 w-full flex justify-center transition-opacity duration-300">
        <p className="text-2xl md:text-4xl font-bold text-orange-50 tracking-[0.3em] uppercase drop-shadow-[0_0_25px_rgba(234,179,8,0.6)] text-center px-4">
          AI Growth Engine
        </p>
      </div>
    </Html>
  );
}

// 6. THE CINEMATIC CAMERA LOOP (WITH IDLE ROTATION)
function CameraFlyer({ isStrategyModalOpen }) {
  const scroll = useScroll(); 
  
  useFrame((state) => {
    // If the strategy modal is open, override the scroll and perform a continuous, cinematic fly-around
    if (isStrategyModalOpen) {
      const time = state.clock.elapsedTime;
      const radius = 130; 
      const targetX = Math.cos(time * 0.15) * radius; // Slow automatic rotation
      const targetZ = Math.sin(time * 0.15) * radius;
      const targetY = 30; // Slightly elevated view
      
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.02);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.02);
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.02);
    } 
    // Otherwise, follow the standard user scroll
    else {
      const radius = 130; // Pushed camera back to account for much larger planets
      const angle = (Math.PI / 2) - (scroll.offset * Math.PI * 2);
      const targetX = Math.cos(angle) * radius;
      const targetZ = Math.sin(angle) * radius;
      const targetY = 25 + Math.sin(scroll.offset * Math.PI * 2) * 10; 
      
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    }
    
    state.camera.lookAt(0, 0, 0); 
  });
  
  return null;
}

// 7. MAIN SCENE
export default function SolarSystem({ onPlanetClick, onSunClick, isModalOpen, isStrategyModalOpen }) {
  const [sunHovered, setSunHovered] = useState(false);

  return (
    <div className="absolute inset-0 h-screen w-full bg-[#030303]">
      {/* Pushed base camera further back for the larger environment */}
      <Canvas camera={{ position: [0, 25, 130], fov: 60 }}>
        <ambientLight intensity={0.1} />
        {/* Swapped to a warmer, more realistic sun color for the light source */}
        <pointLight position={[0, 0, 0]} intensity={300} color="#fffbeb" distance={600} decay={1.5} /> 
        
        <MovingStars />

        {SERVICES_DATA.map((service) => (
          <OrbitLine key={`orbit-${service.id}`} radius={service.orbitRadius} />
        ))}

        <ScrollControls pages={10} damping={0.2} infinite={true}>
          
          <group 
            position={[0, 0, 0]} 
            frustumCulled={false}
            onClick={(e) => {
                e.stopPropagation();
                if (typeof onSunClick === 'function') onSunClick();
            }}
            onPointerOver={() => { setSunHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setSunHovered(false); document.body.style.cursor = 'auto'; }}
          >
            {/* The Sun: Increased sizes and made the core realistic (blinding white/yellow) with orange corona */}
            <Sphere args={[8.0, 64, 64]} frustumCulled={false}>
              <meshBasicMaterial color="#fffbeb" /> 
            </Sphere>
            <Sphere args={[9.5, 64, 64]} frustumCulled={false}>
              <meshBasicMaterial color="#f59e0b" transparent={true} opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
            </Sphere>
            <Sphere args={[12.5, 32, 32]} frustumCulled={false}>
              <meshBasicMaterial color="#ea580c" transparent={true} opacity={sunHovered ? 0.25 : 0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
            </Sphere>
            
            {/* Call to action floating over the sun on hover */}
            <Html center position={[0, 0, 0]} style={{ pointerEvents: "none" }} zIndexRange={[100, 0]}>
                <div className={`transition-opacity duration-300 whitespace-nowrap ${sunHovered && !isModalOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-white font-bold tracking-widest uppercase drop-shadow-md bg-black/50 px-4 py-2 rounded-full border border-white/20">
                        Initiate Strategy
                    </p>
                </div>
            </Html>
          </group>

          <TopHeroText isModalOpen={isModalOpen} />

          {SERVICES_DATA.map((service) => (
            <Planet key={service.id} data={service} onPlanetClick={onPlanetClick} />
          ))}

          <CameraFlyer isStrategyModalOpen={isStrategyModalOpen} />
        </ScrollControls>
      </Canvas>
    </div>
  );
}