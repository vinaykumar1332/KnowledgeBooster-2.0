// Application text input. Same props as before, rendered with the shadcn Input and Label.
import React, { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input as UIInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function Input({
    label,
    id,
    name,
    type = "text",
    value,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    autoComplete,
    error,
    helpText,
    disabled = false,
    required = false,
    className = "",
    ...rest
}) {
    const autoId = useId();
    const inputId = id || name || autoId;
    const messageId = `${inputId}-message`;
    const message = error || helpText;
    const isPassword = type === "password";
    const [revealed, setRevealed] = useState(false);

    return (
        <div className={cn("grid gap-1.5", className)}>
            {label && (
                <Label htmlFor={inputId} className="text-sm font-semibold">
                    {label}
                    {required && <span className="text-destructive" aria-hidden="true">*</span>}
                </Label>
            )}

            <div className="relative">
                <UIInput
                    id={inputId}
                    name={name}
                    type={isPassword && revealed ? "text" : type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    required={required}
                    aria-invalid={!!error}
                    aria-describedby={message ? messageId : undefined}
                    className={cn("h-10 text-[15px]", isPassword && "pr-10", error && "border-destructive")}
                    {...rest}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setRevealed((r) => !r)}
                        disabled={disabled}
                        aria-label={revealed ? "Hide password" : "Show password"}
                        className="absolute top-1/2 right-1 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                    >
                        {revealed ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                    </button>
                )}
            </div>

            {message && (
                <p id={messageId} className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")} role={error ? "alert" : undefined}>
                    {message}
                </p>
            )}
        </div>
    );
}
