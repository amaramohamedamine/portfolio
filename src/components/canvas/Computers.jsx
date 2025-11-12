/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Suspense, useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, ContactShadows } from "@react-three/drei";
import { MathUtils, Object3D } from "three";
import CanvasLoader from "../Loader";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

const Computers = ({ isMobile, highlightOn }) => {
  const { scene } = useGLTF('./desktop_pc/scene.gltf');
  const group = useRef();
  const lampRef = useRef();
  const lampTarget = useMemo(() => new Object3D(), []);
  const reduceMotion = usePrefersReducedMotion();
  const { size } = useThree();

  // Defensive: sanitize GLTF geometry positions to avoid NaN bounding spheres
  useEffect(() => {
    if (!scene) return;
    scene.traverse((obj) => {
      if (obj.isMesh && obj.geometry && obj.geometry.attributes && obj.geometry.attributes.position) {
        const attr = obj.geometry.attributes.position;
        const arr = attr.array;
        let dirty = false;
        for (let i = 0; i < arr.length; i++) {
          if (!Number.isFinite(arr[i])) { arr[i] = 0; dirty = true; }
        }
        if (dirty) {
          attr.needsUpdate = true;
          if (obj.geometry.computeVertexNormals) obj.geometry.computeVertexNormals();
          if (obj.geometry.computeBoundingSphere) obj.geometry.computeBoundingSphere();
        }

        // Enable shadowing on all meshes so lamp is visible
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (lampRef.current && lampTarget) {
          lampRef.current.target = lampTarget;
          lampRef.current.target.updateMatrixWorld();
    }
  }, [lampTarget]);

  useFrame((_, delta) => {
    // Lamp intensity should respond even with reduced motion
    if (lampRef.current) {
      const targetIntensity = highlightOn ? 30.0 : 0.05;
      lampRef.current.intensity = MathUtils.damp(
        lampRef.current.intensity,
        targetIntensity,
        3.5,
        delta
      );
      lampRef.current.distance = highlightOn ? 30 : 12;
      lampRef.current.decay = 1.0;
      lampRef.current.target.updateMatrixWorld();
    }

    if (reduceMotion) return;
    if (group.current) {
      group.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={group}>
  {/* Base idle lighting remains constant; lamp provides the boost */}
  <ambientLight intensity={0.25} />
  <hemisphereLight intensity={0.25} groundColor='black' />
      <spotLight
        position={[-15, 35, 10]}
        angle={0.22}
        penumbra={0.9}
        intensity={1.1}
        castShadow
        shadow-mapSize={{ width: 1024, height: 1024 }}
      />
      <pointLight intensity={0.8} position={[10, 10, 10]} />

      <primitive
        object={scene}
        scale={isMobile ? 0.68 : 0.8}
        position={isMobile ? [0, -2.8, -1.8] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.02]}
      />

      {/* Aim target near keyboard area */}
      <primitive object={lampTarget} position={[0, -3.15, -1.3]} />

      {/* Lamp spotlight toggled from UI */}
      {/* Lamp spotlight from the front toward the keyboard (no shadow map to avoid FBO issues) */}
      <spotLight
        ref={lampRef}
        position={[0.4, 2.6, 5.2]}
        angle={0.9}
        penumbra={1}
        intensity={0}
        color={'#ffdca8'}
        castShadow={false}
      />

      {/* When lamp is on, add a soft frontal fill to ensure obvious brightening */}
      {highlightOn && (
        <pointLight position={[0, 1.2, 4.5]} intensity={10} color={'#fff2cc'} distance={30} decay={1.5} />
      )}

      {/* Subtle desk plane to catch light, making the top-down lamp effect visible */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.6, -0.8]} receiveShadow>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color={'#0f1426'} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Grounding contact shadow (single buffered frame to reduce FBO usage). */}
      {size?.width > 16 && size?.height > 16 && (
        <ContactShadows
          position={[0, -3.6, 0]}
          opacity={0.24}
          scale={12}
          blur={2.4}
          far={4}
          frames={1}
        />
      )}
    </group>
  );
};

const ComputersCanvas = ({ highlightOn = false }) => {
  const [isMobile, setIsMobile] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  // Simple gate: render scene only when canvas has a non-zero size
  function SceneGate({ children }) {
    const { size } = useThree();
    if (!size?.width || !size?.height) return null;
    if (size.width < 4 || size.height < 4) return null;
    return children;
  }

  return (
    <Canvas
      frameloop={reduceMotion ? 'demand' : 'always'}
      shadows={true}
      dpr={[1, 1.75]}
      camera={{ position: [8, 2.8, 8], fov: 35 }}
      gl={{ antialias: true, stencil: false, depth: true, powerPreference: 'high-performance' }}
      className="rounded-2xl overflow-hidden"
      style={{ width: '100%', height: '100%' }}
    >
      <SceneGate>
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={!reduceMotion}
            autoRotateSpeed={0.6}
            target={[0, -1.4, 0]}
            maxPolarAngle={1.45}
            minPolarAngle={1.0}
          />
          <Computers isMobile={isMobile} highlightOn={highlightOn} />
        </Suspense>
        <Preload all />
      </SceneGate>
    </Canvas>
  );
};

export default ComputersCanvas;
