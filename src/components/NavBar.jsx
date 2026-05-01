import { navLinks } from "../constants";
import { useState, useEffect } from "react";

/**
 * Main navigation bar component.
 * Tracks scroll position to apply a blurred, semi-transparent background when scrolled down.
 */
const NavBar = () => {
    const [scrolled, setScrolled] = useState(false);

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
                
                <a href="#contact" className="contact-btn group flex">
                    <div className="contact-inner">
                        <span>Contact Me</span>
                    </div>
                </a>
            </div>
        </header>
    )
}

export default NavBar;