import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";
import { expCards } from "../constants";
import Glowcard from "../components/Glowcard";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".exp-card-wrapper");

      cards.forEach((card) => {
        gsap.fromTo(card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%", // trigger when card enters viewport
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Scroll-progress accent line
      gsap.fromTo(".exp-progress-line", { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current, start: "top 50%",
          end: "bottom 50%", scrub: 0.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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

        <div className="mt-16 md:mt-24 grid grid-cols-1 gap-12 relative z-50">
          {expCards.slice(0, 1).map((card) => (
            <div
              key={card.title}
              className="exp-card-wrapper flex flex-col xl:flex-row gap-8 will-change-transform"
            >
              {/* LEFT — Company logo & title */}
              <div className="xl:w-2/6">
                <Glowcard card={card}>
                  <div className="flex items-center gap-4 mt-5">
                    <div className="w-14 h-14 bg-black-200/80 backdrop-blur-sm rounded-full flex items-center justify-center p-2 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] drop-shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <img src={card.logoPath} alt={card.title} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">{card.title}</p>
                      <p className="text-white-500 text-sm">{card.date}</p>
                    </div>
                  </div>
                </Glowcard>
              </div>

              {/* RIGHT — Details panel */}
              <div className="xl:w-4/6 flex flex-col justify-center">
                <div className="relative group bg-gradient-to-br from-black-200/60 to-black-300/10 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)] overflow-hidden border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 relative z-10">{card.title}</h3>
                  <p className="text-blue-400 text-lg font-medium mb-8 relative z-10">{card.date}</p>
                  <ul className="space-y-5 relative z-10">
                    {card.responsibilities.slice(0, 4).map((task, idx) => (
                      <li key={idx} className="flex gap-4 items-start group/item">
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

        {/* View Full Experience CTA Button */}
        <div className="mt-14 text-center relative z-50">
          <Link
            to="/experience"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm sm:text-base tracking-wide transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-105"
          >
            View Full Experience & Career →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Experience;