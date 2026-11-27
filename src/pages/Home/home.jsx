// src/pages/Home/home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight, Search, UploadCloud,
    BookOpenIcon, UsersIcon, ZapIcon,
    FileTextIcon, PlayCircleIcon, NewspaperIcon,
    ShieldCheckIcon, GlobeIcon, SparklesIcon,
} from "lucide-react";

import Reveal from "../../components/landing/Reveal";
import StatCounter from "../../components/landing/StatCounter";
import { fetchHome } from "../../services/filesService";
import { UI_CONFIG } from "../../config/ui.config";
import "./home.css";

const L = UI_CONFIG.LANDING;

const STEPS = [
    {
        n: "01",
        icon: UploadCloud,
        title: L.STEP_1_TITLE,
        desc: L.STEP_1_DESC,
    },
    {
        n: "02",
        icon: GlobeIcon,
        title: L.STEP_2_TITLE,
        desc: L.STEP_2_DESC,
    },
    {
        n: "03",
        icon: SparklesIcon,
        title: L.STEP_3_TITLE,
        desc: L.STEP_3_DESC,
    },
];

const FEATURES = [
    {
        icon: FileTextIcon,
        title: "PDFs & Study Notes",
        desc: "Browse hundreds of community-uploaded PDFs across engineering, science, business and more.",
    },
    {
        icon: PlayCircleIcon,
        title: "YouTube Videos",
        desc: "Discover curated educational videos from YouTube — search any topic without leaving KnowledgeHub.",
    },
    {
        icon: NewspaperIcon,
        title: "DEV.to Articles",
        desc: "Get the latest tech articles from the DEV community alongside your PDF search results.",
    },
    {
        icon: UsersIcon,
        title: "Community Driven",
        desc: "Every resource is shared by a real student or professional — no paywalls, no sign-up walls.",
    },
    {
        icon: ZapIcon,
        title: "Instant Search",
        desc: "Full-text search across all uploaded materials. Find what you need in seconds.",
    },
    {
        icon: ShieldCheckIcon,
        title: "Free Forever",
        desc: "No subscription, no ads. KnowledgeHub is built for learners and kept free for everyone.",
    },
];

export default function HomePage({ guest = false }) {
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading");
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
        return () => { cancelled = true; };
    }, []);

    const openTitle = (title) => navigate(`/files?title=${encodeURIComponent(title)}`);
    const statValue = (key) => (status === "ready" && stats ? stats[key] : null);

    return (
        <div className="home">

            {/* ── Hero ──────────────────────────────────────────────────── */}
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
                            <Link to="/signup" className="hero-btn-primary">
                                {L.GUEST_START} <ArrowRight className="hero-btn-icon" aria-hidden="true" />
                            </Link>
                            <Link to="/login" className="hero-btn-secondary">
                                {L.GUEST_LOGIN}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/upload" className="hero-btn-primary">
                                <UploadCloud className="hero-btn-icon" aria-hidden="true" /> {L.UPLOAD_BTN}
                            </Link>
                            <Link to="/files" className="hero-btn-secondary">
                                <Search className="hero-btn-icon" aria-hidden="true" /> {L.BROWSE_BTN}
                            </Link>
                        </>
                    )}
                </div>

                {/* Floating resource-type pills */}
                <div className="hero-pills" aria-hidden="true">
                    <span className="hero-pill"><FileTextIcon size={12} /> PDFs</span>
                    <span className="hero-pill"><PlayCircleIcon size={12} /> Videos</span>
                    <span className="hero-pill"><NewspaperIcon size={12} /> Articles</span>
                    <span className="hero-pill"><BookOpenIcon size={12} /> Notes</span>
                </div>
            </section>

            {/* ── Stats strip ───────────────────────────────────────────── */}
            <section className="stats-strip" aria-label="Library statistics">
                <StatCounter label={L.STAT_FILES} value={statValue("files")} />
                <StatCounter label={L.STAT_TITLES} value={statValue("titles")} />
                <StatCounter label={L.STAT_CONTRIBUTORS} value={statValue("contributors")} />
            </section>

            {status === "error" && <p className="home-note" role="alert">{L.LOAD_ERROR}</p>}

            {/* ── What's inside ─────────────────────────────────────────── */}
            <section className="home-section">
                <Reveal>
                    <div className="section-eyebrow">Everything in one place</div>
                    <h2 className="section-title">Your all-in-one knowledge hub</h2>
                    <p className="section-sub">
                        Search PDFs, watch tutorials and read dev articles — all without switching tabs.
                    </p>
                </Reveal>
                <div className="features-grid">
                    {FEATURES.map((f, i) => (
                        <Reveal key={f.title} delay={i * 70} className="feature-tile">
                            <span className="feature-tile-icon">
                                <f.icon size={20} aria-hidden="true" />
                            </span>
                            <h3 className="feature-tile-title">{f.title}</h3>
                            <p className="feature-tile-desc">{f.desc}</p>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ── How it works ──────────────────────────────────────────── */}
            <section className="home-section">
                <Reveal>
                    <div className="section-eyebrow">Simple process</div>
                    <h2 className="section-title">{L.STEPS_TITLE}</h2>
                </Reveal>
                <div className="steps-grid">
                    {STEPS.map((s, i) => (
                        <Reveal key={s.n} className="step-card" delay={i * 120}>
                            <div className="step-top">
                                <span className="step-num">{s.n}</span>
                                <span className="step-icon-wrap">
                                    <s.icon size={18} aria-hidden="true" />
                                </span>
                            </div>
                            <h3 className="step-title">{s.title}</h3>
                            <p className="step-desc">{s.desc}</p>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ── Featured materials ────────────────────────────────────── */}
            <section className="home-section">
                <Reveal>
                    <div className="section-eyebrow">Community picks</div>
                    <h2 className="section-title">{L.LATEST_MATERIALS}</h2>
                </Reveal>

                {status === "loading" && (
                    <div className="featured-grid" aria-busy="true">
                        {[0, 1, 2, 3].map((i) => (
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
                            <Reveal key={f.fileid || `${f.title}-${i}`} delay={(i % 4) * 70}>
                                <button type="button" className="feature-card" onClick={() => openTitle(f.title)}>
                                    {/* Accent bar */}
                                    <span className="feature-accent-bar" aria-hidden="true" />
                                    <span className="feature-badge">
                                        {f.category}{f.subcategory ? ` · ${f.subcategory}` : ""}
                                    </span>
                                    <span className="feature-title">{f.title || "Untitled"}</span>
                                    {f.description && (
                                        <span className="feature-desc">{f.description}</span>
                                    )}
                                    <span className="feature-meta">
                                        {f.username && <span className="feature-author">by {f.username}</span>}
                                        <span className="feature-pdf-tag">
                                            <FileTextIcon size={11} aria-hidden="true" /> PDF
                                        </span>
                                    </span>
                                    <span className="feature-cta">
                                        {L.FEATURED_OPEN} <ArrowRight size={14} aria-hidden="true" />
                                    </span>
                                </button>
                            </Reveal>
                        ))}
                    </div>
                )}

                {status === "ready" && featured.length > 0 && (
                    <Reveal className="featured-browse-row">
                        <Link to="/files" className="hero-btn-secondary featured-browse-btn">
                            Browse all resources <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                    </Reveal>
                )}
            </section>

            {/* ── CTA band ──────────────────────────────────────────────── */}
            <section className="cta-band">
                <Reveal>
                    <div className="cta-eyebrow">Join the community</div>
                    <h2 className="cta-title">{L.CTA_TITLE}</h2>
                    <p className="cta-sub">{L.CTA_SUBTITLE}</p>
                    <Link to={guest ? "/signup" : "/upload"} className="cta-action-btn">
                        {L.CTA_BTN} <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                </Reveal>
            </section>

            <footer className="home-footer">
                <span>{L.FOOTER_NOTE}</span>
            </footer>
        </div>
    );
}
