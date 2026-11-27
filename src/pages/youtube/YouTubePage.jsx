import React, { useCallback, useEffect, useRef, useState } from "react";
import { PlayCircleIcon, SearchIcon, XIcon, ExternalLinkIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { searchYouTube } from "../../services/youtubeService";
import { useToast } from "../../hooks/useToast";

const MAX_RESULTS = 12;

export default function YouTubePage() {
    const toast = useToast();
    const [query, setQuery] = useState("");
    const [input, setInput] = useState("");
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle"); // idle | loading | ready | error
    const [pageToken, setPageToken] = useState(null);
    const [prevTokenStack, setPrevTokenStack] = useState([]);
    const [preview, setPreview] = useState(null); // { id, title }
    const searchRef = useRef(null);

    const doSearch = useCallback((q, token = null) => {
        if (!q.trim()) return;
        setStatus("loading");
        setItems([]);
        searchYouTube(q.trim(), { maxResults: MAX_RESULTS, ...(token ? { pageToken: token } : {}) })
            .then((res) => {
                if (res.ok) {
                    setItems(res.items || []);
                    setPageToken(res.nextPageToken || null);
                    setStatus("ready");
                } else {
                    setStatus("error");
                    toast.error(res.msg || "Search failed. Please try again.");
                }
            })
            .catch(() => {
                setStatus("error");
                toast.error("Could not reach the server. Please retry.");
            });
    }, [toast]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const q = input.trim();
        if (!q) return;
        setQuery(q);
        setPrevTokenStack([]);
        setPageToken(null);
        doSearch(q);
    };

    const goNext = () => {
        if (!pageToken) return;
        setPrevTokenStack((s) => [...s, pageToken]);
        doSearch(query, pageToken);
    };

    const goPrev = () => {
        const stack = [...prevTokenStack];
        const prevToken = stack.length > 1 ? stack[stack.length - 2] : null;
        stack.pop();
        setPrevTokenStack(stack);
        doSearch(query, prevToken);
    };

    const clearSearch = () => {
        setInput("");
        setQuery("");
        setItems([]);
        setStatus("idle");
        setPrevTokenStack([]);
        setPageToken(null);
        searchRef.current?.focus();
    };

    // "/" focuses search
    useEffect(() => {
        const onKey = (e) => {
            const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
            if (e.key === "/" && !typing) { e.preventDefault(); searchRef.current?.focus(); }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    const hasPrev = prevTokenStack.length > 0;

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            {/* Heading */}
            <div className="mb-6">
                <h1 className="m-0 flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    <span className="grid size-9 place-items-center rounded-md bg-[#ff0000] text-white">
                        <PlayCircleIcon className="size-5" aria-hidden="true" />
                    </span>
                    YouTube Videos
                </h1>
                <p className="m-0 mt-1 text-sm text-muted-foreground">
                    Search educational videos from YouTube directly inside KnowledgeHub.
                </p>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSubmit} className="relative">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                    ref={searchRef}
                    type="search"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search YouTube videos…"
                    aria-label="Search YouTube videos"
                    className="h-12 w-full rounded-md border border-input bg-background pr-28 pl-11 text-[15px] text-foreground transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground/20 [&::-webkit-search-cancel-button]:appearance-none"
                />
                <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
                    {input && (
                        <button type="button" onClick={clearSearch} aria-label="Clear search"
                            className="grid size-8 min-h-0 place-items-center rounded-md p-0 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            <XIcon className="size-4" aria-hidden="true" />
                        </button>
                    )}
                    <button type="submit"
                        className="h-8 rounded-md bg-foreground px-3 text-xs font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
                        disabled={!input.trim() || status === "loading"}>
                        Search
                    </button>
                </div>
            </form>

            {/* States */}
            <div className="mt-6">
                {status === "idle" && (
                    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border px-6 py-20 text-center">
                        <span className="grid size-14 place-items-center rounded-md bg-muted">
                            <PlayCircleIcon className="size-7 text-muted-foreground" aria-hidden="true" />
                        </span>
                        <p className="m-0 text-sm text-muted-foreground">Type a topic above and press Search to find educational videos.</p>
                    </div>
                )}

                {status === "loading" && (
                    <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: MAX_RESULTS }).map((_, i) => (
                            <li key={i} className="flex animate-pulse flex-col gap-3 rounded-md border border-border p-3">
                                <div className="w-full rounded-md bg-muted" style={{ paddingBottom: "56.25%" }} />
                                <div className="h-4 w-5/6 rounded-md bg-muted" />
                                <div className="h-3 w-1/3 rounded-md bg-muted" />
                            </li>
                        ))}
                    </ul>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-border px-6 py-16 text-center">
                        <p className="m-0 text-sm text-muted-foreground">Search failed. Check your connection and try again.</p>
                        <button type="button" onClick={() => doSearch(query)}
                            className="h-9 rounded-md border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                            Retry
                        </button>
                    </div>
                )}

                {status === "ready" && items.length === 0 && (
                    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border px-6 py-16 text-center">
                        <p className="m-0 text-sm font-semibold text-foreground">No results for "{query}"</p>
                        <p className="m-0 text-sm text-muted-foreground">Try a different search term.</p>
                    </div>
                )}

                {status === "ready" && items.length > 0 && (
                    <>
                        <p className="m-0 mb-4 text-sm text-muted-foreground">
                            Results for <span className="font-semibold text-foreground">"{query}"</span>
                        </p>
                        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((video) => (
                                <VideoCard key={video.id} video={video} onPreview={() => setPreview(video)} />
                            ))}
                        </ul>

                        {/* Pagination */}
                        {(hasPrev || pageToken) && (
                            <div className="mt-6 flex justify-center gap-3">
                                <button type="button" onClick={goPrev} disabled={!hasPrev}
                                    className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40">
                                    <ChevronLeftIcon className="size-4" /> Previous
                                </button>
                                <button type="button" onClick={goNext} disabled={!pageToken}
                                    className="flex h-9 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40">
                                    Next <ChevronRightIcon className="size-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Inline embed modal */}
            {preview && (
                <EmbedModal video={preview} onClose={() => setPreview(null)} />
            )}
        </div>
    );
}

function VideoCard({ video, onPreview }) {
    return (
        <li className="group flex flex-col overflow-hidden rounded-md border border-border bg-background transition-shadow duration-200 hover:shadow-md">
            <button type="button" onClick={onPreview} className="relative block w-full cursor-pointer overflow-hidden p-0 text-left">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {video.duration && (
                    <span className="absolute right-2 bottom-2 flex items-center gap-1 rounded-sm bg-black/80 px-1.5 py-0.5 text-xs font-bold text-white">
                        <ClockIcon className="size-3" aria-hidden="true" />
                        {video.duration}
                    </span>
                )}
                <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="grid size-12 place-items-center rounded-full bg-black/60">
                        <PlayCircleIcon className="size-7 text-white" aria-hidden="true" />
                    </span>
                </span>
            </button>

            <div className="flex flex-1 flex-col gap-1 p-3">
                <button type="button" onClick={onPreview}
                    className="m-0 cursor-pointer border-0 bg-transparent p-0 text-left text-sm font-semibold leading-snug text-foreground hover:text-foreground/80 line-clamp-2">
                    {video.title}
                </button>
                <p className="m-0 text-xs text-muted-foreground line-clamp-1">{video.channel}</p>
                <div className="mt-auto flex gap-2 pt-2">
                    <button type="button" onClick={onPreview}
                        className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-foreground text-xs font-bold text-background transition-opacity hover:opacity-90">
                        <PlayCircleIcon className="size-3.5" /> Watch
                    </button>
                    <a href={video.url} target="_blank" rel="noopener noreferrer"
                        className="grid size-8 place-items-center rounded-md border border-border bg-background text-muted-foreground no-underline transition-colors hover:border-foreground hover:text-foreground"
                        title="Open on YouTube" aria-label="Open on YouTube">
                        <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
                    </a>
                </div>
            </div>
        </li>
    );
}

function EmbedModal({ video, onClose }) {
    useEffect(() => {
        // Lock body scroll so the page doesn't scroll behind the modal
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={video.title}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100dvh", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "rgba(0,0,0,0.80)", overflowY: "auto" }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div style={{ width: "100%", maxWidth: "56rem", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: "0.5rem", background: "var(--background)", border: "1px solid var(--border)", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
                <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
                    <h2 className="m-0 text-sm font-semibold text-foreground leading-snug line-clamp-2">{video.title}</h2>
                    <div className="flex shrink-0 items-center gap-1">
                        <a href={video.url} target="_blank" rel="noopener noreferrer"
                            className="grid size-8 place-items-center rounded-md border border-border bg-background text-muted-foreground no-underline transition-colors hover:text-foreground"
                            title="Open on YouTube" aria-label="Open on YouTube">
                            <ExternalLinkIcon className="size-4" />
                        </a>
                        <button type="button" onClick={onClose} aria-label="Close"
                            className="grid size-8 place-items-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground">
                            <XIcon className="size-4" />
                        </button>
                    </div>
                </div>
                <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
                    <iframe
                        src={`${video.embedUrl}?autoplay=1&rel=0`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                    />
                </div>
                <div className="px-4 py-2.5">
                    <p className="m-0 text-xs text-muted-foreground">
                        {video.channel}
                        {video.duration && <span className="ml-2 font-semibold">{video.duration}</span>}
                    </p>
                </div>
            </div>
        </div>
    );
}
