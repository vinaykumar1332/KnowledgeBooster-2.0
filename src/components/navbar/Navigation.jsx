// src/components/navbar/Navigation.jsx
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FiMoon, FiSun, FiMenu, FiX, FiUpload, FiHome, FiFileText, FiLogOut, FiUser } from "react-icons/fi";
import "./Navigation.css";

export default function Navigation({
    userName: initialUserName = "",
    userEmail: initialUserEmail = "",
    variant = "light",
}) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const getInitialTheme = () => {
        try {
            const stored = localStorage.getItem("theme");
            if (stored === "light" || stored === "dark") return stored;
        } catch (_) { }
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    };
    const [theme, setTheme] = useState(getInitialTheme);
    const [isAnimatingIcon, setIsAnimatingIcon] = useState(false);
    const animationTimer = useRef(null);

    // local state for name/email (fallback to sessionStorage)
    const [userName, setUserName] = useState(initialUserName);
    const [userEmail, setUserEmail] = useState(initialUserEmail);

    const drawerRef = useRef(null);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!initialUserName || !initialUserEmail) {
            try {
                const stored = JSON.parse(sessionStorage.getItem("auth") || "null");
                if (stored?.ok) {
                    setUserName(stored.username || "");
                    setUserEmail(stored.email || "");
                }
            } catch (e) {
                // ignore
            }
        } else {
            setUserName(initialUserName);
            setUserEmail(initialUserEmail);
        }
    }, [initialUserName, initialUserEmail]);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        try {
            localStorage.setItem("theme", theme);
        } catch (_) { }
    }, [theme]);

    // close overlays on outside click
    useEffect(() => {
        const onDocClick = (e) => {
            if (drawerOpen && drawerRef.current && !drawerRef.current.contains(e.target)) setDrawerOpen(false);
            if (profileOpen && profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [drawerOpen, profileOpen]);

    // Escape to close
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && (setDrawerOpen(false), setProfileOpen(false));
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        return () => {
            if (animationTimer.current) clearTimeout(animationTimer.current);
        };
    }, []);

    // Ensure navigation closes overlays and logs for debug
    const handleNavigate = (path) => {
        console.log("Navigation: go to", path);
        setDrawerOpen(false);
        setProfileOpen(false);
        try {
            navigate(path);
        } catch (err) {
            console.error("navigate error:", err);
            // fallback hard navigation
            window.location.href = path;
        }
    };

    const handleLogout = () => {
        try { sessionStorage.removeItem("auth"); } catch (e) { }
        window.dispatchEvent(new Event("authChange"));
        setProfileOpen(false);
        setDrawerOpen(false);
        navigate("/login", { replace: true });
    };

    function initialsFromName(name) {
        if (!name) return "U";
        const parts = name.trim().split(" ").filter(Boolean);
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return (
        <>
            <header className={`kh-header ${variant === "dark" ? "kh-dark" : ""}`}>
                <div className="kh-header-inner">
                    <div className="kh-left">
                        <button
                            className={`kh-hamburger ${drawerOpen ? "open" : ""}`}
                            onClick={() => setDrawerOpen((v) => !v)}
                            aria-label="Toggle menu"
                            type="button"
                            style={{ color: 'var(--kh-text)' }}
                        >
                            {drawerOpen ? <FiX size={28} color="var(--kh-text)" /> : <FiMenu size={28} color="var(--kh-text)" />}
                        </button>

                        <div className="kh-logo" onClick={() => handleNavigate("/home")} role="button" tabIndex={0}>
                            <div className="kh-logo-mark">KH</div>
                            <div className="kh-title">
                                <div className="kh-title-main">Knowledge Hut 2.0</div>
                                <div className="kh-title-sub">{userEmail}</div>
                            </div>
                        </div>
                    </div>

                    <nav className="kh-nav" aria-label="Main navigation">
                        <ul>
                            <li>
                                <button type="button" className="kh-link" onClick={() => handleNavigate("/home")}>
                                    Home
                                </button>
                            </li>
                            <li>
                                <button type="button" className="kh-link" onClick={() => handleNavigate("/upload")}>
                                    Upload
                                </button>
                            </li>
                            <li>
                                <button type="button" className="kh-link" onClick={() => handleNavigate("/files")}>
                                    Files
                                </button>
                            </li>
                        </ul>
                    </nav>

                    <div className="kh-profile-wrap" ref={profileRef}>
                        <button
                            className={`kh-theme-toggle ${isAnimatingIcon ? "animate" : ""}`.trim()}
                            type="button"
                            onClick={() => {
                                setIsAnimatingIcon(true);
                                setTheme((t) => (t === "dark" ? "light" : "dark"));
                                if (animationTimer.current) clearTimeout(animationTimer.current);
                                animationTimer.current = setTimeout(() => {
                                    setIsAnimatingIcon(false);
                                }, 380);
                            }}
                            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        >
                            {theme === "dark" ? <FiSun /> : <FiMoon />}
                        </button>

                        <button className="kh-avatar-btn" onClick={() => setProfileOpen((v) => !v)} type="button">
                            <div className="kh-avatar">{initialsFromName(userName)}</div>
                        </button>

                        <div className={`kh-profile-menu ${profileOpen ? "open" : ""}`}>
                            <div className="kh-profile-card">
                                <div className="kh-avatar small">{initialsFromName(userName)}</div>
                                <div>
                                    <div className="kh-profile-name">{userName}</div>
                                    <div className="kh-profile-email">{userEmail}</div>
                                </div>
                            </div>

                            <ul className="kh-profile-actions">
                                <li><button type="button" onClick={() => handleNavigate("/profile")} style={{ color: 'var(--kh-text)', display: 'flex', alignItems: 'center', gap: 8 }}><FiUser style={{ color: 'var(--kh-text)' }} /> Profile</button></li>
                                <li><button type="button" onClick={() => handleNavigate("/my-uploads")} style={{ color: 'var(--kh-text)', display: 'flex', alignItems: 'center', gap: 8 }}><FiUpload style={{ color: 'var(--kh-text)' }} /> My Uploads</button></li>
                                <li><button type="button" onClick={handleLogout} style={{ color: 'var(--kh-text)', display: 'flex', alignItems: 'center', gap: 8 }}><FiLogOut style={{ color: 'var(--kh-text)' }} /> Sign Out</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            {/* Drawer overlay */}
            <div className={`kh-drawer-overlay ${drawerOpen ? "visible" : ""}`} onClick={() => setDrawerOpen(false)} />

            {/* Drawer */}
            <aside className={`kh-drawer ${drawerOpen ? "open" : ""}`} ref={drawerRef}>
                <div className="kh-drawer-header">
                    <div>
                        <div className="kh-drawer-title">Menu</div>
                        <div className="kh-drawer-sub">{userEmail}</div>
                    </div>
                    <button className="kh-drawer-close" onClick={() => setDrawerOpen(false)} type="button">✕</button>
                </div>

                <ul className="kh-drawer-list">
                    <li><button className="kh-drawer-item" type="button" onClick={() => handleNavigate("/home")} style={{ color: 'var(--kh-text)', display: 'flex', alignItems: 'center', gap: 8 }}><FiHome style={{ color: 'var(--kh-text)' }} /> Home</button></li>
                    <li><button className="kh-drawer-item" type="button" onClick={() => handleNavigate("/upload")} style={{ color: 'var(--kh-text)', display: 'flex', alignItems: 'center', gap: 8 }}><FiUpload style={{ color: 'var(--kh-text)' }} /> Upload</button></li>
                    <li><button className="kh-drawer-item" type="button" onClick={() => handleNavigate("/files")} style={{ color: 'var(--kh-text)', display: 'flex', alignItems: 'center', gap: 8 }}><FiFileText style={{ color: 'var(--kh-text)' }} /> Files</button></li>
                </ul>

                <div className="kh-drawer-footer">
                    <div className="kh-avatar small">{initialsFromName(userName)}</div>
                    <div className="kh-drawer-user-name">{userName}</div>
                    <button className="kh-logout" onClick={handleLogout} type="button"><FiLogOut style={{ marginRight: 6 }} /> Sign Out</button>
                </div>
            </aside>
        </>
    );
}

Navigation.propTypes = {
    userName: PropTypes.string,
    userEmail: PropTypes.string,
    variant: PropTypes.oneOf(["light", "dark"]),
};
