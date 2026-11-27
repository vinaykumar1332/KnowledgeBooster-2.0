import { useEffect, useState } from "react";

/**
 * True while the user is scrolling down (to tuck bars away), false when scrolling
 * up or near the top. Small movements under `threshold` px are ignored so the bars
 * do not flicker.
 */
export function useHideOnScroll({ threshold = 8, topOffset = 64 } = {}) {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        let lastY = window.scrollY;
        let ticking = false;

        const update = () => {
            const y = window.scrollY;
            const delta = y - lastY;
            if (y < topOffset) {
                setHidden(false);
                lastY = y;
            } else if (delta > threshold) {
                setHidden(true);
                lastY = y;
            } else if (delta < -threshold) {
                setHidden(false);
                lastY = y;
            }
            ticking = false;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [threshold, topOffset]);

    return hidden;
}

export default useHideOnScroll;
