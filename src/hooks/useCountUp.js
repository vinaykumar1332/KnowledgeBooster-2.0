import { useEffect, useState } from "react";

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Animates a number from 0 to `target` once `start` is true.
 * Skips the animation when the user prefers reduced motion.
 */
export function useCountUp(target, { duration = 1200, start = true } = {}) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!start) return undefined;
        if (prefersReducedMotion() || !target) {
            setValue(target);
            return undefined;
        }
        let frame;
        const t0 = performance.now();
        const tick = (now) => {
            const progress = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target, duration, start]);

    return value;
}

export default useCountUp;
