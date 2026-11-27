import React from "react";
import { useInView } from "../../hooks/useInView";

/**
 * Fades and slides its children in when they scroll into view.
 * Use `delay` (ms) to stagger a group of siblings.
 */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
    const [ref, inView] = useInView();
    return (
        <Tag
            ref={ref}
            className={`reveal ${inView ? "in" : ""} ${className}`.trim()}
            style={{ transitionDelay: `${delay}ms` }}
            {...rest}
        >
            {children}
        </Tag>
    );
}
