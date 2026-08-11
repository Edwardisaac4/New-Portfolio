import { useRef, useState, useEffect } from 'react'

/**
 * LazyVideo — defers binding the video `src` until the element is near the viewport.
 * This prevents GTmetrix / Lighthouse from downloading the whole video set on initial paint.
 * Once loaded, the video auto-plays when visible and pauses when scrolled away.
 *
 * Shared by the homepage showcase (src/sections/ShowCase.jsx) and the
 * dedicated work page (src/pages/WorkPage.jsx), which renders every project at once.
 */
const LazyVideo = ({ src, poster, className }) => {
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (!isLoaded) {
                        el.src = src;
                        el.load();
                        setIsLoaded(true);
                    }
                    el.play().catch(() => {});
                } else {
                    el.pause();
                }
            },
            { rootMargin: '300px', threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [src, isLoaded]);

    return (
        <video
            ref={videoRef}
            poster={poster}
            loop
            playsInline
            muted
            preload="none"
            className={className}
        />
    );
};

export default LazyVideo;
