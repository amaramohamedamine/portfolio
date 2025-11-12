/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Preload, Decal, Text, useTexture } from '@react-three/drei';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';

const TRANSPARENT_PX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

function Floor({ size = 40 }) {
  usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -6, 0] }));
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -6, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color="#0d111d" roughness={0.95} metalness={0.02} />
    </mesh>
  );
}

function PitLevel({ radius, y, height = 1.4, thickness = 0.8, segments = 20 }) {
  const boxes = Array.from({ length: segments }, (_, i) => {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const rotY = angle + Math.PI / 2;
    return { position: [x, y, z], rotation: [0, rotY, 0] };
  });
  return boxes.map((cfg, i) => <RingWall key={i+radius} {...cfg} length={(2 * Math.PI * radius) / segments} height={height} thickness={thickness} />);
}

function RingWall({ position, rotation, length, height, thickness }) {
  useBox(() => ({ type: 'Static', args: [length, height, thickness], position, rotation }));
  return (
    <mesh position={position} rotation={rotation} visible={false}>
      <boxGeometry args={[length, height, thickness]} />
      <meshStandardMaterial transparent opacity={0} />
    </mesh>
  );
}

function Pit({ levels = 5, topRadius = 12 }) {
  const levelArr = Array.from({ length: levels }, (_, i) => ({
    radius: topRadius - i * (topRadius / (levels * 1.6)),
    y: -i * 1.25 - 0.5,
  }));
  return (
    <group>
      {levelArr.map(l => <PitLevel key={l.y} radius={l.radius} y={l.y} />)}
    </group>
  );
}

function BowlVisual({ radius = 12 }) {
  // Visual-only smooth bowl using a sphere cap
  return (
    <mesh position={[0, -1.5, 0]} rotation={[0, 0, 0]} receiveShadow>
      <sphereGeometry args={[radius, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshPhysicalMaterial
        color="#0b1530"
        roughness={0.7}
        metalness={0.1}
        transmission={0.1}
        transparent
        opacity={0.3}
        clearcoat={0.3}
        clearcoatRoughness={0.9}
        side={2} /* DoubleSide */
      />
    </mesh>
  );
}

function TechBall({ tech, radius = 1 }) {
  const [decal] = useTexture([tech.icon || TRANSPARENT_PX]);
  const [ref, api] = useSphere(() => ({
    mass: 1,
    args: [radius],
    position: [ (Math.random() - 0.5) * 8, 2 + Math.random() * 4, (Math.random() - 0.5) * 8 ],
    material: { restitution: 0.65, friction: 0.4 },
  }));
  const dragging = useRef(false);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!dragging.current) return;
    const mouse = state.pointer.clone();
    const x = (mouse.x * viewport.width) * 5;
    const z = (mouse.y * viewport.height) * -5;
    // Clamp inside top radius slightly smaller
    const r = Math.hypot(x, z);
    const maxR = 10.5;
    const scale = r > maxR ? maxR / r : 1;
    api.position.set(x * scale, -1, z * scale);
    api.velocity.set(0, 0, 0);
    api.angularVelocity.set(0, 0, 0);
  });

  const onPointerDown = () => { dragging.current = true; };
  const onPointerUp = () => { dragging.current = false; };
  const onPointerMissed = () => { dragging.current = false; };

  return (
    <group ref={ref} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerMissed={onPointerMissed}>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[radius, 1]} />
        <meshStandardMaterial color={tech.color || '#fff8eb'} roughness={0.55} metalness={0.05} flatShading />
        {tech.icon && <Decal position={[0, 0, radius]} rotation={[2 * Math.PI, 0, 6.25]} flatShading map={decal} />}
        {!tech.icon && (
          <Text position={[0,0,radius*1.05]} fontSize={radius*0.45} color="#0e1326" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#ffffff">
            {tech.name?.length > 8 ? tech.name.split(' ').map(w=>w[0]).join('').slice(0,3).toUpperCase() : tech.name}
          </Text>
        )}
      </mesh>
    </group>
  );
}

export default function TechPit({ items = [] }) {
  const list = useMemo(() => items.slice(0, 28), [items]);
  return (
    <div className="w-full h-[560px] md:h-[640px] lg:h-[720px] rounded-xl overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] border border-white/10 relative">
      <div className="absolute top-2 left-3 z-10 text-xs text-white/70 select-none">Drag the balls inside the bowl</div>
      <Canvas shadows gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[7, 12, 7]} intensity={1.0} castShadow shadow-mapSize={[1024,1024]} />
        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI * 0.55} />
          <Physics gravity={[0,-9.8,0]} broadphase="SAP" allowSleep>
            <Floor />
            <Pit />
            <BowlVisual />
            {list.map((t,i) => <TechBall key={t.name + i} tech={t} />)}
          </Physics>
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
