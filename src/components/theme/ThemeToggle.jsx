import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../hooks/useTheme";
import { UI_CONFIG } from "../../config/ui.config";
import "./ThemeToggle.css";

/** Icon button that switches between light and dark (black and white) themes. */
export default function ThemeToggle({ className = "" }) {
    const { theme, toggle } = useTheme();
    const nextLabel = theme === "dark" ? UI_CONFIG.THEME.LIGHT : UI_CONFIG.THEME.DARK;

    return (
        <button
            type="button"
            className={`kh-theme-toggle ${className}`.trim()}
            onClick={toggle}
            aria-label={nextLabel}
            title={nextLabel}
        >
            {theme === "dark" ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
        </button>
    );
}
