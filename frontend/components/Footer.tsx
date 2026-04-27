import Link from "next/link";
import { Clapperboard, Github, Heart, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Link href="/" className="group flex items-center gap-2 text-lg font-bold text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-glow transition-transform duration-300 group-hover:scale-110">
                <Clapperboard className="h-4 w-4 text-white" />
              </div>
              <span>AnimePlay Movies</span>
            </Link>
            <p className="text-sm text-gray-500">Trailers, ratings, discovery, and your personal watchlist.</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href="/movies" className="link-underline text-sm text-gray-400 transition hover:text-white">
              Browse
            </Link>
            <Link href="/watchlist" className="link-underline text-sm text-gray-400 transition hover:text-white">
              Watchlist
            </Link>
            <Link href="/profile" className="link-underline text-sm text-gray-400 transition hover:text-white">
              Profile
            </Link>
          </div>

          {/* Social / Copyright */}
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <div className="flex items-center gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-500 transition hover:border-brand-500/30 hover:text-brand-400">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-500 transition hover:border-brand-500/30 hover:text-brand-400">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="flex items-center justify-center gap-1 text-xs text-gray-600">
            © 2026 AnimePlay Movies. Made with
            <Heart className="h-3 w-3 text-brand-500" />
            for anime lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
