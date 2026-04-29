"use client";

import MovieGrid from "@/components/MovieGrid";
import Link from "next/link";
import { useAppContext } from "@/components/AppProvider";
import { Heart, LogIn, BookmarkX } from "lucide-react";

export default function ClientWatchlistPage() {
  const { currentUser, getWatchlistMovies } = useAppContext();
  const savedMovies = getWatchlistMovies();

  if (!currentUser) {
    return (
      <div className="animate-fade-in-up mx-auto max-w-lg space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center shadow-card backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600/20">
          <Heart className="h-8 w-8 text-brand-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
        <p className="text-sm text-gray-400">Please sign in to save and manage your favorite anime.</p>
        <Link href="/login" className="btn-lift inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500">
          <LogIn className="h-4 w-4" />
          Sign In
        </Link>
      </div>
    );
  }

  if (savedMovies.length === 0) {
    return (
      <div className="animate-fade-in-up space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
          <p className="text-sm text-gray-400">Movies saved by {currentUser.fullName || currentUser.username}</p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-20 shadow-card">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <BookmarkX className="h-8 w-8 text-gray-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-400">Your watchlist is empty</h2>
          <p className="mt-1 text-sm text-gray-600">Start exploring and save movies you love!</p>
          <Link href="/movies" className="btn-lift mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500">
            Browse Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
        <p className="text-sm text-gray-400">
          {savedMovies.length} movie{savedMovies.length !== 1 ? "s" : ""} saved by {currentUser.fullName || currentUser.username}
        </p>
      </div>
      <MovieGrid movies={savedMovies} />
    </div>
  );
}
