import { useCallback, useEffect, useState } from "react";

const readInitialTheme = () => {
    try {
        const stored = localStorage.getItem("theme");
        if (stored === "light" || stored === "dark") return stored;
    } catch (_) {
        // storage unavailable (private mode): fall through to the system preference
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

/**
 * Light/dark theme. Sets data-theme on <html> and remembers the choice.
 * Colours come from the tokens in styles/variables.css.
 */
export function useTheme() {
    const [theme, setTheme] = useState(readInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        try {
            localStorage.setItem("theme", theme);
        } catch (_) {
            // ignore: the theme still applies for this page view
        }
    }, [theme]);

    const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

    return { theme, toggle };
}

export default useTheme;
