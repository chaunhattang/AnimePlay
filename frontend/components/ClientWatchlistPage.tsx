"use client";

import MovieGrid from "@/components/MovieGrid";
import Link from "next/link";
import { useAppContext } from "@/components/AppProvider";

export default function ClientWatchlistPage() {
  const { currentUser, getWatchlistMovies } = useAppContext();
  const savedMovies = getWatchlistMovies();

  if (!currentUser) {
    return (
      <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold">My Watchlist</h1>
        <p className="text-sm text-gray-300">Please login to see and save your watchlist.</p>
        <Link href="/login" className="inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">My Watchlist</h1>
        <p className="text-sm text-gray-400">Movies saved by {currentUser.fullName || currentUser.username}.</p>
      </div>
      <MovieGrid movies={savedMovies} />
    </div>
  );
}
