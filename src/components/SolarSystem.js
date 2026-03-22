"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Stars, ScrollControls, useScroll, Html, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

// 1. DATA (Increased sizes, removed image URLs for maximum performance)
const SERVICES_DATA = [
  {
    id: "aeo", orbitRadius: 14, angle: 0.5, orbitSpeed: 0.002, spinSpeed: 0.01, size: 2.5, color: "#4f46e5", label: "AEO",
    type: "earthLike", 
    title: "Answer Engine Optimization",
    teaser: "Click to explore AEO engineering & AI entity structuring.",
    extendedDescription: "In the era of Generative AI, traditional search is dying. We structure your brand's data so that when users ask ChatGPT, Gemini, or Claude questions about your industry, your business is cited as the definitive answer."
  },
  {
    id: "seo", orbitRadius: 21, angle: 2.1, orbitSpeed: 0.0015, spinSpeed: 0.008, size: 3.0, color: "#0ea5e9", label: "SEO",
    type: "ice", 
    title: "Search Engine Optimization",
    teaser: "Click to explore organic dominance and high-intent ranking.",
    extendedDescription: "Rank #1 on Google using data-backed regression models and intent-based keyword architecture. We engineer your site's content to mathematically outperform competitors in search algorithms."
  },
  {
    id: "webdev", orbitRadius: 29, angle: 4.0, orbitSpeed: 0.001, spinSpeed: 0.02, size: 2.2, color: "#10b981", label: "WEB",
    type: "terrestrial", 
    title: "Web Development",
    teaser: "Click to explore high-performance 3D web architecture.",
    extendedDescription: "We build high-performance, interactive 3D web experiences using Next.js and Three.js. Your website should be an immersive ecosystem that converts traffic into high-ticket clients."
  },
  {
    id: "performance", orbitRadius: 38, angle: 1.2, orbitSpeed: 0.0008, spinSpeed: 0.005, size: 3.8, color: "#ea580c", label: "ADS",
    type: "gasGiant", 
    title: "Performance Marketing",
    teaser: "Click to explore paid scaling and algorithmic bidding.",
    extendedDescription: "Data-backed paid advertising campaigns built to maximize ROI. We use advanced tracking and algorithmic bidding strategies to scale your revenue predictably."
  },
  {
    id: "smma", orbitRadius: 48, angle: 5.5, orbitSpeed: 0.0005, spinSpeed: 0.012, size: 2.8, color: "#db2777", label: "SMMA",
    type: "terrestrial",
    title: "Social Media Marketing",
    teaser: "Click to explore viral content and brand authority.",
    extendedDescription: "Viral content creation and community management. We engineer attention, transforming your social channels into powerful sales funnels."
  }
];

// 2. THE STARFIELD
function MovingStars() {
  const starsRef = useRef();
  useFrame((state, delta) => {
    starsRef.current.rotation.y += delta * 0.02;
  });
  return (
    <group ref={starsRef} frustumCulled={false}>
      <Stars radius={150} depth={100} count={8000} factor={4} saturation={0.5} fade speed={2} />
    </group>
  );
}

// 3. VISUAL ORBIT LINES
function OrbitLine({ radius }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} frustumCulled={false}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, 128]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

// 4. THE REVOLVING PLANET (Highly Optimized)
function Planet({ data, onPlanetClick }) {
  const orbitGroupRef = useRef(); 
  const planetMeshRef = useRef(); 
  const currentAngle = useRef(data.angle);
  
  // Velocity Scaling Refs
  const scroll = useScroll();
  const lastScroll = useRef(0);
  const scaleRef = useRef(1);

  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    // A. Orbit Math
    currentAngle.current += data.orbitSpeed;
    orbitGroupRef.current.position.x = Math.cos(currentAngle.current) * data.orbitRadius;
    orbitGroupRef.current.position.z = Math.sin(currentAngle.current) * data.orbitRadius;
    planetMeshRef.current.rotation.y += data.spinSpeed;

    // B. Velocity-Based Scaling Logic
    const currentScroll = scroll.offset;
    let scrollDelta = Math.abs(currentScroll - lastScroll.current);
    
    if (scrollDelta > 0.5) scrollDelta = 0; 
    lastScroll.current = currentScroll;

    const isScrolling = scrollDelta > 0.0001;
    const desiredScale = isScrolling ? 1.3 : 1.0;
    
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, desiredScale, 0.08);
    const finalScale = hovered ? 1.05 * scaleRef.current : scaleRef.current;
    
    orbitGroupRef.current.scale.setScalar(finalScale);
  });

  return (
    <group 
      ref={orbitGroupRef}
      frustumCulled={false} 
      // This click handler triggers the modal pop-up in your page.js
      onClick={(e) => {
        e.stopPropagation(); 
        if (typeof onPlanetClick === 'function') onPlanetClick(data);
      }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <group ref={planetMeshRef} frustumCulled={false}>
        {/* Sleek, performant solid color physical material */}
        <Sphere args={[data.size, 64, 64]} frustumCulled={false}>
          <meshPhysicalMaterial 
            color={data.color}
            metalness={0.3} 
            roughness={0.6} 
            clearcoat={0.5} 
            clearcoatRoughness={0.2}
            emissive={data.color}
            emissiveIntensity={hovered ? 0.4 : 0.1}
          />
        </Sphere>

        {/* Subtle Atmospheric Glow */}
        {(data.type === 'earthLike' || data.type === 'gasGiant') && (
          <Sphere args={[data.size * 1.05, 32, 32]} frustumCulled={false}>
            <meshBasicMaterial color={data.color} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
          </Sphere>
        )}

        {/* 3D Label Embedded on the Planet Surface */}
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

// 5. THE HERO TEXT
function TopHeroText() {
  const scroll = useScroll();
  const opacityRef = useRef();

  useFrame(() => {
    let opacity = 1;
    if (scroll.offset > 0.05 && scroll.offset < 0.95) {
        opacity = 0;
    } else if (scroll.offset <= 0.05) {
        opacity = 1 - (scroll.offset / 0.05); 
    } else if (scroll.offset >= 0.95) {
        opacity = (scroll.offset - 0.95) / 0.05; 
    }
    
    if (opacityRef.current) {
       opacityRef.current.style.opacity = opacity;
    }
  });

  return (
    <Html fullscreen style={{ pointerEvents: "none" }} zIndexRange={[10, 0]}>
      <div ref={opacityRef} className="absolute top-24 md:top-32 left-0 w-full flex justify-center transition-opacity duration-75">
        <p className="text-2xl md:text-4xl font-bold text-orange-50 tracking-[0.3em] uppercase drop-shadow-[0_0_25px_rgba(255,136,0,0.9)] text-center px-4">
          AI Growth Engine
        </p>
      </div>
    </Html>
  );
}

// 6. THE INFINITE CAMERA LOOP
function CameraFlyer() {
  const scroll = useScroll(); 
  
  useFrame((state) => {
    const radius = 90; 
    const angle = (Math.PI / 2) - (scroll.offset * Math.PI * 2);
    
    const targetX = Math.cos(angle) * radius;
    const targetZ = Math.sin(angle) * radius;
    const targetY = 18 + Math.sin(scroll.offset * Math.PI * 2) * 5; 
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    
    state.camera.lookAt(0, 0, 0); 
  });
  
  return null;
}

// 7. MAIN SCENE
export default function SolarSystem({ onPlanetClick }) {
  return (
    <div className="absolute inset-0 h-screen w-full bg-[#030303]">
      <Canvas camera={{ position: [0, 15, 90], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={250} color="#ffedd5" distance={500} decay={1.5} /> 
        
        <MovingStars />

        {SERVICES_DATA.map((service) => (
          <OrbitLine key={`orbit-${service.id}`} radius={service.orbitRadius} />
        ))}

        <ScrollControls pages={10} damping={0.2} infinite={true}>
          
          <group position={[0, 0, 0]} frustumCulled={false}>
            <Sphere args={[5.5, 64, 64]} frustumCulled={false}>
              <meshBasicMaterial color="#e65c00" />
            </Sphere>
            <Sphere args={[6.5, 64, 64]} frustumCulled={false}>
              <meshBasicMaterial color="#ff8800" transparent={true} opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
            </Sphere>
            <Sphere args={[8.5, 32, 32]} frustumCulled={false}>
              <meshBasicMaterial color="#ff4400" transparent={true} opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
            </Sphere>
          </group>

          <TopHeroText />

          {SERVICES_DATA.map((service) => (
            <Planet key={service.id} data={service} onPlanetClick={onPlanetClick} />
          ))}

          <CameraFlyer />
        </ScrollControls>
      </Canvas>
    </div>
  );
}