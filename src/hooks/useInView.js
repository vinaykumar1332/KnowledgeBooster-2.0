import { useEffect, useRef, useState } from "react";

const canObserve = () => typeof IntersectionObserver !== "undefined";

/**
 * Reports whether an element has entered the viewport.
 * Without IntersectionObserver (very old browsers) content is shown immediately.
 * @param {{ threshold?: number, once?: boolean }} options
 * @returns {[React.RefObject, boolean]}
 */
export function useInView({ threshold = 0.15, once = true } = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(() => !canObserve());

    useEffect(() => {
        const el = ref.current;
        if (!el || !canObserve()) return undefined;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    if (once) observer.disconnect();
                } else if (!once) {
                    setInView(false);
                }
            },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, once]);

    return [ref, inView];
}

export default useInView;
