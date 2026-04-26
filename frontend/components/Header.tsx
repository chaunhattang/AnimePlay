"use client";

import Link from "next/link";
import { Clapperboard, Heart, Home, Search, ShieldCheck, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAppContext } from "@/components/AppProvider";

const baseLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/movies", label: "Browse", icon: Search },
  { href: "/watchlist", label: "Watchlist", icon: Heart }
];

export default function Header() {
  const pathname = usePathname();
  const { currentUser, isAdmin, logout } = useAppContext();

  const links = isAdmin
    ? [...baseLinks, { href: "/admin", label: "Admin", icon: ShieldCheck }]
    : baseLinks;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Clapperboard className="h-5 w-5 text-brand-500" />
          <span>AnimePlay Movies</span>
        </Link>
        <nav className="flex items-center gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                  active
                    ? "bg-brand-600 text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="ml-3 flex items-center gap-2">
          {currentUser ? (
            <>
              <Link
                href="/profile"
                className={clsx(
                  "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                  pathname === "/profile"
                    ? "bg-brand-600 text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <UserCircle className="h-4 w-4" />
                <span>{currentUser.username}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-white/20 px-3 py-2 text-sm text-gray-200 hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-white/10">
                Login
              </Link>
              <Link href="/register" className="rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
