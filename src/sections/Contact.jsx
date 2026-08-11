import { useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import TitleHeader from "../components/TitleHeader";
import ContactForm from "../components/ContactForm";
import { socialImgs } from "../constants";

gsap.registerPlugin(ScrollTrigger);

// ── 3D Background Element ──
const AbstractGlobe = () => {
  const sphereRef = useRef();

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={sphereRef} args={[1, 32, 32]} scale={2.2}>
        <MeshDistortMaterial
          color="#52aeff"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          wireframe
        />
      </Sphere>
    </Float>
  );
};

/**
 * The homepage Contact section.
 * Pairs the 3D globe and social links with the shared ContactForm, which owns
 * the EmailJS wiring. The full-page version lives at /contact.
 */
const Contact = () => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const globeContainerRef = useRef(null);

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Pinning the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1500",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          pinReparent: true,
        },
      });

      // Globe parallax entrance
      tl.fromTo(
        globeContainerRef.current,
        { scale: 0.5, opacity: 0, x: -200 },
        { scale: 1, opacity: 1, x: 0, duration: 1, ease: "power3.out" }
      );

      // Form slide in
      tl.fromTo(
        formRef.current,
        { x: 300, opacity: 0, rotateY: 15 },
        { x: 0, opacity: 1, rotateY: 0, duration: 1, ease: "power3.out" },
        "-=0.6"
      );

      // Hold at end so the unpin doesn't snap immediately
      tl.to({}, { duration: 0.5 });

      // Magnetic Button effect for submit
      const btn = formRef.current?.querySelector(".magnetic-btn");
      if (btn) {
        const moveBtn = (e) => {
          const rect = btn.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
          const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-black"
    >
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 md:px-10 lg:flex-row lg:items-center lg:gap-20">

        {/* Left Side - 3D Globe & Socials */}
        <div className="relative z-10 flex w-full flex-col items-center justify-center lg:w-1/2 lg:items-start" style={{ height: "60vh" }}>

          <div className="mb-8 w-full text-center lg:text-left">
            <TitleHeader title="Let's Talk" sub="📬 Ready to innovate together?" />
          </div>

          <div ref={globeContainerRef} className="relative h-[400px] w-full md:h-[500px]">
            {/* Ambient background glow behind globe */}
            <div className="absolute inset-0 left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[100px]" />
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />
              <AbstractGlobe />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </div>

          {/* Social Links */}
          <div className="mt-8 flex w-full justify-center gap-6 lg:justify-start">
            {socialImgs.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                aria-label={social.name}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black-200/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:border-blue-400 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(82,174,255,0.4)]"
              >
                <img src={social.imgPath} alt="" className="h-5 w-5 object-contain" style={{ filter: "invert(1) brightness(2)" }} />
              </a>
            ))}
          </div>

          {/* Link through to the dedicated contact page */}
          <Link
            to="/contact"
            className="group mt-8 inline-flex items-center gap-2 self-center font-mono text-xs uppercase tracking-[0.2em] text-white/50 transition-colors duration-300 hover:text-blue-400 lg:self-start"
          >
            Or view all contact options
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Right Side - Glassmorphism Contact Form */}
        <div className="relative z-20 mt-10 w-full lg:mt-0 lg:w-1/2" style={{ perspective: "1200px" }}>
          <ContactForm cardRef={formRef} />
        </div>

      </div>
    </section>
  );
};

export default Contact;
