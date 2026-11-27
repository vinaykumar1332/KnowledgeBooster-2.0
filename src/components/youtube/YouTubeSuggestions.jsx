import React, { useEffect, useRef, useState } from "react";
import { PlayCircleIcon, ExternalLinkIcon, XIcon, ClockIcon } from "lucide-react";
import { searchYouTube } from "../../services/youtubeService";

const MAX = 5;

export default function YouTubeSuggestions({ query }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(null); // video object
    const timerRef = useRef(null);

    useEffect(() => {
        const q = (query || "").trim();
        if (!q) return;

        setLoading(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            searchYouTube(q, { maxResults: MAX })
                .then((res) => {
                    setItems(res.ok ? (res.items || []).slice(0, MAX) : []);
                })
                .catch(() => setItems([]))
                .finally(() => setLoading(false));
        }, 600);

        return () => clearTimeout(timerRef.current);
    }, [query]);

    if (!query?.trim()) return null;

    return (
        <>
            <section className="mt-8">
                <div className="mb-3 flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-sm" style={{ background: "var(--yt-brand)" }}>
                        <PlayCircleIcon className="size-3.5" style={{ color: "var(--yt-brand-fg)" }} aria-hidden="true" />
                    </span>
                    <h2 className="m-0 text-sm font-bold text-foreground">YouTube suggestions</h2>
                    <span className="text-xs text-muted-foreground">for "{query}"</span>
                </div>

                {loading && (
                    <div className="-mx-4 sm:mx-0">
                        <ul className="m-0 flex list-none gap-3 overflow-x-hidden px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
                            {Array.from({ length: MAX }).map((_, i) => (
                                <li key={i} className="w-[72vw] shrink-0 sm:w-auto">
                                    <div className="flex animate-pulse flex-col overflow-hidden rounded-xl border border-border bg-background">
                                        <div className="w-full bg-muted" style={{ paddingBottom: "56.25%" }} />
                                        <div className="flex flex-col gap-2 p-3">
                                            <div className="h-3.5 w-5/6 rounded-md bg-muted" />
                                            <div className="h-3 w-1/3 rounded-md bg-muted" />
                                            <div className="h-3 w-full rounded-md bg-muted" />
                                            <div className="mt-1 h-8 rounded-lg bg-muted" />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {!loading && items.length === 0 && (
                    <p className="m-0 text-xs text-muted-foreground">No YouTube results found.</p>
                )}

                {!loading && items.length > 0 && (
                    /* Horizontal scroll on mobile, 2–3 col grid on larger screens */
                    <div className="-mx-4 sm:mx-0">
                        <ul className="m-0 flex list-none gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
                            {items.map((video) => (
                                <li key={video.id} className="w-[72vw] shrink-0 sm:w-auto">
                                    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-shadow duration-200 hover:shadow-md">
                                        {/* Thumbnail */}
                                        <button
                                            type="button"
                                            onClick={() => setModal(video)}
                                            className="relative block w-full cursor-pointer overflow-hidden p-0"
                                        >
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                loading="lazy"
                                                className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            {/* Play overlay */}
                                            <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/30">
                                                <span className="grid size-11 place-items-center rounded-full bg-black/60 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                                                    <PlayCircleIcon className="size-6 text-white" aria-hidden="true" />
                                                </span>
                                            </span>
                                            {/* Duration badge */}
                                            {video.duration && (
                                                <span className="absolute right-2 bottom-2 rounded-md px-1.5 py-0.5 text-[11px] font-bold" style={{ background: "var(--video-bg)", color: "var(--yt-brand-fg)" }}>
                                                    {video.duration}
                                                </span>
                                            )}
                                        </button>

                                        {/* Card body */}
                                        <div className="flex flex-1 flex-col gap-2 p-3">
                                            <button
                                                type="button"
                                                onClick={() => setModal(video)}
                                                className="m-0 cursor-pointer border-0 bg-transparent p-0 text-left text-sm font-bold leading-snug text-foreground line-clamp-2 hover:opacity-80"
                                            >
                                                {video.title}
                                            </button>
                                            <p className="m-0 text-xs font-medium text-muted-foreground line-clamp-1">{video.channel}</p>
                                            {video.description && (
                                                <p className="m-0 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{video.description}</p>
                                            )}

                                            {/* Actions */}
                                            <div className="mt-auto flex gap-2 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setModal(video)}
                                                    className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-foreground text-xs font-bold text-background transition-opacity hover:opacity-90"
                                                >
                                                    <PlayCircleIcon className="size-3.5" aria-hidden="true" /> Watch
                                                </button>
                                                <a
                                                    href={video.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="grid size-8 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground no-underline transition-colors hover:border-foreground hover:text-foreground"
                                                    title="Open on YouTube"
                                                    aria-label="Open on YouTube"
                                                >
                                                    <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            {modal && <VideoModal video={modal} onClose={() => setModal(null)} />}
        </>
    );
}

function VideoModal({ video, onClose }) {
    useEffect(() => {
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
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100dvh", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "var(--overlay-bg)", overflowY: "auto" }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div style={{ width: "100%", maxWidth: "56rem", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: "0.5rem", background: "var(--background)", border: "0.0625rem solid var(--border)", boxShadow: "0 1.5rem 3rem var(--overlay-bg)" }}>
                <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
                    <p className="m-0 text-sm font-semibold leading-snug text-foreground line-clamp-2">{video.title}</p>
                    <div className="flex shrink-0 items-center gap-1">
                        <a href={video.url} target="_blank" rel="noopener noreferrer"
                            className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground no-underline transition-colors hover:text-foreground"
                            title="Open on YouTube" aria-label="Open on YouTube">
                            <ExternalLinkIcon className="size-4" />
                        </a>
                        <button type="button" onClick={onClose} aria-label="Close"
                            className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground">
                            <XIcon className="size-4" />
                        </button>
                    </div>
                </div>
                <div style={{ position: "relative", paddingBottom: "56.25%", background: "var(--video-bg)" }}>
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
