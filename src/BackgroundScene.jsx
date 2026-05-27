import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import './BackgroundScene.css';

// A massive, flowing abstract ribbon that snakes through the background
const CinematicRibbon = () => {
  const ribbonRef = useRef();
  
  // Generate a beautiful, sweeping, organic curve for the ribbon
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-15, 10, -10),
      new THREE.Vector3(-5, -5, -5),
      new THREE.Vector3(0, 2, 0),
      new THREE.Vector3(5, -2, 5),
      new THREE.Vector3(15, 8, 10),
      new THREE.Vector3(25, -10, 15),
    ], false, 'catmullrom', 0.5);
  }, []);

  // Premium Glass Material Settings (kept from before because it looks incredible)
  const glassMaterialProps = {
    thickness: 5.0, // Extra thick for maximum refraction
    roughness: 0.1,
    transmission: 1, 
    ior: 1.5, 
    chromaticAberration: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    color: '#ffffff'
  };

  // Cinematic Scrollytelling Camera Animation
  useFrame((state) => {
    if (!ribbonRef.current) return;
    
    // 1. Keep the ribbon organically undulating slightly so it's never completely static
    const time = state.clock.elapsedTime;
    ribbonRef.current.rotation.y = Math.sin(time * 0.1) * 0.2;
    ribbonRef.current.position.y = Math.sin(time * 0.5) * 0.5;

    // 2. Calculate exact scroll percentage (0 to 1) for the Apple-style timeline
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    // Assume a tall page, max scroll height (or a safe fallback)
    const maxScroll = Math.max((document.documentElement?.scrollHeight || 3000) - window.innerHeight, 1000);
    const scrollFraction = Math.max(0, Math.min(scrollY / maxScroll, 1));
    
    // 3. Cinematic Camera Flight Path based entirely on scroll position!
    // Start far back. As we scroll, SWOOP IN and sweep across the ribbon.
    
    // X sweeps from left (-8) to right (8)
    const targetCamX = -8 + (scrollFraction * 16); 
    
    // Y swoops down deeply in the middle of the scroll, then back up
    const targetCamY = Math.cos(scrollFraction * Math.PI * 2) * 5;
    
    // Z zooms incredibly close to the ribbon at 50% scroll (zoom in), then out again
    const targetCamZ = 20 - Math.sin(scrollFraction * Math.PI) * 16; 
    
    // Add very subtle mouse parallax on top of the cinematic flight
    const mouseX = state.pointer.x * 1.5;
    const mouseY = state.pointer.y * 1.5;

    // Smoothly interpolate camera to the cinematic target
    state.camera.position.x += ((targetCamX + mouseX) - state.camera.position.x) * 0.05;
    state.camera.position.y += ((targetCamY + mouseY) - state.camera.position.y) * 0.05;
    state.camera.position.z += (targetCamZ - state.camera.position.z) * 0.05;
    
    // The camera always perfectly frames the ribbon as it flies past
    const lookTargetX = scrollFraction * 10 - 5;
    state.camera.lookAt(lookTargetX, 0, 0);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={ribbonRef}>
        {/* Extrude the curve into a massive tube */}
        <tubeGeometry args={[curve, 128, 1.5, 32, false]} />
        <MeshTransmissionMaterial {...glassMaterialProps} />
      </mesh>
    </Float>
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
        camera={{ position: [0, 0, 20], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={2} 
          color="#ffffff" 
        />
        
        <pointLight 
          position={[-10, -10, -10]} 
          intensity={3} 
          color="#ff4081" 
        />

        <Environment preset="city" />
        
        {/* The premium cinematic scrollytelling ribbon */}
        <CinematicRibbon />
      </Canvas>
    </div>
  );
};

export default BackgroundScene;
