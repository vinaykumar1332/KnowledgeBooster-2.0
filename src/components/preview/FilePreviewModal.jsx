// src/components/preview/FilePreviewModal.jsx
// The Drive viewer loads only here, after the user opens a file.
// Phones: sheet that slides up. Desktop: dialog that scales in.
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ExternalLinkIcon, FileTextIcon, Loader2Icon, XIcon } from "lucide-react";
import { buildDrivePreviewUrl, buildDriveViewerUrl } from "../../utils/drive";
import { UI_CONFIG } from "../../config/ui.config";
import { cn } from "@/lib/utils";

const F = UI_CONFIG.FILES;

export default function FilePreviewModal({ fileId, title, onClose }) {
    const previewUrl = buildDrivePreviewUrl(fileId);
    const viewerUrl = buildDriveViewerUrl(fileId);
    const [loaded, setLoaded] = useState(false);
    const closeRef = useRef(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    // Focus the close button, close on Escape, and stop the page behind from scrolling
    useEffect(() => {
        closeRef.current?.focus();
        const onKey = (e) => e.key === "Escape" && onCloseRef.current();
        document.addEventListener("keydown", onKey);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={onClose}
            className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0 [animation-duration:200ms] sm:items-center sm:p-6"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-md border border-border bg-background shadow-2xl animate-in slide-in-from-bottom-10 [animation-duration:320ms] sm:h-[88vh] sm:rounded-md sm:zoom-in-95 sm:slide-in-from-bottom-4"
            >
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-muted">
                        <FileTextIcon className="size-[18px]" aria-hidden="true" />
                    </span>
                    <p className="m-0 min-w-0 flex-1 truncate text-sm font-bold text-foreground sm:text-base">{title}</p>
                    {viewerUrl && (
                        <a
                            href={viewerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-semibold text-foreground no-underline transition-colors hover:bg-muted hover:opacity-100 sm:inline-flex"
                        >
                            <ExternalLinkIcon className="size-4" aria-hidden="true" />
                            {F.OPEN_IN_DRIVE}
                        </a>
                    )}
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={onClose}
                        aria-label={F.CLOSE_PREVIEW}
                        className="grid size-9 min-h-0 shrink-0 place-items-center rounded-md p-0 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <XIcon className="size-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Viewer */}
                <div className="relative flex-1 bg-muted">
                    {!loaded && (
                        <div className="absolute inset-0 grid place-items-center" role="status">
                            <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
                                <Loader2Icon className="size-6 animate-spin" aria-hidden="true" />
                                {F.LOADING_PREVIEW}
                            </div>
                        </div>
                    )}
                    <iframe
                        src={previewUrl}
                        title={title}
                        onLoad={() => setLoaded(true)}
                        className={cn(
                            "size-full border-0 transition-opacity duration-300",
                            loaded ? "opacity-100" : "opacity-0"
                        )}
                    />
                </div>

                {/* Phone-only footer action */}
                {viewerUrl && (
                    <div className="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
                        <a
                            href={viewerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-11 items-center justify-center gap-2 rounded-md bg-foreground text-sm font-bold text-background no-underline hover:opacity-90"
                        >
                            <ExternalLinkIcon className="size-4" aria-hidden="true" />
                            {F.OPEN_IN_DRIVE}
                        </a>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}

