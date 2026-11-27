// src/pages/Home/home.jsx
// Landing page. Renders data from /api/home; no filtering or de-duplication happens here.
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, UploadCloud } from "lucide-react";

import Reveal from "../../components/landing/Reveal";
import StatCounter from "../../components/landing/StatCounter";
import { fetchHome } from "../../services/filesService";
import { UI_CONFIG } from "../../config/ui.config";
import "./home.css";

const L = UI_CONFIG.LANDING;

const STEPS = [
    { n: "01", title: L.STEP_1_TITLE, desc: L.STEP_1_DESC },
    { n: "02", title: L.STEP_2_TITLE, desc: L.STEP_2_DESC },
    { n: "03", title: L.STEP_3_TITLE, desc: L.STEP_3_DESC },
];

/**
 * @param {{ guest?: boolean }} props  guest=true shows Sign up / Log in instead of member actions
 */
export default function HomePage({ guest = false }) {
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading"); // loading | ready | error
    const [featured, setFeatured] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        let cancelled = false;
        fetchHome().then((res) => {
            if (cancelled) return;
            if (res.ok) {
                setFeatured(res.featured || []);
                setStats(res.stats || null);
                setStatus("ready");
            } else {
                setStatus("error");
            }
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const openTitle = (title) => navigate(`/files?title=${encodeURIComponent(title)}`);
    const statValue = (key) => (status === "ready" && stats ? stats[key] : null);

    return (
        <div className="home">
            {/* Hero */}
            <section className="hero">
                <div className="hero-grid" aria-hidden="true" />
                <p className="hero-eyebrow">{L.HERO_EYEBROW}</p>
                <h1 className="hero-title">
                    <span className="hero-line">{L.HERO_TITLE_PREFIX}</span>
                    <span className="hero-line hero-brand">{L.HERO_TITLE_BRAND}</span>
                </h1>
                <p className="hero-sub">{L.HERO_SUBTITLE}</p>
                <div className="hero-actions">
                    {guest ? (
                        <>
                            <Link to="/signup" className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-bold text-background no-underline transition-[transform,opacity] duration-200 ease-out hover:-translate-y-px hover:opacity-90">
                                {L.GUEST_START} <ArrowRight aria-hidden="true" />
                            </Link>
                            <Link to="/login" className="inline-flex h-11 items-center gap-2 rounded-md border border-solid border-border bg-background px-5 text-sm font-bold text-foreground no-underline transition-[transform,border-color] duration-200 ease-out hover:-translate-y-px hover:border-foreground hover:opacity-100">
                                {L.GUEST_LOGIN}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/upload" className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-bold text-background no-underline transition-[transform,opacity] duration-200 ease-out hover:-translate-y-px hover:opacity-90">
                                <UploadCloud aria-hidden="true" /> {L.UPLOAD_BTN}
                            </Link>
                            <Link to="/files" className="inline-flex h-11 items-center gap-2 rounded-md border border-solid border-border bg-background px-5 text-sm font-bold text-foreground no-underline transition-[transform,border-color] duration-200 ease-out hover:-translate-y-px hover:border-foreground hover:opacity-100">
                                <Search aria-hidden="true" /> {L.BROWSE_BTN}
                            </Link>
                        </>
                    )}
                </div>
            </section>

            {/* Stats */}
            <section className="stats-strip" aria-label="Library statistics">
                <StatCounter label={L.STAT_FILES} value={statValue("files")} />
                <StatCounter label={L.STAT_TITLES} value={statValue("titles")} />
                <StatCounter label={L.STAT_CONTRIBUTORS} value={statValue("contributors")} />
            </section>

            {status === "error" && <p className="home-note" role="alert">{L.LOAD_ERROR}</p>}

            {/* How it works */}
            <section className="home-section">
                <Reveal as="h2" className="section-title">{L.STEPS_TITLE}</Reveal>
                <div className="steps-grid">
                    {STEPS.map((s, i) => (
                        <Reveal key={s.n} className="step-card" delay={i * 120}>
                            <span className="step-num">{s.n}</span>
                            <h3 className="step-title">{s.title}</h3>
                            <p className="step-desc">{s.desc}</p>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Featured materials */}
            <section className="home-section">
                <Reveal as="h2" className="section-title">{L.LATEST_MATERIALS}</Reveal>

                {status === "loading" && (
                    <div className="featured-grid" aria-busy="true">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="feature-card skeleton-card" />
                        ))}
                    </div>
                )}

                {status === "ready" && featured.length === 0 && (
                    <p className="home-note">{L.FEATURED_EMPTY}</p>
                )}

                {status === "ready" && featured.length > 0 && (
                    <div className="featured-grid">
                        {featured.map((f, i) => (
                            <Reveal key={f.fileid || `${f.title}-${i}`} delay={(i % 4) * 80}>
                                <button type="button" className="feature-card" onClick={() => openTitle(f.title)}>
                                    <span className="feature-badge">
                                        {f.category} â€¢ {f.subcategory}
                                    </span>
                                    <span className="feature-title">{f.title || "Untitled"}</span>
                                    {f.description && <span className="feature-desc">{f.description}</span>}
                                    <span className="feature-cta">
                                        {L.FEATURED_OPEN} <ArrowRight aria-hidden="true" />
                                    </span>
                                </button>
                            </Reveal>
                        ))}
                    </div>
                )}
            </section>

            {/* Call to action */}
            <section className="cta-band">
                <Reveal>
                    <h2 className="cta-title">{L.CTA_TITLE}</h2>
                    <p className="cta-sub">{L.CTA_SUBTITLE}</p>
                    <Link to={guest ? "/signup" : "/upload"} className="inline-flex h-11 items-center gap-2 rounded-md bg-background px-5 text-sm font-bold text-foreground no-underline transition-transform duration-200 ease-out hover:-translate-y-px hover:opacity-100">
                        {L.CTA_BTN} <ArrowRight aria-hidden="true" />
                    </Link>
                </Reveal>
            </section>

            <footer className="home-footer">
                <span>{L.FOOTER_NOTE}</span>
            </footer>
        </div>
    );
}

