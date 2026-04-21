import Hero from './sections/Hero.jsx'
import ShowCase from './sections/ShowCase.jsx'
import NavBar from './components/NavBar.jsx'
import FeaturedCards from './sections/FeaturedCards.jsx'
import Experience from './sections/Experience.jsx'

const App = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <ShowCase />
      <FeaturedCards />
      <Experience/>
    </>
  )
}

export default App