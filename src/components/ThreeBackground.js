"use client"; // This tells Next.js this file uses interactive browser features
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";

export default function ThreeBackground() {
  return (
    // This div locks the 3D canvas to the background
    <div className="absolute inset-0 -z-10 h-screen w-full bg-black">
      <Canvas>
        {/* Lights so we can see the object */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={2} color="#8b5cf6" />
        
        {/* The actual 3D shape */}
        <Sphere visible args={[1, 100, 200]} scale={2}>
          <MeshDistortMaterial color="#0f172a" distort={0.5} speed={2} />
        </Sphere>
        
        {/* Allows the user to move the object with their mouse */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}