import { navLinks } from "../constants";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Main navigation bar component.
 * Tracks scroll position to apply a blurred, semi-transparent background when scrolled down.
 */
const NavBar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

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
                <Link to="/" className="logo">
                    Isaac Edward
                </Link>

                <nav className="desktop">
                    <ul>
                        {navLinks.map(({link, name}) => {
                            const isActive = location.pathname === link;
                            return (
                                <li key={name} className="group">
                                    <Link to={link} className={isActive ? 'text-blue-400 font-semibold' : ''}>
                                        <span>{name}</span>
                                        <span className={`underline ${isActive ? 'w-full bg-blue-400' : ''}`} />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                
                <Link to="/contact" className="contact-btn group flex">
                    <div className="contact-inner">
                        <span>Let's Talk</span>
                    </div>
                </Link>
            </div>
        </header>
    )
}

export default NavBar;