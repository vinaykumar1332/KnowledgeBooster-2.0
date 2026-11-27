import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    FileTextIcon, FolderIcon, LayersIcon, LogOutIcon,
    PaletteIcon, UploadIcon, ChevronLeftIcon, ChevronRightIcon,
} from "lucide-react";
import FileCard from "../../components/cards/FileCard";
import FilePreviewModal from "../../components/preview/FilePreviewModal";
import ThemeToggle from "../../components/theme/ThemeToggle";
import Button from "../../components/Button/Button";
import { fetchFiles } from "../../services/filesService";
import { useSignOut } from "../../hooks/useSignOut";
import { UI_CONFIG } from "../../config/ui.config";

const P = UI_CONFIG.PROFILE;
const PAGE_SIZE = 6;

function readStoredAuth() {
    try {
        const stored = JSON.parse(sessionStorage.getItem("auth") || "null");
        return stored?.ok ? stored : null;
    } catch { return null; }
}

function initials(name = "") {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "U";
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

const capitalize = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

export default function Profile() {
    const signOut = useSignOut();
    const user = readStoredAuth() || {};
    const email = user.email || "";

    const [uploads, setUploads] = useState([]);
    const [status, setStatus] = useState(email ? "loading" : "ready");
    const [preview, setPreview] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!email) return;
        let cancelled = false;
        fetchFiles({ offset: 0, limit: 0, email }).then((res) => {
            if (cancelled) return;
            setUploads(res.ok && Array.isArray(res.rows) ? res.rows : []);
            setStatus(res.ok ? "ready" : "error");
        });
        return () => { cancelled = true; };
    }, [email]);

    const stats = useMemo(() => {
        const unique = (key) => new Set(uploads.map((f) => String(f[key] || "").trim().toLowerCase()).filter(Boolean)).size;
        return [
            { label: "Uploads",    value: uploads.length,      icon: FileTextIcon, color: "text-blue-500" },
            { label: "Categories", value: unique("category"),  icon: FolderIcon,   color: "text-violet-500" },
            { label: "Topics",     value: unique("title"),     icon: LayersIcon,   color: "text-emerald-500" },
        ];
    }, [uploads]);

    const totalPages = Math.max(1, Math.ceil(uploads.length / PAGE_SIZE));
    const pageUploads = uploads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

            {/* ── Hero card ─────────────────────────────────────────────── */}
            <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
                {/* Banner */}
                <div className="relative h-28 sm:h-36" style={{
                    background: "linear-gradient(135deg, hsl(var(--foreground)/0.9) 0%, hsl(var(--foreground)/0.6) 100%)",
                }}>
                    {/* Subtle dot grid */}
                    <svg className="absolute inset-0 h-full w-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1.5" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dots)" />
                    </svg>
                </div>

                {/* Identity row */}
                <div className="px-5 pb-6 sm:px-7 sm:pb-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        {/* Avatar + name */}
                        <div className="flex items-end gap-4">
                            <span className="-mt-10 grid size-20 shrink-0 place-items-center rounded-2xl border-4 border-background bg-foreground font-display text-2xl font-extrabold text-background shadow-lg ring-1 ring-border sm:-mt-12 sm:size-24 sm:text-3xl">
                                {initials(user.username)}
                            </span>
                            <div className="mb-1 min-w-0">
                                <h1 className="m-0 truncate font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                                    {user.username || "User"}
                                </h1>
                                <p className="m-0 truncate text-sm text-muted-foreground">{email}</p>
                                {user.userType && (
                                    <span className="mt-1.5 inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-foreground">
                                        {capitalize(user.userType)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Link to="/upload"
                                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-bold text-background no-underline transition-opacity hover:opacity-85 sm:flex-none">
                                <UploadIcon className="size-4" /> {P.UPLOAD_CTA}
                            </Link>
                            <button type="button" onClick={signOut}
                                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                                <LogOutIcon className="size-4" /> {P.LOGOUT_BTN}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats ─────────────────────────────────────────────────── */}
            <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
                {stats.map((s) => (
                    <div key={s.label} className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:p-5">
                        <span className={`grid size-10 shrink-0 place-items-center rounded-xl bg-muted ${s.color}`}>
                            <s.icon className="size-5" aria-hidden="true" />
                        </span>
                        <span>
                            <span className="block font-display text-2xl font-extrabold tabular-nums text-foreground sm:text-3xl">
                                {status === "loading" ? <span className="inline-block h-7 w-10 animate-pulse rounded-md bg-muted" /> : s.value}
                            </span>
                            <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">{s.label}</span>
                        </span>
                    </div>
                ))}
            </div>

            {/* ── My Uploads ────────────────────────────────────────────── */}
            <section className="mt-8">
                {/* Section header */}
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="m-0 font-display text-lg font-extrabold tracking-tight text-foreground sm:text-xl">My Uploads</h2>
                        {status === "ready" && uploads.length > 0 && (
                            <p className="m-0 mt-0.5 text-sm text-muted-foreground">
                                {uploads.length} file{uploads.length !== 1 ? "s" : ""} · page {page} of {totalPages}
                            </p>
                        )}
                    </div>
                    <Link to="/upload"
                        className="inline-flex h-9 items-center gap-2 rounded-xl bg-foreground px-4 text-sm font-bold text-background no-underline transition-opacity hover:opacity-85">
                        <UploadIcon className="size-4" /> Upload
                    </Link>
                </div>

                {/* Loading skeletons */}
                {status === "loading" && (
                    <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                            <li key={i} className="flex animate-pulse flex-col gap-3 overflow-hidden rounded-xl border border-border p-3">
                                <div className="h-36 rounded-lg bg-muted" />
                                <div className="h-3 w-1/4 rounded-md bg-muted" />
                                <div className="h-4 w-3/4 rounded-md bg-muted" />
                                <div className="h-3 w-1/2 rounded-md bg-muted" />
                                <div className="mt-1 h-8 rounded-lg bg-muted" />
                            </li>
                        ))}
                    </ul>
                )}

                {/* Error */}
                {status === "error" && (
                    <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
                        <p className="m-0 text-sm text-muted-foreground">{P.LOAD_ERROR}</p>
                    </div>
                )}

                {/* Empty */}
                {status === "ready" && uploads.length === 0 && (
                    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
                        <span className="grid size-14 place-items-center rounded-2xl bg-muted">
                            <UploadIcon className="size-7 text-muted-foreground" aria-hidden="true" />
                        </span>
                        <div>
                            <p className="m-0 font-bold text-foreground">{P.EMPTY_TITLE}</p>
                            <p className="m-0 mt-1 text-sm text-muted-foreground">{P.EMPTY_TEXT}</p>
                        </div>
                        <Link to="/upload"
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-foreground px-5 text-sm font-bold text-background no-underline hover:opacity-90">
                            <UploadIcon className="size-4" /> {P.UPLOAD_CTA}
                        </Link>
                    </div>
                )}

                {/* Grid */}
                {status === "ready" && pageUploads.length > 0 && (
                    <>
                        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
                            {pageUploads.map((row, i) => (
                                <li key={`${row.fileid || row.title}-${i}`}>
                                    <FileCard item={row} index={i} onOpen={(fid, title) => setPreview({ fileId: fid, title })} />
                                </li>
                            ))}
                        </ul>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                    className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-35">
                                    <ChevronLeftIcon className="size-4" /> Prev
                                </button>
                                <span className="min-w-[4rem] text-center text-sm font-semibold text-muted-foreground">
                                    {page} / {totalPages}
                                </span>
                                <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                    className="flex h-9 items-center gap-1.5 rounded-xl bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-85 disabled:pointer-events-none disabled:opacity-35">
                                    Next <ChevronRightIcon className="size-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* ── Settings ──────────────────────────────────────────────── */}
            <section className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground">
                            <PaletteIcon className="size-[18px]" aria-hidden="true" />
                        </span>
                        <div>
                            <p className="m-0 text-sm font-bold text-foreground">{P.THEME_LABEL}</p>
                            <p className="m-0 text-xs text-muted-foreground">{P.THEME_HINT}</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground">
                            <LogOutIcon className="size-[18px]" aria-hidden="true" />
                        </span>
                        <div>
                            <p className="m-0 text-sm font-bold text-foreground">{P.LOGOUT_BTN}</p>
                            <p className="m-0 text-xs text-muted-foreground">{P.SIGN_OUT_HINT}</p>
                        </div>
                    </div>
                    <Button variant="danger" size="sm" onClick={signOut}>{P.LOGOUT_BTN}</Button>
                </div>
            </section>

            {preview && (
                <FilePreviewModal key={preview.fileId} fileId={preview.fileId} title={preview.title} onClose={() => setPreview(null)} />
            )}
        </div>
    );
}
