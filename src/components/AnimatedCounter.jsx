import { useRef, useEffect } from "react"
import { counterItems } from "../constants/index.js"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger to detect scrolling
gsap.registerPlugin(ScrollTrigger)

/**
 * Individual animated number item.
 * Uses GSAP ScrollTrigger to count from 0 to the target value when the element comes into view.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.item - The data object containing the value, suffix, and label.
 */
const CounterItem = ({ item }) => {
    const numberRef = useRef(null)

    useEffect(() => {
        const obj = { val: 0 }
        
        const animation = gsap.to(obj, {
            val: item.value,
            duration: 2.7,
            // Delay removed so it starts as soon as you scroll to it!
            ease: "power2.out",
            scrollTrigger: {
                trigger: numberRef.current,
                start: "top 90%", // Triggers when the element enters the bottom 10% of the screen
                toggleActions: "play none none none" // Plays once
            },
            onUpdate: () => {
                if (numberRef.current) {
                    numberRef.current.innerText = Math.floor(obj.val) + (item.suffix || "")
                }
            }
        })

        // Cleanup the ScrollTrigger instantly if the component unmouts
        return () => {
            if (animation.scrollTrigger) animation.scrollTrigger.kill()
            animation.kill()
        }
    }, [item.value, item.suffix])

    return (
        <div className="bg-zinc-900 rounded-lg p-9 flex flex-col">
            <div ref={numberRef} className="counter-number text-4xl font-bold mb-1 text-white">
                0{item.suffix}
            </div>
            <div className="text-white-50 text-lg">
                {item.label}
            </div>
        </div>
    )
}

/**
 * A section displaying a grid of animated counters.
 * Maps over the counterItems array to render multiple CounterItem components.
 */
const AnimatedCounter = () => {
    return (
        <div className="padding-x-lg xl:mt-0 mt-32" id="counter">
            <div className="mx-auto grid-3-cols">
                {counterItems.map((item) => (
                    <CounterItem key={item.label} item={item} />
                ))}
            </div>
        </div>
    )
}

export default AnimatedCounter