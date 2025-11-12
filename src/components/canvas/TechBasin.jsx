/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Preload, Decal, Text, useTexture } from '@react-three/drei';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';

const TRANSPARENT_PX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

function Floor({ size = 30 }) {
  usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -2, 0] }));
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color="#0f1426" roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

function RingWalls({ radius = 9, segments = 16, height = 4, thickness = 0.6 }) {
  const boxes = Array.from({ length: segments }, (_, i) => {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const rotY = angle + Math.PI / 2;
    return { position: [x, 0, z], rotation: [0, rotY, 0] };
  });
  return boxes.map((cfg, i) => <Wall key={i} position={cfg.position} rotation={cfg.rotation} length={(2 * Math.PI * radius) / segments} height={height} thickness={thickness} />);
}

function Wall({ position, rotation, length, height, thickness }) {
  useBox(() => ({ type: 'Static', args: [length, height, thickness], position, rotation }));
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[length, height, thickness]} />
      <meshStandardMaterial color="#1a2347" roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

function TechBall({ tech, radius = 1 }) {
  const [decal] = useTexture([tech.icon || TRANSPARENT_PX]);
  const [ref, api] = useSphere(() => ({ mass: 1, args: [radius], position: [
    (Math.random() - 0.5) * 6,
    4 + Math.random() * 3,
    (Math.random() - 0.5) * 6,
  ], material: { restitution: 0.65, friction: 0.3 } }));

  const { viewport } = useThree();
  const dragging = useRef(false);

  useFrame((state) => {
    if (!dragging.current) return;
    // Project mouse onto y = 0 plane and set target position (clamped within basin radius - margin)
    const mouse = state.pointer.clone();
    const x = (mouse.x * viewport.width) / 2;
    const z = (mouse.y * viewport.height) / -2;
    const r = Math.hypot(x, z);
    const maxR = 7.5;
    const scale = r > maxR ? maxR / r : 1;
    api.position.set(x * scale, 0.5, z * scale);
    api.velocity.set(0, 0, 0);
    api.angularVelocity.set(0, 0, 0);
  });

  const onPointerDown = () => {
    dragging.current = true;
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onPointerMissed = () => {
    dragging.current = false;
  };

  return (
    <group ref={ref} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerMissed={onPointerMissed}>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[radius, 1]} />
        <meshStandardMaterial color={tech.color || '#fff8eb'} roughness={0.55} metalness={0.05} polygonOffset={-5} flatShading />
        {tech.icon && (
          <Decal position={[0, 0, radius]} rotation={[2 * Math.PI, 0, 6.25]} flatShading map={decal} />
        )}
        {!tech.icon && (
          <Text position={[0, 0, radius * 1.05]} fontSize={radius * 0.45} color="#0e1326" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#ffffff">
            {tech.name?.length > 8 ? tech.name.split(' ').map(w => w[0]).join('').slice(0,3).toUpperCase() : tech.name}
          </Text>
        )}
      </mesh>
    </group>
  );
}

export default function TechBasin({ items = [] }) {
  const list = useMemo(() => items.slice(0, 24), [items]);
  return (
    <div className="w-full h-[520px] md:h-[600px] lg:h-[680px] rounded-xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur">
      <Canvas shadows gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[6, 10, 6]} intensity={0.9} castShadow shadow-mapSize={[1024,1024]} />
        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI * 0.5} />
          <Physics gravity={[0, -9.8, 0]} broadphase="SAP" allowSleep>
            <Floor />
            <RingWalls />
            {list.map((t, i) => (
              <TechBall key={t.name + i} tech={t} index={i} />
            ))}
          </Physics>
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
