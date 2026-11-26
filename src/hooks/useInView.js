import { useEffect, useState } from "react";

/**
 * Tracks whether an element is in (or near) the viewport.
 *
 * Returns `inView` (currently intersecting) and `hasEntered` (has intersected at
 * least once). Mount heavy content such as a WebGL canvas on `hasEntered`, so it
 * is only created when the visitor gets close to it, and pause its work with
 * `inView` while it is scrolled away.
 *
 * @param {React.RefObject<Element>} ref  Element to observe.
 * @param {object} [options]
 * @param {string} [options.rootMargin]   Grows the viewport, e.g. "200px" to start early.
 * @returns {{ inView: boolean, hasEntered: boolean }}
 */
const useInView = (ref, { rootMargin = "0px" } = {}) => {
    const [state, setState] = useState({ inView: false, hasEntered: false });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setState((prev) => {
                    if (entry.isIntersecting) {
                        return prev.inView ? prev : { inView: true, hasEntered: true };
                    }
                    return prev.inView ? { ...prev, inView: false } : prev;
                });
            },
            { rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [ref, rootMargin]);

    return state;
};

export default useInView;
