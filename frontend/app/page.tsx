"use client";

import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import MovieGrid from "@/components/MovieGrid";
import { useAppContext } from "@/components/AppProvider";

export default function HomePage() {
  const { movies } = useAppContext();

  const featured = movies.find((movie) => movie.badge === "Now Playing") || movies[0];
  const trending = movies.filter((movie) => movie.badge === "Trending").concat(movies.slice(0, 3));
  const topRated = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 4);

  if (!featured) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-sm text-gray-300">
        No movie available.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <HeroSection movie={featured} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Trending Now</h2>
          <Link href="/movies" className="text-sm text-brand-500 hover:text-brand-600">
            View all
          </Link>
        </div>
        <MovieGrid movies={trending.slice(0, 4)} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Top Rated Picks</h2>
        <MovieGrid movies={topRated} />
      </section>
    </div>
  );
}
