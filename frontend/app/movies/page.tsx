"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import GenreFilter from "@/components/GenreFilter";
import MovieGrid from "@/components/MovieGrid";
import SearchBar from "@/components/SearchBar";
import { filterMovies, SortBy, getGenres } from "@/lib/movie-utils";
import { useAppContext } from "@/components/AppProvider";

const PAGE_SIZE = 8;

function MoviesContent() {
  const searchParams = useSearchParams();
  const { movies } = useAppContext();

  const query = searchParams.get("q") || "";
  const genre = searchParams.get("genre") || "";
  const sort = (searchParams.get("sort") as SortBy) || "popular";
  const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);

  const filtered = filterMovies(movies, {
    query,
    genre,
    sortBy: sort
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageMovies = filtered.slice(start, start + PAGE_SIZE);
  const genres = getGenres(movies);

  const createPageHref = (targetPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(targetPage));
    return `/movies?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Browse Movies</h1>
        <p className="text-sm text-gray-400">Search, sort, and filter by genre to find your next movie.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchBar />
        <GenreFilter genres={genres} />
      </div>

      <MovieGrid movies={pageMovies} />

      <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm">
        <p className="text-gray-300">
          Page {safePage} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Link
            href={safePage > 1 ? createPageHref(safePage - 1) : "#"}
            aria-disabled={safePage <= 1}
            className="rounded-md border border-white/15 px-3 py-1.5 text-gray-100 transition hover:bg-white/10 aria-disabled:pointer-events-none aria-disabled:opacity-40"
          >
            Previous
          </Link>
          <Link
            href={safePage < totalPages ? createPageHref(safePage + 1) : "#"}
            aria-disabled={safePage >= totalPages}
            className="rounded-md border border-white/15 px-3 py-1.5 text-gray-100 transition hover:bg-white/10 aria-disabled:pointer-events-none aria-disabled:opacity-40"
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-sm text-gray-300">Loading movies...</div>
      }
    >
      <MoviesContent />
    </Suspense>
  );
}
