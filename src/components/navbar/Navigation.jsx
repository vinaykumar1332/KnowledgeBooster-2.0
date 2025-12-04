// src/components/navbar/Navigation.jsx
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";

export default function Navigation({
    userName: initialUserName = "",
    userEmail: initialUserEmail = "",
    variant = "light",
}) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // maintain local state so we can fall back to sessionStorage if needed
    const [userName, setUserName] = useState(initialUserName);
    const [userEmail, setUserEmail] = useState(initialUserEmail);

    const drawerRef = useRef(null);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    // If props were not provided, try to load from sessionStorage once
    useEffect(() => {
        if (!initialUserName || !initialUserEmail) {
            try {
                const stored = JSON.parse(sessionStorage.getItem("auth") || "null");
                if (stored?.ok) {
                    setUserName((n) => n || stored.username || "");
                    setUserEmail((e) => e || stored.email || "");
                }
            } catch (e) {
                // ignore parse errors
            }
        } else {
            // if props provided, use them
            setUserName(initialUserName);
            setUserEmail(initialUserEmail);
        }
    }, [initialUserName, initialUserEmail]);

    // helper: initials from name
    function initialsFromName(name) {
        if (!name) return "U";
        const parts = name.trim().split(" ").filter(Boolean);
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    // Outside click close drawer + profile
    useEffect(() => {
        const handleClick = (e) => {
            if (drawerOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
                setDrawerOpen(false);
            }
            if (profileOpen && profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [drawerOpen, profileOpen]);

    // Escape key closes overlays
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") {
                setDrawerOpen(false);
                setProfileOpen(false);
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    // LOGOUT: remove auth, notify App, close UI, navigate
    function handleLogout() {
        try {
            sessionStorage.removeItem("auth");
        } catch (e) {
            // ignore
        }

        // notify App to reload auth state
        window.dispatchEvent(new Event("authChange"));

        // close overlays
        setProfileOpen(false);
        setDrawerOpen(false);

        // navigate to login (replace history)
        navigate("/login", { replace: true });
    }

    return (
        <>
            <header className={`kh-header ${variant === "dark" ? "kh-dark" : ""}`}>
                <div className="kh-header-inner">
                    {/* Left */}
                    <div className="kh-left">
                        <button
                            className={`kh-hamburger ${drawerOpen ? "open" : ""}`}
                            onClick={() => setDrawerOpen((v) => !v)}
                            aria-label="Open menu"
                        >
                            <span className="kh-ham-line" />
                            <span className="kh-ham-line" />
                            <span className="kh-ham-line" />
                        </button>

                        <div
                            className="kh-logo"
                            role="button"
                            tabIndex={0}
                            onClick={() => navigate("/home")}
                            onKeyDown={(e) => e.key === "Enter" && navigate("/home")}
                        >
                            <div className="kh-logo-mark" aria-hidden>
                                <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="100%" height="100%" fill="black" rx="4" />
                                    <text
                                        x="50%"
                                        y="58%"
                                        textAnchor="middle"
                                        fontSize="10"
                                        fill="white"
                                        fontFamily="sans-serif"
                                    >
                                        KH
                                    </text>
                                </svg>
                            </div>

                            <div className="kh-title">
                                <div className="kh-title-main">Knowledge Hut 2.0</div>
                                <div className="kh-title-sub">{userEmail}</div>
                            </div>
                        </div>
                    </div>

                    {/* Center Nav (Desktop) */}
                    <nav className="kh-nav" aria-label="Main navigation">
                        <ul>
                            <li>
                                <button className="kh-link" onClick={() => navigate("/home")}>
                                    Home
                                </button>
                            </li>
                            <li>
                                <button className="kh-link" onClick={() => navigate("/upload")}>
                                    Upload
                                </button>
                            </li>
                            <li>
                                <button className="kh-link" onClick={() => navigate("/files")}>
                                    Files
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {/* Profile */}
                    <div className="kh-profile-wrap" ref={profileRef}>
                        <button
                            className="kh-avatar-btn"
                            onClick={() => setProfileOpen((v) => !v)}
                            aria-haspopup="true"
                            aria-expanded={profileOpen}
                        >
                            <div className="kh-avatar" title={userName || userEmail}>
                                {initialsFromName(userName)}
                            </div>
                        </button>

                        {/* Profile menu */}
                        <div className={`kh-profile-menu ${profileOpen ? "open" : ""}`}>
                            <div className="kh-profile-card">
                                <div className="kh-avatar small">{initialsFromName(userName)}</div>
                                <div>
                                    <div className="kh-profile-name">{userName || "User"}</div>
                                    <div className="kh-profile-email">{userEmail}</div>
                                </div>
                            </div>

                            <ul className="kh-profile-actions">
                                <li>
                                    <button onClick={() => navigate("/profile")}>Profile</button>
                                </li>
                                <li>
                                    <button onClick={() => navigate("/my-uploads")}>My Uploads</button>
                                </li>
                                <li>
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            {/* Drawer overlay */}
            <div
                className={`kh-drawer-overlay ${drawerOpen ? "visible" : ""}`}
                onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer */}
            <aside className={`kh-drawer ${drawerOpen ? "open" : ""}`} ref={drawerRef} aria-hidden={!drawerOpen}>
                <div className="kh-drawer-header">
                    <div>
                        <div className="kh-drawer-title">Menu</div>
                        <div className="kh-drawer-sub">{userEmail}</div>
                    </div>
                    <button className="kh-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                        ✕
                    </button>
                </div>

                <ul className="kh-drawer-list">
                    <li>
                        <button className="kh-drawer-item" onClick={() => { setDrawerOpen(false); navigate("/home"); }}>
                            Home
                        </button>
                    </li>
                    <li>
                        <button className="kh-drawer-item" onClick={() => { setDrawerOpen(false); navigate("/upload"); }}>
                            Upload
                        </button>
                    </li>
                    <li>
                        <button className="kh-drawer-item" onClick={() => { setDrawerOpen(false); navigate("/files"); }}>
                            Files
                        </button>
                    </li>
                </ul>

                <div className="kh-drawer-footer">
                    <div className="kh-avatar small">{initialsFromName(userName)}</div>
                    <div className="kh-drawer-user-name">{userName}</div>
                    <button className="kh-logout" onClick={handleLogout}>
                        Logout
                    </button>
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
