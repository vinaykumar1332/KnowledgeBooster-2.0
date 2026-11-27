// src/components/navbar/Navigation.jsx
// Desktop (md and up): fixed left sidebar.
// Mobile: slim top bar with an account menu, plus a bottom tab bar.
// Both mobile bars slide away while scrolling down and return when scrolling up.
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    HouseIcon,
    LibraryIcon,
    LogOutIcon,
    PlayCircleIcon,
    PlusIcon,
    UploadIcon,
    UserIcon,
} from "lucide-react";
import ThemeToggle from "../theme/ThemeToggle";
import { useSignOut } from "../../hooks/useSignOut";
import { useHideOnScroll } from "../../hooks/useHideOnScroll";
import { useSidebar } from "../../hooks/useSidebar";
import { UI_CONFIG } from "../../config/ui.config";
import { cn } from "@/lib/utils";

const N = UI_CONFIG.NAV;

const NAV_ITEMS = [
    { to: "/home",     label: N.HOME,    icon: HouseIcon },
    { to: "/files",    label: N.BROWSE,  icon: LibraryIcon },
    { to: "/upload",   label: N.UPLOAD,  icon: UploadIcon, primary: true },
    { to: "/videos",   label: "Videos",  icon: PlayCircleIcon },
    { to: "/profile",  label: N.PROFILE, icon: UserIcon },
];

function readStoredAuth() {
    try {
        const stored = JSON.parse(sessionStorage.getItem("auth") || "null");
        return stored?.ok ? stored : null;
    } catch {
        return null;
    }
}

function initialsFromName(name) {
    const parts = (name || "").trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

function Avatar({ name, className = "" }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "grid size-9 shrink-0 place-items-center rounded-md bg-foreground font-display text-xs font-extrabold text-background",
                className
            )}
        >
            {initialsFromName(name)}
        </span>
    );
}

function Brand({ compact = false, collapsed = false }) {
    return (
        <NavLink
            to="/home"
            title={collapsed ? N.BRAND : undefined}
            aria-label={collapsed ? N.BRAND : undefined}
            className="flex min-w-0 items-center gap-2.5 text-foreground no-underline hover:opacity-100"
        >
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-foreground font-display text-[11px] font-extrabold text-background">
                {N.BRAND_MARK}
            </span>
            {!collapsed && (
                <span
                    className={cn(
                        "truncate font-display font-extrabold tracking-tight whitespace-nowrap animate-in fade-in-0 [animation-duration:300ms]",
                        compact ? "text-sm" : "text-sm xl:text-[15px]"
                    )}
                >
                    {N.BRAND}
                </span>
            )}
        </NavLink>
    );
}

export default function Navigation({ userName: nameProp = "", userEmail: emailProp = "" }) {
    const handleLogout = useSignOut();
    const hidden = useHideOnScroll();
    const { collapsed, toggle: toggleSidebar } = useSidebar();

    const stored = readStoredAuth();
    const userName = nameProp || stored?.username || "";
    const userEmail = emailProp || stored?.email || "";


    return (
        <>
            {/* ---------- Desktop sidebar (collapsible) ---------- */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border bg-background transition-[width] duration-300 ease-out md:flex",
                    "w-[var(--sidebar-w,18rem)]"
                )}
            >
                <div className={cn("flex h-16 min-w-0 items-center overflow-hidden", collapsed ? "justify-center" : "px-5")}>
                    <Brand collapsed={collapsed} />
                </div>

                {/* Edge button: collapse to an icon rail or expand back */}
                <button
                    type="button"
                    onClick={toggleSidebar}
                    aria-label={collapsed ? N.EXPAND : N.COLLAPSE}
                    aria-expanded={!collapsed}
                    title={collapsed ? N.EXPAND : N.COLLAPSE}
                    className="absolute top-5 -right-3 z-10 grid size-6 min-h-0 place-items-center rounded-md border border-solid border-border bg-background p-0 text-muted-foreground shadow-sm transition-colors duration-200 hover:border-foreground hover:text-foreground"
                >
                    {collapsed ? (
                        <ChevronRightIcon className="size-3.5" aria-hidden="true" />
                    ) : (
                        <ChevronLeftIcon className="size-3.5" aria-hidden="true" />
                    )}
                </button>

                <nav aria-label={N.MAIN_LABEL} className="flex-1 overflow-x-hidden overflow-y-auto px-3 py-2">
                    <ul className="m-0 flex list-none flex-col gap-1 p-0">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    title={collapsed ? item.label : undefined}
                                    aria-label={collapsed ? item.label : undefined}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex h-10 w-full items-center gap-3 rounded-md text-[13px] font-semibold no-underline transition-colors duration-200 hover:opacity-100 lg:text-sm 2xl:text-[15px]",
                                            collapsed ? "justify-center px-0" : "px-3",
                                            isActive
                                                ? "bg-foreground text-background"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )
                                    }
                                >
                                    <item.icon className="size-[18px] shrink-0" aria-hidden="true" />
                                    {!collapsed && (
                                        <span className="truncate animate-in fade-in-0 [animation-duration:300ms]">{item.label}</span>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div
                    className={cn(
                        "flex min-w-0 flex-col gap-2 overflow-hidden border-t border-border",
                        collapsed ? "items-center px-2 py-3" : "p-3"
                    )}
                >
                    {collapsed ? (
                        <ThemeToggle />
                    ) : (
                        <div className="flex min-w-0 items-center justify-between px-2">
                            <span className="text-xs font-semibold text-muted-foreground">{N.THEME}</span>
                            <ThemeToggle />
                        </div>
                    )}
                    <div
                        title={collapsed ? `${userName}\n${userEmail}` : undefined}
                        className={cn("flex min-w-0 items-center rounded-md", collapsed ? "flex-col gap-2" : "gap-3 p-2")}
                    >
                        <Avatar name={userName} />
                        {!collapsed && (
                            <div className="min-w-0 flex-1 animate-in fade-in-0 [animation-duration:300ms]">
                                <p className="m-0 truncate text-[13px] font-semibold text-foreground lg:text-sm">{userName}</p>
                                <p className="m-0 truncate text-xs text-muted-foreground">{userEmail}</p>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handleLogout}
                            aria-label={N.LOGOUT}
                            title={N.LOGOUT}
                            className="grid size-9 min-h-0 shrink-0 place-items-center rounded-md p-0 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <LogOutIcon className="size-4" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ---------- Mobile top bar ---------- */}
            <header
                className={cn(
                    "sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-md transition-transform duration-300 ease-out md:hidden",
                    hidden && "-translate-y-full"
                )}
            >
                <Brand compact />
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <AccountMenu userName={userName} userEmail={userEmail} onLogout={handleLogout} />
                </div>
            </header>

            {/* ---------- Mobile bottom tabs ---------- */}
            <nav
                aria-label={N.MAIN_LABEL}
                className={cn(
                    "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-transform duration-300 ease-out md:hidden",
                    hidden && "translate-y-full"
                )}
            >
                <ul className="mx-auto m-0 grid h-16 max-w-md list-none grid-cols-5 items-center p-0">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.to} className="flex justify-center">
                            {item.primary ? (
                                <NavLink
                                    to={item.to}
                                    aria-label={item.label}
                                    className="grid size-12 -translate-y-2 place-items-center rounded-md bg-foreground text-background no-underline shadow-lg transition-transform duration-200 hover:opacity-100 active:scale-95"
                                >
                                    <PlusIcon className="size-6" aria-hidden="true" />
                                </NavLink>
                            ) : (
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex flex-col items-center gap-0.5 text-[11px] font-semibold no-underline transition-colors duration-200 hover:opacity-100",
                                            isActive ? "text-foreground" : "text-muted-foreground"
                                        )
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span
                                                className={cn(
                                                    "grid h-7 w-12 place-items-center rounded-md transition-colors duration-200",
                                                    isActive && "bg-muted"
                                                )}
                                            >
                                                <item.icon className="size-5" aria-hidden="true" />
                                            </span>
                                            {item.label}
                                        </>
                                    )}
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}

/** Mobile avatar button with a small dropdown: who is signed in, profile, my uploads, sign out. */
function AccountMenu({ userName, userEmail, onLogout }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("pointerdown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const itemClass =
        "flex h-10 w-full min-h-0 items-center gap-3 rounded-md px-3 text-left text-sm font-semibold text-foreground no-underline transition-colors hover:bg-muted hover:opacity-100";

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={N.ACCOUNT_LABEL}
                aria-haspopup="menu"
                aria-expanded={open}
                className="min-h-0 rounded-md p-0"
            >
                <Avatar name={userName} />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute top-full right-0 z-50 mt-2 w-64 rounded-md border border-border bg-background p-1.5 shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
                >
                    <div className="flex items-center gap-3 px-3 py-2.5">
                        <Avatar name={userName} />
                        <div className="min-w-0">
                            <p className="m-0 truncate text-sm font-semibold text-foreground">{userName}</p>
                            <p className="m-0 truncate text-xs text-muted-foreground">{userEmail}</p>
                        </div>
                    </div>
                    <div className="my-1 h-px bg-border" />
                    <NavLink role="menuitem" to="/profile" onClick={() => setOpen(false)} className={itemClass}>
                        <UserIcon className="size-4" aria-hidden="true" /> {N.PROFILE}
                    </NavLink>
                    <div className="my-1 h-px bg-border" />
                    <button role="menuitem" type="button" onClick={onLogout} className={cn(itemClass, "bg-transparent p-0 px-3")}>
                        <LogOutIcon className="size-4" aria-hidden="true" /> {N.LOGOUT}
                    </button>
                </div>
            )}
        </div>
    );
}
