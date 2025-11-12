/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { Suspense as ReactSuspense, useCallback, useMemo, useRef, useState, useEffect, forwardRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, Decal, Text, useTexture, Environment, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import * as THREE from 'three'; // Import THREE

const TRANSPARENT_PX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

// Lane components
function Lane({ length = 26, width = 6 }) {
  // Floor
  usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -1.5, 0] }));
  // Side walls (gutters)
  const wallH = 1.5, wallT = 0.5;
  useBox(() => ({ type: 'Static', args: [wallT, wallH, length], position: [width/2, -1.5 + wallH/2, 0] }));
  useBox(() => ({ type: 'Static', args: [wallT, wallH, length], position: [-width/2, -1.5 + wallH/2, 0] }));
  // Back wall to stop pins
  useBox(() => ({ type: 'Static', args: [width, wallH, wallT], position: [0, -1.5 + wallH/2, -length/2] }));
  // Front wall to prevent ball exiting towards camera
  useBox(() => ({ type: 'Static', args: [width, wallH, wallT], position: [0, -1.5 + wallH/2, length/2] }));
  return (
    <group>
      {/* Lane deck */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#a67c52" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* Center guide line */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.49, 0]}>
        <planeGeometry args={[0.05, length]} />
        <meshStandardMaterial color="#f5f5f5" transparent opacity={0.2} />
      </mesh>
      {/* Visual side boards */}
      <mesh position={[width/2, -1.5 + wallH/2, 0]} castShadow>
        <boxGeometry args={[wallT, wallH, length]} />
        <meshStandardMaterial color="#4a2f18" roughness={0.9} />
      </mesh>
      <mesh position={[-width/2, -1.5 + wallH/2, 0]} castShadow>
        <boxGeometry args={[wallT, wallH, length]} />
        <meshStandardMaterial color="#4a2f18" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Pins
function usePinSetup({ laneLen = 26, rows = 4, spacing = 0.8 }) {
  // Triangle arrangement at the far end (negative z)
  const baseZ = -laneLen/2 + 4;
  const pinPositions = [];
  let z = baseZ;
  for (let r = 0; r < rows; r++) {
    const rowCount = rows - r;
    const rowWidth = (rowCount - 1) * spacing;
    for (let i = 0; i < rowCount; i++) {
      const x = -rowWidth/2 + i * spacing;
      pinPositions.push([x, -0.8, z]);
    }
    z += spacing * 1.05;
  }
  return pinPositions;
}

function Pin({ position, size = [0.35, 1.2, 0.35] }) {
  // Physics body as box for stability
  const [ref] = useBox(() => ({ 
    mass: 0.5, 
    args: size, 
    position, 
    material: { restitution: 0.3, friction: 0.7 } 
  }));
  const bodyH = size[1];
  
  return (
    <group ref={ref}>
      {/* Invisible physics box */}
      <mesh visible={false}>
        <boxGeometry args={size} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      {/* Visible pin: realistic bowling pin shape */}
      <group position={[0, 0, 0]}>
        {/* Bottom base (wider) */}
        <mesh castShadow receiveShadow position={[0, -bodyH * 0.38, 0]}>
          <cylinderGeometry args={[0.28, 0.32, bodyH * 0.25, 24]} />
          <meshStandardMaterial 
            color="#f8f8f8" 
            roughness={0.3} 
            metalness={0.1}
          />
        </mesh>
        {/* Middle body (narrow waist) */}
        <mesh castShadow receiveShadow position={[0, -bodyH * 0.1, 0]}>
          <cylinderGeometry args={[0.19, 0.25, bodyH * 0.4, 24]} />
          <meshStandardMaterial 
            color="#f8f8f8" 
            roughness={0.3} 
            metalness={0.1}
          />
        </mesh>
        {/* Upper neck (tapered) */}
        <mesh castShadow receiveShadow position={[0, bodyH * 0.22, 0]}>
          <cylinderGeometry args={[0.17, 0.19, bodyH * 0.25, 24]} />
          <meshStandardMaterial 
            color="#f8f8f8" 
            roughness={0.3} 
            metalness={0.1}
          />
        </mesh>
        {/* Top cap (rounded head) */}
        <mesh castShadow receiveShadow position={[0, bodyH * 0.42, 0]}>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial 
            color="#f8f8f8" 
            roughness={0.3} 
            metalness={0.1}
          />
        </mesh>
        {/* Red stripes */}
        <mesh castShadow position={[0, bodyH * 0.15, 0]}>
          <torusGeometry args={[0.195, 0.025, 12, 24]} />
          <meshStandardMaterial color="#d32f2f" roughness={0.4} />
        </mesh>
        <mesh castShadow position={[0, bodyH * 0.25, 0]}>
          <torusGeometry args={[0.18, 0.025, 12, 24]} />
          <meshStandardMaterial color="#d32f2f" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

// Arrow indicator for aiming - optimized geometries
function AimArrow({ direction, power, visible }) {
  const arrowLength = 2 + power * 3;
  const arrowWidth = 0.15;
  const rotation = Math.atan2(direction[0], -direction[2]);
  
  // Memoize geometries to prevent recreation
  const shaftGeom = useMemo(() => new THREE.CylinderGeometry(arrowWidth * 0.6, arrowWidth * 0.6, 1, 6), [arrowWidth]);
  const headGeom = useMemo(() => new THREE.ConeGeometry(arrowWidth * 2.5, arrowWidth * 5, 6), [arrowWidth]);
  const ringGeoms = useMemo(() => [
    new THREE.RingGeometry(0.8, 0.9, 24),
    new THREE.RingGeometry(1.1, 1.2, 24),
    new THREE.RingGeometry(1.4, 1.5, 24)
  ], []);
  
  if (!visible) return null;
  
  return (
    <group position={[0, 0.5, 0]}>
      {/* Arrow shaft */}
      <mesh rotation={[-Math.PI / 2, 0, rotation]} scale={[1, arrowLength, 1]}>
        <primitive object={shaftGeom} />
        <meshBasicMaterial 
          color="#00ff88" 
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>
      {/* Arrow head */}
      <mesh 
        position={[
          direction[0] * arrowLength * 0.5,
          0,
          direction[2] * arrowLength * 0.5
        ]}
        rotation={[-Math.PI / 2, 0, rotation]}
      >
        <primitive object={headGeom} />
        <meshBasicMaterial 
          color="#00ff88" 
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>
      {/* Power indicator rings */}
      {[0.3, 0.6, 0.9].map((t, i) => (
        power > t && (
          <mesh 
            key={i}
            position={[0, 0.05, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <primitive object={ringGeoms[i]} />
            <meshBasicMaterial 
              color="#00ff88" 
              transparent
              opacity={0.5}
              depthWrite={false}
            />
          </mesh>
        )
      ))}
    </group>
  );
}

// Tech ball with click-to-aim mechanic
const TechBall = forwardRef(function TechBall({ tech, radius = 0.6, onLaunched, onRest, onAimingChange, area = { width: 6, length: 26 } }, forwardedRef) {
  const [decal] = useTexture([tech.icon || TRANSPARENT_PX]);
  const startPos = useMemo(() => [0, -0.5, area.length / 2 - 4], [area.length]);
  const [ref, api] = useSphere(() => ({
    mass: 1,
    args: [radius],
    position: startPos,
    material: { restitution: 0.28, friction: 0.55 },
    sleepSpeedLimit: 0.05,
    sleepTimeLimit: 1.0,
    linearDamping: 0.05,
    angularDamping: 0.05,
  }));

  // Expose physics group outward so CameraRig can follow
  useEffect(() => {
    if (forwardedRef) {
      forwardedRef.current = ref.current;
    }
  }, [forwardedRef, ref]);

  const { viewport, size } = useThree();
  const [aiming, setAiming] = useState(false);
  const [aimDirection, setAimDirection] = useState([0, 0, -1]);
  const [aimPower, setAimPower] = useState(0.5);
  const launched = useRef(false);
  const lastVel = useRef([0, 0, 0]);
  const restingFrames = useRef(0);
  const aimStartPos = useRef({ x: 0, y: 0 });

  // Subscribe to velocity from cannon
  useEffect(() => {
    const unsub = api.velocity.subscribe((v) => { lastVel.current = v; });
    return unsub;
  }, [api.velocity]);

  // Notify parent of aiming state
  useEffect(() => {
    onAimingChange?.(aiming);
  }, [aiming, onAimingChange]);

  // Sphere geometry memo
  const sphereGeometry = useMemo(() => <sphereGeometry args={[radius, 32, 32]} />, [radius]);

  const onPointerDown = (e) => {
    e.stopPropagation();
    if (launched.current) return;
    
    if (!aiming) {
      // First click: start aiming
      setAiming(true);
      aimStartPos.current = { x: e.clientX, y: e.clientY };
      document.body.style.cursor = 'crosshair';
    } else {
      // Second click: launch ball immediately
      e.stopPropagation();
      
      const powerScale = 50;
      const impulse = [
        aimDirection[0] * aimPower * powerScale,
        0,
        aimDirection[2] * aimPower * powerScale
      ];

      // Reset spin and launch
      api.angularVelocity.set(0, 0, 0);
      api.velocity.set(0, 0, 0);
      api.applyImpulse(impulse, [0, 0, 0]);
      
      launched.current = true;
      setAiming(false);
      document.body.style.cursor = 'default';
      onLaunched?.();
    }
  };

  const onPointerMove = (e) => {
    if (!aiming || launched.current) return;
    
    // Use requestAnimationFrame to throttle updates
    if (!aimStartPos.current.rafId) {
      aimStartPos.current.rafId = requestAnimationFrame(() => {
        // Calculate aim direction from mouse movement
        const dx = e.clientX - aimStartPos.current.x;
        const dy = e.clientY - aimStartPos.current.y;
        
        // Normalize to viewport
        const nx = (dx / size.width) * viewport.width * 0.5;
        const ny = (dy / size.height) * viewport.height;
        
        // Calculate direction - drag DOWN and to the sides
        const dirX = nx * 0.8;
        const dirZ = -Math.max(0.5, Math.abs(ny) * 1.5);
        const len = Math.hypot(dirX, dirZ);
        
        if (len > 0.1) {
          setAimDirection([dirX / len, 0, dirZ / len]);
          const power = Math.min(1.0, Math.max(0.3, Math.abs(ny) / 3));
          setAimPower(power);
        }
        
        aimStartPos.current.rafId = null;
      });
    }
  };

  // Detect rest to notify completion
  useFrame(() => {
    if (!launched.current) return;
    const v = lastVel.current;
    const speed = Math.hypot(v[0], v[1], v[2]);
    if (speed < 0.25) {
      restingFrames.current += 1;
    } else {
      restingFrames.current = 0;
    }
    if (restingFrames.current > 35) {
      onRest?.();
      restingFrames.current = 0;
      launched.current = false;
    }
  });

  return (
    <group>
      <group
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        <mesh castShadow receiveShadow>
          {sphereGeometry}
          <meshPhysicalMaterial
            color={tech.color || '#99b3ff'}
            roughness={0.32}
            metalness={0.35}
            clearcoat={0.65}
            clearcoatRoughness={0.55}
          />
          {tech.icon && (
            <Decal
              position={[0, 0, radius]}
              rotation={[0, 0, 0]}
              scale={[radius * 1.4, radius * 1.4, 1]}
              map={decal}
            />
          )}
          {!tech.icon && (
            <Text
              position={[0, 0, radius * 1.05]}
              fontSize={radius * 0.55}
              color="#0e1326"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#ffffff"
            >
              {tech.name?.length > 8
                ? tech.name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
                : tech.name}
            </Text>
          )}
        </mesh>
      </group>
      {/* Arrow indicator */}
      <AimArrow direction={aimDirection} power={aimPower} visible={aiming} />
    </group>
  );
});

// Camera rig - fixed behind ball looking toward pins
function CameraRig({ ballRef, launchedRef, area }){
  const { camera, controls } = useThree();
  const startZ = useMemo(() => area.length / 2 - 4, [area.length]);
  const homePos = useMemo(() => ({ x: 0, y: 8, z: startZ + 16 }), [startZ]);
  const lookAtPins = useMemo(() => new THREE.Vector3(0, 0, -area.length / 2 + 2), [area.length]);
  
  useFrame(() => {
    // Disable OrbitControls to lock camera
    if (controls) {
      controls.enabled = false;
    }

    if (ballRef.current && launchedRef.current) {
      // Follow ball when launched
      try {
        const ball = ballRef.current;
        const ballPos = ball.position;
        
        let ballX = 0, ballY = -0.5, ballZ = area.length/2 - 4;
        if (ballPos) {
          if (Array.isArray(ballPos)) {
            [ballX, ballY, ballZ] = ballPos;
          } else {
            ballX = ballPos.x || 0;
            ballY = ballPos.y || -0.5;
            ballZ = ballPos.z || (area.length/2 - 4);
          }
        }
        
        // Camera stays behind ball, moves forward as ball moves
        const targetZ = ballZ + 16;
        const targetY = 8;
        
        camera.position.x += (ballX - camera.position.x) * 0.1;
        camera.position.y += (targetY - camera.position.y) * 0.1;
        camera.position.z += (targetZ - camera.position.z) * 0.1;
        
        // Look toward pins (ahead of ball)
        const lookTarget = new THREE.Vector3(ballX, ballY, ballZ - 8);
        camera.lookAt(lookTarget);
      } catch (error) {
        console.warn('Camera rig error:', error);
      }
    } else {
      // Default position when not launched - behind ball looking at pins
      camera.position.x += (homePos.x - camera.position.x) * 0.15;
      camera.position.y += (homePos.y - camera.position.y) * 0.15;
      camera.position.z += (homePos.z - camera.position.z) * 0.15;
      camera.lookAt(lookAtPins);
    }
  });
  
  return null;
}

// Animated starfield background
function SpaceBackground() {
  const count = 300;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 20;
    }
    return pos;
  }, []);

  const pointsRef = useRef();

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#88ccff"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}

// Simple fallback environment to avoid framebuffer issues
function FallbackEnvironment() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
    </>
  );
}

export default function TechBowling({ items = [] }) {
  const technologies = useMemo(() => items.filter(Boolean), [items]);
  const [index, setIndex] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const area = { width: 6, length: 26 };

  const pins = usePinSetup({ width: area.width, laneLen: area.length, rows: 4, spacing: 1.2 });

  const nextBall = useCallback(() => {
    setIndex((i) => (i + 1) % technologies.length);
  }, [technologies.length]);

  const onRoundComplete = useCallback(() => {
    setResetKey((k) => k + 1);
    setTimeout(() => {
      nextBall();
    }, 1000);
  }, [nextBall]);

  const tech = technologies[index] || { name: 'Tech', color: '#99b3ff' };
  const ballRef = useRef(null);
  const launchedRef = useRef(false);

  const handleBallLaunched = useCallback(() => {
    launchedRef.current = true;
  }, []);

  const handleBallRest = useCallback(() => {
    launchedRef.current = false;
    onRoundComplete();
  }, [onRoundComplete]);

  const handleManualReset = useCallback(() => {
    setResetKey((k) => k + 1);
    launchedRef.current = false;
    // Cycle to next tech ball
    setIndex((i) => (i + 1) % technologies.length);
  }, [technologies.length]);

  const handleAimingChange = useCallback(() => {
    // Optional: could update UI based on aiming state
  }, []);

  // Set ball ref when component mounts/updates
  useEffect(() => {
    return () => {
      // Cleanup
      ballRef.current = null;
    };
  }, [resetKey]);

  return (
    <div className="w-full h-[560px] md:h-[640px] lg:h-[720px] rounded-xl overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] border border-white/10 relative">
      <div className="absolute top-2 left-3 z-10 text-xs text-white/80 select-none pointer-events-none">
        <div className="font-semibold mb-1">🎯 How to Play:</div>
        <div>1. Click the ball to enter aim mode</div>
        <div>2. Drag DOWN for power (longer = stronger)</div>
        <div>3. Drag LEFT/RIGHT to aim sideways</div>
        <div>4. Click again to launch!</div>
        <div className="mt-2">Current Tech: <span className="font-semibold text-green-400">{tech.name}</span></div>
      </div>
      
      {/* Reset Button */}
      <button
        onClick={handleManualReset}
        className="absolute top-2 right-3 z-10 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-semibold rounded-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 pointer-events-auto"
        aria-label="Reset bowling lane"
      >
        🔄 Reset
      </button>
      
      <Canvas 
        shadows 
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false
        }} 
        camera={{ position: [0, 3.2, 10], fov: 45 }}
        dpr={[1, 2]}
        frameloop="always"
      >
        <color attach="background" args={['#0a0618']} />
        
        {/* Animated space background */}
        <SpaceBackground />
        
        <ambientLight intensity={0.45} />
        <directionalLight 
          position={[6, 10, 8]} 
          intensity={0.9} 
          castShadow 
          shadow-mapSize={[256, 256]} // Further reduced for stability
          shadow-camera-far={50}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />
        
        <ReactSuspense fallback={<FallbackEnvironment />}>
          <Environment 
            preset="apartment" // Simpler environment
            onError={() => console.log('Environment failed to load')}
          />
        </ReactSuspense>
        
        {/* Camera controls - must be outside Suspense to always render */}
        <OrbitControls 
          enabled={false}
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          target={[0, 0, 0]}
        />
        
        <CameraRig 
          ballRef={ballRef} 
          launchedRef={launchedRef} 
          area={area} 
        />
        
        <ReactSuspense fallback={null}>
          <Physics gravity={[0, -9.8, 0]} allowSleep key={resetKey}>
            <Lane length={area.length} width={area.width} />
            
            {/* Pins */}
            {pins.map((p, i) => (
              <Pin key={`pin-${resetKey}-${i}`} position={p} />
            ))}
            
            {/* Ball - simplified without ref callback */}
            <TechBall
              tech={tech}
              area={area}
              onLaunched={handleBallLaunched}
              onRest={handleBallRest}
              onAimingChange={handleAimingChange}
              ref={ballRef}
            />
          </Physics>
          
          <Preload all />
        </ReactSuspense>
      </Canvas>
    </div>
  );
}