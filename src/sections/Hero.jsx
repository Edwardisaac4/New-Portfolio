import Button from "../components/Button.jsx"
import { words } from "../constants/index.js"
import HeroExperience from "../components/HeroModels/HeroExperience.jsx"
const Hero = () => {
    return (
        <section id="hero" className = "relative overflow-hidden">
            <div className = "absolute top-0 z-10 left-0">
                <img src = "/images/bg.png" alt = "background" />
            </div>

            <div className="hero-layout">
                {/*LEFT CONTENT OF THE HERO SECTION*/}
                <header className = "flex flex-col md:w-full justify-center w-screen md:px-18 px-4">
                    <div className="flex flex-col gap-5">
                        <div className="hero-text">
                            <h1>Shaping 
                                <span className="slide">
                                    <span className="wrapper">
                                        {words.map((word) => (
                                            <span key={word.text} className="flex items-center md:gap-2.5 
                                                gap-0.5 pb-1
                                            ">
                                                <img src={word.imgPath} alt={word.text}
                                                    className = "xl:size-10 md:size-8 size-6 md:p-1.5 p-1 rounded-full bg-white-50"
                                                />

                                                <span>{word.text}</span>
                                            </span>
                                        ))}
                                    </span>
                                </span>

                            </h1>
                            <h1>Into Real Projects</h1>
                            <h1>That Deliver Results</h1>
                        </div>

                        <p className="pointer-events-none text-white-50 relative z-9 md:text-xl text-lg">
                            I'm Isaac, A Front End Developer with a passion for <br />building innovative and user-friendly web applications
                        </p>
                        
                        <Button
                            className="md:w-78 md:h-14 w-57 h-10"
                            id="button"
                            text="See My Work"
                        />
                    </div>
                </header>
                
                {/*RIGHT CONTENT OF THE HERO SECTION*/}
                <figure className="hero-3d-layout">
                    <HeroExperience />
                </figure>
            </div>



            
        </section>
    )
}

export default Hero