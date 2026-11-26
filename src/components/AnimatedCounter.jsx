import { useRef, useEffect } from "react"
import { counterItems } from "../constants/index.js"
import gsap from "gsap"

/**
 * Individual animated number item.
 * Counts from 0 to the target value once the element scrolls into view.
 *
 * This sits in the hero, which ships in the entry bundle, so it uses an
 * IntersectionObserver rather than ScrollTrigger to keep that plugin out of
 * the critical JavaScript.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.item - The data object containing the value, suffix, and label.
 */
const CounterItem = ({ item }) => {
    const numberRef = useRef(null)

    useEffect(() => {
        const el = numberRef.current
        if (!el) return

        const obj = { val: 0 }
        let animation

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                observer.disconnect() // Plays once
                animation = gsap.to(obj, {
                    val: item.value,
                    duration: 2.7,
                    ease: "power2.out",
                    onUpdate: () => {
                        el.textContent = Math.floor(obj.val) + (item.suffix || "")
                    }
                })
            },
            // Same as ScrollTrigger's "top 90%": fire once the top enters the bottom 10% of the screen
            { rootMargin: "0px 0px -10% 0px" }
        )
        observer.observe(el)

        return () => {
            observer.disconnect()
            animation?.kill()
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
        <div className="padding-x-lg desktop:mt-0 mt-32" id="counter">
            <div className="mx-auto grid-3-cols">
                {counterItems.map((item) => (
                    <CounterItem key={item.label} item={item} />
                ))}
            </div>
        </div>
    )
}

export default AnimatedCounter