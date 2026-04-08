import Button from "../components/Button.jsx"
import { words } from "../constants/index.js"
import HeroExperience from "../components/HeroModels/HeroExperience.jsx"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import AnimatedCounter from "../components/AnimatedCounter.jsx"

const Hero = () => {
    useGSAP(() => {
        const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

        /**
         * Scramble-text effect for a single DOM element.
         * Resolves characters left-to-right as GSAP progress goes 0 → 1.
         * @param {HTMLElement} el    - Target element
         * @param {number}      delay - Seconds to wait before starting
         * @param {number}      dur   - Duration of the scramble in seconds
         */
        const scrambleText = (el, delay, dur) => {
            const original = el.textContent.trim();
            const len = original.length;

            gsap.to({ progress: 0 }, {
                progress: 1,
                duration: dur,
                delay,
                ease: "none",
                onUpdate: function () {
                    const p = this.targets()[0].progress;
                    const resolved = Math.floor(p * len); // chars that are final
                    let display = "";

                    for (let i = 0; i < len; i++) {
                        if (original[i] === " ") {
                            // Always preserve real spaces
                            display += " ";
                        } else if (i < resolved) {
                            // Character has resolved — show the real one
                            display += original[i];
                        } else {
                            // Still scrambling — show a random char
                            display += CHARSET[Math.floor(Math.random() * CHARSET.length)];
                        }
                    }
                    el.textContent = display;
                },
                onComplete: function () {
                    // Guarantee the final text is exactly correct
                    el.textContent = original;
                },
            });
        };

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

        // 5. Scramble the two static h1s after their reveal lands
        //    Delay is timed so scramble starts just as each h1 finishes revealing.
        //    The first h1 (word-slider) is NOT touched — we only target [data-scramble].
        const scrambleEls = document.querySelectorAll("[data-scramble]");
        scrambleEls.forEach((el, i) => {
            // 0.5s stagger between lines — first line starts at 0.6s,
            // second starts at 1.1s, giving each room to breathe
            scrambleText(el, 0.6 + i * 0.5, 2.2);
        });

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
                <img src="/images/bg.png" alt="background" />
            </div>

            <div className="hero-layout">
                {/*LEFT CONTENT OF THE HERO SECTION*/}
                <header className="flex flex-col md:w-full justify-center w-screen md:px-18 px-4">
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
                                                    className="xl:size-10 md:size-8 size-6 md:p-1.5 p-1 rounded-full bg-white-50"
                                                />
                                                <span>{word.text}</span>
                                            </span>
                                        ))}
                                    </span>
                                </span>
                            </h1>
                            <h1 data-scramble>Into Real Projects</h1>
                            <h1 data-scramble>That Deliver Results</h1>
                        </div>

                        <p className="hero-subtitle pointer-events-none text-white-50 relative z-9 md:text-xl text-lg">
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
                    <HeroExperience />
                </figure>
            </div>

            <AnimatedCounter />
        </section>
    )
}

export default Hero
