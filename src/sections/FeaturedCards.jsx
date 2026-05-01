import { abilities } from "../constants"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const FeatureCard = ({ imgPath, title, desc, index }) => {
    const flipperRef = useRef(null)
    const gradientFrontRef = useRef(null)
    const gradientBackRef = useRef(null)
    
    // Track flip state for mobile compatibility
    const [isFlipped, setIsFlipped] = useState(false)

    // Progression spectrum colors
    const frontGradients = [
        "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
        "from-blue-500/20 via-indigo-500/20 to-purple-500/20",
        "from-indigo-500/20 via-purple-500/20 to-fuchsia-500/20",
        "from-purple-500/20 via-fuchsia-500/20 to-pink-500/20",
        "from-fuchsia-500/20 via-pink-500/20 to-rose-500/20"
    ];

    const backGradients = [
        "from-cyan-900/70 via-blue-900/50 to-indigo-900/50",
        "from-blue-900/70 via-indigo-900/50 to-purple-900/50",
        "from-indigo-900/70 via-purple-900/50 to-fuchsia-900/50",
        "from-purple-900/70 via-fuchsia-900/50 to-pink-900/50",
        "from-fuchsia-900/70 via-pink-900/50 to-rose-900/50"
    ];

    const frontGradient = frontGradients[index % frontGradients.length];
    const backGradient = backGradients[index % backGradients.length];

    useEffect(() => {
        gsap.to([gradientFrontRef.current, gradientBackRef.current], {
            backgroundPosition: "200% 50%",
            duration: 6,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
    }, [])

    useEffect(() => {
        // Handle physical 3D flip based on state (works for both hover and mobile taps)
        gsap.to(flipperRef.current, {
            rotateY: isFlipped ? 180 : 0,
            duration: 0.8,
            ease: isFlipped ? "back.out(1.2)" : "power3.out"
        });
    }, [isFlipped])

    const handleMouseEnter = () => {
        if (window.matchMedia("(pointer: fine)").matches) {
            setIsFlipped(true);
        }
    }

    const handleMouseLeave = () => {
        if (window.matchMedia("(pointer: fine)").matches) {
            setIsFlipped(false);
        }
    }

    const handleClick = () => {
        // Toggle flip on click for mobile users (pointer: coarse)
        if (!window.matchMedia("(pointer: fine)").matches) {
            setIsFlipped(!isFlipped);
        }
    }

    return (
        <div 
            className="feature-card group relative w-[90%] max-w-[360px] mx-auto md:max-w-none md:mx-0 md:w-[calc(50%-1rem)] xl:w-[calc(33.33%-2rem)] h-[380px] md:h-[320px] opacity-0 translate-y-10 focus:outline-none cursor-pointer"
            style={{ perspective: "1500px" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {/* 3D Flipper Container */}
            <div 
                ref={flipperRef}
                className="relative w-full h-full shadow-2xl"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* ---------- FRONT OF CARD ---------- */}
                <div 
                    className="absolute inset-0 w-full h-full p-6 md:p-10 rounded-2xl flex flex-col items-center justify-center text-center bg-black-100/90 backdrop-blur-xl border border-black-50 transition-colors duration-700 group-hover:border-white/10 overflow-hidden"
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                    {/* Animated gradient hover aura on the front */}
                    <div 
                        ref={gradientFrontRef}
                        className={`absolute inset-0 bg-gradient-to-br ${frontGradient} transition-opacity duration-700 blur-2xl pointer-events-none -z-10 ${isFlipped ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"}`}
                        style={{ backgroundSize: "200% 200%", backgroundPosition: "0% 50%" }}
                    ></div>

                    <div className="relative size-20 md:size-24 flex justify-center items-center rounded-2xl bg-black-200 border border-black-50 mb-6 shadow-inner md:group-hover:border-white/30 transition-colors duration-500">
                        <img 
                            src={imgPath} 
                            alt={title} 
                            className="size-10 md:size-12 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" 
                            loading="lazy"
                        />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md transition-colors duration-500 md:group-hover:text-blue-50">
                        {title}
                    </h3>
                    <div className="mt-4 text-xs font-semibold uppercase tracking-widest text-blue-400 opacity-80 md:opacity-60 flex items-center gap-2 md:group-hover:opacity-100 transition-opacity duration-300">
                        <span className="md:hidden">Tap to </span>Flip <span className="animate-pulse flex items-center justify-center">⟳</span>
                    </div>
                </div>

                {/* ---------- BACK OF CARD ---------- */}
                <div 
                    className="absolute inset-0 w-full h-full p-6 md:p-10 rounded-2xl flex flex-col items-center justify-center text-center backdrop-blur-xl border border-white/10 overflow-hidden"
                    style={{ 
                        backfaceVisibility: "hidden", 
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)" 
                    }}
                >
                    {/* Continuous Animated Gradient Background on the back */}
                    <div 
                        ref={gradientBackRef}
                        className={`absolute inset-0 bg-gradient-to-br ${backGradient} -z-20 pointer-events-none rounded-2xl`}
                        style={{ backgroundSize: "300% 300%", backgroundPosition: "0% 50%" }}
                    ></div>

                    {/* Neutral glowing background core inside the back face */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)] pointer-events-none rounded-2xl -z-10"></div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 border-b border-white/10 pb-4 w-full">
                        {title}
                    </h3>
                    <p className="text-white-50 leading-relaxed text-sm md:text-base relative z-10 w-full">
                        {desc}
                    </p>
                </div>
            </div>
        </div>
    )
}

/**
 * The 'Why Hire Me?' section showcasing key abilities.
 * Displays 3D flip cards using the FeatureCard component.
 */
const FeaturedCards = () => {
    const sectionRef = useRef(null)

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(".header-text", 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.2, scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }}
            )

            gsap.fromTo(".feature-card", 
                { y: 80, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)", stagger: 0.15, scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }}
            )
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} className="w-full section-padding relative z-10" id="abilities">
            <div className="mx-auto flex flex-col items-center mb-10 md:mb-16">
                <h2 className="header-text text-3xl md:text-5xl font-bold text-center mb-4 text-white opacity-0 translate-y-10">Why Hire Me?</h2>
                <p className="header-text text-white-50 text-center max-w-2xl text-base md:text-lg opacity-0 translate-y-10">
                    A unique blend of engineering excellence, user-centric design, and reliable delivery.
                </p>
            </div>

            <div className="mx-auto flex flex-wrap justify-center gap-6 md:gap-8 max-w-7xl w-full">
                {abilities.map((ability, index) => (
                    <FeatureCard key={ability.title} {...ability} index={index} />
                ))}
            </div>
      </section>
  )
}

export default FeaturedCards