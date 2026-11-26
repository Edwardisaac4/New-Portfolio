import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import PrecompileShaders from "../PrecompileShaders";

const AbstractGlobe = () => {
  const sphereRef = useRef();

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={sphereRef} args={[1, 32, 32]} scale={2.2}>
        <MeshDistortMaterial
          color="#52aeff"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          wireframe
        />
      </Sphere>
    </Float>
  );
};

/**
 * The distorted wireframe globe behind the homepage Contact section.
 * Lives in its own chunk so Three.js is only downloaded when the section gets
 * close to the viewport. `active` pauses the render loop while it is scrolled away.
 *
 * @param {object} props
 * @param {boolean} props.active Whether the canvas should keep rendering frames.
 */
const WireframeGlobeCanvas = ({ active }) => {
  // Don't draw until the shaders have compiled in the background (see PrecompileShaders)
  const [shadersReady, setShadersReady] = useState(false);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]} frameloop={active && shadersReady ? "always" : "never"}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <AbstractGlobe />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      <PrecompileShaders onReady={setShadersReady} />
    </Canvas>
  );
};

export default WireframeGlobeCanvas;
