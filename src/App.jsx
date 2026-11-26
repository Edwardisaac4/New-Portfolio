import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Hero from './sections/Hero.jsx'
import NavBar from './components/NavBar.jsx'

// Below-the-fold home sections, top to bottom. Each one is its own chunk.
const SECTION_LOADERS = [
  () => import('./sections/About.jsx'),
  () => import('./sections/ShowCase.jsx'),
  () => import('./sections/FeaturedCards.jsx'),
  () => import('./sections/Experience.jsx'),
  () => import('./sections/TechStack.jsx'),
  () => import('./sections/Contact.jsx'),
  () => import('./sections/Footer.jsx'),
]

// Lazy-load the dedicated pages
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

/**
 * Renders the below-the-fold sections one per task, top to bottom.
 *
 * All the chunks download in parallel, but mounting every section in a single
 * React commit made one 250ms+ main-thread task (rendering, the first layout of
 * all that content, and every ScrollTrigger measuring the page). Yielding between
 * sections keeps each task short, so the page stays responsive while it finishes
 * building. Sections only ever mount below the ones already on screen, so the
 * ScrollTrigger positions measured by earlier sections stay valid.
 */
const BelowTheFoldSections = () => {
  const [sections, setSections] = useState(null)
  const [mountedCount, setMountedCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    Promise.all(SECTION_LOADERS.map((load) => load()))
      .then((modules) => {
        if (!cancelled) setSections(modules.map((module) => module.default))
      })
      .catch((error) => console.error('Failed to load page sections', error))
    return () => {
      cancelled = true
    }
  }, [])

  // Mount the next section in a fresh task once the previous one has committed
  useEffect(() => {
    if (!sections || mountedCount >= sections.length) return
    const id = setTimeout(() => setMountedCount((count) => count + 1), 0)
    return () => clearTimeout(id)
  }, [sections, mountedCount])

  return (
    <>
      {sections?.slice(0, mountedCount).map((Section, index) => <Section key={index} />)}
      {mountedCount < SECTION_LOADERS.length && <div className="min-h-screen bg-black" />}
    </>
  )
}

const HomePage = () => (
  <div className="bg-black overflow-hidden">
    <NavBar />
    <Hero />
    <BelowTheFoldSections />
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