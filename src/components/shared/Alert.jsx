// Inline status message, built on the shadcn Alert.
import React from "react";
import { CircleAlertIcon, CheckCircle2Icon, InfoIcon } from "lucide-react";
import { Alert as UIAlert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const ICONS = { success: CheckCircle2Icon, error: CircleAlertIcon, info: InfoIcon };

/** Errors are announced at once (role="alert"); other messages politely (role="status"). */
export default function Alert({ variant = "info", children, className = "" }) {
    if (!children) return null;
    const Icon = ICONS[variant] || InfoIcon;
    const isError = variant === "error";

    return (
        <UIAlert
            variant={isError ? "destructive" : "default"}
            role={isError ? "alert" : "status"}
            className={cn("border-border", className)}
        >
            <Icon aria-hidden="true" />
            <AlertDescription className={cn(!isError && "text-foreground")}>{children}</AlertDescription>
        </UIAlert>
    );
}
