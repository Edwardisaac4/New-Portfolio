import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Float, useTexture } from "@react-three/drei";
import PrecompileShaders from "../PrecompileShaders";

const EarthGlobe = () => {
  const sphereRef = useRef();
  const colorMap = useTexture("/images/earth-night.webp");

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.z = 0.2; // Slight tilt
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={sphereRef} args={[1, 32, 32]} scale={1.8}>
        <meshStandardMaterial map={colorMap} roughness={0.6} metalness={0.1} />
      </Sphere>
    </Float>
  );
};

/**
 * The night-side Earth globe in the About section's bento grid.
 * Lives in its own chunk so Three.js is only downloaded when the card gets close
 * to the viewport. `active` pauses the render loop while it is scrolled away.
 *
 * @param {object} props
 * @param {boolean} props.active Whether the canvas should keep rendering frames.
 */
const EarthGlobeCanvas = ({ active }) => {
  // Don't draw until the shaders have compiled in the background (see PrecompileShaders)
  const [shadersReady, setShadersReady] = useState(false);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]} frameloop={active && shadersReady ? "always" : "never"}>
      <ambientLight intensity={3} />
      <directionalLight position={[10, 10, 5]} intensity={4} />
      <directionalLight position={[-10, -10, -5]} intensity={2} />
      <Suspense fallback={null}>
        <EarthGlobe />
        <PrecompileShaders onReady={setShadersReady} />
      </Suspense>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
    </Canvas>
  );
};

export default EarthGlobeCanvas;
