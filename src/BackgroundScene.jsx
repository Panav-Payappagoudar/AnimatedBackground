import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float, Sphere, TorusKnot } from '@react-three/drei';
import './BackgroundScene.css';

// A beautifully glowing orb that sits far in the background 
// for the glass objects to refract
const BackgroundOrb = () => {
  const orbRef = useRef();
  
  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 2;
    }
  });

  return (
    <Sphere ref={orbRef} args={[8, 64, 64]} position={[5, 0, -20]}>
      <meshBasicMaterial color="#5e35b1" />
    </Sphere>
  );
};

const GlassObjects = () => {
  const groupRef = useRef();
  const knotRef = useRef();
  const icosaRef = useRef();

  // Animation loop for buttery smooth, heavy parallax
  useFrame((state) => {
    if (!groupRef.current || !knotRef.current || !icosaRef.current) return;
    
    // Smooth time-based rotation
    const time = state.clock.elapsedTime;
    knotRef.current.rotation.x = time * 0.1;
    knotRef.current.rotation.y = time * 0.15;
    
    icosaRef.current.rotation.x = time * 0.2;
    icosaRef.current.rotation.z = time * 0.1;

    // Scroll calculations for heavy parallax
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const scrollProgress = scrollY * 0.002; // Very slow, heavy progression
    
    // React Three Fiber provides normalized mouse coordinates (-1 to 1)
    const targetX = state.pointer.x * 2;
    const targetY = state.pointer.y * 2;

    // The objects float UP as you scroll DOWN, creating a beautiful parallax
    const targetGroupY = scrollProgress * 5;
    
    // Smoothly interpolate the entire group's position for mouse and scroll
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += ((targetGroupY + targetY) - groupRef.current.position.y) * 0.03;
  });

  // Premium Glass Material Settings
  const glassMaterialProps = {
    thickness: 2.5,
    roughness: 0.1,
    transmission: 1, // Completely transparent/refractive
    ior: 1.5, // Index of refraction (glass)
    chromaticAberration: 0.06, // Premium rainbow edge splitting
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    color: '#ffffff'
  };

  return (
    <group ref={groupRef}>
      {/* Heavy, floating Torus Knot */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <TorusKnot ref={knotRef} args={[3, 1, 256, 64]} position={[-3, 0, -5]}>
          <MeshTransmissionMaterial {...glassMaterialProps} />
        </TorusKnot>
      </Float>

      {/* Heavy, floating Icosahedron */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh ref={icosaRef} position={[4, -2, -2]}>
          <icosahedronGeometry args={[2.5, 0]} />
          <MeshTransmissionMaterial {...glassMaterialProps} />
        </mesh>
      </Float>
    </group>
  );
};

const BackgroundScene = () => {
  return (
    <div className="background-scene-container">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }} // Tighter FOV for premium cinematic feel
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#030108']} /> {/* Ultra-deep midnight background */}
        
        {/* Subtle Ambient Light */}
        <ambientLight intensity={0.5} />
        
        {/* Sharp directional light for specular highlights on the glass */}
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={2} 
          color="#ffffff" 
        />
        
        {/* Beautiful backlighting to catch the edges of the crystal */}
        <pointLight 
          position={[-10, -10, -10]} 
          intensity={3} 
          color="#ff4081" 
        />

        {/* Environmental reflections are CRITICAL for realistic glass */}
        <Environment preset="city" />

        {/* The glowing object to be refracted */}
        <BackgroundOrb />
        
        {/* The premium glass foreground */}
        <GlassObjects />
      </Canvas>
    </div>
  );
};

export default BackgroundScene;
