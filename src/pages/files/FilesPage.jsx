// src/pages/files/FilesPage.jsx
// Also used by My Uploads with mine={true}: same layout, server-filtered to the signed-in user.
// The server returns de-duplicated rows, newest first. This page only searches,
// filters and renders them.
import React, { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { InboxIcon, RotateCwIcon, SearchIcon, UploadIcon, XIcon } from "lucide-react";
import { fetchFiles } from "../../services/filesService";
import FileCard from "../../components/cards/FileCard";
import FilePreviewModal from "../../components/preview/FilePreviewModal";
import Button from "../../components/Button/Button";
import { useToast } from "../../hooks/useToast";
import { UI_CONFIG, interpolate } from "../../config/ui.config";
import { cn } from "@/lib/utils";

const F = UI_CONFIG.FILES;
const PAGE_SIZE = 12;

const capitalize = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

/** Email of the signed-in user, used to ask the server for only their files. */
function currentEmail() {
    try {
        return JSON.parse(sessionStorage.getItem("auth") || "null")?.email || "";
    } catch {
        return "";
    }
}

export default function FilesPage({ mine = false }) {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();

    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | ready | error
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [preview, setPreview] = useState(null);
    const deferredQuery = useDeferredValue(query);

    const searchRef = useRef(null);
    const sentinelRef = useRef(null);

    // Links from the landing page can narrow the list: /files?title=… or ?fileId=…
    const params = new URLSearchParams(location.search);
    const titleFilter = params.get("title") || "";
    const fileIdFilter = params.get("fileId") || "";

    const fetchAll = useCallback(() => {
        return fetchFiles({ offset: 0, limit: 0, email: mine ? currentEmail() : undefined }).then((res) => {
            if (res.ok && Array.isArray(res.rows)) {
                setFiles(res.rows);
                setStatus("ready");
            } else {
                setStatus("error");
                toast.error(F.ERROR_LOAD_FAILED);
            }
        });
    }, [toast, mine]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const retry = () => {
        setStatus("loading");
        fetchAll();
    };

    // "/" focuses search (unless the user is already typing somewhere)
    useEffect(() => {
        const onKey = (e) => {
            const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
            if (e.key === "/" && !typing) {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    const categories = useMemo(() => {
        const counts = new Map();
        for (const f of files) {
            const c = (f.category || "").toLowerCase();
            if (c) counts.set(c, (counts.get(c) || 0) + 1);
        }
        return [["all", files.length], ...counts.entries()];
    }, [files]);

    const results = useMemo(() => {
        const q = deferredQuery.trim().toLowerCase();
        return files.filter((f) => {
            if (fileIdFilter && String(f.fileid) !== fileIdFilter) return false;
            if (titleFilter && f.title !== titleFilter) return false;
            if (category !== "all" && (f.category || "").toLowerCase() !== category) return false;
            if (!q) return true;
            return [f.title, f.description, f.category, f.subcategory, f.username]
                .join(" ")
                .toLowerCase()
                .includes(q);
        });
    }, [files, deferredQuery, category, titleFilter, fileIdFilter]);

    // Paging resets whenever the filters change (keyed state, no effect needed)
    const filterKey = `${deferredQuery}|${category}|${titleFilter}|${fileIdFilter}`;
    const [paging, setPaging] = useState({ key: filterKey, count: PAGE_SIZE });
    const visibleCount = paging.key === filterKey ? paging.count : PAGE_SIZE;
    const visible = results.slice(0, visibleCount);
    const hasMore = visibleCount < results.length;

    // Infinite scroll: show the next batch when the sentinel nears the viewport
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el || !hasMore) return undefined;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setPaging({ key: filterKey, count: visibleCount + PAGE_SIZE });
            },
            { rootMargin: "400px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, filterKey, visibleCount]);

    const hasFilters = !!(query || category !== "all" || titleFilter || fileIdFilter);
    const noUploadsYet = mine && files.length === 0;
    const clearFilters = () => {
        setQuery("");
        setCategory("all");
        if (titleFilter || fileIdFilter) navigate(location.pathname, { replace: true });
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            {/* Heading */}
            <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                    <h1 className="m-0 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{mine ? F.MINE_TITLE : F.TITLE}</h1>
                    <p className="m-0 mt-1 text-sm text-muted-foreground">{mine ? F.MINE_SUBTITLE : F.SUBTITLE}</p>
                </div>
                {status === "ready" && (
                    <p className="m-0 text-sm font-semibold text-muted-foreground" aria-live="polite">
                        {interpolate(F.COUNT, { shown: results.length, total: files.length })}
                    </p>
                )}
            </div>

            {/* Search */}
            <div className="relative mt-6">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={F.SEARCH_PLACEHOLDER}
                    aria-label={F.SEARCH_PLACEHOLDER}
                    className="h-12 w-full rounded-md border border-input bg-background pr-24 pl-11 text-[15px] text-foreground transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground/20 [&::-webkit-search-cancel-button]:appearance-none"
                />
                {query ? (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery("");
                            searchRef.current?.focus();
                        }}
                        aria-label={F.CLEAR_SEARCH}
                        className="absolute top-1/2 right-2 grid size-8 min-h-0 -translate-y-1/2 place-items-center rounded-md p-0 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <XIcon className="size-4" aria-hidden="true" />
                    </button>
                ) : (
                    <kbd
                        title={F.SEARCH_SHORTCUT}
                        className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-border px-2 py-0.5 font-sans text-xs text-muted-foreground sm:block"
                    >
                        /
                    </kbd>
                )}
            </div>

            {/* Filter chips */}
            <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
                {categories.map(([value, count]) => {
                    const active = category === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setCategory(value)}
                            aria-pressed={active}
                            className={cn(
                                "flex h-9 min-h-0 shrink-0 items-center gap-2 rounded-md border px-3 py-0 text-sm font-semibold transition-colors duration-200",
                                active
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                            )}
                        >
                            {value === "all" ? F.ALL_CATEGORIES : capitalize(value)}
                            <span className={cn("text-xs", active ? "opacity-70" : "opacity-60")}>{count}</span>
                        </button>
                    );
                })}

                {(titleFilter || fileIdFilter) && (
                    <button
                        type="button"
                        onClick={() => navigate(location.pathname, { replace: true })}
                        className="flex h-9 min-h-0 shrink-0 items-center gap-2 rounded-md border border-dashed border-foreground/50 bg-background px-3 py-0 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                        {F.TITLE_FILTER}: <span className="max-w-[12rem] truncate">{titleFilter || fileIdFilter}</span>
                        <XIcon className="size-3.5" aria-hidden="true" />
                    </button>
                )}
            </div>

            {/* Results */}
            <div className="mt-6">
                {status === "loading" && (
                    <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <li key={i} className="flex animate-pulse flex-col gap-3 rounded-md border border-border p-3">
                                <div className="h-36 rounded-md bg-muted" />
                                <div className="h-4 w-3/4 rounded-md bg-muted" />
                                <div className="h-3 w-1/2 rounded-md bg-muted" />
                                <div className="mt-2 h-6 rounded-md bg-muted" />
                            </li>
                        ))}
                    </ul>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-border px-6 py-16 text-center">
                        <p className="m-0 text-sm text-muted-foreground">{F.ERROR_LOAD_FAILED}</p>
                        <Button variant="secondary" icon={RotateCwIcon} onClick={retry}>
                            {F.RETRY_BTN}
                        </Button>
                    </div>
                )}

                {status === "ready" && results.length === 0 && (
                    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border px-6 py-16 text-center animate-in fade-in-0">
                        <span className="grid size-12 place-items-center rounded-md bg-muted">
                            <InboxIcon className="size-6 text-muted-foreground" aria-hidden="true" />
                        </span>
                        <h2 className="m-0 text-lg font-bold text-foreground">{noUploadsYet ? F.MINE_EMPTY_TITLE : F.NO_RESULTS_TITLE}</h2>
                        <p className="m-0 max-w-sm text-sm text-muted-foreground">{noUploadsYet ? F.MINE_EMPTY_TEXT : F.NO_RESULTS_SUBTITLE}</p>
                        {noUploadsYet && (
                            <Link
                                to="/upload"
                                className="mt-1 inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-bold text-background no-underline transition-[transform,opacity] duration-200 hover:-translate-y-px hover:opacity-90"
                            >
                                <UploadIcon className="size-4" aria-hidden="true" />
                                {F.UPLOAD_CTA}
                            </Link>
                        )}
                        {hasFilters && (
                            <Button variant="secondary" size="sm" onClick={clearFilters}>
                                {F.CLEAR_FILTERS}
                            </Button>
                        )}
                    </div>
                )}

                {status === "ready" && results.length > 0 && (
                    <>
                        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {visible.map((row, i) => (
                                <li key={`${row.fileid || row.title}-${i}`}>
                                    <FileCard item={row} index={i} onOpen={(fileId, title) => setPreview({ fileId, title })} />
                                </li>
                            ))}
                        </ul>
                        {hasMore && <div ref={sentinelRef} className="h-px" aria-hidden="true" />}
                    </>
                )}
            </div>

            {preview && (
                <FilePreviewModal
                    key={preview.fileId}
                    fileId={preview.fileId}
                    title={preview.title}
                    onClose={() => setPreview(null)}
                />
            )}
        </div>
    );
}
