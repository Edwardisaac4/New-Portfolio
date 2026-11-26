import { lazy, Suspense } from "react"
import Button from "../components/Button.jsx"
import { words } from "../constants/index.js"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import AnimatedCounter from "../components/AnimatedCounter.jsx"
import useIdleAfterLoad from "../hooks/useIdleAfterLoad.js"
import CanvasErrorBoundary from "../components/CanvasErrorBoundary.jsx"

// Three.js, React Three Fiber and the post-processing stack are ~1 MB of JS.
// Keeping them out of the entry bundle lets the headline paint without waiting on them.
const HeroExperience = lazy(() => import("../components/HeroModels/HeroExperience.jsx"))

/**
 * The Hero section of the portfolio.
 * Displays a 3D animated room model, a marquee of words, and introductory text.
 */
const Hero = () => {
    // Boot the 3D scene once the page has loaded and the main thread is free
    const show3D = useIdleAfterLoad()

    useGSAP(() => {
        // Master timeline — all clips start invisible
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // 1. Background: zoom back from slightly enlarged
        tl.from(".hero-bg", {
            scale: 1.12,
            opacity: 0,
            duration: 1.6,
        })

            // 2. H1 lines: clip-path slide-up reveal, staggered
            .from(".hero-text h1", {
                y: 80,
                opacity: 0,
                clipPath: "inset(100% 0% 0% 0%)",
                stagger: 0.18,
                duration: 1,
                ease: "power4.out",
            }, "-=1.0")

            // 3. Subtitle paragraph: gentle drift up + fade
            .from(".hero-subtitle", {
                y: 24,
                opacity: 0,
                duration: 0.75,
            }, "-=0.5")

            // 4. CTA Button: scale + fade with a satisfying snap
            .from("#button", {
                scale: 0.78,
                opacity: 0,
                duration: 0.55,
                ease: "back.out(1.7)",
            }, "-=0.35");



        // Subtle continuous float on the 3D canvas figure
        gsap.to(".hero-3d-layout", {
            y: -12,
            duration: 3.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
        });
    });

    return (
        <section id="hero" className="relative overflow-hidden">
            <div className="hero-bg absolute top-0 z-10 left-0">
                {/* Decorative, and usually the LCP element: preloaded in index.html */}
                <img src="/images/bg.webp" alt="" width={418} height={327} fetchPriority="high" />
            </div>

            <div className="hero-layout">
                {/*LEFT CONTENT OF THE HERO SECTION*/}
                <header className="flex flex-col md:w-full desktop:w-1/2 justify-center w-screen md:px-18 desktop:pr-6 px-4">
                    <div className="flex flex-col gap-5">
                        <div className="hero-text">
                            <h1>Shaping
                                <span className="slide">
                                    <span className="wrapper">
                                        {words.map((word) => (
                                            <span key={word.text} className="flex items-center md:gap-2.5 gap-0.5 pb-1">
                                                <img
                                                    src={word.imgPath}
                                                    alt={word.text}
                                                    className="desktop:size-[0.667em] md:size-8 size-6 md:p-1.5 p-1 rounded-full bg-white-50"
                                                />
                                                <span>{word.text}</span>
                                            </span>
                                        ))}
                                    </span>
                                </span>
                            </h1>
                            <h1>Into Real Projects</h1>
                            <h1>That Deliver Results</h1>
                        </div>

                        <p className="hero-subtitle pointer-events-none text-white-50 relative z-9 md:text-xl desktop:text-[length:clamp(16px,1.6vw,20px)] text-lg">
                            I'm Isaac, A Front End Developer with a passion for <br />building innovative and user-friendly web applications
                        </p>

                        <Button
                            className="md:w-78 md:h-14 w-57 h-10"
                            id="button"
                            text="See My Work"
                        />
                    </div>
                </header>

                {/*RIGHT CONTENT OF THE HERO SECTION*/}
                <figure className="hero-3d-layout">
                    {show3D && (
                        <CanvasErrorBoundary>
                            <Suspense fallback={null}>
                                <HeroExperience />
                            </Suspense>
                        </CanvasErrorBoundary>
                    )}
                </figure>
            </div>

            <AnimatedCounter />
        </section>
    )
}

export default Hero
