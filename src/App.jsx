import { lazy, Suspense } from 'react'
import Hero from './sections/Hero.jsx'
import NavBar from './components/NavBar.jsx'

// Lazy-load all below-fold sections so the initial bundle is small and fast
const About = lazy(() => import('./sections/About.jsx'))
const ShowCase = lazy(() => import('./sections/ShowCase.jsx'))
const FeaturedCards = lazy(() => import('./sections/FeaturedCards.jsx'))
const Experience = lazy(() => import('./sections/Experience.jsx'))
const TechStack = lazy(() => import('./sections/TechStack.jsx'))
const Contact = lazy(() => import('./sections/Contact.jsx'))
const Footer = lazy(() => import('./sections/Footer.jsx'))

const App = () => {

  return (
    <div className="bg-black overflow-hidden">
      <NavBar />
      <Hero />
      <Suspense fallback={null}>
        <About />
        <ShowCase />
        <FeaturedCards />
        <Experience />
        <TechStack />
        <Contact />
        <Footer />
      </Suspense>
    </div>
  )
}

export default App