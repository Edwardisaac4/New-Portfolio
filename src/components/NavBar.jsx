import { navLinks } from "../constants";
import { useState, useEffect } from "react";

const NavBar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            if (scrollTop > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prev) => !prev);
    };

    return (
        <header className={`navbar ${scrolled ? 'scrolled' : 'not-scrolled'}`}>
            <div className="nav-container relative z-50">
                <a href="#hero" className="logo">
                    Isaac Edward
                </a>

                <nav className="desktop">
                    <ul>
                        {navLinks.map(({link, name}) => (
                            <li key={name} className="group">
                                <a href={link}>
                                    <span>{name}</span>
                                    <span className="underline" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                
                <a href="#contact" className="contact-btn group hidden lg:flex">
                    <div className="contact-inner">
                        <span>Contact Me</span>
                    </div>
                </a>

                {/* Mobile menu button */}
                <button 
                    className="lg:hidden flex flex-col items-center justify-center gap-1.5 z-50 relative w-8 h-8"
                    onClick={toggleMobileMenu}
                >
                    <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 lg:hidden flex flex-col items-center justify-center transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-full'}`}>
                <nav className="flex flex-col items-center gap-8">
                    {navLinks.map(({link, name}) => (
                        <a 
                            key={name} 
                            href={link} 
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-2xl font-semibold text-white-50 hover:text-blue-400 transition-colors"
                        >
                            {name}
                        </a>
                    ))}
                    <a 
                        href="#contact" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="mt-4 px-8 py-3 rounded-full bg-white text-black font-bold text-lg hover:bg-blue-400 hover:text-white transition-colors"
                    >
                        Contact Me
                    </a>
                </nav>
            </div>
        </header>
    )
}

export default NavBar;