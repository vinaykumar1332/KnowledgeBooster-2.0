// src/pages/Home/home.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFiles } from "../../services/filesService";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./home.css";

function HomePage() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const trackRef = useRef(null);

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function load() {
        setLoading(true);
        try {
            const res = await fetchFiles({ offset: 0, limit: 0 });
            if (res.ok && Array.isArray(res.rows)) {
                const rows = res.rows.slice().reverse();
                const norm = (v) => String(v ?? "").trim().replace(/\s+/g, " ").toLowerCase();
                const seen = new Set();
                const unique = [];
                for (const r of rows) {
                    const sig = JSON.stringify({
                        username: norm(r.username),
                        email: norm(r.email),
                        category: norm(r.category),
                        subcategory: norm(r.subcategory),
                        title: norm(r.title),
                        description: norm(r.description),
                        driveurl: norm(r.driveurl),
                        fileid: norm(r.fileid),
                        thumbnailurl: norm(r.thumbnailurl),
                    });
                    if (!seen.has(sig)) { seen.add(sig); unique.push(r); }
                }
                setFiles(unique);
            }
        } finally {
            setLoading(false);
        }
    }

    // group by title, shuffle, and show up to 10 entries in the carousel
    const byTitle = useMemo(() => {
        const map = new Map();
        for (const f of files) {
            if (!f.title) continue;
            if (!map.has(f.title)) map.set(f.title, f);
        }
        const unique = Array.from(map.values());
        const shuffled = [...unique];
        for (let i = shuffled.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, 10);
    }, [files]);

    const scrollBy = (dir) => {
        const el = trackRef.current;
        if (!el) return;
        const slide = el.querySelector('.home-slide');
        const gapStr = window.getComputedStyle(el).columnGap || window.getComputedStyle(el).gap || '12px';
        const gap = parseInt(gapStr, 10) || 12;
        const width = (slide?.offsetWidth || Math.round(el.clientWidth * 0.8)) + gap;
        const amount = width * (dir === "left" ? -1 : 1);
        el.scrollBy({ left: amount, behavior: "smooth" });
    };

    return (
        <div className="landing-wrapper">
            {/* Hero */}
            <div className="landing-container">
                <h1 className="landing-title">
                    Welcome to <span>KnowledgeHub</span>
                </h1>
                <p className="landing-sub">
                    A friendly place to collect study materials, share notes, and revisit ideas.
                </p>
                <div className="actions-btns">
                    <a href="/upload" className="upload-fab" style={{ position: "static" }}>Upload a PDF</a>
                    <button className="kh-link" onClick={() => navigate("/files")} style={{ border: "1px solid var(--kh-border)", padding: "10px 14px", borderRadius: "var(--kh-radius)", background: "var(--kh-surface)", color: "var(--kh-text)" }}>Browse Files</button>
                </div>
            </div>

            {/* How it works */}
            <section className="home-section">
                <h2 className="home-h2">How KnowledgeHub Works</h2>
                <div className="home-grid">
                    <div className="home-card">
                        <h3>1. Prepare your PDF</h3>
                        <p>Collect study notes, docs, or references and export them as a PDF.</p>
                    </div>
                    <div className="home-card">
                        <h3>2. Upload to Google Drive</h3>
                        <p>
                            Upload the PDF to Google Drive and set sharing to
                            <span className="home-phrase">Anyone with the link</span>.
                        </p>
                    </div>
                    <div className="home-card">
                        <h3>3. Share the link here</h3>
                        <p>Open Upload, paste the share link, add a clear title and category.</p>
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="home-section">
                <h2 className="home-h2">Upload Tips</h2>
                <ul className="home-list">
                    <li>Use short, descriptive titles (e.g., "React Hooks Overview").</li>
                    <li>Pick a category and subcategory so others can find it fast.</li>
                    <li>Verify your Drive link opens for everyone before submitting.</li>
                    <li>Keep PDFs under a reasonable size for smooth preview.</li>
                </ul>
            </section>

            {/* Carousel */}
            <section className="home-section">
                <div className="home-carousel-head">
                    <h2 className="home-h2">Latest Study Materials</h2>
                </div>
                <div className="home-carousel-wrap">
                    <button className="home-nav left" aria-label="Previous" title="Previous" onClick={() => scrollBy("left")}>
                        <FiChevronLeft size={18} />
                    </button>
                    <div className="home-carousel" ref={trackRef}>
                        {loading && <div className="home-skeleton" />}
                        {!loading && byTitle.map((f, i) => (
                            <div
                                key={i}
                                className="home-slide"
                                onClick={() => navigate(`/files?title=${encodeURIComponent(f.title || '')}&fileId=${encodeURIComponent(f.fileid || '')}`)}
                                role="button"
                                tabIndex={0}
                            >
                                <div className="home-thumb" />
                                <div className="home-slide-body">
                                    <div className="home-slide-title">{f.title || "Untitled"}</div>
                                    <div className="home-slide-meta">{f.category} • {f.subcategory}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="home-nav right" aria-label="Next" title="Next" onClick={() => scrollBy("right")}>
                        <FiChevronRight size={18} />
                    </button>
                </div>
            </section>

            {/* Closing */}
            <section className="home-section">
                <h2 className="home-h2">Study better, together</h2>
                <p className="home-p">Upload what you learn, and discover what others share. Your knowledge library, always accessible.</p>
            </section>
        </div>
    );
}

export default HomePage;
