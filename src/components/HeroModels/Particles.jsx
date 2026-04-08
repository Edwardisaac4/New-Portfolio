import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

// Generate data outside the component to avoid React purity lint errors
const buildParticleData = (count) => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 10; // X
        positions[i * 3 + 1] = Math.random() * 10 + 5;     // Y (start high)
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z
        
        randoms[i * 3 + 0] = Math.random(); // Random offset
        randoms[i * 3 + 1] = 0.005 + Math.random() * 0.001; // Speed
        randoms[i * 3 + 2] = positions[i * 3 + 1]; // Store origin Y
    }
    return { positions, randoms };
};

const Particles = ({ count = 2000 }) => {
    const pointsRef = useRef();

    // Create the geometry data only once, calling the external pure-like function
    const { positions, randoms } = useMemo(() => buildParticleData(count), [count]);

    // Track time for the shader
    const uniforms = useMemo(() => ({
        uTime: { value: 0 }
    }), []);

    // Only update ONE variable (time) every frame instead of thousands of arrays
    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    // Vertex shader moves the particles down on the GPU
    const vertexShader = `
        uniform float uTime;
        attribute vec3 aRandom;
        
        void main() {
            vec3 pos = position;
            
            float speed = aRandom.y;
            float originY = aRandom.z;
            
            // Calculate how far down they should have moved
            float yOffset = mod(uTime * speed * 60.0, originY + 2.0);
            pos.y = originY - yOffset;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            // Greatly increase PointSize multiplier and use device pixel ratio concept
            gl_PointSize = (100.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    // Fragment shader shapes them into solid circles
    const fragmentShader = `
        void main() {
            // Calculate distance from center to make it a circle
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            if (dot(cxy, cxy) > 1.0) discard;
            
            // Output solid white with 0.8 opacity
            gl_FragColor = vec4(1.0, 1.0, 1.0, 0.8);
        }
    `;

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-aRandom"
                    count={count}
                    array={randoms}
                    itemSize={3}
                />
            </bufferGeometry>
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent={true}
                depthWrite={false}
                blending={2}
            />
        </points>
    );
};

export default Particles;