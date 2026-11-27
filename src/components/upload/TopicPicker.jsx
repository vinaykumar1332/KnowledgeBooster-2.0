// One field for the topic (subcategory): type freely or tap a suggestion.
// Typing filters the chips; anything not in the list simply becomes a new topic.
import React, { useId, useMemo } from "react";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 40;
const MAX_CHIPS = 14;

/**
 * @param {{ value: string, onChange: (v: string) => void,
 *           popular: { name: string, count: number }[], defaults: string[],
 *           label: string, placeholder: string, help: string, newTopicText: (t: string) => string,
 *           error?: string }} props
 */
export default function TopicPicker({ value, onChange, popular = [], defaults = [], label, placeholder, help, newTopicText, error }) {
    const id = useId();
    const messageId = `${id}-message`;
    const query = value.trim().toLowerCase();

    // Community topics first (with counts), then defaults not already listed
    const options = useMemo(() => {
        const seen = new Set();
        const list = [];
        for (const p of popular) {
            const key = p.name.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                list.push({ name: p.name, count: p.count });
            }
        }
        for (const name of defaults) {
            const key = name.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                list.push({ name, count: 0 });
            }
        }
        return list;
    }, [popular, defaults]);

    const exactMatch = options.some((o) => o.name.toLowerCase() === query);
    const visible = (query && !exactMatch ? options.filter((o) => o.name.toLowerCase().includes(query)) : options).slice(0, MAX_CHIPS);

    return (
        <div className="grid gap-2">
            <label htmlFor={id} className="mb-0 text-sm font-semibold text-foreground">
                {label}
                <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <input
                id={id}
                type="text"
                value={value}
                maxLength={MAX_LENGTH}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoComplete="off"
                aria-invalid={!!error}
                aria-describedby={messageId}
                className={cn(
                    "h-10 w-full rounded-md border border-solid bg-background px-3 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground/20",
                    error ? "border-destructive" : "border-input"
                )}
            />

            <div className="flex flex-wrap gap-2" aria-label={label}>
                {visible.map((o) => {
                    const selected = o.name.toLowerCase() === query;
                    return (
                        <button
                            key={o.name}
                            type="button"
                            onClick={() => onChange(o.name)}
                            aria-pressed={selected}
                            className={cn(
                                "inline-flex h-8 min-h-0 items-center gap-1.5 rounded-md border border-solid px-3 py-0 text-[13px] font-semibold transition-colors duration-200 animate-in fade-in-0 [animation-duration:200ms]",
                                selected
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                            )}
                        >
                            {o.name}
                            {o.count > 0 && <span className="text-[11px] opacity-60">{o.count}</span>}
                        </button>
                    );
                })}
            </div>

            <p id={messageId} className={cn("m-0 text-xs", error ? "text-destructive" : "text-muted-foreground")} role={error ? "alert" : undefined}>
                {error || (query && !exactMatch ? newTopicText(value.trim()) : help)}
            </p>
        </div>
    );
}
