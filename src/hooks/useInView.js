import { useEffect, useRef, useState } from "react";

/**
 * Reports whether an element has entered the viewport.
 * @param {{ threshold?: number, once?: boolean }} options
 * @returns {[React.RefObject, boolean]}
 */
export function useInView({ threshold = 0.15, once = true } = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        if (typeof IntersectionObserver === "undefined") {
            setInView(true);
            return undefined;
        }
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
