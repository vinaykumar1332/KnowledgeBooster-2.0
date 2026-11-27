// The one dropdown for the whole app, built on the shadcn Select (Radix).
import React, { useId } from "react";
import { Select as UISelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * @param {{ value: string, onChange: (value: string) => void, options: { value: string, label: string }[] }} props
 */
export default function Select({
    label,
    ariaLabel,
    name,
    id,
    options = [],
    value,
    onChange,
    placeholder,
    error,
    hint,
    required = false,
    disabled = false,
    className = "",
}) {
    const autoId = useId();
    const triggerId = id || name || autoId;
    const messageId = `${triggerId}-message`;
    const message = error || hint;

    return (
        <div className={cn("grid gap-1.5", className)}>
            {label && (
                <Label htmlFor={triggerId} className="text-sm font-semibold">
                    {label}
                    {required && <span className="text-destructive" aria-hidden="true">*</span>}
                </Label>
            )}

            <UISelect
                name={name}
                value={value ?? ""}
                onValueChange={onChange}
                disabled={disabled}
                required={required}
            >
                <SelectTrigger
                    id={triggerId}
                    aria-label={!label ? ariaLabel : undefined}
                    aria-invalid={!!error}
                    aria-describedby={message ? messageId : undefined}
                    className={cn("h-10 w-full text-[15px]", error && "border-destructive")}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </UISelect>

            {message && (
                <p id={messageId} className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")} role={error ? "alert" : undefined}>
                    {message}
                </p>
            )}
        </div>
    );
}
