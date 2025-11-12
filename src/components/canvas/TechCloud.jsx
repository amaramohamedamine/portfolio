/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import { Ball } from './Ball';

function positionsFor(count, cols = 6, spacing = 2.6) {
  const rows = Math.ceil(count / cols);
  const offsetX = ((cols - 1) * spacing) / 2;
  const offsetY = ((rows - 1) * spacing) / 2;
  const out = [];
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = col * spacing - offsetX;
    const y = -(row * spacing - offsetY);
    const z = ((i % 5) - 2) * 0.4; // subtle depth variance
    out.push([x, y, z]);
  }
  return out;
}

export default function TechCloud({ items = [] }) {
  const pos = useMemo(() => positionsFor(items.length, 6, 2.6), [items.length]);
  return (
    <div className="w-full h-[520px] md:h-[620px] lg:h-[680px] rounded-xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur">
      <Canvas gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <ambientLight intensity={0.45} />
        <directionalLight position={[4, 6, 5]} intensity={0.7} />
        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} enablePan={false} />
          {items.map((t, i) => (
            <group key={t.name} position={pos[i]}>
              <Ball
                imgUrl={t.icon || null}
                name={t.name}
                color={t.color}
                speed={2.1 + (i % 5) * 0.12}
                rotationIntensity={1.2 + (i % 7) * 0.06}
                floatIntensity={2.4 + (i % 3) * 0.35}
              />
            </group>
          ))}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
