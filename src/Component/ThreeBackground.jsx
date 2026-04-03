import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Stars } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

// === 1. ROTATING PARTICLES (GALAXY EFFECT) ===
const ParticleGalaxy = (props) => {
  const ref = useRef();
  // 5000 dots generate kar rahe hain sphere shape mein
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#8b5cf6" // Violet Glow
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

// === 2. FLOATING SHAPES (GEOMETRY) ===
const FloatingShape = ({ position, color }) => {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <mesh position={position}>
        <icosahedronGeometry args={[0.3, 0]} /> {/* Techy Shape */}
        <meshStandardMaterial 
            color={color} 
            wireframe={true} // Sirf lines dikhengi (Futuristic Look)
            transparent 
            opacity={0.3} 
        />
      </mesh>
    </Float>
  );
};

// === MAIN COMPONENT ===
const ThreeBackground = () => {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -1, // Content ke peeche
      background: "#030712" // Deep dark bg incase 3D load na ho
    }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        
        {/* Environment Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* The Galaxy Particles */}
        <ParticleGalaxy />

        {/* Background Deep Stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Floating Geometric Shapes (Left & Right) */}
        <FloatingShape position={[-1.2, 0.5, 0]} color="#06b6d4" /> {/* Cyan */}
        <FloatingShape position={[1.2, -0.5, 0]} color="#ec4899" /> {/* Pink */}
        <FloatingShape position={[0, -1.2, 0]} color="#6366f1" />   {/* Indigo */}

      </Canvas>
    </div>
  );
};

export default ThreeBackground;