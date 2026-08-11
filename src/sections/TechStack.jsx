import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
    if (isLarge) spanClasses = "col-span-2 md:col-span-2 md:row-span-2 min-h-[300px] md:min-h-[464px]";
    else if (isWide) spanClasses = "col-span-2 md:col-span-2 min-h-[220px]";

    // Determine internal layout
    const layoutClasses = isWide
        ? "flex-col sm:flex-row p-7 sm:p-8 gap-6 justify-between items-center sm:items-center text-center sm:text-left"
        : isLarge
            ? "flex-col p-8 md:p-10 justify-between items-center text-center"
            : "flex-col p-6 sm:p-7 justify-between items-center text-center";

    // Determine icon size
    const iconSizeClass = isLarge
        ? "w-28 h-28 md:w-36 md:h-36 my-auto"
        : isWide
            ? "w-16 h-16 md:w-20 md:h-20 shrink-0"
            : "w-16 h-16 md:w-20 md:h-20 my-auto";

    return (
        <div
            ref={cardRef}
            data-tech-card
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`group relative flex rounded-3xl backdrop-blur-2xl border border-white/10 hover:border-white/25 transition-colors duration-500 overflow-hidden cursor-pointer w-full h-full ${spanClasses} ${layoutClasses}`}
            style={{
                transformStyle: "preserve-3d",
                willChange: "transform",
                background: "linear-gradient(135deg, rgba(30, 30, 42, 0.7) 0%, rgba(16, 16, 24, 0.4) 100%)",
                boxShadow: `0 20px 50px -20px ${icon.color}25, 0 8px 32px rgba(0,0,0,0.5)`,
            }}
        >
            {/* Micro grid pattern background */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-30 group-hover:opacity-70 transition-opacity duration-700" />

            {/* Ambient color radial glow on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at ${isWide ? '25%' : '50%'} 50%, ${icon.color}22 0%, transparent 75%)`,
                }}
            />

            {/* Top Corner Badge & Accent Indicator */}
            <div className="w-full flex items-center justify-between relative z-10 pointer-events-none" style={{ transform: "translateZ(15px)" }}>
                {icon.tag && (
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/50 group-hover:text-white/90 group-hover:border-white/20 transition-all duration-300">
                        {icon.tag}
                    </span>
                )}
                <div
                    className="w-2 h-2 rounded-full transition-all duration-300 ml-auto group-hover:scale-125"
                    style={{
                        backgroundColor: icon.color,
                        boxShadow: `0 0 10px ${icon.color}`,
                    }}
                />
            </div>

            {/* Floating 3D Icon */}
            <div
                className={`relative z-10 ${iconSizeClass}`}
                style={{
                    transform: "translateZ(40px)",
                    animation: "techFloat 3.5s ease-in-out infinite",
                    animationDelay: `${(index % 4) * 0.35}s`,
                    filter: `drop-shadow(0 0 20px ${icon.color}80)`,
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

            {/* Name & Description */}
            <div className="relative z-10 w-full" style={{ transform: "translateZ(25px)" }}>
                <p
                    className={`font-semibold tracking-tight text-white group-hover:text-blue-50 transition-colors duration-300 ${
                        isLarge ? "text-2xl sm:text-3xl md:text-4xl" : isWide ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                    }`}
                >
                    {icon.name}
                </p>
                {(isWide || isLarge) && icon.desc && (
                    <p className="mt-1.5 text-xs sm:text-sm text-white-500 group-hover:text-white-50/80 transition-colors duration-300 leading-relaxed max-w-[280px] sm:max-w-none">
                        {icon.desc}
                    </p>
                )}
            </div>

            {/* Bottom Accent Reflection */}
            <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20 h-8 opacity-25 group-hover:opacity-60 blur-md pointer-events-none transition-opacity duration-500"
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
                    {techStackIcons.slice(0, 4).map((icon, i) => {
                        // Assign Bento sizes dynamically based on technology
                        let bentoSize = "normal";
                        if (icon.name === "React") bentoSize = "large"; // React (2x2)
                        else if (icon.name === "Next.js") bentoSize = "wide"; // Next.js (2x1)
                        else if (icon.name === "Tailwind CSS") bentoSize = "wide"; // Tailwind CSS (2x1)
                        else if (icon.name === "Supabase") bentoSize = "wide"; // Supabase (2x1)

                        return <TechCard key={icon.name} icon={icon} index={i} bentoSize={bentoSize} />;
                    })}
                </div>

                {/* Explore Full Skillset CTA Button */}
                <div className="mt-14 text-center relative z-20">
                    <Link
                        to="/skills"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm sm:text-base tracking-wide transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-105"
                    >
                        Explore Full Skillset & Arsenal (14+) →
                    </Link>
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
