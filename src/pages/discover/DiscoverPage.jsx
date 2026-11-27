import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    BookOpenIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon,
    ClockIcon, ExternalLinkIcon, FileTextIcon, PlayCircleIcon,
    SearchIcon, TagIcon, XIcon,
} from "lucide-react";
import { discoverSearch } from "../../services/discoverService";
import VideoModal from "../../components/youtube/VideoModal";
import FilePreviewModal from "../../components/preview/FilePreviewModal";

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
    if (!iso) return "";
    try { return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
    catch { return ""; }
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
    return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ icon: Icon, iconBg, title, count, status, onPrev, onNext, hasPrev, hasNext, children }) {
    return (
        <section className="mt-8 first:mt-0">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <span className={`grid size-7 shrink-0 place-items-center rounded-lg ${iconBg}`}>
                        <Icon className="size-4 text-white" aria-hidden="true" />
                    </span>
                    <h2 className="m-0 text-base font-bold text-foreground">{title}</h2>
                    {status === "ok" && count > 0 && (
                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">{count.toLocaleString()}</span>
                    )}
                    {status === "unavailable" && (
                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">Not configured</span>
                    )}
                    {status === "error" && (
                        <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs text-destructive">Unavailable</span>
                    )}
                </div>
                {(hasPrev || hasNext) && (
                    <div className="flex gap-1">
                        <button type="button" onClick={onPrev} disabled={!hasPrev}
                            className="grid size-8 place-items-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:pointer-events-none">
                            <ChevronLeftIcon className="size-4" />
                        </button>
                        <button type="button" onClick={onNext} disabled={!hasNext}
                            className="grid size-8 place-items-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:pointer-events-none">
                            <ChevronRightIcon className="size-4" />
                        </button>
                    </div>
                )}
            </div>
            {children}
        </section>
    );
}

// ─── PDF card ─────────────────────────────────────────────────────────────────
function PdfCard({ item, onOpen }) {
    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-md">
            <div className="flex aspect-video items-center justify-center bg-muted">
                {item.thumbnailUrl
                    ? <img src={item.thumbnailUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                    : <FileTextIcon className="size-10 text-muted-foreground/40" aria-hidden="true" />
                }
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-3">
                {item.subcategory && (
                    <span className="w-fit rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{item.subcategory}</span>
                )}
                <p className="m-0 text-sm font-bold leading-snug text-foreground line-clamp-2">{item.title}</p>
                {item.description && (
                    <p className="m-0 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
                )}
                <p className="m-0 mt-auto pt-1 text-xs text-muted-foreground">by {item.uploader}</p>
                <button
                    type="button"
                    onClick={() => onOpen(item.fileId, item.title)}
                    className="mt-1 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-foreground text-xs font-bold text-background transition-opacity hover:opacity-90"
                >
                    <FileTextIcon className="size-3.5" /> Preview
                </button>
            </div>
        </div>
    );
}

// ─── PDF skeletons ────────────────────────────────────────────────────────────
function PdfSkeletons() {
    return (
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex flex-col overflow-hidden rounded-xl border border-border">
                    <Skeleton className="aspect-video rounded-none" />
                    <div className="flex flex-col gap-2 p-3">
                        <Skeleton className="h-3 w-1/3" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="mt-2 h-8 rounded-lg" />
                    </div>
                </li>
            ))}
        </ul>
    );
}

// ─── Video card ───────────────────────────────────────────────────────────────
function VideoCard({ video, onPlay }) {
    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-md">
            <button type="button" onClick={() => onPlay(video)} className="relative block w-full cursor-pointer overflow-hidden p-0">
                <img src={video.thumbnail} alt={video.title} loading="lazy"
                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/30">
                    <span className="grid size-11 place-items-center rounded-full bg-black/60 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                        <PlayCircleIcon className="size-6 text-white" aria-hidden="true" />
                    </span>
                </span>
                {video.duration && (
                    <span className="absolute right-2 bottom-2 rounded-md bg-black/85 px-1.5 py-0.5 text-[11px] font-bold text-white">{video.duration}</span>
                )}
            </button>
            <div className="flex flex-1 flex-col gap-1.5 p-3">
                <button type="button" onClick={() => onPlay(video)}
                    className="m-0 cursor-pointer border-0 bg-transparent p-0 text-left text-sm font-bold leading-snug text-foreground line-clamp-2 hover:opacity-80">
                    {video.title}
                </button>
                <p className="m-0 text-xs text-muted-foreground line-clamp-1">{video.channel}</p>
                {video.description && (
                    <p className="m-0 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{video.description}</p>
                )}
                <div className="mt-auto flex gap-2 pt-1">
                    <button type="button" onClick={() => onPlay(video)}
                        className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-foreground text-xs font-bold text-background transition-opacity hover:opacity-90">
                        <PlayCircleIcon className="size-3.5" /> Watch
                    </button>
                    <a href={video.url} target="_blank" rel="noopener noreferrer"
                        className="grid size-8 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground no-underline transition-colors hover:border-foreground hover:text-foreground"
                        title="Open on YouTube" aria-label="Open on YouTube">
                        <ExternalLinkIcon className="size-3.5" />
                    </a>
                </div>
            </div>
        </div>
    );
}

// ─── Video skeletons ──────────────────────────────────────────────────────────
function VideoSkeletons() {
    return (
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex flex-col overflow-hidden rounded-xl border border-border">
                    <div className="w-full bg-muted" style={{ paddingBottom: "56.25%" }} />
                    <div className="flex flex-col gap-2 p-3">
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-3 w-1/3" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="mt-2 h-8 rounded-lg" />
                    </div>
                </li>
            ))}
        </ul>
    );
}

// ─── Article card ─────────────────────────────────────────────────────────────
function ArticleCard({ article }) {
    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer"
            className="group flex gap-4 rounded-xl border border-border bg-background p-4 no-underline transition-shadow hover:shadow-md">
            {article.coverImage && (
                <img src={article.coverImage} alt="" loading="lazy"
                    className="hidden h-20 w-32 shrink-0 rounded-lg object-cover sm:block" />
            )}
            <div className="min-w-0 flex-1">
                <p className="m-0 text-sm font-bold leading-snug text-foreground line-clamp-2 group-hover:underline">{article.title}</p>
                {article.description && (
                    <p className="m-0 mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{article.description}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {article.author && (
                        <span className="flex items-center gap-1">
                            {article.authorImage && <img src={article.authorImage} alt="" className="size-4 rounded-full object-cover" />}
                            {article.author}
                        </span>
                    )}
                    {article.readingTime > 0 && (
                        <span className="flex items-center gap-1">
                            <ClockIcon className="size-3" aria-hidden="true" />
                            {article.readingTime} min read
                        </span>
                    )}
                    {article.publishedAt && (
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="size-3" aria-hidden="true" />
                            {fmtDate(article.publishedAt)}
                        </span>
                    )}
                </div>
                {article.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {article.tags.map(tag => (
                            <span key={tag} className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">#{tag}</span>
                        ))}
                    </div>
                )}
            </div>
            <ExternalLinkIcon className="size-4 shrink-0 self-start text-muted-foreground/50 group-hover:text-foreground" aria-hidden="true" />
        </a>
    );
}

// ─── Article skeletons ────────────────────────────────────────────────────────
function ArticleSkeletons() {
    return (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex gap-4 rounded-xl border border-border p-4">
                    <Skeleton className="hidden h-20 w-32 shrink-0 rounded-lg sm:block" />
                    <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <div className="flex gap-2 pt-1">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

// ─── Empty / error states ─────────────────────────────────────────────────────
function SectionEmpty({ msg = "No results found." }) {
    return <p className="m-0 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">{msg}</p>;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const IDLE = "idle", LOADING = "loading", READY = "ready";

export default function DiscoverPage() {
    const [input, setInput] = useState("");
    const [q, setQ] = useState("");
    const [pageState, setPageState] = useState(IDLE);
    const [data, setData] = useState(null);

    // Per-section pagination
    const [pdfPage, setPdfPage] = useState(1);
    const [artPage, setArtPage] = useState(1);
    const [ytToken, setYtToken] = useState(null);       // current page token
    const [ytPrevStack, setYtPrevStack] = useState([]); // stack of previous tokens

    // Modals
    const [videoModal, setVideoModal] = useState(null);
    const [pdfPreview, setPdfPreview] = useState(null);

    const abortRef = useRef(null);
    const searchRef = useRef(null);
    const timerRef = useRef(null);

    const runSearch = useCallback((query, pdf, art, yt) => {
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
        setPageState(LOADING);

        discoverSearch(query, { page: pdf, ytToken: yt, signal: abortRef.current.signal })
            .then((res) => {
                if (res.aborted) return;
                setData(res.ok ? res : null);
                setPageState(READY);
            })
            .catch(() => { setPageState(READY); setData(null); });
    }, []);

    // Debounced search on input change
    useEffect(() => {
        const trimmed = input.trim();
        clearTimeout(timerRef.current);
        if (!trimmed) { setQ(""); setData(null); setPageState(IDLE); return; }
        timerRef.current = setTimeout(() => {
            setQ(trimmed);
            setPdfPage(1); setArtPage(1); setYtToken(null); setYtPrevStack([]);
            runSearch(trimmed, 1, 1, null);
        }, 500);
        return () => clearTimeout(timerRef.current);
    }, [input, runSearch]);

    // PDF page change
    const changePdfPage = (next) => {
        setPdfPage(next);
        runSearch(q, next, artPage, ytToken);
    };

    // Article page change
    const changeArtPage = (next) => {
        setArtPage(next);
        runSearch(q, pdfPage, next, ytToken);
    };

    // YouTube pagination
    const ytNext = () => {
        const nextToken = data?.providers?.videos?.nextToken;
        if (!nextToken) return;
        setYtPrevStack(s => [...s, ytToken]);
        setYtToken(nextToken);
        runSearch(q, pdfPage, artPage, nextToken);
    };
    const ytPrev = () => {
        const stack = [...ytPrevStack];
        const prev = stack.length > 0 ? stack[stack.length - 1] : null;
        stack.pop();
        setYtPrevStack(stack);
        setYtToken(prev);
        runSearch(q, pdfPage, artPage, prev);
    };

    // "/" focuses search
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    const pdfs     = data?.providers?.pdfs;
    const videos   = data?.providers?.videos;
    const articles = data?.providers?.articles;

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            {/* Page header */}
            <div className="mb-6">
                <h1 className="m-0 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Discover</h1>
                <p className="m-0 mt-1 text-sm text-muted-foreground">Search PDFs, YouTube videos and articles — all in one place.</p>
            </div>

            {/* Search bar */}
            <div className="relative">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                    ref={searchRef}
                    type="search"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search anything — React, Python, Machine Learning…"
                    aria-label="Discover search"
                    className="h-14 w-full rounded-xl border border-input bg-background pr-28 pl-12 text-base text-foreground shadow-sm transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-muted-foreground focus:border-foreground focus:ring-2 focus:ring-foreground/10 [&::-webkit-search-cancel-button]:appearance-none"
                />
                <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
                    {input && (
                        <button type="button" onClick={() => setInput("")} aria-label="Clear"
                            className="grid size-8 place-items-center rounded-lg p-0 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            <XIcon className="size-4" />
                        </button>
                    )}
                    {!input && (
                        <kbd className="hidden rounded-lg border border-border px-2 py-1 font-sans text-xs text-muted-foreground sm:block">/</kbd>
                    )}
                </div>
            </div>

            {/* Provider badges */}
            <div className="mt-3 flex flex-wrap gap-2">
                {[
                    { label: "Community PDFs", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
                    { label: "YouTube", color: "bg-red-500/10 text-red-700 dark:text-red-400" },
                    { label: "DEV Articles", color: "bg-violet-500/10 text-violet-700 dark:text-violet-400" },
                ].map(p => (
                    <span key={p.label} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${p.color}`}>{p.label}</span>
                ))}
            </div>

            {/* Idle state */}
            {pageState === IDLE && (
                <div className="mt-16 flex flex-col items-center gap-3 text-center">
                    <span className="grid size-16 place-items-center rounded-2xl bg-muted">
                        <SearchIcon className="size-8 text-muted-foreground/50" aria-hidden="true" />
                    </span>
                    <h2 className="m-0 text-lg font-bold text-foreground">What do you want to learn?</h2>
                    <p className="m-0 max-w-sm text-sm text-muted-foreground">Type a topic to search community uploads, YouTube videos and DEV.to articles at once.</p>
                </div>
            )}

            {/* Results */}
            {(pageState === LOADING || pageState === READY) && (
                <div className="mt-8 space-y-10 divide-y divide-border">

                    {/* ── Community PDFs ── */}
                    <Section
                        icon={FileTextIcon} iconBg="bg-blue-500"
                        title="Community PDFs"
                        count={pdfs?.total || 0}
                        status={pageState === LOADING ? "loading" : (pdfs?.status || "ok")}
                        hasPrev={pdfPage > 1}
                        hasNext={pdfs?.hasMore}
                        onPrev={() => changePdfPage(pdfPage - 1)}
                        onNext={() => changePdfPage(pdfPage + 1)}
                    >
                        {pageState === LOADING && <PdfSkeletons />}
                        {pageState === READY && pdfs?.status === "error" && <SectionEmpty msg="Could not load community files right now." />}
                        {pageState === READY && pdfs?.status === "ok" && pdfs.items.length === 0 && <SectionEmpty msg={`No community PDFs match "${q}".`} />}
                        {pageState === READY && pdfs?.items?.length > 0 && (
                            <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
                                {pdfs.items.map(item => (
                                    <li key={item.id}><PdfCard item={item} onOpen={(fid, title) => setPdfPreview({ fileId: fid, title })} /></li>
                                ))}
                            </ul>
                        )}
                    </Section>

                    {/* ── YouTube Videos ── */}
                    <div className="pt-10">
                        <Section
                            icon={PlayCircleIcon} iconBg="bg-[#ff0000]"
                            title="YouTube Videos"
                            count={videos?.total || 0}
                            status={pageState === LOADING ? "loading" : (videos?.status || "ok")}
                            hasPrev={ytPrevStack.length > 0}
                            hasNext={videos?.hasMore}
                            onPrev={ytPrev}
                            onNext={ytNext}
                        >
                            {pageState === LOADING && <VideoSkeletons />}
                            {pageState === READY && videos?.status === "unavailable" && (
                                <SectionEmpty msg="YouTube is not configured on this server." />
                            )}
                            {pageState === READY && videos?.status === "error" && <SectionEmpty msg="Could not reach YouTube right now." />}
                            {pageState === READY && videos?.status === "ok" && videos.items.length === 0 && <SectionEmpty msg={`No YouTube videos found for "${q}".`} />}
                            {pageState === READY && videos?.items?.length > 0 && (
                                <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
                                    {videos.items.map(v => (
                                        <li key={v.id}><VideoCard video={v} onPlay={setVideoModal} /></li>
                                    ))}
                                </ul>
                            )}
                        </Section>
                    </div>

                    {/* ── DEV Articles ── */}
                    <div className="pt-10">
                        <Section
                            icon={BookOpenIcon} iconBg="bg-violet-500"
                            title="DEV Community Articles"
                            count={articles?.total || 0}
                            status={pageState === LOADING ? "loading" : (articles?.status || "ok")}
                            hasPrev={artPage > 1}
                            hasNext={articles?.hasMore}
                            onPrev={() => changeArtPage(artPage - 1)}
                            onNext={() => changeArtPage(artPage + 1)}
                        >
                            {pageState === LOADING && <ArticleSkeletons />}
                            {pageState === READY && articles?.status === "error" && <SectionEmpty msg="Could not reach DEV Community right now." />}
                            {pageState === READY && articles?.status === "ok" && articles.items.length === 0 && <SectionEmpty msg={`No articles found for "${q}" on DEV Community.`} />}
                            {pageState === READY && articles?.items?.length > 0 && (
                                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                                    {articles.items.map(a => <li key={a.id}><ArticleCard article={a} /></li>)}
                                </ul>
                            )}
                        </Section>
                    </div>
                </div>
            )}

            {/* Modals */}
            {videoModal && <VideoModal video={videoModal} onClose={() => setVideoModal(null)} />}
            {pdfPreview && (
                <FilePreviewModal
                    key={pdfPreview.fileId}
                    fileId={pdfPreview.fileId}
                    title={pdfPreview.title}
                    onClose={() => setPdfPreview(null)}
                />
            )}
        </div>
    );
}
