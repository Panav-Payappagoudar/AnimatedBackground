import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float, TorusKnot } from '@react-three/drei';
import './BackgroundScene.css';

// Background orb removed as requested

const GlassObjects = () => {
  const groupRef = useRef();
  const knotRef = useRef();
  const icosaRef = useRef();
  const octaRef = useRef();
  const cylRef = useRef();

  // Animation loop for buttery smooth, heavy parallax
  useFrame((state) => {
    if (!groupRef.current || !knotRef.current || !icosaRef.current || !octaRef.current || !cylRef.current) return;
    
    // Scroll calculations for heavy parallax
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const scrollRotation = scrollY * 0.002; // Map scroll directly to rotation!
    
    // Smooth time-based rotation + Scroll rotation
    const time = state.clock.elapsedTime;
    knotRef.current.rotation.x = time * 0.1 + scrollRotation;
    knotRef.current.rotation.y = time * 0.15 + scrollRotation * 1.5;
    
    icosaRef.current.rotation.x = time * 0.2 - scrollRotation;
    icosaRef.current.rotation.z = time * 0.1 + scrollRotation * 0.5;

    octaRef.current.rotation.y = time * 0.3 + scrollRotation;
    octaRef.current.rotation.x = time * 0.1;

    cylRef.current.rotation.x = time * 0.1 - scrollRotation * 0.5;
    cylRef.current.rotation.z = time * 0.2 + scrollRotation;

    // React Three Fiber provides normalized mouse coordinates (-1 to 1)
    const targetX = state.pointer.x * 1.5;
    const targetY = state.pointer.y * 1.5;

    // VERY subtle vertical parallax so it never leaves the screen
    // Math.sin creates a gentle bounding box for the movement
    const targetGroupY = Math.sin(scrollY * 0.001) * 2; 
    
    // Smoothly interpolate the entire group's position for mouse and scroll
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += ((targetGroupY + targetY) - groupRef.current.position.y) * 0.03;
  });

  const glassMaterialProps = {
    thickness: 3.5, // Thicker glass catches more color
    roughness: 0.1,
    transmission: 1, 
    ior: 1.5, 
    chromaticAberration: 0.08, // Enhanced rainbow edges
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
      {/* New Shape: Floating Octahedron */}
      <Float speed={2.5} rotationIntensity={2} floatIntensity={1.5}>
        <mesh ref={octaRef} position={[-4, 2, -3]}>
          <octahedronGeometry args={[1.8, 0]} />
          <MeshTransmissionMaterial {...glassMaterialProps} />
        </mesh>
      </Float>
      
      {/* New Shape: Soft Cylinder */}
      <Float speed={1} rotationIntensity={1.2} floatIntensity={2}>
        <mesh ref={cylRef} position={[3, 3, -4]}>
          <cylinderGeometry args={[1.2, 1.2, 3, 32]} />
          <MeshTransmissionMaterial {...glassMaterialProps} />
        </mesh>
      </Float>
    </group>
  );
};

const BackgroundScene = () => {
  const containerRef = useRef();

  // Track mouse movement to drive the dynamic CSS gradient
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      containerRef.current.style.setProperty('--mouse-x', `${x}%`);
      containerRef.current.style.setProperty('--mouse-y', `${y}%`);
    };
    
    // Set initial center position
    if (containerRef.current) {
      containerRef.current.style.setProperty('--mouse-x', '50%');
      containerRef.current.style.setProperty('--mouse-y', '50%');
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="background-scene-container" ref={containerRef}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }} // Tighter FOV for premium cinematic feel
        gl={{ antialias: true, alpha: true }}
      >
        
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
        
        {/* The premium glass foreground */}
        <GlassObjects />
      </Canvas>
    </div>
  );
};

export default BackgroundScene;
