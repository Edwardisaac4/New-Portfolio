import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../sections/Footer";
import { projects } from "../constants";
import LazyVideo from "../components/LazyVideo.jsx";

const WorkPage = () => {
    const [selectedFilter, setSelectedFilter] = useState("All");

    const filters = ["All", "React", "Three.js", "Vanilla JS", "AI"];

    const filteredProjects = selectedFilter === "All"
        ? projects
        : projects.filter((p) => {
            if (selectedFilter === "React") return p.tech.includes("React");
            if (selectedFilter === "Three.js") return p.tech.includes("Three.js") || p.tech.includes("React Three Fiber");
            if (selectedFilter === "Vanilla JS") return p.tech.includes("Vanilla JS") || p.tech.includes("JavaScript");
            if (selectedFilter === "AI") return p.desc.toLowerCase().includes("ai") || p.title.toLowerCase().includes("resume");
            return true;
        });

    return (
        <div className="bg-black text-white min-h-screen flex flex-col overflow-hidden">
            <NavBar />

            <main className="flex-1 pt-32 pb-20 px-6 max-w-7xl mx-auto w-full">
                {/* Back Link */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60 hover:text-white hover:border-white/30 transition-all duration-200"
                    >
                        ← Back to Home
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-blue-400 mb-3">
                        📁 Curated Portfolio & Digital Creations
                    </p>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent mb-6">
                        Featured Work
                    </h1>
                    <p className="text-base sm:text-lg text-white-500 leading-relaxed">
                        Explore my full suite of web applications, 3D interactive interfaces, AI tools, and high-performance landing pages built with modern frontend architecture.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setSelectedFilter(filter)}
                            className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                                selectedFilter === filter
                                    ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                                    : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredProjects.map((project, idx) => (
                        <div
                            key={project.id}
                            className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-black-200/70 via-black-300/40 to-black overflow-hidden flex flex-col justify-between backdrop-blur-2xl hover:border-white/25 transition-all duration-500 hover:-translate-y-1 shadow-2xl"
                        >
                            {/* Media Viewport */}
                            <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-black/50">
                                {project.media.type === "video" ? (
                                    <LazyVideo
                                        src={project.media.src}
                                        poster={project.media.poster}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <img
                                        src={project.media.src}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                                <span className="absolute top-4 left-4 text-[10px] font-mono tracking-widest text-blue-400 uppercase bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                                    Project / 0{idx + 1}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="p-7 flex flex-col flex-1 justify-between gap-5">
                                <div>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-white-500 leading-relaxed line-clamp-3">
                                        {project.desc}
                                    </p>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((t) => (
                                            <span
                                                key={t}
                                                className="px-2.5 py-1 text-[10px] font-mono rounded-full bg-white/5 border border-white/10 text-white/60"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
                                        >
                                            GitHub Repository →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-24 p-10 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black text-center relative overflow-hidden">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Have a Custom Project in Mind?
                    </h3>
                    <p className="text-white-500 max-w-xl mx-auto text-sm sm:text-base mb-8">
                        Let's collaborate to build an exceptional web application tailored to your needs.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors duration-200 shadow-lg shadow-blue-500/25"
                    >
                        Start a Conversation →
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default WorkPage;
