import { useEffect, useState } from "react";

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Animates a number from 0 to `target` once `start` is true.
 * With reduced motion the final value is returned immediately.
 */
export function useCountUp(target, { duration = 1200, start = true } = {}) {
    const [value, setValue] = useState(0);
    const reduced = prefersReducedMotion();

    useEffect(() => {
        if (!start || reduced || !target) return undefined;
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
    }, [target, duration, start, reduced]);

    if (reduced) return start ? target : 0;
    return target ? value : 0;
}

export default useCountUp;
