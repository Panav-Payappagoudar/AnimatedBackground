import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Environment } from '@react-three/drei';
import './BackgroundScene.css';

const LiquidTerrain = () => {
  const meshRef = useRef();

  // Animation loop provided perfectly by React Three Fiber
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Parallax and scroll calculations
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    
    // As we scroll, we fly FORWARD over the liquid terrain
    // We map scrollY to the camera's Z position (moving negative Z)
    const scrollProgress = scrollY * 0.01;
    
    // Base camera positions
    const baseZ = 20;
    const baseY = 5;
    
    // Target camera positions based on scroll
    const targetCamZ = baseZ - scrollProgress * 15; // Fly forward
    const targetCamY = baseY - Math.min(scrollProgress * 2, 3); // Dip down slightly, but cap it
    
    // React Three Fiber provides normalized mouse coordinates (-1 to 1) via state.pointer
    const targetX = state.pointer.x * 3;
    const targetY = state.pointer.y * 3;

    // Smoothly interpolate current camera position towards target
    // We add the mouse target offsets to the base flight path
    state.camera.position.x += (targetX - state.camera.position.x) * 0.05;
    state.camera.position.y += ((targetCamY - targetY) - state.camera.position.y) * 0.05;
    state.camera.position.z += (targetCamZ - state.camera.position.z) * 0.05;
    
    // The camera looks slightly down and forward
    // As we fly forward (Z decreases), our look target also moves forward
    state.camera.lookAt(targetX * 0.5, 0, targetCamZ - 10);
  });

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2, 0, 0]} // Lay it flat like the ground
      position={[0, -2, 0]} // Push it slightly below the camera
    >
      {/* A massive high-resolution plane */}
      <planeGeometry args={[150, 150, 128, 128]} />
      
      {/* 
        MeshDistortMaterial is a premium drei component that 
        automatically displaces vertices with fluid noise
      */}
      <MeshDistortMaterial
        color="#3a2e5d" // Deep dark purple
        emissive="#06040a"
        roughness={0.1} // Very smooth, shiny liquid
        metalness={0.8} // Highly reflective
        distort={0.4} // Intensity of the liquid waves
        speed={1.5} // Speed of the animation
      />
    </mesh>
  );
};

const BackgroundScene = () => {
  return (
    <div className="background-scene-container">
      <Canvas
        camera={{ position: [0, 5, 20], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#06040A']} />
        
        {/* Deep fog so the terrain fades off beautifully in the distance */}
        <fog attach="fog" args={['#06040A', 5, 40]} />
        
        {/* Premium Lighting Setup for shiny liquid */}
        <ambientLight intensity={0.2} color="#ffffff" />
        
        {/* Main highlight light (simulates a moon or distant bright source) */}
        <directionalLight 
          position={[10, 20, 5]} 
          intensity={1.5} 
          color="#9b88ed" 
        />
        
        {/* Secondary rim light for beautiful edge reflections */}
        <pointLight 
          position={[-10, 5, -10]} 
          intensity={2} 
          color="#ff7eb3" 
          distance={50}
        />

        {/* Adds realistic environmental reflections to the metalness of the liquid */}
        <Environment preset="city" />

        <LiquidTerrain />
      </Canvas>
    </div>
  );
};

export default BackgroundScene;
