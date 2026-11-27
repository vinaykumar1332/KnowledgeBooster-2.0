import React from "react";
import { Link } from "react-router-dom";
import { CheckIcon, BookOpenIcon } from "lucide-react";
import ThemeToggle from "../../components/theme/ThemeToggle";
import { UI_CONFIG } from "../../config/ui.config";

export default function AuthLayout({ title, subtitle, footer, children }) {
    const aside = UI_CONFIG.AUTH.ASIDE;

    return (
        <main className="min-h-dvh bg-background text-foreground lg:grid lg:grid-cols-2">

            {/* ── Desktop brand panel (hidden on mobile) ─────────────────── */}
            <aside className="relative hidden overflow-hidden bg-foreground p-12 text-background lg:flex lg:flex-col lg:justify-between">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage:
                            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                        backgroundSize: "3rem 3rem",
                        animation: "grid-drift 24s linear infinite",
                    }}
                />
                <Link to="/" className="relative font-display text-lg font-extrabold tracking-tight text-background hover:opacity-80">
                    KnowledgeHub
                </Link>
                <div className="relative max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="m-0 font-display text-4xl leading-tight font-extrabold tracking-tight text-background">
                        {aside.TITLE}
                    </h2>
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

            {/* ── Right panel ────────────────────────────────────────────── */}
            <section className="flex min-h-dvh flex-col lg:min-h-0">

                {/* Mobile hero — compact branded header, hidden on desktop */}
                <div className="relative overflow-hidden bg-foreground px-5 pb-10 pt-6 lg:hidden">
                    {/* dot grid texture */}
                    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
                        xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="auth-dots" x="0" y="0" width="1.25rem" height="1.25rem" patternUnits="userSpaceOnUse">
                                <circle cx="0.125rem" cy="0.125rem" r="0.09rem" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#auth-dots)" />
                    </svg>

                    {/* top row: brand + theme toggle */}
                    <div className="relative flex items-center justify-between">
                        <Link to="/" className="font-display text-base font-extrabold tracking-tight text-background hover:opacity-80">
                            KnowledgeHub
                        </Link>
                        <ThemeToggle />
                    </div>

                    {/* hero copy */}
                    <div className="relative mt-6">
                        <span className="mb-3 inline-grid size-11 place-items-center rounded-2xl bg-background/15 backdrop-blur-sm">
                            <BookOpenIcon className="size-6 text-background" aria-hidden="true" />
                        </span>
                        <h1 className="m-0 font-display text-2xl font-extrabold tracking-tight text-background">
                            {aside.TITLE}
                        </h1>
                        <p className="m-0 mt-1.5 text-sm text-background/70">
                            {aside.POINTS[0]}
                        </p>
                    </div>
                </div>

                {/* Form card — pulled up over the hero on mobile */}
                <div className="relative z-10 -mt-6 flex flex-1 flex-col rounded-t-3xl bg-background px-5 pb-8 pt-7 lg:mt-0 lg:flex lg:items-center lg:justify-center lg:rounded-none lg:px-10 lg:py-10">

                    {/* Desktop-only top bar (theme toggle) */}
                    <div className="mb-8 hidden items-center justify-between lg:flex">
                        <Link to="/" className="invisible font-display text-base font-extrabold tracking-tight">
                            KnowledgeHub
                        </Link>
                        <ThemeToggle />
                    </div>

                    <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <h2 className="m-0 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                            {title}
                        </h2>
                        <p className="m-0 mt-1.5 text-sm text-muted-foreground">{subtitle}</p>

                        <div className="mt-7">{children}</div>

                        {footer && (
                            <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
