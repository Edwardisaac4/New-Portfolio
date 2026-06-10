import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { techStackIcons } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const TechCard = ({ icon, index, bentoSize = "normal" }) => {
    const cardRef = useRef(null);

    const isLarge = bentoSize === "large";
    const isWide = bentoSize === "wide";

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -10;
        const rotateY = ((x - cx) / cx) * 10;
        gsap.to(card, {
            rotateX,
            rotateY,
            scale: 1.02,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 900,
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
        });
    };

    // Determine grid span classes
    let spanClasses = "col-span-1 min-h-[220px]";
    if (isLarge) spanClasses = "col-span-2 md:col-span-2 md:row-span-2 min-h-[300px] md:min-h-[464px]"; // 464 = 220*2 + 24 (gap)
    else if (isWide) spanClasses = "col-span-2 md:col-span-2 min-h-[220px]";

    // Determine internal layout
    const layoutClasses = isWide
        ? "flex-col sm:flex-row p-8 gap-6 text-center sm:text-left"
        : "flex-col p-8 text-center";

    // Determine icon size
    const iconSizeClass = isLarge
        ? "w-24 h-24 md:w-32 md:h-32 mb-6"
        : isWide
        ? "w-16 h-16 md:w-20 md:h-20 mb-4 sm:mb-0 shrink-0"
        : "w-16 h-16 md:w-20 md:h-20 mb-5";

    return (
        <div
            ref={cardRef}
            data-tech-card
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`group relative flex items-center justify-center rounded-3xl backdrop-blur-2xl border border-black-50 overflow-hidden cursor-pointer w-full h-full ${spanClasses} ${layoutClasses}`}
            style={{
                transformStyle: "preserve-3d",
                willChange: "transform",
                background:
                    "linear-gradient(135deg, rgba(40, 39, 50, 0.6) 0%, rgba(28, 28, 33, 0.3) 100%)",
                boxShadow: `0 20px 50px -20px ${icon.color}30, 0 8px 32px rgba(0,0,0,0.4)`,
            }}
        >
            {/* Ambient glow on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at ${isWide ? '30%' : '50%'} 50%, ${icon.color}25 0%, transparent 70%)`,
                }}
            />

            {/* Floating icon with 3D depth */}
            <div
                className={`relative z-10 ${iconSizeClass}`}
                style={{
                    transform: "translateZ(40px)",
                    animation: "techFloat 3s ease-in-out infinite",
                    animationDelay: `${(index % 4) * 0.3}s`,
                    filter: `drop-shadow(0 0 18px ${icon.color}90)`,
                }}
            >
                <img
                    src={icon.iconPath}
                    alt={icon.name}
                    className="w-full h-full object-contain"
                    style={icon.isWhite ? { filter: "brightness(0) invert(1)" } : {}}
                    loading="lazy"
                />
            </div>

            {/* Name */}
            <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                <p
                    className={`text-white-50 font-semibold tracking-tight ${
                        isLarge ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
                    }`}
                >
                    {icon.name}
                </p>
                {isWide && (
                    <p className="mt-2 text-sm text-white-500 max-w-[200px]">
                        Core technology for building robust solutions.
                    </p>
                )}
            </div>

            {/* Reflection */}
            <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-8 opacity-30 blur-md pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse, ${icon.color}, transparent 70%)`,
                }}
            />
        </div>
    );
};

/**
 * The TechStack section displaying a list of technologies.
 * Uses GSAP ScrollTrigger to reveal icons sequentially and a continuous marquee effect.
 */
const TechStack = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const gridRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Split title into characters
            const title = titleRef.current;
            if (title) {
                const text = title.textContent || "";
                title.innerHTML = text
                    .split("")
                    .map((c) =>
                        c === " "
                            ? `<span class="inline-block">&nbsp;</span>`
                            : `<span class="inline-block tech-char" style="will-change:transform">${c}</span>`,
                    )
                    .join("");
            }

            const cards = gsap.utils.toArray("[data-tech-card]");

            // Initial state
            gsap.set(cards, { y: 120, opacity: 0, rotateX: -50, scale: 0.85 });
            gsap.set(".tech-char", { y: 60, opacity: 0, rotateZ: 8 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=1400",
                    pin: true,
                    scrub: 0.5,
                    anticipatePin: 1,
                    pinReparent: true,
                },
            });

            // Animate title characters
            tl.to(".tech-char", {
                y: 0,
                opacity: 1,
                rotateZ: 0,
                stagger: 0.02,
                ease: "power3.out",
            })
                // Animate subtitle
                .to(".tech-subtitle", { y: 0, opacity: 1, ease: "power2.out" }, "-=0.2")
                // Animate cards in from center
                .to(
                    cards,
                    {
                        y: 0,
                        opacity: 1,
                        rotateX: 0,
                        scale: 1,
                        stagger: { amount: 0.7, from: "center", grid: "auto" },
                        ease: "power3.out",
                    },
                    "-=0.2",
                )
                // Hold at end so unpin is smooth — gives user time to read before scroll resumes
                .to({}, { duration: 0.6 });

            // Marquee infinite scroll
            const marqueeTrack = sectionRef.current?.querySelector(".tech-marquee-track");
            if (marqueeTrack) {
                const marqueeAnim = gsap.to(marqueeTrack, {
                    xPercent: -50,
                    ease: "none",
                    duration: 30,
                    repeat: -1,
                });

                // Slow down on hover
                marqueeTrack.parentElement.addEventListener("mouseenter", () => {
                    gsap.to(marqueeAnim, { timeScale: 0.2, duration: 0.5 });
                });
                marqueeTrack.parentElement.addEventListener("mouseleave", () => {
                    gsap.to(marqueeAnim, { timeScale: 1, duration: 0.5 });
                });
            }

            // Spotlight follows cursor
            const spotlight = sectionRef.current?.querySelector(".tech-spotlight");
            if (spotlight) {
                const xTo = gsap.quickTo(spotlight, "x", {
                    duration: 0.6,
                    ease: "power3",
                });
                const yTo = gsap.quickTo(spotlight, "y", {
                    duration: 0.6,
                    ease: "power3",
                });
                const onMove = (e) => {
                    const rect = sectionRef.current.getBoundingClientRect();
                    xTo(e.clientX - rect.left);
                    yTo(e.clientY - rect.top);
                };
                sectionRef.current?.addEventListener("mousemove", onMove);
                return () =>
                    sectionRef.current?.removeEventListener("mousemove", onMove);
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="skills"
            ref={sectionRef}
            className="relative min-h-screen w-full overflow-hidden"
            style={{ background: "black" }}
        >
            {/* Cursor spotlight */}
            <div
                className="tech-spotlight pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-60 blur-3xl"
                style={{
                    background:
                        "radial-gradient(circle, rgba(82, 174, 255, 0.25), transparent 65%)",
                    left: 0,
                    top: 0,
                }}
            />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 md:px-10">
                {/* Header */}
                <div className="mb-12 text-center md:mb-16">
                    <p
                        className="tech-subtitle text-sm uppercase tracking-[0.3em] text-blue-50 opacity-0"
                        style={{ transform: "translateY(20px)" }}
                    >
                        ⚡ Tools That Power My Creations
                    </p>
                    <h2
                        ref={titleRef}
                        className="mt-4 text-4xl font-bold leading-[0.95] md:text-6xl lg:text-7xl"
                        style={{
                            background:
                                "linear-gradient(135deg, #d9ecff 0%, #62e0ff 40%, #52aeff 70%, #d9ecff 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        My Preferred Tech Stack
                    </h2>
                </div>

                {/* Grid - Bento Layout */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 auto-rows-auto"
                >
                    {techStackIcons.map((icon, i) => {
                        // Assign Bento sizes dynamically
                        let bentoSize = "normal";
                        if (i === 0) bentoSize = "large"; // React (2x2)
                        else if (i === 3) bentoSize = "wide"; // Tailwind CSS (2x1)
                        
                        return <TechCard key={icon.name} icon={icon} index={i} bentoSize={bentoSize} />;
                    })}
                </div>
            </div>

            {/* Marquee ticker */}
            <div
                className="relative z-10 mt-8 border-y border-black-50 py-6 backdrop-blur-sm"
                style={{ 
                    background: "rgba(28, 28, 33, 0.2)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                    maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                }}
            >
                <div className="tech-marquee-track flex w-max gap-16 whitespace-nowrap text-2xl md:text-4xl uppercase tracking-widest font-semibold items-center hover:cursor-default">
                    {/* Duplicate array exactly once for seamless 50% translation loop */}
                    {[...techStackIcons, ...techStackIcons].map(
                        (t, i) => {
                            // Alternate styles: Even items solid, Odd items outlined
                            const isOutline = i % 2 !== 0;
                            return (
                                <span key={i} className="flex items-center gap-16 group/marquee-item">
                                    <span 
                                        className={`transition-colors duration-300 ${isOutline ? "text-transparent" : "text-blue-50 group-hover/marquee-item:text-blue-400"}`}
                                        style={isOutline ? { WebkitTextStroke: "1.5px rgba(82, 174, 255, 0.8)" } : {}}
                                    >
                                        {t.name}
                                    </span>
                                    <span style={{ color: "#52aeff" }} className="opacity-60 text-xl md:text-3xl">✦</span>
                                </span>
                            );
                        }
                    )}
                </div>
            </div>
        </section>
    );
};

export default TechStack;
