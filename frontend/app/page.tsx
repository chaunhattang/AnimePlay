"use client";

import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import MovieGrid from "@/components/MovieGrid";
import { useAppContext } from "@/components/AppProvider";

export default function HomePage() {
  const { movies, loading } = useAppContext();

  const featured = movies[0];
  const latest = [...movies].sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0)).slice(0, 4);
  const classics = [...movies].sort((a, b) => a.title.localeCompare(b.title)).slice(0, 4);

  if (loading) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-sm text-gray-300">
        Loading movie catalog...
      </div>
    );
  }

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
          <h2 className="text-xl font-semibold">Latest Updates</h2>
          <Link href="/movies" className="text-sm text-brand-500 hover:text-brand-600">
            View all
          </Link>
        </div>
        <MovieGrid movies={latest} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">A-Z Collection</h2>
        <MovieGrid movies={classics} />
      </section>
    </div>
  );
}
