import * as Three from 'three'
const HeroLights = () => {
    return (
        <>
            <spotLight
                position={[2, 5, 6]}
                angle={0.16}
                intensity={98}
                penumbra={0.25}
                color={"white"}
            />

            <spotLight
                position={[4, 6, 7]}
                angle={0.3}
                intensity={35}
                penumbra={0.5}
                color={"#4cc9ff"}
            />

            <spotLight
                position={[-3, 5, 6]}
                angle={0.45}
                intensity={45}
                penumbra={1}
                color={"#9d4edd"}
            />

            <primitive
                object={new Three.RectAreaLight('#a259ff', 8, 2, 2)}
                position={[1, 3, 4]}
                intensity={14}
                rotation = {[-Math.PI/4, Math.PI/4, 0]}
            />

            <pointLight
                position={[0, 1, 0]}
                intensity={10}
                color={"#7209b7"}
            />
            <pointLight
                position={[1, 2, -2]}
                intensity={10}
                color={"#0d00a4"}
            />
        </>
    )
}

export default HeroLights