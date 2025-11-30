import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./Navigation.css";
import { useNavigate } from "react-router-dom";

export default function Navigation({
    userName = "",
    userEmail = "",
    variant = "light",
}) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const drawerRef = useRef(null);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    // Initials
    function initialsFromName(name) {
        if (!name) return "U";
        const parts = name.trim().split(" ");
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

    // Escape close
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

    // Logout
    function handleLogout() {
        sessionStorage.removeItem("auth");
        navigate("/login");
    }

    return (
        <>
            <header className={`kh-header ${variant === "dark" ? "kh-dark" : ""}`}>
                <div className="kh-header-inner">
                    {/* Left */}
                    <div className="kh-left">
                        <button
                            className={`kh-hamburger ${drawerOpen ? "open" : ""}`}
                            onClick={() => setDrawerOpen(!drawerOpen)}
                        >
                            <span className="kh-ham-line" />
                            <span className="kh-ham-line" />
                            <span className="kh-ham-line" />
                        </button>

                        <div
                            className="kh-logo"
                            onClick={() => navigate("/")}
                        >
                            <div className="kh-logo-mark">
                                <svg width="28" height="28" viewBox="0 0 24 24">
                                    <rect width="100%" height="100%" fill="black" rx="4" />
                                    <text
                                        x="50%"
                                        y="58%"
                                        textAnchor="middle"
                                        fontSize="10"
                                        fill="white"
                                        fontFamily="Science Gothic"
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
                    <nav className="kh-nav">
                        <ul>
                            <li><button className="kh-link" onClick={() => navigate("/")}>Home</button></li>
                            <li><button className="kh-link" onClick={() => navigate("/upload")}>Upload</button></li>
                            <li><button className="kh-link" onClick={() => navigate("/files")}>Files</button></li>
                        </ul>
                    </nav>

                    {/* Profile */}
                    <div className="kh-profile-wrap" ref={profileRef}>
                        <button className="kh-avatar-btn"
                            onClick={() => setProfileOpen(!profileOpen)}>
                            <div className="kh-avatar">{initialsFromName(userName)}</div>
                        </button>

                        {/* Profile menu */}
                        <div className={`kh-profile-menu ${profileOpen ? "open" : ""}`}>
                            <div className="kh-profile-card">
                                <div className="kh-avatar small">{initialsFromName(userName)}</div>
                                <div>
                                    <div className="kh-profile-name">{userName}</div>
                                    <div className="kh-profile-email">{userEmail}</div>
                                </div>
                            </div>

                            <ul className="kh-profile-actions">
                                <li><button onClick={() => navigate("/profile")}>Profile</button></li>
                                <li><button onClick={() => navigate("/my-uploads")}>My Uploads</button></li>
                                <li><button onClick={handleLogout}>Logout</button></li>
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
            <aside className={`kh-drawer ${drawerOpen ? "open" : ""}`} ref={drawerRef}>
                <div className="kh-drawer-header">
                    <div>
                        <div className="kh-drawer-title">Menu</div>
                        <div className="kh-drawer-sub">{userEmail}</div>
                    </div>
                    <button className="kh-drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
                </div>

                <ul className="kh-drawer-list">
                    <li><button className="kh-drawer-item" onClick={() => navigate("/")}>Home</button></li>
                    <li><button className="kh-drawer-item" onClick={() => navigate("/upload")}>Upload</button></li>
                    <li><button className="kh-drawer-item" onClick={() => navigate("/files")}>Files</button></li>
                </ul>

                <div className="kh-drawer-footer">
                    <div className="kh-avatar small">{initialsFromName(userName)}</div>
                    <div className="kh-drawer-user-name">{userName}</div>
                    <button className="kh-logout" onClick={handleLogout}>Logout</button>
                </div>
            </aside>
        </>
    );
}

Navigation.propTypes = {
    userName: PropTypes.string,
    userEmail: PropTypes.string,
};
