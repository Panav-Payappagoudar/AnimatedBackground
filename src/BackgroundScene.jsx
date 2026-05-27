import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import './BackgroundScene.css';

// A massive, infinite corridor of dark, glossy monolithic pillars
const ObsidianCorridor = () => {
  const groupRef = useRef();
  
  // Generate a random but deterministic layout of massive pillars
  const pillars = useMemo(() => {
    const arr = [];
    
    // Deterministic pseudo-random generator to satisfy React strict purity rules
    const pseudoRandom = (seed) => {
      const x = Math.sin(seed * 999.99) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < 60; i++) {
      // Scatter pillars along a massive Z-axis track
      const zPos = 10 - (i * 3.5); 
      
      // Randomly position on left or right to form a corridor
      const isLeft = pseudoRandom(i * 1.1) > 0.5;
      const xPos = isLeft ? -2 - pseudoRandom(i * 1.2) * 8 : 2 + pseudoRandom(i * 1.3) * 8;
      
      // Randomize height and width of the monoliths
      const height = 10 + pseudoRandom(i * 1.4) * 20;
      const width = 1 + pseudoRandom(i * 1.5) * 3;
      const depth = 1 + pseudoRandom(i * 1.6) * 3;
      
      // Randomize subtle rotation
      const rotY = (pseudoRandom(i * 1.7) - 0.5) * 0.5;

      arr.push({ x: xPos, y: 0, z: zPos, w: width, h: height, d: depth, ry: rotY });
    }
    return arr;
  }, []);

  // Cinematic Scrollytelling Camera Animation
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // 1. Calculate scroll percentage for the Apple-style timeline
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const maxScroll = Math.max((document.documentElement?.scrollHeight || 3000) - window.innerHeight, 1000);
    const scrollFraction = Math.max(0, Math.min(scrollY / maxScroll, 1));
    
    // 2. Fly the camera down the massive Z-axis corridor
    // Start at Z=15, fly down to Z=-180
    const targetCamZ = 15 - (scrollFraction * 195);
    
    // 3. Cinematic X/Y Panning
    // As you fly, gently weave left and right between the pillars
    const targetCamX = Math.sin(scrollFraction * Math.PI * 4) * 2;
    // Gently bob up and down
    const targetCamY = Math.cos(scrollFraction * Math.PI * 8) * 1;
    
    // Combine scroll panning with dynamic mouse tracking
    const mouseX = state.pointer.x * 2;
    const mouseY = state.pointer.y * 2;

    // Smoothly interpolate camera to the cinematic target
    state.camera.position.x += ((targetCamX + mouseX) - state.camera.position.x) * 0.05;
    state.camera.position.y += ((targetCamY + mouseY) - state.camera.position.y) * 0.05;
    state.camera.position.z += (targetCamZ - state.camera.position.z) * 0.05;
    
    // Look slightly ahead and weave with the path
    state.camera.lookAt(targetCamX * 0.5, targetCamY * 0.5, targetCamZ - 15);
  });

  return (
    <group ref={groupRef}>
      {pillars.map((p, i) => (
        <Float key={i} speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh position={[p.x, p.y, p.z]} rotation={[0, p.ry, 0]}>
            {/* Massive geometric pillar */}
            <boxGeometry args={[p.w, p.h, p.d]} />
            {/* Ultra-premium dark obsidian glass material */}
            <meshStandardMaterial 
              color="#020202"
              metalness={0.9}
              roughness={0.1}
              envMapIntensity={1.5}
            />
          </mesh>
        </Float>
      ))}
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
        camera={{ position: [0, 0, 15], fov: 60 }} 
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        
        {/* Sharp, dramatic studio lights to catch the edges of the obsidian */}
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={3} 
          color="#ffffff" 
        />
        <directionalLight 
          position={[-10, 20, -10]} 
          intensity={2} 
          color="#aa88ff" 
        />
        
        {/* Adds beautiful environmental reflections to the dark monoliths */}
        <Environment preset="studio" />
        
        {/* The Obsidian Corridor */}
        <ObsidianCorridor />
      </Canvas>
    </div>
  );
};

export default BackgroundScene;
