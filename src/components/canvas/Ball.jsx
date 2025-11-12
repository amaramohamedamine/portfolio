/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Decal, Float, OrbitControls, Preload, useTexture, Text } from '@react-three/drei';
import CanvasLoader from '../Loader';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

const TRANSPARENT_PX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
const Ball = ({ imgUrl, name = ' ', color = '#fff8eb', speed = 2, rotationIntensity = 1.5, floatIntensity = 3 }) => {
  const [decal] = useTexture([imgUrl || TRANSPARENT_PX]);
  const meshRef = useRef();

  const reduceMotion = usePrefersReducedMotion();
  // Apply continuous rotation to the ball, unless user prefers reduced motion
  useFrame(() => {
    if (meshRef.current) {
      if (reduceMotion) return;
      meshRef.current.rotation.y += 0.00001;  // Rotate on Y-axis
      meshRef.current.rotation.x += 0.00005; // Add slight X-axis rotation for more natural movement
    }
  });

  return (
    <Float speed={speed} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 3, 2]} intensity={0.6} />
      <pointLight position={[-2, -2, 2]} intensity={0.35} />
      <mesh ref={meshRef} castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} polygonOffset={-5} flatShading />
        {imgUrl && (
          <Decal
            position={[0, 0, 1]}
            rotation={[2 * Math.PI, 0, 6.25]}
            flatShading
            map={decal}
          />
        )}
        {!imgUrl && (
          <Text
            position={[0, 0, 1.05]}
            fontSize={0.45}
            color="#0e1326"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#ffffff"
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#.+- "
          >
            {name?.length > 8 ? name.split(' ').map(w => w[0]).join('').slice(0,3).toUpperCase() : name}
          </Text>
        )}
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon, name, color, index = 0 }) => {
  // Slightly vary float and rotation intensity per ball for a more organic feel
  const base = 2;
  const speed = base + (index % 5) * 0.15;
  const rotationIntensity = 1.3 + (index % 7) * 0.05;
  const floatIntensity = 2.6 + (index % 3) * 0.3;
  return (
    <Canvas
      frameloop={"always"}  // Ensure continuous frame rendering for smooth animation
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} />
        <Ball imgUrl={icon} name={name} color={color} speed={speed} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;
export { Ball };