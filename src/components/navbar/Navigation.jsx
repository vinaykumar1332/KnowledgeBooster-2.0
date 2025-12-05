import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";

/**
 * Navigation
 * - Responsive header + mobile drawer
 * - Props: userName, userEmail, variant
 */
export default function Navigation({
    userName: initialUserName = "",
    userEmail: initialUserEmail = "",
    variant = "light",
}) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [userName, setUserName] = useState(initialUserName);
    const [userEmail, setUserEmail] = useState(initialUserEmail);

    const drawerRef = useRef(null);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    // load from sessionStorage if props not provided
    useEffect(() => {
        if (!initialUserName && !initialUserEmail) {
            try {
                const stored = JSON.parse(sessionStorage.getItem("auth") || "null");
                if (stored) {
                    if (stored.username) setUserName((s) => s || stored.username);
                    if (stored.email) setUserEmail((e) => e || stored.email);
                }
            } catch (e) {
                // ignore
            }
        } else {
            setUserName(initialUserName);
            setUserEmail(initialUserEmail);
        }
    }, [initialUserName, initialUserEmail]);

    // Prevent body scroll when drawer or profile sheet open
    useEffect(() => {
        const active = drawerOpen || profileOpen;
        if (active) {
            document.body.classList.add("kh-no-scroll");
        } else {
            document.body.classList.remove("kh-no-scroll");
        }
        return () => document.body.classList.remove("kh-no-scroll");
    }, [drawerOpen, profileOpen]);

    // click outside to close drawer/profile
    useEffect(() => {
        function onDocClick(e) {
            if (drawerOpen && drawerRef.current && !drawerRef.current.contains(e.target) && !e.target.closest(".kh-hamburger")) {
                setDrawerOpen(false);
            }
            if (profileOpen && profileRef.current && !profileRef.current.contains(e.target) && !e.target.closest(".kh-avatar-btn")) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [drawerOpen, profileOpen]);

    // escape key closes overlays
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") {
                setDrawerOpen(false);
                setProfileOpen(false);
            }
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    function initialsFromName(name) {
        if (!name) return "U";
        const parts = name.trim().split(" ").filter(Boolean);
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    function handleNavigate(path) {
        setDrawerOpen(false);
        setProfileOpen(false);
        navigate(path);
    }

    function handleLogout() {
        try { sessionStorage.removeItem("auth"); } catch (e) { }
        window.dispatchEvent(new Event("authChange"));
        setProfileOpen(false);
        setDrawerOpen(false);
        navigate("/login", { replace: true });
    }

    return (
        <>
            <header className={`kh-header ${variant === "dark" ? "kh-dark" : ""}`} role="banner">
                <div className="kh-header-inner">
                    <div className="kh-left">
                        <button
                            className={`kh-hamburger ${drawerOpen ? "open" : ""}`}
                            aria-label={drawerOpen ? "Close menu" : "Open menu"}
                            aria-expanded={drawerOpen}
                            onClick={() => setDrawerOpen((s) => !s)}
                        >
                            <span className="kh-ham-line" />
                            <span className="kh-ham-line" />
                            <span className="kh-ham-line" />
                        </button>

                        <div className="kh-logo" role="button" tabIndex={0} onClick={() => handleNavigate("/home")}>
                            <div className="kh-logo-mark" aria-hidden="true">
                                <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="100%" height="100%" fill="black" rx="4" />
                                    <text x="50%" y="58%" textAnchor="middle" fontSize="10" fill="white" fontFamily="sans-serif">KH</text>
                                </svg>
                            </div>
                            <div className="kh-title">
                                <div className="kh-title-main">Knowledge Hut 2.0</div>
                                <div className="kh-title-sub">{userEmail}</div>
                            </div>
                        </div>
                    </div>

                    <nav className="kh-nav" aria-label="Main navigation">
                        <ul>
                            <li><button className="kh-link" onClick={() => handleNavigate("/home")}>Home</button></li>
                            <li><button className="kh-link" onClick={() => handleNavigate("/upload")}>Upload</button></li>
                            <li><button className="kh-link" onClick={() => handleNavigate("/files")}>Files</button></li>
                        </ul>
                    </nav>

                    <div className="kh-actions">
                        <div className="kh-profile-wrap" ref={profileRef}>
                            <button
                                className="kh-avatar-btn"
                                aria-haspopup="true"
                                aria-expanded={profileOpen}
                                onClick={() => setProfileOpen((s) => !s)}
                            >
                                <div className="kh-avatar" title={userName || userEmail}>{initialsFromName(userName)}</div>
                            </button>

                            {/* Profile menu - desktop dropdown, mobile sheet */}
                            <div className={`kh-profile-menu ${profileOpen ? "open" : ""}`} role="menu">
                                <div className="kh-profile-card">
                                    <div className="kh-avatar small">{initialsFromName(userName)}</div>
                                    <div>
                                        <div className="kh-profile-name">{userName || "User"}</div>
                                        <div className="kh-profile-email">{userEmail}</div>
                                    </div>
                                </div>

                                <ul className="kh-profile-actions">
                                    <li><button onClick={() => handleNavigate("/profile")}>Profile</button></li>
                                    <li><button onClick={() => handleNavigate("/my-uploads")}>My Uploads</button></li>
                                    <li><button onClick={handleLogout}>Logout</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* overlay */}
            <div className={`kh-drawer-overlay ${drawerOpen ? "visible" : ""}`} onClick={() => setDrawerOpen(false)} aria-hidden={!drawerOpen} />

            {/* Drawer */}
            <aside className={`kh-drawer ${drawerOpen ? "open" : ""}`} ref={drawerRef} aria-hidden={!drawerOpen}>
                <div className="kh-drawer-header">
                    <div className="kh-drawer-left">
                        <div className="kh-drawer-title">Menu</div>
                        <div className="kh-drawer-sub">{userEmail}</div>
                    </div>
                    <button className="kh-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">✕</button>
                </div>

                <ul className="kh-drawer-list">
                    <li><button className="kh-drawer-item" onClick={() => handleNavigate("/home")}>Home</button></li>
                    <li><button className="kh-drawer-item" onClick={() => handleNavigate("/upload")}>Upload</button></li>
                    <li><button className="kh-drawer-item" onClick={() => handleNavigate("/files")}>Files</button></li>
                </ul>

                <div className="kh-drawer-footer">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="kh-avatar small">{initialsFromName(userName)}</div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div className="kh-drawer-user-name">{userName}</div>
                            <div style={{ fontSize: 12, color: "#666" }}>{userEmail}</div>
                        </div>
                    </div>
                    <div>
                        <button className="kh-logout" onClick={handleLogout}>Logout</button>
                    </div>
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
