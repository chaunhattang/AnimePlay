"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import GenreFilter from "@/components/GenreFilter";
import MovieGrid from "@/components/MovieGrid";
import SearchBar from "@/components/SearchBar";
import { filterMovies, SortBy, getGenres } from "@/lib/movie-utils";
import { useAppContext } from "@/components/AppProvider";
import { Film, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

const PAGE_SIZE = 8;

function MoviesContent() {
  const searchParams = useSearchParams();
  const { movies } = useAppContext();

  const query = searchParams.get("q") || "";
  const genre = searchParams.get("genre") || "";
  const sort = (searchParams.get("sort") as SortBy) || "latest";
  const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);

  const filtered = filterMovies(movies, {
    query,
    genre,
    sortBy: sort,
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
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Film className="h-6 w-6 text-brand-500" />
          <h1 className="text-3xl font-bold text-white">Browse Movies</h1>
        </div>
        <p className="text-sm text-gray-400">Search, sort, and filter anime from our catalog.</p>
      </div>

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchBar />
        <GenreFilter genres={genres} />
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <p>
          {filtered.length} movie{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Movie Grid */}
      <MovieGrid movies={pageMovies} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm shadow-card">
          <p className="text-gray-400">
            Page <span className="font-semibold text-white">{safePage}</span> of <span className="font-semibold text-white">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={safePage > 1 ? createPageHref(safePage - 1) : "#"}
              aria-disabled={safePage <= 1}
              className={clsx("inline-flex items-center gap-1 rounded-lg border border-white/15 px-4 py-2 text-sm transition", safePage <= 1 ? "pointer-events-none text-gray-600" : "text-gray-200 hover:border-brand-500/50 hover:bg-brand-600/10 hover:text-brand-400")}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
            <Link
              href={safePage < totalPages ? createPageHref(safePage + 1) : "#"}
              aria-disabled={safePage >= totalPages}
              className={clsx("inline-flex items-center gap-1 rounded-lg border border-white/15 px-4 py-2 text-sm transition", safePage >= totalPages ? "pointer-events-none text-gray-600" : "text-gray-200 hover:border-brand-500/50 hover:bg-brand-600/10 hover:text-brand-400")}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function MoviesSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <div className="h-10 w-64 skeleton-shimmer rounded-xl" />
        <div className="h-4 w-80 skeleton-shimmer rounded-lg" />
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="h-11 skeleton-shimmer rounded-xl" />
        <div className="h-11 w-40 skeleton-shimmer rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="aspect-[2/3] skeleton-shimmer" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 skeleton-shimmer rounded-lg" />
              <div className="h-3 w-1/2 skeleton-shimmer rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<MoviesSkeleton />}>
      <MoviesContent />
    </Suspense>
  );
}
