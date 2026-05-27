import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import './BackgroundScene.css';

// A massive, fluid sphere that we place the camera INSIDE of.
// Because the camera is inside, the walls of the sphere become the entire screen.
const ImmersiveCavern = () => {
  const cavernRef = useRef();
  
  // Scrollytelling Animation Loop
  useFrame((state) => {
    if (!cavernRef.current) return;
    
    // 1. Base organic movement so the walls are always flowing like liquid
    const time = state.clock.elapsedTime;
    
    // 2. Calculate scroll percentage for the Apple-style timeline
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const maxScroll = Math.max((document.documentElement?.scrollHeight || 3000) - window.innerHeight, 1000);
    const scrollFraction = Math.max(0, Math.min(scrollY / maxScroll, 1)); // 0 to 1
    
    // 3. Cinematic Full-Screen Warping
    // As you scroll, the entire cavern violently spins and warps around you
    const scrollRotation = scrollFraction * Math.PI * 2; // Full 360 spin during scroll
    cavernRef.current.rotation.y = time * 0.1 + scrollRotation;
    cavernRef.current.rotation.x = time * 0.05 + (scrollRotation * 0.5);

    // 4. Camera FOV Zoom Effect
    // Start with a wide view (75), then zoom incredibly deep (30) at the end of the scroll
    const targetFov = 75 - (scrollFraction * 45); 
    state.camera.fov += (targetFov - state.camera.fov) * 0.05;
    state.camera.updateProjectionMatrix();

    // 5. Aggressive Camera Panning
    // The camera physically moves around inside the sphere based on scroll
    const targetCamX = Math.sin(scrollFraction * Math.PI) * 4;
    const targetCamZ = Math.cos(scrollFraction * Math.PI) * 4;
    
    // Combine scroll panning with dynamic mouse tracking
    const mouseX = state.pointer.x * 2;
    const mouseY = state.pointer.y * 2;

    state.camera.position.x += ((targetCamX + mouseX) - state.camera.position.x) * 0.05;
    state.camera.position.y += (mouseY - state.camera.position.y) * 0.05;
    state.camera.position.z += ((targetCamZ) - state.camera.position.z) * 0.05;
    
    // Always look at the dead center of the cavern as we spin around it
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <mesh ref={cavernRef}>
      {/* Massive sphere that completely engulfs the camera */}
      <sphereGeometry args={[15, 128, 128]} />
      
      {/* 
        MeshDistortMaterial physically warps the vertices like a fluid.
        By setting side to BackSide, we render the INSIDE walls of the sphere!
      */}
      <MeshDistortMaterial
        side={THREE.BackSide} 
        color="#ffffff"
        transparent={true}
        opacity={0.25} // Soft frosted transparency
        metalness={0.1} // REMOVED mirror effect so it doesn't reflect a literal city
        roughness={0.6} // Frosted, soft light scattering
        distort={0.6} // Aggressive liquid warping
        speed={1.5} // Smooth fluid speed
      />
    </mesh>
  );
};

const BackgroundScene = () => {
  const containerRef = useRef();

  // Track mouse movement to drive the dynamic CSS gradient underneath the cavern
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
        camera={{ position: [0, 0, 5], fov: 75 }} // Start inside the sphere
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        
        {/* Intense studio lights to catch the interior ripples of the cavern */}
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={3} 
          color="#ffffff" 
        />
        
        <pointLight 
          position={[-5, -5, -5]} 
          intensity={5} 
          color="#ff4081" 
        />

        {/* Removed the city Environment map so it's purely abstract */}
        
        {/* The full-screen immersive liquid environment */}
        <ImmersiveCavern />
      </Canvas>
    </div>
  );
};

export default BackgroundScene;
