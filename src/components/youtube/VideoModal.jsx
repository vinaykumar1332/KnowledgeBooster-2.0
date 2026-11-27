import React, { useEffect } from "react";
import { ExternalLinkIcon, XIcon } from "lucide-react";

export default function VideoModal({ video, onClose }) {
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
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100dvh", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "rgba(0,0,0,0.80)", overflowY: "auto" }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div style={{ width: "100%", maxWidth: "56rem", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: "0.5rem", background: "var(--background)", border: "1px solid var(--border)", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
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
