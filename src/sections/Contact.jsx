import { useRef, useState, useLayoutEffect } from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import TitleHeader from "../components/TitleHeader";
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
 * The Contact section containing an email form.
 * Utilizes EmailJS to send messages directly from the client side.
 * Incorporates 3D Earth model interactions and form validation.
 */
const Contact = () => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const globeContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, success: true, message: "" });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_2x2bgc1"; 
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_x20chb5"; 
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "Oxph2KDjiH8h84J62";

    emailjs
      .send(
        serviceID,
        templateID,
        {
          from_name: formState.name,
          to_name: "Isaac Edward", 
          from_email: formState.email,
          to_email: "eddiethedev4@gmail.com", 
          message: formState.message,
        },
        publicKey
      )
      .then(
        () => {
          setLoading(false);
          setModal({ open: true, success: true, message: "Thank you! I will get back to you as soon as possible." });
          setFormState({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          setModal({ open: true, success: false, message: "Something went wrong. Please try again." });
        }
      );
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-black"
    >
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 md:px-10 lg:flex-row lg:items-center lg:gap-20">
        
        {/* Left Side - 3D Globe & Socials */}
        <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start" style={{ height: "60vh" }}>
          
          <div className="mb-8 w-full text-center lg:text-left">
            <TitleHeader title="Let's Talk" sub="📬 Ready to innovate together?" />
          </div>

          <div ref={globeContainerRef} className="w-full h-[400px] md:h-[500px] relative">
            {/* Ambient background glow behind globe */}
            <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-blue-500/20 blur-[100px]" />
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />
              <AbstractGlobe />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </div>

          {/* Social Links */}
          <div className="mt-8 flex gap-6 justify-center lg:justify-start w-full">
            {socialImgs.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className="w-12 h-12 rounded-full border border-black-50 bg-black-200/50 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:bg-blue-500/10 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(82,174,255,0.4)]"
              >
                <img src={social.imgPath} alt={social.name} className="w-5 h-5 object-contain" style={{ filter: "invert(1) brightness(2)" }} />
              </a>
            ))}
          </div>
        </div>

        {/* Right Side - Glassmorphism Contact Form */}
        <div className="relative z-20 w-full mt-10 lg:mt-0 lg:w-1/2" style={{ perspective: "1200px" }}>
          <div 
            ref={formRef}
            className="rounded-3xl border border-black-50 bg-gradient-to-br from-black-200/80 to-black-300/40 p-8 md:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
          >
            {/* Form Glow Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Drop A Message
            </h3>
            <p className="text-white-500 mb-10 text-base md:text-lg">
              Whether you have a question, a project in mind, or just want to say hi, my inbox is always open.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
              
              {/* Name Input */}
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="peer w-full bg-black-100/50 border border-black-50 rounded-xl px-5 py-4 text-white outline-none transition-all duration-300 focus:border-blue-400 focus:bg-blue-500/5 focus:shadow-[0_0_15px_rgba(82,174,255,0.1)]"
                />
                <label className="absolute left-5 top-4 text-white-500 pointer-events-none transition-all duration-300 peer-focus:-translate-y-7 peer-focus:text-blue-400 peer-focus:text-sm peer-valid:-translate-y-7 peer-valid:text-sm peer-valid:text-blue-400 bg-transparent px-1">
                  Your Name
                </label>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="peer w-full bg-black-100/50 border border-black-50 rounded-xl px-5 py-4 text-white outline-none transition-all duration-300 focus:border-blue-400 focus:bg-blue-500/5 focus:shadow-[0_0_15px_rgba(82,174,255,0.1)]"
                />
                <label className="absolute left-5 top-4 text-white-500 pointer-events-none transition-all duration-300 peer-focus:-translate-y-7 peer-focus:text-blue-400 peer-focus:text-sm peer-valid:-translate-y-7 peer-valid:text-sm peer-valid:text-blue-400 bg-transparent px-1">
                  Email Address
                </label>
              </div>

              {/* Message Textarea */}
              <div className="relative group">
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder=" "
                  className="peer w-full bg-black-100/50 border border-black-50 rounded-xl px-5 py-4 text-white outline-none transition-all duration-300 focus:border-blue-400 focus:bg-blue-500/5 focus:shadow-[0_0_15px_rgba(82,174,255,0.1)] resize-none"
                />
                <label className="absolute left-5 top-4 text-white-500 pointer-events-none transition-all duration-300 peer-focus:-translate-y-7 peer-focus:text-blue-400 peer-focus:text-sm peer-valid:-translate-y-7 peer-valid:text-sm peer-valid:text-blue-400 bg-transparent px-1">
                  Your Message
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="magnetic-btn mt-4 w-full md:w-auto self-end rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 text-white font-semibold tracking-wide transition-all duration-300 hover:shadow-[0_0_30px_rgba(82,174,255,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {loading ? "Sending..." : "Send Message"}
                {!loading && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>

      {/* Success / Error Modal Overlay */}
      {modal.open && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center cursor-pointer"
          onClick={() => setModal({ ...modal, open: false })}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            animation: "modalFadeIn 0.3s ease-out",
          }}
        >
          <div
            className="relative max-w-md w-[90%] rounded-3xl border border-black-50 p-10 text-center cursor-default"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, rgba(40, 39, 50, 0.95) 0%, rgba(20, 20, 25, 0.98) 100%)",
              boxShadow: modal.success
                ? "0 0 60px rgba(82, 174, 255, 0.2), 0 0 120px rgba(82, 174, 255, 0.05)"
                : "0 0 60px rgba(255, 80, 80, 0.2), 0 0 120px rgba(255, 80, 80, 0.05)",
              animation: "modalScaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Icon */}
            <div
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                background: modal.success
                  ? "linear-gradient(135deg, rgba(82, 174, 255, 0.2), rgba(82, 174, 255, 0.05))"
                  : "linear-gradient(135deg, rgba(255, 80, 80, 0.2), rgba(255, 80, 80, 0.05))",
                border: `2px solid ${modal.success ? "rgba(82, 174, 255, 0.4)" : "rgba(255, 80, 80, 0.4)"}`,
              }}
            >
              {modal.success ? (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#52aeff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff5050" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
            </div>

            {/* Title */}
            <h4 className="mb-3 text-2xl font-bold text-white">
              {modal.success ? "Message Sent! 🎉" : "Oops!"}
            </h4>

            {/* Message */}
            <p className="mb-8 text-white-500 text-base leading-relaxed">
              {modal.message}
            </p>

            {/* Dismiss hint */}
            <p className="text-sm text-white-500/50 tracking-wide">
              Click anywhere to dismiss
            </p>
          </div>
        </div>
      )}

      {/* Modal keyframe styles */}
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Contact;
