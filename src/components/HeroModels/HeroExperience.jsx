import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMediaQuery } from 'react-responsive'
import { Room } from './Room'
import HeroLights from './HeroLights'
import Particles from './Particles'
import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Suspense, useLayoutEffect, useRef, useState } from 'react'
import useInView from '../../hooks/useInView'
import PrecompileShaders from '../PrecompileShaders'

// Narrowest canvas width/height ratio at which the room still fits at full size
// (at zoom 1 it spans ~62% of the canvas height, so this keeps it to ~80% of the width).
const ROOM_MIN_ASPECT = 0.78

/**
 * A perspective camera's FOV is vertical, so the room's size only follows the
 * canvas height. On narrow or tall desktop windows that makes it too wide for
 * its column. Zoom out just enough to keep it inside the canvas width as well.
 */
const FitRoomToCanvas = ({ enabled }) => {
    const get = useThree((state) => state.get)
    const width = useThree((state) => state.size.width)
    const height = useThree((state) => state.size.height)

    useLayoutEffect(() => {
        const { camera } = get()
        camera.zoom = enabled ? Math.min(1, width / height / ROOM_MIN_ASPECT) : 1
        camera.updateProjectionMatrix()
    }, [get, enabled, width, height])

    return null
}

const HeroExperience = () => {
    const isTablet = useMediaQuery({ query: '(max-width: 1024px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
    // Must match the `desktop` variant in index.css (side-by-side hero layout)
    const isDesktop = useMediaQuery({ query: '(min-width: 1024px) and (orientation: landscape)' })
    
    // Pause the 3D scene when it scrolls out of view (with a 100px buffer)
    const containerRef = useRef(null)
    const { inView } = useInView(containerRef, { rootMargin: "100px" })
    // Don't draw until the shaders have compiled in the background (see PrecompileShaders)
    const [shadersReady, setShadersReady] = useState(false)
    const composerRef = useRef(null)

    return (
        <div ref={containerRef} className="w-full h-full">
            <Canvas
                frameloop={inView && shadersReady ? "always" : "never"} // Stops GPU consumption when scrolled down!
                camera={{ position: [0, 0, 15], fov: 50 }}
                dpr={[1, 1.5]}
            >
                <FitRoomToCanvas enabled={isDesktop} />
                <OrbitControls
                    enablePan={false}
                    enableZoom={isTablet}
                    maxDistance={20}
                    minDistance={5}
                    minPolarAngle={Math.PI / 5}
                    maxPolarAngle={Math.PI / 2}
                />
                <Suspense fallback={null}>
                    <HeroLights />
                    <Particles count={150}/>
                    <group
                        scale={isMobile ? 0.7 : 1}
                        position={[0, isDesktop ? -4.25 : -3.5, 0]} // sits a little lower beside the desktop text
                        rotation={[0, -Math.PI /4, 0]}
                    >
                        <Room />
                    </group>
                    <EffectComposer ref={composerRef}>
                        <SelectiveBloom
                            intensity={1.2}
                            luminanceThreshold={0.3}
                            luminanceSmoothing={0.9}
                            blendFunction={BlendFunction.ADD}
                        />
                    </EffectComposer>
                    <PrecompileShaders onReady={setShadersReady} composer={composerRef} />
                </Suspense>
            </Canvas>
        </div>
    )
}

export default HeroExperience