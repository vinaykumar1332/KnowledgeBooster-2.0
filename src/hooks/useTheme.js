import { useCallback, useSyncExternalStore } from "react";

// One shared theme for the whole page, so every ThemeToggle shows the same state.

const readInitialTheme = () => {
    try {
        const stored = localStorage.getItem("theme");
        if (stored === "light" || stored === "dark") return stored;
    } catch {
        // storage unavailable (private mode): fall through to the system preference
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

/** Writes the theme to <html>: data-theme for app tokens, .dark for shadcn. */
function applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark", theme === "dark");
    try {
        localStorage.setItem("theme", theme);
    } catch {
        // ignore: the theme still applies for this page view
    }
}

let current = null;
const listeners = new Set();

function getSnapshot() {
    if (current === null) {
        current = readInitialTheme();
        applyTheme(current);
    }
    return current;
}

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function setTheme(next) {
    current = next;
    applyTheme(next);
    listeners.forEach((listener) => listener());
}

const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Light/dark theme. Colours come from the tokens in index.css and styles/variables.css.
 * toggle(event) switches with a circular reveal from the click point where the browser
 * supports View Transitions; otherwise it switches instantly.
 */
export function useTheme() {
    const theme = useSyncExternalStore(subscribe, getSnapshot);

    const toggle = useCallback(
        (event) => {
            const next = theme === "dark" ? "light" : "dark";

            if (!document.startViewTransition || prefersReducedMotion()) {
                setTheme(next);
                return;
            }

            // Reveal origin: the click point, or the centre of the screen for keyboard use
            const x = event?.clientX || window.innerWidth / 2;
            const y = event?.clientY || window.innerHeight / 2;
            const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

            const transition = document.startViewTransition(() => setTheme(next));
            transition.ready
                .then(() => {
                    document.documentElement.animate(
                        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                        { duration: 550, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
                    );
                })
                .catch(() => {
                    // transition skipped (e.g. tab hidden): the theme is already applied
                });
        },
        [theme]
    );

    return { theme, toggle };
}

export default useTheme;
