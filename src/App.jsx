import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Hero from './sections/Hero.jsx'
import NavBar from './components/NavBar.jsx'

// Lazy-load all below-fold sections and dedicated pages
const About = lazy(() => import('./sections/About.jsx'))
const ShowCase = lazy(() => import('./sections/ShowCase.jsx'))
const FeaturedCards = lazy(() => import('./sections/FeaturedCards.jsx'))
const Experience = lazy(() => import('./sections/Experience.jsx'))
const TechStack = lazy(() => import('./sections/TechStack.jsx'))
const Contact = lazy(() => import('./sections/Contact.jsx'))
const Footer = lazy(() => import('./sections/Footer.jsx'))

const WorkPage = lazy(() => import('./pages/WorkPage.jsx'))
const ExperiencePage = lazy(() => import('./pages/ExperiencePage.jsx'))
const SkillsPage = lazy(() => import('./pages/SkillsPage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))

// Automatically scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const HomePage = () => (
  <div className="bg-black overflow-hidden">
    <NavBar />
    <Hero />
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <About />
      <ShowCase />
      <FeaturedCards />
      <Experience />
      <TechStack />
      <Contact />
      <Footer />
    </Suspense>
  </div>
);

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono text-sm">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App