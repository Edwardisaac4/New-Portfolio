import { useRef, useState, useCallback, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { projects } from '../constants'

gsap.registerPlugin(ScrollTrigger)

// Reduce ScrollTrigger callback overhead globally
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })

// Auto-play videos when they scroll into view
const useVideoAutoPlay = (containerRef) => {
    useEffect(() => {
        if (!containerRef.current) return;
        const videos = containerRef.current.querySelectorAll('video[preload="none"]');
        if (!videos.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.play().catch(() => {});
                    } else {
                        entry.target.pause();
                    }
                });
            },
            { threshold: 0.25 }
        );

        videos.forEach((video) => observer.observe(video));
        return () => observer.disconnect();
    }, [containerRef]);
};



/**
 * The ShowCase (Work Space) section displaying selected projects.
 * Features a custom auto-play hook for videos and complex GSAP animations.
 * When a project is clicked, it expands into a full-screen view.
 */
const ShowCase = () => {
    const containerRef = useRef(null)
    const expandedRef = useRef(null)
    const [activeProject, setActiveProject] = useState(null)
    const isAnimating = useRef(false)

    // Auto-play videos when they scroll into view (deferred loading)
    useVideoAutoPlay(containerRef)

    useGSAP(() => {
        const mm = gsap.matchMedia()

        // ── SHARED: pre-promote card children (all screen sizes) ────────────
        const cardEls = containerRef.current?.querySelectorAll(
            '.card-number, .card-title, .card-desc, .card-btn, .card-media'
        )
        if (cardEls) gsap.set(cardEls, { force3D: true, willChange: 'transform, opacity' })

        // ── SHARED: Staggered children (runs on ALL devices) ────────────────
        const items = gsap.utils.toArray('.project-item')
        items.forEach((item) => {
            const targets = item.querySelectorAll(
                '.card-number, .card-title, .card-desc, .card-btn, .card-media'
            )
            gsap.from(targets, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                force3D: true,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                    fastScrollEnd: true,
                }
            })
        })

        // ── DESKTOP ONLY: Skew + Parallax (≥1024px) ─────────────────────────
        mm.add('(min-width: 1024px)', () => {
            const skewContainer = containerRef.current?.querySelector('.skew-container')
            const parallaxEls = containerRef.current?.querySelectorAll('.parallax-media')

            if (skewContainer) gsap.set(skewContainer, { force3D: true, willChange: 'transform' })
            if (parallaxEls) gsap.set(parallaxEls, { force3D: true, willChange: 'transform' })

            const clamp = gsap.utils.clamp(-6, 6)
            let proxy = { skew: 0 }
            const tickerFn = () => {
                const velocity = ScrollTrigger.getAll()[0]?.getVelocity?.() ?? 0
                const target = clamp(velocity / -400)
                proxy.skew += (target - proxy.skew) * 0.08
                if (Math.abs(proxy.skew) > 0.001 && skewContainer) {
                    gsap.set(skewContainer, { skewY: proxy.skew, force3D: true })
                }
            }
            gsap.ticker.add(tickerFn)

            items.forEach((item) => {
                const media = item.querySelector('.parallax-media')
                if (media) {
                    gsap.to(media, {
                        yPercent: 18,
                        ease: 'none',
                        force3D: true,
                        scrollTrigger: {
                            trigger: item,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1.5,
                        }
                    })
                }
            })

            return () => {
                gsap.ticker.remove(tickerFn)
                if (skewContainer) gsap.set(skewContainer, { skewY: 0, willChange: 'auto' })
                if (parallaxEls) gsap.set(parallaxEls, { yPercent: 0, willChange: 'auto' })
            }
        })

        return () => {
            mm.revert()
            if (cardEls) gsap.set(cardEls, { willChange: 'auto' })
        }
    }, { scope: containerRef })

    const openProject = useCallback((project, cardEl) => {
        if (isAnimating.current) return
        isAnimating.current = true
        const rect = cardEl.getBoundingClientRect()
        setActiveProject({ ...project, _fromRect: rect })
    }, [])

    useGSAP(() => {
        if (!activeProject || !expandedRef.current) return

        const { _fromRect: r } = activeProject
        const el = expandedRef.current
        const isMobile = window.innerWidth < 768

        gsap.set(el, {
            top: r.top, left: r.left,
            width: r.width, height: r.height,
            borderRadius: '16px', opacity: 1,
        })

        gsap.to(el, {
            top: isMobile ? 0 : '1rem',
            left: isMobile ? 0 : '1rem',
            width: isMobile ? '100vw' : 'calc(100vw - 2rem)',
            height: isMobile ? '100dvh' : 'calc(100vh - 2rem)',
            borderRadius: isMobile ? '0px' : '24px',
            duration: 0.65,
            ease: 'power4.inOut',
            force3D: true,
            onComplete: () => {
                gsap.fromTo('.expanded-content > *',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'power3.out', force3D: true }
                )
                isAnimating.current = false
            }
        })

        gsap.fromTo('.showcase-backdrop',
            { opacity: 0 },
            { opacity: 1, duration: 0.35, ease: 'power2.out' }
        )
    }, { dependencies: [activeProject], scope: document.body })

    const closeProject = useCallback(() => {
        if (isAnimating.current || !activeProject) return
        isAnimating.current = true

        const el = expandedRef.current
        const { _fromRect: r } = activeProject

        gsap.to('.expanded-content > *', {
            opacity: 0, y: 12,
            duration: 0.2, stagger: 0.04,
            ease: 'power2.in',
            onComplete: () => {
                gsap.to(el, {
                    top: r.top, left: r.left,
                    width: r.width, height: r.height,
                    borderRadius: '16px',
                    duration: 0.6, ease: 'power4.inOut',
                    onComplete: () => {
                        setActiveProject(null)
                        isAnimating.current = false
                    }
                })
            }
        })

        gsap.to('.showcase-backdrop', { opacity: 0, duration: 0.4, ease: 'power2.in' })
    }, [activeProject])

    useGSAP(() => {
        const handleKey = (e) => { if (e.key === 'Escape') closeProject() }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [closeProject])

    return (
        <>
            {/* ── DARK BACKDROP ── */}
            {activeProject && (
                <div
                    className="showcase-backdrop fixed inset-0 bg-black/80 backdrop-blur-sm z-40 opacity-0"
                    onClick={closeProject}
                />
            )}

            {/* ── EXPANDED CARD ── */}
            {activeProject && (
                <div
                    ref={expandedRef}
                    className="fixed z-50 overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl flex flex-col opacity-0"
                    style={{ willChange: 'top, left, width, height, border-radius' }}
                >
                    <div className="relative w-full h-[42%] shrink-0 overflow-hidden">
                        {activeProject.media.type === 'video' ? (
                            <video src={activeProject.media.src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        ) : (
                            <img src={activeProject.media.src} alt={activeProject.title} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-[#0a0a0a] to-transparent" />
                        <button
                            onClick={closeProject}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer z-10 text-sm"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="expanded-content flex flex-col gap-3 sm:gap-5 p-5 sm:p-8 md:p-12 overflow-y-auto">
                        <p className="text-[10px] sm:text-xs font-mono text-blue-400 font-semibold tracking-[0.2em] uppercase">
                            0{activeProject.id + 1} // Project
                        </p>
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
                            {activeProject.title}
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-white/55 leading-relaxed max-w-2xl">
                            {activeProject.desc}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {activeProject.tech.map((t) => (
                                <span key={t} className="px-2.5 py-1 text-[10px] sm:text-xs font-mono rounded-full bg-white/6 border border-white/10 text-white/60">
                                    {t}
                                </span>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-3">
                            <a href={activeProject.link} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold transition-colors duration-200">
                                View on GitHub →
                            </a>
                            <button onClick={closeProject}
                                className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-white/20 hover:border-white/40 text-white/60 hover:text-white text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer">
                                ← Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MAIN SHOWCASE SECTION ── */}
            <section
                id="work"
                className="showcase-section"
                ref={containerRef}
            >
                {/* Ambient background glows */}
                <div className="showcase-glow-bg">
                    <div className="showcase-glow-blue" />
                    <div className="showcase-glow-purple" />
                </div>

                <div className="showcase-container">

                    {/* Section header */}
                    <div className="showcase-header">
                        <p className="showcase-subtitle">
                            Portfolio
                        </p>
                        <h2 className="showcase-title">
                            The<br />Work
                        </h2>
                    </div>

                    {/* Cards */}
                    <div className="skew-container showcase-list">
                        {projects.map((project, index) => {
                            const isEven = index % 2 !== 0
                            return (
                                <div key={project.id} data-project-id={project.id} className="project-item w-full">
                                    <div className={`project-layout ${isEven ? 'project-layout-reverse' : ''}`}>

                                        {/* ── TEXT BLOCK ── */}
                                        <div className="project-text-block">

                                            {/* Ghost number + label */}
                                            <div className="card-number flex flex-col">
                                                <span className="project-ghost-number">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <p className="project-label">
                                                    Project / 0{index + 1}
                                                </p>
                                            </div>

                                            <h3 className="card-title project-title">
                                                {project.title}
                                            </h3>

                                            <p className="card-desc project-desc">
                                                {project.desc}
                                            </p>

                                            {/* Tech stack */}
                                            <div className="project-tech-list">
                                                {project.tech.map((t) => (
                                                    <span key={t} className="project-tech-badge">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* CTA */}
                                            <div className="card-btn project-cta-wrapper">
                                                <button
                                                    onClick={(e) => openProject(project, e.currentTarget.closest('[data-project-id]'))}
                                                    className="project-cta-btn"
                                                >
                                                    Explore Project
                                                    <span className="project-cta-arrow">→</span>
                                                    <div className="project-cta-line" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* ── MEDIA CARD ── */}
                                        <div className="card-media project-media-block">
                                            <div className="relative group">

                                                {/* Ambient glow on hover */}
                                                <div className="project-media-hover-glow" />

                                                {/* Device frame */}
                                                <div className="project-device-frame">

                                                    {/* Browser chrome bar */}
                                                    <div className="project-browser-bar">
                                                        <span className="project-dot project-dot-red" />
                                                        <span className="project-dot project-dot-yellow" />
                                                        <span className="project-dot project-dot-green" />
                                                        {/* Fake URL bar */}
                                                        <div className="project-url-bar">
                                                            <span className="project-url-lock" />
                                                            <div className="project-url-line" />
                                                        </div>
                                                    </div>

                                                    {/* Media viewport */}
                                                    <div className="project-viewport">
                                                        <div className="project-viewport-overlay" />

                                                        {/* Media container — videos get a lightweight path (no parallax / no hover scale) */}
                                                        {project.media.type === 'video' ? (
                                                            <div className="w-full h-full">
                                                                <video
                                                                    src={project.media.src}
                                                                    poster={project.media.poster}
                                                                    loop playsInline muted
                                                                    preload="none"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="parallax-media absolute top-[-15%] left-0 w-full h-[130%]" style={{ willChange: 'transform' }}>
                                                                <img
                                                                    src={project.media.src}
                                                                    alt={project.title}
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                    className="project-media-img"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>
            </section>
        </>
    )
}

export default ShowCase