import React from "react";
import { Link } from "react-router-dom";
import { CheckIcon } from "lucide-react";
import ThemeToggle from "../../components/theme/ThemeToggle";
import { UI_CONFIG } from "../../config/ui.config";

/**
 * Two-panel layout for login and signup.
 * Large screens: black brand panel with the benefits, form on the right.
 * Phones: one column, form only.
 */
export default function AuthLayout({ title, subtitle, footer, children }) {
    const aside = UI_CONFIG.AUTH.ASIDE;

    return (
        <main className="grid min-h-dvh bg-background text-foreground lg:grid-cols-2">
            <aside className="relative hidden overflow-hidden bg-foreground p-12 text-background lg:flex lg:flex-col lg:justify-between">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage:
                            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                        animation: "grid-drift 24s linear infinite",
                    }}
                />

                <Link to="/" className="relative font-display text-lg font-extrabold tracking-tight text-background hover:opacity-80">
                    KnowledgeHub
                </Link>

                <div className="relative max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="m-0 font-display text-4xl leading-tight font-extrabold tracking-tight text-background">{aside.TITLE}</h2>
                    <ul className="mt-8 space-y-3">
                        {aside.POINTS.map((point) => (
                            <li key={point} className="flex items-center gap-3 text-base text-background">
                                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-background text-foreground">
                                    <CheckIcon className="size-3.5" aria-hidden="true" />
                                </span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative m-0 text-sm text-background/60">{UI_CONFIG.LANDING.FOOTER_NOTE}</p>
            </aside>

            <section className="flex flex-col px-5 py-6 sm:px-10">
                <div className="flex items-center justify-between">
                    <Link to="/" className="font-display text-base font-extrabold tracking-tight lg:invisible">
                        KnowledgeHub
                    </Link>
                    <ThemeToggle />
                </div>

                <div className="flex flex-1 items-center justify-center py-10">
                    <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <h1 className="font-display text-3xl font-extrabold tracking-tight">{title}</h1>
                        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

                        <div className="mt-8">{children}</div>

                        {footer && <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>}
                    </div>
                </div>
            </section>
        </main>
    );
}

