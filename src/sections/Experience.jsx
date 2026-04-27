import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";
import { expCards } from "../constants";
import Glowcard from "../components/Glowcard";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef(null);
  const stackRef = useRef(null);
  const [stackHeight, setStackHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      const cards = document.querySelectorAll(".exp-card-wrapper");
      let maxH = 0;
      cards.forEach((c) => { maxH = Math.max(maxH, c.scrollHeight); });
      setStackHeight(maxH);
    };
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", measure); };
  }, []);

  useLayoutEffect(() => {
    if (!stackHeight) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".exp-card-wrapper");
      const totalCards = cards.length;
      if (totalCards === 0) return;

      // Perspective on container
      gsap.set(stackRef.current, { perspective: 1400, transformStyle: "preserve-3d" });

      // ── Set every card & panel to initial "closed book" state ──
      cards.forEach((card, i) => {
        const left = card.querySelector(".exp-left-panel");
        const right = card.querySelector(".exp-right-panel");

        gsap.set(card, {
          position: "absolute", top: 0, left: 0, width: "100%",
          zIndex: totalCards - i, transformStyle: "preserve-3d",
        });

        gsap.set([left, right].filter(Boolean), {
          transformPerspective: 1400,
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        });

        // All panels start folded shut
        gsap.set(left, { rotateY: -90, opacity: 0, transformOrigin: "right center" });
        gsap.set(right, { rotateY: 90, opacity: 0, transformOrigin: "left center" });
      });

      // ── 1. Card[0] entrance: opens like a book on scroll-in ──
      const left0 = cards[0].querySelector(".exp-left-panel");
      const right0 = cards[0].querySelector(".exp-right-panel");

      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: stackRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        }
      });

      introTl.fromTo(left0,
        { rotateY: -90, opacity: 0 },
        { rotateY: 0, opacity: 1, duration: 0.8, ease: "power3.out", transformOrigin: "right center" }
      ).fromTo(right0,
        { rotateY: 90, opacity: 0 },
        { rotateY: 0, opacity: 1, duration: 0.8, ease: "power3.out", transformOrigin: "left center" },
        "<0.45"
      );

      // ── 2. Pinned book-flip scroll timeline ──
      if (totalCards > 1) {
        const hold = 0.5;   // pause so user reads card[0]
        const seg = 1.4;    // timeline units per transition

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stackRef.current,
            start: "top 8%",
            end: () => `+=${(hold + (totalCards - 1) * seg) * 82}vh`,
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Hold on card[0]
        tl.to({}, { duration: hold });

        cards.forEach((card, i) => {
          if (i >= totalCards - 1) return;
          const next = cards[i + 1];
          const base = hold + i * seg;

          const cL = card.querySelector(".exp-left-panel");
          const cR = card.querySelector(".exp-right-panel");
          const nL = next.querySelector(".exp-left-panel");
          const nR = next.querySelector(".exp-right-panel");

          // ── CLOSE: company (left) folds shut first ──
          tl.fromTo(cL,
            { rotateY: 0, opacity: 1 },
            { rotateY: 90, opacity: 0, transformOrigin: "right center", duration: seg * 0.25, ease: "power2.in" },
            base
          );

          // ── CLOSE: details (right) fold shut — slight stagger ──
          tl.fromTo(cR,
            { rotateY: 0, opacity: 1 },
            { rotateY: -90, opacity: 0, transformOrigin: "left center", duration: seg * 0.25, ease: "power2.in" },
            base + seg * 0.12
          );

          // ── OPEN: next company panel swings in ──
          tl.fromTo(nL,
            { rotateY: -90, opacity: 0 },
            { rotateY: 0, opacity: 1, transformOrigin: "right center", duration: seg * 0.34, ease: "power2.out" },
            base + seg * 0.48
          );

          // ── OPEN: next details page follows — book-flip delay ──
          tl.fromTo(nR,
            { rotateY: 90, opacity: 0 },
            { rotateY: 0, opacity: 1, transformOrigin: "left center", duration: seg * 0.34, ease: "power2.out" },
            base + seg * 0.65
          );
        });
      }

      // ── Scroll-progress accent line ──
      gsap.fromTo(".exp-progress-line", { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current, start: "top 50%",
          end: "bottom 50%", scrub: 0.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [stackHeight]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="w-full md:mt-40 mt-20 section-padding xl:px-0 relative"
    >
      <div
        className="exp-progress-line hidden xl:block absolute left-12 top-0 w-[2px] h-full origin-top"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, #62e0ff 15%, #52aeff 40%, #fd5c79 70%, #6d45ce 100%)",
        }}
      />

      <div className="w-full h-full md:px-20 px-5">
        <TitleHeader title="Professional Work Experience" sub="👩‍💻 My Career Overview" />

        <div className="mt-32 relative">
          <div
            ref={stackRef}
            className="exp-stack relative z-50"
            style={{ minHeight: stackHeight || "auto" }}
          >
            {expCards.map((card) => (
              <div
                key={card.title}
                className="exp-card-wrapper flex flex-col xl:flex-row gap-10 will-change-transform"
              >
                {/* LEFT — Company panel (opens first, like the left page of a book) */}
                <div className="xl:w-2/6 exp-left-panel">
                  <Glowcard card={card}>
                    <div className="flex items-center gap-4 mt-5">
                      <div className="w-14 h-14 bg-black-200/80 backdrop-blur-sm rounded-full flex items-center justify-center p-2 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] drop-shadow-xl group-hover:scale-110 transition-transform duration-500">
                        <img src={card.logoPath} alt={card.title} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">{card.title}</p>
                        <p className="text-white-500 text-sm">{card.date}</p>
                      </div>
                    </div>
                  </Glowcard>
                </div>

                {/* RIGHT — Details panel (follows ~0.45s later, like the right page) */}
                <div className="xl:w-4/6 flex flex-col justify-center exp-right-panel">
                  <div className="relative group bg-linear-to-br from-black-200/60 to-black-300/10 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 relative z-10">{card.title}</h3>
                    <p className="text-blue-400 text-lg font-medium mb-8 relative z-10">{card.date}</p>
                    <ul className="space-y-5 relative z-10">
                      {card.responsibilities.map((task, idx) => (
                        <li key={idx} className="exp-task-item flex gap-4 items-start group/item">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)] group-hover/item:scale-150 transition-transform duration-300" />
                          <p className="text-white-500 leading-relaxed text-base md:text-lg group-hover/item:text-white-50 transition-colors duration-300">
                            {task}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;