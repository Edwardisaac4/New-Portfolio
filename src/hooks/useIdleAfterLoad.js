import { useEffect, useState } from "react";

/**
 * Becomes `true` once the page has finished loading and the browser is idle.
 *
 * Use it to defer non-critical, CPU-heavy work (like booting a WebGL scene) until
 * after the first paint, so it doesn't compete with the content the visitor sees
 * first. `timeout` caps the wait for an idle period once the page has loaded.
 *
 * @param {object} [options]
 * @param {number} [options.timeout] Max ms to wait for idle time after `load`.
 * @returns {boolean}
 */
const useIdleAfterLoad = ({ timeout = 2000 } = {}) => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let idleId;
        let timeoutId;

        const schedule = () => {
            if ("requestIdleCallback" in window) {
                idleId = window.requestIdleCallback(() => setReady(true), { timeout });
            } else {
                // Safari has no requestIdleCallback; a short delay after load is close enough.
                timeoutId = window.setTimeout(() => setReady(true), 200);
            }
        };

        if (document.readyState === "complete") schedule();
        else window.addEventListener("load", schedule, { once: true });

        return () => {
            window.removeEventListener("load", schedule);
            if (idleId !== undefined) window.cancelIdleCallback(idleId);
            window.clearTimeout(timeoutId);
        };
    }, [timeout]);

    return ready;
};

export default useIdleAfterLoad;
