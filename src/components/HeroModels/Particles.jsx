import { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";

// All random data generated at module load — completely outside React
const buildParticleData = (count) => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const origins = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = Math.random() * 10 + 5;
        const z = (Math.random() - 0.5) * 10;
        positions[i * 3]     = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        origins[i]           = y;
        speeds[i]            = 0.005 + Math.random() * 0.001;
    }
    return { positions, speeds, origins };
};

const Particles = ({ count = 200 }) => {
    const mesh = useRef();
    const data = useRef(null);

    useLayoutEffect(() => {
        data.current = buildParticleData(count);
        const attr = mesh.current.geometry.attributes.position;
        attr.array.set(data.current.positions);
        attr.needsUpdate = true;
    }, [count]);

    useFrame(() => {
        if (!data.current || !mesh.current) return;
        const { speeds, origins } = data.current;
        const attr = mesh.current.geometry.attributes.position;
        const pos = attr.array;

        for (let i = 0; i < count; i++) {
            pos[i * 3 + 1] -= speeds[i];
            if (pos[i * 3 + 1] < -2) pos[i * 3 + 1] = origins[i];
        }
        attr.needsUpdate = true;
    });

    const emptyPositions = new Float32Array(count * 3);

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={emptyPositions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#ffffff"
                size={0.05}
                transparent
                opacity={0.9}
                depthWrite={false}
            />
        </points>
    );
};

export default Particles;