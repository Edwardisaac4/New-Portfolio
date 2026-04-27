import Hero from './sections/Hero.jsx'
import ShowCase from './sections/ShowCase.jsx'
import NavBar from './components/NavBar.jsx'
import FeaturedCards from './sections/FeaturedCards.jsx'
import Experience from './sections/Experience.jsx'
import TechStack from './sections/TechStack.jsx'
import Contact from './sections/Contact.jsx'
const App = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <ShowCase />
      <FeaturedCards />
      <Experience />
      <TechStack />
      <Contact />
    </>
  )
}

export default App