// src/pages/profile/Profile.jsx
// Who you are, what you've shared, and account settings.
// The server filters uploads by email (/api/files?email=…); this page only renders them.
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, FileTextIcon, FolderIcon, LayersIcon, LogOutIcon, PaletteIcon, UploadIcon } from "lucide-react";
import FileCard from "../../components/cards/FileCard";
import FilePreviewModal from "../../components/preview/FilePreviewModal";
import ThemeToggle from "../../components/theme/ThemeToggle";
import Button from "../../components/Button/Button";
import { fetchFiles } from "../../services/filesService";
import { useSignOut } from "../../hooks/useSignOut";
import { UI_CONFIG } from "../../config/ui.config";

const P = UI_CONFIG.PROFILE;
const RECENT_COUNT = 3;

const BANNER_PATTERN = {
    backgroundImage:
        "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
    backgroundSize: "32px 32px",
};

function readStoredAuth() {
    try {
        const stored = JSON.parse(sessionStorage.getItem("auth") || "null");
        return stored?.ok ? stored : null;
    } catch {
        return null;
    }
}

function initials(name = "") {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

const capitalize = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

export default function Profile() {
    const signOut = useSignOut();
    const user = readStoredAuth() || {};
    const email = user.email || "";

    const [uploads, setUploads] = useState([]);
    const [status, setStatus] = useState(email ? "loading" : "ready"); // loading | ready | error
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!email) return undefined;
        let cancelled = false;
        fetchFiles({ offset: 0, limit: 0, email }).then((res) => {
            if (cancelled) return;
            if (res.ok && Array.isArray(res.rows)) {
                setUploads(res.rows);
                setStatus("ready");
            } else {
                setStatus("error");
            }
        });
        return () => {
            cancelled = true;
        };
    }, [email]);

    const stats = useMemo(() => {
        const unique = (key) => new Set(uploads.map((f) => String(f[key] || "").trim().toLowerCase()).filter(Boolean)).size;
        return [
            { label: P.STAT_UPLOADS, value: uploads.length, icon: FileTextIcon },
            { label: P.STAT_CATEGORIES, value: unique("category"), icon: FolderIcon },
            { label: P.STAT_TOPICS, value: unique("title"), icon: LayersIcon },
        ];
    }, [uploads]);

    const recent = uploads.slice(0, RECENT_COUNT);

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            {/* Header card */}
            <section className="overflow-hidden rounded-md border border-border bg-background animate-in fade-in-0 slide-in-from-bottom-2 [animation-duration:400ms]">
                <div className="relative h-24 bg-foreground text-background sm:h-28">
                    <span aria-hidden="true" className="absolute inset-0 opacity-[0.12]" style={BANNER_PATTERN} />
                </div>

                <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pb-6">
                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
                        <span
                            aria-hidden="true"
                            className="-mt-10 grid size-20 shrink-0 place-items-center rounded-md border-4 border-solid border-background bg-foreground font-display text-2xl font-extrabold text-background shadow-md sm:-mt-12 sm:size-24 sm:text-3xl"
                        >
                            {initials(user.username)}
                        </span>
                        <div className="min-w-0 pb-1">
                            <h1 className="m-0 truncate font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                                {user.username || P.ROLE_FALLBACK}
                            </h1>
                            <p className="m-0 mt-1 truncate text-sm text-muted-foreground">{email}</p>
                            <span className="mt-2 inline-flex items-center rounded-md border border-border px-2 py-0.5 text-[11px] font-bold tracking-wider text-foreground uppercase">
                                {user.userType ? capitalize(user.userType) : P.ROLE_FALLBACK}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to="/upload"
                            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-bold text-background no-underline transition-[transform,opacity] duration-200 hover:-translate-y-px hover:opacity-90 sm:flex-none"
                        >
                            <UploadIcon className="size-4" aria-hidden="true" />
                            {P.UPLOAD_CTA}
                        </Link>
                        <Button variant="secondary" size="sm" icon={LogOutIcon} onClick={signOut} className="h-10">
                            {P.LOGOUT_BTN}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
                {stats.map((s, i) => (
                    <div
                        key={s.label}
                        style={{ animationDelay: `${120 + i * 70}ms` }}
                        className="flex flex-col gap-2 rounded-md border border-border bg-background p-4 animate-in fade-in-0 slide-in-from-bottom-2 [animation-duration:400ms] [animation-fill-mode:both] sm:flex-row sm:items-center sm:gap-4 sm:p-5"
                    >
                        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-muted sm:size-11">
                            <s.icon className="size-4 text-foreground sm:size-5" aria-hidden="true" />
                        </span>
                        <span className="flex flex-col">
                            <span className="font-display text-2xl leading-none font-extrabold text-foreground tabular-nums sm:text-3xl">
                                {status === "loading" ? "—" : s.value}
                            </span>
                            <span className="mt-1 text-xs font-semibold text-muted-foreground sm:text-sm">{s.label}</span>
                        </span>
                    </div>
                ))}
            </section>

            {/* Recent uploads */}
            <section className="mt-10">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="m-0 font-display text-xl font-extrabold tracking-tight text-foreground">{P.RECENT_TITLE}</h2>
                    {uploads.length > RECENT_COUNT && (
                        <Link
                            to="/my-uploads"
                            className="group inline-flex items-center gap-1 text-sm font-bold text-foreground no-underline hover:opacity-100"
                        >
                            {P.VIEW_ALL}
                            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                    )}
                </div>

                {status === "loading" && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
                        {Array.from({ length: RECENT_COUNT }).map((_, i) => (
                            <div key={i} className="flex animate-pulse flex-col gap-3 rounded-md border border-border p-3">
                                <div className="h-40 rounded-md bg-muted" />
                                <div className="h-4 w-3/4 rounded-md bg-muted" />
                                <div className="h-3 w-1/2 rounded-md bg-muted" />
                            </div>
                        ))}
                    </div>
                )}

                {status === "error" && (
                    <p className="m-0 rounded-md border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
                        {P.LOAD_ERROR}
                    </p>
                )}

                {status === "ready" && recent.length === 0 && (
                    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border px-6 py-12 text-center">
                        <span className="grid size-12 place-items-center rounded-md bg-muted">
                            <FileTextIcon className="size-6 text-muted-foreground" aria-hidden="true" />
                        </span>
                        <p className="m-0 font-bold text-foreground">{P.EMPTY_TITLE}</p>
                        <p className="m-0 text-sm text-muted-foreground">{P.EMPTY_TEXT}</p>
                        <Link to="/upload" className="mt-1 inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-bold text-background no-underline hover:opacity-90">
                            <UploadIcon className="size-4" aria-hidden="true" />
                            {P.UPLOAD_CTA}
                        </Link>
                    </div>
                )}

                {status === "ready" && recent.length > 0 && (
                    <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
                        {recent.map((row, i) => (
                            <li key={`${row.fileid || row.title}-${i}`}>
                                <FileCard item={row} index={i} onOpen={(fileId, title) => setPreview({ fileId, title })} />
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Settings */}
            <section className="mt-10 grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-border bg-background p-5">
                    <h2 className="m-0 text-xs font-bold tracking-wider text-muted-foreground uppercase">{P.PREFERENCES}</h2>
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <span className="flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-md bg-muted">
                                <PaletteIcon className="size-[18px] text-foreground" aria-hidden="true" />
                            </span>
                            <span className="flex flex-col">
                                <span className="text-sm font-bold text-foreground">{P.THEME_LABEL}</span>
                                <span className="text-xs text-muted-foreground">{P.THEME_HINT}</span>
                            </span>
                        </span>
                        <ThemeToggle />
                    </div>
                </div>

                <div className="rounded-md border border-border bg-background p-5">
                    <h2 className="m-0 text-xs font-bold tracking-wider text-muted-foreground uppercase">{P.ACCOUNT}</h2>
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <span className="flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-md bg-muted">
                                <LogOutIcon className="size-[18px] text-foreground" aria-hidden="true" />
                            </span>
                            <span className="flex flex-col">
                                <span className="text-sm font-bold text-foreground">{P.LOGOUT_BTN}</span>
                                <span className="text-xs text-muted-foreground">{P.SIGN_OUT_HINT}</span>
                            </span>
                        </span>
                        <Button variant="danger" size="sm" onClick={signOut}>
                            {P.LOGOUT_BTN}
                        </Button>
                    </div>
                </div>
            </section>

            {preview && (
                <FilePreviewModal key={preview.fileId} fileId={preview.fileId} title={preview.title} onClose={() => setPreview(null)} />
            )}
        </div>
    );
}
