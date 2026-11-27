import { useCallback, useSyncExternalStore } from "react";

// Desktop sidebar collapsed/expanded state.
// The width is published as the CSS variable --sidebar-w on <html>; the sidebar and the
// page offset both read that one value, so they can never disagree.
// Without a saved choice it starts collapsed on screens narrower than 1280px.

const STORAGE_KEY = "sidebarCollapsed";
const AUTO_COLLAPSE_BELOW = 1280;
const WIDTH = { collapsed: "72px", expanded: "288px" };

let collapsed = null;
const listeners = new Set();

function readInitial() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "1") return true;
        if (saved === "0") return false;
    } catch {
        // storage unavailable: fall back to the screen-size default
    }
    return window.innerWidth < AUTO_COLLAPSE_BELOW;
}

function applyWidth(value) {
    document.documentElement.style.setProperty("--sidebar-w", value ? WIDTH.collapsed : WIDTH.expanded);
}

function getSnapshot() {
    if (collapsed === null) {
        collapsed = readInitial();
        applyWidth(collapsed);
    }
    return collapsed;
}

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function setCollapsed(value) {
    collapsed = value;
    applyWidth(value);
    try {
        localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    } catch {
        // ignore: the choice still applies until the page reloads
    }
    listeners.forEach((listener) => listener());
}

export function useSidebar() {
    const isCollapsed = useSyncExternalStore(subscribe, getSnapshot);
    const toggle = useCallback(() => setCollapsed(!getSnapshot()), []);
    return { collapsed: isCollapsed, toggle };
}

export default useSidebar;
