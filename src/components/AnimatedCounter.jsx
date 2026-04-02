import { counterItems } from "../constants/index.js"
import CountUp from "react-countup"

const AnimatedCounter = () => {
    return (
        <div className="padding-x-lg xl:mt-0 mt-32" id="counter">
            <div className="mx-auto grid-3-cols">
                {counterItems.map((item) => (
                    <div className="bg-zinc-900 rounded-lg p-9 flex flex-col" key={item.label}>
                        <div className="counter-number text-4xl font-bold mb-1 text-white">
                            <CountUp
                                end={item.value}
                                suffix={item.suffix}
                                duration={2}
                            />
                        </div>
                        <div className="text-white-50 text-lg">
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AnimatedCounter