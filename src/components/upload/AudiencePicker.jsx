// Three selectable cards backed by real radio inputs (arrow keys and screen readers work).
import React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @param {{ name: string, value: string, onChange: (v: string) => void,
 *           options: { value: string, label: string, hint: string, icon: React.ComponentType }[],
 *           ariaLabel: string }} props
 */
export default function AudiencePicker({ name, value, onChange, options, ariaLabel }) {
    return (
        <div role="radiogroup" aria-label={ariaLabel} className="grid gap-3 sm:grid-cols-3">
            {options.map((o) => {
                const selected = o.value === value;
                return (
                    <label
                        key={o.value}
                        className={cn(
                            "relative mb-0 flex cursor-pointer flex-col gap-1.5 rounded-md border border-solid p-4 transition-[border-color,background-color,color,transform] duration-200 ease-out hover:-translate-y-px has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-foreground motion-reduce:transform-none",
                            selected
                                ? "border-foreground bg-foreground text-background"
                                : "border-border bg-background text-foreground hover:border-foreground/40"
                        )}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={o.value}
                            checked={selected}
                            onChange={() => onChange(o.value)}
                            className="sr-only"
                        />
                        <o.icon className="size-5" aria-hidden="true" />
                        <span className="mt-1 text-sm font-bold">{o.label}</span>
                        <span className={cn("text-xs leading-snug", selected ? "text-background/70" : "text-muted-foreground")}>
                            {o.hint}
                        </span>
                        {selected && (
                            <CheckIcon className="absolute top-3 right-3 size-4 animate-in zoom-in-50 fade-in-0" aria-hidden="true" />
                        )}
                    </label>
                );
            })}
        </div>
    );
}
