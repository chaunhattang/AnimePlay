"use client";

import Link from "next/link";
import { useState } from "react";
import { Clapperboard, Heart, Home, Search, ShieldCheck, UserCircle, LogOut, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAppContext } from "@/components/AppProvider";
import { motion, useReducedMotion } from "framer-motion";

const baseLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/movies", label: "Browse", icon: Search },
  { href: "/watchlist", label: "Watchlist", icon: Heart },
];

export default function Header() {
  const pathname = usePathname();
  const { currentUser, isAdmin, logout } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const headerVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  const links = isAdmin ? [...baseLinks, { href: "/admin", label: "Admin", icon: ShieldCheck }] : baseLinks;

  return (
    <motion.header variants={headerVariants} initial={shouldReduceMotion ? "visible" : "hidden"} animate="visible" className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 text-lg font-bold text-white transition">
          {shouldReduceMotion ? (
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-glow transition-transform duration-300 group-hover:scale-110">
              <Clapperboard className="h-4 w-4 text-white" />
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-glow transition-transform duration-300 group-hover:scale-110">
              <Clapperboard className="h-4 w-4 text-white" />
            </motion.div>
          )}
          <span className="hidden sm:inline">AnimePlay Movies</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link key={link.href} href={link.href} className={clsx("relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200", active ? "bg-brand-600 text-white shadow-glow" : "text-gray-400 hover:bg-white/5 hover:text-white")}>
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
                {active && <span className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {currentUser ? (
            <>
              <Link href="/profile" className={clsx("inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200", pathname === "/profile" ? "bg-brand-600 text-white shadow-glow" : "text-gray-400 hover:bg-white/5 hover:text-white")}>
                <UserCircle className="h-4 w-4" />
                <span className="max-w-[100px] truncate">{currentUser.username}</span>
              </Link>
              <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-sm text-gray-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white">
                Login
              </Link>
              <Link href="/register" className="btn-lift rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white md:hidden">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={clsx("overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-lg transition-all duration-300 md:hidden", mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>
        <nav className="flex flex-col gap-1 px-4 py-3">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition", active ? "bg-brand-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white")}>
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          <div className="my-2 border-t border-white/10" />
          {currentUser ? (
            <>
              <Link href="/profile" onClick={() => setMobileOpen(false)} className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition", pathname === "/profile" ? "bg-brand-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white")}>
                <UserCircle className="h-4 w-4" />
                {currentUser.username}
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white">
                Login
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
