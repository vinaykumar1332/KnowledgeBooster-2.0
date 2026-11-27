// src/components/cards/FileCard.jsx
// Lightweight card: a drawn "paper sheet" instead of an embedded Drive viewer, so a
// page of cards loads instantly. The real preview opens only when the card is clicked.
import React from "react";

import { ArrowUpRightIcon } from "lucide-react";
import { extractFileId } from "../../utils/drive";
import { UI_CONFIG } from "../../config/ui.config";

const F = UI_CONFIG.FILES;

// Widths of the fake text lines on the sheet, so each card looks like a real page
const SHEET_LINES = ["w-10/12", "w-full", "w-9/12", "w-full", "w-7/12"];

function initials(name = "") {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

export default function FileCard({ item, onOpen, index = 0 }) {
    const fileId = extractFileId(item);

    return (
        <button
            type="button"
            onClick={() => onOpen(fileId, item.title)}
            style={{ animationDelay: `${(index % 12) * 45}ms` }}
            // The explicit resets (items-stretch, border-solid, whitespace-normal, font-normal)
            // override the old global button rule that centres, unborders and bolds buttons.
            className="group flex h-full min-h-0 w-full flex-col items-stretch justify-start gap-0 overflow-hidden rounded-md border border-solid border-border bg-background p-0 text-left font-normal whitespace-normal text-foreground transition-[transform,box-shadow,border-color] duration-300 ease-out animate-in fade-in-0 slide-in-from-bottom-3 [animation-duration:500ms] [animation-fill-mode:both] hover:-translate-y-1 hover:border-foreground/25 hover:shadow-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground motion-reduce:transform-none"
        >
            {/* Thumbnail: a drawn PDF page */}
            <div className="relative flex h-40 items-end justify-center overflow-hidden border-b border-border bg-muted px-6">
                <div className="relative w-28 translate-y-3 rounded-t-md border border-b-0 border-border bg-background px-3 pt-3 pb-6 shadow-sm transition-transform duration-300 ease-out group-hover:-translate-y-0 group-hover:-rotate-2 motion-reduce:transform-none">
                    <div className="mb-2 h-1.5 w-1/2 rounded-full bg-foreground/80" />
                    <div className="grid gap-1.5">
                        {SHEET_LINES.map((w, i) => (
                            <div key={i} className={`h-1 rounded-full bg-foreground/15 ${w}`} />
                        ))}
                    </div>
                    <span className="absolute right-2 bottom-2 rounded-md bg-foreground px-1.5 py-px text-[9px] font-extrabold tracking-widest text-background">
                        PDF
                    </span>
                </div>

                {item.category && (
                    <span className="absolute top-3 left-3 rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-bold tracking-wider text-foreground uppercase">
                        {item.category}
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-1.5 p-4">
                {item.subcategory && (
                    <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                        {item.subcategory}
                    </span>
                )}
                <h3 className="m-0 line-clamp-2 text-base leading-snug font-bold text-foreground">
                    {item.title || "Untitled"}
                </h3>
                {item.description && (
                    <p className="m-0 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-4 pb-4">
                <span className="flex min-w-0 items-center gap-2">
                    <span
                        aria-hidden="true"
                        className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-[10px] font-extrabold text-foreground"
                    >
                        {initials(item.username)}
                    </span>
                    <span className="truncate text-xs font-semibold text-muted-foreground">{item.username}</span>
                </span>
                <span className="flex h-8 shrink-0 items-center gap-1 rounded-md border border-border px-2.5 text-xs font-bold text-foreground transition-colors duration-300 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                    {F.PREVIEW}
                    <ArrowUpRightIcon
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                    />
                </span>
            </div>
        </button>
    );
}

