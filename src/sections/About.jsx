import React, { useRef, useLayoutEffect, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Float, useTexture } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

const EarthGlobe = () => {
  const sphereRef = useRef();
  const colorMap = useTexture('https://unpkg.com/three-globe/example/img/earth-night.jpg');

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.z = 0.2; // Slight tilt
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={sphereRef} args={[1, 64, 64]} scale={1.8}>
        <meshStandardMaterial 
          map={colorMap} 
          roughness={0.6} 
          metalness={0.1}
        />
      </Sphere>
    </Float>
  );
};

const About = () => {
  const gridRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".bento-card");
      
      // More pronounced entrance animation
      gsap.fromTo(
        cards,
        { opacity: 0, y: 100, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.2,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 75%",
          },
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="relative w-full min-h-screen flex items-center justify-center bg-black overflow-hidden py-24">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        
        <div className="mb-12 md:mb-16">
          <TitleHeader title="About Me" sub="🧑‍💻 Who I Am" />
        </div>

        {/* Bento Grid Layout */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[550px] lg:h-[600px]">
          
          {/* Card 1: Portrait (Spans 1 col, 2 rows) */}
          <div className="bento-card md:row-span-2 col-span-1 rounded-3xl border border-white/5 bg-gradient-to-b from-black-200/80 to-black-300/40 backdrop-blur-2xl overflow-hidden relative group flex flex-col items-center justify-end shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            {/* Inner Glow on Hover */}
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500 z-0" />
            <img 
               src="/images/eddie_pic-removebg-preview.png" 
               alt="Isaac Edward" 
               className="w-[130%] h-auto object-contain object-bottom relative z-10 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105 -mb-6 md:-mb-10" 
            />
          </div>

          {/* Card 2: Bio (Spans 2 cols, 1 row) */}
          <div className="bento-card md:col-span-2 rounded-3xl border border-white/5 bg-gradient-to-br from-black-200/80 to-black-300/40 backdrop-blur-2xl p-8 md:p-12 relative overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col justify-center items-center text-center">
            {/* Accent Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none group-hover:scale-150 transition-transform duration-700" />
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 lg:mb-6 leading-tight">
              Digital <span className="text-blue-400">Craft</span>.
            </h3>
            <p className="text-white-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Hi, I'm Isaac Edward, a Frontend Engineer. I specialize in bridging the gap between exceptional design and flawless technical execution. By combining clean architecture with high-end animations, I craft intuitive interfaces that don't just work—they wow.
            </p>
          </div>

          {/* Card 3: Location (Spans 1 col, 1 row) */}
          <div className="bento-card col-span-1 rounded-3xl border border-white/5 bg-gradient-to-bl from-black-200/80 to-black-300/40 backdrop-blur-2xl p-8 relative overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#52aeff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/></svg>
             </div>
             <h4 className="text-xl font-bold text-white mb-2">Based In</h4>
             <p className="text-white-500">Nigeria, Working Worldwide</p>
          </div>

          {/* Card 4: 3D Globe (Spans 1 col, 1 row) */}
          <div className="bento-card col-span-1 rounded-3xl border border-white/5 bg-gradient-to-br from-black-200/80 to-black-300/40 backdrop-blur-2xl p-0 relative overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-grab active:cursor-grabbing min-h-[200px]">
             {/* Gradient glow behind globe */}
             <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white-500/10 blur-[40px] pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-500" />
             <div className="w-full h-full absolute inset-0">
               <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                 <ambientLight intensity={3} />
                 <directionalLight position={[10, 10, 5]} intensity={4} />
                 <directionalLight position={[-10, -10, -5]} intensity={2} />
                 <Suspense fallback={null}>
                   <EarthGlobe />
                 </Suspense>
                 <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
               </Canvas>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
