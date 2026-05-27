import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './BackgroundScene.css';

const count = 50000;

// Generate the galaxy structure once outside the component
const generateGalaxy = () => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  const colorInside = new THREE.Color('#ffffff');
  const colorOutside = new THREE.Color('#3a2e5d');
  
  for(let i=0; i<count; i++) {
    const radius = Math.random() * 12;
    const branchAngle = (i % 3) / 3 * Math.PI * 2;
    const spinAngle = radius * 1;
    
    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * radius;
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * radius;
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * radius;
    
    positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i * 3 + 1] = randomY;
    positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    
    const mixedColor = colorInside.clone().lerp(colorOutside, radius / 12);
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }
  return { positions, colors };
};

const galaxyData = generateGalaxy();

const Galaxy = () => {
  const pointsRef = useRef();
  
  const positions = galaxyData.positions;
  const colors = galaxyData.colors;

  // Animation loop provided perfectly by React Three Fiber
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // 1. Rotate the galaxy over time
    const time = state.clock.elapsedTime;
    pointsRef.current.rotation.y = time * 0.15;
    
    // 2. Parallax and scroll calculations
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const scrollProgress = scrollY * 0.005;
    
    // Zoom in as we scroll
    const radius = Math.max(2, 20 - (scrollProgress * 15));
    // Rotate camera around the scene as we scroll
    const angle = scrollProgress * 3.0;

    // React Three Fiber provides normalized mouse coordinates (-1 to 1) via state.pointer
    const targetX = state.pointer.x * 5;
    const targetY = state.pointer.y * 5;

    // Calculate final target camera position
    const targetCamX = (Math.sin(angle) * radius) + targetX;
    const targetCamZ = (Math.cos(angle) * radius);
    const targetCamY = -targetY + 5 - (scrollProgress * 3);

    // Smoothly interpolate current camera position towards target
    state.camera.position.x += (targetCamX - state.camera.position.x) * 0.05;
    state.camera.position.y += (targetCamY - state.camera.position.y) * 0.05;
    state.camera.position.z += (targetCamZ - state.camera.position.z) * 0.05;
    
    // Always look at the center of the galaxy
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={pointsRef} rotation-x={Math.PI * 0.1}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors={true}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
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
        <fog attach="fog" args={['#06040A', 0.001]} />
        <Galaxy />
      </Canvas>
    </div>
  );
};

export default BackgroundScene;
