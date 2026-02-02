// src/pages/files/MyUploadsPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { fetchFiles } from "../../services/filesService";
import FileCard from "../../components/cards/FileCard";
import FilePreviewModal from "../../components/preview/FilePreviewModal";
import ToastNotification from "../../components/toast/ToastNotification";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputText } from "primereact/inputtext";
import { FiSearch, FiFilter, FiInbox } from "react-icons/fi";
import "./FilesPage.css";

export default function MyUploadsPage() {
    const [allFiles, setAllFiles] = useState([]);
    const [files, setFiles] = useState([]);
    const [visibleCount, setVisibleCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [query, setQuery] = useState("");
    const [titleFilter, setTitleFilter] = useState("all");
    const [preview, setPreview] = useState(null);
    const [toast, setToast] = useState(null);
    const sentinelRef = useRef(null);

    const norm = (v) => String(v ?? "").trim().replace(/\s+/g, " ").toLowerCase();

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
                // Deduplicate globally
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
                setAllFiles(unique);

                // Current user
                let current = null;
                try { current = JSON.parse(sessionStorage.getItem("auth") || "null"); } catch (_) { }
                const meName = norm(current?.username || "");
                const meEmail = norm(current?.email || "");

                const mine = unique.filter((r) => norm(r.username) === meName && norm(r.email) === meEmail);
                setFiles(mine);
                setVisibleCount(Math.min(mine.length, 12));
                setToast({ type: "success", message: "Loaded My Uploads" });
            }
        } catch {
            setToast({ type: "error", message: "Failed to load uploads" });
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

    const titled = useMemo(() => {
        if (titleFilter === "all") return filtered;
        return filtered.filter((f) => f.title === titleFilter);
    }, [filtered, titleFilter]);

    const visibleItems = useMemo(() => titled.slice(0, visibleCount), [titled, visibleCount]);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting && !loading && !loadingMore) {
                    if (visibleCount < titled.length) {
                        setLoadingMore(true);
                        setTimeout(() => {
                            setVisibleCount((c) => Math.min(c + 12, titled.length));
                            setLoadingMore(false);
                        }, 150);
                    }
                }
            });
        }, { rootMargin: "200px" });
        obs.observe(el);
        return () => obs.disconnect();
    }, [titled.length, loading, loadingMore, visibleCount]);

    useEffect(() => {
        setVisibleCount(Math.min(12, titled.length));
    }, [titled.length]);

    const titleOptions = useMemo(() => {
        const s = new Set(allFiles.map((f) => f.title).filter(Boolean));
        return ["all", ...Array.from(s)];
    }, [allFiles]);

    return (
        <div className="files-page bw-theme">
            <header className="files-header">
                <h2>My Uploads</h2>
                <div className="search-wrap">
                    <FiSearch className="search-icon" />
                    <InputText
                        id="myuploads-search"
                        name="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search…"
                        className="files-search"
                        aria-label="Search my uploads"
                    />
                </div>
                <div className="filter-wrap">
                    <FiFilter className="filter-icon" />
                    <select
                        id="myuploads-title-filter"
                        name="titleFilter"
                        className="filter-select"
                        value={titleFilter}
                        onChange={(e) => setTitleFilter(e.target.value)}
                        aria-label="Filter by title"
                    >
                        {titleOptions.map((t) => (
                            <option key={t} value={t}>{t === "all" ? "All titles" : t}</option>
                        ))}
                    </select>
                </div>
                <div className="files-count">{titled.length} / {files.length}</div>
            </header>

            {loading ? (
                <div className="files-loading">
                    <ProgressSpinner />
                    <span>Please wait…</span>
                </div>
            ) : titled.length === 0 ? (
                <div className="empty-state">
                    <FiInbox className="empty-icon" />
                    <h3>No uploads found</h3>
                    <p>Try adjusting search or filters.</p>
                </div>
            ) : (
                <div className="files-grid">
                    {visibleItems.map((row, i) => (
                        <FileCard key={i} item={row} onOpen={(fileId, title) => setPreview({ fileId, title })} />
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

            {preview && (
                <FilePreviewModal fileId={preview.fileId} title={preview.title} onClose={() => setPreview(null)} />
            )}

            {toast && (
                <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
}