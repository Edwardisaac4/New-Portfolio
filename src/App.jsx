import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import ShowCase from './sections/ShowCase.jsx'
import NavBar from './components/NavBar.jsx'
import FeaturedCards from './sections/FeaturedCards.jsx'
import Experience from './sections/Experience.jsx'
import TechStack from './sections/TechStack.jsx'
import Contact from './sections/Contact.jsx'
import Footer from './sections/Footer.jsx'

const App = () => {

  return (
    <div className="bg-black overflow-hidden">
      <NavBar />
      <Hero />
      <About />
      <ShowCase />
      <FeaturedCards />
      <Experience />
      <TechStack />
      <Contact />
      <Footer />
    </div>
  )
}

export default App