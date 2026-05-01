import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { socialImgs, menuLinks } from "../constants";

gsap.registerPlugin(ScrollTrigger);

/**
 * The main site Footer.
 * Includes local time tracking, navigation links, social links, and a magnetic 'Back to Top' button.
 */
const Footer = () => {
  const footerRef = useRef(null);
  const footerContentRef = useRef(null);
  const backToTopRef = useRef(null);
  const [time, setTime] = useState("");

  // Handle Local Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax reveal effect
      if (footerContentRef.current) {
        gsap.fromTo(
          footerContentRef.current,
          { yPercent: -40, opacity: 0.5 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
          }
        );
      }

      // Magnetic Back to Top button
      const btn = backToTopRef.current;
      if (btn) {
        const moveBtn = (e) => {
          const rect = btn.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
          const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
          gsap.to(btn, { x, y, duration: 0.3, ease: "power2.out" });
        };
        const resetBtn = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        };
        btn.addEventListener("mousemove", moveBtn);
        btn.addEventListener("mouseleave", resetBtn);
        return () => {
          btn.removeEventListener("mousemove", moveBtn);
          btn.removeEventListener("mouseleave", resetBtn);
        };
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-black pt-20"
    >
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-500/10 rounded-[100%] blur-[120px] pointer-events-none" />

      <div ref={footerContentRef} className="relative z-10 flex min-h-[70vh] flex-col justify-between px-6 pb-10 md:px-10">
        
        {/* Top Section: Links & Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full max-w-7xl mx-auto border-b border-white-500/20 pb-12 gap-10">
          
          {/* Brand & Time */}
          <div className="flex flex-col gap-4">
            <h3 className="text-3xl font-bold text-white tracking-tight">
              Isaac Edward<span className="text-blue-500">.</span>
            </h3>
            <div className="flex items-center gap-2 text-white-500">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <span>Available for freelance work</span>
            </div>
            <p className="text-sm text-white-500/70 mt-2">
              Local Time: {time}
            </p>
          </div>

          {/* Socials & Navigation */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            <div className="flex flex-col gap-4">
              <h4 className="text-sm uppercase tracking-[0.2em] text-white-500">Socials</h4>
              <ul className="flex flex-col gap-2">
                {socialImgs.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 text-white transition-colors hover:text-blue-400"
                    >
                      <img src={social.imgPath} alt={social.name} className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" style={{ filter: "invert(1)" }} />
                      <span className="text-lg relative overflow-hidden block h-[28px]">
                        <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                          {social.name}
                        </span>
                        <span className="absolute left-0 top-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-blue-400">
                          {social.name}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm uppercase tracking-[0.2em] text-white-500">Menu</h4>
              <ul className="flex flex-col gap-2">
                {menuLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="group flex text-lg text-white transition-colors hover:text-blue-400"
                    >
                      <span className="relative overflow-hidden block h-[28px]">
                        <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                          {item.label}
                        </span>
                        <span className="absolute left-0 top-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-blue-400">
                          {item.label}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
        </div>

        {/* Bottom Section: Copyright & Back to Top */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center w-full max-w-7xl mx-auto pt-6 gap-6">
          <p className="text-white-500/50 text-sm">
            © {new Date().getFullYear()} Isaac Edward. All rights reserved.
          </p>

          <button
            ref={backToTopRef}
            onClick={scrollToTop}
            className="group flex items-center justify-center w-16 h-16 rounded-full bg-black-200 border border-white-500/20 text-white transition-colors hover:bg-blue-500 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(82,174,255,0.4)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:-translate-y-1"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
