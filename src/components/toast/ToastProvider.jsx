import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, XIcon } from "lucide-react";
import { ToastContext } from "./toastContext";
import { cn } from "@/lib/utils";

const DEFAULT_DURATION = 4000;
const EXIT_MS = 300;
const MAX_VISIBLE = 3;
const ICONS = { success: CircleCheckIcon, error: CircleAlertIcon, info: InfoIcon };

let nextId = 0;

/**
 * Themed, stacked notifications. Wrap the app once, then call useToast().success("Saved").
 * Toasts stack in the top-right corner (top-centre on phones), slide in from the right,
 * pause the progress bar on hover, and slide back out when dismissed.
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    }, []);

    const remove = useCallback((id) => {
        setToasts((list) => list.filter((t) => t.id !== id));
    }, []);

    const push = useCallback((type, message, duration = DEFAULT_DURATION) => {
        const id = ++nextId;
        setToasts((list) => [...list.slice(-(MAX_VISIBLE - 1)), { id, type, message, duration, leaving: false }]);
        return id;
    }, []);

    const api = useMemo(
        () => ({
            success: (message, duration) => push("success", message, duration),
            error: (message, duration) => push("error", message, duration),
            info: (message, duration) => push("info", message, duration),
            dismiss,
        }),
        [push, dismiss]
    );

    return (
        <ToastContext.Provider value={api}>
            {children}
            <Toaster toasts={toasts} onDismiss={dismiss} onRemove={remove} />
        </ToastContext.Provider>
    );
}

function Toaster({ toasts, onDismiss, onRemove }) {
    return (
        <div
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end sm:px-0"
        >
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDismiss={onDismiss} onRemove={onRemove} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onDismiss, onRemove }) {
    const { id, type, message, duration, leaving } = toast;
    const Icon = ICONS[type] || InfoIcon;
    const [paused, setPaused] = useState(false);

    // Auto-dismiss, restarted from full duration after the pointer leaves
    useEffect(() => {
        if (leaving || paused) return undefined;
        const timer = setTimeout(() => onDismiss(id), duration);
        return () => clearTimeout(timer);
    }, [id, duration, leaving, paused, onDismiss]);

    // Remove from the list once the exit animation has finished
    useEffect(() => {
        if (!leaving) return undefined;
        const timer = setTimeout(() => onRemove(id), EXIT_MS);
        return () => clearTimeout(timer);
    }, [id, leaving, onRemove]);

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            data-state={leaving ? "closed" : "open"}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className={cn(
                "pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-lg border border-border bg-background p-4 text-foreground shadow-lg",
                "duration-300 ease-out",
                leaving
                    ? "animate-out fade-out-0 slide-out-to-right-8"
                    : "animate-in fade-in-0 slide-in-from-right-8"
            )}
        >
            <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p className="flex-1 text-sm leading-snug">{message}</p>
            <button
                type="button"
                onClick={() => onDismiss(id)}
                aria-label="Dismiss notification"
                className="-m-1 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
                <XIcon className="size-4" aria-hidden="true" />
            </button>
            {!leaving && (
                <span
                    aria-hidden="true"
                    className="toast-progress absolute bottom-0 left-0 h-0.5 w-full bg-foreground"
                    style={{ animationDuration: `${duration}ms`, animationPlayState: paused ? "paused" : "running" }}
                />
            )}
        </div>
    );
}
