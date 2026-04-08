import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMediaQuery } from 'react-responsive'
import { Room } from './Room'
import HeroLights from './HeroLights'
import Particles from './Particles'
import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Suspense, useState, useEffect, useRef } from 'react'

const HeroExperience = () => {
    const isTablet = useMediaQuery({ query: '(max-width: 1024px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
    
    // Track if the canvas is visible
    const containerRef = useRef()
    const [inView, setInView] = useState(true)

    // Setup an Intersection Observer to pause the 3D scene when it scrolls out of view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting)
            },
            { rootMargin: "100px", threshold: 0 } // Give it a 100px buffer
        )
        if (containerRef.current) {
            observer.observe(containerRef.current)
        }
        return () => observer.disconnect()
    }, [])

    return (
        <div ref={containerRef} className="w-full h-full">
            <Canvas 
                frameloop={inView ? "always" : "never"} // Stops GPU consumption when scrolled down!
                camera={{ position: [0, 0, 15], fov: 50 }}
                dpr={[1, 1.5]} 
            >
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
                        position={[0, -3.5, 0]}
                        rotation={[0, -Math.PI /4, 0]}
                    >
                        <Room />
                    </group>
                    <EffectComposer>
                        <SelectiveBloom
                            intensity={1.2}
                            luminanceThreshold={0.3}
                            luminanceSmoothing={0.9}
                            blendFunction={BlendFunction.ADD}
                        />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    )
}

export default HeroExperience