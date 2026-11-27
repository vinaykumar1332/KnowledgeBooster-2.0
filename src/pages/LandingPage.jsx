// src/pages/LandingPage.jsx
// Public page for visitors who are not logged in. Shares the landing content with /home.
import React from "react";
import { Link } from "react-router-dom";
import HomePage from "./Home/home";
import ThemeToggle from "../components/theme/ThemeToggle";
import { UI_CONFIG } from "../config/ui.config";
import "./LandingPage.css";

export default function LandingPage() {
    const L = UI_CONFIG.LANDING;
    return (
        <>
            <header className="guest-bar">
                <Link to="/" className="guest-brand">
                    KnowledgeHub
                </Link>
                <div className="guest-actions">
                    <Link to="/login" className="guest-link">
                        {L.GUEST_LOGIN}
                    </Link>
                    <Link to="/signup" className="btn btn-primary guest-signup">
                        {L.GUEST_SIGNUP}
                    </Link>
                    <ThemeToggle />
                </div>
            </header>
            <HomePage guest />
        </>
    );
}
