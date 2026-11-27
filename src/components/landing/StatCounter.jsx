import React from "react";
import { useInView } from "../../hooks/useInView";
import { useCountUp } from "../../hooks/useCountUp";

/**
 * Animated stat. Pass `value={null}` while data is loading to show a placeholder.
 */
export default function StatCounter({ label, value }) {
    const [ref, inView] = useInView();
    const count = useCountUp(Number(value) || 0, { start: inView && value !== null });

    return (
        <div ref={ref} className="stat-counter">
            <div className="stat-counter-value">{value === null ? "—" : count.toLocaleString()}</div>
            <div className="stat-counter-label">{label}</div>
        </div>
    );
}
