import React, { useRef, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

// Reduce ScrollTrigger callback overhead globally
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })

const projects = [
    {
        id: 0,
        title: 'Movie Landing Page',
        desc: 'A responsive website that allows users to browse and search for movies and anime. It features a modern UI with a dark theme and smooth animations. The website is built with Vanilla JS, HTML, CSS and uses the IMDB API to fetch movie and anime data.',
        tech: ['HTML', 'CSS', 'Vanilla JS', 'IMDB API'],
        media: { type: 'video', src: '/images/project3.mp4' },
        link: 'https://github.com/yourusername/project1'
    },
    {
        id: 1,
        title: 'Ean Jets Booking',
        desc: 'A high-end private jet charter booking experience focusing on premium design, fast response times, and ease of use.',
        tech: ['React', 'Tailwind CSS', 'Typescript'],
        media: { type: 'image', src: '/images/ean-jets.png' },
        link: 'https://github.com/yourusername/project2'
    },
    {
        id: 2,
        title: 'Zentry Clone',
        desc: 'A High End Landing Page with Smooth Animations and Responsive Design',
        tech: ['React', 'Tailwind CSS', 'JavaScript'],
        media: { type: 'video', src: '/images/project1.mp4' },
        link: 'https://github.com/Edwardisaac4/new-gaming'
    }
]

const ShowCase = () => {
    const containerRef = useRef(null)
    const expandedRef = useRef(null)
    const [activeProject, setActiveProject] = useState(null)
    const isAnimating = useRef(false)

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
                className="w-full relative py-16 sm:py-24 lg:py-36 text-white overflow-hidden"
                ref={containerRef}
            >
                {/* Ambient background glows */}
                <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-blue-600/[0.07] blur-[160px]" />
                    <div className="absolute bottom-0 -right-1/4 w-2/3 h-2/3 rounded-full bg-purple-600/[0.07] blur-[160px]" />
                </div>

                <div className="max-w-7xl mx-auto px-5 md:px-10">

                    {/* Section header */}
                    <div className="mb-14 sm:mb-20 lg:mb-28">
                        <p className="text-[10px] sm:text-xs font-mono text-blue-400 tracking-[0.25em] uppercase mb-2 sm:mb-3">
                            Portfolio
                        </p>
                        <h2 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[0.95] tracking-tight bg-clip-text text-transparent bg-linear-to-br from-white via-white/90 to-white/30">
                            The<br />Work
                        </h2>
                    </div>

                    {/* Cards */}
                    <div className="skew-container flex flex-col gap-20 sm:gap-32 lg:gap-48 w-full">
                        {projects.map((project, index) => {
                            const isEven = index % 2 !== 0
                            return (
                                <div key={project.id} data-project-id={project.id} className="project-item w-full">
                                    <div className={`flex flex-col gap-8 sm:gap-10 lg:gap-14 lg:flex-row lg:items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>

                                        {/* ── TEXT BLOCK ── */}
                                        <div className="w-full lg:w-[45%] flex flex-col gap-3 sm:gap-4">

                                            {/* Ghost number + label */}
                                            <div className="card-number flex flex-col">
                                                <span className="text-[6rem] sm:text-[8rem] lg:text-[10rem] font-black leading-none text-white/[0.035] select-none -mb-4 sm:-mb-6 -ml-1 tabular-nums">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <p className="text-[9px] sm:text-[10px] font-mono text-blue-400 tracking-[0.28em] uppercase font-bold">
                                                    Project / 0{index + 1}
                                                </p>
                                            </div>

                                            <h3 className="card-title text-2xl sm:text-3xl lg:text-4xl xl:text-[2.75rem] font-bold leading-[1.1] tracking-tight">
                                                {project.title}
                                            </h3>

                                            <p className="card-desc text-sm sm:text-[15px] lg:text-base text-white/50 leading-relaxed">
                                                {project.desc}
                                            </p>

                                            {/* Tech stack */}
                                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                                                {project.tech.map((t) => (
                                                    <span key={t} className="px-2.5 py-[5px] text-[9px] sm:text-[10px] font-mono rounded-full bg-white/5 border border-white/9 text-white/50 tracking-wide">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* CTA */}
                                            <div className="card-btn mt-2 sm:mt-3">
                                                <button
                                                    onClick={(e) => openProject(project, e.currentTarget.closest('[data-project-id]'))}
                                                    className="group flex items-center gap-2.5 text-sm sm:text-[15px] font-semibold text-white hover:text-blue-400 transition-colors duration-300 w-fit relative cursor-pointer pb-1.5"
                                                >
                                                    Explore Project
                                                    <span className="inline-block group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                                                    <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-blue-400 group-hover:w-full transition-all duration-300 rounded-full" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* ── MEDIA CARD ── */}
                                        <div className="card-media w-full lg:w-[55%]">
                                            <div className="relative group">

                                                {/* Ambient glow on hover */}
                                                <div className="absolute -inset-3 rounded-2xl sm:rounded-3xl bg-linear-to-br from-blue-500/20 to-purple-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

                                                {/* Device frame */}
                                                <div className="relative rounded-xl sm:rounded-2xl lg:rounded-[20px] overflow-hidden border border-white/8 bg-[#111] shadow-2xl shadow-black/60 group-hover:border-white/16 group-hover:shadow-blue-500/10 transition-all duration-500">

                                                    {/* Browser chrome bar */}
                                                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-white/3 border-b border-white/6">
                                                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/50" />
                                                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/50" />
                                                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/50" />
                                                        {/* Fake URL bar */}
                                                        <div className="flex-1 ml-1 sm:ml-2 h-[18px] sm:h-5 rounded-md bg-white/4 items-center px-2 hidden sm:flex">
                                                            <span className="w-1 h-1 rounded-full bg-white/20 mr-1.5" />
                                                            <div className="flex-1 h-[3px] bg-white/8 rounded-full" />
                                                        </div>
                                                    </div>

                                                    {/* Media viewport */}
                                                    <div className="relative aspect-16/10 w-full overflow-hidden bg-black">
                                                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                                        {/* Parallax container */}
                                                        <div className="parallax-media absolute top-[-15%] left-0 w-full h-[130%]" style={{ willChange: 'transform' }}>
                                                            {project.media.type === 'video' ? (
                                                                <video
                                                                    src={project.media.src}
                                                                    loop playsInline muted autoPlay
                                                                    preload="metadata"
                                                                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={project.media.src}
                                                                    alt={project.title}
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                                                                />
                                                            )}
                                                        </div>
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