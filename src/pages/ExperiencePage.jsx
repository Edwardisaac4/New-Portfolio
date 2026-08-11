import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../sections/Footer";
import { expCards } from "../constants";

const ExperiencePage = () => {
    return (
        <div className="bg-black text-white min-h-screen flex flex-col overflow-hidden">
            <NavBar />

            <main className="flex-1 pt-32 pb-20 px-6 max-w-6xl mx-auto w-full">
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
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-blue-400 mb-3">
                        💼 Career Journey & Work History
                    </p>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent mb-6">
                        Professional Experience
                    </h1>
                    <p className="text-base sm:text-lg text-white-500 leading-relaxed">
                        A detailed breakdown of my engineering roles, key accomplishments, technical leadership, and contributions across business aviation and web development teams.
                    </p>
                </div>

                {/* Experience Timeline Grid */}
                <div className="space-y-12 relative">
                    {/* Vertical Progress Accent */}
                    <div className="hidden md:block absolute left-8 top-6 bottom-6 w-[2px] bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500/20 opacity-30" />

                    {expCards.map((card, idx) => (
                        <div
                            key={card.title + idx}
                            className="relative flex flex-col md:flex-row gap-8 bg-gradient-to-br from-black-200/80 via-black-300/40 to-black p-8 sm:p-10 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-2xl shadow-2xl"
                        >
                            {/* Company Logo & Role */}
                            <div className="md:w-1/3 flex flex-col justify-start">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-black-200/80 rounded-2xl p-2.5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                                        <img
                                            src={card.logoPath}
                                            alt={card.title}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            {card.title}
                                        </h2>
                                        <span className="inline-block mt-1 px-3 py-1 text-xs font-mono rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                            {card.date}
                                        </span>
                                    </div>
                                </div>

                                <blockquote className="text-xs text-white/50 italic border-l-2 border-blue-500/40 pl-3 my-3 leading-relaxed">
                                    "{card.review}"
                                </blockquote>
                            </div>

                            {/* Responsibilities List */}
                            <div className="md:w-2/3 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                                <h3 className="text-sm font-mono uppercase tracking-widest text-blue-400 mb-4">
                                    Key Responsibilities & Achievements
                                </h3>
                                <ul className="space-y-3.5">
                                    {card.responsibilities.map((task, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-white-500 leading-relaxed group">
                                            <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                                            <span>{task}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-24 p-10 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black text-center relative overflow-hidden">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Interested in My Full Resume or Hiring?
                    </h3>
                    <p className="text-white-500 max-w-xl mx-auto text-sm sm:text-base mb-8">
                        I am open to full-time engineering roles, freelance opportunities, and technical collaborations.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/contact"
                            className="px-7 py-3.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors duration-200 shadow-lg shadow-blue-500/25"
                        >
                            Contact Me Directly →
                        </Link>
                        <Link
                            to="/work"
                            className="px-7 py-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-sm transition-colors duration-200"
                        >
                            View Projects →
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ExperiencePage;
