// src/pages/files/FilesPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchFiles } from "../../services/filesService";
import FileCard from "../../components/cards/FileCard";
import FilePreviewModal from "../../components/preview/FilePreviewModal";
import ToastNotification from "../../components/toast/ToastNotification";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputText } from "primereact/inputtext";
import { FiSearch, FiFilter, FiInbox } from "react-icons/fi";
import "./FilesPage.css";

export default function FilesPage() {
    const location = useLocation();
    const [files, setFiles] = useState([]); // full dataset
    const [visibleCount, setVisibleCount] = useState(0); // how many rendered
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [query, setQuery] = useState("");
    const [titleFilter, setTitleFilter] = useState("all");
    const [preview, setPreview] = useState(null);
    const [toast, setToast] = useState(null);
    const sentinelRef = useRef(null);

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Initialize filters from URL params (title or fileId)
    const [focusFileId, setFocusFileId] = useState("");
    useEffect(() => {
        const sp = new URLSearchParams(location.search);
        const t = sp.get("title");
        const fid = sp.get("fileId");
        if (t) setTitleFilter(t);
        if (fid) setFocusFileId(fid);
    }, [location.search]);

    useEffect(() => {
        if (focusFileId && query) {
            setFocusFileId("");
        }
    }, [query, focusFileId]);

    function shuffleArray(items) {
        const arr = [...items];
        for (let i = arr.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    async function load() {
        setLoading(true);
        try {
            const res = await fetchFiles({ offset: 0, limit: 0 });
            if (res.ok && Array.isArray(res.rows)) {
                const rows = res.rows.slice().reverse();
                // Deduplicate entries where all fields except timestamp are identical
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
                setFiles(shuffleArray(unique));
                setVisibleCount(Math.min(unique.length, 12));
                setToast({ type: "success", message: "Files loaded successfully. Happy learning 📚" });
            }
        } catch {
            setToast({ type: "error", message: "Failed to load files" });
        } finally {
            setLoading(false);
        }
    }

    const filtered = useMemo(() => {
        if (!query) return files;
        const q = query.toLowerCase();
        return files.filter((f) =>
            [f.title, f.description, f.category, f.subcategory, f.username]
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
    }, [files, query]);

    const focused = useMemo(() => {
        if (!focusFileId) return null;
        return files.filter((f) => String(f.fileid) === String(focusFileId));
    }, [files, focusFileId]);

    const dataset = useMemo(() => {
        if (focused && focused.length) return focused;
        if (titleFilter === "all") return filtered;
        return filtered.filter((f) => f.title === titleFilter);
    }, [focused, filtered, titleFilter]);

    const visibleItems = useMemo(() => {
        return dataset.slice(0, visibleCount);
    }, [dataset, visibleCount]);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting && !loading && !loadingMore) {
                    if (visibleCount < dataset.length) {
                        setLoadingMore(true);
                        setTimeout(() => {
                            setVisibleCount((c) => Math.min(c + 12, dataset.length));
                            setLoadingMore(false);
                        }, 150);
                    }
                }
            });
        }, { rootMargin: "200px" });
        obs.observe(el);
        return () => obs.disconnect();
    }, [dataset.length, loading, loadingMore, visibleCount]);

    // Reset visible chunk when filters or search change
    useEffect(() => {
        setVisibleCount(Math.min(12, dataset.length));
    }, [dataset.length]);

    const titleOptions = useMemo(() => {
        const s = new Set(files.map((f) => f.title).filter(Boolean));
        return ["all", ...Array.from(s)];
    }, [files]);

    return (
        <div className="files-page bw-theme">
            <header className="files-header">
                <h2>Files</h2>

                <div className="search-wrap">
                    <FiSearch className="search-icon" />
                    <InputText
                        id="files-search"
                        name="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search…"
                        className="files-search"
                        aria-label="Search files"
                    />
                </div>

                <div className="filter-wrap">
                    <FiFilter className="filter-icon" />
                    <select
                        id="files-title-filter"
                        name="titleFilter"
                        className="filter-select"
                        value={titleFilter}
                        onChange={(e) => {
                            if (focusFileId) setFocusFileId("");
                            setTitleFilter(e.target.value);
                        }}
                        aria-label="Filter by title"
                    >
                        {titleOptions.map((t) => (
                            <option key={t} value={t}>{t === "all" ? "All titles" : t}</option>
                        ))}
                    </select>
                </div>

                <div className="files-count">
                    Showing {visibleItems.length} results
                </div>
            </header>

            {loading ? (
                <div className="files-loading">
                    <ProgressSpinner className="files-spinner" />
                    <span className="files-loading-text">Please wait…</span>
                </div>
            ) : dataset.length === 0 ? (
                <div className="empty-state">
                    <FiInbox className="empty-icon" />
                    <h3>No files match your search</h3>
                    <p>Try clearing filters or searching a different term.</p>
                </div>
            ) : (
                <div className="files-grid">
                    {visibleItems.map((row, i) => (
                        <FileCard
                            key={i}
                            item={row}
                            onOpen={(fileId, title) => setPreview({ fileId, title })}
                        />
                    ))}
                    {loadingMore && (
                        Array.from({ length: 4 }).map((_, idx) => (
                            <div key={`s-${idx}`} className="file-card skeleton">
                                <div className="thumb skeleton-box" />
                                <div className="meta">
                                    <div className="skeleton-line" />
                                    <div className="skeleton-line short" />
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={sentinelRef} style={{ height: 1 }} />
                </div>
            )}

            <a href="/upload" className="upload-fab">⬆ Upload</a>

            {preview && (
                <FilePreviewModal
                    fileId={preview.fileId}
                    title={preview.title}
                    onClose={() => setPreview(null)}
                />
            )}

            {toast && (
                <ToastNotification
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
