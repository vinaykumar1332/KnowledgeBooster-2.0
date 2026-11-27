import React, { useEffect, useRef, useState } from "react";
import { BookOpenIcon, CalendarIcon, ClockIcon, ExternalLinkIcon } from "lucide-react";

const MAX = 4;
const DEVTO = "https://dev.to/api/articles";

const fmtDate = (iso) => {
    if (!iso) return "";
    try { return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
    catch { return ""; }
};

export default function DevArticles({ query }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);
    const abortRef = useRef(null);

    useEffect(() => {
        const q = (query || "").trim();
        if (!q) { setItems([]); setLoading(false); return; }

        setLoading(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            if (abortRef.current) abortRef.current.abort();
            abortRef.current = new AbortController();

            fetch(`${DEVTO}?q=${encodeURIComponent(q)}&per_page=${MAX}&page=1`, {
                signal: abortRef.current.signal,
            })
                .then((r) => r.json())
                .then((data) => {
                    const rows = (Array.isArray(data) ? data : []).slice(0, MAX).map((a) => ({
                        id: String(a.id),
                        title: a.title || "",
                        description: a.description || "",
                        coverImage: a.cover_image || a.social_image || "",
                        author: a.user?.name || "",
                        authorImage: a.user?.profile_image_90 || "",
                        tags: Array.isArray(a.tag_list) ? a.tag_list.slice(0, 3) : [],
                        readingTime: a.reading_time_minutes || 0,
                        publishedAt: a.published_at || "",
                        url: a.url || "",
                    }));
                    setItems(rows);
                })
                .catch((e) => { if (e?.name !== "AbortError") setItems([]); })
                .finally(() => setLoading(false));
        }, 700);

        return () => {
            clearTimeout(timerRef.current);
            abortRef.current?.abort();
        };
    }, [query]);

    if (!query?.trim()) return null;

    return (
        <section className="mt-8">
            <div className="mb-3 flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-sm bg-violet-600">
                    <BookOpenIcon className="size-3.5 text-white" aria-hidden="true" />
                </span>
                <h2 className="m-0 text-sm font-bold text-foreground">DEV Community Articles</h2>
                <span className="text-xs text-muted-foreground">for "{query}"</span>
            </div>

            {loading && (
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                    {Array.from({ length: MAX }).map((_, i) => (
                        <li key={i} className="flex animate-pulse gap-3 rounded-xl border border-border p-3">
                            <div className="hidden h-16 w-24 shrink-0 rounded-lg bg-muted sm:block" />
                            <div className="flex flex-1 flex-col gap-2">
                                <div className="h-3.5 w-5/6 rounded-md bg-muted" />
                                <div className="h-3 w-full rounded-md bg-muted" />
                                <div className="flex gap-2">
                                    <div className="h-3 w-16 rounded-md bg-muted" />
                                    <div className="h-3 w-20 rounded-md bg-muted" />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {!loading && items.length === 0 && (
                <p className="m-0 text-xs text-muted-foreground">No articles found on DEV Community.</p>
            )}

            {!loading && items.length > 0 && (
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                    {items.map((a) => (
                        <li key={a.id}>
                            <a
                                href={a.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex gap-3 rounded-xl border border-border bg-background p-3 no-underline transition-colors hover:border-foreground/30 hover:bg-muted"
                            >
                                {/* Cover image */}
                                {a.coverImage ? (
                                    <img src={a.coverImage} alt="" loading="lazy"
                                        className="hidden h-16 w-24 shrink-0 rounded-lg object-cover sm:block" />
                                ) : (
                                    <span className="hidden h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-muted sm:flex">
                                        <BookOpenIcon className="size-6 text-muted-foreground/40" />
                                    </span>
                                )}

                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                    <p className="m-0 text-sm font-semibold leading-snug text-foreground line-clamp-2 group-hover:underline">
                                        {a.title}
                                    </p>
                                    {a.description && (
                                        <p className="m-0 mt-0.5 text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                                            {a.description}
                                        </p>
                                    )}

                                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                        {a.author && (
                                            <span className="flex items-center gap-1">
                                                {a.authorImage && <img src={a.authorImage} alt="" className="size-4 rounded-full object-cover" />}
                                                {a.author}
                                            </span>
                                        )}
                                        {a.readingTime > 0 && (
                                            <span className="flex items-center gap-1">
                                                <ClockIcon className="size-3" /> {a.readingTime} min read
                                            </span>
                                        )}
                                        {a.publishedAt && (
                                            <span className="flex items-center gap-1">
                                                <CalendarIcon className="size-3" /> {fmtDate(a.publishedAt)}
                                            </span>
                                        )}
                                    </div>

                                    {a.tags.length > 0 && (
                                        <div className="mt-1.5 flex flex-wrap gap-1">
                                            {a.tags.map((t) => (
                                                <span key={t} className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                                    #{t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <ExternalLinkIcon className="size-3.5 shrink-0 self-start text-muted-foreground/40 group-hover:text-foreground" />
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
