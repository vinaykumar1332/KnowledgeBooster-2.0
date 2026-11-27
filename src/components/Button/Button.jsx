// Application button. Same props as before, rendered with the shadcn Button.
import React from "react";
import { Loader2Icon } from "lucide-react";
import { Button as UIButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const VARIANTS = {
    primary: "default",
    secondary: "outline",
    subtle: "secondary",
    danger: "destructive",
    ghost: "ghost",
};

// Touch-friendly heights (44px and up on the default size)
const SIZES = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
};

export default function Button({
    children,
    label,
    icon: Icon,
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    disabled = false,
    onClick,
    type = "button",
    title,
    ariaLabel,
    className = "",
    ...props
}) {
    const isDisabled = disabled || loading;

    return (
        <UIButton
            type={type}
            variant={VARIANTS[variant] || "default"}
            onClick={onClick}
            disabled={isDisabled}
            title={title}
            aria-label={ariaLabel}
            aria-busy={loading || undefined}
            className={cn(
                SIZES[size] || SIZES.md,
                "transition-[transform,background-color,box-shadow,opacity] duration-200 ease-out hover:-translate-y-px hover:shadow-md active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none",
                fullWidth && "w-full",
                className
            )}
            {...props}
        >
            {loading ? <Loader2Icon className="animate-spin" aria-hidden="true" /> : Icon && <Icon aria-hidden="true" />}
            {children || label}
        </UIButton>
    );
}
