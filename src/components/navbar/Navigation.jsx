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
                        >
                            <span className="kh-ham-line" />
                            <span className="kh-ham-line" />
                            <span className="kh-ham-line" />
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
                                <li><button type="button" onClick={() => handleNavigate("/profile")}>Profile</button></li>
                                <li><button type="button" onClick={() => handleNavigate("/my-uploads")}>My Uploads</button></li>
                                <li><button type="button" onClick={handleLogout}>Logout</button></li>
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
                    <li><button className="kh-drawer-item" type="button" onClick={() => handleNavigate("/home")}>Home</button></li>
                    <li><button className="kh-drawer-item" type="button" onClick={() => handleNavigate("/upload")}>Upload</button></li>
                    <li><button className="kh-drawer-item" type="button" onClick={() => handleNavigate("/files")}>Files</button></li>
                </ul>

                <div className="kh-drawer-footer">
                    <div className="kh-avatar small">{initialsFromName(userName)}</div>
                    <div className="kh-drawer-user-name">{userName}</div>
                    <button className="kh-logout" onClick={handleLogout} type="button">Logout</button>
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
