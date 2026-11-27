// src/pages/LandingPage.jsx
// Public page for visitors who are not logged in. Shares the landing content with /home.
import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/theme/ThemeToggle";
import { UI_CONFIG } from "../config/ui.config";
import "./LandingPage.css";

const HomePage = lazy(() => import("./Home/home"));

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
            <Suspense fallback={<div className="page-fallback" role="status">Loading…</div>}>
                <HomePage guest />
            </Suspense>
        </>
    );
}
