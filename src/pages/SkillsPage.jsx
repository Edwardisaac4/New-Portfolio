import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../sections/Footer";
import { techStackIcons, skillCategories } from "../constants";

const SkillsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categoryFilters = ["All", ...skillCategories.map((c) => c.title)];

    const filteredCategories = selectedCategory === "All"
        ? skillCategories
        : skillCategories.filter((c) => c.title === selectedCategory);

    return (
        <div className="bg-black text-white min-h-screen flex flex-col overflow-hidden">
            <NavBar />

            {/* Page Header */}
            <main className="flex-1 pt-32 pb-20 px-6 max-w-7xl mx-auto w-full">
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60 hover:text-white hover:border-white/30 transition-all duration-200"
                    >
                        ← Back to Home
                    </Link>
                </div>

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-blue-400 mb-3">
                        ⚡ Technical Arsenal & Core Competencies
                    </p>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent mb-6">
                        Skills & Expertise
                    </h1>
                    <p className="text-base sm:text-lg text-white-500 leading-relaxed">
                        A comprehensive overview of the modern frameworks, languages, design systems, and developer tools I utilize to craft high-performance digital experiences.
                    </p>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
                    {categoryFilters.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                                selectedCategory === cat
                                    ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                                    : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* 3D Bento Grid (Shown when 'All' is selected or for technologies) */}
                {selectedCategory === "All" && (
                    <div className="mb-24">
                        <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
                            <span>💻</span> Core Tech Stack (Bento Grid)
                        </h2>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 auto-rows-auto">
                            {techStackIcons.map((icon) => (
                                <div
                                    key={icon.name}
                                    className="group relative flex flex-col p-6 rounded-3xl backdrop-blur-2xl border border-white/10 hover:border-white/25 transition-all duration-500 overflow-hidden"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(30, 30, 42, 0.7) 0%, rgba(16, 16, 24, 0.4) 100%)",
                                        boxShadow: `0 20px 50px -20px ${icon.color}25, 0 8px 32px rgba(0,0,0,0.5)`,
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/50">
                                            {icon.tag}
                                        </span>
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: icon.color, boxShadow: `0 0 10px ${icon.color}` }}
                                        />
                                    </div>
                                    <div className="w-12 h-12 mb-4 drop-shadow-md">
                                        <img
                                            src={icon.iconPath}
                                            alt={icon.name}
                                            className="w-full h-full object-contain"
                                            style={icon.isWhite ? { filter: "brightness(0) invert(1)" } : {}}
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                                        {icon.name}
                                    </h3>
                                    {icon.desc && (
                                        <p className="mt-1 text-xs text-white-500 leading-relaxed">
                                            {icon.desc}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Categorized Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCategories.map((cat) => (
                        <div
                            key={cat.title}
                            className="rounded-3xl border border-white/10 backdrop-blur-xl p-7 bg-gradient-to-br from-black-200/60 to-black-300/20 relative overflow-hidden group hover:border-white/20 transition-all duration-500"
                            style={{ borderLeftWidth: "4px", borderLeftColor: cat.color }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-2xl">{cat.emoji}</span>
                                <h3 className="text-xl font-bold text-white tracking-wide">
                                    {cat.title}
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {cat.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3.5 py-2 text-xs rounded-full border border-white/10 bg-white/5 text-white-50 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-24 p-10 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black text-center relative overflow-hidden">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Ready to Bring Your Vision to Life?
                    </h3>
                    <p className="text-white-500 max-w-xl mx-auto text-sm sm:text-base mb-8">
                        Whether you need a custom web application, high-end animations, or performance optimization, let's connect.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors duration-200 shadow-lg shadow-blue-500/25"
                    >
                        Get In Touch →
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SkillsPage;
