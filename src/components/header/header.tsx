"use client";

import Link from "next/link";
import { LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useLogout } from "@/hooks/logout";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuTrigger,
    NavigationMenuContent,
} from "@/components/ui/navigation-menu";

const navItems = [
    { label: "效果器", href: "/effects" },
    { label: "音箱", href: "/amps" },
    { label: "吉他", href: "/guitars" },
    { label: "其他配件", href: "/accessories" },
] as const;

export function Header({
    notificationCount = 0,
    className,
}: {
    notificationCount?: number;
    className?: string;
}) {
    const { user } = useAuthStore();
    const isMobile = useIsMobile();
    const logout = useLogout();

    return (
        <header
            className={cn(
                "flex w-full items-center gap-6 sm:gap-8 md:gap-12 bg-white px-4 py-4 sm:px-6 sm:py-4 md:px-10 md:py-4",
                className
            )}
        >
            {/* Logo */}
            <Link
                href="/"
                className="flex shrink-0 items-center gap-1 text-[var(--tune-muted)] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tune-primary)] focus-visible:ring-offset-2 rounded"
                aria-label="Tune 首頁"
            >
                <span className="flex size-6 shrink-0 items-center justify-center text-[var(--tune-text)]">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                    >
                        <path
                            d="M12 3v18M6 8v8M18 8v8M4 12h16M8 6h8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
                <span className="flex flex-col items-start leading-tight">
                    <span className="font-bold text-[var(--tune-text)] text-xl sm:text-2xl tracking-tight">
                        Tune
                    </span>
                    <span className="text-xs font-normal text-[var(--tune-muted)] leading-[1.4]">
                        Record your guitar gear
                    </span>
                </span>
            </Link>
   
            {/* Nav */}
            {user && (
            <nav
                className="flex flex-1 min-w-0 items-center justify-end gap-1 sm:gap-2"
                aria-label="主選單"
            >
                {!isMobile && (
                    <ul className="flex list-none flex-wrap items-center gap-2 p-0 m-0">
                        {navItems.map(({ label, href }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={cn(
                                        "block px-2 py-3 text-base font-medium leading-none text-[var(--tune-text)] whitespace-nowrap",
                                        "hover:text-[var(--tune-primary-dark)]",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tune-primary)] focus-visible:ring-offset-2 rounded"
                                    )}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
                {isMobile && (
                    <NavigationMenu className="flex flex-1 min-w-0 items-center justify-end gap-1">
                        <NavigationMenuList className="flex flex-wrap justify-end gap-1">
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>我的器材</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul>
                                        {navItems.map(({ label, href }) => (
                                            <li key={href}>
                                                <NavigationMenuLink asChild>
                                                    <Link href={href}>{label}</Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                )}
            </nav>
            )}
            {user && (
                <Link
                    href={user ? "#" : "/"}
                    onClick={user ? logout : undefined}
                    className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--tune-bg)] text-[var(--tune-text)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tune-primary)] focus-visible:ring-offset-2"
                    aria-label="個人資料"
                >
                    <LogOutIcon className="size-6" strokeWidth={1.5} />
                </Link>
            )}
        </header>
    );
}
